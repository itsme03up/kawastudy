import React, { useState } from "react";

function Question({ data, onAnswer }) {
  const [lang, setLang] = useState("ja");
  const [selected, setSelected] = useState(null);

  const handleLangChange = (l) => setLang(l);

  const handleChoiceClick = (idx) => {
    setSelected(idx);
    if (onAnswer) onAnswer(idx);
  };

  return (
    <div className="question-container">
      <div className="lang-toggle">
        <button onClick={() => handleLangChange("ja")} disabled={lang === "ja"}>
          日本語
        </button>
        <button onClick={() => handleLangChange("en")} disabled={lang === "en"}>
          English
        </button>
      </div>
      <p className="question-text">{data.question[lang]}</p>
      <ul>
        {data.choices[lang].map((choice, idx) => (
          <li
            key={idx}
            className={selected === idx ? "selected" : ""}
            onClick={() => handleChoiceClick(idx)}
            style={{ cursor: "pointer" }}
          >
            {choice}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Question;