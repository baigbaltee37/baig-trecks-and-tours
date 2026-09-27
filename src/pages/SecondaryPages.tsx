import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
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
  Phone,
  Mountain,
  Calendar,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_EXPERIENCES, VISUAL_ASSETS } from '../data/initialData';
import { buildWhatsAppLink } from '../config/business';
import { InquiryFormSection } from '../components/InteractiveMapAndScroll';

export const ExperiencesPage: React.FC = () => {
  const { business } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10 overflow-x-hidden">
      <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Mountain className="w-3.5 h-3.5" />
          <span>Travel Styles &amp; Expeditions</span>
        </span>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Gilgit-Baltistan Experiences
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          From multi-day mountain trekking and high-altitude jeep safaris to family holidays, honeymoon escapes, and cultural exploration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {INITIAL_EXPERIENCES.map((exp, idx) => {
          const waUrl = buildWhatsAppLink(
            `Hello Baig Treks & Tours, I am interested in your ${exp.title} experience in Gilgit-Baltistan.`,
            business.whatsapp
          );
          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-5 shadow-lg shadow-slate-900/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  <Users className="w-3.5 h-3.5" />
                  <span>{exp.idealFor}</span>
                </div>
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
                  {exp.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-sm font-semibold text-center bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Inquire on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          );
        })}
      </div>

      <InquiryFormSection />
    </div>
  );
};

