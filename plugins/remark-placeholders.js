import { visit } from "unist-util-visit";

export default function remarkPlaceholders() {
  return (tree) => {
    visit(tree, "inlineCode", (node) => {
      const text = node.value.trim();

      if (
        text.startsWith("%") &&
        text.endsWith("%") &&
        text.length > 2
      ) {
        const inner = text.slice(1, -1);

        node.type = "html";
        node.value = `
<code class="placeholder-text">
  <span class="placeholder-enclosure">%</span>
  <span class="placeholder-content">${inner}</span>
  <span class="placeholder-enclosure">%</span>
</code>
`;
      }
    });
  };
}