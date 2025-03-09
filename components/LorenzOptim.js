import React from "react";
import dynamic from 'next/dynamic'
// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
})

let deltat = .0007
const maxTailLength = 500;
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
        return {
            dx: sigma * (p.current.y - p.current.x),
            dy: p.current.x * (rho - p.current.z) - p.current.y,
            dz: p.current.x * p.current.y - beta * p.current.z
        };
    }

    // Modified Lorenz system equations
    modLorenzEquations(pe, sigma, rho, beta) {
        let a = 10
        let b = 8 / 3
        let c = 8
        let p = pe.current.x
        let q = pe.current.y
        let z = pe.current.z
        return {
            dx: (1 / 3) * (-(a + 1) * p + (a - c + z) * q) +
                ((1 - a) * (p ** 2 - q ** 2) +
                    2 * (a + c - z) * p * q) * 1 / (3 * Math.sqrt(p ** 2 + q ** 2)),
            dy: (1 / 3) * ((c - a - z) * p - (a + 1) * q) +
                (2 * (a - 1) * p * q + (a + c - z) * (p ** 2 - q ** 2)) * 1 / (3 * Math.sqrt(p ** 2 + q ** 2)),
            dz: (1 / 2) * (3 * p ** 2 * q - q ** 3) - b * z
        };
    }

    rossler(p, sigma, rho, beta) {
        let x = p.current.x
        let y = p.current.y
        let z = p.current.z
        let a = 0.2
        let b = 0.2
        let c = 5.7
        return {
            dx: -y - z,
            dy: x + a * y,
            dz: b + z * (x - c)
        };
    }

    rk4Step(sigma, rho, beta, dt) {
        let f = this.rossler
        f = this.lorenzEquations

        const k1 = f(this, sigma, rho, beta);
        const p1 = { current: { x: this.current.x + k1.dx * dt / 2, y: this.current.y + k1.dy * dt / 2, z: this.current.z + k1.dz * dt / 2 } };

        const k2 = f(p1, sigma, rho, beta);
        const p2 = { current: { x: this.current.x + k2.dx * dt / 2, y: this.current.y + k2.dy * dt / 2, z: this.current.z + k2.dz * dt / 2 } };

        const k3 = f(p2, sigma, rho, beta);
        const p3 = { current: { x: this.current.x + k3.dx * dt, y: this.current.y + k3.dy * dt, z: this.current.z + k3.dz * dt } };
        const k4 = f(p3, sigma, rho, beta);

        this.next = {
            x: this.current.x + (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx),
            y: this.current.y + (dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy),
            z: this.current.z + (dt / 6) * (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz)
        };
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
        this.currentRadius = 5  // Starting radius
        this.targetRadius = 5 // Target radius
        this.currentOpacity = 255  // p5.js uses 0-255 for opacity
        this.targetOpacity = 255

        this.currentTimeMultiplier = 1
    }

    takeStep = (p5) => {
        this.particles.map((x) => {
            x.rk4Step(sigma, rho, beta, deltat * this.currentTimeMultiplier);
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

                for (let i = 0; i < 25; i++) {
                    let minR = 15 * (.2 + Math.random())
                    let theta = Math.random() * Math.PI * 2
                    let part = new particle(i, minR * Math.cos(theta), minR * Math.sin(theta), Math.random() * 30,
                        50, 50, 0)
                    this.particles.push(part)
                }
                this.pg = p.createGraphics(p.windowWidth, p.windowHeight);
                this.pg.noStroke();
                p.frameRate(60)
                p.fill(p.color("#C3C3E6"))
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
                // this.particles.push(part) //disabled for now
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

                // Update radius for main particles only
                let diffRadius = (this.props.showEllipses ? 10 : 1) - this.currentRadius;
                if (Math.abs(diffRadius) > 0.1) {
                    this.currentRadius += diffRadius * 0.02;
                }

                // Update opacity
                let targetOpacity = this.props.showEllipses ? 255 : 30;
                let diffOpacity = targetOpacity - this.currentOpacity;
                if (Math.abs(diffOpacity) > 0.1) {
                    this.currentOpacity += diffOpacity * 0.02;
                }

                // Update time
                let targetTimeMultiplier = this.props.showEllipses ? 1 : 1 / 2;
                let diffTime = targetTimeMultiplier - this.currentTimeMultiplier;
                if (Math.abs(diffTime) > 0.01) {
                    this.currentTimeMultiplier += diffTime * 0.02;
                }

                // Get tail density from props or use default (1/10)
                const tailDensity = this.props.tailDensity || 0.1;

                // For each particle
                for (let part of this.particles) {
                    let transform = coordinateShift(p, part.current.x, part.current.y, part.current.z)

                    // Main particle head
                    p.fill(195, 195, 230, this.currentOpacity);
                    p.ellipse(transform[0], transform[1], this.currentRadius, this.currentRadius);

                    // Draw the comet-like tail with curved splines
                    if (part.tail.length > 0) {
                        // Define parameters
                        const smallSize = 1; // The minimum size for the tail after the comet head
                        const cometHeadLength = 25; // Fixed number of points for comet head effect

                        // Build arrays of points
                        const allPoints = [part.current, ...part.tail];

                        // STEP 1: Draw the comet head with FULL DETAIL and curves
                        const headPoints = allPoints.slice(0, Math.min(cometHeadLength + 1, allPoints.length));

                        if (headPoints.length > 3) { // Need at least 4 points for a proper curve
                            let s = this.currentRadius; // Start from current radius
                            const step = (s - smallSize) / cometHeadLength; // Step size for decrease

                            // We'll split the curve into small segments (every 2-3 points) to vary stroke weight
                            // while maintaining curve smoothness
                            const segmentSize = 3; // Number of points per curve segment

                            for (let i = 0; i < headPoints.length - segmentSize; i += segmentSize - 2) {
                                // Get a small subset of points for this curve segment
                                const segmentPoints = headPoints.slice(i, i + segmentSize);
                                if (segmentPoints.length < 3) continue;

                                // Calculate size for this segment - based on position in the head
                                const currentSize = Math.max(smallSize, s - step * i);

                                // Draw this curve segment
                                p.stroke(195, 195, 230, this.currentOpacity);
                                p.strokeWeight(currentSize);
                                p.noFill();

                                p.beginShape();

                                // Add first point twice (as control point and actual point)
                                const firstPt = coordinateShift(p, segmentPoints[0].x, segmentPoints[0].y, segmentPoints[0].z);
                                p.curveVertex(firstPt[0], firstPt[1]);
                                p.curveVertex(firstPt[0], firstPt[1]);

                                // Add middle points
                                for (let j = 1; j < segmentPoints.length - 1; j++) {
                                    const pt = coordinateShift(p, segmentPoints[j].x, segmentPoints[j].y, segmentPoints[j].z);
                                    p.curveVertex(pt[0], pt[1]);
                                }

                                // Add last point twice (as actual point and control point)
                                const lastPt = coordinateShift(p, segmentPoints[segmentPoints.length - 1].x,
                                    segmentPoints[segmentPoints.length - 1].y,
                                    segmentPoints[segmentPoints.length - 1].z);
                                p.curveVertex(lastPt[0], lastPt[1]);
                                p.curveVertex(lastPt[0], lastPt[1]);

                                p.endShape();
                            }
                        }

                        // STEP 2: Draw the remaining tail with SAMPLING and curves
                        if (allPoints.length > cometHeadLength + 1) {
                            // Sample points for the long tail part only
                            const tailPoints = [];

                            // Add the last point from the head for continuity
                            if (headPoints.length > 0) {
                                tailPoints.push(headPoints[headPoints.length - 1]);
                            }

                            // Sample remaining points using a dynamic tailDensity
                            // When the tail is just forming, use more points for smoothness
                            // As it approaches full length, transition to the target density
                            const remainingPoints = allPoints.slice(cometHeadLength + 1);

                            // Calculate a dynamic density based on tail length
                            // At the beginning, use nearly all points (high density)
                            // As the tail reaches max length, transition to the target density
                            const growthFactor = Math.min(1, remainingPoints.length / (maxTailLength * 0.7));
                            const dynamicDensity = tailDensity + (1 - tailDensity) * (1 - growthFactor);

                            // Calculate how many points to draw with the dynamic density
                            const pointsToDraw = Math.max(3, Math.floor(remainingPoints.length * dynamicDensity));

                            // If we have very few points initially, just use all of them
                            const step = remainingPoints.length <= 10 ? 1 :
                                Math.max(1, Math.floor(remainingPoints.length / pointsToDraw));

                            // Get points with interpolation during initial growth
                            if (remainingPoints.length < 10) {
                                // For very short tails, just use all points
                                for (let i = 0; i < remainingPoints.length; i++) {
                                    tailPoints.push(remainingPoints[i]);
                                }
                            } else {
                                // For longer tails, use sampling with the dynamic density
                                for (let i = 0; i < remainingPoints.length; i += step) {
                                    if (tailPoints.length < pointsToDraw + 1) { // +1 for the head connection point
                                        tailPoints.push(remainingPoints[i]);
                                    }
                                }
                            }

                            // Draw curved tail if we have enough points
                            if (tailPoints.length > 3) {
                                p.stroke(195, 195, 230, this.currentOpacity * 0.7);
                                p.strokeWeight(smallSize);
                                p.noFill();

                                p.beginShape();

                                // Add first point twice (as control point and actual point)
                                const firstPt = coordinateShift(p, tailPoints[0].x, tailPoints[0].y, tailPoints[0].z);
                                p.curveVertex(firstPt[0], firstPt[1]);
                                p.curveVertex(firstPt[0], firstPt[1]);

                                // Add all intermediate points with fading opacity
                                for (let i = 1; i < tailPoints.length - 1; i++) {
                                    const pt = coordinateShift(p, tailPoints[i].x, tailPoints[i].y, tailPoints[i].z);
                                    p.curveVertex(pt[0], pt[1]);

                                    // Also draw small markers at sampled points if debugging
                                    if (this.props.showSampledPoints) {
                                        p.push();
                                        p.fill(255, 255, 255, this.currentOpacity * 0.5);
                                        p.noStroke();
                                        p.ellipse(pt[0], pt[1], 2, 2);
                                        p.pop();
                                    }
                                }

                                // Add last point twice (as actual point and control point)
                                const lastPt = coordinateShift(p, tailPoints[tailPoints.length - 1].x,
                                    tailPoints[tailPoints.length - 1].y,
                                    tailPoints[tailPoints.length - 1].z);
                                p.curveVertex(lastPt[0], lastPt[1]);
                                p.curveVertex(lastPt[0], lastPt[1]);

                                p.endShape();

                                // Draw with fading opacity in segments
                                const fadeSegments = 5; // Number of fading segments in the tail
                                const segmentSize = Math.ceil(tailPoints.length / fadeSegments);

                                for (let segment = 0; segment < fadeSegments - 1; segment++) {
                                    const startIdx = segment * segmentSize;
                                    const endIdx = Math.min((segment + 1) * segmentSize + 1, tailPoints.length);

                                    if (endIdx - startIdx < 3) continue; // Need at least 3 points for a curve

                                    const segmentPoints = tailPoints.slice(startIdx, endIdx);

                                    // Calculate opacity for this segment (fading toward the end)
                                    const opacity = this.currentOpacity * 0.7 * (1 - (segment / fadeSegments));

                                    p.stroke(195, 195, 230, opacity);
                                    p.strokeWeight(smallSize);
                                    p.beginShape();

                                    // Add first point twice (control point)
                                    const firstPt = coordinateShift(p, segmentPoints[0].x, segmentPoints[0].y, segmentPoints[0].z);
                                    p.curveVertex(firstPt[0], firstPt[1]);
                                    p.curveVertex(firstPt[0], firstPt[1]);

                                    // Middle points
                                    for (let i = 1; i < segmentPoints.length - 1; i++) {
                                        const pt = coordinateShift(p, segmentPoints[i].x, segmentPoints[i].y, segmentPoints[i].z);
                                        p.curveVertex(pt[0], pt[1]);
                                    }

                                    // Last point twice (control point)
                                    const lastPt = coordinateShift(p, segmentPoints[segmentPoints.length - 1].x,
                                        segmentPoints[segmentPoints.length - 1].y,
                                        segmentPoints[segmentPoints.length - 1].z);
                                    p.curveVertex(lastPt[0], lastPt[1]);
                                    p.curveVertex(lastPt[0], lastPt[1]);

                                    p.endShape();
                                }
                            }
                        }

                        // Reset stroke settings
                        p.noStroke();
                    }
                }

                p.image(this.pg, 0, 0);
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