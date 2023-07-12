
import Link from 'next/link';
import Image from 'next/image'
import Layout from "../components/layout"
import Gravity from "../components/gravitysim"
import styles from "../styles/test.module.css"

export default function FirstPost() {
    return (
        <div className={styles.container}>

            <h1>First Post</h1>
            <Gravity className={styles.grav} />
        </div>
    );
}