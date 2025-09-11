import Link from 'next/link';
import styles from './navbar.module.css';
import { useState, useEffect } from 'react';

export default function Navbar({
    scrollProgress = 0,
    showProgress = false,
    showName = true
}) {
    // 1. Initialize the state directly from the 'showName' prop.
    const [isNameVisible, setIsNameVisible] = useState(showName);

    // 2. This effect now only runs when the 'showName' prop changes
    // after the initial render.
    useEffect(() => {
        setIsNameVisible(showName);
    }, [showName]);

    return (
        <div className={styles.outer}>
            <div className={styles.container}>
                <h2 className={`${styles.myName} ${isNameVisible ? styles.show : ''}`}>
                    Luc Barrett.
                </h2>

                <div className={styles.linksWrapper}>
                    <Link href="/">Home</Link>
                    <Link href="/posts">Posts</Link>
                    <Link href="/CV.pdf">CV</Link>
                    <Link href="mailto: me@lucbarrett.info">Email</Link>
                    {/* <Link href="/availability">Availability</Link> */}
                </div>
            </div>
            <div className={styles.divider}>
                {showProgress && (
                    <div
                        className={styles.progressFill}
                        style={{ width: `${scrollProgress * 100}%` }}
                    />
                )}
            </div>
        </div>
    );
}