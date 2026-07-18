import { visit } from "unist-util-visit";

const WIKI_ROOTS = [
  "https://github.com/CryptoMorin/KingdomsX/wiki",
  "https://wiki.kingdomsx.com",
];

export default function normalizeWikiLinks() {
  return (tree) => {
    visit(tree, "link", (node) => {
      if (!node.url) return;

      const wikiPath = getWikiPath(node.url);
      if (wikiPath !== null) {
        node.url = rewrite(wikiPath);
        return;
      }

      // Normalize GitHub anchors.
      if (node.url.startsWith('/') && node.url.includes('#')) {
        node.url = rewrite(node.url);
      }
    });
  };
};

function getWikiPath(url) {
  for (const root of WIKI_ROOTS) {
    if (url === root) return '';
    if (url.startsWith(`${root}/`) || url.startsWith(`${root}#`)) {
      return url.slice(root.length);
    }
  }

  return null;
}

function rewrite(path) {
  const [rawPage, rawAnchor] = path.split('#', 2);
  const page = rawPage.trim().replace(/^\/+|\/+$/g, '') || 'Home';
  const anchor = rawAnchor === undefined ? '' : `#${rawAnchor.trim().toLowerCase()}`;

  return `/${page}${anchor}`;
}
