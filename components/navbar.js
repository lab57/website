import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
    return <div className={styles.outer}>
        <div className={styles.container}>
            <Link href="/newPage">Projects</Link>
            <Link href="/newPage">Experience</Link>
            <Link href="/newPage">Contact Me</Link>
        </div>
        <div className={styles.divider}></div>
    </div>

}