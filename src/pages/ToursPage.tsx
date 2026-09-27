import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TourCard } from '../components/InteractiveMapAndScroll';
import { buildWhatsAppLink } from '../config/business';

export const ToursPage: React.FC = () => {
  const { tours, business } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialType = searchParams.get('type') || 'All';
  const initialDest = searchParams.get('destination') || 'All';

  const [destFilter, setDestFilter] = useState(initialDest);
  const [durationFilter, setDurationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const matchesDest =
        destFilter === 'All' ||
        t.destination.toLowerCase().includes(destFilter.toLowerCase()) ||
        t.title.toLowerCase().includes(destFilter.toLowerCase());
      const matchesDuration =
        durationFilter === 'All' || t.durationCategory === durationFilter;
      const matchesType =
        typeFilter === 'All' || t.tourType.toLowerCase() === typeFilter.toLowerCase();
      const matchesQuery =
        !searchQuery.trim() ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destination.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDest && matchesDuration && matchesType && matchesQuery;
    });
  }, [tours, destFilter, durationFilter, typeFilter, searchQuery]);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
          {business.name} — Tour Catalog
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
          GILGIT-BALTISTAN TOUR PACKAGES
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
          Browse customizable journeys through Hunza, Skardu, Attabad Lake, Passu, Deosai, and Fairy Meadows. Filter by destination, duration, or travel style.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111722] border border-white/10 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Keyword Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Hunza, Skardu, Trekking..."
            className="w-full px-3.5 py-2 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Destination
          </label>
          <select
            value={destFilter}
            onChange={(e) => {
              setDestFilter(e.target.value);
              setSearchParams({});
            }}
            className="w-full px-3.5 py-2 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
          >
            <option value="All">All Destinations</option>
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
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Duration
          </label>
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
          >
            <option value="All">All Durations</option>
            <option value="1-3 Days">1–3 Days</option>
            <option value="4-6 Days">4–6 Days</option>
            <option value="7-10 Days">7–10 Days</option>
            <option value="10+ Days">10+ Days</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Tour Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setSearchParams({});
            }}
            className="w-full px-3.5 py-2 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
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
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-xl bg-[#111722] border border-white/10 text-center space-y-4">
          <h2 className="font-display text-xl font-bold text-white">
            Custom Itinerary Available for Your Filter Selection
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            Contact {business.name} for current information and custom route planning matching your preferred valley and duration.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setDestFilter('All');
                setDurationFilter('All');
                setTypeFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-2.5 text-xs font-semibold bg-white/10 text-white rounded-lg"
            >
              Show All Tours
            </button>
            <a
              href={buildWhatsAppLink(
                `Hello ${business.name}, I would like to request current information for a tour in ${destFilter !== 'All' ? destFilter : 'Gilgit-Baltistan'}.`,
                business.whatsapp
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
