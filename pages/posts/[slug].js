import { getPostData } from '../../lib/posts'
import Layout from "../../components/layout"
import fs from 'node:fs'
import matter from 'gray-matter'
import path from 'node:path'
import { MathJax } from "better-react-mathjax"
import styles from '../../styles/Post.module.css'

const postsDirectory = path.join(process.cwd(), 'posts')

export default function Post({ postData }) {
    return (
        <Layout>

            <MathJax dynamic={true}>
                <article className={styles.article}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{postData.title}</h1>
                        <time className={styles.date}>
                            {new Date(postData.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>

                    {postData.excerpt && (
                        <em><p className={styles.excerpt}>{postData.excerpt}</p></em>
                    )}
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                    />
                </article>
            </MathJax>
        </Layout >
    )
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.slug)
    return {
        props: {
            postData
        }
    }
}

export async function getStaticPaths() {
    const fileNames = fs.readdirSync(postsDirectory)
    const paths = fileNames.map(fileName => ({
        params: {
            slug: fileName.replace(/\.md$/, '')
        }
    }))
    return {
        paths,
        fallback: false
    }
}