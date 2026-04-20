"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Send } from "lucide-react";
import StarBackground from "@/components/StarBackground";
import CountdownTimer from "@/components/CountdownTimer";
import ProductCard from "@/components/ProductCard";
import ScrollAnimate from "@/components/ScrollAnimate";
import { products } from "@/lib/data";

/* ===== HOME PAGE ===== */
export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <StarBackground />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0F] z-[1]" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="font-grotesk text-xs uppercase tracking-[0.4em] text-[#6A6A80] mb-6"
          >
            Cosmic Streetwear · Est. 2026
          </motion.p>

          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="font-syne font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#E8E8F0] leading-[0.9] mb-6"
          >
            VYOM
            <br />
            <span className="gradient-text">VOID</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.3 }}
            className="font-grotesk text-base sm:text-lg text-[#6A6A80] tracking-wide mb-10 max-w-md mx-auto"
          >
            Where the sky meets nothingness.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-[#7B2FBE] hover:bg-[#9B4FDE] text-white font-grotesk text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 animate-glow-pulse"
            >
              Enter the void
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 3.0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown size={20} className="text-[#6A6A80]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED DROP SECTION ===== */}
      <section className="py-24 px-6 border-t border-[#1A1A2A]">
        <div className="max-w-5xl mx-auto text-center">
          <ScrollAnimate>
            <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-4">
              Featured Drop
            </p>
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-[#E8E8F0] mb-3">
              DROP 001 — SHUNYA
            </h2>
            <p className="font-dm text-[#6A6A80] text-base max-w-lg mx-auto mb-12">
              The origin drop. Born from शून्य — nothingness. The mathematical
              zero. The philosophical void. The beginning of everything.
            </p>
          </ScrollAnimate>

          <ScrollAnimate delay={0.2}>
            <CountdownTimer targetDate="2026-06-01T00:00:00+05:30" label="NEXT RESTOCK IN" />
          </ScrollAnimate>
        </div>
      </section>

      {/* ===== NEW ARRIVALS GRID ===== */}
      <section className="py-24 px-6 border-t border-[#1A1A2A]">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimate>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-2">
                  New Arrivals
                </p>
                <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-[#E8E8F0]">
                  Latest from the void
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden sm:flex items-center gap-2 font-grotesk text-sm uppercase tracking-[0.15em] text-[#B0B0C0] hover:text-[#7B2FBE] transition-colors"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollAnimate>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-grotesk text-sm uppercase tracking-[0.15em] text-[#B0B0C0] hover:text-[#7B2FBE] transition-colors"
            >
              View all products
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BRAND STORY TEASER ===== */}
      <section className="py-24 px-6 border-t border-[#1A1A2A]">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimate>
            <div className="relative py-16">
              {/* Decorative quotes */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 font-syne text-8xl text-[#7B2FBE] opacity-10 leading-none">
                &ldquo;
              </span>

              <p className="font-syne font-bold text-2xl md:text-3xl lg:text-4xl text-[#E8E8F0] leading-snug mb-4">
                The universe was born from शून्य —
                <br />
                <span className="gradient-text">nothingness.</span> So were we.
              </p>
              <p className="font-dm text-[#6A6A80] text-base mb-8">
                We don&apos;t follow trends. We orbit them.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-grotesk text-sm uppercase tracking-[0.2em] text-[#7B2FBE] hover:text-[#9B4FDE] transition-colors border-b border-[#7B2FBE] pb-1"
              >
                Read our story
                <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* ===== NEWSLETTER STRIP ===== */}
      <section className="py-20 px-6 bg-[#0E0E15] border-t border-b border-[#1A1A2A]">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollAnimate>
            <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-3">
              Stay Connected
            </p>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-[#E8E8F0] mb-3">
              Tune into the void
            </h2>
            <p className="font-dm text-[#6A6A80] text-sm mb-8">
              Get first access to drops, restocks, and cosmic transmissions.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-[#14141F] border border-[#2A2A3A] rounded-full px-6 py-3.5 text-sm font-dm text-[#E8E8F0] placeholder-[#6A6A80] outline-none focus:border-[#7B2FBE] transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#9B4FDE] text-white font-grotesk text-sm uppercase tracking-[0.15em] px-6 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(123,47,190,0.4)]"
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
                {!subscribed && <Send size={14} />}
              </button>
            </form>
          </ScrollAnimate>
        </div>
      </section>
    </>
  );
}
