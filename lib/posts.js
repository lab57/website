import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getPostData(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // --- START: MODIFIED HTML PROCESSING ---

    // 1. Define a reusable remark processor.
    const processor = remark()
        .use(html, { sanitize: false })
        .use(remarkGfm)
        .use(remarkBreaks);

    // 2. Split the markdown content by H1 headings.
    // The regex splits the string before each line that starts with '# ', keeping the delimiter.
    const markdownSections = matterResult.content.split(/(?=^# )/m).filter(s => s.trim() !== '');

    // 3. Process each section individually.
    const processedSections = await Promise.all(
        markdownSections.map(async (section) => {
            const firstNewline = section.indexOf('\n');

            // Separate the H1 markdown from the rest of the content
            const h1Markdown = section.substring(0, firstNewline);
            const contentMarkdown = section.substring(firstNewline + 1);

            // Convert both parts to HTML
            const h1Html = (await processor.process(h1Markdown)).toString();
            const contentHtml = (await processor.process(contentMarkdown)).toString();

            return { h1Html, contentHtml };
        })
    );

    // 4. Assemble the final HTML structure.
    const finalHtml = `
      <div class="article-body">
        ${processedSections.map(section => `
          <section class="split-section">
            <div class="left-column">
              ${section.h1Html}
            </div>
            <div class="right-column content">
              ${section.contentHtml}
            </div>
          </section>
        `).join('')}
      </div>
    `;

    // --- END: MODIFIED HTML PROCESSING ---

    return {
        slug,
        contentHtml: finalHtml, // Return the newly structured HTML
        ...matterResult.data
    }
}

// Your getSortedPostsData function can remain the same.
export function getSortedPostsData() {
    // This function is only called server-side in getStaticProps
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
        .filter(fileName => !fileName.startsWith('.'))
        .map(fileName => {
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