import '../styles/globals.css';
import Navbar from "../components/navbar"
import styles2 from "../styles/Home.module.css"
import dynamic from 'next/dynamic'
import Head from 'next/head';
//import Gravity from "../components/gravitysim"
import { Analytics } from '@vercel/analytics/react';
const MathJax = dynamic(
    () => {
        return import("./mathjax");
    },
    { ssr: false }
);


// const Gravity = dynamic(() => import("../components/Lorenz"), {
//     ssr: false
// });
import Lorenz from "../components/Lorenz"

export default function App({ Component, pageProps }) {

    return (
        <div className={styles2.mainAppContainer}>
            <MathJax />
            <Head>
                <title>Luc Barrett</title>
                <link rel="icon" href="/L.png" />
            </Head>
            <div className={styles2.backgroundContent}>
                <Lorenz className={styles2.background} />

            </div>

            <div className={styles2.topContent}>
                <Navbar />
                <Component {...pageProps} />

            </div>
            <Analytics />
        </div >

    );
}
/**
 * 
 * <Gravity className={styles2.background} />
 */