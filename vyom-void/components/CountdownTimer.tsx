"use client";

import { useState, useEffect } from "react";

/* ===== Countdown Timer ===== */
/* Real-time DD:HH:MM:SS countdown in monospaced font */
interface CountdownTimerProps {
  targetDate: string; // ISO date string
  label?: string;
  size?: "sm" | "lg";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  targetDate,
  label = "DROP OPENS IN",
  size = "lg",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const blocks = [
    { value: pad(timeLeft.days), label: "DAYS" },
    { value: pad(timeLeft.hours), label: "HRS" },
    { value: pad(timeLeft.minutes), label: "MIN" },
    { value: pad(timeLeft.seconds), label: "SEC" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label */}
      <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#6A6A80]">
        {label}
      </p>

      {/* Timer blocks */}
      <div className="flex items-center gap-3">
        {blocks.map((block, i) => (
          <div key={block.label} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`font-mono font-bold text-[#E8E8F0] tabular-nums ${
                  size === "lg" ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
                }`}
              >
                {block.value}
              </span>
              <span className="font-grotesk text-[10px] uppercase tracking-[0.2em] text-[#6A6A80] mt-1">
                {block.label}
              </span>
            </div>
            {/* Separator */}
            {i < blocks.length - 1 && (
              <span
                className={`text-[#7B2FBE] font-mono font-bold ${
                  size === "lg" ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"
                } -mt-4`}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
