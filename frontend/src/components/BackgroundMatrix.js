import React, { useEffect, useRef } from "react";

const letters = ["Kawada", "AWS", "SQL", "JOIN", "SELECT", "function", "Linux", "C"];

export default function BackgroundMatrix() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 20, 0.2)"; // 黒〜紺で残像
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px monospace";
      ctx.textAlign = "center";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const colors = ["#60a5fa", "#93c5fd", "#bfdbfe"]; // blue-400/300/200
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
    />
  );
}
