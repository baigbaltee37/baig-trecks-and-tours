import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, MessageCircle, Compass, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TourItem, VISUAL_ASSETS } from '../data/initialData';
import { buildTourWhatsAppMessage, buildWhatsAppLink } from '../config/business';

export const TourCard: React.FC<{ tour: TourItem }> = ({ tour }) => {
  const { business, user, profile, toggleSaveTour } = useApp();
  const isSaved = Boolean(profile?.savedTourIds?.includes(tour.id));

  const waUrl = buildWhatsAppLink(
    buildTourWhatsAppMessage(tour.title, business.name),
    business.whatsapp
  );

  return (
    <article className="group bg-[#111722] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between transition-colors hover:border-white/25">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0E1520]">
          <img
            src={tour.imageUrl || VISUAL_ASSETS.heroKarakoram}
            alt={`${tour.title} — ${tour.destination} in Gilgit-Baltistan`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Optional Configurable Admin Badge (Never auto-assigned unless admin sets it) */}
          {tour.badge && (
            <div className="absolute top-3 left-3 bg-[#0B0F14]/90 border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
              {tour.badge}
            </div>
          )}

          {user && (
            <button
              type="button"
              onClick={() => toggleSaveTour(tour.id)}
              aria-label={isSaved ? 'Remove from saved tours' : 'Save tour'}
              className={`absolute top-3 right-3 p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-[#0EA5E9] text-[#0B0F14] border-[#0EA5E9]'
                  : 'bg-black/60 text-white border-white/15 hover:bg-black/80'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          )}

          <div className="absolute bottom-3 left-4 right-4">
            {/* Zero-Pill Metadata Discipline: Clean unboxed text with · separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#CBD5E1]">
              <span>{tour.destination}</span>
              <span aria-hidden="true">·</span>
              <span>{tour.duration}</span>
              <span aria-hidden="true">·</span>
              <span>{tour.tourType}</span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-display text-lg font-bold text-white leading-snug">
            <Link to={`/tours/${tour.slug}`} className="hover:text-[#0EA5E9] transition-colors">
              {tour.title}
            </Link>
          </h3>

          <p className="text-sm text-[#94A3B8] line-clamp-2 leading-relaxed">
            {tour.shortDescription}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-white/10 space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs text-[#94A3B8]">Starting Price</span>
          {tour.pricePerPerson > 0 ? (
            <span className="font-mono-num text-base font-semibold text-[#D4AF37]">
              PKR {tour.pricePerPerson.toLocaleString()} / person
            </span>
          ) : (
            <span className="text-xs font-medium text-[#E2E8F0]">
              Contact us for current pricing
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to={`/tours/${tour.slug}`}
            className="py-2.5 px-3 text-xs font-semibold text-center text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap"
          >
            View Details
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 text-xs font-semibold text-center bg-[#0EA5E9] text-[#0B0F14] hover:bg-[#38BDF8] rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <span>Inquire Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};

// Section 26: Cinematic Scroll-Driven Journey through Gilgit-Baltistan
const SCROLL_JOURNEY_STOPS = [
  {
    step: '01',
    name: 'Hunza',
    subtitle: 'Terraced Valleys & Karakoram Giants',
    elevation: '2,438 m',
    description:
      'Begin amidst ancient apricot orchards and panoramic viewpoints overlooking Rakaposhi and Ultar Sar along the Karakoram Highway.',
    image: VISUAL_ASSETS.heroKarakoram,
  },
  {
    step: '02',
    name: 'Attabad Lake',
    subtitle: 'Glacial Turquoise Waters',
    elevation: '2,559 m',
    description:
      'Glide across vivid glacial waters carved between sheer limestone and granite cliffs in Upper Hunza.',
    image: VISUAL_ASSETS.attabadPassu,
  },
  {
    step: '03',
    name: 'Passu',
    subtitle: 'Cathedral Spires of Tupopdan',
    elevation: '2,480 m',
    description:
      'Stand before the unmistakable jagged crown of the Passu Cones, Passu Glacier, and suspension bridges over the Hunza River.',
    image: VISUAL_ASSETS.attabadPassu,
  },
  {
    step: '04',
    name: 'Skardu',
    subtitle: 'Confluence of the Indus & High Desert',
    elevation: '2,228 m',
    description:
      'Enter Baltistan where cold desert sand dunes, turquoise lakes, and wide river valleys frame the approach to the high Karakoram.',
    image: VISUAL_ASSETS.skarduValley,
  },
  {
    step: '05',
    name: 'Khaplu',
    subtitle: 'Shyok River & Eastern Baltistan Heritage',
    elevation: '2,600 m',
    description:
      'Follow the winding Shyok River into tranquil mountain settlements surrounded by towering granite walls and historic architecture.',
    image: VISUAL_ASSETS.deosaiPlains,
  },
  {
    step: '06',
    name: 'Deosai',
    subtitle: 'The High Alpine Roof of the World',
    elevation: '4,114 m',
    description:
      'Cross rolling summer wildflower plains, crystal-clear snowmelt streams, and the mirror-like expanse of Sheosar Lake.',
    image: VISUAL_ASSETS.deosaiPlains,
  },
  {
    step: '07',
    name: 'Astore',
    subtitle: 'Emerald Valleys & Rama Pine Forests',
    elevation: '2,600 m',
    description:
      'Descend from the high plateau into forested valleys, glacial streams, and eastern viewpoints of Nanga Parbat.',
    image: VISUAL_ASSETS.fairyMeadows,
  },
  {
    step: '08',
    name: 'Fairy Meadows',
    subtitle: 'Beneath the Raikot Face of Nanga Parbat',
    elevation: '3,300 m',
    description:
      'Culminate your northern journey in lush alpine pastures directly facing the snow-covered wall of Nanga Parbat.',
    image: VISUAL_ASSETS.fairyMeadows,
  },
];

export const CinematicDestinationScroller: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { business } = useApp();
  const activeStop = SCROLL_JOURNEY_STOPS[activeIndex] || SCROLL_JOURNEY_STOPS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Interactive Vertical Route Sequence */}
      <div className="lg:col-span-5 space-y-2">
        {SCROLL_JOURNEY_STOPS.map((stop, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={stop.name}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                isActive
                  ? 'bg-[#111927] border-[#0EA5E9] text-white'
                  : 'bg-[#0E131B]/60 border-white/10 text-[#94A3B8] hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono-num text-[#0EA5E9] font-semibold">{stop.step}.</span>
                  <span className="font-display font-bold text-base text-white">{stop.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{stop.subtitle}</span>
                </div>
                {isActive && (
                  <p className="text-xs text-[#CBD5E1] leading-relaxed pt-1">
                    {stop.description}
                  </p>
                )}
              </div>
              <span className="font-mono-num text-xs text-[#D4AF37] shrink-0">
                {stop.elevation}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Sticky Visual Stage */}
      <div className="lg:col-span-7 lg:sticky lg:top-24">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/15 bg-[#0E1520]">
          <img
            src={activeStop.image}
            alt={`${activeStop.name} — ${activeStop.subtitle} in Gilgit-Baltistan`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
              <span className="font-mono-num text-[#0EA5E9]">STOP {activeStop.step} / 08</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-[#D4AF37]">ELEVATION {activeStop.elevation}</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {activeStop.name} — {activeStop.subtitle}
            </h3>
            <p className="text-sm text-[#E2E8F0] max-w-2xl leading-relaxed">
              {activeStop.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/destinations"
                className="px-4 py-2 text-xs font-semibold bg-white text-[#0B0F14] hover:bg-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap"
              >
                Explore Destination
              </Link>
              <a
                href={buildWhatsAppLink(
                  `Hello ${business.name}, I would like to include ${activeStop.name} in my Gilgit-Baltistan journey. Please share available tour options.`,
                  business.whatsapp
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Inquire About {activeStop.name}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 27: Interactive Stylized Gilgit-Baltistan Map with all 14 Markers
export const InteractiveGilgitBaltistanMap: React.FC = () => {
  const { destinations, tours, business } = useApp();
  const [selectedSlug, setSelectedSlug] = useState<string>('hunza');

  const selectedDest =
    destinations.find((d) => d.slug === selectedSlug) || destinations[0];

  const matchingTours = tours.filter(
    (t) =>
      t.destination.toLowerCase().includes(selectedDest.name.toLowerCase().split(' ')[0]) ||
      t.title.toLowerCase().includes(selectedDest.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Interactive Stylized Topographic SVG Map */}
      <div className="lg:col-span-7 bg-[#0D131C] border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="text-xs text-[#94A3B8]">INTERACTIVE REGIONAL ATLAS</div>
            <h3 className="font-display text-lg font-bold text-white">
              Gilgit-Baltistan 14-Point Corridor Map
            </h3>
          </div>
          <div className="text-xs text-[#94A3B8] flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              Active Package
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
              Regional Landmark
            </span>
          </div>
        </div>

        <div className="relative w-full aspect-[16/11] my-4 bg-[#080C12] rounded-lg border border-white/5 overflow-hidden">
          {/* Stylized Contour & River Network SVG */}
          <svg
            viewBox="0 0 100 78"
            className="w-full h-full"
            role="img"
            aria-label="Interactive map of Gilgit-Baltistan destinations"
          >
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#080C12" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100" height="78" fill="url(#mapGlow)" />

            {/* Topographic Grid Lines */}
            {[15, 30, 45, 60].map((y) => (
              <line
                key={`h-${y}`}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.2"
              />
            ))}
            {[20, 40, 60, 80].map((x) => (
              <line
                key={`v-${x}`}
                x1={x}
                y1="0"
                x2={x}
                y2="78"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.2"
              />
            ))}

            {/* Stylized Karakoram Highway & Indus/Shyok River Corridors */}
            <path
              d="M 34 58 Q 38 42 46 27 T 56 15 L 60 8"
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="0.55"
              strokeDasharray="1.5 1"
              opacity="0.7"
            />
            <path
              d="M 22 34 Q 38 42 68 58 L 84 56"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.5"
              strokeDasharray="1.2 1"
              opacity="0.65"
            />
            <path
              d="M 34 58 Q 46 66 58 68 T 68 58 L 72 48"
              fill="none"
              stroke="#10B981"
              strokeWidth="0.45"
              opacity="0.55"
            />

            {/* 14 Destination Markers */}
            {destinations.map((dest) => {
              const isSelected = dest.slug === selectedDest.slug;
              return (
                <g
                  key={dest.id}
                  transform={`translate(${dest.coordinates.x}, ${dest.coordinates.y})`}
                  onClick={() => setSelectedSlug(dest.slug)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle
                      r="3.4"
                      fill="none"
                      stroke="#0EA5E9"
                      strokeWidth="0.4"
                      opacity="0.9"
                    />
                  )}
                  <circle
                    r={isSelected ? '1.8' : '1.3'}
                    fill={dest.isConfirmedTourOffering ? '#D4AF37' : '#0EA5E9'}
                  />
                  <text
                    y="-2.4"
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                    fontSize={isSelected ? '2.5' : '2.1'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {dest.name.replace(' Valley', '').replace(' Pass', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Accessible Keyboard Button Selector for all 14 Markers */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {destinations.map((dest) => {
            const active = dest.slug === selectedDest.slug;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => setSelectedSlug(dest.slug)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#0EA5E9] text-[#0B0F14] font-semibold'
                    : 'bg-white/5 text-[#CBD5E1] hover:bg-white/10'
                }`}
              >
                {dest.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Selected Marker Details Panel */}
      <div className="lg:col-span-5 bg-[#111722] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between">
        <div>
          <div className="relative aspect-[16/9] bg-[#0B0F14]">
            <img
              src={selectedDest.imageUrl}
              alt={selectedDest.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111722] via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-xs text-[#CBD5E1]">
              <span>{selectedDest.region}</span>
              <span className="font-mono-num text-[#D4AF37]">
                Approx. {selectedDest.elevation}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <div className="text-xs text-[#0EA5E9] font-medium">
                {selectedDest.isConfirmedTourOffering
                  ? `Configured ${business.name} Tour Destination`
                  : 'Gilgit-Baltistan Regional Destination (Custom Inquiry Available)'}
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                {selectedDest.name}
              </h3>
            </div>

            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              {selectedDest.description}
            </p>

            {/* Available Tours for this Destination */}
            <div className="pt-2 space-y-2">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                Available Tours ({matchingTours.length})
              </div>
              {matchingTours.length > 0 ? (
                <div className="space-y-2">
                  {matchingTours.map((t) => (
                    <Link
                      key={t.id}
                      to={`/tours/${t.slug}`}
                      className="block p-3 rounded-lg bg-[#0B0F14] border border-white/10 hover:border-[#0EA5E9] transition-colors"
                    >
                      <div className="text-xs font-semibold text-white">{t.title}</div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">
                        {t.duration} · {t.tourType}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#0B0F14] border border-white/10 text-xs text-[#94A3B8]">
                  Custom private or group itinerary available for {selectedDest.name}. Contact{' '}
                  {business.name} for current information.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 grid grid-cols-2 gap-3">
          <Link
            to={`/destinations/${selectedDest.slug}`}
            className="py-2.5 px-4 text-xs font-semibold text-center bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            Explore {selectedDest.name}
          </Link>
          <a
            href={buildWhatsAppLink(
              `Hello ${business.name}, I am interested in visiting ${selectedDest.name}. Please share current tour packages and travel details.`,
              business.whatsapp
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 text-xs font-semibold text-center bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp Inquiry
          </a>
        </div>
      </div>
    </div>
  );
};

// Section 37 & 38: Validated Inquiry Form with Continue on WhatsApp workflow
export const InquiryFormSection: React.FC<{ defaultDestination?: string; defaultTourSlug?: string }> = ({
  defaultDestination = 'Hunza',
  defaultTourSlug = '',
}) => {
  const { business, user, profile, privateInfo, submitInquiry } = useApp();

  const [customerName, setCustomerName] = useState(profile?.displayName || '');
  const [email, setEmail] = useState(privateInfo?.email || user?.email || '');
  const [whatsapp, setWhatsapp] = useState(privateInfo?.phone || '');
  const [travelers, setTravelers] = useState(2);
  const [destination, setDestination] = useState(defaultDestination);
  const [preferredDates, setPreferredDates] = useState('');
  const [tourType, setTourType] = useState('Family Holidays');
  const [budget, setBudget] = useState('Contact for current pricing');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam protection

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedWaLink, setSubmittedWaLink] = useState<string | null>(null);
  const [savedToAccount, setSavedToAccount] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (honeypot) return; // Silently drop spam bots

    if (!customerName.trim() || !email.trim() || !whatsapp.trim()) {
      setErrorMsg('Please enter your Name, Email, and WhatsApp number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitInquiry({
        customerName,
        email,
        whatsapp,
        travelers,
        destination,
        preferredDates: preferredDates || 'Flexible dates',
        tourType,
        budget,
        tourSlug: defaultTourSlug,
        message: message || 'Please share itinerary and current pricing details.',
      });

      setSavedToAccount(res.persistedToDb);

      const waText = [
        `Hello ${business.name}, I just submitted a travel inquiry:`,
        `• Name: ${customerName.trim()}`,
        `• Email: ${email.trim()}`,
        `• WhatsApp: ${whatsapp.trim()}`,
        `• Travelers: ${travelers}`,
        `• Destination: ${destination}`,
        `• Preferred Dates: ${preferredDates || 'Flexible'}`,
        `• Tour Type: ${tourType}`,
        `• Budget Preference: ${budget}`,
        `• Message: ${message || 'Please share current package details and availability.'}`,
      ].join('\n');

      setSubmittedWaLink(buildWhatsAppLink(waText, business.whatsapp));
    } catch {
      setErrorMsg('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8">
      {submittedWaLink ? (
        <div className="space-y-5 py-4">
          <div className="flex items-center gap-3 text-[#10B981]">
            <CheckCircle2 className="w-7 h-7 shrink-0" />
            <h3 className="font-display text-2xl font-bold text-white">
              Inquiry Prepared for {business.name}
            </h3>
          </div>
          <p className="text-sm text-[#CBD5E1] leading-relaxed">
            {savedToAccount
              ? 'Your inquiry has been saved to your Customer Dashboard. Click below to continue your conversation directly with our team on WhatsApp with your pre-filled trip details.'
              : 'Your inquiry details are ready. Click below to continue directly on WhatsApp with your pre-filled travel details, or sign in to track inquiries in your dashboard.'}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={submittedWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-sm font-semibold bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              CONTINUE ON WHATSAPP
            </a>
            <button
              type="button"
              onClick={() => setSubmittedWaLink(null)}
              className="px-4 py-3 text-xs font-semibold text-[#CBD5E1] hover:text-white border border-white/15 rounded-lg"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Hidden Honeypot Field */}
          <input
            type="text"
            name="company_website_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                WhatsApp / Phone Number *
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 03155449778"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Number of Travelers
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9] font-mono-num"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Preferred Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              >
                {[
                  'Hunza',
                  'Skardu',
                  'Hunza & Skardu Circuit',
                  'Gilgit',
                  'Fairy Meadows',
                  'Naltar',
                  'Khaplu',
                  'Shigar',
                  'Astore',
                  'Deosai',
                  'Ghizer',
                  'Passu & Attabad Lake',
                  'Custom Multi-Valley Route',
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Preferred Travel Dates
              </label>
              <input
                type="text"
                value={preferredDates}
                onChange={(e) => setPreferredDates(e.target.value)}
                placeholder="e.g. October 2026 / 5 Days"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Tour Type
              </label>
              <select
                value={tourType}
                onChange={(e) => setTourType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              >
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

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Budget Preference
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="Contact for current pricing">Discuss current pricing options</option>
                <option value="Standard Comfort">Standard Comfort Package</option>
                <option value="Deluxe 3-4 Star">Deluxe 3–4 Star Preference</option>
                <option value="Luxury Private">Luxury Private Expedition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
              Trip Requirements &amp; Questions
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your departure city, vehicle preferences (e.g. Prado, Hiace, Coaster), or special requests..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] hover:bg-[#38BDF8] rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              {submitting ? 'PROCESSING...' : 'SEND INQUIRY'}
            </button>
            <span className="text-xs text-[#94A3B8]">
              Or WhatsApp directly:{' '}
              <a
                href={business.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#10B981] font-mono-num hover:underline"
              >
                {business.phone}
              </a>
            </span>
          </div>
        </form>
      )}
    </div>
  );
};
