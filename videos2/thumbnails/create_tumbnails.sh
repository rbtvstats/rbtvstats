#!/bin/bash
rm -R "_out"
FILES=`find . -type f \( -iname \*.jpg -o -iname \*.png \) -print`
while IFS= read -r i ; do
    echo "Prcoessing image $i"
    s=${i##*/}
    name=${s%.*}
    dir=$(dirname "$i")
    outFilepath="_out/$dir/$name.jpg"
    outDir=$(dirname "${outFilepath}")
    mkdir -p "$outDir"
    /usr/bin/convert -thumbnail 80 "$i" "$outFilepath"
done <<< "$FILES"
