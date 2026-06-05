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
    .replaceAll('<=', "\\le")
    .replaceAll('>=', "\\ge")

    // Fix single-row separators inside cases
    .replaceAll('\\', '\\\\');
}