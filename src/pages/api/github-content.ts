import { Octokit } from "@octokit/rest";
import type { APIRoute } from "astro";

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN
});

export const get: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  const owner = url.searchParams.get('owner');
  const repo = url.searchParams.get('repo');
  const path = url.searchParams.get('path');  

  if (!owner || !repo || !path) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString();
      return new Response(JSON.stringify({ content }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Error fetching content for params: ${params} with error: ${error}` }), { status: 500 });
  }
};


/**
 * 
PROMPT: how to modify or replace getCollection function in open file so as to fetch contents from a github repo


You can modify the

getStaticPaths

function to fetch content from a GitHub repo. Here's how you can do it:

export async function getStaticPaths() {
  // Function to fetch content from GitHub
  async function fetchGithubContent(owner: string, repo: string, path: string) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${import.meta.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // If it's a directory, fetch all markdown files
    if (Array.isArray(data)) {
      return Promise.all(
        data
          .filter(file => file.name.endsWith('.md'))
          .map(async file => {
            const content = await fetch(file.download_url);
            const text = await content.text();
            // Parse frontmatter and content
            const [, frontmatter, ...contentParts] = text.split('---');
            const data = JSON.parse(frontmatter);
            return {
              slug: file.name.replace('.md', ''),
              data,
              body: contentParts.join('---'),
              render: async () => {
                // You'll need to implement markdown parsing here
                // This is a simplified version
                return {
                  Content: () => contentParts.join('---'),
                  remarkPluginFrontmatter: data,
                  headings: [] // You'll need to parse headings from the content
                };
              }
            };
          })
      );
    }
    return [];
  }

  try {
    const posts = await fetchGithubContent(
      'your-github-username',
      'your-repo-name',
      'path/to/content/folder'
    );

    // Filter posts similar to original code
    const filteredPosts = posts.filter(post => 
      import.meta.env.DEV || post.data.draft !== true
    );

    return filteredPosts.map((post) => ({
      params: { slug: post.slug },
      props: post,
    }));
  } catch (error) {
    console.error('Error fetching content from GitHub:', error);
    return [];
  }
}

typescript

To use this code, you'll need to:

    Create a GitHub Personal Access Token and add it to your environment variables:

GITHUB_TOKEN=your_github_token_here

env

    Install a markdown parser (if you want to parse the markdown content):

npm install marked

bash

    For better markdown parsing and frontmatter handling:

import { marked } from 'marked';
import yaml from 'js-yaml';

// Inside fetchGithubContent function:
const parseFrontmatterAndContent = (text: string) => {
  const [, frontmatterYaml, ...contentParts] = text.split('---');
  const data = yaml.load(frontmatterYaml);
  const content = contentParts.join('---');
  
  return {
    data,
    content,
    render: async () => {
      const parsedContent = marked(content);
      // Parse headings
      const headings = content
        .split('\n')
        .filter(line => line.startsWith('#'))
        .map(heading => ({
          depth: heading.match(/^#+/)[0].length,
          text: heading.replace(/^#+\s+/, '')
        }));

      return {
        Content: () => parsedContent,
        remarkPluginFrontmatter: data,
        headings
      };
    }
  };
};

typescript

    Update your template to handle potential errors:

<PageLayout title={post.data.title} description={post.data.description}>
  {post ? (
    <>
      <!-- Your existing template code -->
    </>
  ) : (
    <div>Error loading post</div>
  )}
</PageLayout>

astro

Important considerations:

    Rate Limiting: GitHub API has rate limits. Consider implementing caching.

    Error Handling: Add proper error handling for API failures.

    Authentication: Use appropriate GitHub token scopes.

    Performance: Consider implementing caching mechanisms for production.

    Markdown Parsing: You might need additional plugins/configuration for full markdown feature support.

You might also want to add caching:

const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const cache = new Map();

function getCachedContent(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedContent(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

typescript

This is a basic implementation. Depending on your needs, you might want to:

    Add more robust error handling

    Implement proper caching strategies

    Add support for more markdown features

    Handle GitHub API pagination for large repositories

    Add TypeScript types for better type safety

 */