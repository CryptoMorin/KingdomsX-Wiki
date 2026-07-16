import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGFM from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import remarkPlaceholders from "./plugins/remark-placeholders.js";
import remarkArrows from "./plugins/remark-arrows.js";
import remarkMinecraftFormat from "./plugins/remark-minecraft-codes.js";
import rehypeForceH1Slug from './plugins/ultra-hyped-slug.js';
import remarkGitHubLatex from "./plugins/remark-github-latex.js";
import remarkGithubOnlyContent from "./plugins/remark-github-only-content.js";
import remarkMediaAttachments from "./plugins/remark-media-attachments.js";
import remarkYoutubeEmbeds from "./plugins/remark-youtube-embeds.js";
import normalizeWikiLinks from "./plugins/normalize-wiki-links.js";
import removeToC from "./plugins/remove-manual-toc.js";
import normalizeWikiWhitespace from "./plugins/normalize-wiki-whitespace.js";
import createWikiPageMetadataParser from './plugins/wiki-page-metadata.js';

import {themes} from 'prism-react-renderer';
import prism from 'prismjs';

const siteUrl = 'https://wiki.kingdomsx.com';
const siteDescription = 'Official wiki for KingdomsX, a Minecraft plugin similar to Factions which provides more advanced features, mechanics & invasions to make the game more fun.';
const siteKeywords = 'Kingdoms, KingdomsX, KingdomsX wiki, Minecraft kingdoms plugin, Minecraft factions plugin, Spigot plugin, land claiming plugin, Minecraft server plugin, PvP plugin';

export default {
  title: 'KingdomsX Wiki',
  url: siteUrl,
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  tagline: siteDescription,
  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
      },
    },
  },

  customFields: {
    siteDescription,
  },

  organizationName: 'CryptoMorin',
  projectName: 'KingdomsX',
  deploymentBranch: 'gh-pages',
  githubHost: 'github.io',

  trailingSlash: false,
  onBrokenLinks: 'warn',

  clientModules: [
    './src/js/hash-scroll.js',
    './src/js/sidebar-active-links.js',
    './src/js/page-transition.js',
  ],

  headTags: [
    // {
    //   tagName: 'meta',
    //   attributes: {
    //     name: 'algolia-site-verification',
    //     content: '2A3D23472CE71508',
    //   }
    // },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#071019',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'color-scheme',
        content: 'dark light',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'referrer',
        content: 'strict-origin-when-cross-origin',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'format-detection',
        content: 'telephone=no',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/favicon-96x96.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'apple-mobile-web-app-title',
        content: 'KingdomsX',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'msapplication-TileColor',
        content: '#071019',
      },
    },
  ],

  themeConfig: {
    image: 'img/social-card.webp',
    mermaid: {
      theme: {
        light: 'neutral',
        dark: 'dark',
      },
      options: {
        fontFamily: 'var(--wiki-body-font)',
      },
    },
    metadata: [
      {
        name: 'description',
        content: siteDescription,
      },
      {
        name: 'keywords',
        content: siteKeywords,
      },
      {
        name: 'author',
        content: 'Crypto Morin',
      },
      {
        name: 'application-name',
        content: 'KingdomsX',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'KingdomsX',
      },
      {
        property: 'og:image:type',
        content: 'image/webp',
      },
      {
        property: 'og:image:secure_url',
        content: `${siteUrl}/img/social-card.webp`,
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'KingdomsX plugin banner',
      },
      {
        name: 'twitter:image:alt',
        content: 'KingdomsX plugin banner',
      },
    ],

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
      },
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },

    navbar: {
      title: "KingdomsX",
      logo: {
        alt: "KingdomsX Icon",
        src: "img/logo.webp",
        href: "/Home",
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
          type: "custom-githubWikiPage",
          label: "GitHub Version",
          position: "left",
        },
        {
          href: "https://download.kingdomsx.com/",
          label: "Download",
          position: "left",
        },
        {
          href: "https://servers.kingdomsx.com",
          label: "Servers",
          position: "left",
        },
        {
          href: "https://discord.kingdomsx.com",
          label: "Discord",
          position: "right",
          className: "navbar-discord-link",
        },
        {
          href: "https://kingdomsx.com",
          label: "Website",
          position: "right",
          className: "navbar-website-link",
        },
        {
          href: "https://github.com/CryptoMorin/KingdomsX",
          label: "GitHub",
          position: "right",
          className: "navbar-github-link",
        },
      ],
    },

    algolia: {
      appId: 'AOVZY9BUS7',

      // Public API key: it is safe to commit it
      apiKey: '8cb81bcf4ec3a084e26cfd536d479a03',

      indexName: 'Docusaurus DocSearch Crawler',

      contextualSearch: false,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      // externalUrlRegex: 'github\\.com|github\\.io',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      // Algolia's Gemini implementation is screwed up right now.
      // askAi: 'd8112ff1-a3d4-491d-be88-c4160badf655',
    },
  },

  markdown: {
    format: 'detect',
    mermaid: true,
    parseFrontMatter: createWikiPageMetadataParser({
      fallbackDescription: siteDescription,
    }),
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
            from: [
              // '/' is handled by src/pages/index.js so the dev server has a real root route
              '/KingdomsX-Wiki',
            ],
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
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'sidenav/**',
          ],
          sidebarPath: './sidebars.js',
          editUrl: ({ permalink }) => {
            if (!permalink) return undefined;

            const page = permalink.replace(/\/$/, '').split('/').pop();

            return `https://github.com/CryptoMorin/KingdomsX/wiki/${page}/_edit`;
          },

          beforeDefaultRemarkPlugins: [
            remarkGithubOnlyContent,
            remarkGithubAdmonitionsToDirectives,
            normalizeWikiLinks,
            removeToC,
          ],

          remarkPlugins: [
            remarkGFM,
            remarkYoutubeEmbeds,
            remarkMediaAttachments,
            [remarkMath, { singleDollarTextMath: false }],
            remarkGitHubLatex,
            remarkArrows,
            remarkPlaceholders,
            remarkMinecraftFormat,
            normalizeWikiWhitespace,
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
        sitemap: {
          ignorePatterns: ['/search'],
        },
        pages: {
          path: './src/pages',
        },
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
