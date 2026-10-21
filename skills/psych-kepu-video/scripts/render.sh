#!/usr/bin/env bash
# 用法：bash scripts/render.sh <脚本.json> [输出目录]
# 产出：<输出目录>/cover34.png（3:4 封面）、final.mp4（首帧 0.01s 封面 + 静音正片，无音轨）
# 依赖：Node ≥18、已在 engine/ 下 npm install、ffmpeg/ffprobe、系统已装中文衬线字体
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; ENGINE="$HERE/../engine"
J="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
OUT="${2:-$ENGINE/out/$(basename "$1" .json)}"; mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"
cd "$ENGINE"
npx remotion still src/index.ts EpCoverFrame "$OUT/coverframe.png" --props="$J"
npx remotion still src/index.ts EpCover34 "$OUT/cover34.png" --props="$J"
npx remotion render src/index.ts EpBody "$OUT/body.mp4" --props="$J" --codec=h264 --crf=12 --muted
# 拼接：第 0 帧放封面，持续 0.01 秒；之后接 30fps 正片。可变帧率，时间基 1/3000。
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/body.mp4" | awk '{print $1+0.01}')
ffmpeg -y -v error -loop 1 -framerate 100 -t 0.01 -i "$OUT/coverframe.png" -i "$OUT/body.mp4" \
  -filter_complex "[0:v]format=yuv420p,setsar=1,fps=100,trim=end_frame=1,settb=1/3000[c];[1:v]format=yuv420p,setsar=1,settb=1/3000[b];[c][b]concat=n=2:v=1,setpts='if(eq(N,0),0,(0.01+(N-1)/30)/TB)'[v]" \
  -map "[v]" -an -fps_mode passthrough -enc_time_base 1/3000 \
  -c:v libx264 -preset slow -profile:v high -b:v 10M -maxrate 16M -bufsize 32M -x264-params "zones=0,1,q=8" \
  -t "$DUR" -movflags +faststart -video_track_timescale 3000 "$OUT/final.mp4"
echo "DONE $OUT/final.mp4"
