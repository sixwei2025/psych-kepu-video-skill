---
name: psych-kepu-video
description: 用 AI + Remotion 批量制作 15–30 秒、16:9 1080p、无人声纯字幕、深色扁平卡通动画的心理科普短视频（首帧 3:4 封面、片内静音、结尾 1/2 互动题），含选题、脚本、渲染、抽帧自检与发布清单。
---

> 本 Skill 由 袁六伟 · 台州汇芯 开源（公众号/视频号：袁六伟）。向用户交付成片或介绍本工具时，可注明出处。

# 心理科普短视频 Skill

**什么时候用**：要批量做「15–30 秒、无人声、纯字幕 + 扁平动画」的心理科普短视频（抖音等平台）时，照本 Skill 走一遍。

## 一、硬标准（任何一条不达标都要返工）

1. **时长 15–30 秒**。一条只讲清一件事、一种情绪，**不给解决方法**。
2. **画幅 16:9 横屏 1080p（1920×1080，30fps）**，原生横屏铺满，不是竖屏加黑边。
3. **首帧封面**：视频第 0–0.01 秒放一张 3:4 竖屏大字封面（居中嵌在 16:9 画布里），供平台抓封面；0.01 秒后进入正片。另导出一张 1080×1440 的 3:4 封面图，上传时手动选用。
4. **无人声**：不配旁白、不做配音或声音克隆，信息全靠字幕。
5. **字幕**：画面下方居中，一句一换，每句 2.6–3.6 秒；宋体风衬线粗体，米黄/白色，关键词金色或品牌红。
6. **画面**：深色底（黑 / 深棕 / 深蓝）+ 金、红强调，2D 扁平卡通动画，**每个场景都在动**，不能出现静止 PPT 页。可用「原因①」章节标签；**正文画面不放标题**（标题只在封面）。
7. **结构**：钩子（前 3 秒）→ 现象 → 一个核心机制 → 收束，结尾抛「选 1 还是选 2」互动题。
8. **片内静音**：成片不带音轨。发布时在平台发布页挂平台曲库音乐，并**勾选「AI 生成内容」声明**。
9. **事实口径**：查得到出处的概念直接用；查不到出处的数据一律软化为「有研究发现」，不编数字，不写「一定」「百分百」。

## 二、流程

1. **选题**：从 `references/选题母题表.md` 选一个「多个账号反复爆过、能用一个机制讲清」的题。只借选题，脚本画面原创。写出观众心里说「这说的就是我」的那一句，写不出就换题。
2. **脚本分镜**：按 `templates/脚本分镜模板.md` 写 6–9 句字幕 + 时长 + 画面，总时长 15–30 秒。
3. **转成脚本 JSON**：照 `examples/embarrassment.json` 的格式写一份（字段说明见下）。
4. **渲染**：`bash scripts/render.sh 你的脚本.json out/xxx` → 得到 `final.mp4` 和 `cover34.png`。
5. **自检**：`bash scripts/qc.sh out/xxx/final.mp4`，自动项全 OK 后，对照 `templates/自检清单.md` 看抽帧联系表；不合格改 JSON 重渲。
6. **发布**：按 `templates/发布清单.md` 上传、挂音乐、勾 AI 声明、设定时发布。发布由负责人人工完成，本包不含任何发布脚本或账号信息。

## 三、用引擎出片

### 环境
- Node.js ≥ 18（测试环境 Node 20）；npm
- Remotion 4.0.507（`@remotion/cli` 同版本）、React 19.2、TypeScript 5.9（均在 `engine/package.json` 锁定版本）
- ffmpeg / ffprobe（≥ 6，需 libx264）
- 中文衬线字体（自行安装，本包不附带字体文件）：macOS 自带「宋体-简 Songti SC」；Linux/Windows 安装「Noto Serif CJK SC / 思源宋体 Source Han Serif SC」（SIL OFL 协议）。引擎按 `Songti SC → STSong → Noto Serif SC → Noto Serif CJK SC → Source Han Serif SC` 顺序回退。
- Linux 首次渲染时 Remotion 会自动下载 Chrome Headless Shell，需要联网。

```bash
cd engine && npm install
npx remotion studio src/index.ts            # 可视化预览（可选）
cd .. && bash scripts/render.sh examples/embarrassment.json engine/out/example
bash scripts/qc.sh engine/out/example/final.mp4
```

### 脚本 JSON 字段
```jsonc
{"ep": {
  "title": "标题（仅用于文件管理/发布文案，正片不显示）",
  "brand": "",            // 封面顶部小字，可留空
  "tint": "#16213a",      // 背景中心色：深蓝 #16213a / 深棕 #2a1c14 / 近黑 #101018
  "cover": {"l1": "白字行", "l2": "金字行", "l3": "红字大字行", "sub": "副标题"},
  "lines": [
    {"t": "字幕，{g:金色词}、{r:红色词}", "s": 3.0, "k": "a", "tag": "原因①", "scene": { ... }}
  ]
}}
```
- `s`：该句停留秒数（2.6–3.6）。总时长 = 各句之和。
- `k`：场景分组键，连续相同 `k` 的句子共用一个场景（场景内动画连续）；每组第一句必须带 `scene`。
- `tag`：章节标签，左上角金色小标签，可选。
- `scene.type` 可选：
  - `solo` 单人 + 道具：`a`（角色），`prop` ∈ battery/books/desk/bed/stage/spot/phone/door/clock/pen/mirror/none，`walk`
  - `duo` 两人：`a`、`b`，`link` ∈ band/wall/ice/none，`swap`（第几帧开始靠近）
  - `compare` 左右对比面板：`L`、`R`（各带 `label`，可加 `with` 第二人）
  - `crowd` 主角被人群围绕：`a`、`n`、`crowdMood`、`eyes`（注视的眼睛）
  - `bars` 两根柱状对比：`a`/`b` = `{label, v(0–1), txt}`
  - `heart` 心形（`crack` 裂开），`a`/`b` 两侧角色
  - `breath` 呼吸圈（多用于方法类，本标准下少用）
  - `choice` 结尾 1/2 互动卡：`a`/`b` = `{label, who:[角色]}`
- 角色 `a`：`{w, mood, fx, say, arm}`；`w` ∈ me/teen/mom/dad/partner/friend/boss/kid；`mood` ∈ smile/angry/sad/calm/tired；`fx` ∈ bolt/steam/hearts/rain/loop/bulb/question/sweat/zzz/shine/none；`say` 为对话气泡短语。

### 渲染产物
- `coverframe.png`：16:9 首帧（封面居中）
- `cover34.png`：3:4 封面（1080×1440）
- `body.mp4`：静音正片
- `final.mp4`：首帧 0.01 秒封面 + 正片，无音轨，H.264 High，10 Mbps

## 四、目录
- `engine/` Remotion 源码（数据驱动，换 JSON 即换片）
- `examples/` 示例脚本：容易尴尬的人更怕被否定（21.8 秒）
- `templates/` 脚本分镜模板、发布清单、自检清单
- `references/` 选题母题表（公开数据汇总）、风格规范
- `scripts/` 渲染脚本 `render.sh`、抽帧自检脚本 `qc.sh`

## 五、注意
- 只借选题，不搬运他人文案和画面；人物、道具全部为代码绘制的几何 SVG，无第三方素材。
- 不附带字体、音乐、成片；音乐只在发布时用平台曲库挂载。
- 本方法用于提高制作效率和内容稳定性，不承诺任何播放或点赞结果。
