import '../styles/globals.css';
import Navbar from "../components/navbar"
import styles2 from "../styles/Home.module.css"
import dynamic from 'next/dynamic'
import Head from 'next/head';
//import Gravity from "../components/gravitysim"
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Script from 'next/script'; // 1. IMPORT THE SCRIPT COMPONENT


// const Gravity = dynamic(() => import("../components/Lorenz"), {
//     ssr: false
// });
// import Lorenz from "../components/LorenzWebGL"
// import Lorenz from "../components/LorenzEE"
// import Lorenz from "../components/LorenzWebGL_Precomputed_Streamed"

import { MathJaxContext } from "better-react-mathjax"

const lorenzWASM = dynamic(() => import("../components/LorenzWASM"), {
    ssr: false
});

const config = {

    tex: {
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']],
        packages: ['base', 'ams', 'esint']
    },

};

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const isHomePage = router.pathname === '/';
    const isPostsPage = router.pathname.startsWith('/posts');

    const [activeHomeSection, setActiveHomeSection] = useState(0);
    const [shouldBlur, setShouldBlur] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const [isWasmReady, setIsWasmReady] = useState(false);

    // useEffect(() => {
    //     // This handler now stops propagation for all touch events.
    //     const stopTouchPropagation = (e) => {
    //         e.stopPropagation();
    //     };

    //     const touchEvents = ['touchstart', 'touchend', 'touchmove'];

    //     // Add listeners in the "capture" phase to run them first.
    //     touchEvents.forEach(eventName => {
    //         window.addEventListener(eventName, stopTouchPropagation, { capture: true });
    //     });

    //     return () => {
    //         // Cleanup: remove the listeners when the component unmounts.
    //         touchEvents.forEach(eventName => {
    //             window.removeEventListener(eventName, stopTouchPropagation, { capture: true });
    //         });
    //     };
    // }, []); // The empty array ensures this runs only once when the app mounts.
    useEffect(() => {
        const handleWasmReady = () => setIsWasmReady(true);
        window.addEventListener('WasmReady', handleWasmReady);

        return () => {
            window.removeEventListener('WasmReady', handleWasmReady);
        };
    }, []); // Empty dependency array ensures this runs only once.


    // Listen for section changes from the home page
    useEffect(() => {
        const handleSectionChange = (event) => {
            setActiveHomeSection(event.detail.section);
        };
        const handleScrollProgress = (event) => {
            setScrollProgress(event.detail.progress);
        };

        window.addEventListener('sectionChange', handleSectionChange);
        window.addEventListener('scrollProgress', handleScrollProgress); // ADD THIS LINE


        return () => {
            window.removeEventListener('sectionChange', handleSectionChange);
            window.removeEventListener('scrollProgress', handleScrollProgress); // ADD THIS LINE

        };
    }, []);

    useEffect(() => {
        if (!isPostsPage) {
            setScrollProgress(0);
        }
    }, [isPostsPage]);

    useEffect(() => {
        const isPostPage = router.pathname.startsWith('/posts/');
        setShouldBlur(isPostPage);
    }, [router.pathname]);

    const showEllipsesState = isHomePage && activeHomeSection === 0;
    useEffect(() => {
        console.log("meow")
        if (window.Module && typeof window.Module.triggerAnimation === 'function') {
            console.log("trigger", showEllipsesState)
            window.Module.triggerAnimation(!showEllipsesState);
        }
    }, [showEllipsesState, isWasmReady]);



    // Determine if ellipses should be shown - only on homepage AND only in first section

    console.log("Is home page?", isHomePage, "Active section:", activeHomeSection, "Show ellipses:", showEllipsesState);


    return (
        <div className={styles2.mainAppContainer}>
            <MathJaxContext config={config} version={3}>

                <Head>
                    <title>Luc Barrett</title>
                    <link rel="icon" href="/L.png" />
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous" />

                    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>

                    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous"
                        onload="renderMathInElement(document.body);"></script>

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            window.Module = {
                                onRuntimeInitialized: function() {
                                    console.log('WASM Runtime Initialized.');
                                    window.dispatchEvent(new CustomEvent('WasmReady'));
                                }
                            };
                        `,
                        }}
                    />
                </Head>
                <div className={styles2.backgroundContent}>
                    {/* <div className={`${styles2.backgroundContent} ${shouldBlur ? styles2.blurredBackground : ''}`}> */}
                    {/* <Lorenz className={styles2.background} showEllipses={showEllipsesState} isPaused={shouldBlur} /> */}
                    {/* <lorenzWASM className={styles2.background} /> */}

                    <canvas class="emscripten" id="canvas" tabindex={-1}></canvas>
                    {/* <script async type="text/javascript" src="app.js"></script> */}
                    <Script src="/index.js" strategy="beforeInteractive" ></Script>

                </div>

                <div className={`${styles2.topContent} ${shouldBlur ? styles2.blurBackdrop : ''}`} >
                    <Navbar className={styles2.nbar} />
                    <Component {...pageProps}
                        scrollProgress={scrollProgress}
                        showProgress={isPostsPage}
                    />
                </div>
                <Analytics />
                <SpeedInsights />
            </MathJaxContext >
        </div >

    );
}
/**
 * 
 * <Gravity className={styles2.background} />
 */