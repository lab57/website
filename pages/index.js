
import styles from '../styles/Home.module.css';
import styles2 from "../components/navbar.module.css"
import postStyles from "../styles/Post.module.css"
import Link from "next/link"
import Image from 'next/image';
import News from "../components/news.js"
import { useEffect, useRef, useState } from 'react';

const newsItems = [
    {
        id: 1,
        date: '09/01/2025',
        title: 'Began Ph.D. Applied Physics program at Cornell University',
    },
    {
        id: 2,
        date: '09/01/2024',
        title: 'Began M.S. Computer Science as a Bay State Fellow at UMass Amherst',
    },

    {
        id: 4,
        date: '09/01/2024',
        title: 'Graduated with B.S. Physics, CS, & Math from UMass Amherst 🎉',
    },
    {
        id: 5,
        date: '03/01/2024',
        title: 'Awarded the Kandula Sastry award for the outstanding student in the department',
    },
];

export default function Home() {
    const [activeSection, setActiveSection] = useState(0);
    const snapContainerRef = useRef(null);

    // Handle scroll events to detect active section
    const handleScroll = (e) => {
        if (!snapContainerRef.current) return;

        const container = e.target;
        const scrollPosition = container.scrollTop;
        const sectionHeight = container.clientHeight;
        // If scrolled more than half of the first section, we're in section 2
        const newActiveSection = scrollPosition >= sectionHeight / 2 ? 1 : 0;

        if (newActiveSection !== activeSection) {
            setActiveSection(newActiveSection);
            console.log("meow!")

            // Dispatch a custom event that _app.js can listen for
            const event = new CustomEvent('sectionChange', {
                detail: { section: newActiveSection }
            });
            window.dispatchEvent(event);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.snapContainer} onScroll={handleScroll} ref={snapContainerRef}>
                <section className={styles.snapSection} >
                    <main className={styles.main}>
                        <h1 className={styles.title}>
                            Luc Barrett
                        </h1>
                        {/* <p className={styles.description}>Ph.D. Student @ <b>Cornell University</b> <br /> College of Applied & Engineering Physics </p> */}
                        {/** <p className={styles.description}><a href="https://people.cs.umass.edu/~gvardoyan/#home" target="_blank">Vardoyan Lab</a> @ UMass Amherst</p> **/}
                        <p className={styles.description}>Ph.D. Student @ <b>Cornell University,</b>   </p>
                        <p className={styles.description}>College of Applied & Engineering Physics</p>
                        <p className={styles.description}></p>

                        <p className={styles.description}><em>M.S. Computer Science</em></p>
                        <p className={styles.description}><em>B.S. Physics, B.S. Math, B.S. Computer Science</em></p>
                        {/** <p className={styles.description}>Currently Studying at UMass Amherst</p> **/}
                        <h2 className={styles.findme}></h2>
                        <div className={styles.socials}>
                            <Link href="https://www.linkedin.com/in/luc-barrett/" rel="noopener noreferrer" target="_blank">
                                <Image src="/images/linkedin.png" width={50} height={50} alt="Linkedin picture" />
                            </Link>
                            <Link href="https://www.instagram.com/luc.barrett57/" rel="noopener noreferrer" target="_blank">
                                <Image src="/images/instagramalt.png" width={50} height={50} alt="Instagram picture" />
                            </Link>
                        </div>

                    </main>
                    <div className={styles.scrollIndicator}>
                        <div className={styles.arrowDown}></div>
                    </div>
                </section>
                <section className={styles.snapSection}>
                    {/* <div className={styles.scrollIndicator} style={{ top: '20px' }}>
                        <div className={styles.arrowUp}></div>
                    </div> */}
                    <main className={styles.aboutSection}>
                        <div className={postStyles.content}>
                            <h2>About Me</h2>
                            <p>
                                Hi! My name's Luc, thanks for checking out my site!
                            </p>
                            <p>
                                I'm currently in my final semester of a M.S. Computer Science program at UMass Amherst,
                                working on quantum communication in the Vardoyan Lab. In the fall I am moving to the Applied & Engineering Physics department at Cornell University to start
                                my Ph.D. I'm broadly interested in quantum information, particle physics, cosmology, and machine learning, and I'm usually working on projects in these areas.


                            </p>

                            <p>
                                This website is for hosting my <Link href="/posts">ramblings</Link>, projects, or anything else I want to share. You can shoot me an email above if want to connect!


                            </p>



                        </div>


                        <News className={styles.news} title="Latest News & Updates"
                            maxItems={3}
                            allNewsUrl="/news"
                            jsonPath="/data/news.json" />

                    </main>
                </section>
            </div>
        </div >
    )
}
