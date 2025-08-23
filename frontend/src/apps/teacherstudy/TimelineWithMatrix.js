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
          contentStyle={{ background: '#e3f2fd', color: '#333' }}
          contentArrowStyle={{ borderRight: '7px solid #2196f3' }}
          date="2025年8月"
          iconStyle={{ background: '#2196f3', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">研究開始</h3>
          <h4 className="vertical-timeline-element-subtitle">プロジェクト発足</h4>
          <p>なぜ今回このような事を行なったか、背景や目的を記載。</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2025年9月"
          iconStyle={{ background: '#4caf50', color: '#fff' }}
        >
          <h3 className="vertical-timeline-element-title">初期実装</h3>
          <p>主要な機能の開発・検証。</p>
        </VerticalTimelineElement>
        {/* 追加のタイムライン要素をここに記載 */}
      </VerticalTimeline>
    </div>
  </div>
);

export default TimelineWithMatrix;
