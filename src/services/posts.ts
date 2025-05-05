'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Represents a post.
 */
export interface Post {
  /**
   * The title of the post.
   */
  title: string;
  /**
   * The URL-friendly slug for the post.
   */
  slug: string;
  /**
   * The content of the post in Markdown format.
   */
  content: string;
  /**
   * The tags associated with the post.
   */
  tags: string[];
  /**
   * The date the post was published. ISO 8601 format recommended (YYYY-MM-DD).
   */
  date: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * Asynchronously retrieves all posts from the local `posts` directory.
 *
 * @returns A promise that resolves to an array of Post objects.
 */
export async function getPosts(): Promise<Post[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md')) // Only process markdown files
      .map(fileName => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the slug and content
        return {
          slug,
          title: matterResult.data.title || 'Untitled Post', // Provide default title
          date: matterResult.data.date || new Date().toISOString().split('T')[0], // Provide default date
          tags: matterResult.data.tags || [], // Provide default tags
          content: matterResult.content,
        };
      });

    // Sort posts by date descending
    return allPostsData.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error reading posts directory:", error);
    // In case of error (e.g., directory doesn't exist), return an empty array
    return [];
  }
}

/**
 * Asynchronously retrieves a single post by its slug.
 *
 * @param slug - The slug of the post to retrieve.
 * @returns A promise that resolves to the Post object or undefined if not found.
 */
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find(post => post.slug === slug);
}
