import '../styles/globals.css';
import Navbar from "../components/navbar"
import styles2 from "../styles/Home.module.css"
import dynamic from 'next/dynamic'
//import Gravity from "../components/gravitysim"

const Gravity = dynamic(() => import("../components/gravitysim3"), {
    ssr: false
});

export default function App({ Component, pageProps }) {

    return (
        <div className={styles2.mainAppContainer}>
            <div className={styles2.backgroundContent}>


            </div>

            <div className={styles2.topContent}>
                <Navbar />
                <Component {...pageProps} />

            </div>
        </div >

    );
}
/**
 * 
 * <Gravity className={styles2.background} />
 */