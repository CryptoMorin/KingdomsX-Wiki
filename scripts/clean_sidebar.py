#!/usr/bin/env python3
"""
Strong cleaner for GitHub Wiki _Sidebar.md
Converts HTML <br> + emoji patterns into clean nested Markdown lists.
"""

import re
from pathlib import Path
import sys

def clean_wiki_sidebar(input_path: str, output_path: str):
    content = Path(input_path).read_text(encoding="utf-8")

    # 1. Convert wiki URLs to local .md links
    def convert_link(match):
        text = match.group(1).strip()
        url = match.group(2)
        if "/wiki/" in url:
            page = url.split("/wiki/")[-1].strip()
            filename = re.sub(r'[^a-zA-Z0-9\-_ ]', '', page).strip()
            filename = re.sub(r'\s+', '-', filename).lower() + ".md"
            return f"[{text}]({filename})"
        return match.group(0)

    content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', convert_link, content)

    # 2. Remove all HTML tags and fix <br>
    content = re.sub(r'</?br>', '\n', content, flags=re.IGNORECASE)
    content = re.sub(r'&lt;br&gt;', '\n', content)
    content = re.sub(r'&amp;', '&', content)

    # 3. Move emojis inside the link text
    content = re.sub(r'([-\*]\s*)([🧰💻🔹📘🔧➕▶→])\s*\[', r'\1[\2 ', content)

    # 4. Convert flat <br> sub-items into proper nested lists
    lines = content.splitlines()
    cleaned = []
    current_indent = 0

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # If line contains emoji bullet + link → treat as sub-item
        if re.search(r'🔹|▶|→', line) or '    ' in line:
            current_indent = 4
            line = re.sub(r'^.*?(🔹|▶|→)\s*', '', line)
            line = '    - ' + line.strip()
        else:
            # Main item
            current_indent = 0
            if not line.startswith('- '):
                if '[' in line:
                    line = '- ' + line
                elif not line.startswith('#'):
                    line = '- ' + line

        cleaned.append(line)

    content = '\n'.join(cleaned)

    # Final cleanup
    content = re.sub(r'\n{3,}', '\n\n', content)

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(content, encoding="utf-8")

    print(f"✅ Sidebar cleaned: {output_path}")
    print("   HTML and <br> patterns converted to nested Markdown.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python clean_sidebar.py <input_sidebar> <output_sidebar>")
        sys.exit(1)

    clean_wiki_sidebar(sys.argv[1], sys.argv[2])