import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Phone,
  Mail,
  ArrowRight,
  Search,
  Compass,
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
  CheckCircle2,
  Sparkles,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Globe,
  Award,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VISUAL_ASSETS } from '../data/initialData';
import { buildWhatsAppLink } from '../config/business';
import {
  TourCard,
  InteractiveGilgitBaltistanMap,
  InquiryFormSection,
} from '../components/InteractiveMapAndScroll';

export const HomePage: React.FC = () => {
  const {
    business,
    tours,
    destinations,
    faqs,
    reviews,
    isAdmin,
    exportToursAsJson,
    signOut,
  } = useApp();

  // Hero Parallax Scroll Ref
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);

  // Tour Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedTourType, setSelectedTourType] = useState('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  // Gallery Interactive Preview State
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [activeLightboxImg, setActiveLightboxImg] = useState<number | null>(null);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        tour.title.toLowerCase().includes(q) ||
        tour.destination.toLowerCase().includes(q) ||
        tour.tourType.toLowerCase().includes(q) ||
        tour.shortDescription.toLowerCase().includes(q);

      const matchDest =
        selectedDestination === 'All' ||
        tour.destination.toLowerCase().includes(selectedDestination.toLowerCase()) ||
        tour.title.toLowerCase().includes(selectedDestination.toLowerCase());

      const matchDuration =
        selectedDuration === 'All' || tour.durationCategory === selectedDuration;

      const matchType =
        selectedTourType === 'All' ||
        tour.tourType.toLowerCase() === selectedTourType.toLowerCase();

      return matchQuery && matchDest && matchDuration && matchType;
    });
  }, [tours, searchQuery, selectedDestination, selectedDuration, selectedTourType]);

  const featuredTours = useMemo(() => {
    const list = tours.filter((t) => t.featured);
    return list.length > 0 ? list.slice(0, 4) : tours.slice(0, 4);
  }, [tours]);

  // Curated homepage gallery items featuring user's uploaded landscape photo first
  const homepageGalleryItems = useMemo(() => {
    const baseList = [
      {
        id: 'gal-hero-karakoram',
        title: 'Hunza Valley & Spired Karakoram Peaks',
        location: 'Hunza Valley',
        category: 'Hunza',
        elevation: '2,438 m',
        imageUrl: VISUAL_ASSETS.heroKarakoram,
        description: 'Majestic morning sunlight sweeping across the snow-clad towers and emerald terraced orchards of Hunza.',
      },
      {
        id: 'gal-attabad-passu',
        title: 'Attabad Lake & Passu Cones (Tupopdan)',
        location: 'Upper Hunza',
        category: 'Hunza',
        elevation: '2,559 m',
        imageUrl: VISUAL_ASSETS.attabadPassu,
        description: 'Vivid turquoise waters reflecting the jagged granite needles of the Passu cathedral spires.',
      },
      {
        id: 'gal-skardu-valley',
        title: 'Skardu, Indus River & Shangrila Resort',
        location: 'Baltistan',
        category: 'Skardu',
        elevation: '2,228 m',
        imageUrl: VISUAL_ASSETS.skarduValley,
        description: 'Where the Indus River widens into high alpine sand dunes and historic Balti heritage palaces.',
      },
      {
        id: 'gal-fairy-meadows',
        title: 'Fairy Meadows & Nanga Parbat Raikhot Face',
        location: 'Diamer',
        category: 'Trekking',
        elevation: '3,300 m',
        imageUrl: VISUAL_ASSETS.fairyMeadows,
        description: 'Lush alpine meadows beneath the towering 8,126-meter snow wall of Nanga Parbat, the Killer Mountain.',
      },
      {
        id: 'gal-deosai-plains',
        title: 'Deosai National Park — Land of Giants',
        location: 'Skardu / Astore',
        category: 'Skardu',
        elevation: '4,114 m',
        imageUrl: VISUAL_ASSETS.deosaiPlains,
        description: 'The second highest plateau on Earth, blossoming with wild summer flowers and crystal streams.',
      },
      {
        id: 'gal-khunjerab-pass',
        title: 'Khunjerab Pass Alpine Border',
        location: 'Khunjerab National Park',
        category: 'Hunza',
        elevation: '4,693 m',
        imageUrl: VISUAL_ASSETS.heroKarakoram,
        description: 'The highest paved international border crossing in the world along the legendary Karakoram Highway.',
      },
    ];

    if (galleryFilter === 'All') return baseList;
    return baseList.filter(
      (item) =>
        item.category.toLowerCase() === galleryFilter.toLowerCase() ||
        item.location.toLowerCase().includes(galleryFilter.toLowerCase())
    );
  }, [galleryFilter]);

  const heroWaLink = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I would like to plan a private trip in Northern Pakistan.`,
    business.whatsapp
  );

  return (
    <div className="space-y-16 md:space-y-24 pb-24 overflow-x-hidden bg-[#F8F6F0] text-[#252B27]">
      {/* ADMIN CONTROLS BAR (Visible when logged in as Admin) */}
      {isAdmin && (
        <div className="bg-[#102B24] text-white border-b border-[#174734] px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#C5A46D]">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Admin Active ({business.email})</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="px-3 py-1.5 text-xs font-semibold bg-[#C5A46D] text-[#0D2B20] hover:bg-[#B39158] rounded-full flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={exportToursAsJson}
                className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center gap-1.5 border border-white/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="px-3 py-1.5 text-xs font-medium bg-red-950/40 text-red-300 border border-red-500/30 hover:bg-red-900/40 rounded-full flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: BREATHTAKING CINEMATIC HERO SECTION
          - Large, natural landscape photo with subtle overlay
          - Headline: "Discover the Extraordinary North"
          - Supporting text: "Unforgettable journeys through the mountains, valleys, and hidden wonders of Northern Pakistan."
          - Dual CTAs: "Explore Our Tours" & "Plan Your Adventure"
          ========================================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-hidden"
      >
        {/* Background Landscape Photograph with Subtle, Natural Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.img
            style={{ y: parallaxY }}
            src={VISUAL_ASSETS.heroKarakoram}
            alt="Majestic Karakoram mountain peaks in Gilgit-Baltistan, Pakistan"
            className="w-full h-[120%] -mt-[10%] object-cover object-center filter brightness-[0.78] contrast-[1.05]"
          />
          {/* Subtle gradient overlay for pristine text readability without excessive darkening */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30" />
        </div>

        {/* Central Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-20 text-center space-y-6 sm:space-y-8">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase"
          >
            <Sparkles className="w-4 h-4 text-[#C5A46D]" />
            <span>Handcrafted Northern Pakistan Journeys</span>
          </motion.div>

          {/* Exact Requested Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold text-white tracking-tight leading-[1.05] drop-shadow-sm"
          >
            Discover the Extraordinary North
          </motion.h1>

          {/* Exact Requested Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-xs"
          >
            Unforgettable journeys through the mountains, valleys, and hidden wonders of Northern Pakistan with <strong className="font-semibold text-white">Baig Treks &amp; Tours</strong>.
          </motion.p>

          {/* Exact Requested Dual Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <a
              href="#featured-tours"
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold rounded-full bg-[#174734] hover:bg-[#0D2B20] text-white shadow-lg shadow-[#174734]/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Our Tours</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46D] group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#plan-trip"
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold rounded-full bg-white/20 hover:bg-white text-white hover:text-[#174734] backdrop-blur-md border border-white/60 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C5A46D]" />
              <span>Plan Your Adventure</span>
            </a>

            <a
              href={heroWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 text-sm font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </motion.div>

          {/* Trust Highlights Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-white/85"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
              <span>100% Native Mountain Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
              <span>Govt. DTS Licensed #786</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
              <span>Tailor-Made Private Itineraries</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C5A46D] fill-[#C5A46D]" />
              <span>4.9 / 5 Guest Satisfaction</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: REFINED TRAVEL SEARCH & FILTER CONSOLE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 md:-mt-14 relative z-20">
        <div className="bg-white border border-[#E8E4D9] rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#808D86] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Hunza, Skardu, Fairy Meadows, K2..."
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

            {/* Destination Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F6F0] border border-[#E8E4D9] rounded-2xl text-xs sm:text-sm text-[#252B27] focus:outline-none focus:border-[#174734] transition-colors"
              >
                <option value="All">All Destinations</option>
                <option value="Hunza">Hunza Valley</option>
                <option value="Skardu">Skardu &amp; Baltistan</option>
                <option value="Fairy Meadows">Fairy Meadows</option>
                <option value="Deosai">Deosai Plains</option>
                <option value="Naran">Naran Kaghan</option>
                <option value="Kashmir">Kashmir</option>
              </select>
            </div>

            {/* Duration Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F6F0] border border-[#E8E4D9] rounded-2xl text-xs sm:text-sm text-[#252B27] focus:outline-none focus:border-[#174734] transition-colors"
              >
                <option value="All">Any Duration</option>
                <option value="3-5 Days">3–5 Days</option>
                <option value="6-9 Days">6–9 Days</option>
                <option value="10+ Days">10+ Days</option>
              </select>
            </div>

            {/* Tour Type Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedTourType}
                onChange={(e) => setSelectedTourType(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F6F0] border border-[#E8E4D9] rounded-2xl text-xs sm:text-sm text-[#252B27] focus:outline-none focus:border-[#174734] transition-colors"
              >
                <option value="All">All Tour Styles</option>
                <option value="Cultural">Cultural &amp; Sightseeing</option>
                <option value="Trekking">Trekking &amp; Camping</option>
                <option value="Luxury">Luxury &amp; Honeymoon</option>
                <option value="Family">Family Holiday</option>
              </select>
            </div>
          </div>

          {/* Quick Destination Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E8E4D9]/60 text-xs text-[#5A655F]">
            <span className="font-semibold text-[#174734]">Popular Valleys:</span>
            {['All', 'Hunza', 'Skardu', 'Fairy Meadows', 'Deosai', 'Naran'].map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => setSelectedDestination(dest)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedDestination === dest
                    ? 'bg-[#174734] text-white shadow-xs'
                    : 'bg-[#F8F6F0] text-[#252B27] hover:bg-[#EAE6DB] border border-[#E8E4D9]'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FEATURED TOURS & TRAVEL PACKAGES
          ========================================================= */}
      <section id="featured-tours" className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E4D9] pb-5">
          <div className="space-y-2">
            <span className="eyebrow-badge eyebrow-gold">
              Handcrafted Itineraries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
              Featured Tours &amp; Expeditions
            </h2>
            <p className="text-sm md:text-base text-[#5A655F] max-w-xl">
              Curated private and small-group journeys tailored to immerse you in Northern Pakistan’s dramatic landscapes.
            </p>
          </div>
          <Link
            to="/tours"
            className="w-full sm:w-auto py-3 px-6 text-xs sm:text-sm font-semibold rounded-full bg-white hover:bg-[#F8F6F0] text-[#174734] border border-[#E8E4D9] shadow-xs inline-flex items-center justify-center gap-2 transition-all"
          >
            <span>View All {tours.length} Packages</span>
            <ArrowRight className="w-4 h-4 text-[#C5A46D]" />
          </Link>
        </div>

        {filteredTours.length === 0 ? (
          <div className="p-12 bg-white border border-[#E8E4D9] rounded-3xl text-center space-y-4">
            <p className="text-sm text-[#5A655F]">
              No tours match the selected criteria. Try adjusting your search query or filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDestination('All');
                setSelectedDuration('All');
                setSelectedTourType('All');
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold bg-[#174734] text-white rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(searchQuery ||
            selectedDestination !== 'All' ||
            selectedDuration !== 'All' ||
            selectedTourType !== 'All'
              ? filteredTours
              : featuredTours
            ).map((tour, idx) => (
              <TourCard key={tour.id || tour.slug || `tour-${idx}`} tour={tour} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 4: POPULAR DESTINATIONS SHOWCASE
          ========================================================================= */}
      <section id="destinations" className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E4D9] pb-5">
          <div className="space-y-2">
            <span className="eyebrow-badge">
              Legendary Valleys
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
              Explore Iconic Destinations
            </h2>
            <p className="text-sm md:text-base text-[#5A655F] max-w-xl">
              From the spired peaks of Hunza to the serene waters of Attabad and high silence of Deosai.
            </p>
          </div>
          <Link
            to="/destinations"
            className="w-full sm:w-auto py-3 px-6 text-xs sm:text-sm font-semibold rounded-full bg-white hover:bg-[#F8F6F0] text-[#174734] border border-[#E8E4D9] shadow-xs inline-flex items-center justify-center gap-2 transition-all"
          >
            <span>All {destinations.length} Destinations</span>
            <ArrowRight className="w-4 h-4 text-[#C5A46D]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 6).map((dest, idx) => (
            <motion.div
              key={dest.id || dest.slug || `dest-${idx}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <Link
                to={`/destinations/${dest.slug}`}
                className="group relative bg-white border border-[#E8E4D9] hover:border-[#174734]/30 rounded-2xl overflow-hidden flex flex-col justify-between h-full shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                  <img
                    src={dest.imageUrl || VISUAL_ASSETS.heroKarakoram}
                    alt={`${dest.name} — ${dest.region}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#174734] text-xs font-semibold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#174734]" />
                    <span>{dest.region}</span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">{dest.name}</h3>
                    <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A46D]" />
                      <span>Best Season: {dest.bestSeason || 'April to October'}</span>
                    </p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-[#5A655F] line-clamp-2 leading-relaxed">
                    {dest.shortDescription}
                  </p>
                  <div className="text-xs sm:text-sm font-semibold text-[#174734] inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Discover Valley Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHY TRAVEL WITH BAIG TREKS & TOURS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white border border-[#E8E4D9] rounded-3xl p-8 sm:p-12 shadow-md space-y-10">
          <div className="max-w-3xl space-y-3 border-b border-[#E8E4D9] pb-6">
            <span className="eyebrow-badge eyebrow-gold">
              Authentic Mountain Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
              Why Travel With Baig Treks &amp; Tours
            </h2>
            <p className="text-sm md:text-base text-[#5A655F] leading-relaxed">
              We are native mountain operators from Gilgit-Baltistan. We craft respectful, unhurried journeys guided by deep local knowledge, certified safety standards, and transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Mountain,
                title: 'Born in the Karakoram',
                desc: 'Deep roots across Hunza and Skardu. We know the seasons, hidden side-valleys, mountain passes, and local villages intimately.',
              },
              {
                icon: Sparkles,
                title: 'Tailor-Made Private Journeys',
                desc: 'Every itinerary is customized around your real dates, pace, comfort preferences, and photography aspirations.',
              },
              {
                icon: Shield,
                title: 'Govt. Licensed Operator',
                desc: 'Fully registered with the Department of Tourist Services (DTS #786), Govt. of Pakistan, adhering to verified safety regulations.',
              },
              {
                icon: Award,
                title: 'Transparent Direct Rates',
                desc: 'Direct local pricing with zero middleman markups. Clear line-by-line inclusions for vehicles, fuel, hotels, and guides.',
              },
              {
                icon: Compass,
                title: 'Certified 4x4 Mountain Fleet',
                desc: 'Reliable Prados, Land Cruisers, and Grand Cabins driven by veteran drivers with years of experience on the Karakoram Highway.',
              },
              {
                icon: Heart,
                title: 'Porter & Community Equity',
                desc: 'We support local porters and families with fair wages, medical coverage, and community-led eco-tourism practices.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#F8F6F0] border border-[#E8E4D9] rounded-2xl space-y-3 hover:border-[#174734]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#174734] shadow-xs">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#174734]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#5A655F] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: ABOUT US & LOCAL ROOTS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white border border-[#E8E4D9] rounded-3xl p-8 sm:p-12 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="eyebrow-badge">
              Our Mountain Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
              Rooted in the Mountains of Gilgit-Baltistan
            </h2>
            <div className="text-sm md:text-base text-[#5A655F] space-y-4 leading-relaxed">
              <p>
                Founded by <strong>Maisam Baig</strong>, an experienced native of Northern Pakistan, <strong>Baig Treks &amp; Tours</strong> was created to show travelers the true, authentic majesty of Pakistan's highest mountains.
              </p>
              <p>
                From the turquoise glacial waters of Attabad and Passu in Upper Hunza to the historic stone palaces of Khaplu and the silent heights of the Deosai plateau, our mission is to craft journeys that inspire, respect local communities, and create lifelong memories.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm">
              <div className="px-5 py-3 bg-[#F8F6F0] rounded-xl border border-[#E8E4D9]">
                <div className="font-bold text-[#174734] text-base">Skardu &amp; Gilgit</div>
                <div className="text-[#808D86] text-xs">Field Bases in GB</div>
              </div>
              <div className="px-5 py-3 bg-[#F8F6F0] rounded-xl border border-[#E8E4D9]">
                <div className="font-bold text-[#174734] text-base">10+ Years</div>
                <div className="text-[#808D86] text-xs">Alpine Experience</div>
              </div>
              <div className="px-5 py-3 bg-[#F8F6F0] rounded-xl border border-[#E8E4D9]">
                <div className="font-bold text-[#174734] text-base">100% Native</div>
                <div className="text-[#808D86] text-xs">Balti &amp; Hunza Guides</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-[#E8E4D9] shadow-lg">
              <img
                src={VISUAL_ASSETS.heroKarakoram}
                alt="Baig Treks & Tours landscape"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6.5: ORGANIC MOUNTAIN DRY FRUITS SPOTLIGHT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-[#102B24] text-white rounded-3xl p-8 sm:p-12 md:p-14 border border-[#174734] shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#C5A46D]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#C5A46D] border border-[#C5A46D]/30 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handpicked Mountain Harvest</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F8F6F0]">
                Premium Dry Fruits, Naturally Better
              </h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Discover quality dry fruits handpicked for freshness, taste, and everyday wellness. From Skardu Kaghzi walnuts and Hunza organic apricots to roasted Karakoram pistachios and Giri almonds — delivered fresh across Pakistan.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[#C5A46D] font-bold text-sm">100% Pure</div>
                  <div className="text-white/70 text-[11px]">Sun-Dried &amp; Organic</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[#C5A46D] font-bold text-sm">Nationwide</div>
                  <div className="text-white/70 text-[11px]">Delivery Across Pakistan</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <div className="text-[#C5A46D] font-bold text-sm">WhatsApp</div>
                  <div className="text-white/70 text-[11px]">Direct Order Prefilled</div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  to="/dry-fruits"
                  className="px-6 py-3.5 rounded-full bg-[#C5A46D] hover:bg-[#b5925a] text-[#0D2B20] font-bold text-sm shadow-md transition-all flex items-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0D2B20]" />
                  <span>Explore Dry Fruits Store</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/dry-fruits"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
                >
                  View Sample Prices
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80"
                  alt="Premium assorted dry fruits"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5">
                  <div className="text-[#C5A46D] text-xs font-semibold uppercase tracking-wider">
                    Fresh Harvest Selection
                  </div>
                  <div className="text-white font-serif text-lg font-bold">
                    Almonds · Walnuts · Pistachios · Dates · Figs
                  </div>
                  <div className="text-white/70 text-xs mt-1">
                    Sample prices starting from PKR 550 / 250g
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: INTERACTIVE GILGIT-BALTISTAN MAP
          ========================================================================= */}
      <section id="map-section" className="max-w-7xl mx-auto px-4 md:px-6 space-y-6 scroll-mt-24">
        <div className="space-y-2 border-b border-[#E8E4D9] pb-4">
          <span className="eyebrow-badge">
            Interactive Map
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
            Explore the Valleys of Gilgit-Baltistan
          </h2>
        </div>

        <InteractiveGilgitBaltistanMap />
      </section>

      {/* =========================================================================
          SECTION 8: PHOTOGRAPHY GALLERY WITH LIGHTBOX
          ========================================================================= */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E4D9] pb-5">
          <div className="space-y-2">
            <span className="eyebrow-badge eyebrow-gold">
              Captured Moments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
              Northern Pakistan Photography Gallery
            </h2>
            <p className="text-sm md:text-base text-[#5A655F] max-w-xl">
              Authentic views of the Karakoram, Himalaya, and Hindu Kush mountain ranges.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {['All', 'Hunza', 'Skardu', 'Trekking'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setGalleryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  galleryFilter === cat
                    ? 'bg-[#174734] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F8F6F0] text-[#252B27] border border-[#E8E4D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageGalleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              onClick={() => setActiveLightboxImg(idx)}
              className="group relative bg-white border border-[#E8E4D9] hover:border-[#174734]/30 rounded-2xl cursor-pointer overflow-hidden shadow-xs hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#174734] text-xs font-semibold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#174734]" />
                  <span>{item.location}</span>
                </div>
                <div className="absolute top-3 right-3 text-xs text-white font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {item.elevation}
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-bold leading-snug line-clamp-1">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightboxImg !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-6 right-6 p-2.5 text-white bg-white/10 hover:bg-white hover:text-[#174734] rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveLightboxImg((prev) =>
                  prev !== null
                    ? (prev - 1 + homepageGalleryItems.length) % homepageGalleryItems.length
                    : 0
                )
              }
              className="absolute left-4 sm:left-8 p-3 text-white bg-black/70 rounded-full hover:bg-white hover:text-[#174734] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveLightboxImg((prev) =>
                  prev !== null ? (prev + 1) % homepageGalleryItems.length : 0
                )
              }
              className="absolute right-4 sm:right-8 p-3 text-white bg-black/70 rounded-full hover:bg-white hover:text-[#174734] transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <img
                src={homepageGalleryItems[activeLightboxImg].imageUrl}
                alt={homepageGalleryItems[activeLightboxImg].title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 text-center text-white space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#C5A46D]">
                  {homepageGalleryItems[activeLightboxImg].title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
                  {homepageGalleryItems[activeLightboxImg].description}
                </p>
                <p className="text-xs text-white/60">
                  {homepageGalleryItems[activeLightboxImg].location} · Elevation: {homepageGalleryItems[activeLightboxImg].elevation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          SECTION 9: TESTIMONIALS / GUEST REVIEWS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        <div className="space-y-2 border-b border-[#E8E4D9] pb-4">
          <span className="eyebrow-badge eyebrow-gold">
            Traveler Feedback
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#174734] tracking-tight">
            What Our Travelers Say
          </h2>
          <p className="text-sm md:text-base text-[#5A655F] max-w-xl">
            Real feedback from guests who explored Northern Pakistan with Baig Treks &amp; Tours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white border border-[#E8E4D9] rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#C5A46D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A46D]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#252B27] leading-relaxed italic">
                  "{rev.reviewText}"
                </p>
              </div>
              <div className="pt-4 border-t border-[#E8E4D9] flex items-center justify-between text-xs">
                <div>
                  <div className="font-serif font-bold text-sm text-[#174734]">{rev.customerName}</div>
                  <div className="text-[#808D86] text-[11px]">{rev.dateText || rev.date || 'Verified Guest'}</div>
                </div>
                <span className="text-[11px] text-[#174734] font-semibold bg-[#F8F6F0] px-2.5 py-1 rounded-full border border-[#E8E4D9]">
                  Verified Tour
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section id="faq" className="max-w-4xl mx-auto px-4 md:px-6 space-y-6 scroll-mt-24">
        <div className="text-center space-y-2 border-b border-[#E8E4D9] pb-4">
          <span className="eyebrow-badge">
            Helpful Advice
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174734] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5A655F]">
            Common questions regarding visas, seasons, fitness levels, and custom packages.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
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
          SECTION 11: PLAN YOUR ADVENTURE / INQUIRY FORM
          ========================================================================= */}
      <section id="plan-trip" className="max-w-4xl mx-auto px-4 md:px-6 scroll-mt-24">
        <InquiryFormSection />
      </section>
    </div>
  );
};
