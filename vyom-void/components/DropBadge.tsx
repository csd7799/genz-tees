"use client";

/* ===== Drop Badge Component ===== */
/* Reusable badge showing drop number (e.g. "DROP 001") */
interface DropBadgeProps {
  dropNumber: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "active" | "muted";
}

export default function DropBadge({
  dropNumber,
  size = "sm",
  variant = "default",
}: DropBadgeProps) {
  const sizeClasses = {
    sm: "text-[10px] px-2.5 py-1",
    md: "text-xs px-3 py-1.5",
    lg: "text-sm px-4 py-2",
  };

  const variantClasses = {
    default:
      "border-[#7B2FBE] text-[#7B2FBE] bg-[rgba(123,47,190,0.08)]",
    active:
      "border-[#00D4FF] text-[#00D4FF] bg-[rgba(0,212,255,0.08)]",
    muted: "border-[#2A2A3A] text-[#6A6A80] bg-transparent",
  };

  return (
    <span
      className={`inline-block font-grotesk font-medium uppercase tracking-[0.2em] border rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      DROP {dropNumber}
    </span>
  );
}
