#!/bin/bash
set -e
src=$1; name=$2; count=$3; fw=$4; fh=$5; crop=${6:-}; cols=${7:-8}
O=/home/tathya/Desktop/portfolio/public/scrub; T=$(mktemp -d)
vf="${crop:+crop=$crop,}scale=$fw:$fh:force_original_aspect_ratio=increase:flags=lanczos,crop=$fw:$fh"
if [ -d "$src" ]; then
  files=($(ls $src/*.jpg)); n=${#files[@]}
  for k in $(seq 0 $((count-1))); do i=$(( k*(n-1)/(count-1) )); ffmpeg -y -v error -i ${files[$i]} -vf "$vf" $T/$(printf %03d $k).png; done
else
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  for k in $(seq 0 $((count-1))); do t=$(python3 -c "print(($d-0.15)*$k/($count-1))"); ffmpeg -y -v error -ss $t -i "$src" -vframes 1 -vf "$vf" $T/$(printf %03d $k).png; done
fi
rows=$(( (count + cols - 1) / cols ))
ffmpeg -y -v error -framerate 1 -i $T/%03d.png -vf "tile=${cols}x${rows}" -frames:v 1 -c:v libwebp -quality ${Q:-70} $O/$name.webp
ffmpeg -y -v error -i $T/000.png -c:v libwebp -quality 78 $O/$name-0.webp
echo "{\"count\":$count,\"cols\":$cols,\"rows\":$rows,\"w\":$fw,\"h\":$fh}" > $O/$name.json
printf "%s %s %s\n" $name "$(du -h $O/$name.webp | cut -f1)" "$(cat $O/$name.json)"
rm -rf $T
