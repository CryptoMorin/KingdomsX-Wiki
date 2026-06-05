import { visit } from "unist-util-visit";
import { InlineMath, BlockMath } from "react-katex";

export default function remarkGitHubLatex() {
  return (tree) => {
    visit(tree, ["inlineMath", "math"], (node) => {
      node.value = normalizeKatexMath(node.value);
    });
  };
}

function normalizeKatexMath(input) {
  return input
    // Convert <= and >= to proper LaTeX
    .replace(/<=/g, "\\le")
    .replace(/>=/g, "\\ge")

    // Fix single-row separators inside cases
    .replace(
      /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g,
      (_, body) => {
        const fixedBody = body.replace(
          /([^\n\\])\\\s*\n/g,
          "$1\\\\\n"
        );

        return `\\begin{cases}${fixedBody}\\end{cases}`;
      }
    );
}