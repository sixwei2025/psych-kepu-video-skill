import React from 'react';
import {spring, useCurrentFrame, useVideoConfig, random} from 'remotion';
// 配色：金 / 品牌红 / 米黄。字体只写名称，需使用者自行安装（见 README / SKILL.md）。
export const GOLD = '#E6C27A', RED = '#C8102E', CREAM = '#F5E9D3';
export const SERIF = '"Songti SC","STSong","Noto Serif SC","Noto Serif CJK SC","Source Han Serif SC",serif';
export const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
export const useSp = (delay = 0, damping = 14) => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return spring({frame: f - delay, fps, config: {damping}}); };

// 深色底 + 透视金色网格 + 漂浮光点 + 顶部聚光（保证每一帧都在动）
export const Bg: React.FC<{tint?: string}> = ({tint = '#16213a'}) => {
  const f = useCurrentFrame();
  const dots = Array.from({length: 60}, (_, i) => i);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="bgG" cx="50%" cy="38%" r="75%"><stop offset="0%" stopColor={tint} /><stop offset="100%" stopColor="#07080d" /></radialGradient>
        <radialGradient id="spot" cx="50%" cy="0%" r="70%"><stop offset="0%" stopColor="#E6C27A" stopOpacity="0.16" /><stop offset="100%" stopColor="#E6C27A" stopOpacity="0" /></radialGradient>
        <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E6C27A" stopOpacity="0" /><stop offset="100%" stopColor="#E6C27A" stopOpacity="0.22" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#bgG)" />
      <rect width={1920} height={1080} fill="url(#spot)" />
      <g stroke="url(#floorFade)" strokeWidth={1.4}>
        {Array.from({length: 25}, (_, i) => { const x = (i - 12) * 160; return <line key={'v' + i} x1={960 + x * 0.25} y1={700} x2={960 + x * 1.6} y2={1080} />; })}
        {Array.from({length: 8}, (_, i) => { const p = ((i + (f / 90) % 1) / 8); const y = 700 + Math.pow(p, 2) * 380; return <line key={'h' + i} x1={0} y1={y} x2={1920} y2={y} opacity={p} />; })}
      </g>
      {dots.map((i) => { const x = random('x' + i) * 1920; const y0 = random('y' + i) * 1080; const sp = 0.2 + random('s' + i) * 0.6; const y = (y0 - f * sp + 1080 * 2) % 1080; const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i)); return <circle key={i} cx={x} cy={y} r={1 + random('r' + i) * 2.4} fill={GOLD} opacity={0.5 * tw} />; })}
    </svg>
  );
};

// 扁平卡通人物（纯 SVG 几何造型，无外部素材）
export type Mood = 'smile' | 'angry' | 'sad' | 'calm' | 'tired';
export const Person: React.FC<{x: number; y: number; s?: number; body?: string; skin?: string; hair?: string; mood?: Mood; armL?: number; armR?: number; bob?: number; flip?: boolean; grey?: boolean; bun?: boolean}> = ({x, y, s = 1, body = '#3E6FB0', skin = '#F2C9A0', hair = '#2a1d17', mood = 'smile', armL = 10, armR = -10, bob = 0, flip, grey, bun}) => {
  const hc = grey ? '#cfcac2' : hair;
  const eyeY = -168;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={6} rx={60} ry={10} fill="#000" opacity={0.35} />
      <rect x={-26} y={-60} width={20} height={64} rx={8} fill="#2b2b38" />
      <rect x={6} y={-60} width={20} height={64} rx={8} fill="#2b2b38" />
      <g transform={`rotate(${armL},-40,-130)`}><rect x={-52} y={-132} width={20} height={80} rx={10} fill={body} /><circle cx={-42} cy={-50} r={11} fill={skin} /></g>
      <g transform={`rotate(${armR},40,-130)`}><rect x={32} y={-132} width={20} height={80} rx={10} fill={body} /><circle cx={42} cy={-50} r={11} fill={skin} /></g>
      <rect x={-44} y={-140} width={88} height={92} rx={30} fill={body} />
      <circle cx={0} cy={-180} r={44} fill={skin} />
      {bun ? <><circle cx={0} cy={-230} r={18} fill={hc} /><path d="M-44,-185 Q-40,-232 0,-226 Q40,-232 44,-185 Q30,-210 0,-208 Q-30,-210 -44,-185Z" fill={hc} /></>
        : <path d="M-46,-178 Q-48,-232 0,-228 Q48,-232 46,-178 Q36,-205 10,-206 Q-20,-200 -46,-178Z" fill={hc} />}
      {mood === 'angry' ? <><line x1={-26} y1={eyeY - 16} x2={-8} y2={eyeY - 8} stroke="#2a1d17" strokeWidth={5} strokeLinecap="round" /><line x1={26} y1={eyeY - 16} x2={8} y2={eyeY - 8} stroke="#2a1d17" strokeWidth={5} strokeLinecap="round" /></> : null}
      {mood === 'tired' || mood === 'calm' ? <><path d={`M-24,${eyeY} q8,6 16,0`} stroke="#2a1d17" strokeWidth={4} fill="none" strokeLinecap="round" /><path d={`M8,${eyeY} q8,6 16,0`} stroke="#2a1d17" strokeWidth={4} fill="none" strokeLinecap="round" /></>
        : <><circle cx={-16} cy={eyeY} r={5} fill="#2a1d17" /><circle cx={16} cy={eyeY} r={5} fill="#2a1d17" /></>}
      {mood === 'smile' || mood === 'calm' ? <path d="M-14,-152 Q0,-140 14,-152" stroke="#8a3a2a" strokeWidth={4} fill="none" strokeLinecap="round" /> : null}
      {mood === 'angry' ? <ellipse cx={0} cy={-148} rx={12} ry={8} fill="#7a1f1f" /> : null}
      {mood === 'sad' || mood === 'tired' ? <path d="M-12,-144 Q0,-154 12,-144" stroke="#8a3a2a" strokeWidth={4} fill="none" strokeLinecap="round" /> : null}
      {mood === 'sad' ? <path d="M20,-160 q4,10 0,14 q-4,-4 0,-14Z" fill="#7fb8ff" /> : null}
      <circle cx={-28} cy={-160} r={7} fill="#ff8f8f" opacity={0.45} /><circle cx={28} cy={-160} r={7} fill="#ff8f8f" opacity={0.45} />
    </g>
  );
};

export const Glow: React.FC<{children: React.ReactNode; c?: string; b?: number}> = ({children, c = GOLD, b = 18}) => <g style={{filter: `drop-shadow(0 0 ${b}px ${c})`}}>{children}</g>;
