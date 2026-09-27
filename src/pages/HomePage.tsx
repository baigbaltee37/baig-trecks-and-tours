import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  MessageCircle,
  Phone,
  Mail,
  ArrowRight,
  Search,
  Compass,
  ShieldCheck,
  ChevronDown,
  Shield,
  Plus,
  Download,
  LogOut,
  Star,
  MapPin,
  Mountain,
  Calendar,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VISUAL_ASSETS, INITIAL_EXPERIENCES } from '../data/initialData';
import { buildWhatsAppLink } from '../config/business';
import { Karakoram3DCanvas, KARAKORAM_WAYPOINTS } from '../components/Karakoram3DCanvas';
import {
  TourCard,
  CinematicDestinationScroller,
  InteractiveGilgitBaltistanMap,
  InquiryFormSection,
} from '../components/InteractiveMapAndScroll';

export const HomePage: React.FC = () => {
  const {
    business,
    tours,
    destinations,
    blogPosts,
    faqs,
    isAdmin,
    exportToursAsJson,
    signOut,
  } = useApp();

  // Hero Parallax Scroll Ref
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  // Tour Search & Filter State
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedTourType, setSelectedTourType] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [active3DWaypoint, setActive3DWaypoint] = useState(1);
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchDest =
        selectedDestination === 'All' ||
        tour.destination.toLowerCase().includes(selectedDestination.toLowerCase()) ||
        tour.title.toLowerCase().includes(selectedDestination.toLowerCase());

      const matchDuration =
        selectedDuration === 'All' || tour.durationCategory === selectedDuration;

      const matchType =
        selectedTourType === 'All' ||
        tour.tourType.toLowerCase() === selectedTourType.toLowerCase();

      const matchBudget =
        selectedBudget === 'All' ||
        (selectedBudget === 'Inquiry' && tour.pricePerPerson === 0) ||
        (selectedBudget === 'Priced' && tour.pricePerPerson > 0);

      return matchDest && matchDuration && matchType && matchBudget;
    });
  }, [tours, selectedDestination, selectedDuration, selectedTourType, selectedBudget]);

  const featuredTours = useMemo(() => {
    const list = tours.filter((t) => t.featured);
    return list.length > 0 ? list.slice(0, 4) : tours.slice(0, 4);
  }, [tours]);

  const heroWaLink = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I visited your website and would like to plan a trip to Gilgit-Baltistan.`,
    business.whatsapp
  );

  return (
    <div className="space-y-12 md:space-y-20 pb-12 overflow-x-hidden">
      {/* ADMIN CONTROLS BAR (Visible on Home when logged in as Admin) */}
      {isAdmin && (
        <div className="bg-emerald-950 text-white border-b border-emerald-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-300">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Admin Mode Active (admin@baigtreks.com)</span>
              <span className="text-slate-300 hidden md:inline font-normal">
                — Add, edit, or delete tours and manage prices &amp; images
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Link
                to="/admin"
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Manage Tours</span>
              </Link>
              <button
                type="button"
                onClick={exportToursAsJson}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Export Tours JSON</span>
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold bg-red-500/20 text-red-200 border border-red-400/30 hover:bg-red-500/30 rounded-2xl flex items-center justify-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2026 ULTRA-PREMIUM HERO: High-Contrast Crisp Card, 3D Mountain Illustration, Floating Elements & Parallax */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/70 border-b border-slate-200 pt-8 md:pt-14 pb-10 md:pb-16 px-4 md:px-6 text-slate-900"
      >
        {/* Layered 3D Mountain Illustration Vector Backdrop */}
        <svg
          viewBox="0 0 1440 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 w-full h-auto pointer-events-none opacity-25"
        >
          <defs>
            <linearGradient id="heroMountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#065F46" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="heroMountainMid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0F766E" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="heroMountainFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#064E3B" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* Far 3D Karakoram Range */}
          <polygon
            points="0,420 0,240 220,95 430,215 690,55 960,210 1210,85 1440,200 1440,420"
            fill="url(#heroMountainFar)"
          />
          {/* Mid Faceted Peaks */}
          <polygon
            points="0,420 140,210 350,310 580,120 830,275 1090,130 1320,255 1440,190 1440,420"
            fill="url(#heroMountainMid)"
          />
          {/* Foreground 3D Ridge */}
          <polygon
            points="0,420 260,250 510,340 780,175 1040,320 1290,215 1440,290 1440,420"
            fill="url(#heroMountainFront)"
          />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left Column: High-Contrast White Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Mountain className="w-4 h-4 text-emerald-600" />
                <span>{business.locationLabel} · 2026 Expeditions</span>
              </div>

              {/* Heading: Max text-2xl on mobile, text-4xl on desktop, font-bold tracking-tight text-slate-900 */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                {business.heroHeadline || 'Discover the Majesty of Gilgit-Baltistan'}
              </h1>

              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                {business.heroDescription}
              </p>

              {/* Quick Trust Highlights with Lucide Icons */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>14 Valleys</span>
                  </div>
                  <div className="text-xs text-slate-700 font-semibold mt-1">Guided Routes</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                    <Star className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>4.9 Rated</span>
                  </div>
                  <div className="text-xs text-slate-700 font-semibold mt-1">Local Experts</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                    <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Private &amp; Group</span>
                  </div>
                  <div className="text-xs text-slate-700 font-semibold mt-1">Custom Plans</div>
                </div>
              </div>

              {/* 2 Hero Buttons — Emerald Background with White Text, Scale on Hover */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/tours"
                    className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Explore Tours</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={heroWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Plan on WhatsApp</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Right Column: Parallax Mountain Visual + Floating High-Contrast Badges */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl aspect-[16/11] bg-slate-900"
              >
                <motion.img
                  style={{ y: parallaxY }}
                  src={VISUAL_ASSETS.heroKarakoram}
                  alt="Hunza Valley and Karakoram mountains in Gilgit-Baltistan"
                  referrerPolicy="no-referrer"
                  className="w-full h-[118%] -mt-[6%] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 text-white">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hunza · Skardu · Fairy Meadows · Deosai</span>
                    </div>
                    <div className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
                      Karakoram &amp; Himalayan Expeditions
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating High-Contrast Badge 1 (Top Left) */}
              <div className="hidden sm:flex absolute -top-4 -left-4 bg-white border border-slate-200 text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                  <Mountain className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">K2 &amp; Karakoram</div>
                  <div className="text-[11px] font-semibold text-slate-700">4,693m Khunjerab Pass</div>
                </div>
              </div>

              {/* Floating High-Contrast Badge 2 (Bottom Right) */}
              <div className="hidden sm:flex absolute -bottom-4 -right-3 bg-white border border-slate-200 text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">4.9 / 5 Traveler Rating</div>
                  <div className="text-[11px] font-semibold text-slate-700">Verified Local Guides</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white border border-slate-200 rounded-3xl p-4 md:p-6 shadow-xl text-slate-900"
          >
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-900 mb-3">
              <Search className="w-4 h-4 text-emerald-600" />
              <span>Find Your Gilgit-Baltistan Tour Package</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="All">All Destinations</option>
                  <option value="Hunza">Hunza Valley</option>
                  <option value="Skardu">Skardu Valley</option>
                  <option value="Fairy Meadows">Fairy Meadows</option>
                  <option value="Deosai">Deosai Plains</option>
                  <option value="Khunjerab">Khunjerab Pass</option>
                  <option value="Shigar">Shigar &amp; Khaplu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="All">Any Duration</option>
                  <option value="4-6 Days">4–6 Days</option>
                  <option value="7-10 Days">7–10 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tour Type
                </label>
                <select
                  value={selectedTourType}
                  onChange={(e) => setSelectedTourType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="All">All Styles</option>
                  <option value="Family Holidays">Family Holidays</option>
                  <option value="Road Trips">Road Trips</option>
                  <option value="Adventure & Trekking">Adventure &amp; Trekking</option>
                  <option value="Custom Private Tours">Custom Private Tours</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pricing
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="All">All Packages</option>
                  <option value="Inquiry">Custom Quote</option>
                  <option value="Priced">Published Price</option>
                </select>
              </div>

              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setSelectedDestination('All');
                    setSelectedDuration('All');
                    setSelectedTourType('All');
                    setSelectedBudget('All');
                  }}
                  className="w-full py-2.5 px-4 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl transition-colors"
                >
                  Reset Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED TOURS SECTION — 1 Col Mobile, 2 Col Tablet, 3-4 Col Desktop */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Mountain className="w-4 h-4 text-emerald-600" />
              <span>Curated Tour Packages</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Featured Gilgit-Baltistan Tours
            </h2>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/tours"
              className="w-full sm:w-auto py-2.5 px-5 text-sm font-bold text-center text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>View All {tours.length} Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {filteredTours.length === 0 ? (
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
            <p className="text-sm md:text-base text-slate-600 font-medium">
              No tours match your current filter selection. Reset filters or request a custom itinerary.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDestination('All');
                setSelectedDuration('All');
                setSelectedTourType('All');
                setSelectedBudget('All');
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl"
            >
              Show All Tours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {(selectedDestination === 'All' &&
            selectedDuration === 'All' &&
            selectedTourType === 'All' &&
            selectedBudget === 'All'
              ? featuredTours
              : filteredTours
            ).map((tour, idx) => (
              <TourCard key={tour.id || tour.slug || `tour-${idx}`} tour={tour} />
            ))}
          </div>
        )}
      </section>

      {/* POPULAR DESTINATIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Iconic Valleys &amp; Plateaus</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Top Destinations in Northern Pakistan
            </h2>
          </div>
          <Link
            to="/destinations"
            className="w-full sm:w-auto py-2.5 px-5 text-sm font-bold text-center text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>View All {destinations.length} Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {destinations.slice(0, 6).map((dest, idx) => (
            <motion.div
              key={dest.id || dest.slug || `dest-${idx}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                to={`/destinations/${dest.slug}`}
                className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-900/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={dest.imageUrl || VISUAL_ASSETS.heroKarakoram}
                    alt={`${dest.name} — ${dest.region}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-auto min-h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-2xl shadow-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{dest.region}</span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-display text-xl font-bold tracking-tight text-white">{dest.name}</h3>
                    <p className="text-xs text-white font-semibold flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Best Season: {dest.bestSeason || 'April to October'}</span>
                    </p>
                  </div>
                </div>
                <div className="p-4 md:p-5 space-y-2.5">
                  <p className="text-sm text-slate-600 font-medium line-clamp-2">{dest.shortDescription}</p>
                  <div className="text-xs font-bold text-slate-900 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Destination</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SIGNATURE JOURNEY SCROLLER */}
      <CinematicDestinationScroller />

      {/* INTERACTIVE MAP OF GILGIT-BALTISTAN */}
      <InteractiveGilgitBaltistanMap />

      {/* 3D KARAKORAM TERRAIN EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800">
                  <Mountain className="w-4 h-4 text-emerald-600" />
                  <span>Interactive 3D Elevation Explorer</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                  Karakoram 3D Terrain Preview
                </h2>
                <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                  Select a mountain corridor below to inspect elevation profiles across Gilgit, Hunza, Skardu, Deosai, and Khunjerab Pass.
                </p>
              </div>

              <div className="space-y-2">
                {KARAKORAM_WAYPOINTS.map((wp, idx) => {
                  const active = idx === active3DWaypoint;
                  return (
                    <button
                      key={wp.id || wp.name || `wp-${idx}`}
                      type="button"
                      onClick={() => setActive3DWaypoint(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                        active
                          ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                          : 'bg-gray-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className={`text-sm font-bold ${active ? 'text-white' : 'text-slate-900'}`}>
                          {wp.name}
                        </div>
                        <div className={`text-xs font-semibold ${active ? 'text-emerald-100' : 'text-slate-600'}`}>
                          {wp.subtitle || wp.region}
                        </div>
                      </div>
                      <span
                        className={`font-mono-num text-xs font-bold shrink-0 px-2.5 py-1 rounded-xl ${
                          active ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {wp.elevation}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 relative">
              <Karakoram3DCanvas
                activeWaypointIndex={active3DWaypoint}
                onSelectWaypoint={setActive3DWaypoint}
              />
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCES & TOUR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Tailored Travel Styles</span>
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Experiences &amp; Tour Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {INITIAL_EXPERIENCES.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-lg shadow-slate-900/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{exp.subtitle}</span>
                </span>
                <h3 className="font-display text-lg font-bold tracking-tight text-slate-900">
                  {exp.title}
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{exp.description}</p>
              </div>
              <Link
                to="/contact"
                className="w-full py-2.5 px-4 text-xs md:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Inquire for this style</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE BAIG TREKS & TOURS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-900/5 space-y-6">
          <div className="max-w-2xl space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Regional Expertise
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Why Travel With Baig Treks &amp; Tours
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: 'Local Gilgit-Baltistan Knowledge',
                desc: 'Authentic route planning across Hunza, Skardu, Fairy Meadows, Deosai, Shigar, and Khaplu informed by real regional conditions.',
              },
              {
                title: 'Customized Private & Group Itineraries',
                desc: 'Every trip is tailored around your travel dates, group size, accommodation preferences, and pace.',
              },
              {
                title: 'Dependable Mountain Logistics',
                desc: 'Coordinated transport, experienced mountain drivers, and 4x4 jeeps for high-altitude valleys.',
              },
              {
                title: 'Direct WhatsApp & Phone Support',
                desc: `Reach our team directly on WhatsApp or phone (${business.phone}) before and during your journey.`,
              },
              {
                title: 'Transparent Booking & JazzCash',
                desc: `Confirm availability first and pay securely via official JazzCash (${business.jazzcashNumber} — ${business.jazzcashName}).`,
              },
              {
                title: 'Safety-First Seasonal Guidance',
                desc: 'Honest advice on road accessibility, weather windows, and altitude preparation.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 md:p-5 rounded-3xl bg-gray-50 border border-slate-200 space-y-2"
              >
                <div className="w-8 h-8 rounded-2xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  0{idx + 1}
                </div>
                <h3 className="font-display text-base md:text-lg font-bold tracking-tight text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAVEL GUIDES */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Visual Stories &amp; Guides
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Gilgit-Baltistan Travel Guides
            </h2>
          </div>
          <Link
            to="/travel-guides"
            className="w-full sm:w-auto py-2.5 px-5 text-sm font-bold text-center text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Read All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {blogPosts.slice(0, 3).map((post, idx) => (
            <article
              key={post.id || post.slug || `post-${idx}`}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg shadow-slate-900/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                <div className="p-4 md:p-5 space-y-2">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {post.category} · {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-slate-900 leading-snug">
                    <Link
                      to={`/travel-guides/${post.slug}`}
                      className="hover:text-emerald-800 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-600 font-medium line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
              <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2">
                <Link
                  to={`/travel-guides/${post.slug}`}
                  className="w-full py-2.5 px-4 text-xs md:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            Helpful Information
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const faqKey = faq.id || `faq-${idx}`;
            const isOpen = openFaqId === faqKey;
            return (
              <div
                key={faqKey}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faqKey)}
                  className="w-full px-4 md:px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-display text-sm sm:text-base font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 md:px-6 pb-4 text-sm md:text-base text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CUSTOM TOUR INQUIRY & JAZZCASH SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-5 space-y-5 bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-900/5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Direct Booking Support
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Start Planning With Baig Treks &amp; Tours
              </h2>
              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                Reach out on WhatsApp, phone, or email, or submit the trip inquiry form for a customized itinerary.
              </p>
            </div>

            <div className="space-y-2.5 text-sm">
              <a
                href={heroWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white shrink-0" />
                <div>
                  <div className="text-xs text-white/90 font-semibold">WhatsApp Direct</div>
                  <div className="font-mono-num font-bold text-white">{business.phone}</div>
                </div>
              </a>

              <a
                href={`tel:+92${business.phone.replace(/^0/, '')}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs text-slate-700 font-semibold">Phone Call</div>
                  <div className="font-mono-num font-bold text-slate-900">{business.phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${business.email}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-colors break-all"
              >
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs text-slate-700 font-semibold">Email</div>
                  <div className="font-bold text-slate-900">{business.email}</div>
                </div>
              </a>
            </div>

            {/* Official JazzCash Box */}
            <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>JazzCash Payment Details</span>
              </div>
              <div className="text-sm font-medium text-slate-800">
                Account / Number:{' '}
                <span className="font-mono-num font-bold text-slate-900">
                  {business.jazzcashNumber}
                </span>
              </div>
              <div className="text-sm font-medium text-slate-800">
                Account Name: <span className="font-bold text-slate-900">{business.jazzcashName}</span>
              </div>
              <p className="text-xs text-slate-700 font-medium pt-1">
                {business.paymentInstructions}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InquiryFormSection />
          </div>
        </div>
      </section>
    </div>
  );
};
