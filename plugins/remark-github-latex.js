import { visit } from "unist-util-visit";

export default function remarkGitHubLatex() {
  console.log("Accepted KATEX normlization")
  return (tree) => {
    console.log("Running KATEX normlization")
    visit(tree, ["inlineMath", "math"], (node) => {
      console.log("VISIT KATEX normlization -> " + node)
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