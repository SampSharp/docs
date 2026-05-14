#!/bin/bash
BASE_DIR="$(dirname "$0")"
cd "$BASE_DIR"
rm -rf _site
cd "$BASE_DIR/api"
find . -maxdepth 1 -not -name "index.md" -not -name "." -exec rm -rf {} + 2>/dev/null
echo "Cleanup completed. Deleted _site directory and all files in ./api except index.md"
