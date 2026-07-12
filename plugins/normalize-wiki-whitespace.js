const paddedSpace = /[\u00a0\u2007\u202f]+/g;
const malformedClosingBreak = /^\s*<\/br>\s*$/i;

function normalizeTableText(node, textNodes = []) {
  if (node.type === 'text') {
    node.value = node.value.replace(paddedSpace, ' ');
    textNodes.push(node);
    return textNodes;
  }

  node.children?.forEach((child) => normalizeTableText(child, textNodes));
  return textNodes;
}

function normalizeNode(node) {
  if (node.children) {
    node.children = node.children.filter(
      (child) => child.type !== 'html' || !malformedClosingBreak.test(child.value),
    );
  }

  if (node.type === 'tableCell') {
    const textNodes = normalizeTableText(node);
    if (textNodes.length > 0) {
      textNodes[0].value = textNodes[0].value.trimStart();
      textNodes.at(-1).value = textNodes.at(-1).value.trimEnd();
    }
  }

  if (node.type === 'paragraph') {
    while (
      node.children?.at(-1)?.type === 'break'
      || (node.children?.at(-1)?.type === 'text' && node.children.at(-1).value.trim() === '')
    ) {
      node.children.pop();
    }
  }

  node.children?.forEach(normalizeNode);
}

export default function normalizeWikiWhitespace() {
  return (tree) => normalizeNode(tree);
}
