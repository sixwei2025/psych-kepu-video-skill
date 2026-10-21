import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Person, Glow, GOLD, RED, CREAM, SERIF, cl, useSp, Mood} from './parts';
// 场景库：脚本 JSON 里的 scene 字段选用下面的 SceneSpec 类型
const W = 1920;
export type Who = 'me' | 'teen' | 'mom' | 'dad' | 'partner' | 'friend' | 'boss' | 'kid';
const look = (w: Who = 'me') => ({
  me: {body: '#3E6FB0'}, teen: {body: '#4f8f7a', s: 0.85}, kid: {body: '#4f8f7a', s: 0.8},
  mom: {body: '#9c5b4a', grey: true, bun: true}, dad: {body: '#4b6b4a', grey: true},
  partner: {body: '#b0546b', hair: '#4a2a1a', bun: true}, friend: {body: '#6d5a8c', hair: '#3a2a20'}, boss: {body: '#3b3b48'},
} as any)[w];
const P: React.FC<{w?: Who; x: number; y?: number; mood?: Mood; flip?: boolean; armL?: number; armR?: number; bob?: number; s?: number}> = ({w = 'me', x, y = 800, s, ...r}) => { const l = look(w); return <Person x={x} y={y} {...l} s={(s ?? 1) * (l.s ?? 1)} {...r} />; };

export const Steam: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => <g>{[0, 1, 2].map((i) => { const p = ((f / 18 + i / 3) % 1); return <path key={i} d={`M${x + (i - 1) * 30},${y - p * 70} q10,-14 0,-28 q-10,-14 0,-28`} stroke={RED} strokeWidth={7} fill="none" strokeLinecap="round" opacity={1 - p} />; })}</g>;
export const Bolt: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => <Glow c={RED}><path transform={`translate(${x},${y}) scale(${s})`} d="M0,-40 L-18,4 L-2,4 L-10,40 L20,-8 L4,-8 L12,-40Z" fill={RED} /></Glow>;
const Hearts: React.FC<{x: number; y: number; f: number; c?: string}> = ({x, y, f, c = GOLD}) => <g>{[0, 1, 2].map((i) => { const p = ((f / 40 + i / 3) % 1); return <text key={i} x={x + (i - 1) * 60} y={y - p * 140} fontSize={54} fill={i === 1 ? RED : c} opacity={1 - p} textAnchor="middle">♥</text>; })}</g>;
const Cloud: React.FC<{x: number; y: number; f: number; rain?: boolean}> = ({x, y, f, rain = true}) => <g transform={`translate(${x},${y + Math.sin(f / 12) * 6})`}><ellipse rx={110} ry={46} fill="#3b3f4f" /><ellipse cx={-50} cy={-26} rx={60} ry={42} fill="#3b3f4f" /><ellipse cx={46} cy={-30} rx={54} ry={44} fill="#3b3f4f" />{rain ? [0, 1, 2].map((i) => <line key={i} x1={-50 + i * 50} y1={50} x2={-60 + i * 50} y2={50 + ((f * 6 + i * 20) % 60)} stroke="#7fb8ff" strokeWidth={4} />) : null}</g>;
export const Bubble: React.FC<{x: number; y: number; text: string; sp?: number; dark?: boolean}> = ({x, y, text, sp = 1, dark}) => { const w = text.length * 50 + 90; return <g transform={`translate(${x},${y}) scale(${sp})`}><rect x={-w / 2} y={-60} width={w} height={100} rx={50} fill={dark ? '#2a2f3d' : CREAM} stroke={dark ? GOLD : 'none'} strokeWidth={3} /><path d="M-20,36 L-40,84 L20,36Z" fill={dark ? '#2a2f3d' : CREAM} /><text y={8} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={dark ? CREAM : '#3a2a20'}>{text}</text></g>; };
const Loop: React.FC<{x: number; y: number; f: number; c?: string}> = ({x, y, f, c = RED}) => <g transform={`translate(${x},${y}) rotate(${f * 4})`}><Glow c={c} b={10}><path d="M-90,0 A90,90 0 1,1 0,90" stroke={c} strokeWidth={10} fill="none" strokeLinecap="round" /><path d="M-14,76 L8,92 L-12,110" stroke={c} strokeWidth={10} fill="none" strokeLinecap="round" /></Glow></g>;
const Panel: React.FC<{x: number; w: number; label: string; color?: string}> = ({x, w, label, color = GOLD}) => <g><rect x={x} y={110} width={w} height={720} rx={28} fill="#fff" fillOpacity={0.04} stroke={color} strokeOpacity={0.55} strokeWidth={2.5} /><text x={x + w / 2} y={174} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={color}>{label}</text></g>;

