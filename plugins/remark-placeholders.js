import { visit } from "unist-util-visit";

export default function remarkPlaceholders() {
  return (tree) => {
    visit(tree, "inlineCode", (node, index, parent) => {
      // Safety check: ensure it's not inside a code block context
      // In MDAST, inlineCode parent should NOT be "code"
      // if (!parent) return;
      // if (parent.type === "code") return;

      const text = node.value.trim();

      if (
        text.startsWith("%") &&
        text.endsWith("%") &&
        text.length > 2
      ) {
        const inner = text.slice(1, -1);

        // Don't use <code> because Docusaurus will Prism-ify it.
        // Causing "placeholder-text" to be replaced and a <pre> tag added.
        node.type = "html";
        node.value = `
<span class="placeholder-text">
<span class="placeholder-enclosure">%</span>
<span class="placeholder-content">${inner}</span>
<span class="placeholder-enclosure">%</span>
</span>
`.trim();
      }
    });
  };
}