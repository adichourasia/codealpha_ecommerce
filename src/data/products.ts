export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  image: string;
  category: string;
  badge?: "new" | "sale";
  stock: number;
  rating: number;
  reviews: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "💻", count: 6 },
  { id: "fashion", name: "Fashion", icon: "👕", count: 4 },
  { id: "accessories", name: "Accessories", icon: "⌚", count: 4 },
  { id: "home", name: "Home & Living", icon: "🏠", count: 3 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    price: 19999,
    originalPrice: 27999,
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions. Features Bluetooth 5.2 for seamless connectivity and Hi-Res Audio support for audiophile-grade sound quality.",
    shortDescription: "Premium ANC headphones with 30hr battery",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    category: "electronics",
    badge: "sale",
    stock: 15,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: "2",
    name: "Smart Fitness Watch Pro",
    price: 16999,
    description: "Track your health and fitness with this advanced smartwatch featuring heart rate monitoring, GPS tracking, sleep analysis, and 100+ workout modes. Water-resistant to 50m with a stunning AMOLED display.",
    shortDescription: "Advanced health & fitness tracking",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    category: "accessories",
    badge: "new",
    stock: 28,
    rating: 4.6,
    reviews: 189,
  },
  {
    id: "3",
    name: "Minimalist Canvas Backpack",
    price: 5999,
    description: "A sleek and durable canvas backpack perfect for everyday carry. Features a padded laptop compartment (fits up to 15\"), multiple organization pockets, and water-resistant fabric. Ideal for work, travel, or school.",
    shortDescription: "Durable everyday carry backpack",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    category: "fashion",
    stock: 42,
    rating: 4.5,
    reviews: 156,
  },
  {
    id: "4",
    name: "Ultra-Slim Laptop Stand",
    price: 3999,
    description: "Ergonomic aluminum laptop stand that elevates your screen to eye level. Foldable and portable design, compatible with all laptops 10-17\". Improves posture and airflow for better performance.",
    shortDescription: "Ergonomic aluminum laptop riser",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
    category: "electronics",
    badge: "new",
    stock: 35,
    rating: 4.7,
    reviews: 98,
  },
  {
    id: "5",
    name: "Premium Leather Wallet",
    price: 4999,
    originalPrice: 7499,
    description: "Handcrafted genuine leather bifold wallet with RFID blocking technology. Features 8 card slots, 2 bill compartments, and a coin pocket. Slim profile that fits comfortably in any pocket.",
    shortDescription: "Handcrafted leather with RFID blocking",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    category: "accessories",
    badge: "sale",
    stock: 50,
    rating: 4.4,
    reviews: 312,
  },
  {
    id: "6",
    name: "Ceramic Pour-Over Coffee Set",
    price: 3499,
    description: "Artisan ceramic pour-over coffee dripper set including dripper, carafe, and 100 paper filters. Makes up to 4 cups of perfectly brewed coffee. Elegant matte finish in cloud white.",
    shortDescription: "Artisan ceramic coffee brewing set",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    category: "home",
    stock: 22,
    rating: 4.9,
    reviews: 87,
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    price: 2499,
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. 15W fast charging for supported devices, LED indicator, and anti-slip surface. Ultra-thin design with premium aluminum build.",
    shortDescription: "15W fast Qi wireless charger",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
    category: "electronics",
    stock: 60,
    rating: 4.3,
    reviews: 445,
  },
  {
    id: "8",
    name: "Cotton Oversized Hoodie",
    price: 4999,
    description: "Super soft 100% organic cotton oversized hoodie. Features a relaxed fit, kangaroo pocket, and brushed fleece interior. Perfect for lounging or casual outings. Available in multiple colors.",
    shortDescription: "Organic cotton relaxed-fit hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    category: "fashion",
    badge: "new",
    stock: 38,
    rating: 4.6,
    reviews: 201,
  },
  {
    id: "9",
    name: "Portable Bluetooth Speaker",
    price: 6999,
    originalPrice: 9999,
    description: "Compact waterproof Bluetooth speaker with 360° sound, 20-hour battery life, and built-in microphone. IPX7 waterproof rating makes it perfect for outdoor adventures, pool parties, and travel.",
    shortDescription: "Waterproof 360° sound speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    category: "electronics",
    badge: "sale",
    stock: 19,
    rating: 4.5,
    reviews: 178,
  },
  {
    id: "10",
    name: "Minimalist Desk Lamp",
    price: 4499,
    description: "Modern LED desk lamp with adjustable color temperature (3000K-6500K) and brightness levels. Touch controls, USB charging port, and flexible gooseneck design. Energy-efficient and eye-friendly.",
    shortDescription: "Adjustable LED lamp with USB charging",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&q=80",
    category: "home",
    stock: 30,
    rating: 4.7,
    reviews: 134,
  },
  {
    id: "11",
    name: "Aviator Sunglasses",
    price: 10999,
    description: "Classic aviator sunglasses with polarized UV400 lenses and lightweight titanium frame. Scratch-resistant coating and anti-reflective treatment. Comes with premium hardcase and cleaning cloth.",
    shortDescription: "Polarized titanium aviator shades",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    category: "accessories",
    stock: 25,
    rating: 4.4,
    reviews: 267,
  },
  {
    id: "12",
    name: "Scented Soy Candle Set",
    price: 2999,
    description: "Set of 3 hand-poured soy wax candles in calming scents: lavender, vanilla, and eucalyptus. 40-hour burn time each. Eco-friendly cotton wicks in elegant matte black glass jars.",
    shortDescription: "3-piece aromatherapy candle set",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&q=80",
    category: "home",
    badge: "new",
    stock: 45,
    rating: 4.8,
    reviews: 156,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}
