#!/usr/bin/env bash

# Don't override existing files
# rm -rf docs
# mkdir docs

# Copy all wiki pages
find wiki -maxdepth 1 -name "*.md" -exec cp {} docs/ \;

# GitHub Wiki home page -> MkDocs index
if [ -f docs/Home.md ]; then
mv docs/Home.md docs/index.md
fi