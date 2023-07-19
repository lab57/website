import React from "react";
import dynamic from 'next/dynamic'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})



const G = 9
const k = 1

class particle {
    constructor(id, x, y, vx0, vy0) {
        this.x = x
        this.y = y
        this.m = 1
        this.vx = vx0
        this.vy = vy0
        this.id = id
        this.next = null
    }

    getForce(p2) {
        return G * this.m * p2.m / this.getDistanceSquared(p2)
    }

    getDistanceSquared(p2) {
        return (p2.x - this.x) ** 2 + (p2.y - this.y) ** 2
    }

    applyWallForce(p5) {
        //handle x
        let d = 40
        let k = 1e3
        this.vx += k / (this.x) ** 2
        this.vx -= k / (p5.windowWidth - this.x) ** 2
        this.vy += k / (this.y) ** 2
        this.vy -= k / (p5.windowHeight - this.y) ** 2

    }
    applyVelocities() {

        if (this.vx > 1) {
            this.vx -= 2

        }
        if (this.vx < 1) {
            this.vx += 2
            console.log("aa")

        }

        if (this.vy > 1) {
            this.vy -= 2

        }
        if (this.vy < 1) {
            this.vy += 2

        }


        this.x += this.vx
        this.y += this.vy
    }
    apply(p5) {

        this.vx = this.next[2]
        this.vy = this.next[3]
        this.applyWallForce(p5)
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
        for (let i = 0; i < 15; i++) {
            this.particles.push(new particle(i, Math.random() * p5.windowWidth, Math.random() * p5.windowHeight,
                (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3))
        }


    }

    draw = (p5) => {

        this.takeStep(p5)

        p5.clear()
        for (particle of this.particles) {
            p5.ellipse(particle.x, particle.y, 15, 15);
            p5.text(particle.vy, particle.x, particle.y)
        }
        p5.noStroke()

        // NOTE: Do not use setState in the draw function or in functions that are executed
        // in the draw function...
        // please use normal variables or class properties for these purposes
    };

    takeStep = (p5) => {
        console.log("loop")
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

            p.apply(p5)
        }




    }


    render() {

        return <Sketch setup={this.setup} draw={this.draw} />;

    }

}

export default myComp
