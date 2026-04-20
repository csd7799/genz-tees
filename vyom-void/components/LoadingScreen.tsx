"use client";

import { useState, useEffect } from "react";

/* ===== Loading Screen ===== */
/* Void circle expanding animation that fades to homepage */
export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after animation
    const fadeTimer = setTimeout(() => setFadeOut(true), 1200);
    // Remove from DOM after fade completes
    const removeTimer = setTimeout(() => setShow(false), 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="loading-screen"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease-out",
      }}
    >
      {/* Brand name flash */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="void-circle" />
        <p
          className="font-syne text-sm tracking-[0.3em] text-muted-dark uppercase absolute -bottom-10"
          style={{
            animation: "fade-up 0.8s ease-out 0.3s forwards",
            opacity: 0,
          }}
        >
          VYOM VOID
        </p>
      </div>
    </div>
  );
}
