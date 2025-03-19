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
