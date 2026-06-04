from pathlib import Path
import re

DEBUGGING = False
ALERT_MAP = {
    "NOTE": "note",
    "TIP": "tip",
    "IMPORTANT": "info",
    "WARNING": "warning",
    "CAUTION": "danger",
}

for md_file in Path("../docs" if DEBUGGING else "docs").rglob("*.md"):
    if DEBUGGING: print(f"[GitHub->Admonitions] Processing {md_file.name}...")

    text = md_file.read_text(encoding="utf-8")

    lines = text.splitlines()
    out = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # Replace \ at end-of-line with <br>
        line = re.sub(r'\\$', '<br>', line)
        m = re.match(r'^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$', line)

        if m:
            kind = ALERT_MAP[m.group(1)]

            out.append(f"!!! {kind}")
            out.append("")

            i += 1

            while i < len(lines):
                block_line = lines[i]

                if not block_line.startswith(">"):
                    break

                content = block_line[1:]
                if content.startswith(" "):
                    content = content[1:]

                out.append(f"    {content}")
                i += 1

            out.append("")
            continue

        out.append(line)
        i += 1

    md_file.write_text("\n".join(out) + "\n", encoding="utf-8")