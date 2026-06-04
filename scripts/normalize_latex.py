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


def replace_color(match):
    color_name = match.group(1)

    if color_name in COLOR_MAP:
        return f"\\color{{{COLOR_MAP[color_name]}}}"

    return match.group(0)


COLOR_PATTERN = re.compile(
    r"\\color\s*\{\s*([A-Za-z][A-Za-z0-9]*)\s*\}"
)


def preprocess_text(text: str) -> str:
    return COLOR_PATTERN.sub(replace_color, text)


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
        print("Usage: python preprocess_colors.py <file-or-directory>")
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