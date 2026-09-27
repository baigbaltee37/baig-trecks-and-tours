import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  ArrowRight,
  MessageCircle,
  Compass,
  CheckCircle2,
  Edit3,
  Trash2,
  Star,
  MapPin,
  Calendar,
  Users,
  Mountain,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TourItem, VISUAL_ASSETS } from '../data/initialData';
import { buildWhatsAppLink } from '../config/business';

export const TourCard: React.FC<{ tour: TourItem }> = ({ tour }) => {
  const {
    business,
    user,
    profile,
    isAdmin,
    toggleSaveTour,
    deleteTourAdmin,
    submitBookingRequest,
  } = useApp();
  const navigate = useNavigate();
  const isSaved = Boolean(profile?.savedTourIds?.includes(tour.id));

  // 3D Tilt State on Hover
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [travelDates, setTravelDates] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 7,
      rotateY: x * 7,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Book Now Flow: If not logged in -> redirect to /login with return URL; if logged in -> open booking modal
  const handleBookNowClick = () => {
    if (!user && !isAdmin) {
      const returnUrl = `/tours/${tour.slug}?book=true`;
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }
    setPhoneInput(user?.phone || '');
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitBookingRequest({
        customerName: user?.name || user?.displayName || 'Traveler',
        email: user?.email || 'admin@baigtreks.com',
        whatsapp: phoneInput || user?.phone || business.phone,
        tourId: tour.id,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        tourImage: tour.imageUrl,
        pricePerPerson: tour.pricePerPerson,
        travelDates: travelDates || 'Flexible 2026 Dates',
        travelers: Number(travelers) || 1,
        notes,
      });
      setBookingSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformPerspective: 1000,
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        className="group bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg shadow-slate-900/5 hover:shadow-xl hover:border-emerald-500/40 transition-shadow duration-300"
      >
        <div>
          {/* Image Container with Zoom on Hover, Price Badge & Star Rating */}
          <div className="relative overflow-hidden bg-slate-100 aspect-[4/3]">
            <img
              src={tour.imageUrl || VISUAL_ASSETS.heroKarakoram}
              alt={`${tour.title} — ${tour.destination} in Gilgit-Baltistan`}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-auto min-h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />

            {/* Top Left Location & Optional Badge */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-semibold px-3 py-1 rounded-2xl shadow-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{tour.destination}</span>
              </span>
              {tour.badge && (
                <span className="bg-emerald-800/95 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-2xl shadow-xs">
                  {tour.badge}
                </span>
              )}
            </div>

            {/* Save / Wishlist Button */}
            {user && (
              <button
                type="button"
                onClick={() => toggleSaveTour(tour.id)}
                aria-label={isSaved ? 'Remove from saved tours' : 'Save tour'}
                className={`absolute top-3 right-3 p-2 rounded-2xl border transition-all duration-200 ${
                  isSaved
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white/90 backdrop-blur-md text-slate-700 border-white/60 hover:bg-white'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Price Badge & Star Rating on Image Bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-sm">
                {tour.pricePerPerson > 0
                  ? `PKR ${tour.pricePerPerson.toLocaleString()}`
                  : 'Custom Quote'}
              </span>
              <span className="bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-2xl flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>4.9</span>
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 md:p-5 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>{tour.duration}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>{tour.tourType}</span>
              </span>
            </div>

            <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-snug">
              <Link
                to={`/tours/${tour.slug}`}
                className="hover:text-emerald-700 transition-colors"
              >
                {tour.title}
              </Link>
            </h3>

            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {tour.shortDescription}
            </p>
          </div>
        </div>

        {/* Card Footer — Full Width Buttons on Mobile */}
        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={`/tours/${tour.slug}`}
                className="w-full py-2.5 px-3 text-sm font-semibold text-center text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-2xl transition-colors block"
              >
                View Details
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleBookNowClick}
              className="w-full py-2.5 px-3 text-sm font-semibold text-center bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-2xl shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Inline Admin Controls visible when isAdmin=true */}
          {isAdmin && (
            <div className="pt-2.5 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <Link
                to={`/admin?editTour=${encodeURIComponent(tour.id)}`}
                className="w-full sm:flex-1 py-2 px-3 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit in Admin</span>
              </Link>
              <button
                type="button"
                onClick={() => deleteTourAdmin(tour.id)}
                className="w-full sm:w-auto py-2 px-3 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-2xl flex items-center justify-center gap-1 transition-colors"
                title="Delete Tour"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </motion.article>

      {/* Instant Book Now Modal when Logged In */}
      <AnimatePresence>
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>

              {bookingSuccess ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Tour Booked Successfully!
                  </h3>
                  <p className="text-sm text-slate-600">
                    Your booking for <strong className="text-slate-900">{tour.title}</strong> has been saved to your account.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <Link
                      to="/my-bookings"
                      onClick={() => setBookingModalOpen(false)}
                      className="w-full py-2.5 px-4 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-center"
                    >
                      View My Bookings
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingModalOpen(false)}
                      className="w-full py-2.5 px-4 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div className="pr-8">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Mountain className="w-3.5 h-3.5" /> Instant Tour Reservation
                    </span>
                    <h3 className="font-display text-xl font-bold text-slate-900 mt-0.5">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Booking as <strong className="text-slate-800">{user?.email || 'admin@baigtreks.com'}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Travel Dates *
                    </label>
                    <input
                      type="date"
                      required
                      value={travelDates}
                      onChange={(e) => setTravelDates(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Travelers *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        required
                        value={travelers}
                        onChange={(e) => setTravelers(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="03155449778"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Requests / Notes
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Departure city, hotel preference, etc."
                      className="w-full px-3.5 py-2 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-2xl shadow-md"
                  >
                    {submitting ? 'Saving Booking...' : 'Confirm & Save Booking'}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Journey through Gilgit-Baltistan
const SCROLL_JOURNEY_STOPS = [
  {
    step: '01',
    name: 'Hunza Valley',
    subtitle: 'Terraced Valleys & Karakoram Giants',
    description:
      'Begin in Karimabad surrounded by Rakaposhi and Ultar Sar, ancient heritage forts, and panoramic viewpoints across the Hunza River.',
    image: VISUAL_ASSETS.heroKarakoram,
    slug: 'hunza',
  },
  {
    step: '02',
    name: 'Attabad Lake & Passu Cones',
    subtitle: 'Turquoise Glacial Waters & Cathedral Peaks',
    description:
      'Cruise across the vivid turquoise waters of Attabad Lake before following the Karakoram Highway to the dramatic jagged spires of Passu and Hussaini Suspension Bridge.',
    image: VISUAL_ASSETS.attabadPassu,
    slug: 'attabad-lake',
  },
  {
    step: '03',
    name: 'Khunjerab Pass',
    subtitle: 'High-Altitude Border Corridor',
    description:
      'Ascend through Khunjerab National Park along paved alpine switchbacks to the snow-rimmed Pakistan-China border plateau.',
    image: VISUAL_ASSETS.attabadPassu,
    slug: 'khunjerab-pass',
  },
  {
    step: '04',
    name: 'Skardu & Cold Desert',
    subtitle: 'Confluence of the Indus & Shigar Rivers',
    description:
      'Enter Baltistan’s gateway valley where high-altitude cold desert dunes meet tranquil mountain lakes and centuries-old rock forts.',
    image: VISUAL_ASSETS.skarduValley,
    slug: 'skardu',
  },
  {
    step: '05',
    name: 'Deosai Plains & Khaplu',
    subtitle: 'High-Altitude Plateau & Heritage Palaces',
    description:
      'Cross the sweeping alpine meadows and crystal streams of Deosai before exploring the apricot orchards and royal heritage of Khaplu Valley.',
    image: VISUAL_ASSETS.deosaiPlains,
    slug: 'deosai-plains',
  },
];

export const CinematicDestinationScroller: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentStop = SCROLL_JOURNEY_STOPS[activeIndex] || SCROLL_JOURNEY_STOPS[0];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 md:p-8 shadow-xl shadow-slate-900/5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Mountain className="w-3.5 h-3.5" />
              <span>Signature Route Preview</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Journey Through Gilgit-Baltistan
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Select each stop below to explore how our road trips and expeditions connect the iconic valleys, lakes, and mountain passes of Northern Pakistan.
            </p>

            <div className="relative rounded-3xl overflow-hidden border border-slate-200 aspect-[16/10] bg-slate-100 shadow-lg">
              <img
                src={currentStop.image}
                alt={`${currentStop.name} — Gilgit-Baltistan`}
                referrerPolicy="no-referrer"
                className="w-full h-auto min-h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                <div className="text-xs font-semibold text-emerald-300">
                  Stop {currentStop.step} · {currentStop.subtitle}
                </div>
                <div className="font-display text-xl md:text-2xl font-bold tracking-tight">
                  {currentStop.name}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                  {currentStop.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            {SCROLL_JOURNEY_STOPS.map((stop, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={stop.step}
                  onClick={() => setActiveIndex(idx)}
                  className={`cursor-pointer p-4 md:p-5 rounded-3xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-50/80 border-emerald-600 shadow-sm'
                      : 'bg-gray-50/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                          isActive
                            ? 'bg-emerald-800 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {stop.step}
                      </span>
                      <div>
                        <h3 className="font-display text-base md:text-lg font-bold tracking-tight text-slate-900">
                          {stop.name}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500">{stop.subtitle}</p>
                      </div>
                    </div>
                    <Link
                      to={`/destinations/${stop.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs md:text-sm font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// Interactive Map of Gilgit-Baltistan
const MAP_COORDINATES: Record<string, { x: number; y: number }> = {
  hunza: { x: 48, y: 24 },
  'attabad-lake': { x: 53, y: 21 },
  'passu-cones': { x: 55, y: 17 },
  'khunjerab-pass': { x: 61, y: 9 },
  gilgit: { x: 39, y: 34 },
  'nagar-valley': { x: 47, y: 29 },
  'fairy-meadows': { x: 28, y: 48 },
  'nanga-parbat-base-camp': { x: 26, y: 54 },
  'astore-valley': { x: 36, y: 52 },
  'deosai-plains': { x: 49, y: 56 },
  skardu: { x: 60, y: 46 },
  'shigar-valley': { x: 65, y: 39 },
  'khaplu-valley': { x: 76, y: 45 },
  'basho-valley': { x: 54, y: 43 },
};

export const InteractiveGilgitBaltistanMap: React.FC = () => {
  const { destinations, tours, business } = useApp();
  const [selectedSlug, setSelectedSlug] = useState<string>('hunza');

  const activeDestination =
    destinations.find((d) => d.slug === selectedSlug) || destinations[0];

  const matchingTours = tours.filter(
    (t) =>
      activeDestination &&
      (t.destination.toLowerCase().includes(activeDestination.name.split(' ')[0].toLowerCase()) ||
        t.title.toLowerCase().includes(activeDestination.name.split(' ')[0].toLowerCase()))
  );

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Interactive Destination Map</span>
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Explore 14 Iconic Destinations
          </h2>
        </div>
        <p className="text-sm md:text-base text-slate-600 max-w-md">
          Tap any marker or destination below to inspect regional highlights and available tours.
        </p>
      </div>

      {/* Mobile-Friendly Quick Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {destinations.map((dest) => {
          const isSelected = dest.slug === activeDestination?.slug;
          return (
            <button
              key={dest.id}
              type="button"
              onClick={() => setSelectedSlug(dest.slug)}
              className={`px-3.5 py-2 rounded-2xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-500'
              }`}
            >
              {dest.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Topographical SVG Map */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[420px] shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-300 z-10 pb-2">
            <span className="flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Karakoram · Himalaya · Hindu Kush</span>
            </span>
            <span className="text-emerald-400 font-medium">Tap a Pin to Inspect</span>
          </div>

          <div className="relative w-full aspect-[16/11] my-auto">
            <svg
              viewBox="0 0 100 70"
              className="w-full h-full stroke-slate-700 fill-none"
              aria-label="Topographical Map of Gilgit-Baltistan"
            >
              <path d="M 5 20 Q 35 10, 65 18 T 95 15" strokeWidth="0.3" />
              <path d="M 8 35 Q 40 25, 70 35 T 95 30" strokeWidth="0.3" />
              <path d="M 10 50 Q 45 42, 75 52 T 96 48" strokeWidth="0.3" />
              <path
                d="M 22 65 C 32 50, 38 38, 48 24 C 53 20, 56 15, 61 9"
                stroke="#10B981"
                strokeWidth="0.6"
                strokeDasharray="1.5 1"
              />
              <path
                d="M 39 34 C 48 40, 54 44, 60 46 C 67 46, 72 45, 76 45"
                stroke="#F59E0B"
                strokeWidth="0.5"
                strokeDasharray="1.2 1.2"
              />
            </svg>

            {destinations.map((dest) => {
              const coords = MAP_COORDINATES[dest.slug] || { x: 50, y: 35 };
              const isSelected = activeDestination?.slug === dest.slug;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setSelectedSlug(dest.slug)}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
                  aria-label={`Select ${dest.name}`}
                >
                  <span
                    className={`flex items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? 'w-5 h-5 bg-amber-400 text-slate-900 ring-4 ring-amber-400/30 scale-110'
                        : 'w-3.5 h-3.5 bg-emerald-400 hover:bg-white ring-2 ring-slate-900'
                    }`}
                  />
                  <span
                    className={`hidden sm:block absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap pointer-events-none transition-opacity ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 opacity-100'
                        : 'bg-slate-900/90 text-white opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {dest.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800 z-10">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Selected Destination
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Available Stop
            </span>
          </div>
        </div>

        {/* Selected Destination Card */}
        {activeDestination && (
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl shadow-slate-900/5">
            <div>
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                <img
                  src={activeDestination.imageUrl || VISUAL_ASSETS.heroKarakoram}
                  alt={activeDestination.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto min-h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="text-xs font-semibold text-emerald-300">
                    {activeDestination.region} · Best Season: {activeDestination.bestSeason || 'April to October'}
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight">
                    {activeDestination.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-4">
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {activeDestination.description}
                </p>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-500">Key Attractions</div>
                  <p className="text-xs md:text-sm text-slate-700 font-medium">
                    {(activeDestination.attractions || ['Scenic Viewpoints', 'Mountain Panoramas']).join(' · ')}
                  </p>
                </div>

                {matchingTours.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="text-xs font-semibold text-slate-500">
                      Available Tours ({matchingTours.length})
                    </div>
                    <div className="space-y-1.5">
                      {matchingTours.slice(0, 2).map((t) => (
                        <Link
                          key={t.id}
                          to={`/tours/${t.slug}`}
                          className="p-2.5 rounded-2xl bg-gray-50 hover:bg-emerald-50/60 border border-slate-200/80 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
                        >
                          <span className="truncate pr-2">{t.title}</span>
                          <span className="text-emerald-700 shrink-0">{t.duration}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 md:p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                to={`/destinations/${activeDestination.slug}`}
                className="w-full py-2.5 px-4 text-sm font-semibold text-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl transition-colors"
              >
                Explore Guide
              </Link>
              <a
                href={buildWhatsAppLink(
                  `Hello ${business.name}, I am interested in visiting ${activeDestination.name} in Gilgit-Baltistan.`,
                  business.whatsapp
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-sm font-semibold text-center bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Custom Tour Inquiry Form
export const InquiryFormSection: React.FC<{ defaultTourSlug?: string; defaultDestination?: string }> = ({
  defaultTourSlug = '',
  defaultDestination = 'Hunza Valley',
}) => {
  const { submitInquiry, business, user, profile, privateInfo } = useApp();
  const [customerName, setCustomerName] = useState(profile?.displayName || '');
  const [email, setEmail] = useState(privateInfo?.email || user?.email || '');
  const [whatsapp, setWhatsapp] = useState(privateInfo?.phone || '');
  const [travelers, setTravelers] = useState(2);
  const [destination, setDestination] = useState(defaultDestination);
  const [preferredDates, setPreferredDates] = useState('');
  const [tourType, setTourType] = useState('Private Customized Tour');
  const [budget] = useState('Flexible / Request Quote');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!customerName.trim() || !whatsapp.trim()) {
      setErrorMsg('Please provide your name and WhatsApp / phone number.');
      return;
    }
    setSubmitting(true);
    try {
      await submitInquiry({
        customerName,
        email: email.trim() || 'not-provided@baigtreks.com',
        whatsapp,
        travelers: Number(travelers) || 1,
        destination,
        preferredDates: preferredDates || 'Flexible dates',
        tourType,
        budget,
        tourSlug: defaultTourSlug,
        message: message || `Inquiry for ${destination}`,
      });
      setSubmitted(true);
    } catch {
      setErrorMsg('Could not submit inquiry. Please use the WhatsApp button to message us.');
    } finally {
      setSubmitting(false);
    }
  };

  const directWaUrl = buildWhatsAppLink(
    `Hello ${business.name}, my name is ${customerName || 'a traveler'}. I want to plan a ${tourType} to ${destination} for ${travelers} travelers (${preferredDates || 'flexible dates'}). ${message}`,
    business.whatsapp
  );

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-900/5">
      {submitted ? (
        <div className="space-y-4 py-6 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Inquiry Received by {business.name}
          </h3>
          <p className="text-sm md:text-base text-slate-600">
            Your trip request for <strong className="text-slate-900">{destination}</strong> has been saved. Our team will respond via WhatsApp or email with a tailored itinerary.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 rounded-2xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Continue on WhatsApp ({business.phone})</span>
            </a>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="w-full sm:w-auto px-5 py-3 text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-2xl"
            >
              Send Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Custom Itinerary &amp; Quote Request</span>
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Plan Your Gilgit-Baltistan Trip
            </h3>
            <p className="text-sm text-slate-600">
              Share your travel preferences below or message us directly on WhatsApp at {business.phone}.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                WhatsApp / Phone Number *
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 03155449778"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              >
                <option value="Hunza Valley">Hunza Valley</option>
                <option value="Skardu & Baltistan">Skardu &amp; Baltistan</option>
                <option value="Hunza + Skardu Combined">Hunza + Skardu Combined</option>
                <option value="Fairy Meadows & Nanga Parbat">Fairy Meadows &amp; Nanga Parbat</option>
                <option value="Deosai & Astore Valley">Deosai &amp; Astore Valley</option>
                <option value="Khaplu & Shigar Valleys">Khaplu &amp; Shigar Valleys</option>
                <option value="Custom Multi-Valley Expedition">Custom Multi-Valley Expedition</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Number of Travelers
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Travel Dates / Month
              </label>
              <input
                type="text"
                value={preferredDates}
                onChange={(e) => setPreferredDates(e.target.value)}
                placeholder="e.g. May 15 - May 22 or Flexible"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Experience Type
              </label>
              <select
                value={tourType}
                onChange={(e) => setTourType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              >
                <option value="Private Customized Tour">Private Customized Tour</option>
                <option value="Family Holiday">Family Holiday</option>
                <option value="Honeymoon / Couple Tour">Honeymoon / Couple Tour</option>
                <option value="Group Tour">Group Tour</option>
                <option value="Trekking & Camping">Trekking &amp; Camping</option>
                <option value="Jeep Safari & Road Trip">Jeep Safari &amp; Road Trip</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Trip Notes or Special Requests
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us your departure city, hotel preference, or places you want to include..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-2xl shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting Request...' : 'Send Trip Inquiry'}
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Instant WhatsApp Quote</span>
            </motion.a>
          </div>
        </form>
      )}
    </div>
  );
};
