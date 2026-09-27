import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  ArrowRight,
  Search,
  Compass,
  ShieldCheck,
  ChevronDown,
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
  const { business, tours, destinations, reviews, gallery, blogPosts, faqs } = useApp();

  // Section 9: Tour Search & Filter State
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
    `Hello ${business.name}, I visited your website and would like to plan a trip to Gilgit-Baltistan.`,
    business.whatsapp
  );

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 01 — HERO: EXPERIENCE THE MAJESTIC BEAUTY OF GILGIT-BALTISTAN */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={VISUAL_ASSETS.heroKarakoram}
            alt="Karakoram mountains and Hunza Valley in Gilgit-Baltistan, Pakistan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14]/95 via-[#0B0F14]/75 to-[#0B0F14]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-[#0B0F14]/40" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
              <span>{business.locationLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-[#E2E8F0]">DIRECT: {business.phone}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              {business.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed max-w-2xl">
              {business.heroDescription}
            </p>

            {/* Primary, Secondary, and Third CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                to="/tours"
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold bg-[#0EA5E9] text-[#0B0F14] hover:bg-[#38BDF8] rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <span>EXPLORE TOURS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#plan-your-journey"
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap"
              >
                PLAN YOUR TRIP
              </a>

              <a
                href={heroWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CHAT ON WHATSAPP</span>
              </a>
            </div>

            {/* Quiet Unboxed Editorial Metadata */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#CBD5E1]">
              <span>MOUNTAINS</span>
              <span aria-hidden="true">·</span>
              <span>ADVENTURE</span>
              <span aria-hidden="true">·</span>
              <span>CULTURE</span>
              <span aria-hidden="true">·</span>
              <span>ROAD TRIPS</span>
              <span aria-hidden="true">·</span>
              <span>GILGIT-BALTISTAN</span>
              <span aria-hidden="true">·</span>
              <span>DISCOVERY</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — SEARCH: FIND YOUR PERFECT JOURNEY */}
      <section id="search-tours" className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-[#111722] border border-white/15 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
                01. Discover &amp; Filter Packages
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                FIND YOUR PERFECT JOURNEY
              </h2>
            </div>
            <div className="text-xs text-[#94A3B8] font-mono-num">
              Showing {filteredTours.length} matching {filteredTours.length === 1 ? 'journey' : 'journeys'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Destination Filter */}
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="All">All Gilgit-Baltistan Destinations</option>
                {[
                  'Hunza',
                  'Skardu',
                  'Gilgit',
                  'Fairy Meadows',
                  'Naltar',
                  'Khaplu',
                  'Shigar',
                  'Astore',
                  'Ghizer',
                  'Passu',
                ].map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="All">Any Duration</option>
                <option value="1-3 Days">1–3 Days</option>
                <option value="4-6 Days">4–6 Days</option>
                <option value="7-10 Days">7–10 Days</option>
                <option value="10+ Days">10+ Days</option>
              </select>
            </div>

            {/* Tour Type Filter */}
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Tour Type
              </label>
              <select
                value={selectedTourType}
                onChange={(e) => setSelectedTourType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="All">All Tour Types</option>
                {[
                  'Family Holidays',
                  'Honeymoon Tours',
                  'Adventure Tours',
                  'Trekking',
                  'Cultural Trips',
                  'Road Trips',
                  'Group Tours',
                  'Private Tours',
                  'Custom Tours',
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Configurable Budget Filter */}
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Budget / Pricing Status
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="All">All Packages (Custom &amp; Published)</option>
                <option value="Inquiry">Custom Quote via Inquiry</option>
                <option value="Priced">Published PKR Rate</option>
              </select>
            </div>
          </div>

          {/* Dynamic Filtered Results Preview if user filtered */}
          {(selectedDestination !== 'All' ||
            selectedDuration !== 'All' ||
            selectedTourType !== 'All' ||
            selectedBudget !== 'All') && (
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#CBD5E1]">Filtered Search Results</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDestination('All');
                    setSelectedDuration('All');
                    setSelectedTourType('All');
                    setSelectedBudget('All');
                  }}
                  className="text-xs text-[#0EA5E9] hover:underline"
                >
                  Reset Filters
                </button>
              </div>
              {filteredTours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-lg bg-[#0B0F14] border border-white/10 text-center space-y-3">
                  <p className="text-sm text-[#CBD5E1]">
                    No pre-packaged tour matches that exact filter combination yet. {business.name} builds custom itineraries for all Gilgit-Baltistan valleys.
                  </p>
                  <a
                    href={buildWhatsAppLink(
                      `Hello ${business.name}, I am looking for a ${selectedTourType !== 'All' ? selectedTourType : 'tour'} in ${selectedDestination !== 'All' ? selectedDestination : 'Gilgit-Baltistan'} (${selectedDuration !== 'All' ? selectedDuration : 'flexible duration'}).`,
                      business.whatsapp
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Request This Exact Route on WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 03 — FEATURED TOURS: JOURNEYS WORTH REMEMBERING */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
              02. Featured Journeys
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              JOURNEYS WORTH REMEMBERING
            </h2>
          </div>
          <Link
            to="/tours"
            className="text-xs font-semibold text-[#0EA5E9] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>VIEW ALL TOUR PACKAGES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      {/* 04 — INTERACTIVE 3D & MAP JOURNEY: JOURNEY THROUGH THE MOUNTAINS */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              03. Spatial Elevation &amp; Route Explorer
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              JOURNEY THROUGH THE MOUNTAINS
            </h2>
          </div>
          <p className="text-sm text-[#94A3B8] max-w-md">
            Inspect the 3D Karakoram relief and explore our interactive 14-point Gilgit-Baltistan destination atlas below.
          </p>
        </div>

        {/* 3D Mountain Terrain Experience */}
        <Karakoram3DCanvas
          activeWaypointIndex={active3DWaypoint}
          onSelectWaypoint={setActive3DWaypoint}
        />

        {/* Interactive 14-Marker Gilgit-Baltistan Map */}
        <InteractiveGilgitBaltistanMap />
      </section>

      {/* 05 — DESTINATIONS: EXPLORE THE NORTH */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
              04. Journey Through Gilgit-Baltistan
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              EXPLORE THE NORTH
            </h2>
          </div>
          <Link
            to="/destinations"
            className="text-xs font-semibold text-[#0EA5E9] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>VIEW ALL 14 DESTINATIONS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cinematic Scroll-Driven Destination Sequence */}
        <CinematicDestinationScroller />
      </section>

      {/* 06 — CINEMATIC STORY: MORE THAN A DESTINATION */}
      <section className="bg-[#0E141D] border-y border-white/10 py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              05. Editorial Perspective
            </div>
            <div className="font-display text-5xl sm:text-6xl font-extrabold text-white leading-[0.95] tracking-tight">
              <div>FIND</div>
              <div className="text-[#0EA5E9]">YOUR</div>
              <div>NORTH.</div>
            </div>
            <h2 className="font-editorial italic text-2xl sm:text-3xl text-[#E2E8F0]">
              More Than a Destination — A Living Mountain Landscape
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Where the Karakoram, Hindukush, and western Himalayas converge, every bend in the road reveals glacial valleys, suspension bridges, terraced villages, and centuries of mountain hospitality. {business.name} connects travelers with authentic routes across Gilgit-Baltistan.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/about"
                className="px-5 py-3 text-xs font-semibold bg-white text-[#0B0F14] hover:bg-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap"
              >
                ABOUT {business.name.toUpperCase()}
              </Link>
              <a
                href={heroWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-xs font-semibold border border-white/20 text-white hover:border-white/40 rounded-lg transition-colors whitespace-nowrap"
              >
                SPEAK WITH OUR TEAM
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
              <img
                src={VISUAL_ASSETS.attabadPassu}
                alt="Attabad Lake and Passu Cones in Upper Hunza"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
              <img
                src={VISUAL_ASSETS.fairyMeadows}
                alt="Fairy Meadows and Nanga Parbat"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-2 p-6 rounded-xl bg-[#111722] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                  Travel With Local Knowledge
                </div>
                <p className="text-sm text-[#CBD5E1]">
                  Mountain weather, seasonal pass openings, and valley logistics planned around your group.
                </p>
              </div>
              <Link
                to="/contact"
                className="px-4 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg whitespace-nowrap shrink-0"
              >
                Plan Custom Route
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — EXPERIENCES: CHOOSE YOUR ADVENTURE */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
              06. Tour Experiences
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              CHOOSE YOUR ADVENTURE
            </h2>
          </div>
          <Link
            to="/experiences"
            className="text-xs font-semibold text-[#0EA5E9] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>EXPLORE ALL 8 CATEGORIES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INITIAL_EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.id}
              className="group bg-[#111722] border border-white/10 hover:border-white/25 rounded-xl overflow-hidden flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="relative h-40 overflow-hidden bg-[#0B0F14]">
                  <img
                    src={exp.imageUrl}
                    alt={exp.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111722] via-black/30 to-transparent" />
                  <div className="absolute bottom-2.5 left-4 text-xs font-mono-num text-[#D4AF37]">
                    0{idx + 1}. {exp.subtitle}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-display text-base font-bold text-white">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-4 pt-2">
                <Link
                  to={`/tours?type=${encodeURIComponent(exp.tourTypeFilter)}`}
                  className="text-xs font-semibold text-[#0EA5E9] hover:text-white flex items-center gap-1.5"
                >
                  <span>Browse {exp.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 08 — WHY BAIG TRECKS & TOURS: TRAVEL WITH CONFIDENCE */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            07. Why {business.name}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            TRAVEL WITH CONFIDENCE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-3">
            <div className="text-xs font-mono-num text-[#0EA5E9] font-semibold">
              01. REGIONAL ROUTE PLANNING
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Tailored Gilgit-Baltistan Logistics
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Every journey is planned around real seasonal road conditions, valley elevations, and your group’s preferred travel pace across Hunza, Skardu, Deosai, and Fairy Meadows.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-3">
            <div className="text-xs font-mono-num text-[#0EA5E9] font-semibold">
              02. DIRECT COMMUNICATION
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Instant WhatsApp &amp; Transparent Coordination
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Speak directly with {business.name} via WhatsApp ({business.phone}) or email ({business.email}) to confirm current pricing, vehicle options, and accommodation before booking.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-3">
            <div className="text-xs font-mono-num text-[#0EA5E9] font-semibold">
              03. VERIFIED PAYMENT &amp; RESERVATION FLOW
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Clear 4-Step Booking Process
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              We never display automated fake payment confirmations. Availability and final package rates are confirmed directly with you prior to seat reservation via official JazzCash details.
            </p>
          </div>
        </div>
      </section>

      {/* 09 — REVIEWS: WHAT OUR TRAVELERS SAY (Strictly Non-Fabricated) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
              08. Traveler Perspectives
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              WHAT OUR TRAVELERS SAY
            </h2>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-xl bg-[#111722] border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                    <span className="font-mono-num text-[#D4AF37]">
                      Rating: {rev.rating}.0 / 5.0
                    </span>
                    <span>{rev.verified ? 'Verified Traveler Review' : rev.source}</span>
                  </div>
                  <p className="text-sm text-[#E2E8F0] leading-relaxed">"{rev.reviewText}"</p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{rev.customerName}</span>
                  <span className="text-[#94A3B8]">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[#111722] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Authentic Feedback Policy
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Verified Traveler Reviews &amp; Testimonials
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {business.name} only publishes verified customer reviews and authentic traveler photographs. Contact {business.name} for current references or connect with us on Instagram ({business.instagram[0]?.handle} &amp; {business.instagram[1]?.handle}).
              </p>
            </div>
            <a
              href={business.instagram[1]?.url || 'https://www.instagram.com/baig_treks_and_tours/'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 text-xs font-semibold bg-white/10 hover:bg-white/15 text-white rounded-lg whitespace-nowrap flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-[#D4AF37]" />
              View @baig_treks_and_tours
            </a>
          </div>
        )}
      </section>

      {/* 10 — GALLERY: THE NORTH THROUGH OUR LENS */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
              09. Visual Archive
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              THE NORTH THROUGH OUR LENS
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-semibold text-[#0EA5E9] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>OPEN FULLSCREEN GALLERY</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {gallery.slice(0, 5).map((img, index) => {
            const spanClass =
              index === 0
                ? 'lg:col-span-7 aspect-[16/10]'
                : index === 1
                ? 'lg:col-span-5 aspect-[16/10]'
                : 'lg:col-span-4 aspect-[4/3]';
            return (
              <Link
                key={img.id}
                to="/gallery"
                className={`group relative rounded-xl overflow-hidden border border-white/10 bg-[#0E1520] ${spanClass}`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.altText}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 space-y-0.5">
                  <div className="text-[11px] text-[#D4AF37]">
                    {img.destination} · {img.category}
                  </div>
                  <div className="text-xs font-medium text-white line-clamp-1">
                    {img.caption}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 11 — TRAVEL GUIDES: PLAN YOUR JOURNEY */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
              10. Travel Guides &amp; Dispatch
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              PLAN YOUR JOURNEY
            </h2>
          </div>
          <Link
            to="/travel-guides"
            className="text-xs font-semibold text-[#0EA5E9] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>READ ALL TRAVEL GUIDES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts
            .filter((p) => p.published)
            .slice(0, 4)
            .map((post) => (
              <article
                key={post.id}
                className="bg-[#111722] border border-white/10 hover:border-white/25 rounded-xl overflow-hidden flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#0B0F14]">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <span>{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white leading-snug">
                      <Link
                        to={`/travel-guides/${post.slug}`}
                        className="hover:text-[#0EA5E9] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2">
                  <Link
                    to={`/travel-guides/${post.slug}`}
                    className="text-xs font-semibold text-[#0EA5E9] hover:text-white flex items-center gap-1.5"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* 12 — CUSTOM TRIP: YOUR JOURNEY. YOUR WAY. + INSTAGRAM SECTION */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#111927] to-[#0E1726] border border-white/15 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              11. Bespoke Gilgit-Baltistan Expeditions
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              YOUR JOURNEY. YOUR WAY.
            </h2>
            <p className="text-sm sm:text-base text-[#CBD5E1] max-w-2xl leading-relaxed">
              Traveling with family, planning a private honeymoon, or organizing a corporate or university road trip? Tell {business.name} your dates, group size, and preferred valleys, and we will build a custom itinerary around your schedule.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
            <a
              href={buildWhatsAppLink(
                `Hello ${business.name}, I would like to plan a custom tour to Gilgit-Baltistan. Here are my preferred dates and group details:`,
                business.whatsapp
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              PLAN WITH US ON WHATSAPP
            </a>
          </div>
        </div>

        {/* Section 36: FOLLOW THE JOURNEY (Official Instagram Accounts) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8">
          <div className="md:col-span-5 space-y-2">
            <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Official Social Channels
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              FOLLOW THE JOURNEY
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Follow our official Instagram accounts for mountain dispatches, road updates, and scenes from across Gilgit-Baltistan.
            </p>
          </div>
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {business.instagram.map((ig) => (
              <a
                key={ig.handle}
                href={ig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl bg-[#0B0F14] border border-white/10 hover:border-[#D4AF37]/60 transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Instagram className="w-4 h-4 text-[#D4AF37]" />
                    <span>{ig.handle}</span>
                  </div>
                  <div className="text-xs text-[#94A3B8]">{ig.label}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Section 39) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
            12. Essential Information
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#111722] border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <span className="font-display text-sm sm:text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#94A3B8] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#0EA5E9]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 13 — CONTACT: LET'S PLAN YOUR JOURNEY */}
      <section id="plan-your-journey" className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
                13. Direct Inquiry &amp; Consultation
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                LET&apos;S PLAN YOUR JOURNEY
              </h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Send us your travel preferences using the inquiry form or reach out directly on WhatsApp or email. Our team responds with current route information, availability, and custom pricing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#94A3B8]">WHATSAPP &amp; PHONE</div>
                  <div className="font-mono-num text-base font-bold text-white mt-0.5">
                    {business.phone}
                  </div>
                </div>
                <a
                  href={heroWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg whitespace-nowrap"
                >
                  CHAT ON WHATSAPP
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#94A3B8]">EMAIL</div>
                  <div className="text-sm font-semibold text-white mt-0.5 break-all">
                    {business.email}
                  </div>
                </div>
                <a
                  href={`mailto:${business.email}`}
                  className="px-4 py-2 text-xs font-semibold bg-white/10 text-white hover:bg-white/15 rounded-lg whitespace-nowrap"
                >
                  EMAIL US
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#111722] border border-white/10 space-y-2">
                <div className="text-xs text-[#94A3B8]">JAZZCASH PAYMENT DETAILS</div>
                <div className="text-xs text-[#CBD5E1]">
                  Account / Number:{' '}
                  <span className="font-mono-num text-[#D4AF37] font-semibold">
                    {business.jazzcashNumber}
                  </span>{' '}
                  · Account Name:{' '}
                  <span className="text-white font-semibold">{business.jazzcashName}</span>
                </div>
              </div>
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
