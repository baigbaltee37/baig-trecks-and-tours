export type WeightOption = '250g' | '500g' | '1kg';

export interface ProductPricing {
  '250g': number;
  '500g': number;
  '1kg': number;
}

export interface DryFruitProduct {
  id: string;
  name: string;
  urduName: string;
  category: 'Nuts & Kernels' | 'Dried Fruits' | 'Specialty & Mixes' | 'Royal Gift Boxes';
  tagline: string;
  description: string;
  healthBenefits: string[];
  origin: string;
  badge?: 'Bestseller' | 'Seasonal Harvest' | 'Royal Reserve' | 'Organic GB';
  imageUrl: string;
  fallbackImageUrl: string;
  pricing: ProductPricing; // Editable sample prices in PKR
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  featured?: boolean;
}

export interface DryFruitReview {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  productName: string;
  comment: string;
  date: string;
}

export interface DryFruitFAQ {
  id: string;
  question: string;
  answer: string;
}

// Configurable WhatsApp Business number (country code without '+')
// Placeholder ready for the user's specific store phone if different from travel division
export const DRY_FRUITS_WHATSAPP_NUMBER = '923155449778';

export const DRY_FRUITS_CATEGORIES = [
  'All',
  'Nuts & Kernels',
  'Dried Fruits',
  'Specialty & Mixes',
  'Royal Gift Boxes',
] as const;

