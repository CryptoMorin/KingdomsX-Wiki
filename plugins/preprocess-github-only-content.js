const GITHUB_ONLY_MARKER = /^<!--\s*github-only:(start|end)\s*-->$/i;
const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;

export default function preprocessGithubOnlyContent({fileContent, filePath}) {
  const lines = fileContent.split('\n');
  const markers = findMarkers(lines);
  const invalidMarker = findInvalidMarker(markers);

  if (invalidMarker) {
    console.warn(
      `${filePath}:${invalidMarker.line + 1} has an unmatched `
      + `github-only:${invalidMarker.type} marker; leaving the file unchanged`,
    );
    return fileContent;
  }

  let depth = 0;
  const markerByLine = new Map(markers.map((marker) => [marker.line, marker.type]));

  return lines.map((line, index) => {
    const marker = markerByLine.get(index);

    if (marker === 'start') {
      depth++;
      return '';
    }

    if (marker === 'end') {
      depth--;
      return '';
    }

    return depth > 0 ? '' : line;
  }).join('\n');
}

function findMarkers(lines) {
  const markers = [];
  let fence = null;

  lines.forEach((line, index) => {
    const fenceMatch = line.match(FENCE);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      const rest = fenceMatch[2];

      if (!fence) {
        fence = marker;
      } else if (
        marker[0] === fence[0]
        && marker.length >= fence.length
        && rest.trim() === ''
      ) {
        fence = null;
      }

      return;
    }

    if (fence) return;

    const marker = line.trim().match(GITHUB_ONLY_MARKER)?.[1]?.toLowerCase();
    if (marker) markers.push({line: index, type: marker});
  });

  return markers;
}

function findInvalidMarker(markers) {
  const starts = [];

  for (const marker of markers) {
    if (marker.type === 'start') {
      starts.push(marker);
    } else if (starts.length === 0) {
      return marker;
    } else {
      starts.pop();
    }
  }

  return starts[0] ?? null;
}
