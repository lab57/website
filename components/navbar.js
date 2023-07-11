import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
    return <div className={styles.outer}>
        <div className={styles.container}>
            <Link href="/">Home</Link>
            <Link href="/research">Research</Link>
            <Link href="/Resume.pdf">Resume</Link>
            <Link href="/newPage">Projects</Link>
            <Link href="/newPage">Contact</Link>
        </div>
        <div className={styles.divider}></div>
    </div>

}