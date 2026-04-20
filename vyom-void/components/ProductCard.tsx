"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import DropBadge from "./DropBadge";
import type { Product } from "@/lib/data";

/* ===== Product Card Component ===== */
/* Dark card with front/back flip on hover, scarcity tag, and drop badge */
interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/shop/${product.slug}`} className="block group">
        <div className="bg-[#14141F] border border-[#2A2A3A] rounded-2xl overflow-hidden hover:border-[#7B2FBE] transition-all duration-500 hover:shadow-[0_0_40px_rgba(123,47,190,0.15)]">
          {/* Image area with flip effect */}
          <div className="card-flip-container relative aspect-[3/4] bg-[#0E0E15] overflow-hidden">
            <div className="card-flip-inner w-full h-full">
              {/* Front */}
              <div className="card-flip-front w-full h-full flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-[#14141F] to-[#0E0E15] flex items-center justify-center relative">
                  {/* Placeholder tee graphic */}
                  <div className="relative">
                    <svg
                      width="160"
                      height="180"
                      viewBox="0 0 160 180"
                      fill="none"
                      className="opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                    >
                      {/* T-shirt silhouette */}
                      <path
                        d="M40 30 L10 50 L25 65 L35 55 L35 165 L125 165 L125 55 L135 65 L150 50 L120 30 L100 40 L60 40 Z"
                        stroke="#7B2FBE"
                        strokeWidth="1.5"
                        fill="rgba(123,47,190,0.05)"
                      />
                      {/* Center design element */}
                      <circle
                        cx="80"
                        cy="100"
                        r="25"
                        stroke="#7B2FBE"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.6"
                      />
                      <circle
                        cx="80"
                        cy="100"
                        r="15"
                        stroke="#00D4FF"
                        strokeWidth="0.5"
                        fill="none"
                        opacity="0.4"
                      />
                    </svg>
                    <p className="absolute bottom-2 left-1/2 -translate-x-1/2 font-grotesk text-[10px] uppercase tracking-[0.3em] text-[#6A6A80]">
                      FRONT
                    </p>
                  </div>

                  {/* Drop badge overlay */}
                  <div className="absolute top-4 left-4">
                    <DropBadge dropNumber={product.dropNumber} />
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="card-flip-back w-full h-full flex items-center justify-center bg-gradient-to-br from-[#14141F] to-[#0E0E15]">
                <div className="relative">
                  <svg
                    width="160"
                    height="180"
                    viewBox="0 0 160 180"
                    fill="none"
                    className="opacity-40"
                  >
                    <path
                      d="M40 30 L10 50 L25 65 L35 55 L35 165 L125 165 L125 55 L135 65 L150 50 L120 30 L100 40 L60 40 Z"
                      stroke="#00D4FF"
                      strokeWidth="1.5"
                      fill="rgba(0,212,255,0.03)"
                    />
                    {/* Back design */}
                    <text
                      x="80"
                      y="95"
                      textAnchor="middle"
                      fill="#00D4FF"
                      fontSize="8"
                      fontFamily="Space Grotesk"
                      opacity="0.6"
                    >
                      VYOM VOID
                    </text>
                    <line
                      x1="50"
                      y1="105"
                      x2="110"
                      y2="105"
                      stroke="#00D4FF"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  </svg>
                  <p className="absolute bottom-2 left-1/2 -translate-x-1/2 font-grotesk text-[10px] uppercase tracking-[0.3em] text-[#6A6A80]">
                    BACK
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card info */}
          <div className="p-5">
            <h3 className="font-syne font-bold text-base text-[#E8E8F0] mb-1 group-hover:text-[#7B2FBE] transition-colors">
              {product.name}
            </h3>
            <p className="font-grotesk text-[11px] uppercase tracking-[0.2em] text-[#6A6A80] mb-3">
              {product.drop}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-syne font-bold text-lg text-[#E8E8F0]">
                {product.priceFormatted}
              </span>
              {product.stock <= 10 && (
                <span className="flex items-center gap-1 font-grotesk text-[10px] uppercase tracking-[0.15em] text-[#FF6B6B]">
                  <AlertTriangle size={10} />
                  Only {product.stock} left
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
