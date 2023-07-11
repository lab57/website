import '../styles/globals.css';
import Navbar from "../components/navbar"
import styles2 from "../styles/Home.module.css"
import ParticleScene from "../components/ThreeScene.js"
export default function App({ Component, pageProps }) {

    return (
        <div>
            <ParticleScene></ParticleScene>
            <Navbar />
            <Component {...pageProps} />
        </div>

    );
}