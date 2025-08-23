import React from "react";
import { createRoot } from "react-dom/client";
import BackgroundMatrix from "../../components/BackgroundMatrix";

const container = document.getElementById("teacherstudy-react");
if (container) {
  const root = createRoot(container);
  root.render(<BackgroundMatrix />);
}
