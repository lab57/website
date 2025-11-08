import styles from '../styles/Home.module.css';
import styles2 from '../styles/Availability.module.css'
import React, { useState, useEffect } from 'react';
import postStyles from "../styles/Post.module.css"
import Layout from "../components/layout"



export default function Custom404() {
      const [iframeWidth, setIframeWidth] = useState('800');
      const [iframeHeight, setIframeHeight] = useState('800');

        useEffect(() => {
            // Function to update the width based on the window size
            const handleResize = () => {
            // Example logic: make it full-wi
            setIframeWidth(.75*window.innerWidth);
            setIframeHeight(.75*window.innerHeight);


            };
        // Add event listener to call handleResize when the window is resized
        window.addEventListener('resize', handleResize);

        // Call it once on component mount to set the initial size
        handleResize();

        // Cleanup: remove the event listener when the component unmounts
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty dependency array means this effect runs only once on mount and cleanup on unmount




    return (
        <Layout>

        <div className={styles2.container}>
            <div className={postStyles.content}>

            {/* <h1>Weekly Schedule</h1> */}
            <p>
                             
                </p> 
            </div>
        <div className={styles2.aboutSection}>
            <div className={styles2.calWrapperBig}>

            <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&mode=WEEK&showCalendars=0&showTz=0&title=Luc's%20Schedule&src=bGFiMzkyQGNvcm5lbGwuZWR1&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23b31b1b&color=%230b8043"
            style={{ borderWidth: 0 }}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            title="Luc's Schedule"
            ></iframe>
            </div>

            {/* <div className={styles2.calWrapperSmall}>

<iframe
src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&mode=WEEK&showCalendars=0&showTz=0&title=Luc's%20Schedule&src=bGFiMzkyQGNvcm5lbGwuZWR1&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23b31b1b&color=%230b8043"
style={{ borderWidth: 0 }}
width={iframeWidth}

height="600"
frameBorder="0"
scrolling="no"
title="Luc's Schedule"
></iframe>
</div> */}
            </div>
        </div>
        </Layout>
    )
}