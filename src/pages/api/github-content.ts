import { title } from "process";

interface GitHubContent {
  id: string;
  slug: string;
  data: {
    title: string;
    pubDate: string;
    draft: boolean;
    description?: string;
    [key: string]: any;
  };
  body: string;
  render: () => Promise<{
    Content: string;
    headings: any[];
    remarkPluginFrontmatter: {
      lastModified?: string;
      minutesRead: string;
    };
  }>;
}

const GITHUB_TOKEN = import.meta.env.GITHUB_BLOG_TOKEN;
const GITHUB_OWNER = import.meta.env.GITHUB_OWNER;
const GITHUB_REPO = import.meta.env.GITHUB_REPO;

function buildPath(owner: string, repo: string, path: string){
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
}

async function fetchGitHubContent(owner: string, repo: string, path: string) {
  const headers = {
    'Accept': 'application/vnd.github.v3.raw',
    'User-Agent': 'AstroSite',
    'Authorization': `Bearer ${GITHUB_TOKEN}`
  };

  try {    
    const response = await fetch(
      buildPath(owner, repo, path),
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    throw error;
  }
}

async function listGitHubFiles(owner: string, repo: string, path: string) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'AstroSite',
    'Authorization': `Bearer ${GITHUB_TOKEN}`
  };

  try {    
    const response = await fetch(
      buildPath(owner, repo, path),
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();
    
    return Array.isArray(files) 
      ? files.filter((file: any) => file.name.endsWith('.md'))
      : [];
  } catch (error) {
    console.error('Error listing GitHub files:', error);
    throw error;
  }
}

function parseFrontMatter(content: string) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return { data: {}, content };

  try {
    const frontmatter = match[1];
    const restContent = content.slice(match[0].length);
    
    const data = Object.fromEntries(
      frontmatter.split('\n')
        .filter(line => line.includes(':'))
        .map(line => {
          const [key, ...values] = line.split(':');
          return [key.trim(), values.join(':').trim()];
        })
    );

    return {
      data,
      content: restContent
    };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return { data: {}, content };
  }
}

export async function getGitHubPosts(): Promise<GitHubContent[]> {
  try {    
    const postsPath = 'posts';

    const files = await listGitHubFiles(GITHUB_OWNER, GITHUB_REPO, postsPath);
       
    const posts = await Promise.all(
      files.map(async (file: any) => {
        const content = await fetchGitHubContent(GITHUB_OWNER, GITHUB_REPO, file.path);
        const { data, content: bodyContent } = parseFrontMatter(content);
        const title = data.title || file.name.replace('.md', '');
        return {
          id: file.name,
          slug: file.name.replace('.md', ''),
          data: {
            ...data,
            draft: data.draft === 'true',
            pubDate: new Date(data.pubDate || Date.now()).toISOString(),
            title: title
          },
          body: bodyContent,
          render: async () => ({
            Content: bodyContent,
            headings: [], // Implement heading parsing if needed
            remarkPluginFrontmatter: {
              lastModified: data.lastModified,
              minutesRead: '5'
            }
          })
        };
      })
    );
    console.log('Posts: ', posts);
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export type { GitHubContent };