// 通用效果（挂在人物头顶）
export type Fx = 'bolt' | 'steam' | 'hearts' | 'rain' | 'loop' | 'bulb' | 'question' | 'sweat' | 'zzz' | 'shine' | 'none';
const FxAt: React.FC<{fx?: Fx; x: number; y: number; f: number}> = ({fx, x, y, f}) => {
  if (!fx || fx === 'none') return null;
  if (fx === 'bolt') return <><Steam x={x} y={y + 40} f={f} /><Bolt x={x + 120} y={y - 60} /></>;
  if (fx === 'steam') return <Steam x={x} y={y + 40} f={f} />;
  if (fx === 'hearts') return <Hearts x={x} y={y} f={f} />;
  if (fx === 'rain') return <Cloud x={x} y={y - 30} f={f} />;
  if (fx === 'loop') return <><Loop x={x} y={y - 60} f={f} /><text x={x} y={y - 42} textAnchor="middle" fontSize={56} fill={CREAM} fontFamily={SERIF} fontWeight={900}>?</text></>;
  if (fx === 'bulb') return <Glow b={30}><g transform={`translate(${x},${y - 70}) scale(${1 + 0.06 * Math.sin(f / 5)})`}><circle r={50} fill="#FFD36B" /><rect x={-20} y={44} width={40} height={30} rx={6} fill="#a8a8a8" /></g></Glow>;
  if (fx === 'question') return <g>{[0, 1, 2].map((i) => <text key={i} x={x + (i - 1) * 70} y={y - 30 - Math.abs(Math.sin(f / 10 + i)) * 30} textAnchor="middle" fontSize={70} fill={CREAM} fontFamily={SERIF} fontWeight={900} opacity={0.85}>?</text>)}</g>;
  if (fx === 'sweat') return <g>{[0, 1].map((i) => { const p = ((f / 20 + i / 2) % 1); return <path key={i} transform={`translate(${x + 50 + i * 20},${y + 60 + p * 40})`} d="M0,-14 q10,14 0,22 q-10,-8 0,-22Z" fill="#7fb8ff" opacity={1 - p} />; })}</g>;
  if (fx === 'zzz') return <g>{[0, 1, 2].map((i) => { const p = ((f / 40 + i / 3) % 1); return <text key={i} x={x + 40 + p * 60} y={y - p * 100} fontSize={40 + i * 8} fill={CREAM} opacity={1 - p} fontFamily={SERIF}>z</text>; })}</g>;
  if (fx === 'shine') return <Glow b={26}><g transform={`translate(${x},${y - 40}) rotate(${f * 2})`}>{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={0} y1={30} x2={0} y2={60} stroke={GOLD} strokeWidth={6} transform={`rotate(${i * 45})`} strokeLinecap="round" />)}</g></Glow>;
  return null;
};

export type Actor = {w?: Who; mood?: Mood; fx?: Fx; say?: string; arm?: number};
export type SceneSpec =
  | {type: 'compare'; L: Actor & {label: string; with?: Actor}; R: Actor & {label: string; with?: Actor}}
  | {type: 'duo'; a: Actor; b: Actor; link?: 'band' | 'wall' | 'ice' | 'none'; swap?: number}
  | {type: 'solo'; a: Actor; prop?: 'battery' | 'books' | 'desk' | 'bed' | 'stage' | 'spot' | 'phone' | 'door' | 'clock' | 'pen' | 'mirror' | 'none'; walk?: boolean}
  | {type: 'crowd'; a: Actor; n?: number; crowdMood?: Mood; eyes?: boolean}
  | {type: 'bars'; a: {label: string; v: number; txt: string}; b: {label: string; v: number; txt: string}}
  | {type: 'heart'; crack?: boolean; a?: Who; b?: Who}
  | {type: 'breath'; count?: number; a?: Actor}
  | {type: 'choice'; a: {label: string; who: Who[]}; b: {label: string; who: Who[]}};

