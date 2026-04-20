"use client";

import { motion } from "framer-motion";
import ScrollAnimate from "@/components/ScrollAnimate";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 py-20 border-b border-[#1A1A2A]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-grotesk text-xs uppercase tracking-[0.4em] text-[#7B2FBE] mb-6">Our Story</p>
            <h1 className="font-syne font-extrabold text-5xl md:text-6xl lg:text-7xl text-[#E8E8F0] leading-[1.1] mb-8">
              The universe was born from शून्य —{" "}
              <span className="gradient-text">nothingness.</span>
              <br />
              So were we.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Sanskrit Etymology */}
      <section className="px-6 py-24 border-b border-[#1A1A2A]">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-4">Etymology</p>
                <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-[#E8E8F0] mb-6">व्योम</h2>
                <p className="font-grotesk text-sm uppercase tracking-[0.2em] text-[#6A6A80] mb-2">Vyom (Sanskrit)</p>
                <p className="font-dm text-[#B0B0C0] leading-relaxed">
                  Sky. Ether. The infinite expanse. In Vedic cosmology, <em>Vyom</em> represents आकाश (Akasha) — the fifth element, the space that holds all matter and energy. It is not empty; it is pregnant with possibility.
                </p>
              </div>
              <div>
                <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#00D4FF] mb-4">Philosophy</p>
                <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-[#E8E8F0] mb-6">शून्य</h2>
                <p className="font-grotesk text-sm uppercase tracking-[0.2em] text-[#6A6A80] mb-2">Void / Shunya (Sanskrit)</p>
                <p className="font-dm text-[#B0B0C0] leading-relaxed">
                  Zero. Emptiness. The void from which creation emerges. India gave the world the concept of zero — not as absence, but as the infinite potential from which everything manifests. VYOM VOID is that space between existence and nothingness.
                </p>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Manifesto */}
      <section className="px-6 py-24 border-b border-[#1A1A2A]">
        <div className="max-w-3xl mx-auto">
          <ScrollAnimate>
            <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-8">Manifesto</p>
            <div className="space-y-6 font-dm text-lg text-[#B0B0C0] leading-relaxed">
              <p>We are not a clothing brand. We are a frequency.</p>
              <p>
                Born in the vast intersection of ancient Indian philosophy and cosmic minimalism, <strong className="text-[#E8E8F0]">VYOM VOID</strong> exists for those who see the universe not as decoration, but as <em>identity</em>.
              </p>
              <p>
                Every thread carries a Sanskrit whisper. Every drop is a cosmic event — limited, intentional, never repeated. We don&apos;t make clothes; we create artifacts from the void.
              </p>
              <p>
                We believe that <strong className="text-[#E8E8F0]">darkness is not absence — it is depth.</strong> That silence speaks louder than noise. That true style comes not from following, but from orbiting your own truth.
              </p>
              <p>
                Our audience doesn&apos;t wear logos to be seen. They wear symbols to be <em>felt.</em>
              </p>
              <p className="text-[#6A6A80] font-grotesk text-sm uppercase tracking-[0.2em] pt-4">
                We don&apos;t follow trends. We orbit them.
              </p>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <ScrollAnimate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="p-8 border border-[#7B2FBE] rounded-2xl bg-[rgba(123,47,190,0.03)]">
                <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-4">Mission</p>
                <h3 className="font-syne font-bold text-2xl text-[#E8E8F0] mb-4">Why we exist</h3>
                <p className="font-dm text-[#B0B0C0] leading-relaxed">
                  To give Indian Gen Z a streetwear language that is rooted in their own cosmic heritage — not borrowed from the West, not nostalgic about the past, but alive in the present void. Each piece is a bridge between the ancient and the infinite.
                </p>
              </div>

              {/* Vision */}
              <div className="p-8 border border-[#00D4FF] rounded-2xl bg-[rgba(0,212,255,0.03)]">
                <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#00D4FF] mb-4">Vision</p>
                <h3 className="font-syne font-bold text-2xl text-[#E8E8F0] mb-4">Where we&apos;re headed</h3>
                <p className="font-dm text-[#B0B0C0] leading-relaxed">
                  To become India&apos;s most sought-after cosmic streetwear label — a cultural force that proves Indian design can be dark, minimal, and globally resonant. Not loud. Not decorative. Just void-deep and unmistakably ours.
                </p>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>
    </div>
  );
}
