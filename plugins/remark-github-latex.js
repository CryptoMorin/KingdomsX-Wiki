import { visit } from "unist-util-visit";


export default function remarkGitHubLatex() {
  return (tree) => {
    visit(tree, "code", (node) => {
      if (node.lang === "math") {
        const before = node.value;
        node.value = normalizeKatexMath(node.value);
        console.log("KATEX :: " + before + "\n\n" + node.value);
      }
    });
  };
}

function normalizeKatexMath(input) {
  return input
    // Convert <= and >= to proper LaTeX
    .replaceAll('<=', "\\le")
    .replaceAll('>=', "\\ge")

    // Fix single-row separators inside cases
    .replaceAll(/(?<=\\)\\$/gm, '\\\\');
}