"use client";

import { useEffect, useState } from "react";

/* ===== Custom Cursor Component ===== */
/* Glowing dot cursor with trailing ring effect */
export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);

      // Delayed trail
      setTimeout(() => {
        setTrailPosition({ x: e.clientX, y: e.clientY });
      }, 80);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    // Detect hoverable elements
    const handleHoverDetection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("select");
      setHovering(!!isHoverable);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleHoverDetection);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleHoverDetection);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="custom-cursor"
        style={{
          left: position.x - 6,
          top: position.y - 6,
          transform: hovering ? "scale(2)" : "scale(1)",
        }}
      />
      {/* Trail ring */}
      <div
        className="custom-cursor-trail"
        style={{
          left: trailPosition.x - 15,
          top: trailPosition.y - 15,
          transform: hovering ? "scale(1.5)" : "scale(1)",
        }}
      />
    </>
  );
}
