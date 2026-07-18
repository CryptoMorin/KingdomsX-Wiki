import { visit } from "unist-util-visit";
import logger from '@docusaurus/logger';

// Removes Table of Content (ToC) we added manually in GitHub's wiki.
export default function removeToC(pageName) {
  return (tree, file) => {
    // /home/runner/work/KingdomsX-Wiki/KingdomsX-Wiki/docs/FAQ.md
    // /home/runner/work/KingdomsX-Wiki/KingdomsX-Wiki/docs/NFAQ.md
    const normalizedPath = file.path.replaceAll('\\', '/'); // Happens when ran on Windows.
    const faq = normalizedPath.endsWith("/FAQ.md");
    const nfaq = normalizedPath.endsWith("/NFAQ.md");
    if (!faq && !nfaq) return;
    logger.info`Removing ToC ${faq ? "FAQ" : "NFAQ"}: ${file.path}`

    let handle = 0;
    visit(tree, "heading", (node, index, parent) => {
      // console.log(handle, "Found node", node);
      // console.log(handle, "Found index", index);
      // console.log(handle, "First child", (node.children.length > 0 ? node.children[0] : "NO CHILD"));
      // handle++;

      if (
        !parent ||
        typeof index !== "number" ||
        node.depth !== 4 ||
        node.children.length !== 1 ||
        node.children[0].type !== "text" ||
        node.children[0].value !== "Table of Contents"
      ) {
        return;
      }

      let removeCount = 1;

      // Remove the following unordered list.
      if (parent.children[index + 1]?.type === "list") {
        removeCount++;
      }

      // Remove the following thematic break (___, ---, or ***).
      if (parent.children[index + removeCount]?.type === "thematicBreak") {
        removeCount++;
      }

      parent.children.splice(index, removeCount);
    });
  };
}