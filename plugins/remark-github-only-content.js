const GITHUB_ONLY_MARKER = /^<!--\s*github-only:(start|end)\s*-->$/i;

export default function remarkGithubOnlyContent() {
  return (tree, file) => {
    removeGithubOnlySections(tree, file);
  };
}

function removeGithubOnlySections(parent, file) {
  if (!Array.isArray(parent.children)) return;

  for (let index = 0; index < parent.children.length; index++) {
    const node = parent.children[index];
    const marker = getMarker(node);

    if (marker === 'start') {
      const endIndex = findClosingMarker(parent.children, index + 1);
      if (endIndex === -1) {
        file.message('Found a github-only:start marker without a matching end marker', node);
      } else {
        parent.children.splice(index, endIndex - index + 1);
        index--;
      }

      continue;
    }

    if (marker === 'end') {
      file.message('Found a github-only:end marker without a matching start marker', node);
      continue;
    }

    removeGithubOnlySections(node, file);
  }
}

function findClosingMarker(nodes, startIndex) {
  let depth = 1;

  for (let index = startIndex; index < nodes.length; index++) {
    const marker = getMarker(nodes[index]);
    if (marker === 'start') depth++;
    if (marker === 'end') depth--;
    if (depth === 0) return index;
  }

  return -1;
}

function getMarker(node) {
  if (node.type !== 'html') return null;
  return node.value.trim().match(GITHUB_ONLY_MARKER)?.[1]?.toLowerCase() ?? null;
}
