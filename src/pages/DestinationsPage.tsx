import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageCircle, ArrowRight, ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildWhatsAppLink } from '../config/business';
import { TourCard, InquiryFormSection } from '../components/InteractiveMapAndScroll';
import { VISUAL_ASSETS } from '../data/initialData';

export const DestinationsPage: React.FC = () => {
  const { destinations, business } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 overflow-x-hidden">
      <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gilgit-Baltistan Destination Directory</span>
        </span>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Explore 14 Iconic Destinations
        </h1>
        <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
          From the terraced orchards of Hunza and the turquoise glacial waters of Attabad Lake to the alpine meadows of Deosai and Skardu Valley.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {destinations.map((dest, idx) => {
          const waUrl = buildWhatsAppLink(
            `Hello Baig Treks & Tours, I would like to plan a tour to ${dest.name} in Gilgit-Baltistan.`,
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
                    alt={dest.name}
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
                    {(dest.attractions || ['Scenic Viewpoints', 'Mountain Panoramas']).join(' · ')}
                  </div>
                </div>
              </div>

              <div className="px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  to={`/destinations/${dest.slug}`}
                  className="w-full py-2.5 px-3 text-sm font-bold text-center bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl transition-colors"
                >
                  Explore Guide
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
  const { destinations, tours, business } = useApp();

  const destination = destinations.find((d) => d.slug === slug || d.id === slug);

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

  const relatedTours = tours.filter(
    (t) =>
      t.destination.toLowerCase().includes(destination.name.split(' ')[0].toLowerCase()) ||
      t.title.toLowerCase().includes(destination.name.split(' ')[0].toLowerCase())
  );

  const waUrl = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I want to plan a trip to ${destination.name} in Gilgit-Baltistan.`,
    business.whatsapp
  );

  return (
    <div className="space-y-12 pb-16 overflow-x-hidden">
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 space-y-5">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>All Destinations</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{destination.region} · Best Season: {destination.bestSeason || 'April to October'}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {destination.name}
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium max-w-2xl">
            {destination.shortDescription}
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[16/9] sm:aspect-[21/9] shadow-xl">
          <img
            src={destination.imageUrl || VISUAL_ASSETS.heroKarakoram}
            alt={destination.name}
            referrerPolicy="no-referrer"
            className="w-full h-auto min-h-full object-cover"
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              About {destination.name}
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
              {destination.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-slate-900">Key Attractions</div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {(destination.attractions || ['Scenic Viewpoints', 'Mountain Panoramas']).join(' · ')}
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-slate-900">Ideal For</div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {(destination.idealFor || ['Families', 'Couples', 'Adventure Travelers']).join(' · ')}
              </p>
            </div>
          </div>

          {relatedTours.length > 0 && (
            <div className="space-y-4 pt-2">
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                Tours Visiting {destination.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {relatedTours.map((t) => (
                  <TourCard key={t.id} tour={t} />
                ))}
              </div>
            </div>
          )}

          <InquiryFormSection defaultDestination={destination.name} />
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4">
            <h3 className="font-display text-lg font-bold tracking-tight text-slate-900">
              Plan Your Visit to {destination.name}
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {business.name} organizes private and group tours to {destination.name} with customized transport and accommodation.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};
