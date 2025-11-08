import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

const postsDirectory = path.join(process.cwd(), 'posts')

// --- MODIFIED to handle both .md and .html files ---
export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
        .filter(fileName => !fileName.startsWith('.')) // Keep ignoring hidden files
        .map(fileName => {
            const slug = fileName.replace(/\.md$|\.html$/, '')
            const fullPath = path.join(postsDirectory, fileName)

            if (fileName.endsWith('.md')) {
                // Standard Markdown processing
                const fileContents = fs.readFileSync(fullPath, 'utf8')
                const matterResult = matter(fileContents)
                return {
                    slug,
                    ...matterResult.data,
                }
            } else if (fileName.endsWith('.html')) {
                // Extract metadata from HTML meta tags
                const fileContents = fs.readFileSync(fullPath, 'utf8')
                
                // Helper function to parse meta tags
                const getMeta = (name) => {
                    const regex = new RegExp(`<meta name="${name}" content="(.*?)"`)
                    const match = fileContents.match(regex)
                    return match ? match[1] : null
                }
                
                const title = getMeta('title') || slug.replace(/-/g, ' ')
                const date = getMeta('date') || fs.statSync(fullPath).mtime.toISOString()
                const excerpt = getMeta('excerpt')
                const tags = getMeta('tags') ? getMeta('tags').split(',').map(t => t.trim()) : []
                
                return { slug, title, date, excerpt, tags }
            }
        })
        .filter(Boolean) // Remove any undefined entries from non-md/html files

    // Sort posts by date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) return 1
        else if (a > b) return -1
        else return 0
    })
}

// --- MODIFIED to handle both .md and .html files ---
export async function getPostData(slug) {
    const mdPath = path.join(postsDirectory, `${slug}.md`)
    const htmlPath = path.join(postsDirectory, `${slug}.html`)

    if (fs.existsSync(mdPath)) {
        // --- Markdown File Logic (from your original file) ---
        const fileContents = fs.readFileSync(mdPath, 'utf8')
        const matterResult = matter(fileContents)
        
        const processor = remark().use(html, { sanitize: false }).use(remarkGfm).use(remarkBreaks);
        const markdownSections = matterResult.content.split(/(?=^# )/m).filter(s => s.trim() !== '');
        const processedSections = await Promise.all(
            markdownSections.map(async (section) => {
                const firstNewline = section.indexOf('\n');
                const h1Markdown = section.substring(0, firstNewline);
                const contentMarkdown = section.substring(firstNewline + 1);
                const h1Html = (await processor.process(h1Markdown)).toString();
                const contentHtml = (await processor.process(contentMarkdown)).toString();
                return { h1Html, contentHtml };
            })
        );
        const finalHtml = `<div class="article-body">${processedSections.map(section => `<section class="split-section"><div class="left-column">${section.h1Html}</div><div class="right-column content">${section.contentHtml}</div></section>`).join('')}</div>`;

        return { slug, contentHtml: finalHtml, ...matterResult.data }

    } else if (fs.existsSync(htmlPath)) {
        // --- HTML File Logic (New) ---
        const fileContents = fs.readFileSync(htmlPath, 'utf8')

        // Helper function to parse meta tags
        const getMeta = (name) => {
            const regex = new RegExp(`<meta name="${name}" content="(.*?)"`)
            const match = fileContents.match(regex)
            return match ? match[1] : null
        }
        
        // Extract body content, excluding the body tag itself
        const bodyMatch = fileContents.match(/<body[^>]*>([\s\S]*)<\/body>/)
        const contentHtml = bodyMatch ? bodyMatch[1] : ''
        
        // Extract metadata for the page header
        const title = getMeta('title') || slug.replace(/-/g, ' ')
        const date = getMeta('date') || fs.statSync(htmlPath).mtime.toISOString()
        const excerpt = getMeta('excerpt')
        
        return { slug, contentHtml, title, date, excerpt }
    }
}