export const INITIAL_DRY_FRUITS: DryFruitProduct[] = [
  {
    id: 'almonds-badam',
    name: 'Giri Almonds',
    urduName: 'بادام گرئی (Badam)',
    category: 'Nuts & Kernels',
    tagline: 'Sweet, crisp, and high-oil kernels harvested from Northern orchards.',
    description:
      'Grown in the high sunlit valleys of Gilgit-Baltistan and Kaghan, these premium sweet almonds are naturally rich in Vitamin E, magnesium, and healthy dietary fats. Perfectly crunchy with a subtle natural sweetness.',
    healthBenefits: ['Sharpens memory & cognitive focus', 'Supports glowing skin & hair', 'Natural sustained energy'],
    origin: 'Gilgit-Baltistan & Swat Valley',
    badge: 'Bestseller',
    imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 850,
      '500g': 1650,
      '1kg': 3100,
    },
    rating: 4.9,
    reviewsCount: 38,
    inStock: true,
    featured: true,
  },
  {
    id: 'cashews-kaju',
    name: 'Jumbo Whole Cashews',
    urduName: 'کاجو ثابت (Kaju)',
    category: 'Nuts & Kernels',
    tagline: 'Large buttery-white whole cashews, delicately roasted for extra crispiness.',
    description:
      'Selected W240 grade jumbo whole cashews with a rich, buttery melt-in-mouth texture. Packed fresh in airtight food-grade bags to preserve their natural crunch and delicate aroma.',
    healthBenefits: ['Rich in heart-healthy unsaturated fats', 'Great source of plant protein', 'High in zinc & iron'],
    origin: 'Selected Premium Import / Northern Packing',
    badge: 'Royal Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1536591375315-0b82f07d2c36?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 1050,
      '500g': 2000,
      '1kg': 3800,
    },
    rating: 4.8,
    reviewsCount: 29,
    inStock: true,
    featured: true,
  },
  {
    id: 'pistachios-pista',
    name: 'Roasted Karakoram Pistachios',
    urduName: 'پستہ نمکین (Pista)',
    category: 'Nuts & Kernels',
    tagline: 'Lightly sea-salted, naturally opened whole roasted pistachios.',
    description:
      'Cracked open under natural sun-drying and gently toasted with Himalayan pink salt. Vibrant emerald green kernels with an irresistible crunch that make an exquisite wholesome snack.',
    healthBenefits: ['Rich in antioxidants & lutein', 'Aids healthy digestion', 'Low calorie, nutrient-dense snacking'],
    origin: 'Northern Border / Karakoram Alpine',
    badge: 'Bestseller',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 1150,
      '500g': 2250,
      '1kg': 4300,
    },
    rating: 5.0,
    reviewsCount: 42,
    inStock: true,
    featured: true,
  },
  {
    id: 'walnuts-akhrot',
    name: 'Kaghzi Walnuts (Soft Shell)',
    urduName: 'کاغذی اخروٹ (Akhrot)',
    category: 'Nuts & Kernels',
    tagline: 'Paper-thin shell Skardu walnuts with pale, sweet, non-bitter kernels.',
    description:
      'Grown in cold high-altitude mountain soil of Skardu and Hunza, these famous Kaghzi (paper-thin shell) walnuts can be easily cracked by hand. High natural oil content with zero bitterness.',
    healthBenefits: ['World’s premier plant source of Omega-3', 'Supports cardiovascular and brain health', 'Boosts immunity'],
    origin: 'Skardu Valley, Gilgit-Baltistan',
    badge: 'Organic GB',
    imageUrl: 'https://images.unsplash.com/photo-1568260411186-01292b3c58b4?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 750,
      '500g': 1450,
      '1kg': 2750,
    },
    rating: 4.9,
    reviewsCount: 51,
    inStock: true,
    featured: true,
  },
  {
    id: 'premium-dates-khajoor',
    name: 'Medjool & Aseel Royal Dates',
    urduName: 'شاہی کھجور (Khajoor)',
    category: 'Dried Fruits',
    tagline: 'Luscious, caramel-sweet, moist dates packed with vital minerals.',
    description:
      'Plump, tender dates handpicked at peak ripeness. Naturally sweet with a soft, rich caramel texture, perfect for pre-workout energy, family gatherings, and gifting.',
    healthBenefits: ['Immediate natural glucose & stamina', 'High in dietary fiber & potassium', 'Improves digestion & vitality'],
    origin: 'Khairpur / Sukkur Palm Groves',
    badge: 'Bestseller',
    imageUrl: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 600,
      '500g': 1150,
      '1kg': 2100,
    },
    rating: 4.8,
    reviewsCount: 34,
    inStock: true,
    featured: false,
  },
  {
    id: 'raisins-kishmish',
    name: 'Sundarkhani Golden Raisins',
    urduName: 'سندرخوانی کشمش (Kishmish)',
    category: 'Dried Fruits',
    tagline: 'Long, seedless golden-amber raisins with honey-sweet nectar.',
    description:
      'Carefully cured in clean shaded rooms to retain their delicate golden hue and soft chewiness. Completely seedless and ideal for desserts, biryani, oatmeal, or standalone snacks.',
    healthBenefits: ['Boosts hemoglobin and red blood cells', 'Natural anti-acidic properties', 'Supports healthy eyesight'],
    origin: 'Balochistan & Northern Terrains',
    badge: 'Seasonal Harvest',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 550,
      '500g': 1050,
      '1kg': 1950,
    },
    rating: 4.7,
    reviewsCount: 22,
    inStock: true,
    featured: false,
  },
  {
    id: 'dried-figs-anjeer',
    name: 'High-Altitude Dried Figs',
    urduName: 'انجیر پہاڑی (Anjeer)',
    category: 'Dried Fruits',
    tagline: 'Large round mountain figs bursting with crunch, sweetness, and fiber.',
    description:
      'Sun-dried naturally without chemical bleaching or syrup soaking. Each fig retains its sweet floral taste and millions of crunchy seeds that provide unmatched digestive benefits.',
    healthBenefits: ['Remarkable natural digestive cleanser', 'Helps regulate blood pressure', 'Rich in bone-building calcium'],
    origin: 'Northern Mountain Foothills',
    badge: 'Royal Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 950,
      '500g': 1800,
      '1kg': 3450,
    },
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    featured: true,
  },
  {
    id: 'mixed-dry-fruits',
    name: 'Royal Karakoram Dry Fruit Mix',
    urduName: 'شاہی مکس ڈرائی فروٹ (Mixed)',
    category: 'Specialty & Mixes',
    tagline: 'Balanced gourmet blend of almonds, cashews, pistachios, walnuts & raisins.',
    description:
      'A harmonious luxury mix of badam, kaju, pista, kaghzi akhrot, and golden sundarkhani raisins in equal proportions. The ultimate celebration snack and gift for health-conscious families.',
    healthBenefits: ['Complete daily vitamin & mineral spectrum', 'Perfect natural power breakfast boost', 'Loved by children and adults alike'],
    origin: 'Baig Special Hand-Blended Selection',
    badge: 'Bestseller',
    imageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 950,
      '500g': 1850,
      '1kg': 3500,
    },
    rating: 5.0,
    reviewsCount: 65,
    inStock: true,
    featured: true,
  },
  {
    id: 'hunza-organic-apricots',
    name: 'Hunza Sun-Dried Apricots',
    urduName: 'ہنزہ خوبانی (Khubani)',
    category: 'Dried Fruits',
    tagline: 'Authentic heirloom apricots sun-dried on flat stone roofs in Hunza Valley.',
    description:
      'Direct from the ancient terraced orchards of Central Hunza. 100% natural, sulfur-free, and sun-dried under pristine Karakoram mountain air. World-renowned for vitality and longevity.',
    healthBenefits: ['High beta-carotene for sharp vision', 'Rich in iron and potassium', 'Known as the secret of Hunza longevity'],
    origin: 'Hunza Valley, Gilgit-Baltistan',
    badge: 'Organic GB',
    imageUrl: 'https://images.unsplash.com/photo-1599818826725-b442b101683d?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 650,
      '500g': 1250,
      '1kg': 2350,
    },
    rating: 4.9,
    reviewsCount: 47,
    inStock: true,
    featured: true,
  },
  {
    id: 'chilgoza-pine-nuts',
    name: 'Pure Himalayan Chilgoza (Pine Nuts)',
    urduName: 'چلغوزہ پہاڑی (Chilgoza)',
    category: 'Specialty & Mixes',
    tagline: 'The King of Dry Fruits — wild harvested from steep mountain pine cliffs.',
    description:
      'Hand-gathered from wild pine forests clinging to the cliffs of Gilgit-Baltistan and Kohistan. Long, sweet, intensely aromatic kernels prized across Pakistan as the ultimate royal winter luxury.',
    healthBenefits: ['Super-concentrated healthy monounsaturated fats', 'Powerful appetite regulation', 'Superior winter warmth and vitality'],
    origin: 'Diamer & Kohistan Wild Pine Forests',
    badge: 'Royal Reserve',
    imageUrl: 'https://images.unsplash.com/photo-1543208543-690272c72688?auto=format&fit=crop&w=800&q=80',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1568260411186-01292b3c58b4?auto=format&fit=crop&w=800&q=80',
    pricing: {
      '250g': 2400,
      '500g': 4700,
      '1kg': 9100,
    },
    rating: 5.0,
    reviewsCount: 19,
    inStock: true,
    featured: false,
  },
];

