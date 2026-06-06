import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGFM from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import remarkPlaceholders from "./plugins/remark-placeholders";
import remarkMinecraftFormat from "./plugins/remark-minecraft-codes";
import rehypeForceH1Slug from './plugins/ultra-hyped-slug';
import remarkGitHubLatex from "./plugins/remark-github-latex";
import normalizeWikiLinks from "./plugins/normalize-wiki-links";

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

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'algolia-site-verification',
        content: '2A3D23472CE71508',
      }
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap',
      },
    },
  ],  

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: ['ruby', 'haskell', 'java', 'gradle', 'markup', 'yaml'],
    },
    docs: {
      sidebar: {
        hideable: true,
      }
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },

    navbar: {
      title: "KingdomsX",
      logo: {
        alt: "KingdomsX Icon",
        src: "img/favicon.ico",
        href: "https://kingdomsx.com",
      },

      items: [
        {
          to: "/Home",
          label: "Home",
          position: "left",
        },
        {
          to: "/API",
          label: "API",
          position: "left",
        },
        {
          href: "https://github.com/CryptoMorin/KingdomsX/wiki",
          label: "GitHub Version",
          position: "left",
        },
        {
          href: "https://download.kingdomsx.com/",
          label: "Download",
          position: "left",
        },

        {
          href: "https://discord.kingdomsx.com",
          position: "right",
          className: "navbar-discord-link"
        },

        {
          href: "https://github.com/CryptoMorin/KingdomsX",
          position: "right",
          className: "navbar-github-link"
        },
      ],
    }
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
          // sidebarPath: require.resolve('./sidebars.js'),
          editUrl: ({ permalink }) => {
            if (!permalink) return undefined;

            const page = permalink.replace(/\/$/, '').split('/').pop();

            return `https://github.com/CryptoMorin/KingdomsX/wiki/${page}/_edit`;
          },

          beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives, normalizeWikiLinks],

          remarkPlugins: [
            remarkGFM,
            [remarkMath, { singleDollarTextMath: false }],
            remarkGitHubLatex,
            remarkPlaceholders,
            remarkMinecraftFormat
          ],
          rehypePlugins: [
            [rehypeKatex, { strict: false }],
            rehypeSlug,
            rehypeForceH1Slug
          ],
        },

        theme: {
          customCss: [ 
            './src/css/base.css', 
            './src/css/katex.css', 
            './src/css/code.css', 
            './src/css/sidebar.css',
            './src/css/navbar.css',
            './src/css/footer.css',
            './src/css/placeholder.css'
           ],
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