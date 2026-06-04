const config = {
  title: 'KingdomsX Wiki',
  url: 'https://wiki.kingdomsx.com',
  baseUrl: '/',

  organizationName: 'CryptoMorin',
  projectName: 'KingdomsX',

  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    format: 'mdx',
    mdx1Compat: {
      comments: true,
      admonitions: false,
      headingIds: true,
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

module.exports = config;