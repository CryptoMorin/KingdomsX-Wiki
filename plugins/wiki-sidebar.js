import fs from 'node:fs';
import path from 'node:path';

const githubWikiPath = '/CryptoMorin/KingdomsX/wiki';
const githubWikiPathLower = githubWikiPath.toLowerCase();

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseTarget(target) {
  let page;
  let hash;

  if (/^https?:\/\//i.test(target)) {
    const url = new URL(target);
    const pathname = url.pathname.toLowerCase();
    const isKingdomsWiki = url.hostname.toLowerCase() === 'github.com'
      && (
        pathname === githubWikiPathLower
        || pathname.startsWith(`${githubWikiPathLower}/`)
      );

    if (!isKingdomsWiki) {
      return {external: true, href: target};
    }

    const wikiPath = url.pathname.slice(githubWikiPath.length).replace(/^\//, '');
    page = decode(wikiPath) || 'Home';
    hash = url.hash.slice(1);
  } else {
    const [rawPage, rawHash] = target.split('#', 2);
    page = decode(rawPage)
      .replace(/^\.\//, '')
      .replace(/(?:\.md)+$/i, '') || 'Home';
    hash = rawHash;
  }

  const normalizedHash = hash
    ? decode(hash).trim().toLowerCase().replace(/\s+/g, '-')
    : '';

  return {
    external: false,
    page,
    href: `/${page}${normalizedHash ? `#${normalizedHash}` : ''}`,
    hash: normalizedHash,
  };
}

function parseSidebarMarkdown(source, filename) {
  const root = [];
  const stack = [{indent: -1, items: root}];

  source.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim()) return;

    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      root.push({kind: 'heading', label: heading[1].trim()});
      stack.length = 1;
      return;
    }

    const link = line.match(/^(\s*)(?:[*+-]\s+)?(.*?)\[([^\]]+)]\(([^)]+)\)\\?\s*$/);
    const hasBullet = /^(\s*)[*+-]\s+/.test(line);
    if (!link || (!hasBullet && link[1].length === 0)) {
      throw new Error(`${filename}:${index + 1}: Unsupported GitHub wiki sidebar line: ${line}`);
    }

    const indent = link[1].replace(/\t/g, '  ').length;
    const prefix = link[2].trim();
    const label = [prefix, link[3].trim()].filter(Boolean).join(' ');
    const node = {kind: 'link', label, target: link[4].trim(), children: []};

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    stack[stack.length - 1].items.push(node);
    stack.push({indent, items: node.children});
  });

  return root;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function toSidebarItem(node) {
  if (node.kind === 'heading') {
    return {
      type: 'html',
      value: `<span>${escapeHtml(node.label)}</span>`,
      className: 'menu__list__category',
      defaultStyle: false,
    };
  }

  const target = parseTarget(node.target);
  if (target.external) {
    if (node.children.length > 0) {
      throw new Error(`External sidebar category links are not supported: ${node.target}`);
    }
    return {type: 'link', label: node.label, href: target.href};
  }

  if (node.children.length > 0) {
    const category = {
      type: 'category',
      label: node.label,
      collapsible: true,
      collapsed: !target.hash,
      items: node.children.map(toSidebarItem),
    };

    if (target.hash) {
      category.customProps = {linkedHref: target.href};
    } else {
      category.link = {type: 'doc', id: target.page};
    }

    return category;
  }

  if (target.hash) return {type: 'link', label: node.label, href: target.href};
  return {type: 'doc', label: node.label, id: target.page};
}

export function createWikiSidebar({sidebarFile = 'docs/_Sidebar.md'} = {}) {
  const absolutePath = path.resolve(sidebarFile);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`GitHub wiki sidebar not found at ${absolutePath}. Populate docs/ before building.`);
  }

  const source = fs.readFileSync(absolutePath, 'utf8');
  return parseSidebarMarkdown(source, absolutePath).map(toSidebarItem);
}
