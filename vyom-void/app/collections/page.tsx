"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollAnimate from "@/components/ScrollAnimate";
import { drops } from "@/lib/data";

export default function CollectionsPage() {
  return (
    <div className="pt-24 pb-20">
      <section className="px-6 pb-12 border-b border-[#1A1A2A]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-3">Collections</p>
            <h1 className="font-syne font-extrabold text-5xl md:text-6xl text-[#E8E8F0] mb-4">The Drops</h1>
            <p className="font-dm text-[#6A6A80] text-base max-w-lg">Each drop is a chapter in the void. A Sanskrit concept, a cosmic idea, a limited collection.</p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {drops.map((drop, i) => (
            <ScrollAnimate key={drop.id} delay={i * 0.1}>
              <div className={`relative rounded-2xl border p-8 md:p-10 transition-all duration-500 overflow-hidden ${
                drop.status === "active"
                  ? "border-[#7B2FBE] bg-[#14141F] hover:shadow-[0_0_40px_rgba(123,47,190,0.1)]"
                  : drop.status === "upcoming"
                  ? "border-[#00D4FF] bg-[#14141F] border-dashed"
                  : "border-[#2A2A3A] bg-[#0E0E15]"
              }`}>
                {/* Archived overlay */}
                {drop.status === "archived" && (
                  <div className="absolute inset-0 bg-[rgba(10,10,15,0.7)] flex items-center justify-center z-10 rounded-2xl">
                    <p className="font-syne font-bold text-xl text-[#6A6A80] rotate-[-3deg]">This drop has dissolved</p>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    {/* Status badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`font-grotesk text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full border ${
                        drop.status === "active" ? "border-[#7B2FBE] text-[#7B2FBE]" : drop.status === "upcoming" ? "border-[#00D4FF] text-[#00D4FF]" : "border-[#2A2A3A] text-[#6A6A80]"
                      }`}>
                        {drop.status === "active" ? "● Active" : drop.status === "upcoming" ? "◎ Upcoming" : "○ Archived"}
                      </span>
                    </div>

                    {/* Drop info */}
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="font-mono text-sm text-[#7B2FBE]">DROP {drop.number}</span>
                      <span className="font-syne font-extrabold text-3xl md:text-4xl text-[#E8E8F0]">{drop.sanskritName}</span>
                    </div>
                    <p className="font-grotesk text-sm uppercase tracking-[0.15em] text-[#6A6A80] mb-4">{drop.englishMeaning}</p>
                    <p className="font-dm text-sm text-[#B0B0C0] leading-relaxed max-w-xl">{drop.concept}</p>
                  </div>

                  {/* Action */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <p className="font-grotesk text-[10px] uppercase tracking-[0.2em] text-[#6A6A80]">
                      {drop.status === "upcoming" ? "Coming Soon" : `Released ${drop.releaseDate}`}
                    </p>
                    {drop.status === "active" && (
                      <Link href="/shop" className="flex items-center gap-2 font-grotesk text-xs uppercase tracking-[0.15em] text-[#7B2FBE] hover:text-[#9B4FDE] transition-colors">
                        Shop drop <ArrowRight size={12} />
                      </Link>
                    )}
                    {drop.status === "upcoming" && (
                      <Link href="/drops" className="flex items-center gap-2 font-grotesk text-xs uppercase tracking-[0.15em] text-[#00D4FF] hover:text-[#33DDFF] transition-colors">
                        Get notified <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </section>
    </div>
  );
}
