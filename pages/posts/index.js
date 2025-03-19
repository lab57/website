import Link from 'next/link'
import Layout from "../../components/layout"
import { getSortedPostsData } from '../../lib/posts'
import styles from '../../styles/Post-Index.module.css'



export default function BlogIndex({ posts }) {
    return (
        <Layout>
            <div className={styles.postIndex}>
                <h1 className="">Blog Posts</h1>
                <div className={styles.postlist}>
                    {posts.map(({ slug, title, date, excerpt }) => (
                        <article key={slug} className={styles.article}>
                            <Link href={`/posts/${slug}`} className="">
                                <div className={styles.postHeading}>
                                    <h2 className="">
                                        {title}
                                    </h2>
                                    <time className={styles.date}>
                                        {new Date(date).toLocaleDateString()}
                                    </time>
                                </div>
                                {excerpt && (
                                    <p className={styles.excerpt}>{excerpt}</p>
                                )}
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

// This runs on the server at build time
export async function getStaticProps() {
    const posts = getSortedPostsData()
    return {
        props: {
            posts
        }
    }
}