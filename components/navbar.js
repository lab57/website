import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
    return <div className={styles.outer}>
        <div className={styles.container}>
            <Link href="/">Home</Link>
            <Link href="/posts">Posts</Link>
            <Link href="/CV.pdf">CV</Link>
            <Link href="mailto: me@lucbarrett.info">Email</Link>
            {/* <Link href="https://forms.gle/68gvCWNJbEEvsPBZ9" target="_blank">Tutoring</Link> */}

        </div>
        <div className={styles.divider}></div>
    </div>

}

/**
 * 
 * 
 *             <Link href="/">Home</Link>
<Link href="/research">Research</Link>
            <Link href="/Resume.pdf">Resume</Link>
            <Link href="/newPage">Projects</Link>
            <Link href="/newPage">Contact</Link>
 * 
 */