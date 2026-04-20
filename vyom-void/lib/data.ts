/* ===== VYOM VOID — Product & Drop Data ===== */

export interface Product {
  id: string;
  slug: string;
  name: string;
  drop: string;
  dropNumber: string;
  price: number;
  priceFormatted: string;
  description: string;
  stock: number;
  sizes: string[];
  material: string;
  weight: string;
  care: string;
  images: {
    front: string;
    back: string;
  };
}

export interface Drop {
  id: string;
  number: string;
  sanskritName: string;
  englishMeaning: string;
  concept: string;
  status: "active" | "archived" | "upcoming";
  releaseDate: string;
  productCount: number;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "void-circle-tee",
    name: "Void Circle Tee",
    drop: "DROP 001 — SHUNYA",
    dropNumber: "001",
    price: 1299,
    priceFormatted: "₹1,299",
    description:
      "Pure black. A void circle on the back. The beginning of nothingness. Wear what cannot be described.",
    stock: 8,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organic Ring-spun Cotton, 220 GSM, Reactive-dyed Void Black",
    weight: "220g",
    care: "Cold wash only. Do not bleach. Tumble dry low. The void does not forgive heat.",
    images: {
      front: "/products/void-circle-front.jpg",
      back: "/products/void-circle-back.jpg",
    },
  },
  {
    id: "2",
    slug: "nakshatra-map-tee",
    name: "Nakshatra Map Tee",
    drop: "DROP 002 — NAKSHATRA",
    dropNumber: "002",
    price: 1499,
    priceFormatted: "₹1,499",
    description:
      "Your birth star, rendered in dark cartography. The sky does not forget where you began.",
    stock: 14,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organic Ring-spun Cotton, 220 GSM, Deep Space Wash",
    weight: "225g",
    care: "Cold wash only. Do not bleach. The stars remember what you do to them.",
    images: {
      front: "/products/nakshatra-front.jpg",
      back: "/products/nakshatra-back.jpg",
    },
  },
  {
    id: "3",
    slug: "kaal-glitch-tee",
    name: "Kaal Glitch Tee",
    drop: "DROP 003 — KAAL",
    dropNumber: "003",
    price: 1199,
    priceFormatted: "₹1,199",
    description:
      "Time is a glitch. This tee is proof. Distorted reality, printed in void black.",
    stock: 5,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organic Ring-spun Cotton, 200 GSM, Glitch-distressed Print",
    weight: "210g",
    care: "Cold wash only. Handle with temporal care.",
    images: {
      front: "/products/kaal-front.jpg",
      back: "/products/kaal-back.jpg",
    },
  },
  {
    id: "4",
    slug: "orbital-monogram-tee",
    name: "Orbital Monogram Tee",
    drop: "DROP 001 — SHUNYA",
    dropNumber: "001",
    price: 899,
    priceFormatted: "₹899",
    description:
      "Clean. Quiet. The VV orbital mark, embroidered on chest. No noise. Just the void.",
    stock: 21,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organic Ring-spun Cotton, 180 GSM, Embroidered Detail",
    weight: "195g",
    care: "Cold wash only. Do not iron on embroidery.",
    images: {
      front: "/products/orbital-front.jpg",
      back: "/products/orbital-back.jpg",
    },
  },
];

export const drops: Drop[] = [
  {
    id: "drop-001",
    number: "001",
    sanskritName: "SHUNYA",
    englishMeaning: "Nothingness / The Void / Zero",
    concept:
      "The origin drop. Inspired by the concept of शून्य (Shunya) — the mathematical zero, the philosophical void, the beginning of everything from nothing. Minimal graphics, void circles, and pure black expressions.",
    status: "active",
    releaseDate: "2026-03-15",
    productCount: 2,
  },
  {
    id: "drop-002",
    number: "002",
    sanskritName: "NAKSHATRA",
    englishMeaning: "Stars / Celestial Bodies / Birth Star",
    concept:
      "A cartographic exploration of नक्षत्र (Nakshatra) — the 27 lunar mansions of Vedic astrology. Each piece maps the sky as ancient navigators saw it. Dark cartography meets cosmic heritage.",
    status: "active",
    releaseDate: "2026-04-01",
    productCount: 1,
  },
  {
    id: "drop-003",
    number: "003",
    sanskritName: "KAAL",
    englishMeaning: "Time / Death / The Eternal",
    concept:
      "काल (Kaal) is the force that devours everything. This drop explores temporal distortion — glitch aesthetics merged with the ancient concept of time as the ultimate destroyer and creator.",
    status: "active",
    releaseDate: "2026-04-15",
    productCount: 1,
  },
  {
    id: "drop-004",
    number: "004",
    sanskritName: "MAYA",
    englishMeaning: "Illusion / The Veil / Cosmic Play",
    concept:
      "माया (Maya) — the grand illusion that veils reality. This upcoming drop explores the boundary between what is real and what is perceived. Translucent prints, hidden messages, and layered meanings.",
    status: "upcoming",
    releaseDate: "2026-06-01",
    productCount: 0,
  },
  {
    id: "drop-005",
    number: "005",
    sanskritName: "AKASHA",
    englishMeaning: "Ether / Sky / Space",
    concept:
      "आकाश (Akasha) — the fifth element, the space that holds all others. The most ethereal drop yet. Expected to explore fabric as medium, with translucent overlays and void-dyed techniques.",
    status: "archived",
    releaseDate: "2025-12-01",
    productCount: 0,
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/drops", label: "Drops" },
  { href: "/about", label: "About" },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByDrop(dropNumber: string): Product[] {
  return products.filter((p) => p.dropNumber === dropNumber);
}
