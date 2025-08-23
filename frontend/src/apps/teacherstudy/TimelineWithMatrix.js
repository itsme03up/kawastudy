import React from "react";
import BackgroundMatrix from "../../components/BackgroundMatrix";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const TimelineWithMatrix = () => (
  <div style={{ position: "relative", minHeight: "100vh", width: "100vw" }}>
    <BackgroundMatrix />
    <div style={{ position: "relative", zIndex: 1, paddingTop: 40, maxWidth: 800, margin: "0 auto 0 120px" }}>
      <h1 style={{ marginBottom: 32, marginLeft: 20, fontWeight: 'bold', color: '#fff' }}>エピソード分析</h1>
      <VerticalTimeline>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          iconStyle={{ background: '#2196f3', color: '#fff' }}
          contentStyle={{ background: 'rgba(227,242,253,0.9)', color: '#333' }}
          contentArrowStyle={{ borderRight: '7px solid #2196f3' }}
        >
          <h3 className="vertical-timeline-element-title">タイポ・漢字ミス</h3>
          <h4 className="vertical-timeline-element-subtitle">Pratfall Effect</h4>
          <p>有能な人の小さな失敗が、逆に親近感を生み好感度を高める。</p>
          <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => window.alert('細かいエピソード: 川田先生が「漢字ミス」をしてしまい、みんなが親近感を持った。')}>細かいエピソード・心理効果を開く</button>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          iconStyle={{ background: '#4caf50', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">犬や日常会話</h3>
          <h4 className="vertical-timeline-element-subtitle">Self-disclosure Effect</h4>
          <p>自己開示によって距離が縮まり、心理的な近さを感じさせる。</p>
          <button className="btn btn-outline-success btn-sm mt-2" onClick={() => window.alert('細かいエピソード: 川田先生が犬の話や日常会話をして、心理的距離が縮まった。')}>細かいエピソード・心理効果を開く</button>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          iconStyle={{ background: '#ff9800', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">白湯→梅干し焼酎事件</h3>
          <h4 className="vertical-timeline-element-subtitle">Humor Effect</h4>
          <p>ユーモラスな失敗は、記憶に残りやすく共有されやすい。</p>
          <button className="btn btn-outline-warning btn-sm mt-2" onClick={() => window.alert('細かいエピソード: 白湯を頼んだら梅干し焼酎が出てきて、みんなで大笑いした。')}>細かいエピソード・心理効果を開く</button>
        </VerticalTimelineElement>
        {/* 既存のタイムライン要素をここに記載 */}
      </VerticalTimeline>
    </div>
  </div>
);

export default TimelineWithMatrix;
