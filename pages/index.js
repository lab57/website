
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
        title: 'Awarded the Kandula Sastry award for the outstanding student in the physics department',
    },
];

export default function Home() {
    const [activeSection, setActiveSection] = useState(0);
    const [chevronOpacity, setChevronOpacity] = useState(1); // Add this line

    const snapContainerRef = useRef(null);

    // Handle scroll events to detect active section
    const handleScroll = (e) => {
        if (!snapContainerRef.current) return;

        const container = e.target;
        const scrollPosition = container.scrollTop;
        const sectionHeight = container.clientHeight;
        // If scrolled more than half of the first section, we're in section 2
        const newActiveSection = scrollPosition >= sectionHeight / 2 ? 1 : 0;


        const fadeDistance = 250; // Pixels to fade over
        const newOpacity = Math.max(0, 1 - (scrollPosition / fadeDistance));
        setChevronOpacity(newOpacity);


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

    const scrollToNextSection = () => {
        if (snapContainerRef.current) {
            const sectionHeight = snapContainerRef.current.clientHeight;
            snapContainerRef.current.scrollTo({
                top: sectionHeight,
                behavior: 'smooth' // This makes it scroll smoothly
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.snapContainer} onScroll={handleScroll} ref={snapContainerRef}>

                <section className={styles.snapSection} >
                    <div className={styles.nameSection}>

                        < main className={styles.main}>
                            <div className={styles.textContent}>

                                <h1 className={styles.title}>
                                    Luc Barrett
                                </h1>
                                <p className={styles.description}>Ph.D. Student @ <b>Cornell University</b> </p>
                                {/** <p className={styles.description}><a href="https://people.cs.umass.edu/~gvardoyan/#home" target="_blank">Vardoyan Lab</a> @ UMass Amherst</p> **/}
                                {/* <p className={styles.description}>Ph.D. Student @ <b>Cornell University,</b>   </p>
                            <p className={styles.description}>College of Applied & Engineering Physics</p> */}
                                <p className={styles.description}></p>

                                {/* <p className={styles.description}><em>M.S. Computer Science</em> </p> */}
                                <p className={styles.description}><em>B.S. Physics, B.S. Math, M.S./B.S. Computer Science</em></p>
                                {/** <p className={styles.description}>Currently Studying at UMass Amherst</p> **/}
                                {/* <h2 className={styles.findme}></h2> */}
                            </div>
                            <div className={styles.socials}>
                                <Link href="https://www.linkedin.com/in/luc-barrett/" rel="noopener noreferrer" target="_blank">
                                    <Image src="/images/icons8-linkedin.svg" width={50} height={50} alt="Linkedin picture" />
                                </Link>
                                <Link href="https://www.instagram.com/luc.barrett57/" rel="noopener noreferrer" target="_blank">
                                    <Image src="/images/icons8-instagram.svg" width={50} height={50} alt="Instagram picture" />
                                </Link>
                                <Link href="https://github.com/lab57" rel="noopener noreferrer" target="_blank">
                                    <Image src="/images/icons8-github.svg" width={50} height={50} alt="Github picture" />
                                </Link>
                                <Link href="https://bsky.app/profile/lucwarm.bsky.social" rel="noopener noreferrer" target="_blank">
                                    <Image src="/images/Bluesky_logo_(black).svg" width={50} height={50} alt="Bluesky picture" />
                                </Link>
                            </div>

                        </main>
                        <div className={styles.scrollIndicator} style={{ opacity: chevronOpacity }} onClick={scrollToNextSection}>
                            <div className={styles.arrowDown}></div>
                        </div>
                    </div>

                </section>
                <section className={styles.snapSection}>
                    {/* <div className={styles.scrollIndicator} style={{ top: '20px' }}>
                        <div className={styles.arrowUp}></div>
                    </div> */}
                    <main className={styles.aboutSection}>
                        <div className={postStyles.content}>
                            <h2>About Me</h2>

                            <div className={styles.aboutContainer}>

                                {/* <div className={styles.floatingpfp}> */}

                                    {/* <Image src="/luc.JPG" width={300} height={500}></Image> */}
                                    {/* <p>Image Caption</p> */}
                                {/* </div> */}

                                <p>
                                    Hi! My name's Luc, thanks for checking out my site!
                                </p>
                                <p>
                                    {/* I recently graduated from UMass Amherst with an M.S. degree in Computer Science, and B.S. degrees in Physics, Mathematics, and Computer Science. In the fall, I'm moving to Cornell University to start my Ph.D. in
                                the College of Applied & Engineering Physics, focusing on quantum information. During my masters, I focused on studying applications of modern reinforcement learning techniques to problems in quantum communication
                                (e.g, circuit compilation, memory entanglement generation). During my undergraduate programs, I focused on nuclear physics, mostly neutrinoless double beta decay, where my thesis was on R&D for the nEXO experiment.
                                I also had some side projects working on simulators for guassian quantum systems. I'm broadly interested in quantum information, particle physics, cosmology, and machine learning, and I'm usually working on projects in these areas, or some intersection of them. */}

                                    I'm a first-year Ph.D. student in the College of Applied & Engineering Physics at Cornell University. I'm interested in the development of quantum computing hardware and the applications of modern quantum sensing technology to experiments probing fundamental physics.
                                </p> <p>
                                    I recently graduated from the University of Massachusetts Amherst with an M.S. degree in Computer Science, and B.S. degrees in Physics, Mathematics, and Computer Science. During my masters, I focused on studying applications of modern reinforcement learning techniques to problems in quantum communication
                                    (e.g, circuit compilation, memory entanglement generation). During my undergraduate programs, I focused on nuclear physics, mostly neutrinoless double beta decay, where my thesis was on R&D for the nEXO experiment.
                                    I also had some side projects working on simulators for guassian quantum systems.



                                </p>

                                <p>
                                    This website is for hosting my <Link href="/posts">ramblings</Link>, projects, or anything else I want to share. You can shoot me an email above if you'd like to connect! <Link href="/availability">My availability is posted here.</Link>


                                </p>

                            </div >


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
