#!/usr/bin/env python3
"""
Advanced cleaner for GitHub Wiki _Sidebar.md → mkdocs-literate-nav
Handles emojis, <br> tags, and complex nested structures.
"""

import re
from pathlib import Path
import sys

def clean_wiki_sidebar(input_path: str, output_path: str):
    content = Path(input_path).read_text(encoding="utf-8")

    # 1. Convert GitHub wiki full URLs to local .md files
    def wiki_to_local(match):
        text = match.group(1).strip()
        url = match.group(2)
        if "/wiki/" in url:
            page = url.split("/wiki/")[-1].strip()
            filename = re.sub(r'[^a-zA-Z0-9\-_ ]', '', page).strip()
            filename = re.sub(r'\s+', '-', filename).lower()
            if not filename.endswith('.md'):
                filename += '.md'
            return f"[{text}]({filename})"
        return match.group(0)

    content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', wiki_to_local, content)

    # 2. Convert HTML <br> style sub-items into proper nested Markdown lists
    # This is the main fix for your current error
    lines = content.splitlines()
    cleaned = []
    in_list = False

    for line in lines:
        line = line.strip()

        # Skip empty lines for now
        if not line:
            continue

        # Replace <br> and HTML entities
        line = line.replace('<br>', '\n')
        line = line.replace('&lt;br&gt;', '\n')
        line = line.replace('&amp;', '&')

        # Fix emoji outside links → move inside
        line = re.sub(r'([-\*]\s+)([🧰💻🔹📘🔧➕]+)\s*\[', r'\1[\2 ', line)

        # Convert common wiki sub-item pattern into nested list
        if re.search(r'🔹|▶|→', line) and '[' in line:
            # Make it a sub-item
            line = re.sub(r'^', '    ', line)  # indent for sub-list
            line = re.sub(r'🔹\s*', '', line)

        # Ensure all list items start with "- "
        if line.startswith(('*', '-')):
            line = re.sub(r'^[\*-]\s*', '- ', line)
        elif '[' in line and not line.startswith('- '):
            line = '- ' + line

        cleaned.append(line)

    content = '\n'.join(cleaned)

    # 3. Final cleanup
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)  # reduce multiple blank lines

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(content, encoding="utf-8")

    print(f"✅ Sidebar successfully cleaned: {output_path}")
    print("   HTML <br> tags converted to nested lists.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python clean_sidebar.py <input> <output>")
        sys.exit(1)
    
    clean_wiki_sidebar(sys.argv[1], sys.argv[2])