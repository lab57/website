import React, { useState, useEffect, useRef } from "react";
// p5 is no longer imported at the top level. It will be imported dynamically.

// --- Simulation Constants ---
const NUM_PARTICLES = 25;
const MAX_TAIL_LENGTH = 500;
const DATA_FILE_PATH = '/lorenz_tracks.bin';

// --- Streaming/Chunking Constants ---
const CHUNK_SIZE_FRAMES = 5000; // How many frames of animation data to load per chunk.
const PREFETCH_THRESHOLD_FRAMES = 500; // Start fetching the next chunk when we are this many frames from the end of the current one.
const BYTES_PER_FLOAT = 4;
const FLOATS_PER_FRAME = NUM_PARTICLES * 3; // 3 for (x, y, z)
const BYTES_PER_FRAME = FLOATS_PER_FRAME * BYTES_PER_FLOAT;
const CHUNK_SIZE_BYTES = CHUNK_SIZE_FRAMES * BYTES_PER_FRAME;

// --- Display Constants ---
const USE_WEBGL = false; // Set to false for 2D canvas rendering

/**
 * Transforms a point from the 3D simulation space to the 2D screen space.
 * For 2D rendering, we must also translate the origin to the center of the canvas.
 */
const coordinateShift = (p, x, y, z) => {
    const w = p.windowWidth;
    const h = p.windowHeight;
    // In 2D mode, we scale and translate to the center of the canvas.
    return [(35 * x + w / 2), (h / 2 - 15 * y), z];
};

/**
 * A React component that visualizes pre-computed Lorenz attractor particle tracks
 * using the 2D canvas renderer and streaming data in chunks.
 */
