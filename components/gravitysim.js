import React from "react";
import dynamic from 'next/dynamic'
import { setQuaternionFromProperEuler } from "three/src/math/MathUtils";

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



export default function myComp(props) {
    let p1;
    let p2;
    let particles = [p1, p2]
    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        p1 = new particle(0, 0)
        p2 = new particle(p5.windowWidth, p5.windowHeight)
    }


    const takeStep = () => {
        for (p of particles) {
            let fx_sum = 0
            let fy_sum = 0
            for (p2 of particles) {
                if (p1 == p2) {

                }
            }
        }
    }


    const draw = (p5) => {

        takeStep()





        p5.clear()
        p5.ellipse(p1.x, p1.y, 15, 15);
        p5.ellipse(p2.x, p2.y, 15, 15);
        p5.noStroke()
        // NOTE: Do not use setState in the draw function or in functions that are executed
        // in the draw function...
        // please use normal variables or class properties for these purposes
    };

    return <Sketch setup={setup} draw={draw} />;
};
