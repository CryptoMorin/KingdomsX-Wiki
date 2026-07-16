import {visit} from 'unist-util-visit';

const YOUTUBE_VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
]);
const YOUTUBE_THUMBNAIL_HOSTS = new Set([
  'img.youtube.com',
  'i.ytimg.com',
]);

export default function remarkYoutubeEmbeds() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      const embed = getYoutubeEmbed(node);
      if (!embed) return;

      const title = escapeAttribute(embed.title || 'YouTube video');
      node.type = 'html';
      node.value = [
        '<div class="wiki-youtube-embed">',
        `  <iframe src="https://www.youtube-nocookie.com/embed/${embed.videoId}" title="${title}" loading="lazy"`,
        '    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"',
        '    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        '</div>',
      ].join('\n');

      delete node.children;
    });
  };
}

function getYoutubeEmbed(node) {
  if (node.children.length !== 1) return null;

  const [link] = node.children;
  if (link.type !== 'link' || link.children.length !== 1) return null;

  const [thumbnail] = link.children;
  if (thumbnail.type !== 'image') return null;

  const videoId = getYoutubeVideoId(link.url);
  const thumbnailVideoId = getYoutubeThumbnailVideoId(thumbnail.url);
  if (!videoId || videoId !== thumbnailVideoId) return null;

  return {
    videoId,
    title: thumbnail.alt,
  };
}

function getYoutubeVideoId(value) {
  const url = parseUrl(value);
  if (!url) return null;

  const hostname = url.hostname.toLowerCase();
  if (hostname === 'youtu.be') {
    return normalizeVideoId(url.pathname.split('/').filter(Boolean)[0]);
  }

  if (!YOUTUBE_HOSTS.has(hostname)) return null;

  if (url.pathname === '/watch') {
    return normalizeVideoId(url.searchParams.get('v'));
  }

  const [route, videoId] = url.pathname.split('/').filter(Boolean);
  if (route === 'embed' || route === 'shorts' || route === 'live') {
    return normalizeVideoId(videoId);
  }

  return null;
}

function getYoutubeThumbnailVideoId(value) {
  const url = parseUrl(value);
  if (!url || !YOUTUBE_THUMBNAIL_HOSTS.has(url.hostname.toLowerCase())) return null;

  const match = url.pathname.match(/^\/vi(?:_webp)?\/([^/]+)\//);
  return normalizeVideoId(match?.[1]);
}

function normalizeVideoId(value) {
  return YOUTUBE_VIDEO_ID.test(value ?? '') ? value : null;
}

function parseUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
