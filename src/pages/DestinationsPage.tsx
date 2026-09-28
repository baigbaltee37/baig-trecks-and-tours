import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Compass,
  BookOpen,
  Mountain,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildWhatsAppLink } from '../config/business';
import { TourCard, InquiryFormSection } from '../components/InteractiveMapAndScroll';
import { VISUAL_ASSETS } from '../data/initialData';
import { DESTINATION_SLUG_ALIASES } from '../components/SEOHead';

export const DestinationsPage: React.FC = () => {
  const { destinations, business } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10 overflow-x-hidden">
      <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
          <Link to="/" className="hover:text-emerald-700 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-bold">Destinations</span>
        </nav>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pakistan Northern Areas &amp; Destination Directory</span>
        </span>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Northern Pakistan Destinations &amp; Regional Guides
        </h1>
        <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
          Explore our destination guides and available tour packages for Hunza Valley, Skardu, Naran Kaghan, Kashmir (Neelum Valley), Fairy Meadows, Deosai Plains, and the wider Northern Areas of Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {destinations.map((dest, idx) => {
          const waUrl = buildWhatsAppLink(
            `Hello Baig Treks & Tours, I would like to plan a tour to ${dest.name}.`,
            business.whatsapp
          );
          return (
            <motion.article
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg shadow-slate-900/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={dest.imageUrl || VISUAL_ASSETS.heroKarakoram}
                    alt={`${dest.name} (${dest.region}) — Northern Pakistan Destination`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-auto min-h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-semibold px-3 py-1 rounded-2xl flex items-center gap-1 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{dest.region}</span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Season: {dest.bestSeason || 'April to October'}</span>
                    </div>
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      <Link
                        to={`/destinations/${dest.slug}`}
                        className="hover:text-emerald-300 transition-colors"
                      >
                        {dest.name}
                      </Link>
                    </h2>
                  </div>
                </div>

                <div className="p-4 md:p-5 space-y-3">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                    {dest.description}
                  </p>
                  <div className="text-xs text-slate-700 font-semibold">
                    <span className="text-slate-900 font-bold">Highlights: </span>
                    {(dest.attractions || ['Scenic Viewpoints', 'Mountain Panoramas']).slice(0, 4).join(' · ')}
                  </div>
                </div>
              </div>

              <div className="px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  to={`/destinations/${dest.slug}`}
                  className="w-full py-2.5 px-3 text-sm font-bold text-center bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl transition-colors"
                >
                  Explore {dest.name}
                </Link>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 text-sm font-bold text-center bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Inquire</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { destinations, tours, blogPosts, business } = useApp();

  const resolvedSlug = slug ? DESTINATION_SLUG_ALIASES[slug] || slug : '';
  const destination = destinations.find(
    (d) => d.slug === resolvedSlug || d.id === resolvedSlug || d.slug === slug || d.id === slug
  );

  if (!destination) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Destination Not Found
        </h1>
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-2xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Destinations</span>
        </Link>
      </div>
    );
  }

  const primaryKeyword = destination.name.split(' ')[0].toLowerCase();
  const relatedTours =
    destination.slug === 'northern-areas'
      ? tours
      : tours.filter(
          (t) =>
            t.destination.toLowerCase().includes(primaryKeyword) ||
            t.title.toLowerCase().includes(primaryKeyword) ||
            t.destinationsCovered?.some((dc) => dc.slug === destination.slug)
        );

  const relatedDestinations = (destination.relatedDestinationSlugs || [])
    .map((rSlug) => destinations.find((d) => d.slug === rSlug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const fallbackRelatedDestinations =
    relatedDestinations.length > 0
      ? relatedDestinations
      : destinations.filter((d) => d.slug !== destination.slug).slice(0, 5);

  const relatedGuides = (destination.relatedGuideSlugs || [])
    .map((gSlug) => blogPosts.find((p) => p.slug === gSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const fallbackGuides =
    relatedGuides.length > 0 ? relatedGuides : blogPosts.slice(0, 3);

  const waUrl = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I want to plan a trip to ${destination.name}. Please share itinerary options and booking details.`,
    business.whatsapp
  );

  return (
    <div className="space-y-12 pb-16 overflow-x-hidden">
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 space-y-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Link to="/" className="hover:text-emerald-700 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/destinations" className="hover:text-emerald-700 transition-colors">
            Destinations
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-bold">{destination.name}</span>
        </nav>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{destination.region} · Best Season: {destination.bestSeason || 'April to October'}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {destination.h1Title || `${destination.name} Tour Packages & Travel Guide`}
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[16/9] sm:aspect-[21/9] shadow-xl">
          <img
            src={destination.imageUrl || VISUAL_ASSETS.heroKarakoram}
            alt={`${destination.name} in ${destination.region} — Baig Treks and Tours`}
            referrerPolicy="no-referrer"
            className="w-full h-auto min-h-full object-cover"
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          {/* Introduction & Overview */}
          <section className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              About {destination.name}
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
              {destination.description}
            </p>
          </section>

          {/* Why Visit This Destination */}
          {destination.whyVisit && destination.whyVisit.length > 0 && (
            <section className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Why Visit {destination.name}
              </h2>
              <ul className="space-y-2.5 text-sm md:text-base text-slate-600 font-medium">
                {destination.whyVisit.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Main Attractions & Ideal Traveler Profiles */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <h2 className="font-display text-lg font-bold tracking-tight text-slate-900">
                Main Attractions in {destination.name}
              </h2>
              <ul className="space-y-1.5 text-sm text-slate-600 font-medium">
                {(destination.attractions || ['Scenic Viewpoints', 'Mountain Panoramas']).map(
                  (attr, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{attr}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <h2 className="font-display text-lg font-bold tracking-tight text-slate-900">
                Best Time to Visit &amp; Ideal For
              </h2>
              <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
                <p>
                  <strong className="text-slate-900">Best Season:</strong>{' '}
                  {destination.bestSeason || 'April to October'}
                </p>
                {destination.elevation && (
                  <p>
                    <strong className="text-slate-900">Elevation:</strong> {destination.elevation}
                  </p>
                )}
                <p>
                  <strong className="text-slate-900">Suitable For:</strong>{' '}
                  {(destination.idealFor || ['Families', 'Couples', 'Adventure Travelers']).join(' · ')}
                </p>
              </div>
            </div>
          </section>

          {/* Available Baig Treks and Tours Packages */}
          {relatedTours.length > 0 && (
            <section className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                    <Mountain className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Available Tour Packages</span>
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    {destination.name} Tour Packages by Baig Treks and Tours
                  </h2>
                </div>
                <Link
                  to="/tours"
                  className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Pakistan Tour Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {relatedTours.map((t) => (
                  <TourCard key={t.id} tour={t} />
                ))}
              </div>
            </section>
          )}

          {/* Duration, Transport, Accommodation & Pricing Details */}
          <section className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Practical Travel Information for {destination.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 font-medium leading-relaxed">
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">Recommended Duration</div>
                <p>
                  {destination.durationOptions ||
                    'Flexible duration (typically 4 to 7 days depending on your departure city and combined valleys).'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">Tour Pricing</div>
                <p>
                  Package rates depend on your travel dates, group size, vehicle type, and preferred hotel tier. Contact Baig Treks and Tours for an accurate custom quote.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">Transport &amp; Road Access</div>
                <p>
                  {destination.transportInfo ||
                    'Private air-conditioned road transport and local 4x4 mountain jeeps arranged according to route requirements.'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">Hotel &amp; Accommodation</div>
                <p>
                  {destination.accommodationInfo ||
                    'Accommodation options are customized and confirmed with your group prior to booking.'}
                </p>
              </div>
            </div>

            {destination.travelTips && destination.travelTips.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-slate-900">Important Travel Tips</div>
                <ul className="space-y-1.5 text-sm text-slate-600 font-medium">
                  {destination.travelTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Destination FAQs */}
          {destination.faqs && destination.faqs.length > 0 && (
            <section className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {destination.name} Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-3">
                {destination.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-gray-50 border border-slate-200/80 space-y-1.5"
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
          <InquiryFormSection defaultDestination={destination.name} />
        </div>

        {/* Right Sidebar: Booking CTA + Internal Links to Related Destinations & Guides */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Custom Trip Planning</span>
            </span>
            <h2 className="font-display text-lg font-bold tracking-tight text-slate-900">
              Plan Your Visit to {destination.name}
            </h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {business.name} organizes private family holidays, honeymoon trips, and group tours to {destination.name} with customized transport and accommodation.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp ({business.phone})</span>
            </a>
            <Link
              to="/contact"
              className="w-full py-2.5 px-4 text-xs font-bold text-center bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl block transition-colors"
            >
              Contact Baig Treks and Tours
            </Link>
          </div>

          {/* Related Destinations Internal Links */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              Related Northern Pakistan Destinations
            </h2>
            <ul className="space-y-2 text-sm font-medium">
              {fallbackRelatedDestinations.map((rel) => (
                <li key={rel.id}>
                  <Link
                    to={`/destinations/${rel.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-slate-200/80 text-slate-800 hover:text-emerald-800 transition-colors"
                  >
                    <span className="font-semibold">{rel.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Travel Guides Internal Links */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h2 className="font-display text-base font-bold text-slate-900">
                Helpful Travel Guides
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              {fallbackGuides.map((guide) => (
                <li key={guide.id}>
                  <Link
                    to={`/guides/${guide.slug}`}
                    className="block p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-slate-200/80 text-slate-800 hover:text-emerald-800 transition-colors"
                  >
                    <div className="font-bold leading-snug">{guide.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{guide.readTime}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
