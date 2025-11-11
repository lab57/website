// import { getPostData } from '../../lib/posts'
import Layout from "../components/layout"
// import fs from 'node:fs'
import matter from 'gray-matter'
// import path from 'node:path'
import { MathJax } from "better-react-mathjax"
import styles from '../styles/Post.module.css'
import Link from "next/link"

// import { useScrollProgress } from '../hooks/useScrollProgress'; // ADD THIS IMPORT


// const postsDirectory = path.join(process.cwd(), 'posts')

export default function CV() {
    // const containerRef = useScrollProgress(); // ADD THIS LINE

    return (
        <Layout>

            <MathJax dynamic={true}>
                <article className={styles.article}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Curriculum Vitae</h1>
                        <time className={styles.date}>
                    <em><p className={styles.excerpt}>Updated November 2025</p></em>
                        </time>
                    </div>



                    <section className="split-section" id="introduction"> {/* <-- ADDED id */}
                        <div className="left-column"><h1>Contents</h1></div>
                        <div className="right-column content">
                            <ul id={styles.contentlist}>
                                {/* <li><a href="#introduction">Introduction</a></li> */}
                                <li><a href="#education">Education</a></li>
                                <li><a href="#presentations">Posters & Presentations</a></li>
                                <li><a href="#research">Research Experience</a></li>
                                <li><a href="#awards">Awards & Honors</a></li>
                                <li><a href="#teaching">Teaching Experience</a></li>
                                <li><a href="#mentoring">Mentoring Experience</a></li>
                            </ul>
                        </div>
                    </section>


                    {/* <section className="split-section" id={styles.contents}> 
                        <div className="left-column"><h1>Contents</h1></div>
                        <div className="right-column content">
                            <ul>
                                <li><a href="#education">Education</a></li>
                                <li><a href="#presentations">Posters & Presentations</a></li>
                                <li><a href="#research">Research Experience</a></li>
                                <li><a href="#awards">Awards & Honors</a></li>
                                <li><a href="#teaching">Teaching Experience</a></li>
                                <li><a href="#mentoring">Mentoring Experience</a></li>
                            </ul>
                        </div>
                    </section> */}
                    {/* --- END OF ADDED BLOCK --- */}


                    <section className="split-section" id="introduction"> {/* <-- ADDED id */}
                        <div className="left-column"><h1>Introduction</h1></div>
                        <div className="right-column content">
                            <p className={styles.justifytext}>
                                I'm an experimental physics Ph.D. student currently at Cornell University interested in quantum computing and applying advancements in quantum technology to build novel detectors for elementary physics.

                            </p>

                            <p>A PDF version of my academic CV is <Link href="/CV.pdf" rel="noopener noreferrer" target="_blank">available here</Link>. A one-page resume is <Link href="/resume.pdf" rel="noopener noreferrer" target="_blank">available here.</Link></p>
                        </div>
                    </section>

                    <div className={styles.content}>
                        <section className="split-section" id="education"> {/* <-- ADDED id */}
                            <div className="left-column"><h1>Education</h1></div>
                            <div className="right-column content">

                                {/* <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Cornell University</h2>
                                        <em>Present</em>
                                    </div>
                                    <p className={styles.noJust}><em>Ph.D. Candidate - Applied Physics</em></p>
                                    <ul>
                                    </ul>
                                </div> */}

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Cornell University</h2>
                                        <em>2025-Present</em>
                                    </div>
                                    <p className={styles.noJust}><em>Ph.D. Applied Physics</em></p>
                                    <ul>
                                        {/* <li>Quantum Circuits & Materials Lab</li> */}
                                    </ul>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>University of Massachusetts Amherst</h2>
                                        <em>2024-Spring 2026</em>
                                    </div>
                                    <p className={styles.noJust}><em>M.S. Computer Science</em></p>
                                    <ul>
                                        <li>Bay State Fellow</li>
                                        <li>Master's Project being completed in conjunction with first-year of PhD</li>
                                    </ul>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>University of Massachusetts Amherst</h2>
                                        <em>2020-2024</em>
                                    </div>
                                    <p className={styles.noJust}><em>B.S. Physics, B.S. Mathematics, B.S. Computer Science</em></p>
                                    <ul>
                                        <li>GPA: 3.94</li>
                                        <li> Cum Laude, Commonwealth Honors Scholar with Greatest Distinction, Phi Beta Kappa</li>
                                        <li>Thesis: <em>Characterization of Drifting Charge Clusters in Liquid Xenon Produced by a Laser-Driven Photocathode for the nEXO Experiment</em></li>
                                    </ul>
                                </div>

                            </div>

                        </section>
                        {/* <section className="split-section">
                            <div className="left-column"><h1>Appointments</h1></div>
                            <div className="right-column content">

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Fatemi Group, Cornell University</h2>
                                        <em>Ithaca, NY</em>
                                    </div>
                                    <div className={styles.eduNameDate}>
                                        <p>Ph.D. Candidate</p>
                                        <em>2026-2030</em>
                                    </div>

                                </div>

                            </div>
                        </section> */}

                        {/* <section className="split-section">
                            <div className="left-column"><h1>Publications</h1></div>
                            <div className="right-column content">

                                <div className={styles.cvEntry}>
                                    <ol className={styles.publist}>

                                        <li>

                                            H. Lu, I. A. Day, A. R. Akhmerov, B. van Heck, V. Fatemi. <em>Kramers-protected hardware-efficient error
                                                correction with Andreev spin qubits.</em> arXiv:2412.16116
                                        </li>

                                    </ol>

                                </div>

                            </div>
                        </section> */}

                        <section className="split-section" id="presentations"> {/* <-- ADDED id */}
                            <div className="left-column"><h1>Posters & Presentations</h1></div>
                            <div className="right-column content">

                                <div className={styles.cvEntry}>


                                    <div className={styles.eduNameDate}>
                                        <p>Chroma Optics Measurements</p>
                                        <em>Oct 2024</em>
                                    </div>
                                    <p className={styles.presentationAuthor}>L. Barrett (Speaker)</p>
                                    <p className={styles.presentationLocation}>nEXO Light Simulation Workshop, McGill University, Québec, CA</p>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <p>Photo-Induced Charge Calibration for NEXO</p>
                                        <em>Jun 2024</em>
                                    </div>
                                    <p className={styles.presentationAuthor}>D. Cesmecioglu (Presenter), J. Bane, L. Barrett, K.S. Kumar, M. Loscar, A. Nolan, J. Zhu</p>
                                    <p className={styles.presentationLocation}>Neutrino 2024, Milan, IT</p>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <p>Program to Identify Secondary Background Sources in the MOLLER Experiment</p>
                                        <em>Nov 2023</em>
                                    </div>
                                    <p className={styles.presentationAuthor}>L. Barrett (Presenter), J. Mott, K.S. Kumar</p>
                                    <p className={styles.presentationLocation}>APS DNP 2023, Waikoloa, HI, US</p>
                                </div>

                            </div>
                        </section>


                        <section className="split-section" id="research"> {/* <-- ADDED id */}
                            <div className="left-column"><h1>Research Experience</h1></div>
                            <div className="right-column content">

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Master's Project</h2>
                                        <em>2024-2025</em>
                                    </div>
                                    <p><em>UMass Amherst College of Information & Computer Sciences</em></p>
                                    <p>Apply modern reinforcement learning algorithms to optimize link generation between quantum memory registers with various noise models.</p>
                                    <ul>
                                        <li>Used reinforcement learning to train a quantum circuit compiler to compile given sets of operations to a format suitable for a distributed quantum computer (DQC) minimizing teleportation operations.</li>
                                    </ul>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>MOLLER Experiment</h2>
                                        <em>2021-2024</em>
                                    </div>
                                    <p><em>University of Massachusetts Amherst</em></p>
                                    <p>Worked on the MOLLER experiment, developing a software tool to check 'two-bounce' conditions. Validates the design of the collimator system and ensures no accidental avenues for noise.</p>
                                    <ul>
                                        <li>Used Rust, parallelization, and highly optimized collision check algorithms to bring simulation time from several days to a couple of minutes. Presented in APS DNP CEU undergraduate poster session.</li>
                                        <li>Set up, configured, and managed a small compute cluster for Geant4 simulations.</li>
                                        <li>Developed algorithm to find smooth contour around electron beam profiles, considering geometric constraint.</li>
                                    </ul>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>nEXO Experiment (Photocathode)</h2>
                                        <em>2021-2024</em>
                                    </div>
                                    <p><em>University of Massachusetts Amherst</em></p>
                                    <p>Under Prof. Krishna Kumar, worked on characterization of charge clusters drifting in liquid xenon produced by a laser-driven photocathode.</p>
                                    <ul>
                                        <li>Developed noise-reduction algorithms based on digital modelling of a shaping circuit, fourier methods, and generative neural network methods.</li>
                                        <li>Assembled, tested, and set up calibration pipeline for signal processing hardware.</li>
                                        <li>Work from the team presented in poster session at Neutrino 2024.</li>
                                    </ul>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>nEXO Experiment (Optical Simulation)</h2>
                                        <em>2023</em>
                                    </div>
                                    <p><em>University of Massachusetts Amherst</em></p>
                                    <p>Under Prof. Andrea Pocar, worked on studies using experimental data and GPU-accelerated Chroma simulations to study optical properties of materials in LXe, at the scintillation wavelength of Xe.</p>
                                    <ul>
                                        <li>Optimized and refactored simulation pipeline to allow for larger numbers of simulations with changing parameters to allow for 'sweeps'.</li>
                                        <li>Used parameter sweeps to identify hardware configurations that would allow for better measurements with lower error. (Presented in internal nEXO Collaboration meeting)</li>
                                        <li>Integrate Geant4 'unified model' to allow for more realistic reflective behavior (account for 'roughness').</li>
                                    </ul>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Undergraduate Research - Quantum Information</h2>
                                        <em>2023</em>
                                    </div>
                                    <p><em>UMass Amherst</em></p>
                                    <ul>
                                        <li>Developed a high-performance Julia simulation tool to simulate n-mode gaussian states.</li>
                                        <li>Implemented efficient representations and operations to study these states, and compared performance and error to existing libraries that only supported state-vector representations.</li>
                                    </ul>
                                </div>

                            </div>
                        </section>


                        <section className="split-section" id="awards"> {/* <-- ADDED id */}
                            <div className="left-column"><h1>Awards & Honors</h1></div>
                            <div className={`${"right-column content"}, ${styles.awards}`}>
                                {/* <div className={styles.cvEntry}> */}
                                    <ul>



                                        <li>
                                            <div className={styles.eduNameDate}>
                                                <em>2025</em>
                                                <p>Fulbright Semifinalist, Fulbright Association (Research/Study, The Netherlands)</p>
                                            </div>
                                        </li>


                                        <li>
                                            <div className={styles.eduNameDate}>
                                                <em>2024</em>
                                               <div>
                                                <p>Bay State Fellowship, UMass Amherst College of Information & Computer Sciences</p>
                                            <ul><li>Competitive fellowship providing a tuition waiver and stipend for an accelerated M.S. Computer Science degree</li></ul>

                                               </div>
                                            </div>
                                        </li>

                                        <li>
                                            <div className={styles.eduNameDate}>
                                                <em>2024</em>
                                                <div>
                                                <p>Kandula Sastry Undergraduate Award, UMass Amherst Department of Physics</p>
                                            <ul><li>Awarded annually to the outstanding physics student in the graduating class</li></ul>

                                                </div>
                                            
                                            </div>
                                        </li>

                                        <li>
                                            <div className={styles.eduNameDate}>
                                                <em>2024</em>
                                                <p>Phi Beta Kappa Membership, PBK Society</p>
                                            </div>
                                        </li>

                                        <li>
                                            <div className={styles.eduNameDate}>
                                                <em>2023</em>
                                                <div>
                                                <p>LeRoy F. Cook Jr. Memorial Award, UMass Amherst Department of Physics</p>
                                            <ul><li>Awarded annually recognizing academic excellence and involvement in teaching or outreach</li></ul>

                                                </div>
                                            </div>
                                        </li>

                                        <li>
                                            <div className={styles.eduNameDate}>
                                                <em>2023</em>
                                                <p>Phi Kappa Phi Membership, PKP Society</p>
                                            </div>
                                        </li>

                                        <li>
                                            <div className={styles.eduNameDate}>
                                                <em>2020-2024</em>
                                                <div>
                                                <p>Dean's List, UMass Amherst</p>

                                            <ul><li>Awarded 7 times, all of my full-time semesters, for achieving a semester GPA of 3.5+</li></ul>
                                                </div>
                                            </div>
                                        </li>




                                    </ul>

                                </div>
                            {/* </div> */}
                        </section>

                        <section className="split-section" id="teaching"> {/* <-- ADDED id */}
                            <div className="left-column"><h1>Teaching Experience</h1></div>
                            <div className="right-column content">
                                <h3>HIGHER EDUCATION</h3>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Graduate Teaching Assistant</h2>
                                        <em>2025-2026</em>
                                    </div>
                                    <p><em>Cornell University College of Applied & Engineering Physics</em></p>
                                    <ul>
                                        <li>AEP3330 & AEP5330: Mechanics of Particles and Solid Bodies. ~20 student junior-level classical mechanics course</li>
                                    </ul>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Graduate Teaching Assistant</h2>
                                        <em>2024-2025</em>
                                    </div>
                                    <p><em>UMass Amherst College of Information & Computer Sciences</em></p>
                                    <ul>
                                        <li>CS648: Quantum Information Systems. ~40 student graduate course with a focus on quantum algorithms and error correction.</li>
                                        <li>CS250: Introduction to Computation. -300 student core class introducing proofs and computational theory</li>
                                    </ul>
                                </div>

                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Undergraduate Teaching Assistant</h2>
                                        <em>2024-2025</em>
                                    </div>
                                    <p><em>UMass Amherst</em></p>
                                    <ul>
                                        <li>CS490Q: Quantum Information Science</li>
                                        <li>PHYS281: Computational Physics (x2)</li>
                                        <li>PHYS181: Introduction to Mechanics</li>
                                    </ul>
                                </div>

                                <h3>SECONDARY EDUCATION</h3>
                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Instructor</h2>
                                        <em>June 2025</em>
                                    </div>
                                    <p><em>Hotchkiss School</em></p>
                                    <ul>
                                        <li>Instructor for inaugural 'Euclid-to-Einstein' mathematics program for selected motivated high school students</li>
                                        <li>Designed curriculum components covering multivariable calculus, differential equations, and calculus of variations</li>
                                        <li>Held classes covering advanced math topics accessible to students who have taken up to AP Calculus</li>
                                    </ul>
                                </div>
                            </div>
                        </section>




                        <section className="split-section" id="mentoring"> {/* <-- ADDED id */}
                            <div className="left-column"><h1>Mentoring Experience</h1></div>
                            <div className="right-column content">
                                <div className={styles.cvEntry}>
                                    <div className={styles.eduNameDate}>
                                        <h2>Undergraduate Peer Mentor</h2>
                                        <em>2022-2024</em>
                                    </div>
                                    <p><em>UMass Amherst</em></p>
                                    <ul>
                                        <li>Invited by both physics and CS department faculty to be paired with incoming freshman students as a peer mentor.</li>
                                        <li>Met regularly to provide social and academic support, particularly when involving course selection/planning, and getting involved in research (both with faculty on campus and applying to REUs)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>


                    </div>
                </article>
            </MathJax>
        </Layout >
    )
}

// export async function getStaticProps({ params }) {
//     const postData = await getPostData(params.slug)
//     return {
//         props: {
//             postData
//         }
//     }
// }

// export async function getStaticPaths() {
//     const fileNames = fs.readdirSync(postsDirectory)
//     const paths = fileNames.map(fileName => ({
//         params: {
//             slug: fileName.replace(/\.md$/, '')
//         }
//     }))
//     return {
//         paths,
//         fallback: false
//     }
// }