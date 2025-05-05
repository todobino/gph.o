/**
 * Represents a blog post.
 */
export interface BlogPost {
  /**
   * The title of the blog post.
   */
  title: string;
  /**
   * The content of the blog post in Markdown format.
   */
  content: string;
  /**
   * The tags associated with the blog post.
   */
  tags: string[];
  /**
   * The date the blog post was published. ISO 8601 format recommended (YYYY-MM-DD).
   */
  date: string;
}

/**
 * Asynchronously retrieves all blog posts from a GitHub repository.
 *
 * @returns A promise that resolves to an array of BlogPost objects.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  // TODO: Implement this by calling the GitHub API.
  // Fetch markdown files from a specific directory in the repo.
  // Parse frontmatter (if used) for metadata like title, date, tags.
  // Return structured data.

  // For now, returning more detailed mock data:
  return [
    {
      title: 'First Thoughts on Agile',
      content: '# Agile Intro\n\nThis is the first paragraph about agile methodologies. It covers the basics.\n\n## Key Principles\n\n- Individuals and interactions over processes and tools\n- Working software over comprehensive documentation',
      tags: ['agile', 'software development'],
      date: '2024-05-15',
    },
    {
      title: 'Deep Dive into TDD',
      content: '# Test-Driven Development\n\nExploring TDD practices. Why write tests first?\n\n```javascript\nfunction testAdd() {\n  assert.equal(add(1, 2), 3);\n}\n```\n\nBenefits include better design and fewer bugs.',
      tags: ['tdd', 'testing', 'software development'],
      date: '2024-04-22',
    },
     {
      title: 'Video: Pair Programming Session',
      content: '# Pairing Fun!\n\nWatch this session where we tackle a complex problem using pair programming.\n\n![Pairing](https://picsum.photos/seed/pairing/600/400)\n\nWe discuss communication strategies and driver/navigator roles.',
      tags: ['pair programming', 'video', 'agile'],
      date: '2024-06-01',
    },
    {
      title: 'Understanding Refactoring',
      content: '# Refactoring Techniques\n\nImproving the design of existing code without changing its external behavior.\n\nWhy refactor?\n\n- Improve readability\n- Reduce complexity\n- Make code easier to maintain',
      tags: ['refactoring', 'clean code'],
      date: '2024-03-10',
    },
     {
      title: 'Video: Code Smells and How to Fix Them',
      content: '# Code Smells Video\n\nThis video identifies common code smells and demonstrates refactoring techniques to eliminate them.\n\nCovered smells:\n- Long Method\n- Duplicated Code',
      tags: ['code quality', 'video', 'refactoring'],
      date: '2024-05-05',
    },
     {
      title: 'Video: Introduction to Mob Programming',
      content: '# Mob Programming Explained\n\nAn introductory video explaining the concept of mob programming, where the whole team works on the same thing, at the same time, in the same space, and at the same computer.\n\nDiscussing benefits and challenges.',
      tags: ['mob programming', 'video', 'agile', 'teamwork'],
      date: '2023-11-18',
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort posts by date descending
}
