import { visit } from 'unist-util-visit';

export default function rehypeForceH1Slug() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1' && !node.properties?.id) {
        node.properties = node.properties || {};
        node.properties.id = 'hello-hi'; // or generate slug dynamically
      }
    });
  };
}