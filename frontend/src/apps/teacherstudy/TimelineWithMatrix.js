import React, { useState } from "react";
import BackgroundMatrix from "../../components/BackgroundMatrix";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Modal, Button } from "react-bootstrap";

const episodeData = [
  {
    title: "タイポ・漢字ミス",
    subtitle: "Pratfall Effect",
    summary: "有能な人の小さな失敗が、逆に親近感を生み好感度を高める。",
    detail: "細かいエピソード: 川田先生は漢字をよく間違う。また、タイポ（誤字脱字）も多く、3の4乗の暗算を間違う。が、16進数の暗算には成功する。Pratfall Effect（失敗効果）は、完璧な人が小さなミスをすることで、かえって親しみやすさや好感度が高まる心理現象です。"
  },
  {
    title: "犬や日常会話",
    subtitle: "Self-disclosure Effect",
    summary: "自己開示によって距離が縮まり、心理的な近さを感じさせる。",
    detail: "細かいエピソード: 川田先生が飼い犬の話や日常会話をして、心理的距離が縮まった。Self-disclosure Effect（自己開示効果）は、個人的な話をすることで相手との心理的距離が縮まる現象です。"
  },
  {
    title: "白湯→梅干し焼酎事件",
    subtitle: "Humor Effect",
    summary: "ユーモラスな失敗は、記憶に残りやすく共有されやすい。",
    detail: "細かいエピソード: 健康のために白湯を飲む習慣を梅干し入りのお湯割り焼酎にしてしまった話が出てきて、みんなで大笑いした。異様に渋い趣向と合わせて笑いを誘う。Humor Effect（ユーモア効果）は、面白い失敗や出来事が記憶に残りやすく、周囲と共有されやすい心理現象です。"
  },
  {
    title: "防音室・ロシアンハードベース",
    subtitle: "Von Restorff Effect",
    summary: "普通ではない独特な自己開示は、強烈に記憶に残る。",
    detail: "細かいエピソード: 川田先生が『自宅は防音室』『ロシアンハードベースが好き』と話し、強い印象を残した。Von Restorff Effect（フォン・レストルフ効果）は、周囲と異なる特異な特徴が特に記憶に残りやすい現象です。"
  },
  {
    title: "講師という立場",
    subtitle: "Authority Bias",
    summary: "講師という社会的役割そのものが、信頼や説得力を強める。",
    detail: "細かいエピソード: 川田先生の説明は、声や内容に加えて『講師だから信頼できる』と受講者に感じさせた。Authority Bias（権威バイアス）は、専門的地位や権威を持つ人の意見を信じやすくなる心理現象です。"
  },
  {
    title: "素直な失敗共有",
    subtitle: "Beautiful Mess Effect",
    summary: "自分の弱さや失敗を正直にさらけ出すと、むしろ魅力的に映る。",
    detail: "細かいエピソード: 値を固定しているのになぜか答えが変わらないと四苦八苦している時、受講者は安心し、親しみを感じた。Beautiful Mess Effect（美しい失敗効果）は、他人から見ると失敗の共有が魅力として評価される現象です。"
  },
  {
    title: "授業の最後の一言",
    subtitle: "Recency Effect",
    summary: "最後に与えられた印象が記憶に強く残る。",
    detail: "細かいエピソード: 授業の最後に『お疲れ様でございました』と一言添えることで、全体の印象が好意的に締めくくられる。Recency Effect（親近効果）は、直近の情報が特に記憶に残る心理現象です。"
  }
];

const TimelineWithMatrix = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", detail: "" });

  const handleOpenModal = (title, detail) => {
    setModalContent({ title, detail });
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw" }}>
      <BackgroundMatrix />
      <div style={{ position: "relative", zIndex: 1, paddingTop: 40, maxWidth: 1100, margin: "0 auto 0 40px" }}>
        <h1 style={{ marginBottom: 32, marginLeft: 20, fontWeight: 'bold', color: '#fff' }}>エピソード分析</h1>
        <VerticalTimeline>
          {episodeData.map((ep, idx) => (
            <VerticalTimelineElement
              key={ep.title}
              className="vertical-timeline-element--work"
              iconStyle={{
                background: [
                  '#2196f3', // 青
                  '#e91e63', // ピンク
                  '#ff9800', // オレンジ
                  '#4caf50', // 緑
                  '#9c27b0', // 紫
                  '#00bcd4', // シアン
                  '#f44336', // 赤
                  '#607d8b', // グレー
                  '#8bc34a', // ライトグリーン
                  '#ffc107', // イエロー
                  '#795548', // ブラウン
                  '#3f51b5', // インディゴ
                  '#009688', // ティール
                  '#cddc39', // ライム
                  '#ffeb3b', // 明るい黄
                ][idx % 15],
                color: '#fff',
                boxShadow: '0 0 0 4px #fff, 0 2px 8px rgba(0,0,0,0.15)'
              }}
              contentStyle={{ background: 'rgba(227,242,253,0.9)', color: '#333' }}
              contentArrowStyle={{ borderRight: `7px solid ${[
                  '#2196f3', '#e91e63', '#ff9800', '#4caf50', '#9c27b0', '#00bcd4', '#f44336', '#607d8b', '#8bc34a', '#ffc107', '#795548', '#3f51b5', '#009688', '#cddc39', '#ffeb3b'][idx % 15]}` }}
            >
              <h3 className="vertical-timeline-element-title">{ep.title}</h3>
              <h4 className="vertical-timeline-element-subtitle">{ep.subtitle}</h4>
              <p>{ep.summary}</p>
              <Button variant={idx === 0 ? "outline-primary" : idx === 1 ? "outline-danger" : idx === 2 ? "outline-warning" : "outline-success"} size="sm" className="mt-2" onClick={() => handleOpenModal(ep.title, ep.detail)}>
                細かいエピソード・心理効果を開く
              </Button>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{modalContent.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ whiteSpace: 'pre-line' }}>{modalContent.detail}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>閉じる</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default TimelineWithMatrix;
