#!/usr/bin/env bash
# PNG renders of the generated SVGs. Run after build.py, from the repo root.
set -euo pipefail
L=public/brand/logo
rsvg-convert -w 32 -h 32 "$L/app-icon-rounded.svg" -o public/favicon-32.png
# iOS and Android apply their own mask, so these are full bleed.
rsvg-convert -w 180 -h 180 "$L/app-icon.svg" -o public/apple-touch-icon.png
rsvg-convert -w 512 -h 512 "$L/app-icon.svg" -o public/icon-512.png
rsvg-convert -w 1024 -h 1024 "$L/app-icon.svg" -o "$L/app-icon-1024.png"
rsvg-convert -w 512 -h 512 "$L/app-icon.svg" -o "$L/avatar-512.png"
rsvg-convert -h 256 "$L/lockup-horizontal.svg" -o "$L/lockup-horizontal.png"
rsvg-convert -h 256 "$L/lockup-horizontal-color-dark.svg" -o "$L/lockup-horizontal-color-dark.png"
rsvg-convert -w 512 -h 512 "$L/symbol.svg" -o "$L/symbol-512.png"
# Lit files are for dark backgrounds, so their PNGs carry one.
rsvg-convert -b "#07080B" -w 2400 "$L/lockup-horizontal-lit.svg" -o "$L/lockup-horizontal-lit-2400.png"
rsvg-convert -w 1024 -h 1024 "$L/app-icon-lit.svg" -o "$L/app-icon-lit-1024.png"
echo "rendered PNGs"
