import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './News.module.css';

const News = ({
    newsItems = null,
    title = "News",
    maxItems = 4,
    allNewsUrl = "/news",
    jsonPath = "/data/news.json"
}) => {
    const [loadedNews, setLoadedNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // If news items are provided as a prop, use those
        if (newsItems) {
            setLoadedNews(newsItems);
            setIsLoading(false);
            return;
        }

        // Otherwise, fetch from the JSON file
        const fetchNews = async () => {
            try {
                const response = await fetch(jsonPath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch news: ${response.status}`);
                }
                const data = await response.json();
                setLoadedNews(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading news data:", error);
                setIsLoading(false);
            }
        };

        fetchNews();
    }, [newsItems, jsonPath]);

    // Parse markdown-like links to HTML
    const parseContent = (content) => {
        if (!content) return '';

        // Parse markdown links [text](url)
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        return content.replace(markdownLinkRegex, (match, text, url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${styles.inlineLink}">${text}</a>`;
        });
    };

    // Get the news items to display (either all or limited by maxItems)
    const displayedNews = maxItems > 0 ? loadedNews.slice(0, maxItems) : loadedNews;
    const hasMoreItems = maxItems > 0 && loadedNews.length > maxItems;

    if (isLoading) {
        return <div className={styles.newsContainer}>Loading news...</div>;
    }

    return (
        <div className={styles.newsContainer}>
            <div className={styles.newsBox}>
                <h2 className={styles.newsTitle}>{title}</h2>
                <ul className={styles.newsList}>
                    {displayedNews.map((item) => {
                        // Parse any markdown-style links in the title
                        const titleWithLinks = item.title ? parseContent(item.title) : '';

                        // Item with URL - External link
                        if (item.url && item.url.startsWith('http')) {
                            return (
                                <li key={item.id} className={`${styles.newsItem} ${styles.linkedItem}`}>
                                    <div className={styles.itemContainer} >

                                        <p className={styles.newsDate}>{item.date}</p>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                            <h3
                                                className={styles.newsItemTitle}
                                                dangerouslySetInnerHTML={{ __html: titleWithLinks }}
                                            />
                                        </a>
                                    </div>
                                </li>
                            );
                        }

                        // Item with URL - Internal link
                        if (item.url) {
                            return (
                                <li key={item.id} className={`${styles.newsItem} ${styles.linkedItem}`}>
                                    <div className={styles.itemContainer}>

                                        <p className={styles.newsDate}>{item.date}</p>
                                        <Link href={item.url} >
                                            <h3
                                                className={styles.newsItemTitle}
                                                dangerouslySetInnerHTML={{ __html: titleWithLinks }}
                                            />
                                        </Link>
                                    </div>
                                </li>
                            );
                        }

                        // Item without URL
                        return (
                            <li key={item.id} className={styles.newsItem}>
                                <div className={styles.itemContainer}>
                                    <p className={styles.newsDate}>{item.date}</p>
                                    <h3
                                        className={styles.newsItemTitle}
                                        dangerouslySetInnerHTML={{ __html: titleWithLinks }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Show the "Show All" link if there are more items */}
                {hasMoreItems && (
                    <div className={styles.viewAllContainer}>
                        <Link href={allNewsUrl} className={styles.viewAllLink}>
                            View All Updates
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;