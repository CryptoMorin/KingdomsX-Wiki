const config = {
  title: 'KingdomsX Wiki',
  url: 'https://wiki.kingdomsx.com',
  baseUrl: '/',

  organizationName: 'CryptoMorin',
  projectName: 'KingdomsX',

  trailingSlash: false,

//   onBrokenLinks: 'throw',
//   onBrokenMarkdownLinks: 'warn',

//   // Other common settings for a wiki
//   favicon: 'img/favicon.ico',
//   themeConfig: {
//     navbar: {
//       title: 'Your Wiki',
//       logo: { /* ... */ },
//       items: [
//         { to: '/docs/intro', label: 'Docs', position: 'left' },
//         // Add more nav items
//       ],
//     },
//     footer: { /* ... */ },
//   },

presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: './docs',                    // Points to the cloned folder
          routeBasePath: '/',                // Wiki at root URL
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/CryptoMorin/KingdomsX.wiki/edit/main/',

          // Correct way in Docusaurus v3:
          remarkPlugins: [
            require('remark-gfm'),           // GitHub Flavored Markdown
          ],

          // Optional: Disable some strict MDX behaviors
          markdown: {
            format: 'mdx',
            mdx1Compat: {
              comments: true,
              admonitions: false,     // Turn off if causing issues
              headingIds: true,
            },
          },
        },

        blog: false,
        pages: false,
      },
    ],
  ],
};

module.exports = config;