#!/usr/bin/env python3
"""
Clean GitHub Wiki _Sidebar.md for mkdocs-literate-nav
Handles emojis, external links, and strict parsing requirements.
"""

import re
from pathlib import Path
import sys

def clean_wiki_sidebar(input_path: str, output_path: str):
    content = Path(input_path).read_text(encoding="utf-8")

    # 1. Convert GitHub wiki links to local .md links
    def replace_wiki_link(match):
        text = match.group(1).strip()
        url = match.group(2)
        
        if "/wiki/" in url:
            # Extract page name
            page = url.split("/wiki/")[-1].strip()
            filename = re.sub(r'[^a-zA-Z0-9\-_]', '-', page).lower()
            filename = re.sub(r'-+', '-', filename).strip('-')
            if not filename.endswith('.md'):
                filename += '.md'
            return f"[{text}]({filename})"
        
        # Keep other links as-is
        return match.group(0)

    content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', replace_wiki_link, content)

    # 2. Fix emoji + link pattern: "🧰 [Text](file.md)" → "[🧰 Text](file.md)"
    # This is the main fix for your current error
    content = re.sub(
        r'([-\*]\s+)([^\s\[]+?)\s*\[([^\]]+)\]\(([^)]+)\)', 
        r'\1[\2 \3](\4)', 
        content,
        flags=re.MULTILINE
    )

    # Alternative stricter version if above doesn't catch everything:
    # content = re.sub(r'([-\*]\s+)([\u2600-\u27FF\u1F000-\u1FAFF]+)\s*\[', r'\1[\2 ', content)

    # 3. Clean extra whitespace and empty lines
    lines = content.splitlines()
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped:
            # Fix common list spacing issues
            if stripped.startswith('-') or stripped.startswith('*'):
                line = re.sub(r'^\s*[-*]\s+', '- ', line)
            cleaned_lines.append(line)
    
    content = '\n'.join(cleaned_lines) + '\n'

    # Write output
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(content, encoding="utf-8")
    
    print(f"✅ Sidebar cleaned and saved to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python clean_sidebar.py <input_file> <output_file>")
        sys.exit(1)

    clean_wiki_sidebar(sys.argv[1], sys.argv[2])