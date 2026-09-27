import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MessageCircle,
  Mail,
  Instagram,
  ArrowRight,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_EXPERIENCES, VISUAL_ASSETS } from '../data/initialData';
import { buildWhatsAppLink } from '../config/business';
import { InquiryFormSection } from '../components/InteractiveMapAndScroll';

// Section 28: TOUR EXPERIENCES PAGE
export const ExperiencesPage: React.FC = () => {
  const { business } = useApp();

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
          Curated Travel Styles
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          TOUR EXPERIENCES
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
          From multi-generational family holidays and private honeymoon retreats to Karakoram road trips and alpine treks, explore travel categories offered by {business.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_EXPERIENCES.map((exp, idx) => {
          const waUrl = buildWhatsAppLink(
            `Hello ${business.name}, I am interested in your ${exp.title} in Gilgit-Baltistan. Please share current options.`,
            business.whatsapp
          );
          return (
            <div
              key={exp.id}
              className="bg-[#111722] border border-white/10 rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-12"
            >
              <div className="sm:col-span-5 relative min-h-[200px] bg-[#0B0F14]">
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono-num text-[#D4AF37]">
                    0{idx + 1}. {exp.subtitle}
                  </div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {exp.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <Link
                    to={`/tours?type=${encodeURIComponent(exp.tourTypeFilter)}`}
                    className="px-4 py-2 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg whitespace-nowrap"
                  >
                    View {exp.title}
                  </Link>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold bg-white/10 text-white hover:bg-white/15 rounded-lg whitespace-nowrap flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
                    Inquire
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Section 29, 30, 31: ABOUT BAIG TRECKS & TOURS
export const AboutPage: React.FC = () => {
  const { business } = useApp();

  const waUrl = buildWhatsAppLink(
    `Hello ${business.name}, I would like to learn more about planning a journey to Gilgit-Baltistan with your team.`,
    business.whatsapp
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-b border-white/10 pb-12">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
            {business.locationLabel}
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            ABOUT {business.name.toUpperCase()}
          </h1>
          <p className="text-base text-[#CBD5E1] leading-relaxed">
            {business.name} specializes in tourism, mountain adventure, trekking, road trips, and personalized travel experiences across Gilgit-Baltistan, Northern Pakistan.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              CHAT ON WHATSAPP ({business.phone})
            </a>
            <Link
              to="/tours"
              className="px-5 py-3 text-xs font-semibold bg-white/10 text-white rounded-lg"
            >
              EXPLORE TOUR PACKAGES
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 aspect-[4/3] rounded-xl overflow-hidden border border-white/15">
          <img
            src={VISUAL_ASSETS.heroKarakoram}
            alt="Karakoram mountains in Gilgit-Baltistan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Section 29: OUR STORY (Editable, zero fabricated dates/numbers) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            01. Purpose &amp; Hospitality
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            OUR STORY
          </h2>
        </div>
        <div className="lg:col-span-8 bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
          <p>
            {business.name} was created to connect domestic and international travelers with the valleys, mountain roads, alpine lakes, and welcoming communities of Gilgit-Baltistan.
          </p>
          <p>
            Whether you are traveling along the Karakoram Highway into Hunza and Gojal, exploring the cold desert and historic valleys of Skardu, Shigar, and Khaplu, or trekking toward Fairy Meadows and Nanga Parbat, our focus is on clear communication, thoughtful route planning, and authentic northern hospitality.
          </p>
          <p className="text-xs text-[#94A3B8] pt-2 border-t border-white/10">
            Note: Additional company milestones and background details can be updated anytime by the administrator via the Website Settings dashboard.
          </p>
        </div>
      </section>

      {/* Section 30: TRAVEL WITH LOCAL KNOWLEDGE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
            02. Regional Insight
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            TRAVEL WITH LOCAL KNOWLEDGE
          </h2>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#111722] border border-white/10 space-y-2">
            <h3 className="font-display text-base font-bold text-white">
              Mountain Routes &amp; Seasons
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Understanding seasonal openings for high plateaus like Deosai and Khunjerab Pass ensures your itinerary fits real-world mountain conditions.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#111722] border border-white/10 space-y-2">
            <h3 className="font-display text-base font-bold text-white">
              Valley Communities &amp; Culture
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Experience the distinct heritage, local cuisine, and traditions of Gilgit, Hunza, Gojal, Skardu, Shigar, Khaplu, and Astore with respect and care.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#111722] border border-white/10 space-y-2">
            <h3 className="font-display text-base font-bold text-white">
              Practical Travel Logistics
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Coordinate driving durations, scenic rest stops, jeep transfers, and accommodation check-ins smoothly across multi-day northern circuits.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#111722] border border-white/10 space-y-2">
            <h3 className="font-display text-base font-bold text-white">
              Flexible Custom Journeys
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Every traveler group is different. We adapt daily pacing for families with children, honeymoon couples, photography teams, and trekking groups.
            </p>
          </div>
        </div>
      </section>

      {/* Section 31: TRUST & REGISTRATION (Strictly Non-Fabricated) */}
      <section className="bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            03. Trust, Documentation &amp; Verification
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Official Business &amp; Registration Information
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            For current registration documentation, licensing details (such as DTS, SECP, or regional tourism board documentation), or official verification prior to booking, contact {business.name} directly.
          </p>
        </div>
        <a
          href={`mailto:${business.email}`}
          className="px-5 py-3 text-xs font-semibold bg-white/10 hover:bg-white/15 text-white rounded-lg whitespace-nowrap"
        >
          Contact {business.name}
        </a>
      </section>
    </div>
  );
};

// Section 35: GALLERY PAGE (Masonry-style + Lightbox + Swipe/Keyboard)
export const GalleryPage: React.FC = () => {
  const { gallery, business } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Hunza',
    'Skardu',
    'Gilgit',
    'Passu',
    'Attabad Lake',
    'Mountains',
    'Lakes',
    'Roads',
    'Culture',
    'Villages',
    'Adventure',
    'Trekking',
  ];

  const filtered = gallery.filter(
    (img) =>
      selectedCategory === 'All' ||
      img.category.toLowerCase() === selectedCategory.toLowerCase() ||
      img.destination.toLowerCase() === selectedCategory.toLowerCase()
  );

  const activeImg = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
          Visual Perspectives of Northern Pakistan
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          THE NORTH THROUGH OUR LENS
        </h1>
        <p className="text-sm text-[#94A3B8] max-w-2xl">
          Explore scenes from Hunza, Attabad Lake, Passu Cones, Skardu, Deosai, and Fairy Meadows. Administrators can upload and manage confirmed company photography in the Admin Dashboard.
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setLightboxIndex(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#0EA5E9] text-[#0B0F14] font-semibold'
                : 'bg-[#111722] text-[#CBD5E1] border border-white/10 hover:border-white/25'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="group text-left bg-[#111722] border border-white/10 rounded-xl overflow-hidden focus:outline-none focus:border-[#0EA5E9]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#0B0F14]">
                <img
                  src={img.imageUrl}
                  alt={img.altText}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="text-[11px] text-[#D4AF37]">
                  {img.destination} · {img.category}
                </div>
                <div className="text-xs text-[#E2E8F0] line-clamp-2">{img.caption}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-xl bg-[#111722] border border-white/10 text-center space-y-3">
          <p className="text-sm text-[#CBD5E1]">
            No gallery items under "{selectedCategory}" yet. Follow {business.instagram[1]?.handle} on Instagram or view all categories.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className="px-4 py-2 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
          >
            Show All Photographs
          </button>
        </div>
      )}

      {/* Accessible Fullscreen Lightbox Modal */}
      {activeImg && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
        >
          <div className="flex items-center justify-between text-xs text-[#CBD5E1]">
            <span>
              {lightboxIndex + 1} / {filtered.length} — {activeImg.destination}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length)
              }
              aria-label="Previous Image"
              className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <img
              src={activeImg.imageUrl}
              alt={activeImg.altText}
              referrerPolicy="no-referrer"
              className="max-h-[72vh] max-w-full object-contain rounded-lg"
            />

            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % filtered.length)}
              aria-label="Next Image"
              className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/70 border border-white/20 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-1">
            <div className="text-xs text-[#D4AF37]">
              {activeImg.destination} · {activeImg.category}
            </div>
            <p className="text-sm text-white">{activeImg.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Section 33: TRAVEL GUIDES / BLOG
export const TravelGuidesPage: React.FC = () => {
  const { blogPosts } = useApp();
  const publishedPosts = blogPosts.filter((p) => p.published);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
          Editorial Planning &amp; Regional Dispatches
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          GILGIT-BALTISTAN TRAVEL GUIDES
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl">
          Practical guides on seasonal weather, packing checklists, route comparisons, and mountain travel across Northern Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publishedPosts.map((post) => (
          <article
            key={post.id}
            className="bg-[#111722] border border-white/10 hover:border-white/25 rounded-xl overflow-hidden flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="aspect-[16/9] overflow-hidden bg-[#0B0F14]">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                  <span className="text-[#D4AF37]">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-white">
                  <Link
                    to={`/travel-guides/${post.slug}`}
                    className="hover:text-[#0EA5E9] transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">{post.excerpt}</p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link
                to={`/travel-guides/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0EA5E9] hover:text-white"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export const TravelGuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, business } = useApp();
  const post = blogPosts.find((p) => p.slug === slug || p.id === slug);

  if (!post) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-white">Article Not Found</h1>
        <Link
          to="/travel-guides"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Travel Guides
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        to="/travel-guides"
        className="inline-flex items-center gap-1.5 text-xs text-[#CBD5E1] hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All Travel Guides
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
          <span>{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {post.title}
        </h1>
      </div>

      <div className="aspect-[16/9] rounded-xl overflow-hidden border border-white/15">
        <img
          src={post.imageUrl}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-10 space-y-4 text-sm sm:text-base text-[#E2E8F0] leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      <div className="p-6 rounded-xl bg-[#0F172A] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-display text-lg font-bold text-white">
            Ready to Plan Your Gilgit-Baltistan Trip?
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Chat with {business.name} on WhatsApp for current road updates and custom packages.
          </p>
        </div>
        <a
          href={buildWhatsAppLink(
            `Hello ${business.name}, I just read "${post.title}" and would like to plan a trip.`,
            business.whatsapp
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg whitespace-nowrap flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          CHAT ON WHATSAPP
        </a>
      </div>
    </article>
  );
};

// Section 37: CONTACT PAGE
export const ContactPage: React.FC = () => {
  const { business } = useApp();

  const waLink = buildWhatsAppLink(
    `Hello ${business.name}, I would like to plan a trip to Gilgit-Baltistan.`,
    business.whatsapp
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
          Direct Travel Consultation
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          LET&apos;S PLAN YOUR JOURNEY
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl">
          Reach out to {business.name} via WhatsApp, email, Instagram, or our inquiry form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-5">
          {/* WHATSAPP */}
          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-3">
            <div className="text-xs font-semibold text-[#10B981] uppercase tracking-wider">
              WHATSAPP
            </div>
            <div className="font-mono-num text-2xl font-bold text-white">
              {business.phone}
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              CHAT ON WHATSAPP
            </a>
          </div>

          {/* EMAIL */}
          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-3">
            <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
              EMAIL
            </div>
            <div className="text-base sm:text-lg font-bold text-white break-all">
              {business.email}
            </div>
            <a
              href={`mailto:${business.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-white/10 text-white hover:bg-white/15 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              EMAIL US
            </a>
          </div>

          {/* INSTAGRAM */}
          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-3">
            <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              INSTAGRAM
            </div>
            <div className="space-y-2.5">
              {business.instagram.map((ig) => (
                <a
                  key={ig.handle}
                  href={ig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F14] border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Instagram className="w-4 h-4 text-[#D4AF37]" />
                    {ig.handle}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
                </a>
              ))}
            </div>
          </div>

          {/* JAZZCASH PAYMENT INFO */}
          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-2">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              JazzCash Payment
            </div>
            <div className="text-xs text-[#CBD5E1]">
              Account / Number:{' '}
              <span className="font-mono-num text-[#D4AF37] font-semibold">
                {business.jazzcashNumber}
              </span>
            </div>
            <div className="text-xs text-[#CBD5E1]">
              Account Name:{' '}
              <span className="text-white font-semibold">{business.jazzcashName}</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] pt-1">
              {business.paymentInstructions}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <InquiryFormSection />
        </div>
      </div>
    </div>
  );
};

// Section 55: ADVENTUROUS 404 PAGE
export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={VISUAL_ASSETS.deosaiPlains}
          alt="High mountain plateau in Gilgit-Baltistan"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/70 to-[#0B0F14]" />
      </div>

      <div className="relative z-10 text-center max-w-xl space-y-5">
        <div className="inline-flex items-center gap-2 text-xs font-mono-num text-[#D4AF37] uppercase tracking-widest">
          <Compass className="w-4 h-4" />
          <span>404 · OFF THE TRAIL</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white">
          LOST IN THE MOUNTAINS?
        </h1>
        <p className="text-base sm:text-lg text-[#CBD5E1]">
          Let&apos;s get you back on the trail.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold bg-[#0EA5E9] text-[#0B0F14] hover:bg-[#38BDF8] rounded-lg transition-colors"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
};
