#!/usr/bin/env python3
"""
Clean GitHub Wiki _Sidebar.md for use with mkdocs-literate-nav
"""

import re
import sys
from pathlib import Path

def clean_wiki_sidebar(input_path: str, output_path: str, repo_name: str = None):
    content = Path(input_path).read_text(encoding="utf-8")

    # Convert GitHub Wiki links to relative MkDocs links
    def replace_link(match):
        text = match.group(1)
        url = match.group(2)
        
        # Extract page name from GitHub wiki URL
        if "github.com" in url and "/wiki/" in url:
            page_name = url.split("/wiki/")[-1]
            # Convert to kebab-case filename (common practice)
            filename = page_name.replace(" ", "-").lower()
            if not filename.endswith(".md"):
                filename += ".md"
            return f"[{text}]({filename})"
        
        # Keep external links as-is
        return match.group(0)

    # Regex for Markdown links: [text](url)
    content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', replace_link, content)

    # Optional: Clean up common wiki issues
    content = re.sub(r'^\s*-\s*\[', '- [', content, flags=re.MULTILINE)  # Fix spacing

    # Write cleaned file
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(content, encoding="utf-8")
    
    print(f"✅ Cleaned sidebar saved to: {output_path}")
    print("   External wiki links converted to local .md links.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python clean_sidebar.py <input_sidebar> <output_sidebar> [repo_name]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    repo = sys.argv[3] if len(sys.argv) > 3 else None

    clean_wiki_sidebar(input_file, output_file, repo)