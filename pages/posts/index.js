import Link from 'next/link'
import { useState } from 'react'
import Layout from "../../components/layout"
import { getSortedPostsData } from '../../lib/posts'
import styles from '../../styles/Post-Index.module.css'

export default function BlogIndex({ posts }) {
    const [selectedTag, setSelectedTag] = useState('All');

    // Get all unique tags from posts
    // const allTags = ['All', ...new Set(posts.flatMap(post => post.tags || []))];
    const allTags = ['All', 'Blog', 'Research', 'Project']

    // Filter posts based on the selected tag
    const filteredPosts = selectedTag === 'All'
        ? posts
        : posts.filter(post => post.tags && post.tags.includes(selectedTag));

    return (
        <Layout>
            <div className={styles.postIndex}>

                <div className = {styles.titleRow}>
                    
                    <h1>Blog Posts</h1>

                    {/* Tag Filter Buttons */}
                    <div className={styles.tagFilterContainer}>
                        {allTags.map(tag => (
                            <button
                            key={tag}
                            className={`${styles.tagFilterButton} ${selectedTag === tag ? styles.active : ''}`}
                            onClick={() => setSelectedTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                </div>
                <div className={styles.postlist}>
                    {filteredPosts.map(({ slug, title, date, excerpt, tags }) => (
                        <article key={slug} className={styles.article}>
                            <Link href={`/posts/${slug}`}>
                                <div className={styles.postHeading}>
                                    <h2>{title}</h2>
                                    <time>{new Date(date).toLocaleDateString()}</time>
                                </div>

                                <div className={styles.postHeading}>

                                    {excerpt && (
                                        <p className={styles.excerpt}>{excerpt}</p>
                                    )}
                                    {/* Display Tags for each post */}
                                    {tags && (
                                        <div className={styles.tagList}>
                                            {tags.map(tag => (
                                                <span key={tag} className={styles.tag}>{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

// This runs on the server at build time
// Note: Ensure getSortedPostsData() in 'lib/posts.js' reads the `tags` array from the markdown frontmatter.
export async function getStaticProps() {
    const posts = getSortedPostsData()
    return {
        props: {
            posts
        }
    }
}