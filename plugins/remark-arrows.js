import {visit} from 'unist-util-visit';

const spacedArrow = /[ \t]+->[ \t]+/g;

export default function remarkArrows() {
  return (tree) => {
    visit(tree, ['text', 'inlineCode'], (node) => {
      node.value = node.value.replace(spacedArrow, ' → ');
    });
  };
}
