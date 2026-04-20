"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, ShoppingBag, Truck, Ruler, FileText, Layers } from "lucide-react";
import DropBadge from "@/components/DropBadge";
import ScrollAnimate from "@/components/ScrollAnimate";
import { getProductBySlug, products } from "@/lib/data";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [showFront, setShowFront] = useState(true);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center px-6">
        <h1 className="font-syne font-extrabold text-4xl text-[#E8E8F0] mb-4">Lost in the void</h1>
        <p className="font-dm text-[#6A6A80] mb-8">This artifact doesn&apos;t exist in our dimension.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-[#7B2FBE] text-white font-grotesk text-sm uppercase tracking-[0.15em] px-6 py-3 rounded-full">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs = [
    { id: "description", label: "Description", icon: FileText },
    { id: "material", label: "Material", icon: Layers },
    { id: "size-guide", label: "Size Guide", icon: Ruler },
    { id: "shipping", label: "Shipping", icon: Truck },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-8 font-grotesk text-xs uppercase tracking-[0.15em] text-[#6A6A80]">
          <Link href="/shop" className="hover:text-[#B0B0C0] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#B0B0C0]">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Product Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-[3/4] bg-[#0E0E15] rounded-2xl border border-[#2A2A3A] overflow-hidden flex items-center justify-center">
              <div className="relative">
                <svg width="240" height="280" viewBox="0 0 160 180" fill="none" className="opacity-50">
                  <path d="M40 30 L10 50 L25 65 L35 55 L35 165 L125 165 L125 55 L135 65 L150 50 L120 30 L100 40 L60 40 Z"
                    stroke={showFront ? "#7B2FBE" : "#00D4FF"} strokeWidth="1.5" fill={showFront ? "rgba(123,47,190,0.05)" : "rgba(0,212,255,0.03)"} />
                  {showFront ? (
                    <>
                      <circle cx="80" cy="100" r="25" stroke="#7B2FBE" strokeWidth="1" fill="none" opacity="0.6" />
                      <circle cx="80" cy="100" r="15" stroke="#00D4FF" strokeWidth="0.5" fill="none" opacity="0.4" />
                    </>
                  ) : (
                    <>
                      <text x="80" y="90" textAnchor="middle" fill="#00D4FF" fontSize="7" fontFamily="Space Grotesk" opacity="0.6">VYOM VOID</text>
                      <text x="80" y="105" textAnchor="middle" fill="#6A6A80" fontSize="5" fontFamily="Space Grotesk" opacity="0.4">{product.drop}</text>
                      <line x1="50" y1="115" x2="110" y2="115" stroke="#00D4FF" strokeWidth="0.5" opacity="0.2" />
                    </>
                  )}
                </svg>
              </div>
              {/* Front/Back toggle */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button onClick={() => setShowFront(true)}
                  className={`font-grotesk text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-all ${showFront ? "border-[#7B2FBE] text-[#7B2FBE] bg-[rgba(123,47,190,0.1)]" : "border-[#2A2A3A] text-[#6A6A80]"}`}>
                  Front
                </button>
                <button onClick={() => setShowFront(false)}
                  className={`font-grotesk text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-all ${!showFront ? "border-[#00D4FF] text-[#00D4FF] bg-[rgba(0,212,255,0.1)]" : "border-[#2A2A3A] text-[#6A6A80]"}`}>
                  Back
                </button>
              </div>
              <div className="absolute top-4 left-4">
                <DropBadge dropNumber={product.dropNumber} size="md" />
              </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <DropBadge dropNumber={product.dropNumber} size="md" />
            <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-[#E8E8F0] mt-4 mb-2">{product.name}</h1>
            <p className="font-grotesk text-xs uppercase tracking-[0.2em] text-[#6A6A80] mb-6">{product.drop}</p>
            <p className="font-syne font-bold text-3xl text-[#E8E8F0] mb-6">{product.priceFormatted}</p>

            {/* Size selector */}
            <div className="mb-6">
              <p className="font-grotesk text-xs uppercase tracking-[0.2em] text-[#6A6A80] mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border font-grotesk text-sm font-medium transition-all duration-300 ${selectedSize === size ? "border-[#7B2FBE] text-[#7B2FBE] bg-[rgba(123,47,190,0.1)]" : "border-[#2A2A3A] text-[#B0B0C0] hover:border-[#7B2FBE]"}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart} disabled={!selectedSize}
              className={`w-full flex items-center justify-center gap-3 font-grotesk text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 mb-4 ${selectedSize ? "bg-[#7B2FBE] hover:bg-[#9B4FDE] text-white animate-glow-pulse cursor-pointer" : "bg-[#1A1A2A] text-[#6A6A80] cursor-not-allowed"}`}>
              <ShoppingBag size={16} />
              {added ? "Added to void ✓" : selectedSize ? "Claim this piece" : "Select a size"}
            </button>

            {/* Scarcity badge */}
            <div className="flex items-center gap-2 p-4 bg-[#14141F] border border-[#2A2A3A] rounded-xl mb-8">
              <AlertTriangle size={14} className="text-[#FF6B6B]" />
              <p className="font-grotesk text-xs uppercase tracking-[0.15em] text-[#B0B0C0]">
                Only <span className="text-[#FF6B6B] font-bold">{product.stock} pieces</span> remain in this drop
              </p>
            </div>

            {/* Tabs */}
            <div className="border-t border-[#1A1A2A] pt-6">
              <div className="flex gap-1 mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 font-grotesk text-[11px] uppercase tracking-[0.15em] px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-[#7B2FBE] text-white" : "text-[#6A6A80] hover:text-[#B0B0C0]"}`}>
                    <tab.icon size={12} /> {tab.label}
                  </button>
                ))}
              </div>
              <div className="font-dm text-sm text-[#B0B0C0] leading-relaxed min-h-[120px]">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "material" && <div><p className="mb-2">{product.material}</p><p>Weight: {product.weight}</p><p className="mt-2 text-[#6A6A80]">{product.care}</p></div>}
                {activeTab === "size-guide" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="border-b border-[#2A2A3A]">
                        {["Size", "Chest (in)", "Length (in)", "Sleeve (in)"].map(h => <th key={h} className="py-2 px-3 text-left font-grotesk uppercase tracking-[0.1em] text-[#6A6A80]">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[["XS","34","26","7"],["S","36","27","7.5"],["M","38","28","8"],["L","40","29","8.5"],["XL","42","30","9"],["XXL","44","31","9.5"]].map(r => (
                          <tr key={r[0]} className="border-b border-[#1A1A2A]">{r.map((c,i) => <td key={i} className="py-2 px-3">{c}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {activeTab === "shipping" && <div><p className="mb-2">Free shipping on orders above ₹1,499.</p><p className="mb-2">Standard delivery: 5-7 business days across India.</p><p className="text-[#6A6A80]">Each order is packed in void-black packaging with a cosmic certificate of authenticity.</p></div>}
              </div>
            </div>
          </motion.div>
        </div>

        {/* UGC Section */}
        <ScrollAnimate className="mt-24 border-t border-[#1A1A2A] pt-16">
          <div className="text-center mb-12">
            <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-2">Community</p>
            <h2 className="font-syne font-extrabold text-3xl text-[#E8E8F0]">Worn in the void</h2>
            <p className="font-dm text-[#6A6A80] text-sm mt-2">Tag @vyomvoid to be featured</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="aspect-square bg-[#14141F] border border-[#2A2A3A] rounded-xl flex items-center justify-center">
                <p className="font-grotesk text-[10px] uppercase tracking-[0.2em] text-[#6A6A80]">@user_{i}</p>
              </div>
            ))}
          </div>
        </ScrollAnimate>
      </div>
    </div>
  );
}
