#!/bin/bash
rm -R "_out"
FILES=`find . -type f \( -iname \*.jpg -o -iname \*.png \) -print`
while IFS= read -r i ; do
    echo "Prcoessing image $i"
    s=${i##*/}
    name=${s%.*}
    name=`echo "$name" | sed -r 's/[äÄöÖüÜß]/_/g'`
    dir=$(dirname "$i")
    hash=`echo -n "$name" | md5sum | awk '{ print $1 }'`
    echo "md5sum($name) = $hash"
    outFilepath="_out/$dir/$hash.jpg"
    outDir=$(dirname "${outFilepath}")
    mkdir -p "$outDir"
    /usr/bin/convert -thumbnail 80 "$i" "$outFilepath"
done <<< "$FILES"
