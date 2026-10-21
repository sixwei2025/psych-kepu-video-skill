import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Bg, GOLD, RED, CREAM, SERIF, cl} from './parts';
import {Scene, SceneSpec} from './lib';

// 脚本数据结构（与 examples/*.json 对应）
// t: 字幕，{g:词} 金色、{r:词} 红色；s: 停留秒数（建议 2.6–3.6）
// k: 场景分组键，连续相同 k 的字幕共用一个场景；每组第一句必须给 scene
// tag: 章节标签（如「原因①」），可选
export type EpLine = {t: string; s: number; tag?: string; k: string; scene?: SceneSpec};
export type EpData = {title: string; brand?: string; cover: {l1: string; l2: string; l3: string; sub: string}; lines: EpLine[]; tint?: string};
export const FPS = 30;
export const epFrames = (ep: EpData) => ep.lines.reduce((a, l) => a + Math.round(l.s * FPS), 0);

const Rich: React.FC<{t: string}> = ({t}) => <>{t.split(/(\{[gr]:[^}]+\})/).filter(Boolean).map((p, i) => { const m = p.match(/^\{([gr]):(.+)\}$/); if (!m) return <span key={i}>{p}</span>; const c = m[1] === 'g' ? GOLD : RED; return <span key={i} style={{color: c, textShadow: `0 0 18px ${c}88, 0 3px 8px #000`}}>{m[2]}</span>; })}</>;
const Sub: React.FC<{t: string; dur: number}> = ({t, dur}) => { const f = useCurrentFrame(); const op = interpolate(f, [0, 6, dur - 4, dur], [0, 1, 1, 0], cl); const y = interpolate(f, [0, 8], [16, 0], cl); return <div style={{position: 'absolute', left: 80, right: 80, bottom: 70, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 62, color: CREAM, letterSpacing: 2, opacity: op, transform: `translateY(${y}px)`, textShadow: '0 3px 10px #000', whiteSpace: 'nowrap'}}><Rich t={t} /></div>; };
const Tag: React.FC<{t: string}> = ({t}) => { const f = useCurrentFrame(); const s = interpolate(f, [0, 8], [0.7, 1], cl); return <div style={{position: 'absolute', top: 40, left: 60}}><div style={{transform: `scale(${s})`, transformOrigin: '0 0', padding: '10px 40px', borderRadius: 40, border: `3px solid ${GOLD}`, background: '#1a120cdd', color: GOLD, fontFamily: SERIF, fontWeight: 900, fontSize: 46, boxShadow: `0 0 24px ${GOLD}55`}}>{t}</div></div>; };
const Fade: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => { const f = useCurrentFrame(); return <AbsoluteFill style={{opacity: interpolate(f, [0, 8, d - 6, d], [0, 1, 1, 0], cl)}}>{children}</AbsoluteFill>; };

// 正片：无标题，只有场景 + 章节标签 + 字幕
export const EpBody: React.FC<{ep: EpData}> = ({ep}) => {
  let a = 0; const st = ep.lines.map((l) => { const s0 = a; a += Math.round(l.s * FPS); return [s0, a] as [number, number]; });
  const sc: {spec: SceneSpec; from: number; to: number; k: string}[] = []; const tg: {t: string; from: number; to: number}[] = [];
  ep.lines.forEach((l, i) => { const L = sc[sc.length - 1]; if (L && L.k === l.k) L.to = st[i][1]; else { if (!l.scene) throw new Error(`第 ${i + 1} 句开启新场景组 k=${l.k}，但没有 scene`); sc.push({spec: l.scene, from: st[i][0], to: st[i][1], k: l.k}); }
    if (l.tag) { const T = tg[tg.length - 1]; if (T && T.t === l.tag && T.to === st[i][0]) T.to = st[i][1]; else tg.push({t: l.tag, from: st[i][0], to: st[i][1]}); } });
  return <AbsoluteFill style={{background: '#07080d'}}><Bg tint={ep.tint} />
    {sc.map((s) => <Sequence key={s.from} from={s.from} durationInFrames={s.to - s.from}><Fade d={s.to - s.from}><Scene s={s.spec} /></Fade></Sequence>)}
    {tg.map((t) => <Sequence key={'t' + t.from} from={t.from} durationInFrames={t.to - t.from}><Tag t={t.t} /></Sequence>)}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 230, background: 'linear-gradient(transparent,#000000b0)'}} />
    {ep.lines.map((l, i) => <Sequence key={i} from={st[i][0]} durationInFrames={st[i][1] - st[i][0]}><Sub t={l.t} dur={st[i][1] - st[i][0]} /></Sequence>)}
  </AbsoluteFill>;
};

// 3:4 大字封面（三行：白 / 金 / 红 + 副标题）；brand 为可选的顶部小字，留空则不显示
export const EpCover34: React.FC<{ep: EpData}> = ({ep}) => { const c = ep.cover; const big = (t: string) => Math.min(150, Math.floor(700 / t.length));
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #2a1c14 0%, #0b0806 75%)', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 900, overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: 0, left: '50%', width: 900, height: 900, transform: 'translateX(-50%)', background: 'radial-gradient(circle at 50% 0%, #E6C27A33, transparent 65%)'}} />
    {ep.brand ? <div style={{position: 'absolute', top: 120, color: GOLD, fontSize: 44, letterSpacing: 14, opacity: 0.9}}>{ep.brand}</div> : null}
    <div style={{textAlign: 'center', lineHeight: 1.2, color: CREAM, textShadow: '0 6px 20px #000'}}>
      <div style={{fontSize: big(c.l1)}}>{c.l1}</div>
      <div style={{fontSize: big(c.l2), color: GOLD, textShadow: `0 0 30px ${GOLD}aa`}}>{c.l2}</div>
      <div style={{fontSize: Math.min(190, Math.floor(820 / c.l3.length)), color: RED, textShadow: `0 0 34px ${RED}aa, 0 6px 20px #000`}}>{c.l3}</div>
    </div>
    <div style={{position: 'absolute', bottom: 140, color: CREAM, opacity: 0.8, fontSize: 46, letterSpacing: 6}}>{c.sub}</div>
    <div style={{position: 'absolute', bottom: 110, width: 240, height: 4, background: GOLD, opacity: 0.7}} />
  </AbsoluteFill>; };

// 首帧：3:4 封面缩放后居中放进 16:9 画布，两侧同色系补满
export const EpCoverFrame: React.FC<{ep: EpData}> = ({ep}) => <AbsoluteFill style={{background: 'linear-gradient(90deg,#0b0806,#1a120d 40%,#1a120d 60%,#0b0806)', alignItems: 'center', justifyContent: 'center'}}><div style={{width: 810, height: 1080, position: 'relative', overflow: 'hidden', boxShadow: '0 0 60px #E6C27A33'}}><div style={{width: 1080, height: 1440, transform: 'scale(0.75)', transformOrigin: '0 0'}}><EpCover34 ep={ep} /></div></div></AbsoluteFill>;
