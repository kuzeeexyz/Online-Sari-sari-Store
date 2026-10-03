/* ============================================================
   SariSari PH — Product Data & SVG Icons
   ------------------------------------------------------------
   All products live in a single array of objects. Product cards
   are rendered from this data by app.js — nothing is hardcoded
   in the HTML.
   ============================================================ */

window.Store = window.Store || {};

/* ------------------------------------------------------------
   Category icon set
   Small flat SVG glyphs (white) drawn on top of each product's
   gradient tile, so the site needs zero external image files.
   ------------------------------------------------------------ */
Store.ICONS = {

  rice: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 32h40v8c0 8-9 14-20 14S12 48 12 40z" fill="#fff"/>
      <ellipse cx="32" cy="32" rx="20" ry="5" fill="#fff"/>
      <path d="M22 22l4-6M32 23l4-8M42 22l4-6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  coffee: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M16 22h28v18c0 8-6 14-14 14s-14-6-14-14z" fill="#fff"/>
      <path d="M44 24h4c5 0 8 3 8 8s-3 8-8 8h-4" stroke="#fff" stroke-width="4"/>
      <path d="M15 13c0-4 4-4 4-8M25 13c0-4 4-4 4-8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  soda: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M28 6h8v6l4 8v30a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V20l4-8z" fill="#fff"/>
      <rect x="26" y="4" width="12" height="5" rx="1.5" fill="#fff"/>
      <path d="M26 40c0 2 4 2 4 0M34 40c0 2 4 2 4 0" stroke="#ff9f43" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

  chips: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M22 16h20l6 12v20a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V28z" fill="#fff"/>
      <path d="M22 16c-3 3-5 7-5 11M42 16c3 3 5 7 5 11" stroke="#fff" stroke-width="3"/>
      <rect x="25" y="34" width="14" height="3.5" rx="1.75" stroke="#ff9f43" stroke-width="2" fill="none"/>
    </svg>`,

  crackers: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="14" y="16" width="28" height="14" rx="4" fill="#fff"/>
      <rect x="18" y="34" width="28" height="14" rx="4" fill="#fff"/>
      <path d="M18 30h4M30 30h4M42 30h4" stroke="#ff9f43" stroke-width="2" stroke-linecap="round"/>
      <circle cx="24" cy="22" r="1.6" fill="#ff9f43"/><circle cx="34" cy="26" r="1.6" fill="#ff9f43"/>
    </svg>`,

  noodles: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 24h24l3 6v18a6 6 0 0 1-6 6H23a6 6 0 0 1-6-6V30z" fill="#fff"/>
      <path d="M21 26l-1 12M43 26l1 12" stroke="#ff9f43" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M27 12c0-3 3-3 3-6M37 12c0-3 3-3 3-6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  can: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="16" y="14" width="32" height="36" rx="7" fill="#fff"/>
      <rect x="16" y="22" width="32" height="8" rx="2" fill="#ff9f43" opacity=".9"/>
      <path d="M25 46h14" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

  shampoo: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M28 26h8v20a6 6 0 0 1-6 6 6 6 0 0 1-6-6z" fill="#fff"/>
      <path d="M29 14h6v12h-6z" fill="#fff"/>
      <path d="M30 20h4" stroke="#ff9f43" stroke-width="2" stroke-linecap="round"/>
      <circle cx="18" cy="18" r="4" fill="#fff" opacity=".75"/>
      <circle cx="47" cy="22" r="3" fill="#fff" opacity=".75"/>
      <circle cx="49" cy="12" r="2" fill="#fff" opacity=".75"/>
    </svg>`,

  soap: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="20" y="26" width="24" height="22" rx="6" fill="#fff"/>
      <path d="M26 26v-5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v5" stroke="#fff" stroke-width="3.5"/>
      <circle cx="24" cy="16" r="3" fill="#fff" opacity=".75"/>
      <circle cx="40" cy="12" r="2" fill="#fff" opacity=".75"/>
      <circle cx="46" cy="20" r="2.5" fill="#fff" opacity=".75"/>
    </svg>`,

  toothpaste: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M30 10h4v8l4 4v24a6 6 0 0 1-6 6 6 6 0 0 1-6-6V22z" fill="#fff"/>
      <path d="M24 34h16" stroke="#ff9f43" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

  bread: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 28c0-9 4-16 18-16s18 7 18 16c0 6-4 10-8 10H22c-4 0-8-4-8-10z" fill="#fff"/>
      <path d="M24 34c0-3 2-5 4-5s4 2 4 5" stroke="#ff9f43" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    </svg>`,

  eggs: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M40 6c7 9 13 16 13 24a13 13 0 0 1-26 0c0-8 6-15 13-24z" fill="#fff" opacity=".55"/>
      <path d="M26 10c8 9 14 16 14 24a14 14 0 0 1-28 0c0-8 6-15 14-24z" fill="#fff"/>
      <circle cx="20" cy="34" r="2.5" fill="#ff9f43"/>
    </svg>`,

  milk: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M26 12l4-4h8l4 4v36a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6z" fill="#fff"/>
      <path d="M28 14l4-4h6l4 4" stroke="#ff9f43" stroke-width="2"/>
      <path d="M24 30h16" stroke="#ff9f43" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  candy: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="9" ry="13" fill="#fff"/>
      <path d="M23 26l-8-8M41 26l8-8M23 38l-8 8M41 38l8 8" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    </svg>`,

  sugar: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 20h24l4 8 2 22a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6l2-22z" fill="#fff"/>
      <path d="M20 34h24" stroke="#ff9f43" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

  salt: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M22 16h20l-3 32a6 6 0 0 1-6 5h-2a6 6 0 0 1-6-5z" fill="#fff"/>
      <circle cx="26" cy="16" r="2" fill="#fff"/><circle cx="32" cy="16" r="2" fill="#fff"/><circle cx="38" cy="16" r="2" fill="#fff"/>
      <path d="M28 44h8" stroke="#ff9f43" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

  bottle: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M30 8h4v8l4 6v26a6 6 0 0 1-6 6 6 6 0 0 1-6-6V22l4-6z" fill="#fff"/>
      <rect x="26" y="34" width="12" height="16" rx="2" stroke="#ff9f43" stroke-width="2" fill="none"/>
    </svg>`,

  oil: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M28 10h8v6h-8z" fill="#fff"/>
      <path d="M26 16h12l-2 32a6 6 0 0 1-6 6 6 6 0 0 1-6-6z" fill="#fff"/>
      <path d="M26 16h12v8H26z" stroke="#ff9f43" stroke-width="2" fill="none"/>
      <path d="M34 46c-3 0-5-2-5-5 0-3 5-7 5-7s5 4 5 7c0 3-2 5-5 5z" fill="#ff9f43"/>
    </svg>`,

  seasoning: `
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="20" y="20" width="24" height="30" rx="5" fill="#fff"/>
      <rect x="16" y="12" width="32" height="12" rx="3" fill="#fff"/>
      <path d="M26 36h12" stroke="#ff9f43" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
};

