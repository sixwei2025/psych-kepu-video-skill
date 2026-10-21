import React from 'react';
import {Composition} from 'remotion';
import {EpBody, EpCover34, EpCoverFrame, epFrames, EpData} from './Ep';
import sample from '../../examples/embarrassment.json';

// 三个合成，全部由 --props=<脚本.json> 驱动：
//   EpBody       正片 1920x1080 / 30fps（静音）
//   EpCover34    3:4 封面 1080x1440（单帧，供上传封面用）
//   EpCoverFrame 3:4 封面居中放进 16:9 画布（单帧，拼接到视频第 0.01 秒）
const def = sample as unknown as {ep: EpData};
export const Root: React.FC = () => (<>
  <Composition id="EpBody" component={EpBody as any} fps={30} width={1920} height={1080} defaultProps={def} calculateMetadata={({props}: any) => ({durationInFrames: epFrames(props.ep)})} />
  <Composition id="EpCover34" component={EpCover34 as any} durationInFrames={1} fps={30} width={1080} height={1440} defaultProps={def} />
  <Composition id="EpCoverFrame" component={EpCoverFrame as any} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={def} />
</>);
