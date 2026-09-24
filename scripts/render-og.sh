#!/usr/bin/env bash
# Renders scripts/og.html to public/og.png (1200x630) with headless Chrome, so
# the image uses the same fonts as the site. Run from the repo root.
set -euo pipefail
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=2000 \
  --screenshot="$PWD/public/og.png" "file://$PWD/scripts/og.html" 2>/dev/null
echo "wrote public/og.png"
