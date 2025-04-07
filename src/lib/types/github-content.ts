interface GitHubContent {
    id: string;
    slug: string;
    data: {
      title: string;
      pubDate: Date;
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

export type { GitHubContent };