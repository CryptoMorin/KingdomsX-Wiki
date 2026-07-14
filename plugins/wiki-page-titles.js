import path from 'node:path';

// GitHub wiki pages do not declare a title in .md files, so Docusaurus
// falls back to the file name (e.g. Protection-Signs)
// Replace hyphens with spaces for the display title
export default async function applyWikiPageTitles(params) {
  const result = await params.defaultParseFrontMatter(params);

  if (result.frontMatter.title) {
    return result;
  }

  const id = path.basename(params.filePath, path.extname(params.filePath));
  if (id.includes('-')) {
    result.frontMatter.title = id.replaceAll('-', ' ');
  }

  return result;
}
