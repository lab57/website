import React from "react";
import dynamic from 'next/dynamic'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})




const deltat = .001
const maxTailLength = 1000;
let sigma = 10, rho = 28, beta = 8 / 3;//8 / 3;
let coordinateShift = (p5, x, y, z) => {
    let w = p5.windowWidth
    let h = p5.windowHeight
    return [(35 * x + w / 2), (h / 2 - 15 * y), z]

}

let inverseShift = (p5, x, y) => {
    let w = p5.windowWidth
    let h = p5.windowHeight
    return [(x - w / 2) / 35, (+h / 2 - y) / 15, 0]

}
class particle {
    constructor(id, x0, y0, z0, vx0, vy0, vz0) {
        this.m = 1;
        this.id = id;
        this.prev = { x: x0, y: y0, z: z0 };
        this.current = { x: x0 + vx0 * deltat, y: y0 + vy0 * deltat, z: z0 + vz0 * deltat };
        this.next = null;
        console.log(this.current)
        this.tail = []
    }

    applyState() {
        this.tail.unshift(this.prev)
        if (this.tail.length > maxTailLength) {
            this.tail.pop()
        }
        this.prev = this.current;
        this.current = this.next;
        this.next = null;
    }

    getDistanceSquared(p2) {
        return (p2.current.x - this.current.x) ** 2 + (p2.current.y - this.current.y) ** 2 + (p2.current.z - this.current.z0) ** 2;
    }

    // Lorenz system equations
    lorenzEquations(p, sigma, rho, beta) {
        //console.log(p)
        return {
            dx: sigma * (p.current.y - p.current.x),
            dy: p.current.x * (rho - p.current.z) - p.current.y,
            dz: p.current.x * p.current.y - beta * p.current.z
        };
    }

    // RK4 solver step
    rk4Step(sigma, rho, beta, dt) {
        const k1 = this.lorenzEquations(this, sigma, rho, beta);
        const p1 = { current: { x: this.current.x + k1.dx * dt / 2, y: this.current.y + k1.dy * dt / 2, z: this.current.z + k1.dz * dt / 2 } };

        const k2 = this.lorenzEquations(p1, sigma, rho, beta);
        const p2 = { current: { x: this.current.x + k2.dx * dt / 2, y: this.current.y + k2.dy * dt / 2, z: this.current.z + k2.dz * dt / 2 } };

        const k3 = this.lorenzEquations(p2, sigma, rho, beta);
        const p3 = { current: { x: this.current.x + k3.dx * dt, y: this.current.y + k3.dy * dt, z: this.current.z + k3.dz * dt } };
        const k4 = this.lorenzEquations(p3, sigma, rho, beta);

        this.next = {
            x: this.current.x + (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx),
            y: this.current.y + (dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy),
            z: this.current.z + (dt / 6) * (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz)
        };
        //console.log(this.next)
    }
}

class Lorenz extends React.Component {
    p1;
    p2;
    p3;
    particles;
    preDrawn;
    tstep;
    pg;
    pCount = 0;
    constructor() {
        console.log("aaa")
        super()
        this.renderRef = React.createRef()
        this.preDrawn = []
        this.state = {
            x: 100,
            y: 100
        }
    }

    takeStep = (p5) => {

        this.particles.map((x) => {
            //console.log(x.current.x, x.current.y)
            x.rk4Step(sigma, rho, beta, deltat);
            x.applyState();
        })
    }
    componentDidMount() {
        const p5 = require("p5")
        this.sketch = new p5(p => {
            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight)
                    .parent(this.renderRef.current);
                this.particles = [];

                let topRight = coordinateShift(p5, p5.width / 2, p5.height / 2, 0)
                let minR = 15//Math.sqrt(topRight[0] ** 2 + topRight[1] ** 2)

                for (let i = 0; i < 25; i++) {
                    // this.particles.push(new particle(i, (Math.random() - .5) * 2 * 10, (Math.random() - .5) * 2 * 10, (Math.random() - .5) * 2 * 10,
                    //     (Math.random() - .5) * 2 * 5, (Math.random() - .5) * 2 * 5, (Math.random() - .5) * 2 * 5))
                    let theta = Math.random() * Math.PI * 2
                    //let p = new particle(i, 0, 0, Math.random() * 30, 0, 0, 0)
                    let part = new particle(i, minR * Math.cos(theta), minR * Math.sin(theta), Math.random() * 30,
                        50, 50, 0)
                    //0, 0, 0)
                    this.particles.push(part)
                }
                this.pg = p.createGraphics(p.windowWidth, p.windowHeight);
                this.pg.noStroke();
                p.frameRate(45)
                p.fill(p.color("#C3C3E6"))
                //p.tint(255, 50)


            }

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight)
                let n = p.createGraphics(p.windowWidth, p.windowHeight);
                n.image(this.pg, 0, 0, n.width, n.height)
                n.noStroke();
                this.pg = n
            }

            p.mouseClicked = () => {
                console.log("click!")
                let t = inverseShift(p, p.mouseX, p.mouseY)
                let part = new particle(0, t[0] + Math.random() * .2, t[1] + Math.random() * .2, 0, 0, 0, 0);
                this.particles.push(part)
            }

            p.keyTyped = () => {
                if (p.key == "x") {
                    this.particles.shift()
                }
            }

            p.draw = () => {
                this.takeStep(p)
                p.clear()
                p.smooth()
                let minR = 15//Math.sqrt(topRight[0] ** 2 + topRight[1] ** 2)

                if (this.preDrawn.length != 0) {
                    this.particles.push(this.preDrawn.pop())
                }

                for (let part of this.particles) {
                    let transform = coordinateShift(p, part.current.x, part.current.y, part.current.z)
                    p.ellipse(transform[0], transform[1], 10, 10);
                    //p5.text(part.id, transform[0], transform[1])
                    let s = 10
                    let step = s / 25

                    for (let t of part.tail) {
                        let tr = coordinateShift(p, t.x, t.y, t.z)
                        if (s > 1) {
                            s = s - step

                        }
                        else {
                            //this.pg.ellipse(tr[0], tr[1], s, s)
                        }
                        p.ellipse(tr[0], tr[1], s, s)

                    }
                }
                p.image(this.pg, 0, 0)
                p.noStroke()


            }


        })
    }
    render() {
        return (
            <div ref={this.renderRef}></div>
        );
    }

}

export default Lorenz
