import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';


export default function LorenzPage() {
    return (


        <div class="emscripten_border">
            <canvas class="emscripten" id="canvas" tabindex={-1}></canvas>

            {/* <script async type="text/javascript" src="app.js"></script> */}
            <script async type="text/javascript" src="index.js"></script>
        </div>



    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f0f0f0' },
    title: { fontSize: '2.5rem', marginBottom: '0.5rem' },
    sketchContainer: { width: '960px', height: '720px', border: '2px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', backgroundColor: '#000' },
};