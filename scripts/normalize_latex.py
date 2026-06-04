#!/usr/bin/env python3

import re
import sys
from pathlib import Path

COLOR_MAP = {
    "Gray": "#808080",
    "Grey": "#808080",
    "OrangeRed": "#FF4500",
    "Red": "#FF0000",
    "Green": "#008000",
    "Blue": "#0000FF",
    "Yellow": "#FFFF00",
    "Purple": "#800080",
    "Pink": "#FFC0CB",
    "Brown": "#A52A2A",
    "Black": "#000000",
    "White": "#FFFFFF",
}

# Matches \color{Name}
COLOR_PATTERN = re.compile(r"\\color\s*\{\s*([A-Za-z][A-Za-z0-9]*)\s*\}")

# Fix double-escaped characters coming from upstream generation
DOUBLE_ESCAPE_PATTERNS = [
    (re.compile(r"\\\\%"), r"\%"),   # \\% -> \%
    (re.compile(r"\\\\_"), r"\_"),   # \\_ -> \_
]

# Optional safety: prevent runaway backslashes like \\\\
CLEANUP_BACKSLASHES = re.compile(r"\\\\\\+")


def replace_color(match):
    color_name = match.group(1)

    if color_name in COLOR_MAP:
        return f"\\color{{{COLOR_MAP[color_name]}}}"

    # leave unknown colors unchanged
    return match.group(0)


def fix_double_escapes(text: str) -> str:
    for pattern, repl in DOUBLE_ESCAPE_PATTERNS:
        text = pattern.sub(repl, text)
    return text


def normalize_backslashes(text: str) -> str:
    # collapse excessive backslashes (rare but useful)
    return CLEANUP_BACKSLASHES.sub(r"\\", text)


def preprocess_text(text: str) -> str:
    # 1. fix colors first
    text = COLOR_PATTERN.sub(replace_color, text)

    # 2. fix escaped LaTeX symbols
    text = fix_double_escapes(text)

    # 3. normalize accidental backslash explosions
    text = normalize_backslashes(text)

    return text


def process_file(path: Path):
    original = path.read_text(encoding="utf-8")
    transformed = preprocess_text(original)

    if transformed != original:
        path.write_text(transformed, encoding="utf-8")
        print(f"Updated {path}")
    else:
        print(f"No changes: {path}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python preprocess_latex.py <file-or-directory>")
        sys.exit(1)

    target = Path(sys.argv[1])

    if target.is_file():
        process_file(target)

    elif target.is_dir():
        for md_file in target.rglob("*.md"):
            process_file(md_file)

        for mdx_file in target.rglob("*.mdx"):
            process_file(mdx_file)

    else:
        print(f"Not found: {target}")
        sys.exit(1)


if __name__ == "__main__":
    main()