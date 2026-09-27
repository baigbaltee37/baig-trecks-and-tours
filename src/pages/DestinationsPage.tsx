import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildWhatsAppLink } from '../config/business';
import {
  TourCard,
  InteractiveGilgitBaltistanMap,
  CinematicDestinationScroller,
} from '../components/InteractiveMapAndScroll';

export const DestinationsPage: React.FC = () => {
  const { destinations, business } = useApp();

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
          Journey Through Gilgit-Baltistan
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          DESTINATIONS OF NORTHERN PAKISTAN
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
          Explore the valleys, alpine lakes, mountain passes, and high plateaus of Gilgit-Baltistan.
        </p>
      </div>

      {/* Interactive Map */}
      <InteractiveGilgitBaltistanMap />

      {/* All 14 Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => {
          const waUrl = buildWhatsAppLink(
            `Hello ${business.name}, I would like to inquire about visiting ${dest.name}.`,
            business.whatsapp
          );
          return (
            <article
              key={dest.id}
              className="bg-[#111722] border border-white/10 hover:border-white/25 rounded-xl overflow-hidden flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#0B0F14]">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111722] via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#CBD5E1]">
                    <span>{dest.region}</span>
                    <span className="font-mono-num text-[#D4AF37]">{dest.elevation}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="text-[11px] text-[#0EA5E9] font-medium">
                    {dest.isConfirmedTourOffering
                      ? `Active ${business.name} Tour Destination`
                      : 'Regional Destination · Custom Route Available'}
                  </div>
                  <h2 className="font-display text-xl font-bold text-white">
                    <Link
                      to={`/destinations/${dest.slug}`}
                      className="hover:text-[#0EA5E9] transition-colors"
                    >
                      {dest.name}
                    </Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {dest.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                <Link
                  to={`/destinations/${dest.slug}`}
                  className="py-2.5 px-3 text-xs font-semibold text-center bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  Explore
                </Link>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 text-xs font-semibold text-center bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Cinematic Scroll Sequence */}
      <div className="pt-8 border-t border-white/10 space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Route Sequence: From Hunza to Fairy Meadows
        </h2>
        <CinematicDestinationScroller />
      </div>
    </div>
  );
};

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { destinations, tours, business } = useApp();

  const dest = destinations.find((d) => d.slug === slug || d.id === slug);

  if (!dest) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-white">Destination Not Found</h1>
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Destinations
        </Link>
      </div>
    );
  }

  const relatedTours = tours.filter(
    (t) =>
      t.destination.toLowerCase().includes(dest.name.toLowerCase().split(' ')[0]) ||
      t.title.toLowerCase().includes(dest.name.toLowerCase().split(' ')[0])
  );

  const waUrl = buildWhatsAppLink(
    `Hello ${business.name}, I would like to plan a trip to ${dest.name}. Please send available tour options and current details.`,
    business.whatsapp
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <Link
        to="/destinations"
        className="inline-flex items-center gap-1.5 text-xs text-[#CBD5E1] hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All Gilgit-Baltistan Destinations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
            <span>{dest.region}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">Elevation {dest.elevation}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            {dest.name}
          </h1>
          <p className="text-base text-[#CBD5E1] leading-relaxed">{dest.description}</p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Inquire About {dest.name} on WhatsApp
            </a>
            <Link
              to="/contact"
              className="px-5 py-3 text-xs font-semibold bg-white/10 text-white rounded-lg"
            >
              Request Custom Itinerary
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 aspect-[16/10] rounded-xl overflow-hidden border border-white/15">
          <img
            src={dest.imageUrl}
            alt={dest.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-white/10">
        <h2 className="font-display text-2xl font-bold text-white">
          Tours Featuring {dest.name}
        </h2>
        {relatedTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-[#CBD5E1]">
              {dest.name} can be included in any custom private or group tour. Contact {business.name} for current information.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Plan Custom Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
