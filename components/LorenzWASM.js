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