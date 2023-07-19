import React from "react";
import dynamic from 'next/dynamic'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})



const G = 1
const k = 1

class particle {
    constructor(id, x, y, v0x, v0y) {
        this.x = x
        this.y = y
        this.m = 1
        this.vx = v0x
        this.vy = v0y
        this.id = id
        this.r = 15 ** 2
        this.next = null
    }

    getForce(p2) {
        let d = this.getDistanceSquared(p2)
        return 4 * (6) * ((this.r / d) ** 6 - (this.r / d) ** 3)
    }

    getDistanceSquared(p2) {
        return (p2.x - this.x) ** 2 + (p2.y - this.y) ** 2
    }

    applyWallForce(p5) {
        //handle x
        this.vx += 10 * (1 / (this.x) ** 2 - 1 / (p5.windowWidth - this.x) ** 2)
        this.vy += 10 * (1 / (this.y) ** 2 - 1 / (p5.windowHeight - this.y) ** 2)

    }
    applyVelocities() {
        this.x += this.vx
        this.y += this.vy
    }
    apply() {
        this.vx = this.next[2]
        this.vy = this.next[3]
        this.x = this.next[0]
        this.y = this.next[1]
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
        for (let i = 0; i < 35; i++) {
            this.particles.push(new particle(i, Math.random() * p5.windowWidth, Math.random() * p5.windowHeight,
                (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3))
        }


    }

    draw = (p5) => {

        this.takeStep(p5)
        let c = p5.color(255, 255, 255, 150)
        p5.fill(c)
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
            let Fx = 0
            let Fy = 0
            for (let p_2 of this.particles) {
                if (p != p_2) {

                    let xdif = p_2.x - p.x
                    let ydif = p_2.y - p.y
                    let F = p.getForce(p_2)

                    let theta = Math.atan2(ydif, xdif)
                    Fx += F * Math.cos(theta) / p.m
                    Fy += F * Math.sin(theta) / p.m


                }
            }

            let ax = Fx / p.m
            let ay = Fy / p.m


            let newvx = p.vx + ax
            let newvy = p.vy + ay

            let newx = p.x + newvx
            let newy = p.y + newvy

            p.next = [newx, newy, newvx, newvy]


        }
        for (let p of this.particles) {
            p.applyWallForce(p5)
            p.apply()
        }

    }



    render() {

        return <Sketch setup={this.setup} draw={this.draw} />;

    }

}

export default myComp
