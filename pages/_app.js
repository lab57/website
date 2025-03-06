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



// const Gravity = dynamic(() => import("../components/Lorenz"), {
//     ssr: false
// });
import Lorenz from "../components/Lorenz"
import { MathJaxContext } from "better-react-mathjax"

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
    const [activeHomeSection, setActiveHomeSection] = useState(0);
    const [shouldBlur, setShouldBlur] = useState(false);

    // Listen for section changes from the home page
    useEffect(() => {
        const handleSectionChange = (event) => {
            setActiveHomeSection(event.detail.section);
        };

        window.addEventListener('sectionChange', handleSectionChange);

        return () => {
            window.removeEventListener('sectionChange', handleSectionChange);
        };
    }, []);

    useEffect(() => {
        const isPostPage = router.pathname.startsWith('/posts/');
        setShouldBlur(isPostPage);
    }, [router.pathname]);



    // Determine if ellipses should be shown - only on homepage AND only in first section
    const showEllipsesState = isHomePage && activeHomeSection === 0;

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
                </Head>
                <div className={styles2.backgroundContent}>
                    {/* <div className={`${styles2.backgroundContent} ${shouldBlur ? styles2.blurredBackground : ''}`}> */}
                    <Lorenz className={styles2.background} showEllipses={showEllipsesState} />

                </div>

                <div className={`${styles2.topContent} ${shouldBlur ? styles2.blurBackdrop : ''}`} >
                    <Navbar />
                    <Component {...pageProps} />
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