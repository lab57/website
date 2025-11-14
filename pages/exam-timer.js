// import Link from 'next/link'
import { useState, useEffect } from 'react'
import Layout from "../components/layout"
import styles from '../styles/Post-Index.module.css'

export default function examTimer() {

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Set up an interval to update the time every second
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(timerId);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    // Format the time and date
    const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });


    return (
        <>
        <Layout>
            <div className={styles.postIndex} suppressHydrationWarning={true}>

                <div className="container">

                {/* Header Section */}
                <header className="header">
                    {/* Logo Placeholder (SVG) */}
                    <img src="/cornell_seal.svg" width="75px"  ></img>

                    {/* Vertical Line */}
                    <div className="verticalLine"></div>

                    {/* Text Lines */}
                    <div className="headerText">
                        <p className="title" contenteditable="true">Course Number</p>
                        <p className="subtitle" contenteditable="true">Subtitle</p>
                    </div>
                </header>

                {/* Live Clock Section */}
                <div className="clockContainer">
                    <div className="clock">{timeString}</div>
                    <div className="date">{dateString}</div>
                </div>

                {/* <p>End Time: 9:00pm</p> */}

            </div>


            </div>
        </Layout>

                    <style jsx>{`
                /* Main container for the page content */
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center; /* Align to the top */
                    min-height: 80vh;
                    padding: 2rem;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
                }

                /* Header section styling */
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    // max-width: 10000px;
                    // margin-bottom: 3rem;
                    // padding: 1.25rem;
                    // background-color: #fafafa;
                    // border: 1px solid #eaeaea;
                    border-radius: 10px;
                    gap: 10px;
                }

                /* SVG Logo styling */
                .logo {
                    width: 40px;
                    height: 40px;
                    margin-right: 1rem;
                    flex-shrink: 0; /* Prevents logo from shrinking */
                }

                /* Vertical line separator */
                .verticalLine {
                    border-left: 2px solid #d0d0d0;
                    height: 60px;
                    margin-right: .5rem;
                    margin-left: .5rem;
                }

                /* Container for the two lines of text */
                .headerText {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                /* First line of text (Title) */
                .title {
                    font-size: 2.2rem;
                    font-weight: 600;
                    color: #ffff;
                    margin: 0;
                    line-height: 1.2;
                }

                /* Second line of text (Subtitle) */
                .subtitle {
                    font-size: 1.5rem;
                    color: #fffff;
                    margin: 0;
                    line-height: 1.2;
                }

                /* Container for the clock and date */
                .clockContainer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0.5rem 3.5rem;
                    // background-color: #ffffff;
                    border-radius: 12px;
                    // box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
                    // border: 1px solid #eaeaea;
                }

                /* The live time display */
                .clock {
                    font-size: 4.5rem; /* Large, readable font */
                    font-weight: 700;
                    color: #ffff;
                    font-family: 'Inter', 'monospace', sans-serif;
                    letter-spacing: 1px;
                }

                /* The date display */
                .date {
                    font-size: 1.25rem;
                    color: #ffff;
                    // margin-top: -3.00rem;
                }
            `}</style>
            </>
    )
}

examTimer.hideNavbar = true

