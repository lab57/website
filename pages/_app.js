import '../styles/globals.css';
import Navbar from "../components/navbar"
import styles2 from "../styles/Home.module.css"
import dynamic from 'next/dynamic'
//import Gravity from "../components/gravitysim"
import { Analytics } from '@vercel/analytics/react';


// const Gravity = dynamic(() => import("../components/Lorenz"), {
//     ssr: false
// });
import SSSS from "../components/Lorenz"

export default function App({ Component, pageProps }) {

    return (
        <div className={styles2.mainAppContainer}>
            <div className={styles2.backgroundContent}>
                <SSSS className={styles2.background} />

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