import React from "react";
import dynamic from 'next/dynamic'

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})


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
        return this.m * p2.m / this.getDistanceSquared(p2)
    }

    getDistanceSquared(p2) {
        return Math.sqrt((p2.x - this.x) ** 2 + (p2.y - this.y) ** 2)
    }
}


class myComp extends React.Component {
    p1;
    p2;
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
        this.p1 = new particle(0, 0, 0)
        this.p2 = new particle(1, p5.windowWidth, p5.windowHeight)
        this.particles = [this.p1, this.p2]
    }

    draw = (p5) => {

        this.takeStep()

        p5.clear()
        p5.ellipse(this.p1.x + p5.windowWidth / 2, this.p1.y + p5.windowHeight / 2, 15, 15);
        //p5.ellipse(p5.windowWidth / 2, p5.windowHeight / 2, 15, 15);
        p5.ellipse(this.p2.x, this.p2.y, 15, 15);
        p5.noStroke()

        // NOTE: Do not use setState in the draw function or in functions that are executed
        // in the draw function...
        // please use normal variables or class properties for these purposes
    };

    takeStep = () => {
        for (let p of this.particles) {
            for (let p_2 of this.particles) {
                if (p != p_2) {
                    let xdif = p_2.x - p.x
                    let ydif = p_2.y - p.y
                    let fx = 1 * 10 ** 4 / xdif ** 2
                    let fy = 1 * 10 ** 4 / ydif ** 2
                    p.vx += fx * Math.sign(xdif)
                    p.vy += fy * Math.sign(ydif)
                    p.x += p.vx
                    p.y += p.vy
                }
            }
        }


    }


    render() {

        return <Sketch setup={this.setup} draw={this.draw} />;

    }

}

export default myComp
