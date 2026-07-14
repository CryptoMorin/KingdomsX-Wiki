import path from 'node:path';

export default function createWikiPageMetadataParser({fallbackDescription}) {
  return async function applyWikiPageMetadata(params) {
    const result = await params.defaultParseFrontMatter(params);

    // GitHub wiki pages do not declare titles in .md files, so Docusaurus
    // falls back to file names (e.g. Protection-Signs). While this is ok,
    // let's replace hyphens with spaces for the display titles
    if (!result.frontMatter.title) {
      const id = path.basename(params.filePath, path.extname(params.filePath));
      if (id.includes('-')) result.frontMatter.title = id.replaceAll('-', ' ');
    }

    // Use the same site description for all pages. A page can still opt
    // into a specific description through explicit front matter
    if (!result.frontMatter.description) {
      result.frontMatter.description = fallbackDescription;
    }

    return result;
  };
}
