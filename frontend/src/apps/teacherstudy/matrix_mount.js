import React from "react";
import { createRoot } from "react-dom/client";
import TimelineWithMatrix from "./TimelineWithMatrix";

const container = document.getElementById("teacherstudy-react");
if (container) {
  const root = createRoot(container);
  root.render(<TimelineWithMatrix />);
}
