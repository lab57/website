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
        let drag = 0
        this.id = id
        this.particles = particles
    }

    update(dt) {
        this.newpos = {
            x: this.pos.x + this.vel.x * dt + this.acc.x * dt * dt * 0.5,
            y: this.pos.y + this.vel.y * dt + this.acc.y * dt * dt * 0.5
        }
        this.newacc = this.apply_forces()
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

    apply_forces() {
        let state = { x: 0, y: 0 }
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


class myComp extends React.Component {
    particles;
    tstep;
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

        for (let i = 0; i < 2; i++) {
            this.particles.push(new particle(i, this.particles, 5, Math.random() * p5.windowWidth, Math.random() * p5.windowHeight,
                5 * (Math.random() - 0.5), 5 * (Math.random() - 0.5)))
        }

        this.particles.push(new particle(-1, this.particles, 90, center.x, center.y,
            0, 0))

        this.particles.push(new particle(-1, this.particles, 90, center.x - 200, center.y - 400,
            2, 0))


    }

    draw = (p5) => {

        this.takeStep(p5)
        p5.clear()
        for (particle of this.particles) {
            p5.ellipse(particle.pos.x, particle.pos.y, 15 * Math.sqrt(particle.mass), 15 * Math.sqrt(particle.mass));
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
            p.update(.5)
        }
        this.particles.map((x) => x.apply())

    }


    render() {

        return <Sketch setup={this.setup} draw={this.draw} />;

    }

}

export default myComp
