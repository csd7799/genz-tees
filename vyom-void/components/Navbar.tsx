"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";

/* ===== Navbar ===== */
/* Sticky navbar: transparent on hero, solid dark + blur on scroll */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(10,10,15,0.85)] backdrop-blur-xl border-b border-[rgba(123,47,190,0.15)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border-2 border-[#7B2FBE] flex items-center justify-center group-hover:bg-[#7B2FBE] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(123,47,190,0.5)]">
              <span className="font-syne text-xs font-bold text-[#E8E8F0]">VV</span>
            </div>
            <span className="font-syne font-extrabold text-lg tracking-wide text-[#E8E8F0]">
              VYOM VOID
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-grotesk text-sm font-medium uppercase tracking-[0.2em] text-[#B0B0C0] hover:text-[#E8E8F0] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#7B2FBE] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right side: cart + mobile toggle */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#B0B0C0] hover:text-[#E8E8F0] transition-colors">
              <ShoppingBag size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#7B2FBE] rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                0
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-[#B0B0C0] hover:text-[#E8E8F0] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] bg-[rgba(10,10,15,0.97)] backdrop-blur-xl flex flex-col items-center justify-center gap-8 pt-20"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-syne text-3xl font-bold text-[#E8E8F0] hover:text-[#7B2FBE] transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
