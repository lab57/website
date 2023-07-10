import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from "next/link"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className={styles.title}>
                    Luc Barrett
                </h1>
                <p className={styles.description}>Physics & Computer Science</p>
                <p className={styles.description}>Currently at UMass Amherst</p>

            </main>


        </div>
    )
}