/* ------------------------------------------------------------
   Product catalog
   Fields: id, name, category, price (PHP), unit, description,
           stock, icon (Store.ICONS key), bg (tile gradient),
           featured (show on home page)
   ------------------------------------------------------------ */
Store.products = [
  {
    id: 1,
    name: "Sinandomeng Rice (5 kg)",
    category: "Grains & Rice",
    price: 245,
    unit: "per 5 kg bag",
    description: "Premium aromatic rice — the heart of every Filipino ulam.",
    stock: 20,
    icon: "rice",
    bg: "linear-gradient(135deg, #ffd89b, #e98a3d)",
    featured: true
  },
  {
    id: 2,
    name: "Nescafé 3-in-1 Coffee",
    category: "Beverages",
    price: 12,
    unit: "per sachet",
    description: "Quick, creamy coffee for your everyday pick-me-up.",
    stock: 80,
    icon: "coffee",
    bg: "linear-gradient(135deg, #9c6b45, #5c3a20)",
    featured: true
  },
  {
    id: 3,
    name: "Coca-Cola Sakto (330 ml)",
    category: "Beverages",
    price: 30,
    unit: "per bottle",
    description: "Ice-cold, tansan-worthy cola — best served pinalamig.",
    stock: 48,
    icon: "soda",
    bg: "linear-gradient(135deg, #ff6b6b, #c01919)",
    featured: true
  },
  {
    id: 4,
    name: "Royal Tru-Orange (330 ml)",
    category: "Beverages",
    price: 30,
    unit: "per bottle",
    description: "Filipino favorite orange soda — sweet, fizzy, nostalgia in a bottle.",
    stock: 40,
    icon: "soda",
    bg: "linear-gradient(135deg, #ffb347, #f97316)"
  },
  {
    id: 5,
    name: "Skyflakes Crackers",
    category: "Snacks & Biscuits",
    price: 8.5,
    unit: "per pack",
    description: "Salty, crispy crackers perfect with coffee or sardines.",
    stock: 60,
    icon: "crackers",
    bg: "linear-gradient(135deg, #f6c977, #d9a13b)"
  },
  {
    id: 6,
    name: "Piattos Cheese",
    category: "Snacks & Biscuits",
    price: 25,
    unit: "per pack",
    description: "Crispy potato chips dusted with cheesy goodness.",
    stock: 55,
    icon: "chips",
    bg: "linear-gradient(135deg, #ffd66b, #f9a825)",
    featured: true
  },
  {
    id: 7,
    name: "Nova Country Cheddar",
    category: "Snacks & Biscuits",
    price: 24,
    unit: "per pack",
    description: "Pillowy corn snacks loaded with rich cheddar flavor.",
    stock: 50,
    icon: "chips",
    bg: "linear-gradient(135deg, #ffb04d, #f57c00)"
  },
  {
    id: 8,
    name: "Choc-nut Peanut Candy",
    category: "Snacks & Biscuits",
    price: 2,
    unit: "per pack",
    description: "The classic peanut butter candy every Filipino grew up with.",
    stock: 150,
    icon: "candy",
    bg: "linear-gradient(135deg, #b98050, #7a4a21)"
  },
  {
    id: 9,
    name: "Lucky Me! Pancit Canton",
    category: "Instant Noodles",
    price: 15,
    unit: "per pack",
    description: "The eternal merienda favorite — squeeze the calamansi!",
    stock: 70,
    icon: "noodles",
    bg: "linear-gradient(135deg, #ff9f68, #ff5e3a)",
    featured: true
  },
  {
    id: 10,
    name: "Lucky Me! Instant Mami",
    category: "Instant Noodles",
    price: 12,
    unit: "per pack",
    description: "Soul-warming beef mami ready in just minutes.",
    stock: 70,
    icon: "noodles",
    bg: "linear-gradient(135deg, #ffae8a, #f7642e)"
  },
  {
    id: 11,
    name: "Payless Instant Noodles",
    category: "Instant Noodles",
    price: 10,
    unit: "per pack",
    description: "Budget-friendly noodles that always hit the spot.",
    stock: 90,
    icon: "noodles",
    bg: "linear-gradient(135deg, #ffb37e, #e65a1e)"
  },
  {
    id: 12,
    name: "Ligo Sardines (Spanish Style)",
    category: "Canned Goods",
    price: 28,
    unit: "per can",
    description: "Flavor-packed sardines in rich tomato sauce.",
    stock: 45,
    icon: "can",
    bg: "linear-gradient(135deg, #7ec8f5, #2d7bb8)",
    featured: true
  },
  {
    id: 13,
    name: "Century Tuna Flakes in Oil",
    category: "Canned Goods",
    price: 35,
    unit: "per can",
    description: "Premium tuna flakes — ulam na, tawag na.",
    stock: 38,
    icon: "can",
    bg: "linear-gradient(135deg, #93d9ff, #4a9bd6)"
  },
  {
    id: 14,
    name: "CDO Corned Beef",
    category: "Canned Goods",
    price: 65,
    unit: "per can",
    description: "Hearty corned beef for a Sunday breakfast spread.",
    stock: 0,
    icon: "can",
    bg: "linear-gradient(135deg, #f5a86b, #d9713a)"
  },
  {
    id: 15,
    name: "Pan de Sal (6 pieces)",
    category: "Dairy & Bakery",
    price: 30,
    unit: "per pack",
    description: "Fresh, warm pan de sal straight from the local bakery.",
    stock: 24,
    icon: "bread",
    bg: "linear-gradient(135deg, #e8c07a, #c8903f)"
  },
  {
    id: 16,
    name: "Fresh Eggs",
    category: "Dairy & Bakery",
    price: 9,
    unit: "per piece",
    description: "Farm-fresh eggs, checked for freshness every single day.",
    stock: 60,
    icon: "eggs",
    bg: "linear-gradient(135deg, #f6e3b4, #dbb45c)",
    featured: true
  },
  {
    id: 17,
    name: "Bear Brand Powdered Milk",
    category: "Dairy & Bakery",
    price: 22,
    unit: "per sachet",
    description: "A glass a day to keep the whole family strong.",
    stock: 65,
    icon: "milk",
    bg: "linear-gradient(135deg, #a9d8f5, #5aa7d1)",
    featured: true
  },
  {
    id: 18,
    name: "Palmolive Shampoo",
    category: "Personal Care",
    price: 15,
    unit: "per sachet",
    description: "Silky, smooth hair for every wash day.",
    stock: 75,
    icon: "shampoo",
    bg: "linear-gradient(135deg, #7ed6c5, #2fae92)"
  },
  {
    id: 19,
    name: "Safeguard Soap",
    category: "Personal Care",
    price: 28,
    unit: "per bar",
    description: "Protection for the whole family — trusted by nanay.",
    stock: 60,
    icon: "soap",
    bg: "linear-gradient(135deg, #f6b9c0, #e05d74)"
  },
  {
    id: 20,
    name: "Colgate Toothpaste",
    category: "Personal Care",
    price: 12,
    unit: "per sachet",
    description: "Bright smiles and fresh breath, swak sa budget.",
    stock: 80,
    icon: "toothpaste",
    bg: "linear-gradient(135deg, #9be8ff, #3fb6e8)"
  },
  {
    id: 21,
    name: "Purefoods White Sugar (1 kg)",
    category: "Cooking & Condiments",
    price: 92,
    unit: "per kg",
    description: "Sweeten every kape, dessert, and ginataan.",
    stock: 35,
    icon: "sugar",
    bg: "linear-gradient(135deg, #fff3d6, #e8c884)"
  },
  {
    id: 22,
    name: "Rock Salt (1 kg)",
    category: "Cooking & Condiments",
    price: 18,
    unit: "per kg",
    description: "The essential asin for every kusina.",
    stock: 40,
    icon: "salt",
    bg: "linear-gradient(135deg, #e2e8f0, #a6b4c6)"
  },
  {
    id: 23,
    name: "Datu Puti Vinegar",
    category: "Cooking & Condiments",
    price: 25,
    unit: "per bottle",
    description: "Tangy suka for adobo, sinigang, and kinilaw.",
    stock: 44,
    icon: "bottle",
    bg: "linear-gradient(135deg, #d7c8f2, #9b7fd4)"
  },
  {
    id: 24,
    name: "Arawana Cooking Oil (1 L)",
    category: "Cooking & Condiments",
    price: 115,
    unit: "per bottle",
    description: "Golden frying oil for crispy, sarap na luto.",
    stock: 32,
    icon: "oil",
    bg: "linear-gradient(135deg, #ffe08a, #f5b301)"
  },
  {
    id: 25,
    name: "Magic Sarap Seasoning",
    category: "Cooking & Condiments",
    price: 12,
    unit: "per sachet",
    description: "The all-around seasoning for everyday ulam.",
    stock: 88,
    icon: "seasoning",
    bg: "linear-gradient(135deg, #ffc46b, #e8861a)"
  },
  {
    id: 26,
    name: "Silver Swan Soy Sauce",
    category: "Cooking & Condiments",
    price: 22,
    unit: "per bottle",
    description: "The dark, savory toyo for every lutong Pinoy.",
    stock: 46,
    icon: "bottle",
    bg: "linear-gradient(135deg, #6d4c41, #3e2a23)"
  }
];

/* ------------------------------------------------------------
   Derived data + helpers
   ------------------------------------------------------------ */

/* Unique categories in catalog order */
Store.categories = (function () {
  const seen = [];
  Store.products.forEach(function (product) {
    if (!seen.includes(product.category)) {
      seen.push(product.category);
    }
  });
  return seen;
})();

/* Lookup helpers used across cart.js and checkout.js */
Store.getProduct = function (id) {
  return Store.products.find(function (product) {
    return product.id === Number(id);
  });
};

/* A category's representative tile: icon + gradient of its first product */
Store.getCategoryMeta = function (category) {
  const product = Store.products.find(function (p) {
    return p.category === category;
  });
  return {
    icon: Store.ICONS[product.icon],
    bg: product.bg
  };
};

/* Featured products for the home page */
Store.getFeatured = function (limit) {
  return Store.products.filter(function (product) {
    return product.featured;
  }).slice(0, limit);
};
