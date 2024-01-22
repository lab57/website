import Head from 'next/head';
import styles from '../styles/Home.module.css';
import styles2 from "../components/navbar.module.css"
import Link from "next/link"
import Image from 'next/image';
export default function Home() {
    return (
        <div className={styles.container}>

            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Luc Barrett
                </h1>
                <p className={styles.description}>B.S. Physics, B.S. Math, B.S. Computer Science</p>
                <p className={styles.description}>Currently Studying at UMass Amherst</p>

                <h2 className={styles.findme}></h2>
                <div className={styles.socials}>
                    <Link href="https://www.linkedin.com/in/luc-barrett/"
                        rel="noopener noreferrer" target="_blank">
                        <Image src="/images/linkedin.png"
                            width={50}
                            height={50}
                            alt="Linkedin picture" />
                    </Link>

                    {/* <Link href="https://www.instagram.com/luc.barrett57/"
                        rel="noopener noreferrer" target="_blank">
                        <Image src="/images/instagramalt.png"
                            width={50}
                            height={50}
                            alt="Instagram picture" />
                    </Link> */}


                </div>
                <div>

                </div>
            </main>


        </div>
    )
}
