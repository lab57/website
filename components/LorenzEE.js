import React, { useEffect, useRef } from 'react';
import styles from './Lorenz.module.css';
import { LorenzPath } from './LorenzPath'; // Your long SVG path string `d="..."`

/**
 * Calculates the cumulative length at each command in an SVG path.
 * This is the key to mapping time to distance.
 * @param {SVGPathElement} pathNode - The SVG path element.
 * @returns {Array<Object>} An array of keyframes for the Web Animations API.
 */
function generateKeyframes(pathNode) {
    if (!pathNode) return [];

    const totalLength = pathNode.getTotalLength();
    // Get an array of all path segments (e.g., LineTo, MoveTo, CurveTo)
    const segments = pathNode.pathSegList;
    const keyframes = [];

    let cumulativeLength = 0;
    for (let i = 0; i < segments.length; i++) {
        const segment = segments.getItem(i);
        // Create a temporary single-segment path to measure it
        const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempPath.setAttribute('d', segment.pathSegTypeAsLetter);
        // This is a simplification; accurate measurement would require knowing the previous point.
        // A more robust solution uses getPointAtLength over small intervals.
    }

    // A more practical and accurate approach is to sample the path at equal length intervals
    // and map that to non-linear time, but since your points are already distributed by speed,
    // we can create a timeline based on a fixed number of samples.

    const numKeyframes = 500; // More keyframes = more precision
    for (let i = 0; i <= numKeyframes; i++) {
        const progress = i / numKeyframes;
        const pointLength = progress * totalLength;
        const point = pathNode.getPointAtLength(pointLength);

        // This is where you would apply your own logic if you had the original
        // time data from the equation. For now, we'll create a simple non-linear effect.

        // Let's create an "ease-in-out" effect based on path progress
        const timeOffset = 0.5 - 0.5 * Math.cos(progress * Math.PI);

        keyframes.push({
            offsetDistance: `${progress * 100}%`,
            offset: timeOffset // This maps path progress to time
        });
    }

    // The logic above creates a generic easing. To TRULY use your path's density,
    // you would need to parse the 'd' attribute and calculate the length at each vertex.
    // However, the most effective method is using WAAPI's 'linear' easing on keyframes.
    // The browser itself can figure out the density.

    // The *actual* solution is much simpler by letting the browser do the work:
    const finalKeyframes = [
        { offsetDistance: '0%' },
        { offsetDistance: '100%' }
    ];

    return finalKeyframes;
}


const Lorenz = () => {
    useEffect(() => {
        const path = document.getElementById('lorenz-path');
        if (!path) return;

        // Since your path data has points clustered for slow movement,
        // we can use WAAPI's computed distance model. The trick is to animate
        // a value and have the 'offset-path' use that as its lookup.
        // The most direct way is to use 'offset' on the keyframes.

        // We will generate keyframes where the TIME is non-linear.
        const keyframes = [];
        const samples = 400; // Increase for more accuracy
        const totalLength = path.getTotalLength();

        for (let i = 0; i <= samples; i++) {
            // This is our 'time' variable, progressing linearly.
            const time = i / samples;

            // Here's the magic: We want to find out how far along the path we should be
            // at this 'time'. For slow sections (high density), a big chunk of time
            // should result in a small change in distance.

            // This requires a function that maps time -> distance. Since we don't have
            // the original equation, we'll simulate it: let's assume the first half
            // of the path's points should take 80% of the time.

            let distanceProgress;
            if (time < 0.8) {
                // In the first 80% of time, cover 50% of the distance
                distanceProgress = (time / 0.8) * 0.5;
            } else {
                // In the last 20% of time, cover the remaining 50% of the distance
                distanceProgress = 0.5 + ((time - 0.8) / 0.2) * 0.5;
            }

            keyframes.push({
                offset: time,
                offsetDistance: `${distanceProgress * 100}%`
            });
        }

        const particles = document.querySelectorAll(`.${styles.particle}`);

        particles.forEach((particle, index) => {
            particle.animate(keyframes, {
                duration: 2000000, // The total time
                iterations: Infinity,
                delay: index * -6600, // Stagger the animations
                easing: 'linear' // IMPORTANT: The easing between our keyframes must be linear
            });
        });

    }, []);

    return (
        <div className={styles.lorenzContainer}>
            <svg width="0" height="0" style={{ position: 'absolute', zIndex: -1 }}>
                <defs>
                    <path id="lorenz-path" d={LorenzPath} fill="none" stroke="transparent" />
                </defs>
            </svg>

            {/* Remove the inline CSS animation from your .particle class */}
            <div className={`${styles.particle} ${styles.p1}`}></div>
            <div className={`${styles.particle} ${styles.p2}`}></div>
            <div className={`${styles.particle} ${styles.p3}`}></div>
        </div>
    );
};

export default Lorenz;