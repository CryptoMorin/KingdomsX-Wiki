import { visit } from "unist-util-visit";

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
    .replace('<=', "\\le")
    .replace('>=', "\\ge")

    // Fix single-row separators inside cases
    .replaceAll(/\\$/gm, '\\\\');
}