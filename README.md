# KingdomsX Wiki

[KingdomsX](https://github.com/CryptoMorin/KingdomsX) is a Minecraft plugin similar to Factions, with more advanced core features and additional mechanics such as turrets, structures, and invasions.

This repository contains the public [wiki](https://wiki.kingdomsx.com) for the project. It is built with Docusaurus and deployed on GitHub Pages. Wiki page content is sourced from the [KingdomsX/wiki](https://github.com/CryptoMorin/KingdomsX/wiki) repository.

## Stack
- **Docusaurus** - documentation site framework
- **React** - theme customizations and client modules
- **Remark / Rehype** - Markdown transforms for GitHub wiki content

## Requirements
- Node.js 24
- npm
- Python 3

## Project Structure
- `docs/` - wiki Markdown pages and static wiki assets (pages are pulled from `KingdomsX/wiki`)
- `src/theme/` - Docusaurus theme swizzles (navbar, sidebar, footer, 404, etc.)
- `src/css/` - site styles
- `src/js/` - client modules (hash scroll, sidebar active links, page transitions, etc.)
- `plugins/` - custom Remark/Rehype plugins and sidebar/metadata helpers
- `static/` - files copied directly to the site root
- `scripts/` - helpers for normalizing imported wiki content
- `docusaurus.config.js` - site configuration
- `sidebars.js` - sidebar definition

## Development
Contributions are appreciated and always welcome through [pull requests](https://github.com/CryptoMorin/KingdomsX-Wiki/pulls).

Wiki article edits belong in [KingdomsX/wiki](https://github.com/CryptoMorin/KingdomsX/wiki). Use this repository for the site shell, theme, plugins, and build pipeline.

### Setup
Clone the repository:

```bash
git clone https://github.com/CryptoMorin/KingdomsX-Wiki.git
cd KingdomsX-Wiki
```

Populate `docs/` with the source wiki. This replaces the contents of `docs/` with the latest wiki pages:

```bash
rm -rf docs
git clone --depth 1 https://github.com/CryptoMorin/KingdomsX.wiki.git docs
```

Normalize GitHub-style LaTeX color commands:

```bash
python3 scripts/normalize_latex.py docs/
```

Install dependencies:

```bash
npm ci
```

### Workflows
After setup, use one of these development workflows depending on what you're working on:

#### 1. Docusaurus dev server
Use this for theme, plugin, and layout work. It serves the site with hot reload.

```bash
npm start
```

#### 2. Production build preview
Use this to verify the production build locally.

```bash
npm run build
npm run serve
```

Refresh wiki pages whenever you need newer content from `KingdomsX/wiki`. This deletes and replaces the entire local `docs/`:

```bash
rm -rf docs
git clone --depth 1 https://github.com/CryptoMorin/KingdomsX.wiki.git docs
python3 scripts/normalize_latex.py docs/
```

## Checks
Please run the production build before opening a pull request:

```bash
npm run build
```
