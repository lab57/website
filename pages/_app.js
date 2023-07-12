import '../styles/globals.css';
import Navbar from "../components/navbar"
import styles2 from "../styles/Home.module.css"
import Gravity from "../components/gravitysim"



export default function App({ Component, pageProps }) {

    return (
        <div className={styles2.mainAppContainer}>
            <div className={styles2.backgroundContent}>

                <Gravity className={styles2.background} />
            </div>

            <div className={styles2.topContent}>
                <Navbar />
                <Component {...pageProps} />

            </div>
        </div >

    );
}