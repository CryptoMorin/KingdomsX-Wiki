import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGFM from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import remarkPlaceholders from "./plugins/remark-placeholders";
import remarkMinecraftFormat from "./plugins/remark-minecraft-codes";
import rehypeForceH1Slug from './plugins/ultra-hyped-slug';
import remarkGitHubLatex from "./plugins/remark-github-latex";

import {themes} from 'prism-react-renderer';
import prism from 'prismjs';

export default {
  title: 'KingdomsX Wiki',
  url: 'https://wiki.kingdomsx.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  tagline: 'The official KingdomsX comprehensive wiki.',

  organizationName: 'CryptoMorin',
  projectName: 'KingdomsX',
  deploymentBranch: 'gh-pages',
  githubHost: 'github.io',

  trailingSlash: false,
  onBrokenLinks: 'warn',

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: ['ruby', 'haskell', 'java'],
    },
  },

  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: ['/', '/KingdomsX-Wiki'],
            to: '/Home',
          },
        ],
      },
    ],
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: './docs',                  // Points to the cloned folder
          routeBasePath: '/',              // Wiki at root URL
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: (blogDirPath, blogPath, permaLink, locale) => `https://github.com/CryptoMorin/KingdomsX/wiki/${blogPath}/_edit`,

          beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives],

          remarkPlugins: [
            remarkGFM,
            remarkMath,
            remarkPlaceholders,
            remarkMinecraftFormat,
            remarkGitHubLatex
          ],
          rehypePlugins: [
            [rehypeKatex, { strict: false }],
            rehypeSlug,
            rehypeForceH1Slug
          ],
        },

        theme: {
          customCss: [ './src/css/base.css', './src/css/katex.css', './src/css/placeholder.css' ],
        },

        blog: false,
        pages: false,
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css',
      type: 'text/css',
    },
  ],
};

prism.languages.hs = prism.languages.haskell;