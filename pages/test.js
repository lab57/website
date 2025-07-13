import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Import the factory function directly from the new module.
import createLorenzModule from '../public/LORENZ/project.mjs';

const LorenzSketch = () => {
    const canvasRef = useRef(null);
    const moduleRef = useRef(null); // To hold the module instance

    useEffect(() => {
        // Guard to prevent re-initialization on re-renders
        if (!canvasRef.current || moduleRef.current) {
            return;
        }

        // Configuration object passed directly to the factory function.
        const moduleConfig = {
            canvas: canvasRef.current,
            locateFile: (path) => `/LORENZ/${path}`,
        };

        // Call the imported factory function. It returns a Promise.
        createLorenzModule(moduleConfig).then(module => {
            // The WASM instance is now fully loaded and running.
            // We save the instance in a ref in case we need to call its functions later.
            moduleRef.current = module;
        });

        // Cleanup function when the component unmounts
        return () => {
            const oFModule = moduleRef.current;
            if (oFModule && typeof oFModule.exit === 'function') {
                oFModule.exit();
            }
        };
    }, []); // Runs once on mount

    // We now create the canvas directly in React.
    // Emscripten will use the canvas element we pass to it.
    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};


// The rest of the page remains the same
const DynamicLorenzSketch = dynamic(
    () => Promise.resolve(LorenzSketch),
    {
        ssr: false,
        loading: () => <p style={{ textAlign: 'center' }}>Loading Lorenz Attractor...</p>,
    }
);

export default function LorenzPage() {
    return (
        <>
            <Head>
                <title>Lorenz Attractor | oF + Next.js</title>
            </Head>
            <main style={styles.container}>
                <h1 style={styles.title}>Lorenz Attractor Sketch</h1>
                <div style={styles.sketchContainer}>
                    <DynamicLorenzSketch />
                </div>
            </main>
        </>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f0f0f0' },
    title: { fontSize: '2.5rem', marginBottom: '0.5rem' },
    sketchContainer: { width: '960px', height: '720px', border: '2px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', backgroundColor: '#000' },
};