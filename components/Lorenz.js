import React from "react";
import dynamic from 'next/dynamic'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})




const deltat = .001
const maxTailLength = 1000;
const sigma = 10, rho = 28, beta = 8 / 3;//8 / 3;
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



class myComp extends React.Component {
    p1;
    p2;
    p3;
    particles;
    tstep;
    constructor(props) {
        super(props)
        this.tstep = 0;
        this.pg;

    }


    coordinateShift = (p5, x, y, z) => {
        let w = p5.windowWidth
        let h = p5.windowHeight
        return [(35 * x + w / 2), (h / 2 - 15 * y), z]

    }

    setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        this.pg = p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef)
        //this.p1 = new particle(1, 1, 1)
        //this.p2 = new particle(1, p5.windowWidth - 1, p5.windowHeight - 1)
        //this.p3 = new particle(1, 5, p5.windowHeight - 1)

        this.particles = []
        for (let i = 0; i < 25; i++) {
            this.particles.push(new particle(i, (Math.random() - .5) * 2 * 10, (Math.random() - .5) * 2 * 10, (Math.random() - .5) * 2 * 10,
                (Math.random() - .5) * 2 * 5, (Math.random() - .5) * 2 * 5, (Math.random() - .5) * 2 * 5))
        }

        //this.particles.push(new particle(0, ...coordinateShift(-w / 3, -0), vx, vy))
        //this.particles.push(new particle(0, ...coordinateShift(0, 0), -2 * vx, -2 * vy))



    }

    draw = (p5) => {



        this.takeStep(p5)
        p5.clear()


        for (particle of this.particles) {
            let transform = this.coordinateShift(p5, particle.current.x, particle.current.y, particle.current.z)
            p5.ellipse(transform[0], transform[1], 10, 10);
            //p5.text(particle.id, transform[0], transform[1])
            let s = 10
            let step = s / 25

            for (let t of particle.tail) {
                let tr = this.coordinateShift(p5, t.x, t.y, t.z)
                if (s > 1) {
                    s = s - step

                }
                p5.ellipse(tr[0], tr[1], s, s)
            }
        }
        p5.noStroke()

        let t2 = this.coordinateShift(p5, 8.48, 8.48, 0)
        let t3 = this.coordinateShift(p5, -8.48, -8.48, 0)
        //p5.ellipse(t2[0], t2[1], 15, 15);
        //p5.ellipse(t3[0], t3[1], 15, 15);

        // NOTE: Do not use setState in the draw function or in functions that are executed
        // in the draw function...
        // please use normal variables or class properties for these purposes
    };

    takeStep = (p5) => {


        this.particles.map((x) => {
            //console.log(x.current.x, x.current.y)
            x.rk4Step(sigma, rho, beta, deltat);
            x.applyState();
        })
    }


    render() {

        return <Sketch setup={this.setup} draw={this.draw} />;

    }

}

export default myComp
