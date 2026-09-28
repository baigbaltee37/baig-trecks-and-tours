import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MessageCircle,
  Bookmark,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Mountain,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VISUAL_ASSETS } from '../data/initialData';
import { buildTourWhatsAppMessage, buildWhatsAppLink } from '../config/business';
import { InquiryFormSection, TourCard } from '../components/InteractiveMapAndScroll';
import { TOUR_SLUG_ALIASES } from '../components/SEOHead';

export const TourDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingSectionRef = useRef<HTMLDivElement>(null);

  const {
    tours,
    blogPosts,
    business,
    user,
    profile,
    privateInfo,
    isAdmin,
    toggleSaveTour,
    submitBookingRequest,
  } = useApp();

  const resolvedSlug = slug ? TOUR_SLUG_ALIASES[slug] || slug : '';
  const tour = tours.find(
    (t) => t.slug === resolvedSlug || t.id === resolvedSlug || t.slug === slug || t.id === slug
  );

  const [bookingName, setBookingName] = useState(user?.name || profile?.displayName || '');
  const [bookingEmail, setBookingEmail] = useState(privateInfo?.email || user?.email || '');
  const [bookingWhatsapp, setBookingWhatsapp] = useState(privateInfo?.phone || user?.phone || '');
  const [bookingDates, setBookingDates] = useState('');
  const [bookingTravelers, setBookingTravelers] = useState(2);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [highlightBookingBox, setHighlightBookingBox] = useState(false);

  useEffect(() => {
    if (user) {
      setBookingName(user.name || user.displayName || '');
      setBookingEmail(user.email || '');
      setBookingWhatsapp(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      if (!user && !isAdmin) {
        navigate(`/login?redirect=${encodeURIComponent(`/tours/${slug}?book=true`)}`, {
          replace: true,
        });
        return;
      }
      setHighlightBookingBox(true);
      setTimeout(() => {
        bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [searchParams, user, isAdmin, slug, navigate]);

  if (!tour) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Tour Package Not Found
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          The requested tour could not be found. Browse our active Pakistan and Gilgit-Baltistan tours below.
        </p>
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tours</span>
        </Link>
      </div>
    );
  }

  const isSaved = Boolean(profile?.savedTourIds?.includes(tour.id));
  const waUrl = buildWhatsAppLink(
    buildTourWhatsAppMessage(tour.title, business.name),
    business.whatsapp
  );

  const relatedGuides = (tour.relatedGuideSlugs || [])
    .map((gSlug) => blogPosts.find((p) => p.slug === gSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const otherTours = tours.filter((t) => t.id !== tour.id).slice(0, 3);

  const handleBookNowAction = () => {
    if (!user && !isAdmin) {
      const returnUrl = `/tours/${tour.slug}?book=true`;
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }
    setHighlightBookingBox(true);
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !isAdmin) {
      const returnUrl = `/tours/${tour.slug}?book=true`;
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }
    if (!bookingName.trim() || !bookingWhatsapp.trim()) return;
    setBookingLoading(true);
    try {
      await submitBookingRequest({
        customerName: bookingName,
        email: user?.email || bookingEmail || 'admin@baigtreks.com',
        whatsapp: bookingWhatsapp,
        tourId: tour.id,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        tourImage: tour.imageUrl,
        pricePerPerson: tour.pricePerPerson,
        travelDates: bookingDates || 'Flexible dates',
        travelers: Number(bookingTravelers) || 1,
        notes: bookingNotes,
      });
      setBookingSubmitted(true);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16 overflow-x-hidden">
      {/* Header & Banner Image */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/tours" className="hover:text-emerald-700 transition-colors">
              Tours
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {tour.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-2xl">
              <Mountain className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customizable Private &amp; Group Route</span>
            </span>
            {user && (
              <button
                type="button"
                onClick={() => toggleSaveTour(tour.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  isSaved
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>{isSaved ? 'Saved' : 'Save Tour'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{tour.destination}</span>
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{tour.duration}</span>
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{tour.tourType}</span>
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              {tour.title}
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleBookNowAction}
            className="w-full md:w-auto px-6 py-3 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Now</span>
          </motion.button>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[16/9] sm:aspect-[21/9] shadow-xl">
          <img
            src={tour.imageUrl || VISUAL_ASSETS.heroKarakoram}
            alt={`${tour.title} — ${tour.destination} Tour Package by Baig Treks and Tours`}
            referrerPolicy="no-referrer"
            className="w-full h-auto min-h-full object-cover"
          />
        </div>
      </section>

      {/* Main Content + Sticky Booking Sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          {/* Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div>
              <div className="text-xs font-semibold text-slate-700">Departure Location</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {tour.startingLocation || 'Configurable per group'}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700">Group Size</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {tour.groupSize || 'Private or Group'}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700">Difficulty</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {tour.difficulty || 'Easy to Moderate'}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700">Best Season</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {tour.bestSeason || 'April to October'}
              </div>
            </div>
          </div>

          {/* Overview & Route Summary */}
          <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Tour Overview &amp; Route
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
              {tour.overview}
            </p>
            {tour.routeSummary && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">Primary Route Corridor</div>
                <p className="text-sm text-slate-700 font-semibold">{tour.routeSummary}</p>
              </div>
            )}
            {tour.destinationsCovered && tour.destinationsCovered.length > 0 && (
              <div className="pt-1 space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  Destinations Visited (Click to Read Destination Guide)
                </div>
                <div className="flex flex-wrap gap-2">
                  {tour.destinationsCovered.map((dc) => (
                    <Link
                      key={dc.slug}
                      to={`/destinations/${dc.slug}`}
                      className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-900 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{dc.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Day-by-Day Itinerary */}
          <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Day-by-Day Itinerary
            </h2>
            {tour.itinerary && tour.itinerary.length > 0 ? (
              <div className="space-y-3">
                {tour.itinerary.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1"
                  >
                    <div className="text-xs font-bold text-slate-900">
                      {day.dayTitle || day.dayNumber || `Day ${idx + 1}`} · {day.route}
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{day.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200 space-y-2.5">
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  To ensure your journey matches current seasonal road conditions, flight or overland departure preferences, and your group’s available days, <strong>{business.name}</strong> prepares a tailored day-by-day schedule upon inquiry or booking.
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Request personalized day-by-day plan on WhatsApp ({business.phone})</span>
                </a>
              </div>
            )}
          </section>

          {/* Transport, Accommodation & Meals */}
          <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Transport, Accommodation &amp; Meals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 font-medium">
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">Transport</div>
                <p>
                  {tour.transportation ||
                    'Private vehicle tailored to your group size, plus local 4x4 jeeps for off-road side valleys where applicable.'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">Accommodation</div>
                <p>
                  {tour.accommodation ||
                    'Hotel and guesthouse stays selected and confirmed with you based on your preferred comfort tier.'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">Meals</div>
                <p>
                  {tour.mealsInfo ||
                    'Meal inclusions (breakfast or half-board) are configurable according to your chosen package tier.'}
                </p>
              </div>
            </div>
          </section>

          {/* Inclusions & Exclusions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Inclusions</span>
              </div>
              {tour.inclusions && tour.inclusions.length > 0 ? (
                <ul className="space-y-2 text-sm text-slate-600 font-medium">
                  {tour.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Inclusions (private transport, fuel/tolls, hotel category, meals, and 4x4 jeeps) are customized and written into your confirmed booking quote.
                </p>
              )}
            </div>

            <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <XCircle className="w-4 h-4 text-slate-500" />
                <span>Exclusions</span>
              </div>
              {tour.exclusions && tour.exclusions.length > 0 ? (
                <ul className="space-y-2 text-sm text-slate-600 font-medium">
                  {tour.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-500">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Personal expenses, optional entry/boating tickets, and items not specified in your written confirmation are excluded.
                </p>
              )}
            </div>
          </section>

          {/* Step-by-Step Booking Process */}
          <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              How to Book This Tour Package
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white text-xs font-bold">
                  Step 1
                </span>
                <h3 className="font-bold text-slate-900">Share Dates &amp; Group Size</h3>
                <p className="text-slate-600 font-medium text-xs leading-relaxed">
                  Submit an online inquiry or message us on WhatsApp ({business.phone}) with your travel dates, number of travelers, and departure city.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white text-xs font-bold">
                  Step 2
                </span>
                <h3 className="font-bold text-slate-900">Review Custom Itinerary &amp; Quote</h3>
                <p className="text-slate-600 font-medium text-xs leading-relaxed">
                  Our team confirms seasonal road conditions, hotel options, transport, and total package pricing for your group.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white text-xs font-bold">
                  Step 3
                </span>
                <h3 className="font-bold text-slate-900">Confirm Reservation</h3>
                <p className="text-slate-600 font-medium text-xs leading-relaxed">
                  Lock in your booking via our official JazzCash account ({business.jazzcashNumber} — {business.jazzcashName}) after date verification.
                </p>
              </div>
            </div>
          </section>

          {/* Tour FAQs */}
          {tour.faqs && tour.faqs.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Frequently Asked Questions About This Tour
                </h2>
              </div>
              <div className="space-y-3">
                {tour.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1"
                  >
                    <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inquiry Form */}
          <InquiryFormSection defaultTourSlug={tour.slug} defaultDestination={tour.destination} />
        </div>

        {/* Right 4 Columns: Pricing & Book Now Flow + Related Guides */}
        <aside
          ref={bookingSectionRef}
          className="lg:col-span-4 space-y-6 lg:sticky lg:top-24"
        >
          <div
            className={`p-4 sm:p-6 rounded-3xl bg-white border transition-all duration-300 shadow-xl space-y-5 ${
              highlightBookingBox
                ? 'border-emerald-600 ring-4 ring-emerald-500/15'
                : 'border-slate-200'
            }`}
          >
            <div className="space-y-1.5 border-b border-slate-100 pb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800">
                <Mountain className="w-3.5 h-3.5 text-emerald-600" />
                <span>Package Pricing &amp; Booking</span>
              </span>
              {tour.pricePerPerson > 0 ? (
                <div className="space-y-1 pt-1">
                  <div className="font-mono-num text-2xl font-bold text-slate-900">
                    PKR {tour.pricePerPerson.toLocaleString()}{' '}
                    <span className="text-xs text-slate-600 font-semibold">/ person</span>
                  </div>
                  {tour.couplePrice > 0 && (
                    <div className="text-xs text-slate-600 font-medium">
                      Couple Package:{' '}
                      <span className="font-mono-num font-bold text-slate-900">
                        PKR {tour.couplePrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-1">
                  <div className="font-display text-lg font-bold text-slate-900">
                    Contact us for current pricing
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Rates depend on travel dates, group size, and hotel tier.
                  </p>
                </div>
              )}
            </div>

            {/* Book Now Section: Requires Login First */}
            {!user && !isAdmin ? (
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200 space-y-3">
                <div className="text-sm font-bold text-slate-900">
                  Book This Tour Online
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Please log in or create an account first to book <strong>{tour.title}</strong> and track it in your My Bookings page.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleBookNowAction}
                  className="w-full py-3 px-4 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-sm"
                >
                  Login to Book Now
                </motion.button>
              </div>
            ) : bookingSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-slate-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Booking Saved to Your Account!</span>
                </div>
                <p className="leading-relaxed text-slate-700 font-medium">
                  Your reservation for <strong>{tour.title}</strong> has been saved. You can view it anytime in <strong>My Bookings</strong>.
                </p>
                <Link
                  to="/my-bookings"
                  className="w-full py-2.5 px-4 text-xs font-bold bg-emerald-700 text-white rounded-xl block text-center"
                >
                  Go to My Bookings
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Book Now ({user?.email || 'Admin'})</span>
                </div>
                <input
                  type="text"
                  required
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <input
                  type="tel"
                  required
                  value={bookingWhatsapp}
                  onChange={(e) => setBookingWhatsapp(e.target.value)}
                  placeholder="WhatsApp / Phone Number *"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDates}
                      onChange={(e) => setBookingDates(e.target.value)}
                      className="w-full px-3 py-2 rounded-2xl bg-gray-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Travelers *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={bookingTravelers}
                      onChange={(e) => setBookingTravelers(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-2xl bg-gray-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Hotel preference or special requests..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-gray-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3 px-4 text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-2xl shadow-sm transition-all"
                >
                  {bookingLoading ? 'Saving Booking...' : 'Confirm & Save Booking'}
                </motion.button>
              </form>
            )}

            {/* Direct WhatsApp Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Chat on WhatsApp ({business.phone})</span>
            </a>

            {/* Official JazzCash Instructions */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5 text-xs">
              <div className="text-amber-900 font-bold">JazzCash Payment</div>
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
              <p className="text-slate-600 pt-1 leading-relaxed">
                {business.paymentInstructions}
              </p>
            </div>
          </div>

          {/* Related Travel Guides in Sidebar */}
          {relatedGuides.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h2 className="font-display text-base font-bold text-slate-900">
                  Planning Guides for This Route
                </h2>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                {relatedGuides.map((g) => (
                  <li key={g.id}>
                    <Link
                      to={`/guides/${g.slug}`}
                      className="block p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-slate-200/80 text-slate-800 hover:text-emerald-800 transition-colors"
                    >
                      <div className="font-bold leading-snug">{g.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{g.readTime}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Other Tour Packages Section */}
      {otherTours.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              More Pakistan &amp; Northern Areas Tour Packages
            </h2>
            <Link
              to="/tours"
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
            >
              <span>All Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {otherTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
