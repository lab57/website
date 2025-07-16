// public/load_app.js

// 1. Define the Module object with the correct configurations.
var Module = {
    // Tell Emscripten where to find the data and wasm files.
    locateFile: (path) => `/${path}`,
    onRuntimeInitialized: () => {
        console.log("Emscripten runtime is ready.");
        // Dispatch a custom event that our React component can listen for.
        window.dispatchEvent(new CustomEvent("wasmReady"));
    },

    // Explicitly tell Emscripten which canvas to use.
    canvas: (() => document.getElementById('canvas'))(),
};

window.addEventListener('keydown', function (event) {
    event.stopImmediatePropagation();
}, true);

window.addEventListener('keyup', function (event) {
    event.stopImmediatePropagation();
}, true);

window.addEventListener('mousemove', function (event) {
    event.stopImmediatePropagation();
}, true);

window.addEventListener('mousedown', function (event) {
    event.stopImmediatePropagation();
}, true);

window.addEventListener('mouseup', function (event) {
    event.stopImmediatePropagation();
}, true);

// 2. Create a <script> tag dynamically to load the main app.
const script = document.createElement('script');
script.src = "/index.js"; // Your main emscripten app file
script.async = true;

// 3. Add the script to the page to start the download and execution.
document.body.appendChild(script);