export const SAMPLE_DRY_FRUIT_REVIEWS: DryFruitReview[] = [
  {
    id: 'rev-1',
    customerName: 'Tariq Mehmood',
    city: 'Islamabad',
    rating: 5,
    productName: 'Kaghzi Walnuts (Akhrot)',
    comment:
      'The walnuts were exceptionally fresh! You can literally crack them with two fingers and there is zero bitterness. Best quality I have received in Islamabad.',
    date: '3 days ago',
  },
  {
    id: 'rev-2',
    customerName: 'Dr. Ayesha Siddiqui',
    city: 'Lahore',
    rating: 5,
    productName: 'Royal Karakoram Mix & Badam',
    comment:
      'Ordered via WhatsApp and received the parcel within 2 days in DHA Lahore. The vacuum packaging kept everything crispy and aromatic. Highly recommended!',
    date: '1 week ago',
  },
  {
    id: 'rev-3',
    customerName: 'Muhammad Salman',
    city: 'Karachi',
    rating: 5,
    productName: 'Hunza Sun-Dried Apricots',
    comment:
      'Authentic Hunza khubani just like the ones we ate during our trip to Karimabad with Baig Treks. Natural sweetness without any chemicals.',
    date: '2 weeks ago',
  },
];

export const DRY_FRUIT_FAQS: DryFruitFAQ[] = [
  {
    id: 'faq-df-1',
    question: 'How do you ensure the freshness and quality of dry fruits?',
    answer:
      'Our dry fruits are sourced directly from trusted growers and orchards in Gilgit-Baltistan and high-altitude regions. Every batch is graded, sorted by hand, and sealed in airtight, food-grade vacuum pouches to prevent moisture absorption and retain authentic crunch.',
  },
  {
    id: 'faq-df-2',
    question: 'How do I place an order via WhatsApp?',
    answer:
      'Select your desired dry fruits and weights (250g, 500g, or 1kg), click "Add to Cart", and tap "Order on WhatsApp" at checkout. Provide your delivery address and city, and our system will generate a prefilled message. Simply send the message on WhatsApp, and our team will confirm dispatch.',
  },
  {
    id: 'faq-df-3',
    question: 'Where do you deliver and what are the delivery charges?',
    answer:
      'We deliver nationwide across Pakistan to all major cities and towns (Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Quetta, Multan, Faisalabad, etc.) via courier services (TCS, Leopards, M&P). Standard delivery fee is PKR 250, and delivery is FREE on orders above PKR 3,500.',
  },
  {
    id: 'faq-df-4',
    question: 'Can I customize a gift basket or bulk corporate order?',
    answer:
      'Yes! We offer customized wooden gift boxes, festive packaging, and bulk wholesale cartons for weddings, corporate gifts, and special occasions. Message us directly on WhatsApp with your requirements for custom quotations.',
  },
  {
    id: 'faq-df-5',
    question: 'Are the prices shown verified or sample prices?',
    answer:
      'The prices displayed are sample market rates in PKR that can be updated in real-time according to current seasonal harvest rates. Final pricing is confirmed with you upon WhatsApp communication prior to parcel dispatch.',
  },
];
