import { visit } from 'unist-util-visit';
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger';

const slugger = new GithubSlugger();

function slugify(text) {
  return slugger.slug(text);
}

export default function rehypeForceH1Slug() {
  return (tree) => {
    const slugger = rehypeSlug();
    slugger(tree);

    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1' && !node.properties?.id) {
        const text = toString(node);
        node.properties.id = slugify(text);
      }
    });
  };
}
