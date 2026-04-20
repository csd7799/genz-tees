import Link from "next/link";
import { Instagram, Twitter, Mail, ArrowUpRight } from "lucide-react";
import { navLinks } from "@/lib/data";

/* ===== Footer ===== */
export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A3A] bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-[#7B2FBE] flex items-center justify-center">
                <span className="font-syne text-xs font-bold text-[#E8E8F0]">VV</span>
              </div>
              <span className="font-syne font-extrabold text-xl text-[#E8E8F0]">
                VYOM VOID
              </span>
            </div>
            <p className="font-dm text-[#6A6A80] text-sm leading-relaxed max-w-sm mb-6">
              Where the sky meets nothingness. Indian-rooted cosmic streetwear
              for the generation that dresses in dark poetry.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/vyomvoid"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#2A2A3A] flex items-center justify-center text-[#6A6A80] hover:text-[#7B2FBE] hover:border-[#7B2FBE] transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://twitter.com/vyomvoid"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#2A2A3A] flex items-center justify-center text-[#6A6A80] hover:text-[#7B2FBE] hover:border-[#7B2FBE] transition-all duration-300"
              >
                <Twitter size={16} />
              </a>
              <a
                href="mailto:hello@vyomvoid.com"
                className="w-10 h-10 rounded-full border border-[#2A2A3A] flex items-center justify-center text-[#6A6A80] hover:text-[#7B2FBE] hover:border-[#7B2FBE] transition-all duration-300"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-grotesk text-xs uppercase tracking-[0.25em] text-[#6A6A80] mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-dm text-sm text-[#B0B0C0] hover:text-[#E8E8F0] transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-grotesk text-xs uppercase tracking-[0.25em] text-[#6A6A80] mb-4">
              Info
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="font-dm text-sm text-[#B0B0C0] hover:text-[#E8E8F0] transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <span className="font-dm text-sm text-[#B0B0C0]">
                  Shipping & Returns
                </span>
              </li>
              <li>
                <span className="font-dm text-sm text-[#B0B0C0]">
                  Size Guide
                </span>
              </li>
              <li>
                <span className="font-dm text-sm text-[#B0B0C0]">
                  Contact Us
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#1A1A2A] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-dm text-xs text-[#6A6A80]">
            © 2026 VYOM VOID. All rights reserved. Born from शून्य.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-grotesk text-xs uppercase tracking-[0.2em] text-[#6A6A80]">
              vyomvoid.com
            </span>
            <span className="font-grotesk text-xs uppercase tracking-[0.2em] text-[#6A6A80]">
              @vyomvoid
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
