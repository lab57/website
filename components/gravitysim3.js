import React from "react";
import dynamic from 'next/dynamic'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})



const G = 20
const k = 1
const deltat = 5
class particle {
    constructor(id, particles, mass, x0, y0, vx0, vy0) {
        this.pos = { x: x0, y: y0 }
        this.vel = { x: vx0, y: vy0 }
        this.acc = { x: 0, y: 0 }
        this.mass = mass
        this.radius = Math.cbrt(this.mass)
        let drag = 0
        this.id = id
        this.particles = particles
    }

    update(dt, p5) {
        this.newpos = {
            x: this.pos.x + this.vel.x * dt + this.acc.x * dt * dt * 0.5,
            y: this.pos.y + this.vel.y * dt + this.acc.y * dt * dt * 0.5
        }
        this.newacc = this.apply_forces(p5)
        this.new_vel = {
            x: this.vel.x + (this.acc.x + this.newacc.x) * dt * 0.5,
            y: this.vel.y + (this.acc.y + this.newacc.y) * dt * 0.5
        }
    }

    apply() {
        this.pos = this.newpos
        this.acc = this.newacc
        this.vel = this.new_vel
    }

    apply_forces(p5) {
        let state = { x: 0, y: 0 }
        if (this.id == -1) {
            return state
        }
        for (let p2 of this.particles) {
            if (p2 != this) {

                let xdif = p2.pos.x - this.pos.x
                let ydif = p2.pos.y - this.pos.y
                let F = this.getForce(p2)
                let theta = Math.atan2(ydif, xdif)
                state.x += F * Math.cos(theta) / this.mass
                state.y += F * Math.sin(theta) / this.mass
            }
        }


        return state
    }



    getForce(p2) {
        let sigma = 10
        let epsilon = 200
        let r = p2.getDistanceSquared(this)
        return 4 * epsilon * (- 1 * (sigma / r) ** 2 + (sigma / r))
        return G * this.mass * p2.mass / this.getDistanceSquared(p2)
    }

    getDistanceSquared(p2) {

        return Math.max([(p2.pos.x - this.pos.x) ** 2 +
            (p2.pos.y - this.pos.y) ** 2], Math.sqrt(p2.mass), Math.sqrt(this.mass))
    }

}



function getCOM(particles) {
    let x = 0
    let y = 0
    for (let p of particles) {
        x += p.pos.x
        y += p.pos.y
    }
    return { x: x / particles.length, y: y / particles.length }
}



function generateParticle(center) {

    let pos = { x: 0, y: 0 }
    let vel = { x: 0, y: 0 }
    let radiusCenter = 200
    let radiusBandWidth = 100

    let R = 2 * (Math.random() - .5) * radiusBandWidth + radiusCenter
    let circum = 2 * Math.PI * R
    let startingPt = Math.random() * circum



}


function combineParticles(particles) {
    let remaining_particles = []
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j]
            if (p ** 2 + p2 ** 2 < p.radius ** 2) {
                let new_p = new particle(p.id, remaining_particles, p.mass + p2.mass, p.pos.x, p.pos.y, p.vel.x + p2.vel.x, p.vel.y + p2.vel.y)
                remaining_particles += new_p
            }
            else {
                remaining_particles += p
                remaining_particles += p2
            }
        }
    }
    return remaining_particles
}



class myComp extends React.Component {
    particles;
    tstep;
    center_p;
    constructor(props) {
        super(props)
        this.tstep = 0;

    }
    setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        this.particles = []
        let center = { x: p5.windowWidth / 2, y: p5.windowHeight / 2 }

        for (let i = 0; i < 15; i++) {
            this.particles.push(new particle(i, this.particles, 5, Math.random() * p5.windowWidth, Math.random() * p5.windowHeight,
                5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5)))
        }
        this.particles.push(new particle(-1, this.particles, 500, center.x, center.y, 0, 0))
        //this.particles.push(new particle(-1, this.particles, 90, center.x - 200, center.y - 400,
        //   2, 0))


    }

    draw = (p5) => {

        this.takeStep(p5)
        p5.clear()
        console.log(this.particles)
        for (particle of this.particles) {
            p5.ellipse(particle.pos.x, particle.pos.y, 15 * Math.cbrt(particle.mass), 15 * Math.cbrt(particle.mass));
            //p5.text(particle.id, particle.x, particle.y)

        }



        let com = getCOM(this.particles)

        //p5.ellipse(com.x, com.y, 15 * Math.sqrt(particle.mass), 15 * Math.sqrt(particle.mass));
        p5.noStroke()


        // NOTE: Do not use setState in the draw function or in functions that are executed
        // in the draw function...
        // please use normal variables or class properties for these purposes
    };

    takeStep = (p5) => {
        for (let p of this.particles) {
            p.update(.5, p5)

        }
        let new_plist = combineParticles(this.particles)
        this.particles = new_plist
        console.log(this.particles)
        this.particles.map((x) => x.particles = new_plist)
        this.particles.map((x) => x.apply())

    }


    render() {

        return <Sketch setup={this.setup} draw={this.draw} />;

    }

}

export default myComp
