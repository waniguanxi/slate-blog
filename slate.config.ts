import { defineConfig } from './src/helpers/config-helper';

export default defineConfig({
  lang: 'en-US',
  site: 'https://ai-blog-wani.vercel.app',
  avatar: '/avatar.png',
  title: 'Wani Blog',
  description: 'Thoughts with twist of AI',
  lastModified: true,
  readTime: true,
  footer: {
    copyright: '© 2026 Wani Design',
  },
//   socialLinks: [
//     {
//       icon: 'github',
//       link: 'https://github.com/SlateDesign/slate-blog'
//     },
// ]
});