export const AboutPage: React.FC = () => {
  const { business } = useApp();
  const waUrl = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I would like to learn more about planning a trip to Gilgit-Baltistan.`,
    business.whatsapp
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12 overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Mountain className="w-3.5 h-3.5" />
            <span>About Baig Treks &amp; Tours</span>
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Authentic Mountain Travel Across Gilgit-Baltistan
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            <strong>Baig Treks &amp; Tours</strong> is dedicated to connecting travelers with the valleys, mountain passes, alpine plateaus, and living cultures of Gilgit-Baltistan, Northern Pakistan.
          </p>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Whether you are planning a family holiday in Hunza, a scenic expedition through Skardu and Deosai, or a trek toward Fairy Meadows and Nanga Parbat Base Camp, our focus is on honest seasonal guidance, reliable mountain logistics, and tailored itineraries.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/tours"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-center bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-2xl shadow-sm"
            >
              Explore Our Tours
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-center bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 rounded-2xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 shadow-xl">
            <img
              src={VISUAL_ASSETS.skarduValley}
              alt="Skardu Valley in Gilgit-Baltistan"
              referrerPolicy="no-referrer"
              className="w-full h-auto min-h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Policies & Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-lg shadow-slate-900/5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Safety, Comfort &amp; Local Expertise</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Responsible Mountain Operations
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Mountain travel in Gilgit-Baltistan involves high-altitude passes, changing weather windows, and remote valley roads. We prioritize well-maintained vehicles, experienced local drivers familiar with the Karakoram Highway and Skardu road network, and realistic daily driving times.
          </p>
        </div>

        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-lg shadow-slate-900/5">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
            <Compass className="w-4 h-4" />
            <span>Booking &amp; JazzCash Policy</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Transparent Confirmations
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            {business.bookingPolicy}
          </p>
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <div className="text-amber-900 font-bold">Official JazzCash Account</div>
            <div className="text-slate-700">
              Account / Number:{' '}
              <span className="font-mono-num text-slate-900 font-bold">
                {business.jazzcashNumber}
              </span>
            </div>
            <div className="text-slate-700">
              Account Name:{' '}
              <span className="text-slate-900 font-bold">{business.jazzcashName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GalleryPage: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Hunza', 'Skardu', 'Mountains & Lakes', 'Trekking'];

  const filtered = gallery.filter(
    (img) =>
      selectedCategory === 'All' ||
      img.category.toLowerCase() === selectedCategory.toLowerCase() ||
      img.destination.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            Visual Portfolio
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Gilgit-Baltistan Photo Gallery
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filtered.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxIndex(idx)}
            className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-white aspect-[4/3] text-left focus:outline-none shadow-lg shadow-slate-900/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <img
              src={item.imageUrl}
              alt={item.altText}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-auto min-h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="text-xs font-semibold text-emerald-300">{item.destination}</div>
              <div className="text-sm font-semibold">{item.caption}</div>
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close Lightbox"
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() =>
              setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length)
            }
            aria-label="Previous Image"
            className="absolute left-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full space-y-3 text-center">
            <img
              src={filtered[lightboxIndex].imageUrl}
              alt={filtered[lightboxIndex].altText}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto mx-auto rounded-3xl border border-white/15 object-contain"
            />
            <div className="text-sm font-semibold text-white">
              {filtered[lightboxIndex].caption}
            </div>
            <div className="text-xs text-emerald-300">
              {filtered[lightboxIndex].destination} · {lightboxIndex + 1} of {filtered.length}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLightboxIndex((lightboxIndex + 1) % filtered.length)}
            aria-label="Next Image"
            className="absolute right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export const TravelGuidesPage: React.FC = () => {
  const { blogPosts } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 overflow-x-hidden">
      <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          Gilgit-Baltistan Travel Resource
        </span>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Travel Guides &amp; Seasonal Advice
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Practical planning guides for Hunza, Skardu, Fairy Meadows, Deosai, packing checklists, and road trip routes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg shadow-slate-900/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-auto min-h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4 md:p-5 space-y-2.5">
                <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {post.category} · {post.readTime}
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 leading-snug">
                  <Link
                    to={`/travel-guides/${post.slug}`}
                    className="hover:text-emerald-700 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{post.excerpt}</p>
              </div>
            </div>
            <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2">
              <Link
                to={`/travel-guides/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-emerald-800 hover:text-emerald-900"
              >
                <span>Read Full Article</span>
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Guide Not Found
        </h1>
        <Link
          to="/travel-guides"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Travel Guides</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 overflow-x-hidden">
      <Link
        to="/travel-guides"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Travel Guides</span>
      </Link>

      <div className="space-y-3">
        <div className="text-xs sm:text-sm font-semibold text-emerald-800">
          {post.category} · {post.readTime} · Published {post.publishedDate}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          {post.title}
        </h1>
      </div>

      <div className="rounded-3xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100 shadow-xl">
        <img
          src={post.imageUrl}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-auto min-h-full object-cover"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-4 text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-line shadow-sm">
        {post.content}
      </div>

      <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-display text-lg font-bold text-slate-900">
            Ready to Plan This Journey With Baig Treks &amp; Tours?
          </div>
          <p className="text-sm text-slate-600">
            Message our team on WhatsApp for seasonal road updates and custom packages.
          </p>
        </div>
        <a
          href={buildWhatsAppLink(
            `Hello Baig Treks & Tours, I just read your guide "${post.title}" and would like to plan a trip.`,
            business.whatsapp
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-3 text-sm font-semibold bg-emerald-700 text-white rounded-2xl flex items-center justify-center gap-2 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Inquire on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { business } = useApp();
  const waUrl = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I would like to inquire about booking a tour in Gilgit-Baltistan.`,
    business.whatsapp
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10 overflow-x-hidden">
      <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          Get in Touch
        </span>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Contact Baig Treks &amp; Tours
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Connect directly with our team via WhatsApp, phone, email, or Instagram, or submit a custom trip inquiry below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-lg shadow-slate-900/5">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
              Direct Contact Channels
            </h2>

            <div className="space-y-2.5 text-sm">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-900 hover:bg-emerald-100/70 transition-colors"
              >
                <span className="flex items-center gap-2.5 font-medium">
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>WhatsApp / Phone</span>
                </span>
                <span className="font-mono-num font-bold text-emerald-800">
                  {business.phone}
                </span>
              </a>

              <a
                href={`tel:+92${business.phone.replace(/^0/, '')}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <span className="flex items-center gap-2.5 font-medium">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>Direct Call</span>
                </span>
                <span className="font-mono-num font-bold">{business.phone}</span>
              </a>

              <a
                href={`mailto:${business.email}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-colors break-all"
              >
                <span className="flex items-center gap-2.5 font-medium">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>Email</span>
                </span>
                <span className="text-xs font-semibold">{business.email}</span>
              </a>

              {business.instagram.map((ig) => (
                <a
                  key={ig.handle}
                  href={ig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Instagram className="w-4 h-4 text-teal-600" />
                    <span>Instagram</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-800">{ig.handle}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="text-xs font-bold text-amber-900">JazzCash Payment</div>
            <div className="text-sm text-slate-800">
              Account / Number:{' '}
              <span className="font-mono-num text-slate-900 font-bold">
                {business.jazzcashNumber}
              </span>
            </div>
            <div className="text-sm text-slate-800">
              Account Name:{' '}
              <span className="text-slate-900 font-bold">{business.jazzcashName}</span>
            </div>
            <p className="text-xs text-slate-600 pt-1 leading-relaxed">
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

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="text-xs font-semibold text-emerald-800">404 — Page Not Found</div>
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
        Trail Off the Map
      </h1>
      <p className="text-sm md:text-base text-slate-600">
        The page you are looking for does not exist or has moved. Return to our homepage or browse active Gilgit-Baltistan tour packages.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-2xl"
        >
          Return Home
        </Link>
        <Link
          to="/tours"
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-white border border-slate-300 text-slate-800 rounded-2xl"
        >
          Browse Tours
        </Link>
      </div>
    </div>
  );
};
