import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  LogOut,
  Edit3,
  Download,
  RotateCcw,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  TourItem,
  BlogPostItem,
  GalleryImageItem,
  ReviewItem,
  VISUAL_ASSETS,
} from '../data/initialData';

export const AdminLoginPage: React.FC = () => {
  const { isAdmin, loginAdminSecret, business } = useApp();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = await loginAdminSecret(identifier, password);
    if (res.success) {
      navigate('/admin', { replace: true });
    } else {
      setErrorMsg(res.error || 'Invalid administrator credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-16">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-xs font-bold text-emerald-800">
            {business.name} Security Portal
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Administrator Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Enter your authorized administrator username/email and password to continue.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email / Username *
            </label>
            <input
              type="text"
              name="email"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter admin username or email"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-sm transition-all"
          >
            Sign In to Admin Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

const EMPTY_TOUR_TEMPLATE: TourItem = {
  id: '',
  slug: '',
  title: '',
  destination: 'Hunza',
  duration: '5 Days / 4 Nights',
  durationCategory: '4-6 Days',
  tourType: 'Family Holidays',
  startingLocation: 'Islamabad / Gilgit',
  endingLocation: 'Islamabad / Gilgit',
  groupSize: 'Private or Group',
  difficulty: 'Easy to Moderate',
  bestSeason: 'April to November',
  shortDescription: '',
  overview: '',
  badge: '',
  featured: true,
  bookingStatus: 'Available',
  pricePerPerson: 0,
  couplePrice: 0,
  childPrice: 0,
  groupPriceNote: 'Contact for group pricing',
  imageUrl: VISUAL_ASSETS.heroKarakoram,
  itinerary: [],
  inclusions: [],
  exclusions: [],
  transportation: '',
  accommodation: '',
};

export const AdminDashboardPage: React.FC = () => {
  const {
    isAdmin,
    business,
    tours,
    destinations,
    blogPosts,
    gallery,
    reviews,
    inquiries,
    bookings,
    allUsers,
    signOut,
    saveTourAdmin,
    deleteTourAdmin,
    exportToursAsJson,
    importToursFromJson,
    resetToursToDefault,
    saveDestinationAdmin,
    deleteDestinationAdmin,
    saveBlogPostAdmin,
    deleteBlogPostAdmin,
    saveGalleryImageAdmin,
    deleteGalleryImageAdmin,
    saveReviewAdmin,
    deleteReviewAdmin,
    updateInquiryAdmin,
    updateBookingAdmin,
    saveSiteSettingsAdmin,
  } = useApp();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeSection, setActiveSection] = useState<
    | 'tours'
    | 'overview'
    | 'destinations'
    | 'inquiries'
    | 'bookings'
    | 'reviews'
    | 'gallery'
    | 'blog'
    | 'users'
    | 'settings'
  >('tours');

  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Tour Editor State
  const [editingTour, setEditingTour] = useState<TourItem>(EMPTY_TOUR_TEMPLATE);
  const [inclusionsText, setInclusionsText] = useState('');
  const [exclusionsText, setExclusionsText] = useState('');
  const [itineraryDayRoute, setItineraryDayRoute] = useState('');
  const [itineraryDayDesc, setItineraryDayDesc] = useState('');

  useEffect(() => {
    const editId = searchParams.get('editTour');
    if (editId) {
      const found = tours.find((t) => t.id === editId || t.slug === editId);
      if (found) {
        setEditingTour(found);
        setInclusionsText((found.inclusions || []).join('\n'));
        setExclusionsText((found.exclusions || []).join('\n'));
        setActiveSection('tours');
      }
    }
  }, [searchParams, tours]);

  // Destination Editor State
  const [newDestName, setNewDestName] = useState('');
  const [newDestSlug, setNewDestSlug] = useState('');
  const [newDestRegion, setNewDestRegion] = useState('Gilgit-Baltistan');
  const [newDestShort, setNewDestShort] = useState('');
  const [newDestDesc, setNewDestDesc] = useState('');
  const [newDestImage, setNewDestImage] = useState(VISUAL_ASSETS.attabadPassu);
  const [newDestOffering, setNewDestOffering] = useState(true);

  // Review Editor State
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revDate, setRevDate] = useState('2026');
  const [revText, setRevText] = useState('');
  const [revVerified, setRevVerified] = useState(true);

  // Gallery Editor State
  const [galUrl, setGalUrl] = useState(VISUAL_ASSETS.heroKarakoram);
  const [galCaption, setGalCaption] = useState('');
  const [galAlt, setGalAlt] = useState('');
  const [galCategory, setGalCategory] = useState('Hunza');
  const [galDest, setGalDest] = useState('Hunza');

  // Blog Editor State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogCategory, setBlogCategory] = useState('Travel Planning');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');

  // Settings Editor State
  const [settingsForm, setSettingsForm] = useState({
    name: business.name,
    phone: business.phone,
    whatsapp: business.whatsapp,
    email: business.email,
    signupNotificationEmail: business.signupNotificationEmail,
    jazzcashNumber: business.jazzcashNumber,
    jazzcashName: business.jazzcashName,
    tagline: business.tagline,
    heroHeadline: business.heroHeadline,
    heroDescription: business.heroDescription,
    address: business.address,
    businessHours: business.businessHours,
    cancellationPolicy: business.cancellationPolicy,
    refundPolicy: business.refundPolicy,
    bookingPolicy: business.bookingPolicy,
    paymentInstructions: business.paymentInstructions,
  });

  // Strict Route Protection: Only opens if localStorage isAdmin === 'true', otherwise redirects to /login
  const isStorageAdmin =
    typeof window !== 'undefined' && window.localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin && !isStorageAdmin) {
    return <Navigate to="/login" replace />;
  }

  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending').length;

  const handleSelectTourToEdit = (t: TourItem) => {
    setEditingTour(t);
    setInclusionsText((t.inclusions || []).join('\n'));
    setExclusionsText((t.exclusions || []).join('\n'));
    setTimeout(() => {
      const el = document.getElementById('tour-editor-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleClearTourForm = () => {
    setEditingTour(EMPTY_TOUR_TEMPLATE);
    setInclusionsText('');
    setExclusionsText('');
    setTimeout(() => {
      const el = document.getElementById('tour-editor-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleImportJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const result = importToursFromJson(reader.result);
        if (result.success) {
          setStatusBanner(
            `Imported ${result.count} tours from JSON and synced across mobile, tablet, and laptop!`
          );
        } else {
          setStatusBanner(result.error || 'Could not import JSON file.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingTour((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour.title.trim()) return;
    const slug =
      editingTour.slug.trim() ||
      editingTour.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const updatedTour: TourItem = {
      ...editingTour,
      id: editingTour.id || slug,
      slug,
      inclusions: inclusionsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      exclusions: exclusionsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    await saveTourAdmin(updatedTour);
    setStatusBanner(`Tour "${updatedTour.title}" saved to localStorage!`);
    setEditingTour(EMPTY_TOUR_TEMPLATE);
    setInclusionsText('');
    setExclusionsText('');
  };

  const handleAddItineraryDay = () => {
    if (!itineraryDayRoute.trim() && !itineraryDayDesc.trim()) return;
    const nextDayNum = (editingTour.itinerary?.length || 0) + 1;
    const newDay = {
      dayTitle: `Day ${nextDayNum}`,
      route: itineraryDayRoute.trim() || `Day ${nextDayNum} Route`,
      description: itineraryDayDesc.trim() || 'Guided sightseeing and travel.',
    };
    setEditingTour((prev) => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), newDay],
    }));
    setItineraryDayRoute('');
    setItineraryDayDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 overflow-x-hidden">
      {/* Top Admin Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <Shield className="w-4 h-4" />
            <span>{business.name} — Admin Dashboard (LocalStorage CMS)</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-1">
            Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Signed in as <span className="text-slate-900 font-mono-num font-semibold">{ADMIN_EMAIL}</span> · Changes persist in localStorage and sync across mobile, tablet &amp; laptop.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={exportToursAsJson}
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Tours as JSON</span>
          </button>

          <label className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
            <span>Import Tours JSON</span>
            <input
              type="file"
              accept="application/json,.json"
              onChange={handleImportJsonUpload}
              className="hidden"
            />
          </label>

          <Link
            to="/"
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
          >
            View Home
          </Link>

          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {statusBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusBanner}</span>
          </span>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-emerald-700 hover:text-emerald-950 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'tours', label: `Tours (${tours.length})` },
          { id: 'overview', label: 'Overview' },
          { id: 'destinations', label: `Destinations (${destinations.length})` },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})` },
          { id: 'bookings', label: `Bookings (${bookings.length})` },
          { id: 'reviews', label: `Reviews (${reviews.length})` },
          { id: 'gallery', label: `Gallery (${gallery.length})` },
          { id: 'blog', label: `Guides (${blogPosts.length})` },
          { id: 'users', label: `Users (${allUsers.length})` },
          { id: 'settings', label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeSection === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. TOURS MANAGEMENT */}
      {activeSection === 'tours' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Existing Tours List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-slate-900">
                All Tours ({tours.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearTourForm}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Tour</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetToursToDefault();
                    setStatusBanner('Reset tours to default Gilgit-Baltistan catalog.');
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl flex items-center gap-1"
                  title="Reset to default tours"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {tours.map((t) => {
                const isBeingEdited = editingTour.id === t.id && Boolean(t.id);
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isBeingEdited
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={t.imageUrl || VISUAL_ASSETS.heroKarakoram}
                        alt={t.title}
                        className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-emerald-700">
                          {t.destination} · {t.duration}
                        </div>
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {t.title}
                        </div>
                        <div className="text-xs font-mono-num text-slate-700 font-semibold mt-0.5">
                          {t.pricePerPerson > 0
                            ? `PKR ${t.pricePerPerson.toLocaleString()} / person`
                            : 'Custom Quote (PKR 0)'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleSelectTourToEdit(t)}
                        className="flex-1 py-2 px-3 text-xs font-semibold bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Tour / Price / Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteTourAdmin(t.id);
                          setStatusBanner(`Deleted tour "${t.title}".`);
                        }}
                        className="py-2 px-3 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Add / Edit Tour Form */}
          <form
            id="tour-editor-panel"
            onSubmit={handleSaveTourSubmit}
            className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700">
                  {editingTour.id ? 'Editing Existing Tour' : 'Create New Tour'}
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  {editingTour.id ? editingTour.title : 'Add New Tour Package'}
                </h3>
              </div>
              {editingTour.id && (
                <button
                  type="button"
                  onClick={handleClearTourForm}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Title & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tour Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingTour.title}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, title: e.target.value })
                  }
                  placeholder="e.g. Hunza & Khunjerab Luxury Tour"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={editingTour.destination}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, destination: e.target.value })
                  }
                  placeholder="Hunza, Skardu, Fairy Meadows..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Duration, Category & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration Label
                </label>
                <input
                  type="text"
                  value={editingTour.duration}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, duration: e.target.value })
                  }
                  placeholder="5 Days / 4 Nights"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration Filter
                </label>
                <select
                  value={editingTour.durationCategory}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      durationCategory: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="1-3 Days">1-3 Days</option>
                  <option value="4-6 Days">4-6 Days</option>
                  <option value="7-10 Days">7-10 Days</option>
                  <option value="10+ Days">10+ Days</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tour Type
                </label>
                <select
                  value={editingTour.tourType}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, tourType: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Family Holidays">Family Holidays</option>
                  <option value="Road Trips">Road Trips</option>
                  <option value="Adventure & Trekking">Adventure &amp; Trekking</option>
                  <option value="Custom Private Tours">Custom Private Tours</option>
                </select>
              </div>
            </div>

            {/* Pricing Controls */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="text-xs font-bold text-emerald-800">
                Pricing Controls (Set 0 to show &ldquo;Custom Quote&rdquo;)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price Per Person (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingTour.pricePerPerson}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        pricePerPerson: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Couple Price (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingTour.couplePrice}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        couplePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Optional Badge
                  </label>
                  <input
                    type="text"
                    value={editingTour.badge}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, badge: e.target.value })
                    }
                    placeholder="e.g. Best Seller"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Image Controls */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Tour Image (URL, Preset, or Upload File)</span>
                </label>
                <label className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold cursor-pointer hover:bg-emerald-700 transition-colors">
                  Upload Image File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={editingTour.imageUrl}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, imageUrl: e.target.value })
                  }
                  placeholder="Paste any image URL (https://...)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
                <select
                  value={
                    Object.values(VISUAL_ASSETS).includes(editingTour.imageUrl)
                      ? editingTour.imageUrl
                      : ''
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      setEditingTour({ ...editingTour, imageUrl: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                >
                  <option value="">-- Or Choose Built-in Mountain Photo --</option>
                  <option value={VISUAL_ASSETS.heroKarakoram}>
                    Hunza Valley &amp; Karakoram Peaks
                  </option>
                  <option value={VISUAL_ASSETS.attabadPassu}>
                    Attabad Lake &amp; Passu Cones
                  </option>
                  <option value={VISUAL_ASSETS.skarduValley}>
                    Skardu Valley &amp; Cold Desert
                  </option>
                  <option value={VISUAL_ASSETS.fairyMeadows}>
                    Fairy Meadows &amp; Nanga Parbat
                  </option>
                  <option value={VISUAL_ASSETS.deosaiPlains}>
                    Deosai High-Altitude Plains
                  </option>
                </select>
              </div>

              {editingTour.imageUrl && (
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={editingTour.imageUrl}
                    alt="Preview"
                    className="w-24 h-16 object-cover rounded-xl border border-slate-200"
                  />
                  <span className="text-xs text-slate-500">
                    Live preview of selected tour card photo
                  </span>
                </div>
              )}
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Card Summary *
              </label>
              <textarea
                rows={2}
                required
                value={editingTour.shortDescription}
                onChange={(e) =>
                  setEditingTour({
                    ...editingTour,
                    shortDescription: e.target.value,
                  })
                }
                placeholder="1-2 sentence summary shown on tour cards..."
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Tour Overview *
              </label>
              <textarea
                rows={4}
                required
                value={editingTour.overview}
                onChange={(e) =>
                  setEditingTour({ ...editingTour, overview: e.target.value })
                }
                placeholder="Full description shown on the tour detail page..."
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
              />
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inclusions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  placeholder="Private AC Transport&#10;Hotel Accommodation&#10;Daily Breakfast"
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Exclusions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={exclusionsText}
                  onChange={(e) => setExclusionsText(e.target.value)}
                  placeholder="Personal expenses&#10;Entry tickets"
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Day-by-Day Itinerary Builder */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800">
                Day-by-Day Itinerary ({editingTour.itinerary?.length || 0} days added)
              </div>
              {editingTour.itinerary && editingTour.itinerary.length > 0 && (
                <div className="space-y-2">
                  {editingTour.itinerary.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
                    >
                      <div>
                        <span className="font-bold text-emerald-700">{d.dayTitle}:</span>{' '}
                        <span className="text-slate-900 font-semibold">{d.route}</span> —{' '}
                        <span className="text-slate-600">{d.description}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingTour((prev) => ({
                            ...prev,
                            itinerary: prev.itinerary.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-red-600 hover:underline shrink-0 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={itineraryDayRoute}
                  onChange={(e) => setItineraryDayRoute(e.target.value)}
                  placeholder="Route (e.g. Gilgit to Karimabad)"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
                <input
                  type="text"
                  value={itineraryDayDesc}
                  onChange={(e) => setItineraryDayDesc(e.target.value)}
                  placeholder="Activities & highlights..."
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800"
                >
                  + Add Itinerary Day
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-sm transition-all"
            >
              {editingTour.id
                ? 'Save Tour Changes to LocalStorage'
                : 'Add New Tour to LocalStorage'}
            </button>
          </form>
        </div>
      )}

      {/* 2. OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Tours', val: tours.length },
              { label: 'Destinations', val: destinations.length },
              { label: 'Pending Inquiries', val: pendingInquiriesCount },
              { label: 'Total Bookings', val: bookings.length },
              { label: 'Registered Users', val: allUsers.length },
              { label: 'Verified Reviews', val: reviews.length },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1"
              >
                <div className="text-xs text-slate-500">{stat.label}</div>
                <div className="font-mono-num text-2xl font-bold text-slate-900">
                  {stat.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DESTINATIONS */}
      {activeSection === 'destinations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newDestName.trim()) return;
              const slug =
                newDestSlug.trim() ||
                newDestName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              await saveDestinationAdmin({
                id: slug,
                slug,
                name: newDestName,
                region: newDestRegion,
                shortDescription: newDestShort,
                description: newDestDesc,
                attractions: ['Scenic Viewpoints', 'Local Culture'],
                bestSeason: 'April to October',
                idealFor: ['Families', 'Photographers', 'Adventure Travelers'],
                activeTourOffering: newDestOffering,
                imageUrl: newDestImage,
              });
              setNewDestName('');
              setNewDestSlug('');
              setNewDestShort('');
              setNewDestDesc('');
              setStatusBanner(`Destination "${newDestName}" saved.`);
            }}
            className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Add / Update Destination
            </h2>
            <input
              type="text"
              required
              value={newDestName}
              onChange={(e) => setNewDestName(e.target.value)}
              placeholder="Destination Name (e.g. Phander Valley)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <input
              type="text"
              required
              value={newDestShort}
              onChange={(e) => setNewDestShort(e.target.value)}
              placeholder="Short summary"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <textarea
              rows={3}
              required
              value={newDestDesc}
              onChange={(e) => setNewDestDesc(e.target.value)}
              placeholder="Full destination description..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold bg-emerald-600 text-white rounded-xl"
            >
              Save Destination
            </button>
          </form>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {destinations.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-xs"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{d.name}</div>
                  <div className="text-xs text-slate-500">{d.region}</div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteDestinationAdmin(d.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INQUIRIES */}
      {activeSection === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Customer Inquiries ({inquiries.length})
          </h2>
          {inquiries.length === 0 ? (
            <p className="text-sm text-slate-600">No inquiries submitted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700">
                      {inq.customerName} ({inq.whatsapp})
                    </span>
                    <select
                      value={inq.status}
                      onChange={(e) =>
                        updateInquiryAdmin(
                          inq.id,
                          e.target.value as typeof inq.status,
                          inq.internalNotes
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-gray-50 border border-slate-200 text-slate-800 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="text-xs text-slate-500">
                    Destination: {inq.destination} · Travelers: {inq.travelers} · Dates:{' '}
                    {inq.preferredDates}
                  </div>
                  <p className="text-sm text-slate-700">{inq.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. BOOKINGS */}
      {activeSection === 'bookings' && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Tour Bookings ({bookings.length})
          </h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-slate-600">No booking requests logged yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs"
                >
                  <div className="text-sm font-bold text-slate-900">{bk.tourTitle}</div>
                  <div className="text-xs text-slate-600">
                    Customer: {bk.customerName} · WhatsApp: {bk.whatsapp} · Travelers:{' '}
                    {bk.travelers}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <select
                      value={bk.bookingStatus}
                      onChange={(e) =>
                        updateBookingAdmin(
                          bk.id,
                          e.target.value as typeof bk.bookingStatus,
                          bk.paymentStatus,
                          bk.travelDates,
                          bk.notes
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-slate-200 text-xs text-slate-900"
                    >
                      <option value="pending_confirmation">Pending Confirmation</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={bk.paymentStatus}
                      onChange={(e) =>
                        updateBookingAdmin(
                          bk.id,
                          bk.bookingStatus,
                          e.target.value as typeof bk.paymentStatus,
                          bk.travelDates,
                          bk.notes
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-slate-200 text-xs text-slate-900"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="verification_pending">Verification Pending</option>
                      <option value="confirmed_by_admin">JazzCash Confirmed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. REVIEWS */}
      {activeSection === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!revName.trim() || !revText.trim()) return;
              await saveReviewAdmin({
                id: `rev_${Date.now()}`,
                customerName: revName,
                rating: Number(revRating),
                dateText: revDate,
                reviewText: revText,
                verified: revVerified,
              });
              setRevName('');
              setRevText('');
              setStatusBanner('Verified review saved.');
            }}
            className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Publish Verified Review
            </h2>
            <input
              type="text"
              required
              value={revName}
              onChange={(e) => setRevName(e.target.value)}
              placeholder="Traveler Name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <textarea
              rows={3}
              required
              value={revText}
              onChange={(e) => setRevText(e.target.value)}
              placeholder="Authentic review text..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold bg-emerald-600 text-white rounded-xl"
            >
              Publish Review
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4 shadow-xs"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {r.customerName} ({r.rating}/5)
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{r.reviewText}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteReviewAdmin(r.id)}
                  className="text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. GALLERY */}
      {activeSection === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!galCaption.trim()) return;
              await saveGalleryImageAdmin({
                id: `gal_${Date.now()}`,
                imageUrl: galUrl,
                caption: galCaption,
                altText: galAlt || galCaption,
                category: galCategory,
                destination: galDest,
              });
              setGalCaption('');
              setGalAlt('');
              setStatusBanner('Gallery item added.');
            }}
            className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Add Gallery Photo
            </h2>
            <input
              type="text"
              required
              value={galUrl}
              onChange={(e) => setGalUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <input
              type="text"
              required
              value={galCaption}
              onChange={(e) => setGalCaption(e.target.value)}
              placeholder="Caption"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold bg-emerald-600 text-white rounded-xl"
            >
              Add to Gallery
            </button>
          </form>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gallery.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {g.caption}
                  </div>
                  <div className="text-[11px] text-slate-500">{g.destination}</div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteGalleryImageAdmin(g.id)}
                  className="text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TRAVEL GUIDES */}
      {activeSection === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!blogTitle.trim() || !blogContent.trim()) return;
              const slug =
                blogSlug.trim() ||
                blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              await saveBlogPostAdmin({
                id: slug,
                slug,
                title: blogTitle,
                category: blogCategory,
                readTime: '5 min read',
                publishedDate: '2026',
                excerpt: blogExcerpt || blogTitle,
                content: blogContent,
                imageUrl: VISUAL_ASSETS.heroKarakoram,
              });
              setBlogTitle('');
              setBlogSlug('');
              setBlogExcerpt('');
              setBlogContent('');
              setStatusBanner('Travel guide saved.');
            }}
            className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Publish Travel Guide
            </h2>
            <input
              type="text"
              required
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Article Title"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <textarea
              rows={4}
              required
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              placeholder="Article content..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold bg-emerald-600 text-white rounded-xl"
            >
              Publish Guide
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {blogPosts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{p.title}</div>
                  <div className="text-xs text-slate-500">{p.category}</div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteBlogPostAdmin(p.id)}
                  className="text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. USERS */}
      {activeSection === 'users' && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Registered Customers ({allUsers.length})
          </h2>
          {allUsers.length === 0 ? (
            <p className="text-sm text-slate-600">
              No customers registered in localStorage yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allUsers.map((u) => (
                <div
                  key={u.uid}
                  className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs"
                >
                  <div className="text-sm font-bold text-slate-900">{u.displayName}</div>
                  <div className="text-xs text-emerald-700 font-semibold">{u.email}</div>
                  {u.phone && <div className="text-xs text-slate-500">Phone: {u.phone}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 10. SETTINGS */}
      {activeSection === 'settings' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await saveSiteSettingsAdmin(settingsForm);
            setStatusBanner('Website settings saved to localStorage.');
          }}
          className="max-w-3xl p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
        >
          <h2 className="font-display text-lg font-bold text-slate-900">
            Global Website &amp; Business Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={settingsForm.name}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, phone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                JazzCash Number
              </label>
              <input
                type="text"
                value={settingsForm.jazzcashNumber}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    jazzcashNumber: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                JazzCash Account Name
              </label>
              <input
                type="text"
                value={settingsForm.jazzcashName}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    jazzcashName: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-slate-200 text-sm text-slate-900"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold bg-emerald-600 text-white rounded-xl"
          >
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
};
