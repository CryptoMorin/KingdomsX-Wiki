import { visit } from "unist-util-visit";

const GITHUB_WIKI_PREFIX = "https://github.com/CryptoMorin/KingdomsX/wiki/";
const CUSTOM_WIKI_PREFIX = "https://wiki.kingdomsx.com/";

export default function normalizeWikiLinks() {
  return (tree) => {
    visit(tree, "link", (node) => {
      if (!node.url) return;

      // Normalize GitHub wiki links → custom wiki domain
      if (node.url.startsWith(GITHUB_WIKI_PREFIX)) {
        node.url = rewrite(node.url);
      }

      // Normalize custom wiki links (optional second rule)
      if (node.url.startsWith(CUSTOM_WIKI_PREFIX)) {
        node.url = rewrite(node.url);
      }
    });
  };
};

// Example rewrite strategy
function rewrite(url) {
  const path = url
    .replace(GITHUB_WIKI_PREFIX, "")
    .replace(CUSTOM_WIKI_PREFIX, "");

  return `/${path}`;
}