export const Scene: React.FC<{s: SceneSpec}> = ({s}) => {
  const f = useCurrentFrame();
  const sp = useSp(0), sp2 = useSp(14), c1 = useSp(0), c2 = useSp(8);
  const bob = Math.sin(f / 8) * 4;
  const svg = (c: React.ReactNode, k = 1.25) => <svg width={W} height={1080} style={{position: 'absolute'}}><g transform={`translate(960,830) scale(${k}) translate(-960,-830)`}>{c}</g></svg>;
  const actor = (a: Actor, x: number, flip = false, delay = 0) => {
    const angry = a.mood === 'angry';
    const sh = angry ? Math.sin(f * 2.3) * 3 : 0;
    const sz = look(a.w).s ?? 1;
    const top = 800 - 240 * sz;
    return <g transform={`translate(${sh},0)`}>
      <P w={a.w} x={x} mood={a.mood} flip={flip} bob={bob * 0.5} armR={a.arm ?? (angry ? -45 : -12)} armL={angry ? 45 : 12} />
      <FxAt fx={a.fx} x={x} y={top - 40} f={f} />
      {a.say ? <Bubble x={x + (flip ? -150 : 150)} y={top - 110} text={a.say} sp={interpolate(f, [delay + 8, delay + 18], [0, 1], cl)} /> : null}
    </g>;
  };
  if (s.type === 'compare') {
    const side = (a: any, x0: number, col: string, p: number) => <g opacity={p} transform={`translate(0,${(1 - p) * 60})`}>
      <Panel x={x0} w={760} label={a.label} color={col} />
      {a.with ? <>{actor(a, x0 + 230, false)}{actor(a.with, x0 + 540, true)}</> : actor(a, x0 + 380)}
    </g>;
    return svg(<>{side(s.L, 150, GOLD, sp)}{side(s.R, 1010, RED, sp2)}</>, 1);
  }
  if (s.type === 'duo') {
    const gap = s.swap ? interpolate(f, [s.swap, s.swap + 30], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)}) : 0;
    const xa = 640 + gap * 140, xb = 1280 - gap * 140;
    return svg(<g opacity={sp}>
      {s.link === 'band' ? <Glow c={RED} b={12}><path d={`M${xa + 60},690 Q960,${690 + 40 * Math.sin(f / 10)} ${xb - 60},690`} stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" /></Glow> : null}
      {s.link === 'wall' ? <g transform={`translate(0,${(1 - sp) * 300})`}><rect x={920} y={420} width={80} height={400} fill="#5b6275" stroke="#8a93aa" strokeWidth={3} />{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={920} x2={1000} y1={500 + i * 80} y2={500 + i * 80} stroke="#8a93aa" strokeWidth={3} />)}</g> : null}
      {s.link === 'ice' ? <g opacity={0.9}>{[0, 1, 2, 3, 4, 5].map((i) => <text key={i} x={760 + i * 80} y={520 + Math.sin(f / 15 + i) * 20} fontSize={50} fill="#9fd4ff" textAnchor="middle">❄</text>)}</g> : null}
      {actor(s.a, xa)}{actor(s.b, xb, true, 14)}
    </g>);
  }
  if (s.type === 'solo') {
    const x = s.walk ? interpolate(f, [0, 90], [700, 900], cl) : 900;
    const pr = s.prop;
    return svg(<g opacity={sp}>
      {pr === 'battery' ? (() => { const lvl = interpolate(f, [5, 75], [1, 0.08], cl); const col = lvl > 0.5 ? '#6fd08c' : lvl > 0.25 ? GOLD : RED; return <g transform="translate(1250,330)"><rect width={180} height={84} rx={14} fill="none" stroke={CREAM} strokeWidth={6} /><rect x={180} y={26} width={14} height={32} rx={4} fill={CREAM} /><Glow c={col} b={14}><rect x={10} y={10} width={160 * lvl} height={64} rx={8} fill={col} /></Glow></g>; })() : null}
      {pr === 'books' ? <g>{[0, 1, 2, 3, 4, 5, 6].map((i) => { const y = interpolate(f, [i * 8, i * 8 + 12], [-200, 0], cl); return <rect key={i} x={1180 + (i % 2) * 14} y={760 - i * 46 + y} width={260} height={40} rx={6} fill={['#8a3a2a', '#2c5a7a', '#6b5a2a', '#4a2a5a'][i % 4]} stroke={GOLD} strokeOpacity={0.4} />; })}</g> : null}
      {pr === 'desk' ? <g><rect x={1080} y={600} width={440} height={24} rx={6} fill="#6b4a33" /><rect x={1100} y={624} width={20} height={180} fill="#4a3322" /><rect x={1480} y={624} width={20} height={180} fill="#4a3322" /><rect x={1180} y={560} width={200} height={40} rx={4} fill={CREAM} /><text x={1280} y={590} textAnchor="middle" fontSize={30} fill={RED} fontFamily={SERIF} fontWeight={900}>{Math.round(interpolate(f, [0, 60], [100, 59], cl))}</text></g> : null}
      {pr === 'bed' ? <g><Glow c="#e9e2c9"><path d="M1560,170 a60,60 0 1,0 50,95 a48,48 0 1,1 -50,-95Z" fill="#e9e2c9" /></Glow><rect x={560} y={660} width={800} height={140} rx={30} fill="#4a3a5a" /><rect x={600} y={620} width={200} height={60} rx={26} fill={CREAM} /></g> : null}
      {pr === 'stage' ? <g><rect x={300} y={790} width={1320} height={40} rx={10} fill="#5a3b26" /><path d={`M${x},0 L${x - 260},800 L${x + 260},800Z`} fill={GOLD} opacity={0.12} /></g> : null}
      {pr === 'spot' ? <path d={`M${x},0 L${x - 280},820 L${x + 280},820Z`} fill={GOLD} opacity={0.14 + 0.04 * Math.sin(f / 6)} /> : null}
      {pr === 'phone' ? <g transform={`translate(1240,${520 + Math.sin(f / 4) * 4})`}><rect x={-70} y={-130} width={140} height={260} rx={22} fill="#1d2230" stroke={GOLD} strokeWidth={4} /><rect x={-56} y={-108} width={112} height={200} rx={8} fill="#2c3a55" />{f % 30 < 15 ? <circle cx={50} cy={-110} r={18} fill={RED} /> : null}</g> : null}
      {pr === 'door' ? <g><rect x={1240} y={250} width={300} height={560} rx={14} fill="#5a3b26" stroke={GOLD} strokeWidth={5} /><circle cx={1280} cy={540} r={12} fill={GOLD} /></g> : null}
      {pr === 'clock' ? <g transform="translate(1300,420)"><circle r={140} fill="#1d2230" stroke={GOLD} strokeWidth={6} /><line x1={0} y1={0} x2={0} y2={-90} stroke={CREAM} strokeWidth={8} strokeLinecap="round" transform={`rotate(${f * 6})`} /><line x1={0} y1={0} x2={60} y2={0} stroke={GOLD} strokeWidth={10} strokeLinecap="round" transform={`rotate(${f / 2})`} /></g> : null}
      {pr === 'pen' ? <g transform="translate(1260,520)"><rect x={-170} y={-200} width={340} height={420} rx={12} fill={CREAM} />{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={-130} x2={-130 + Math.min(260, Math.max(0, (f - i * 10) * 14))} y1={-130 + i * 60} y2={-130 + i * 60} stroke="#8a6a4a" strokeWidth={5} />)}<g transform={`translate(${-100 + ((f * 14) % 260)},${-160 + Math.min(5, Math.floor(f / 10)) * 60}) rotate(30)`}><rect x={-10} y={-100} width={20} height={110} rx={5} fill={GOLD} /></g></g> : null}
      {pr === 'mirror' ? <g><ellipse cx={1300} cy={520} rx={170} ry={240} fill="#22324a" stroke={GOLD} strokeWidth={8} /><g opacity={0.6}><P w={s.a.w} x={1300} y={720} s={0.8} mood="sad" flip /></g></g> : null}
      {pr === 'bed' ? <g transform={`translate(700,640) rotate(-90)`}><P w={s.a.w} x={0} y={0} mood={s.a.mood} s={0.9} /></g> : actor(s.a, x)}
      {pr === 'bed' ? <FxAt fx={s.a.fx} x={760} y={540} f={f} /> : null}
      {pr === 'bed' && s.a.say ? <Bubble x={1050} y={420} text={s.a.say} sp={sp2} dark /> : null}
    </g>);
  }
  if (s.type === 'crowd') {
    const n = s.n ?? 6;
    return svg(<g opacity={sp}>
      <path d="M960,0 L700,820 L1220,820Z" fill={GOLD} opacity={0.13} />
      {Array.from({length: n}, (_, i) => { const side = i % 2 ? 1 : -1; const k = Math.floor(i / 2); const x = 960 + side * (300 + k * 210); const y = 820 - k * 10; const op = interpolate(f, [i * 5, i * 5 + 10], [0, 1], cl); return <g key={i} opacity={op * 0.85}><Person x={x} y={y} s={0.75} body={['#55607a', '#6d5a8c', '#4b6b4a', '#9c5b4a'][i % 4]} mood={s.crowdMood ?? 'calm'} flip={side > 0} />{s.eyes ? <g><circle cx={x - 14} cy={y - 240} r={12} fill={CREAM} /><circle cx={x + 14} cy={y - 240} r={12} fill={CREAM} /><circle cx={x - 14 - side * 4} cy={y - 240} r={5} fill="#111" /><circle cx={x + 14 - side * 4} cy={y - 240} r={5} fill="#111" /></g> : null}</g>; })}
      {actor(s.a, 960)}
    </g>);
  }
  if (s.type === 'bars') {
    const g = (v: number) => interpolate(f, [6, 40], [0, v], {...cl, easing: Easing.out(Easing.cubic)});
    const bar = (b: {label: string; v: number; txt: string}, x: number, col: string) => { const h = g(b.v) * 520; return <g><Glow c={col} b={16}><rect x={x - 90} y={760 - h} width={180} height={h} fill={col} opacity={0.85} /></Glow><text x={x} y={740 - h} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={col} opacity={interpolate(f, [30, 40], [0, 1], cl)}>{b.txt}</text><text x={x} y={820} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={CREAM}>{b.label}</text></g>; };
    return svg(<g opacity={sp}><line x1={560} x2={1360} y1={762} y2={762} stroke={GOLD} strokeOpacity={0.5} strokeWidth={3} />{bar(s.a, 760, GOLD)}{bar(s.b, 1160, RED)}</g>, 1);
  }
  if (s.type === 'heart') {
    const beat = 1 + 0.05 * Math.sin(f / 5); const crack = s.crack ? interpolate(f, [10, 34], [0, 1], cl) : 0;
    return svg(<g><g transform={`translate(960,470) scale(${sp * beat})`}><Glow c={s.crack ? RED : GOLD} b={40}><path d="M0,120 C-260,-40 -170,-250 0,-130 C170,-250 260,-40 0,120Z" fill={s.crack ? RED : GOLD} /></Glow>
      <path d="M-10,-130 L20,-70 L-20,-20 L15,40 L0,120" stroke="#1b0d0d" strokeWidth={10} fill="none" strokeDasharray={400} strokeDashoffset={400 * (1 - crack)} /></g>
      <P w={s.a ?? 'me'} x={430} y={820} mood={s.crack ? 'sad' : 'calm'} armR={-40} /><P w={s.b ?? 'partner'} x={1490} y={820} flip mood={s.crack ? 'sad' : 'smile'} armR={-40} /></g>);
  }
  if (s.type === 'breath') {
    const br = 1 + 0.18 * Math.sin(f / 90 * Math.PI * 2 - Math.PI / 2);
    const c = s.count ?? 0; const n = c ? Math.max(1, c - Math.floor(f / 9)) : null;
    return svg(<g opacity={sp}><Glow><circle cx={960} cy={600} r={150 * br} fill="none" stroke={GOLD} strokeWidth={5} opacity={0.75} /></Glow><circle cx={960} cy={600} r={220 * br} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.3} />
      {actor(s.a ?? {mood: 'calm'}, 960)}{n ? <text x={1400} y={420} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={140} fill={GOLD}>{n}</text> : null}</g>);
  }
  if (s.type === 'choice') {
    const pulse = 1 + 0.03 * Math.sin(f / 6);
    const card = (o: {label: string; who: Who[]}, x: number, n: string, col: string, p: number) => <g transform={`translate(${x},450) scale(${p * pulse})`}>
      <Glow c={col} b={24}><rect x={-330} y={-330} width={660} height={620} rx={36} fill="#11131c" stroke={col} strokeWidth={5} /></Glow>
      <circle cx={-230} cy={-230} r={58} fill={col} /><text x={-230} y={-206} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={72} fill="#fff">{n}</text>
      <text x={60} y={-200} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={o.label.length > 5 ? 52 : 66} fill={CREAM}>{o.label}</text>
      {o.who.map((w, i) => <P key={i} w={w} x={(i - (o.who.length - 1) / 2) * 180} y={250} s={0.85} flip={i > 0} />)}
    </g>;
    return svg(<>{card(s.a, 560, '1', RED, c1)}{card(s.b, 1360, '2', GOLD, c2)}</>, 1);
  }
  return null;
};
