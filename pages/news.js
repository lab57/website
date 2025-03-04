import React from 'react';
import Head from 'next/head';
import styles from '../styles/newspage.module.css';
import News from '../components/news';
import Link from 'next/link';


export default function NewsPage() {
    return (
        <div className={styles.container}>
            <Head>
                <title>News & Updates - Luc Barrett</title>
                <meta name="description" content="Latest news and updates from Luc Barrett" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>News & Updates</h1>

                <div className={styles.newsWrapper}>
                    <News
                        title="All Updates"
                        maxItems={0} // Show all items
                        jsonPath="/data/news.json"
                    />
                </div>

                <div className={styles.backToHome}>
                    <Link href="/">← Back to home</Link>
                </div>
            </main>
        </div>
    );
}