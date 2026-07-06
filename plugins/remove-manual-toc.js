import { visit } from "unist-util-visit";

// Removes Table of Content (ToC) we added manually in GitHub's wiki.
export default function removeToC(pageName) {
  return (tree, file) => {
    console.log("File", file);
    console.log("Path", file.path);
    console.log("History", file.history);
    console.log("data", file.data);

    visit(tree, "element", (node, index, parent) => {
      // We target the <h4> element and start splicing down from there.
      if (
        node.tagName === "h4" &&
        node.properties?.id === "table-of-content" &&
        parent &&
        typeof index === "number"
      ) {
        // Remove:
        // <h4 id="table-of-content">
        // <ul>...</ul>
        // <hr>

        let count = 1;

        if (parent.children[index + 1]?.tagName === "ul") {
          count++;
        }

        if (parent.children[index + count]?.tagName === "hr") {
          count++;
        }

        parent.children.splice(index, count);
      }
    });
  };
}