import React from "react";
import dynamic from 'next/dynamic'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})



const G = 1
const k = 1

class particle {
    constructor(id, x, y) {
        this.x = x
        this.y = y
        this.m = 1
        this.vx = 0
        this.vy = 0
        this.id = id
    }

    getForce(p2) {
        return G * this.m * p2.m / this.getDistanceSquared(p2)
    }

    getDistanceSquared(p2) {
        return Math.sqrt((p2.x - this.x) ** 2 + (p2.y - this.y) ** 2)
    }

    applyWallForce(p5) {
        //handle x

    }
    applyVelocities() {
        this.x += this.vx
        this.y += this.vy
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
        for (let i = 0; i < 5; i++) {
            this.particles.push(new particle(i, Math.random() * p5.windowWidth, Math.random() * p5.windowHeight))
        }


    }

    draw = (p5) => {

        this.takeStep(p5)

        p5.clear()
        for (particle of this.particles) {
            p5.ellipse(particle.x, particle.y, 15, 15);
        }
        p5.noStroke()

        // NOTE: Do not use setState in the draw function or in functions that are executed
        // in the draw function...
        // please use normal variables or class properties for these purposes
    };

    takeStep = (p5) => {
        for (let p of this.particles) {
            for (let p_2 of this.particles) {
                if (p != p_2) {
                    let xdif = p_2.x - p.x
                    let ydif = p_2.y - p.y
                    let F = p.getForce(p_2)
                    let theta = Math.atan2(ydif, xdif)
                    p.vx += F * Math.cos(theta)
                    p.vy += F * Math.sin(theta)
                    p.applyWallForce(p5)
                    p.applyVelocities()

                }
            }
        }


    }


    render() {

        return <Sketch setup={this.setup} draw={this.draw} />;

    }

}

export default myComp
