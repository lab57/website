import React from "react";
import dynamic from 'next/dynamic'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})



const G = 90
const k = 1
const deltat = 5
class particle {
    constructor(id, x0, y0, vx0, vy0) {
        this.m = 1
        this.id = id
        this.prev = {
            x: x0, y: y0
        }
        this.current = {
            x: x0 + vx0 * deltat,
            y: y0 + vy0 * deltat
        }
        this.next = null
    }
    applyState() {
        this.prev = this.current
        this.current = this.next
        this.next = null
    }

    getForce(p2) {

        return G * this.m * p2.m / this.getDistanceSquared(p2)
    }

    getDistanceSquared(p2) {
        return (p2.current.x - this.current.x) ** 2 +
            (p2.current.y - this.current.y) ** 2
    }

    A(particles) {
        let ax = 0
        let ay = 0
        for (let p2 of particles) {
            if (p2 != this) {
                let xdif = p2.current.x - this.current.x
                let ydif = p2.current.y - this.current.y
                let F = this.getForce(p2)
                console.log("f")
                console.log(F)
                let theta = Math.atan2(ydif, xdif)
                ax += F * Math.cos(theta) / this.m
                ay += F * Math.sin(theta) / this.m

            }
        }

        return { x: ax, y: ay }
    }


}



class myComp extends React.Component {
    p1;
    p2;
    p3;
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
        this.p1 = new particle(1, 1, 1)
        this.p2 = new particle(1, p5.windowWidth - 1, p5.windowHeight - 1)
        this.p3 = new particle(1, 5, p5.windowHeight - 1)

        this.particles = []
        for (let i = 0; i < 8; i++) {
            this.particles.push(new particle(i, Math.random() * p5.windowWidth, Math.random() * p5.windowHeight,
                0, 0))
        }


    }

    draw = (p5) => {

        this.takeStep(p5)
        p5.clear()
        for (particle of this.particles) {
            p5.ellipse(particle.current.x, particle.current.y, 15, 15);
            p5.text(particle.id, particle.x, particle.y)
        }
        p5.noStroke()

        // NOTE: Do not use setState in the draw function or in functions that are executed
        // in the draw function...
        // please use normal variables or class properties for these purposes
    };

    takeStep = (p5) => {
        console.log("loop")
        for (let p of this.particles) {
            let A = p.A(this.particles)
            console.log(A)
            let state = {
                x: 2 * p.current.x - p.prev.x + A.x * deltat ** 2,
                y: 2 * p.current.y - p.prev.y + A.y * deltat ** 2
            }
            p.next = state


        }
        this.particles.map((x) => x.applyState())
    }


    render() {

        return <Sketch setup={this.setup} draw={this.draw} />;

    }

}

export default myComp
