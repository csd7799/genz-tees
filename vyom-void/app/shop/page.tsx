"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

export default function ShopPage() {
  const [dropFilter, setDropFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (dropFilter !== "all") {
      result = result.filter((p) => p.dropNumber === dropFilter);
    }
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "limited": result.sort((a, b) => a.stock - b.stock); break;
      default: result.sort((a, b) => parseInt(b.dropNumber) - parseInt(a.dropNumber));
    }
    return result;
  }, [dropFilter, sortBy]);

  const dropOptions = [
    { value: "all", label: "All Drops" },
    { value: "001", label: "DROP 001" },
    { value: "002", label: "DROP 002" },
    { value: "003", label: "DROP 003" },
  ];

  const sortOptions = [
    { value: "latest", label: "Latest Drop" },
    { value: "price-low", label: "Price: Low → High" },
    { value: "price-high", label: "Price: High → Low" },
    { value: "limited", label: "Most Limited" },
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="px-6 pb-12 border-b border-[#1A1A2A]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-[#7B2FBE] mb-3">The Collection</p>
            <h1 className="font-syne font-extrabold text-5xl md:text-6xl text-[#E8E8F0] mb-4">Shop the Void</h1>
            <p className="font-dm text-[#6A6A80] text-base max-w-lg">Each piece is a limited artifact from the cosmos. Once a drop dissolves, it never returns.</p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-6 border-b border-[#1A1A2A] sticky top-[72px] z-50 bg-[#0A0A0F]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden flex items-center gap-2 font-grotesk text-xs uppercase tracking-[0.15em] text-[#B0B0C0] border border-[#2A2A3A] rounded-full px-4 py-2">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <div className={`flex items-center gap-3 flex-wrap ${showFilters ? "flex" : "hidden sm:flex"}`}>
              {dropOptions.map((opt) => (
                <button key={opt.value} onClick={() => setDropFilter(opt.value)}
                  className={`font-grotesk text-[11px] uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-all duration-300 ${dropFilter === opt.value ? "border-[#7B2FBE] text-[#7B2FBE] bg-[rgba(123,47,190,0.1)]" : "border-[#2A2A3A] text-[#6A6A80] hover:border-[#7B2FBE]"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#14141F] border border-[#2A2A3A] rounded-full px-5 py-2 pr-10 font-grotesk text-[11px] uppercase tracking-[0.15em] text-[#B0B0C0] outline-none focus:border-[#7B2FBE] cursor-pointer">
              {sortOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A80] pointer-events-none" />
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-syne font-bold text-2xl text-[#E8E8F0] mb-2">The void is empty here</p>
              <p className="font-dm text-[#6A6A80] text-sm">No products match your filters.</p>
            </div>
          )}
          <p className="mt-8 text-center font-grotesk text-xs uppercase tracking-[0.2em] text-[#6A6A80]">
            Showing {filteredProducts.length} of {products.length} artifacts
          </p>
        </div>
      </section>
    </div>
  );
}
