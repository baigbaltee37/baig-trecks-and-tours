import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageCircle,
  Bookmark,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildTourWhatsAppMessage, buildWhatsAppLink } from '../config/business';
import { InquiryFormSection } from '../components/InteractiveMapAndScroll';

export const TourDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    tours,
    business,
    user,
    profile,
    privateInfo,
    toggleSaveTour,
    submitBookingRequest,
  } = useApp();

  const tour = tours.find((t) => t.slug === slug || t.id === slug);

  const [bookingDates, setBookingDates] = useState('');
  const [bookingTravelers, setBookingTravelers] = useState(2);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  if (!tour) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-white">Tour Package Not Found</h1>
        <p className="text-sm text-[#94A3B8]">
          Contact {business.name} for current information or browse all available journeys.
        </p>
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Tours
        </Link>
      </div>
    );
  }

  const isSaved = Boolean(profile?.savedTourIds?.includes(tour.id));
  const waLink = buildWhatsAppLink(
    buildTourWhatsAppMessage(tour.title, business.name),
    business.whatsapp
  );
  const pricingWaLink = buildWhatsAppLink(
    `Hello ${business.name}, please share the latest per-person, couple, and group pricing for the "${tour.title}".`,
    business.whatsapp
  );

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    if (!user) {
      setBookingError('Please log in or sign up to save a reservation request to your dashboard, or inquire directly via WhatsApp.');
      return;
    }
    try {
      await submitBookingRequest({
        customerName: profile?.displayName || user.displayName || 'Traveler',
        email: privateInfo?.email || user.email || '',
        whatsapp: privateInfo?.phone || business.phone,
        tourId: tour.id,
        tourTitle: tour.title,
        travelDates: bookingDates || 'Flexible dates (To be confirmed)',
        travelers: bookingTravelers,
        notes: bookingNotes || 'Submitted from tour page. Awaiting availability & final price confirmation.',
      });
      setBookingSuccess(true);
    } catch {
      setBookingError('Something went wrong. Please try again or contact us on WhatsApp.');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Tour Header Hero */}
      <section className="relative min-h-[54vh] flex items-end border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={tour.imageUrl}
            alt={tour.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/70 to-[#0B0F14]/30" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-4">
          <Link
            to="/tours"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#CBD5E1] hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Gilgit-Baltistan Tours
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#D4AF37]">
            <span>{tour.destination}</span>
            <span aria-hidden="true">·</span>
            <span>{tour.duration}</span>
            <span aria-hidden="true">·</span>
            <span>{tour.tourType}</span>
            {tour.badge && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-white">{tour.badge}</span>
              </>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white max-w-4xl">
            {tour.title}
          </h1>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#book-this-tour"
              className="px-6 py-3 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] hover:bg-[#38BDF8] rounded-lg transition-colors whitespace-nowrap"
            >
              BOOK THIS TOUR
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-xs font-semibold bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              INQUIRE ON WHATSAPP
            </a>
            {user && (
              <button
                type="button"
                onClick={() => toggleSaveTour(tour.id)}
                className="px-4 py-3 text-xs font-semibold bg-white/10 hover:bg-white/15 text-white rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Bookmark className="w-4 h-4" />
                {isSaved ? 'SAVED IN DASHBOARD' : 'SAVE TOUR'}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Main Content (8 Columns) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Section 11: Overview */}
          <section className="bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">
              01. Tour Overview
            </h2>
            <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              {tour.overview || `Contact ${business.name} for current information.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <div className="text-[#94A3B8]">Destination</div>
                <div className="text-white font-semibold mt-0.5">
                  {tour.destination || `Contact ${business.name} for current information.`}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8]">Duration</div>
                <div className="text-white font-semibold mt-0.5">
                  {tour.duration || `Contact ${business.name} for current information.`}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8]">Tour Type</div>
                <div className="text-white font-semibold mt-0.5">
                  {tour.tourType || `Contact ${business.name} for current information.`}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8]">Starting Location</div>
                <div className="text-white font-semibold mt-0.5">
                  {tour.startingLocation || `Contact ${business.name} for current information.`}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8]">Ending Location</div>
                <div className="text-white font-semibold mt-0.5">
                  {tour.endingLocation || `Contact ${business.name} for current information.`}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8]">Group Size</div>
                <div className="text-white font-semibold mt-0.5">
                  {tour.groupSize || `Contact ${business.name} for current information.`}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8]">Difficulty</div>
                <div className="text-white font-semibold mt-0.5">
                  {tour.difficulty || `Contact ${business.name} for current information.`}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8]">Best Season</div>
                <div className="text-white font-semibold mt-0.5">
                  {tour.bestSeason || `Contact ${business.name} for current information.`}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8]">Booking Status</div>
                <div className="text-[#D4AF37] font-semibold mt-0.5">
                  {tour.bookingStatus}
                </div>
              </div>
            </div>
          </section>

          {/* Section 12: Tour Itinerary */}
          <section className="bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">
              02. Day-by-Day Itinerary
            </h2>
            {tour.itinerary && tour.itinerary.length > 0 ? (
              <div className="space-y-4 border-l-2 border-[#0EA5E9]/40 pl-5">
                {tour.itinerary.map((day, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-[#0B0F14] border border-white/10 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono-num text-xs font-bold text-[#0EA5E9]">
                        {day.dayNumber || `DAY 0${idx + 1}`}
                      </span>
                      <span className="text-sm font-bold text-white">{day.route}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                      {day.description}
                    </p>
                    {(day.overnightLocation || day.meals || day.transportation) && (
                      <div className="flex flex-wrap gap-3 pt-2 text-[11px] text-[#94A3B8] border-t border-white/5">
                        {day.overnightLocation && <span>Overnight: {day.overnightLocation}</span>}
                        {day.meals && <span>Meals: {day.meals}</span>}
                        {day.transportation && <span>Transport: {day.transportation}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-lg bg-[#0B0F14] border border-white/10 space-y-3">
                <p className="text-sm text-[#E2E8F0]">
                  Detailed itinerary coming soon — contact {business.name} for the latest itinerary.
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Request Day-by-Day Itinerary on WhatsApp
                </a>
              </div>
            )}
          </section>

          {/* Section 13 & 14: What's Included & What's Not Included */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111722] border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-white">
                WHAT&apos;S INCLUDED
              </h2>
              {tour.inclusions && tour.inclusions.length > 0 ? (
                <ul className="space-y-2.5 text-sm text-[#CBD5E1]">
                  {tour.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  Inclusions (such as transport, hotel, breakfast, guide, or jeep rides) are tailored to your selected package tier. Contact {business.name} for current information.
                </p>
              )}
            </div>

            <div className="bg-[#111722] border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-white">
                WHAT&apos;S NOT INCLUDED
              </h2>
              {tour.exclusions && tour.exclusions.length > 0 ? (
                <ul className="space-y-2.5 text-sm text-[#CBD5E1]">
                  {tour.exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  Exclusions depend on your finalized package configuration. Contact {business.name} for current information.
                </p>
              )}
            </div>
          </section>

          {/* Section 15 & 16: Transportation & Accommodation */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111722] border border-white/10 rounded-xl p-6 space-y-3">
              <h2 className="font-display text-xl font-bold text-white">
                03. Transportation
              </h2>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {tour.transportation
                  ? tour.transportation
                  : `Contact ${business.name} for current information on confirmed vehicle options (such as Prado, Grand Cabin Hiace, or Saloon Coaster) for your group size.`}
              </p>
            </div>

            <div className="bg-[#111722] border border-white/10 rounded-xl p-6 space-y-3">
              <h2 className="font-display text-xl font-bold text-white">
                04. Accommodation
              </h2>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {tour.accommodation
                  ? tour.accommodation
                  : 'Accommodation details will be confirmed during booking.'}
              </p>
            </div>
          </section>

          {/* Section 19: HOW TO BOOK (4 Steps) */}
          <section className="bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">
              HOW TO BOOK
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-white/10 space-y-1.5">
                <div className="font-mono-num text-xs font-bold text-[#0EA5E9]">
                  01 — CHOOSE YOUR TOUR
                </div>
                <p className="text-xs text-[#CBD5E1]">
                  Select your preferred package or custom Gilgit-Baltistan valley route.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-white/10 space-y-1.5">
                <div className="font-mono-num text-xs font-bold text-[#0EA5E9]">
                  02 — CONTACT US
                </div>
                <p className="text-xs text-[#CBD5E1]">
                  Send your details through WhatsApp, email, or the inquiry form below.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-white/10 space-y-1.5">
                <div className="font-mono-num text-xs font-bold text-[#0EA5E9]">
                  03 — CONFIRM AVAILABILITY
                </div>
                <p className="text-xs text-[#CBD5E1]">
                  {business.name} confirms dates, availability, and final price.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-white/10 space-y-1.5">
                <div className="font-mono-num text-xs font-bold text-[#0EA5E9]">
                  04 — RESERVE YOUR SEAT
                </div>
                <p className="text-xs text-[#CBD5E1]">
                  Follow the company&apos;s current payment instructions once confirmed.
                </p>
              </div>
            </div>
          </section>

          {/* Package Inquiry Form */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              Send a Custom Inquiry for {tour.title}
            </h2>
            <InquiryFormSection
              defaultDestination={tour.destination}
              defaultTourSlug={tour.slug}
            />
          </section>
        </div>

        {/* Right Sticky Pricing & Booking Sidebar (4 Columns) */}
        <aside id="book-this-tour" className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          {/* Section 17: Pricing Card */}
          <div className="bg-[#111722] border border-white/15 rounded-xl p-6 space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Package Pricing
              </div>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                {tour.title}
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#CBD5E1]">PER PERSON</span>
                {tour.pricePerPerson > 0 ? (
                  <span className="font-mono-num font-bold text-[#D4AF37]">
                    PKR {tour.pricePerPerson.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-xs text-[#94A3B8]">Contact us for current pricing.</span>
                )}
              </div>

              <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#CBD5E1]">COUPLE</span>
                {tour.couplePrice > 0 ? (
                  <span className="font-mono-num font-bold text-[#D4AF37]">
                    PKR {tour.couplePrice.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-xs text-[#94A3B8]">Contact us for current pricing.</span>
                )}
              </div>

              <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#CBD5E1]">GROUP</span>
                <span className="text-xs text-[#E2E8F0]">
                  {tour.groupPriceNote || 'Contact for group pricing'}
                </span>
              </div>
            </div>

            {/* Section 18 & 60: Booking & WhatsApp CTAs */}
            <div className="space-y-2.5 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 text-xs font-semibold bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                INQUIRE ON WHATSAPP
              </a>
              <a
                href={pricingWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-xs font-semibold bg-white/10 text-white hover:bg-white/15 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                DISCUSS PRICING ON WHATSAPP
              </a>
            </div>

            {/* Section 45: Check Availability / Request Reservation to Customer Dashboard */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Calendar className="w-4 h-4 text-[#0EA5E9]" />
                <span>REQUEST SEAT RESERVATION</span>
              </div>

              {bookingSuccess ? (
                <div className="p-4 rounded-lg bg-[#0B0F14] border border-[#10B981]/40 space-y-3 text-xs">
                  <div className="text-[#10B981] font-semibold">
                    Reservation Inquiry Logged in Your Account
                  </div>
                  <p className="text-[#CBD5E1] leading-relaxed">
                    Status: <span className="font-semibold text-white">Pending Availability Confirmation</span>. Please message us on WhatsApp to finalize your dates and current rate before sending any payment.
                  </p>
                  <Link
                    to="/customer/dashboard"
                    className="inline-block text-[#0EA5E9] font-semibold hover:underline"
                  >
                    View in Customer Dashboard →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[#94A3B8] mb-1">
                      Preferred Dates
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingDates}
                      onChange={(e) => setBookingDates(e.target.value)}
                      placeholder="e.g. 15–20 Oct 2026"
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0F14] border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#94A3B8] mb-1">
                      Travelers
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={bookingTravelers}
                      onChange={(e) => setBookingTravelers(Number(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0F14] border border-white/15 text-xs text-white font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#94A3B8] mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Departure city or room preference"
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0F14] border border-white/15 text-xs text-white"
                    />
                  </div>
                  {bookingError && (
                    <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded">
                      {bookingError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] hover:bg-[#38BDF8] rounded-lg transition-colors whitespace-nowrap"
                  >
                    CHECK AVAILABILITY &amp; SAVE REQUEST
                  </button>
                </form>
              )}
            </div>

            {/* Section 2: Official JazzCash Payment Information (No fake auto-verification) */}
            <div className="p-4 rounded-lg bg-[#0B0F14] border border-white/10 space-y-1.5 text-xs">
              <div className="font-semibold text-white">JazzCash Payment</div>
              <div className="text-[#CBD5E1]">
                Account / Number:{' '}
                <span className="font-mono-num text-[#D4AF37] font-semibold">
                  {business.jazzcashNumber}
                </span>
              </div>
              <div className="text-[#CBD5E1]">
                Account Name:{' '}
                <span className="text-white font-semibold">{business.jazzcashName}</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] pt-1 leading-relaxed">
                {business.paymentInstructions}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
