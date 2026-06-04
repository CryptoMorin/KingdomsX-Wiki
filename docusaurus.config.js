export default {
  title: 'KingdomsX Wiki',
  url: 'https://cryptomorin.github.io',
  baseUrl: 'KingdomsX-Wiki',
  favicon: '/assets/favicon.ico',
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
  },

  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: './docs',                    // Points to the cloned folder
          routeBasePath: '/',                // Wiki at root URL
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/CryptoMorin/KingdomsX.wiki/edit/main/',

          remarkPlugins: [
            require('remark-gfm').default,
          ],
        },

        blog: false,
        pages: false,
      },
    ],
  ],
};