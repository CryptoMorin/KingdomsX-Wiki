const paddedSpace = /[\u00a0\u2007\u202f]+/g;
const malformedClosingBreak = /^\s*<\/br>\s*$/i;

function endsWithGitHubLineBreak(node, source) {
  const endOffset = node.position?.end?.offset;
  if (!Number.isInteger(endOffset) || source[endOffset - 1] !== '\\') {
    return false;
  }

  let backslashCount = 0;
  for (let offset = endOffset - 1; source[offset] === '\\'; offset -= 1) {
    backslashCount += 1;
  }

  return backslashCount % 2 === 1;
}

function normalizeTableText(node, textNodes = []) {
  if (node.type === 'text') {
    node.value = node.value.replace(paddedSpace, ' ');
    textNodes.push(node);
    return textNodes;
  }

  node.children?.forEach((child) => normalizeTableText(child, textNodes));
  return textNodes;
}

function normalizeNode(node, source) {
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

    const lastChild = node.children?.at(-1);
    if (
      lastChild?.type === 'text'
      && lastChild.value.endsWith('\\')
      && endsWithGitHubLineBreak(node, source)
    ) {
      lastChild.value = lastChild.value.slice(0, -1);
      if (lastChild.value === '') {
        node.children.pop();
      }
    }
  }

  node.children?.forEach((child) => normalizeNode(child, source));

  if (node.children) {
    node.children = node.children.filter(
      (child) => child.type !== 'paragraph' || child.children?.length > 0,
    );
  }
}

export default function normalizeWikiWhitespace() {
  return (tree, file) => normalizeNode(tree, String(file.value ?? ''));
}