const Lorenz2DPrecomputedStreamed = (props) => {
    const renderRef = useRef();
    const p5Instance = useRef();

    // --- State and Refs for Data Handling ---
    const particles = useRef([]);
    const tracksBuffer = useRef(null);
    const animationFrame = useRef(0);
    const totalFrames = useRef(0);
    const currentBufferIndex = useRef(-1);
    const isFetching = useRef(false);

    const [loadingState, setLoadingState] = useState({
        isLoading: true,
        error: null,
        message: "Initializing..."
    });

    // --- Core Data Fetching Logic (unchanged) ---
    const fetchChunk = async (chunkIndex) => {
        if (isFetching.current) return;
        isFetching.current = true;

        const startByte = chunkIndex * CHUNK_SIZE_BYTES;
        const endByte = Math.min(startByte + CHUNK_SIZE_BYTES - 1, totalFrames.current * BYTES_PER_FRAME - 1);

        if (startByte >= endByte) {
            console.log("Reached end of track data.");
            isFetching.current = false;
            return;
        }

        setLoadingState(prev => ({ ...prev, message: `Fetching data chunk ${chunkIndex + 1}...` }));

        try {
            const response = await fetch(DATA_FILE_PATH, {
                headers: { 'Range': `bytes=${startByte}-${endByte}` }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const arrayBuffer = await response.arrayBuffer();
            tracksBuffer.current = new Float32Array(arrayBuffer);
            currentBufferIndex.current = chunkIndex;
            console.log(`✓ Successfully loaded chunk ${chunkIndex + 1} (${(arrayBuffer.byteLength / 1024).toFixed(2)} KB)`);
            setLoadingState(prev => ({ ...prev, message: "" }));
        } catch (error) {
            console.error(`Failed to fetch chunk ${chunkIndex}:`, error);
            setLoadingState({ isLoading: false, error: `Could not load track data: ${error.message}` });
        } finally {
            isFetching.current = false;
        }
    };

    // --- Initial Setup Effect (unchanged) ---
    useEffect(() => {
        const initialize = async () => {
            try {
                const headResponse = await fetch(DATA_FILE_PATH, { method: 'HEAD' });
                if (!headResponse.ok) throw new Error("Could not get file metadata.");

                const contentLength = headResponse.headers.get('Content-Length');
                if (!contentLength) throw new Error("Content-Length header is missing.");

                const totalBytes = parseInt(contentLength, 10);
                totalFrames.current = Math.floor(totalBytes / BYTES_PER_FRAME);
                console.log(`Data file contains a total of ${totalFrames.current} frames.`);

                await fetchChunk(0);
                setLoadingState({ isLoading: false, error: null, message: "" });

            } catch (error) {
                console.error("Initialization failed:", error);
                setLoadingState({ isLoading: false, error: error.message });
            }
        };

        initialize();

        return () => { p5Instance.current?.remove(); };
    }, []);

    // --- P5 Sketch Setup Effect ---
    useEffect(() => {
        if (loadingState.isLoading || loadingState.error) return;

        import('p5').then(p5Module => {
            const p5 = p5Module.default;
            particles.current = Array.from({ length: NUM_PARTICLES }, (_, i) => ({ id: i, tail: [] }));

            p5Instance.current = new p5(p => {
                const currentRadius = { value: 5 };
                const currentOpacity = { value: 255 };

                p.setup = () => {
                    // Create a 2D canvas instead of a WebGL one.
                    p.createCanvas(p.windowWidth, p.windowHeight, p.P2D)
                        .parent(renderRef.current);
                    // p.pixelDensity(p.displayDensity());
                    p.frameRate(60);
                    p.disableFriendlyErrors = true;
                };

                p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);

                p.draw = () => {
                    // --- 1. Update particle data (same as before) ---
                    const frameInCurrentBuffer = animationFrame.current % CHUNK_SIZE_FRAMES;
                    if (!isFetching.current && frameInCurrentBuffer >= (CHUNK_SIZE_FRAMES - PREFETCH_THRESHOLD_FRAMES)) {
                        const nextChunkIndex = currentBufferIndex.current + 1;
                        if (nextChunkIndex * CHUNK_SIZE_FRAMES < totalFrames.current) {
                            fetchChunk(nextChunkIndex);
                        }
                    }

                    if (tracksBuffer.current) {
                        const bufferOffset = frameInCurrentBuffer * FLOATS_PER_FRAME;
                        if (bufferOffset + FLOATS_PER_FRAME <= tracksBuffer.current.length) {
                            for (let i = 0; i < NUM_PARTICLES; i++) {
                                const part = particles.current[i];
                                const trackOffset = bufferOffset + i * 3;
                                const currentPos = {
                                    x: tracksBuffer.current[trackOffset],
                                    y: tracksBuffer.current[trackOffset + 1],
                                    z: tracksBuffer.current[trackOffset + 2]
                                };
                                part.tail.unshift(currentPos);
                                if (part.tail.length > MAX_TAIL_LENGTH) part.tail.pop();
                            }
                        }
                    }
                    animationFrame.current = (animationFrame.current + 1) % totalFrames.current;

                    // --- 2. Update Visual Properties (same as before) ---
                    const targetRadiusVal = props.showEllipses ? 10 : 1;
                    currentRadius.value += (targetRadiusVal - currentRadius.value) * 0.02;
                    const targetOpacityVal = props.showEllipses ? 255 : 60;
                    currentOpacity.value += (targetOpacityVal - currentOpacity.value) * 0.02;

                    // --- 3. Rendering with 2D ellipses ---
                    p.clear();
                    p.noStroke(); // We use fill for ellipses, so no stroke is needed.

                    for (const part of particles.current) {
                        if (part.tail.length === 0) continue;

                        // Draw the head of the particle
                        p.fill(195, 195, 230, currentOpacity.value);
                        const head = part.tail[0];
                        const [tx, ty] = coordinateShift(p, head.x, head.y, head.z);
                        p.ellipse(tx, ty, currentRadius.value, currentRadius.value);

                        // Draw the fading tail
                        let tailRadius = currentRadius.value;
                        const radiusStep = tailRadius / 25; // Fade over the first 25 segments
                        const minRadius = 1;

                        // We can use a lower opacity for the tail for a softer look
                        const tailOpacity = currentOpacity.value * 0.7;

                        for (let i = 1; i < part.tail.length; i++) {
                            if (i < 25) {
                                tailRadius -= radiusStep;
                            }
                            const segmentRadius = Math.max(tailRadius, minRadius);

                            // Fade out the tail segments
                            const segmentOpacity = tailOpacity * (1 - i / part.tail.length);
                            p.fill(195, 195, 230, segmentOpacity);

                            const t = part.tail[i];
                            const [tsx, tsy] = coordinateShift(p, t.x, t.y, t.z);
                            p.ellipse(tsx, tsy, segmentRadius, segmentRadius);
                        }
                    }
                };
            });
        });
    }, [loadingState.isLoading, loadingState.error, props.showEllipses]);

    // Effect to handle pausing
    useEffect(() => {
        if (!p5Instance.current) return;
        props.isPaused ? p5Instance.current.noLoop() : p5Instance.current.loop();
    }, [props.isPaused]);

    // --- Component Render Output ---
    const LoadingIndicator = ({ message, error }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
            color: error ? 'red' : 'white',
            fontFamily: 'sans-serif',
            padding: '20px',
            boxSizing: 'border-box',
            textAlign: 'center'
        }}>
            {error || message}
        </div>
    );

    if (loadingState.isLoading || loadingState.error) {
        return <LoadingIndicator message={loadingState.message} error={loadingState.error} />;
    }

    return <div ref={renderRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}></div>;
};

export default Lorenz2DPrecomputedStreamed;
