import {visit} from 'unist-util-visit';

const GITHUB_ATTACHMENT_PATH = /^\/user-attachments\/assets\/[0-9a-f-]+$/i;
const attachmentTypeCache = new Map();

const MEDIA_TYPES_BY_EXTENSION = new Map([
  ['avif', 'image/avif'],
  ['gif', 'image/gif'],
  ['jpeg', 'image/jpeg'],
  ['jpg', 'image/jpeg'],
  ['png', 'image/png'],
  ['svg', 'image/svg+xml'],
  ['webp', 'image/webp'],
  ['m4v', 'video/x-m4v'],
  ['mov', 'video/quicktime'],
  ['mp4', 'video/mp4'],
  ['ogg', 'video/ogg'],
  ['ogv', 'video/ogg'],
  ['webm', 'video/webm'],
]);

export default function remarkMediaAttachments() {
  return async (tree, file) => {
    const attachments = [];

    visit(tree, 'paragraph', (node) => {
      if (node.children.length !== 1) return;

      const [child] = node.children;
      if (
        child.type !== 'link' ||
        child.children.length !== 1 ||
        child.children[0].type !== 'text' ||
        child.children[0].value !== child.url
      ) {
        return;
      }

      attachments.push({node, url: child.url});
    });

    await Promise.all(attachments.map(async ({node, url}) => {
      const type = await getMediaType(url, file);
      if (!type) return;

      const safeUrl = escapeAttribute(url);
      if (type.startsWith('image/')) {
        node.type = 'html';
        node.value = `<img class="wiki-media-attachment" src="${safeUrl}" alt="Image attachment" loading="lazy">`;
      } else if (type.startsWith('video/')) {
        node.type = 'html';
        node.value = [
          `<video class="wiki-media-attachment" controls playsinline preload="metadata" aria-label="Video attachment">`,
          `  <source src="${safeUrl}" type="${type}">`,
          `  <a href="${safeUrl}">Open the video attachment</a>`,
          '</video>',
        ].join('\n');
      }

      delete node.children;
    }));
  };
}

async function getMediaType(url, file) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  const extension = parsedUrl.pathname.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
  const typeFromExtension = MEDIA_TYPES_BY_EXTENSION.get(extension);
  if (typeFromExtension) return typeFromExtension;

  if (
    parsedUrl.protocol !== 'https:' ||
    parsedUrl.hostname !== 'github.com' ||
    !GITHUB_ATTACHMENT_PATH.test(parsedUrl.pathname)
  ) {
    return null;
  }

  return getGitHubAttachmentType(url, file);
}

function getGitHubAttachmentType(url, file) {
  if (!attachmentTypeCache.has(url)) {
    attachmentTypeCache.set(url, fetchGitHubAttachmentType(url, file));
  }

  return attachmentTypeCache.get(url);
}

async function fetchGitHubAttachmentType(url, file) {
  try {
    // GitHub attachment URLs have no extension, but their redirect identifies the stored file
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(5000),
    });

    const directType = normalizeMediaType(response.headers.get('content-type'));
    if (response.ok && directType) return directType;

    const location = response.headers.get('location');
    if (!location) throw new Error(`GitHub returned HTTP ${response.status}`);

    const redirect = new URL(location, url);
    const redirectedType = normalizeMediaType(redirect.searchParams.get('response-content-type'));
    if (redirectedType) return redirectedType;

    const extension = redirect.pathname.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
    return MEDIA_TYPES_BY_EXTENSION.get(extension) ?? null;
  } catch (error) {
    file.message(`Could not determine the media type of ${url}; leaving it as a link (${error.message})`);
    return null;
  }
}

function normalizeMediaType(type) {
  if (!type) return null;

  const normalized = type.split(';', 1)[0].trim().toLowerCase();
  return /^(?:image|video)\/[a-z0-9.+-]+$/.test(normalized) ? normalized : null;
}

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
