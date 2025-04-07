
import { type GitHubContent } from '../types/github-content'
import { type GithubFileItem } from '../types/github-file-item'

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
    
    return await response.text();

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
      ? files.filter((file: File) => file.name.endsWith('.md'))
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

    const files: GithubFileItem[] = await listGitHubFiles(GITHUB_OWNER, GITHUB_REPO, postsPath);
       
    const posts = await Promise.all(
      files.map(async (file: GithubFileItem) => {        
        const content = await fetchGitHubContent(GITHUB_OWNER, GITHUB_REPO, file.path);
        const { data, content: bodyContent } = parseFrontMatter(content);        
        const { title, description, tags, draft, pubDate} = data;

        return {
          id: file.name,
          slug: file.name.replace('.md', ''),
          data: {
            title: title || file.name.replace('.md', ''),
            description,
            tags,
            draft: draft === 'true',
            pubDate: new Date(pubDate || Date.now())            
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
        } as GitHubContent;
      })
    );    
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}


