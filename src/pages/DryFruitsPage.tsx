import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  Truck,
  ShieldCheck,
  Award,
  Heart,
  Star,
  ChevronDown,
  ArrowRight,
  Filter,
  Package,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  INITIAL_DRY_FRUITS,
  DRY_FRUITS_CATEGORIES,
  SAMPLE_DRY_FRUIT_REVIEWS,
  DRY_FRUIT_FAQS,
  DRY_FRUITS_WHATSAPP_NUMBER,
  DryFruitProduct,
} from '../data/dryFruitsData';
import { DryFruitCard } from '../components/dryfruits/DryFruitCard';
import { useCart } from '../context/CartContext';
import { buildWhatsAppLink } from '../config/business';

export const DryFruitsPage: React.FC = () => {
  const { openCart, cartCount, openCheckout } = useCart();
  const productsRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(DRY_FRUIT_FAQS[0]?.id || null);

  const filteredProducts = useMemo(() => {
    return INITIAL_DRY_FRUITS.filter((product) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.urduName.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.origin.toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const bestSellers = useMemo(() => {
    return INITIAL_DRY_FRUITS.filter((p) => p.badge === 'Bestseller' || p.featured).slice(0, 4);
  }, []);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const generalWhatsAppUrl = buildWhatsAppLink(
    'Hello Baig Dry Fruits! I would like to inquire about your fresh dry fruits harvest and bulk gift packaging.',
    DRY_FRUITS_WHATSAPP_NUMBER
  );

  return (
    <div className="space-y-16 md:space-y-24 pb-24 overflow-x-hidden bg-[#F8F6F0] text-[#252B27]">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          Headline: “Premium Dry Fruits, Naturally Better”
          Subtitle: “Discover quality dry fruits, handpicked for freshness, taste, and everyday wellness.”
          Buttons: “Shop Now” and “Explore Products”
          ========================================================================= */}
      <section className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Cinematic Dry Fruits Background Image with Natural Warm Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=1800&q=85"
            alt="Assorted premium dry fruits — almonds, walnuts, pistachios, cashews, and dates"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
          />
          {/* Subtle gradient overlay to match Baig brand aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        </div>

        {/* Central Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-20 text-center space-y-6 sm:space-y-8">
          {/* Brand Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase"
          >
            <Sparkles className="w-4 h-4 text-[#C5A46D]" />
            <span>Pure Karakoram Harvest · Baig Dry Fruits</span>
          </motion.div>

          {/* Exact Requested Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold text-white tracking-tight leading-[1.05] drop-shadow-sm"
          >
            Premium Dry Fruits, Naturally Better
          </motion.h1>

          {/* Exact Requested Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-xs"
          >
            Discover quality dry fruits, handpicked for freshness, taste, and everyday wellness. Direct from the pristine orchards of Northern Pakistan.
          </motion.p>

          {/* Exact Requested Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <button
              type="button"
              onClick={scrollToProducts}
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold rounded-full bg-[#174734] hover:bg-[#0D2B20] text-white shadow-lg shadow-[#174734]/30 transition-all flex items-center justify-center gap-2 group"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A46D]" />
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46D] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={scrollToProducts}
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold rounded-full bg-white/20 hover:bg-white text-white hover:text-[#174734] backdrop-blur-md border border-white/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Products</span>
            </button>

            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 text-sm font-semibold rounded-full bg-emerald-600/90 hover:bg-emerald-700 text-white backdrop-blur-md border border-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp Inquiries</span>
            </a>
          </motion.div>

          {/* Highlight Trust Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-white/85"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
              <span>100% Sun-Dried &amp; Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
              <span>Airtight Vacuum Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C5A46D]" />
              <span>Nationwide Delivery across Pakistan</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SEARCH, CATEGORY FILTERS & CART STATUS
          ========================================================================= */}
      <section ref={productsRef} className="max-w-7xl mx-auto px-4 md:px-6 scroll-mt-24">
        <div className="bg-white border border-[#E8E4D9] rounded-3xl p-5 sm:p-7 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#808D86] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Badam, Kaju, Akhrot, Pista, Khajoor..."
                className="w-full pl-11 pr-4 py-3 bg-[#F8F6F0] border border-[#E8E4D9] rounded-2xl text-xs sm:text-sm text-[#252B27] placeholder:text-[#808D86] focus:outline-none focus:border-[#174734] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#808D86] hover:text-[#252B27]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Cart Trigger Summary Button */}
            <button
              type="button"
              onClick={openCart}
              className="px-5 py-2.5 rounded-full bg-[#174734] hover:bg-[#0D2B20] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A46D]" />
              <span>View Basket ({cartCount})</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E4D9]/60">
            <span className="text-xs font-semibold text-[#174734] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {DRY_FRUITS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#174734] text-white shadow-xs'
                    : 'bg-[#F8F6F0] text-[#252B27] border border-[#E8E4D9] hover:bg-[#EAE6DB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: BEST SELLERS SHOWCASE
          ========================================================================= */}
      {selectedCategory === 'All' && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E4D9] pb-4">
            <div className="space-y-1">
              <span className="eyebrow-badge eyebrow-gold">Customer Favorites</span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#174734]">
                Best Sellers &amp; Royal Reserves
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5A655F]">
              Hand-selected daily for exceptional crunch, oil content, and natural sweetness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <DryFruitCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: COMPLETE PRODUCT CATALOG
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E4D9] pb-4">
          <div className="space-y-1">
            <span className="eyebrow-badge">Complete Collection</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
              Fresh Harvest Dry Fruits Catalog
            </h2>
            <p className="text-xs sm:text-sm text-[#5A655F]">
              Showing {filteredProducts.length} premium products. Select your desired weight (250g, 500g, or 1kg) for real-time prices.
            </p>
          </div>

          <div className="text-xs text-[#808D86] italic">
            * Note: Sample prices shown in PKR; subject to seasonal harvest availability.
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 bg-white border border-[#E8E4D9] rounded-3xl text-center space-y-4">
            <p className="text-sm text-[#5A655F]">
              No dry fruits match your search "{searchQuery}". Try searching for Badam, Kaju, Akhrot, or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold bg-[#174734] text-white rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <DryFruitCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 5: WHY CHOOSE BAIG DRY FRUITS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white border border-[#E8E4D9] rounded-3xl p-8 sm:p-12 shadow-md space-y-10">
          <div className="max-w-3xl space-y-3 border-b border-[#E8E4D9] pb-6">
            <span className="eyebrow-badge eyebrow-gold">Quality Standards</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
              Why Choose Baig Dry Fruits
            </h2>
            <p className="text-sm md:text-base text-[#5A655F] leading-relaxed">
              We leverage our extensive native presence across Gilgit-Baltistan and Northern Pakistan to source genuine, orchard-fresh produce directly from local farming families.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                title: 'High-Altitude Harvest',
                desc: 'Grown in mineral-rich glacial soil and sun-drenched terraced slopes of Skardu, Hunza, and Swat.',
              },
              {
                icon: ShieldCheck,
                title: 'Airtight Vacuum Seals',
                desc: 'Pouches sealed immediately after grading to preserve authentic crunch, volatile aromatic oils, and crispness.',
              },
              {
                icon: Award,
                title: 'Zero Chemical Bleaching',
                desc: 'Naturally sun-cured. No artificial coloring, synthetic gloss, or chemical preservatives.',
              },
              {
                icon: Truck,
                title: 'Fast Courier Delivery',
                desc: 'Dispatched via verified courier partners across Pakistan within 24 hours of your WhatsApp confirmation.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#F8F6F0] border border-[#E8E4D9] rounded-2xl space-y-3 hover:border-[#174734]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#174734] shadow-xs">
                  <item.icon className="w-5 h-5 text-[#174734]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#174734]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#5A655F] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: NATIONWIDE DELIVERY & PACKAGING INFORMATION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-[#102B24] text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#174734]">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#C5A46D] text-xs font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>Safe Nationwide Shipping</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Freshness Delivered to Your Doorstep
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
              Whether you are in Islamabad, Lahore, Karachi, Peshawar, Quetta, or anywhere in Pakistan, your parcel is packed with utmost care in puncture-resistant, food-grade bags.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-base font-bold text-[#C5A46D]">FREE SHIPPING</div>
                <div className="text-white/70 mt-0.5">On all orders above PKR 3,500</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-base font-bold text-[#C5A46D]">2–4 Working Days</div>
                <div className="text-white/70 mt-0.5">Prompt nationwide transit</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-base font-bold text-[#C5A46D]">Cash on Delivery</div>
                <div className="text-white/70 mt-0.5">Or secure bank / JazzCash</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 text-center lg:text-right space-y-3">
            <button
              type="button"
              onClick={openCart}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C5A46D] hover:bg-[#B39158] text-[#0D2B20] font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Your Basket</span>
            </button>
            <p className="text-[11px] text-white/60">
              Need bulk or gift boxes? Chat directly on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CUSTOMER REVIEWS (SAMPLE CONTENT)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        <div className="space-y-1 border-b border-[#E8E4D9] pb-4">
          <span className="eyebrow-badge eyebrow-gold">Testimonials</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-[#5A655F]">
            * Note: Sample customer testimonials highlighting our quality, packaging, and delivery speed across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_DRY_FRUIT_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white border border-[#E8E4D9] rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#C5A46D]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A46D]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#252B27] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E4D9] flex items-center justify-between text-xs">
                <div>
                  <div className="font-serif font-bold text-sm text-[#174734]">
                    {rev.customerName}
                  </div>
                  <div className="text-[#808D86] text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C5A46D]" />
                    <span>{rev.city}</span>
                    <span>·</span>
                    <span>{rev.productName}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Order
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: DRY FRUITS FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
        <div className="text-center space-y-2 border-b border-[#E8E4D9] pb-4">
          <span className="eyebrow-badge">Need Help?</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174734] tracking-tight">
            Dry Fruits Store FAQs
          </h2>
          <p className="text-xs sm:text-sm text-[#5A655F]">
            Answers to common questions regarding freshness, ordering via WhatsApp, and delivery.
          </p>
        </div>

        <div className="space-y-3">
          {DRY_FRUIT_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-[#E8E4D9] rounded-2xl overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 transition-colors hover:bg-[#F8F6F0]"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#174734]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#174734] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5A655F] leading-relaxed border-t border-[#E8E4D9]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: BULK & GIFT BOX WHATSAPP BANNER
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="bg-[#F4F1E8] border border-[#E8E4D9] rounded-3xl p-8 sm:p-10 text-center space-y-4">
          <span className="eyebrow-badge eyebrow-gold">Corporate &amp; Wedding Gifts</span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#174734]">
            Custom Wooden Gift Boxes &amp; Wholesale Inquiries
          </h3>
          <p className="text-xs sm:text-sm text-[#5A655F] max-w-xl mx-auto leading-relaxed">
            Planning a special corporate gift, festive parcel, or wedding celebration? We prepare elegant laser-engraved wooden dry fruit boxes with custom assortments.
          </p>
          <div className="pt-2">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#174734] hover:bg-[#0D2B20] text-white font-semibold text-xs sm:text-sm transition-all shadow-md inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A46D]" />
              <span>Contact for Custom Gift Packages ({DRY_FRUITS_WHATSAPP_NUMBER})</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
