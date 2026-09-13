#!/usr/bin/env bash
set -euo pipefail
project="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d "${TMPDIR:-/tmp}/dgm-taxonomy.XXXXXX")"
trap 'rm -rf "$work"' EXIT
variants=("$@")
if [[ ${#variants[@]} -eq 0 ]]; then variants=(taxonomy taxonomy-ar taxonomy-nf); fi
for variant in "${variants[@]}"; do
  highlight=""
  if [[ "$variant" = "taxonomy-ar" ]]; then highlight="ar"; fi
  if [[ "$variant" = "taxonomy-nf" ]]; then highlight="nf"; fi
  cat > "$work/$variant.tex" <<EOF
\\def\\pgfsysdriver{pgfsys-dvisvgm.def}
\\documentclass[tikz,border=3pt]{standalone}
\\usepackage{etoolbox}
\\usetikzlibrary{arrows.meta,calc,shapes,positioning,shadows,trees}
\\input{$project/../lectures/utils/taxonomy.tex}
\\begin{document}
\\renderTaxonomy{$highlight}
\\end{document}
EOF
  latex -halt-on-error -interaction=batchmode -output-directory="$work" "$work/$variant.tex"
  dvisvgm --no-fonts --output="$project/theme/assets/$variant.svg" "$work/$variant.dvi"
done
