#!/usr/bin/env bash
# 用法：bash scripts/qc.sh <成片.mp4> [抽帧目录]
# 自动检查：时长 15–30s、1920x1080、无音轨、首帧时长≈0.01s；并每秒抽一帧 + 拼成联系表供人工看
set -uo pipefail
V="$1"; D="${2:-$(dirname "$V")/qc}"; mkdir -p "$D"; FAIL=0
ok(){ echo "  [OK]   $1"; }; bad(){ echo "  [FAIL] $1"; FAIL=1; }
DU=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
WH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$V")
NA=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$V" | wc -l)
T1=$(ffprobe -v error -select_streams v:0 -read_intervals "%+#2" -show_entries frame=pts_time -of csv=p=0 "$V" | sed -n 2p)
echo "QC $V"
awk "BEGIN{exit !($DU>=15 && $DU<=30)}" && ok "时长 ${DU}s" || bad "时长 ${DU}s 不在 15–30s"
[ "$WH" = "1920x1080" ] && ok "分辨率 $WH" || bad "分辨率 $WH"
[ "$NA" -eq 0 ] && ok "无音轨" || bad "存在 $NA 条音轨（应静音、无音轨）"
awk "BEGIN{exit !(${T1:-1}>0.005 && ${T1:-1}<0.02)}" && ok "首帧封面时长 ${T1}s" || bad "第二帧时间 ${T1:-?}s，首帧封面应≈0.01s"
ffmpeg -y -v error -i "$V" -frames:v 1 "$D/f000_cover.jpg"
ffmpeg -y -v error -i "$V" -vf "fps=1,scale=480:-1" "$D/s%03d.jpg"
ffmpeg -y -v error -pattern_type glob -i "$D/s*.jpg" -vf "tile=6x5:padding=4" -frames:v 1 "$D/contact.jpg" 2>/dev/null || true
echo "  抽帧：$D（f000_cover.jpg、s*.jpg、contact.jpg），请对照 templates/自检清单.md 人工核对其余项目"
exit $FAIL
