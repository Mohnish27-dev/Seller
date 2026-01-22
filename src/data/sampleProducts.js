// Sample products to add to your database
// You can import this in your admin panel or run as a script

export const sampleProducts = [
  {
    name: "Cotton Floral Print Kurti",
    slug: "cotton-floral-print-kurti",
    description: "Beautiful cotton kurti with floral prints. Perfect for daily wear and casual outings. Soft and comfortable fabric that keeps you cool throughout the day.",
    price: 799,
    discountPrice: 599,
    category: "kurti",
    fabric: "Pure Cotton",
    featured: true,
    isActive: true,
    images: [
      { url: "/products/p3.png", publicId: "" }
    ],
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: [
      { name: "Pink", hexCode: "#ec4899" },
      { name: "Blue", hexCode: "#3b82f6" }
    ]
  },
  {
    name: "Designer Anarkali Suit",
    slug: "designer-anarkali-suit",
    description: "Elegant designer anarkali suit perfect for festive occasions and parties. Features beautiful embroidery work and premium fabric quality.",
    price: 2499,
    discountPrice: 1999,
    category: "suit",
    fabric: "Georgette",
    featured: true,
    isActive: true,
    images: [
      { url: "/products/p2.png", publicId: "" }
    ],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 4 }
    ],
    colors: [
      { name: "Maroon", hexCode: "#991b1b" },
      { name: "Navy Blue", hexCode: "#1e3a8a" }
    ]
  },
  {
    name: "Printed Cotton Salwar Set",
    slug: "printed-cotton-salwar-set",
    description: "Comfortable cotton salwar set with beautiful prints. Ideal for daily wear. Comes with matching dupatta.",
    price: 1299,
    discountPrice: 999,
    category: "salwar",
    fabric: "Cotton",
    featured: false,
    isActive: true,
    images: [
      { url: "/products/p1.png", publicId: "" }
    ],
    sizes: [
      { size: "M", stock: 20 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 }
    ],
    colors: [
      { name: "Green", hexCode: "#22c55e" }
    ]
  },
  {
    name: "Party Wear Gown",
    slug: "party-wear-gown",
    description: "Stunning party wear gown with sequin work. Perfect for weddings and special occasions.",
    price: 3999,
    discountPrice: 2999,
    category: "gown",
    fabric: "Net with Satin",
    featured: true,
    isActive: true,
    images: [
      { url: "/products/p5.png", publicId: "" }
    ],
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 5 },
      { size: "L", stock: 4 }
    ],
    colors: [
      { name: "Wine", hexCode: "#722f37" },
      { name: "Black", hexCode: "#000000" }
    ]
  },
  {
    name: "Casual Maxi Dress",
    slug: "casual-maxi-dress",
    description: "Flowy and comfortable maxi dress for casual outings. Light weight and easy to maintain.",
    price: 1499,
    discountPrice: 1199,
    category: "maxi",
    fabric: "Rayon",
    featured: false,
    isActive: true,
    images: [
      { url: "/products/p4.png", publicId: "" }
    ],
    sizes: [
      { size: "Free Size", stock: 25 }
    ],
    colors: [
      { name: "Yellow", hexCode: "#eab308" },
      { name: "Orange", hexCode: "#f97316" }
    ]
  },
  {
    name: "Premium Cotton Leggings",
    slug: "premium-cotton-leggings",
    description: "High quality stretchable cotton leggings. Comfortable for all day wear.",
    price: 399,
    discountPrice: 299,
    category: "legging",
    fabric: "Cotton Lycra",
    featured: false,
    isActive: true,
    images: [
      { url: "/products/p2.png", publicId: "" }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 20 }
    ],
    colors: [
      { name: "Black", hexCode: "#000000" },
      { name: "Navy", hexCode: "#1e3a8a" },
      { name: "Maroon", hexCode: "#991b1b" }
    ]
  }
];
