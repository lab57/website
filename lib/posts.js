import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getPostData(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html, { sanitize: false }) // Prevent sanitization of math
        .use(remarkGfm)
        .process(matterResult.content)

    const contentHtml = processedContent.toString()

    return {
        slug,
        contentHtml,
        ...matterResult.data
    }
}

export function getSortedPostsData() {
    // This function is only called server-side in getStaticProps
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        return {
            slug,
            ...matterResult.data
        }
    })

    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) return 1
        else if (a > b) return -1
        else return 0
    })
}