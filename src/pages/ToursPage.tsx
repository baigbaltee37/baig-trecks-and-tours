import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageCircle, Search, Mountain } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TourCard } from '../components/InteractiveMapAndScroll';
import { buildWhatsAppLink } from '../config/business';

export const ToursPage: React.FC = () => {
  const { tours, business } = useApp();
  const [searchParams] = useSearchParams();

  const initialDest = searchParams.get('destination') || 'All';
  const [destinationFilter, setDestinationFilter] = useState(initialDest);
  const [durationFilter, setDurationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return tours.filter((tour) => {
      const matchesDest =
        destinationFilter === 'All' ||
        tour.destination.toLowerCase().includes(destinationFilter.toLowerCase()) ||
        tour.title.toLowerCase().includes(destinationFilter.toLowerCase());

      const matchesDuration =
        durationFilter === 'All' || tour.durationCategory === durationFilter;

      const matchesType =
        typeFilter === 'All' || tour.tourType.toLowerCase() === typeFilter.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destination.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDest && matchesDuration && matchesType && matchesSearch;
    });
  }, [tours, destinationFilter, durationFilter, typeFilter, searchQuery]);

  const customWaUrl = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I am browsing your tour packages and would like a customized itinerary and quote for Gilgit-Baltistan.`,
    business.whatsapp
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 overflow-x-hidden">
      {/* Page Header — Max text-2xl on mobile, text-4xl on desktop */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Mountain className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gilgit-Baltistan Expeditions &amp; Packages</span>
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Tours &amp; Travel Packages
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Explore curated private and group itineraries across Hunza, Skardu, Fairy Meadows, Deosai, and Khunjerab Pass.
          </p>
        </div>

        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href={customWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto px-5 py-3 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Request Custom Tour</span>
        </motion.a>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-6 shadow-lg shadow-slate-900/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hunza, Skardu, Trek..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination
            </label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
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
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="All">Any Duration</option>
              <option value="4-6 Days">4–6 Days</option>
              <option value="7-10 Days">7–10 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tour Style
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="All">All Styles</option>
              <option value="Family Holidays">Family Holidays</option>
              <option value="Road Trips">Road Trips</option>
              <option value="Adventure & Trekking">Adventure &amp; Trekking</option>
              <option value="Custom Private Tours">Custom Private Tours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tour Cards Grid: 1 Col Mobile, 2 Col Tablet, 3-4 Col Desktop */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 text-center space-y-4 shadow-sm">
          <p className="text-sm md:text-base text-slate-600">
            No tours matched your current search criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setDestinationFilter('All');
              setDurationFilter('All');
              setTypeFilter('All');
              setSearchQuery('');
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-2xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
};
