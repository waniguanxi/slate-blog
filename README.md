# Slate blog

## Why We build it?

AI Generated documents for blog-posts I am reading


## 🪜 Framework

- Astro + React + Typescript  
- Tailwindcss + @radix-ui/colors
  - Updated to [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4) (Jan 10, 2025)
- Docsearch

## 🔨 Usage

```bash
# Start local server
npm run dev
# or
yarn dev
# or
pnpm dev

# Build
npm run build
# or
yarn build
# or
pnpm build
```

> If you fork the repository and set it to private, you will lose the association with the upstream repository by default. You can sync the latest version of Slate Blog by running `pnpm sync-latest`.

## 🗂 Directory Structure

```
- plugins/            # Custom plugins
- src/
  ├── assets/         # Asset files
  ├── components/     # Components
  ├── content/        # Content collections
  ├── helpers/        # Business logic
  ├── pages/          # Pages
  └── typings/        # Common types
```

> Articles are stored in the `src/content/post` directory, supporting markdown and mdx formats. The filename is the path name. For example, `src/content/post/my-first-post.md` => `https://your-blog.com/blog/my-first-post`.

## Configuration

Theme configuration is done through `slate.config.ts` in the root directory.

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| site | Final deployment link | `string` | - |
| title | Website title | `string` | - |
| description | Website description | `string` | - |
| lang | Language | `string` | `zh-CN` |
| theme | Theme | `{ mode: 'auto' \| 'light' \| 'dark', enableUserChange: boolean }` | `{ mode: 'auto', enableUserChange: true }` |
| avatar | Avatar | `string` | - |
| sitemap | Website sitemap configuration | [SitemapOptions](https://docs.astro.build/en/guides/integrations-guide/sitemap/)  | - |
| readTime | Show reading time | `boolean` | `false` |
| lastModified | Show last modified time | `boolean` | `false` |
| algolia | Docsearch configuration | `{ appId: string, apiKey: string, indexName: string }` | - |
| follow | Follow subscription authentication configuration | `{ feedId: string, userId: string }` | - |
| footer | Website footer configuration | `{ copyright: string }` | - |
| socialLinks | Social Links Configuration | `{ icon: [SocialLinkIcon](#SocialLinkIcon), link: string, ariaLabel?: string }` | - |




### Example

```md
---
title: 40 questions
description: This repo maintains revisons and translations to the list of 40 questions I ask myself each year and each decade.
tags:
  - Life
  - Thinking
  - Writing
pubDate: 2025-01-06
---
```

## Markdown Syntax Support

In addition to standard Markdown syntax, the following extended syntax is supported:

### Basic Syntax
- Headers, lists, blockquotes, code blocks and other basic syntax
- Tables
- Links and images
- **Bold**, *italic*, and ~strikethrough~ text

### Extended Syntax
#### Container syntax
Using `:::` markers
  ```md
  :::info
  This is an information prompt
  :::
  ```

#### LaTeX Mathematical Formulas
  - Inline formula: $E = mc^2$
  - Block formula: $$ E = mc^2 $$

#### Support for image captions
  ```md
  ![Image caption](image-url)
  ```
  
## Updates
### Version 1.2.0
- Support Social Links
- Support i18n (English and Chinese)
- Fixed known issues

### Version 1.1.1
- Fixed known issues

### Version 1.1.0
- Upgraded to support [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- Added dark mode support
- Fixed known issues
