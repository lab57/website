// components/LorenzComponent.js

import React, { useEffect, useRef } from 'react';

const LorenzComponent = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        console.log("1. useEffect has fired.");

        if (!canvasRef.current) {
            console.error("2. useEffect exited: Canvas ref was not ready.");
            return;
        }

        console.log("3. Canvas ref is ready.");

        // IMPORTANT: Make sure this path and filename are correct!
        const scriptSrc = '/outputmeow.js';

        // A robust check to prevent adding the script multiple times
        if (document.querySelector(`script[src="${scriptSrc}"]`)) {
            console.log("4. useEffect exited: Script tag already exists in the document.");
            return;
        }

        console.log("5. Defining window.Module object.");
        window.Module = {
            canvas: canvasRef.current,
        };

        console.log("6. Creating the script element.");
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;

        // Add event listeners to get direct feedback on the script loading
        script.onload = () => {
            console.log("SUCCESS: Emscripten script has loaded and executed!");
        };
        script.onerror = () => {
            console.error("ERROR: The script failed to load. Check the path in 'scriptSrc' and your browser's Network tab for a 404 error.");
        };

        console.log("7. Appending the script to the document to trigger loading.");
        document.body.appendChild(script);

        // Cleanup function to remove the script when the component unmounts
        return () => {
            console.log("Cleanup: Removing script element.");
            const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []); // The empty array ensures this effect runs only once on mount

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
        ></canvas>
    );
};

export default LorenzComponent;