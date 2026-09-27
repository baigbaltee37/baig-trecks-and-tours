import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Plus,
  Trash2,
  Database,
  CheckCircle2,
  LogOut,
  Edit3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TourItem, DestinationItem, BlogPostItem, GalleryImageItem, ReviewItem, VISUAL_ASSETS } from '../data/initialData';

export const AdminLoginPage: React.FC = () => {
  const { user, isAdmin, signInWithGoogle, business } = useApp();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user && isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">
          Administrator Authenticated
        </h1>
        <p className="text-xs text-[#94A3B8]">Signed in as {user.email}</p>
        <Link
          to="/admin"
          className="inline-block px-6 py-3 text-xs font-semibold bg-[#D4AF37] text-[#0B0F14] rounded-lg"
        >
          OPEN ADMIN DASHBOARD
        </Link>
      </div>
    );
  }

  const handleAdminSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/admin');
    } catch {
      setErrorMsg('Admin sign-in cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#111722] border border-[#D4AF37]/30 rounded-xl p-6 sm:p-8 space-y-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            {business.name} Administration
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Admin Console Login
          </h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Restricted to authorized {business.name} administrators ({business.email}). Customer accounts use the separate Customer Portal.
          </p>
        </div>

        {user && !isAdmin && (
          <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200">
            Your current account ({user.email}) does not have administrator privileges. Please sign in with the authorized administrator Google account.
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleAdminSignIn}
          disabled={loading}
          className="w-full py-3 px-4 text-xs font-semibold bg-[#D4AF37] text-[#0B0F14] hover:bg-[#FDE68A] rounded-lg transition-colors"
        >
          {loading ? 'VERIFYING...' : 'SIGN IN WITH ADMIN GOOGLE ACCOUNT'}
        </button>
      </div>
    </div>
  );
};

export const AdminDashboardPage: React.FC = () => {
  const {
    user,
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
    seedInitialCatalogToFirestore,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    | 'overview'
    | 'tours'
    | 'destinations'
    | 'inquiries'
    | 'bookings'
    | 'reviews'
    | 'gallery'
    | 'blog'
    | 'users'
    | 'settings'
  >('overview');

  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Tour Editor State
  const [editingTour, setEditingTour] = useState<TourItem>({
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
  });
  const [inclusionsText, setInclusionsText] = useState('');
  const [exclusionsText, setExclusionsText] = useState('');
  const [itineraryDayRoute, setItineraryDayRoute] = useState('');
  const [itineraryDayDesc, setItineraryDayDesc] = useState('');

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

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Shield className="w-10 h-10 text-[#D4AF37] mx-auto" />
        <h1 className="font-display text-2xl font-bold text-white">
          Administrator Access Required
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Please sign in with the authorized administrator account ({business.email}) to access CMS controls.
        </p>
        <Link
          to="/admin/login"
          className="inline-block px-6 py-3 text-xs font-semibold bg-[#D4AF37] text-[#0B0F14] rounded-lg"
        >
          GO TO ADMIN LOGIN
        </Link>
      </div>
    );
  }

  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending').length;

  const handleSelectTourToEdit = (t: TourItem) => {
    setEditingTour(t);
    setInclusionsText((t.inclusions || []).join('\n'));
    setExclusionsText((t.exclusions || []).join('\n'));
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
    setStatusBanner(`Saved tour "${updatedTour.title}" to Firestore.`);
  };

  const handleAddItineraryDay = () => {
    if (!itineraryDayRoute.trim()) return;
    const nextNum = `DAY 0${(editingTour.itinerary?.length || 0) + 1}`;
    setEditingTour({
      ...editingTour,
      itinerary: [
        ...(editingTour.itinerary || []),
        {
          dayNumber: nextNum,
          route: itineraryDayRoute.trim(),
          description: itineraryDayDesc.trim() || 'Scenic mountain journey and valley exploration.',
        },
      ],
    });
    setItineraryDayRoute('');
    setItineraryDayDesc('');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>{business.name} — Content &amp; Operations CMS</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mt-1">
            Administrator Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await seedInitialCatalogToFirestore();
              setStatusBanner('Synced initial tours, destinations, guides, gallery, and settings to Firestore.');
            }}
            className="px-4 py-2 text-xs font-semibold bg-[#D4AF37] text-[#0B0F14] hover:bg-[#FDE68A] rounded-lg flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            Sync Initial Catalog to Database
          </button>
          <button
            type="button"
            onClick={() => signOut()}
            className="px-4 py-2 text-xs font-semibold bg-white/10 text-white rounded-lg flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {statusBanner && (
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#10B981]/40 flex items-center justify-between gap-4 text-xs text-[#E2E8F0]">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            {statusBanner}
          </span>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-[#94A3B8] hover:text-white"
          >
            Close
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'tours', label: `Tours (${tours.length})` },
          { id: 'destinations', label: `Destinations (${destinations.length})` },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})` },
          { id: 'bookings', label: `Bookings (${bookings.length})` },
          { id: 'reviews', label: `Reviews (${reviews.length})` },
          { id: 'gallery', label: `Gallery (${gallery.length})` },
          { id: 'blog', label: `Blog (${blogPosts.length})` },
          { id: 'users', label: `Users (${allUsers.length})` },
          { id: 'settings', label: 'Website Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-[#0EA5E9] text-[#0B0F14]'
                : 'bg-[#111722] text-[#CBD5E1] border border-white/10 hover:border-white/25'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW (Real Statistics Only — No Fake Revenue or Fake Metrics) */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl bg-[#111722] border border-white/10">
              <div className="text-xs text-[#94A3B8]">Total Registered Users</div>
              <div className="font-mono-num text-3xl font-bold text-white mt-2">
                {allUsers.length}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-[#111722] border border-white/10">
              <div className="text-xs text-[#94A3B8]">Total Inquiries</div>
              <div className="font-mono-num text-3xl font-bold text-white mt-2">
                {inquiries.length}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-[#111722] border border-white/10">
              <div className="text-xs text-[#94A3B8]">Pending Inquiries</div>
              <div className="font-mono-num text-3xl font-bold text-[#D4AF37] mt-2">
                {pendingInquiriesCount}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-[#111722] border border-white/10">
              <div className="text-xs text-[#94A3B8]">Total Bookings</div>
              <div className="font-mono-num text-3xl font-bold text-white mt-2">
                {bookings.length}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-[#111722] border border-white/10">
              <div className="text-xs text-[#94A3B8]">Active Tour Packages</div>
              <div className="font-mono-num text-3xl font-bold text-[#0EA5E9] mt-2">
                {tours.length}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-2">
            <h2 className="font-display text-lg font-bold text-white">
              Customer Registration Email Notification Configuration
            </h2>
            <p className="text-xs sm:text-sm text-[#CBD5E1]">
              New customer registrations trigger a server-side notification to:{' '}
              <span className="font-mono-num text-[#D4AF37] font-semibold">
                {business.signupNotificationEmail}
              </span>
              . Ensure <code className="text-white">SMTP_HOST</code>, <code className="text-white">SMTP_USER</code>, and <code className="text-white">SMTP_PASS</code> are configured in your server environment variables for live email delivery.
            </p>
          </div>
        </div>
      )}

      {/* 2. TOUR MANAGEMENT */}
      {activeSection === 'tours' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Existing Tours List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="font-display text-xl font-bold text-white">
              Existing Tours
            </h2>
            {tours.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-bold text-white">{t.title}</div>
                  <div className="text-xs text-[#94A3B8]">
                    {t.destination} · {t.duration} ·{' '}
                    {t.pricePerPerson > 0
                      ? `PKR ${t.pricePerPerson.toLocaleString()}`
                      : 'Contact for pricing'}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelectTourToEdit(t)}
                    className="p-2 rounded bg-white/10 text-white hover:bg-white/20"
                    title="Edit Tour"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTourAdmin(t.id)}
                    className="p-2 rounded bg-red-950/60 text-red-300 hover:bg-red-900/60"
                    title="Delete Tour"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create / Edit Tour Form */}
          <form
            onSubmit={handleSaveTourSubmit}
            className="lg:col-span-7 bg-[#111722] border border-white/10 rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-white">
              Create or Edit Tour Package
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Tour Title *</label>
                <input
                  type="text"
                  required
                  value={editingTour.title}
                  onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">URL Slug</label>
                <input
                  type="text"
                  value={editingTour.slug}
                  onChange={(e) => setEditingTour({ ...editingTour, slug: e.target.value })}
                  placeholder="e.g. skardu-tour"
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Destination</label>
                <input
                  type="text"
                  value={editingTour.destination}
                  onChange={(e) => setEditingTour({ ...editingTour, destination: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Duration Text</label>
                <input
                  type="text"
                  value={editingTour.duration}
                  onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Duration Filter Bracket</label>
                <select
                  value={editingTour.durationCategory}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      durationCategory: e.target.value as TourItem['durationCategory'],
                    })
                  }
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                >
                  <option value="1-3 Days">1-3 Days</option>
                  <option value="4-6 Days">4-6 Days</option>
                  <option value="7-10 Days">7-10 Days</option>
                  <option value="10+ Days">10+ Days</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Tour Type</label>
                <input
                  type="text"
                  value={editingTour.tourType}
                  onChange={(e) => setEditingTour({ ...editingTour, tourType: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">
                  Per Person Price (PKR, 0 = Contact Us)
                </label>
                <input
                  type="number"
                  min={0}
                  value={editingTour.pricePerPerson}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, pricePerPerson: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">
                  Couple Price (PKR, 0 = Contact Us)
                </label>
                <input
                  type="number"
                  min={0}
                  value={editingTour.couplePrice}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, couplePrice: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Optional Badge</label>
                <select
                  value={editingTour.badge}
                  onChange={(e) => setEditingTour({ ...editingTour, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                >
                  <option value="">None</option>
                  <option value="BEST SELLER">BEST SELLER</option>
                  <option value="POPULAR">POPULAR</option>
                  <option value="AUTUMN SPECIAL">AUTUMN SPECIAL</option>
                  <option value="FAMILY FAVORITE">FAMILY FAVORITE</option>
                  <option value="ADVENTURE PICK">ADVENTURE PICK</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">Booking Status</label>
                <select
                  value={editingTour.bookingStatus}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      bookingStatus: e.target.value as TourItem['bookingStatus'],
                    })
                  }
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                >
                  <option value="Inquiry Only">Inquiry Only</option>
                  <option value="Available">Available</option>
                  <option value="Limited Availability">Limited Availability</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">Short Description</label>
              <textarea
                rows={2}
                value={editingTour.shortDescription}
                onChange={(e) =>
                  setEditingTour({ ...editingTour, shortDescription: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">Detailed Overview</label>
              <textarea
                rows={3}
                value={editingTour.overview}
                onChange={(e) => setEditingTour({ ...editingTour, overview: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">
                  Confirmed Inclusions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  placeholder="Prado / Grand Cabin Transport&#10;Hotel Accommodation&#10;Daily Breakfast"
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">
                  Confirmed Exclusions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={exclusionsText}
                  onChange={(e) => setExclusionsText(e.target.value)}
                  placeholder="Personal expenses&#10;Airfare"
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">
                  Confirmed Transportation Details
                </label>
                <input
                  type="text"
                  value={editingTour.transportation}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, transportation: e.target.value })
                  }
                  placeholder="Leave blank if confirmed per booking"
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1">
                  Confirmed Accommodation Details
                </label>
                <input
                  type="text"
                  value={editingTour.accommodation}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, accommodation: e.target.value })
                  }
                  placeholder="Leave blank if confirmed during booking"
                  className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                />
              </div>
            </div>

            {/* Itinerary Builder */}
            <div className="p-4 rounded-lg bg-[#0B0F14] border border-white/10 space-y-3">
              <div className="text-xs font-semibold text-white">
                Itinerary Days ({editingTour.itinerary?.length || 0})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={itineraryDayRoute}
                  onChange={(e) => setItineraryDayRoute(e.target.value)}
                  placeholder="Route (e.g. Islamabad → Gilgit)"
                  className="px-3 py-1.5 rounded bg-[#111722] border border-white/15 text-xs text-white"
                />
                <input
                  type="text"
                  value={itineraryDayDesc}
                  onChange={(e) => setItineraryDayDesc(e.target.value)}
                  placeholder="Day description & activities"
                  className="px-3 py-1.5 rounded bg-[#111722] border border-white/15 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddItineraryDay}
                className="px-3 py-1.5 text-xs font-semibold bg-white/10 text-white rounded flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Itinerary Day
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
            >
              Save Tour Package
            </button>
          </form>
        </div>
      )}

      {/* 3. DESTINATION MANAGEMENT */}
      {activeSection === 'destinations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-3">
            {destinations.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-white">{d.name}</div>
                  <div className="text-xs text-[#94A3B8]">
                    {d.region} · {d.isConfirmedTourOffering ? 'Active Tour Offering' : 'Regional Landmark'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteDestinationAdmin(d.id)}
                  className="p-2 rounded bg-red-950/60 text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

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
                elevation: '2,500 m',
                coordinates: { x: 50, y: 40 },
                shortDescription: newDestShort,
                description: newDestDesc || newDestShort,
                imageUrl: newDestImage,
                isConfirmedTourOffering: newDestOffering,
              });
              setStatusBanner(`Saved destination "${newDestName}".`);
              setNewDestName('');
            }}
            className="lg:col-span-6 bg-[#111722] border border-white/10 rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-white">
              Add / Update Destination
            </h2>
            <input
              type="text"
              required
              value={newDestName}
              onChange={(e) => setNewDestName(e.target.value)}
              placeholder="Destination Name (e.g. Phander Valley)"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <input
              type="text"
              value={newDestSlug}
              onChange={(e) => setNewDestSlug(e.target.value)}
              placeholder="Slug (e.g. phander-valley)"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <input
              type="text"
              value={newDestRegion}
              onChange={(e) => setNewDestRegion(e.target.value)}
              placeholder="Region"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <textarea
              rows={2}
              value={newDestShort}
              onChange={(e) => setNewDestShort(e.target.value)}
              placeholder="Short description"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <textarea
              rows={3}
              value={newDestDesc}
              onChange={(e) => setNewDestDesc(e.target.value)}
              placeholder="Detailed description"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <label className="flex items-center gap-2 text-xs text-[#CBD5E1]">
              <input
                type="checkbox"
                checked={newDestOffering}
                onChange={(e) => setNewDestOffering(e.target.checked)}
              />
              Mark as active {business.name} tour offering
            </label>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
            >
              Save Destination
            </button>
          </form>
        </div>
      )}

      {/* 4. INQUIRY MANAGEMENT */}
      {activeSection === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.length > 0 ? (
            inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 rounded-xl bg-[#111722] border border-white/10 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-white text-sm">{inq.customerName}</span>
                    <span className="text-xs text-[#94A3B8] ml-2">
                      ({inq.email} · WhatsApp: {inq.whatsapp})
                    </span>
                  </div>
                  <select
                    value={inq.status}
                    onChange={(e) =>
                      updateInquiryAdmin(
                        inq.id,
                        e.target.value as typeof inq.status,
                        inq.internalNotes
                      )
                    }
                    className="px-3 py-1.5 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                  >
                    <option value="pending">pending</option>
                    <option value="contacted">contacted</option>
                    <option value="resolved">resolved</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
                <div className="text-xs text-[#D4AF37]">
                  Destination: {inq.destination} · Dates: {inq.preferredDates} · Travelers:{' '}
                  {inq.travelers} · Type: {inq.tourType}
                </div>
                <p className="text-xs text-[#CBD5E1]">{inq.message}</p>
              </div>
            ))
          ) : (
            <div className="p-8 rounded-xl bg-[#111722] border border-white/10 text-xs text-[#94A3B8]">
              No customer inquiries recorded yet.
            </div>
          )}
        </div>
      )}

      {/* 5. BOOKING MANAGEMENT */}
      {activeSection === 'bookings' && (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((bk) => (
              <div
                key={bk.id}
                className="p-5 rounded-xl bg-[#111722] border border-white/10 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">{bk.tourTitle}</div>
                    <div className="text-xs text-[#94A3B8]">
                      Customer: {bk.customerName} ({bk.email} · {bk.whatsapp}) · {bk.travelers}{' '}
                      Travelers · Dates: {bk.travelDates}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
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
                      className="px-3 py-1.5 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
                    >
                      <option value="pending_confirmation">pending_confirmation</option>
                      <option value="confirmed">confirmed</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
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
                      className="px-3 py-1.5 rounded bg-[#0B0F14] border border-[#D4AF37]/40 text-xs text-[#D4AF37]"
                    >
                      <option value="unpaid">unpaid</option>
                      <option value="verification_pending">verification_pending</option>
                      <option value="confirmed_by_admin">confirmed_by_admin</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-[#CBD5E1]">{bk.notes}</p>
              </div>
            ))
          ) : (
            <div className="p-8 rounded-xl bg-[#111722] border border-white/10 text-xs text-[#94A3B8]">
              No booking requests recorded yet.
            </div>
          )}
        </div>
      )}

      {/* 6. REVIEW MANAGEMENT (Never Generate Fake Reviews) */}
      {activeSection === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-3">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      {r.customerName} ({r.rating}/5)
                    </div>
                    <p className="text-xs text-[#94A3B8]">{r.reviewText}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteReviewAdmin(r.id)}
                    className="p-2 rounded bg-red-950/60 text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-xl bg-[#111722] border border-white/10 text-xs text-[#94A3B8]">
                No reviews published yet. Add verified real customer testimonials using the form.
              </div>
            )}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!revName.trim() || !revText.trim()) return;
              const newRev: ReviewItem = {
                id: `rev_${Date.now()}`,
                customerName: revName,
                rating: revRating,
                date: revDate,
                reviewText: revText,
                photoUrl: '',
                verified: revVerified,
                source: 'Verified Traveler',
              };
              await saveReviewAdmin(newRev);
              setRevName('');
              setRevText('');
              setStatusBanner('Published verified customer review.');
            }}
            className="lg:col-span-6 bg-[#111722] border border-white/10 rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-white">
              Add Verified Real Customer Review
            </h2>
            <input
              type="text"
              required
              value={revName}
              onChange={(e) => setRevName(e.target.value)}
              placeholder="Customer Full Name"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={1}
                max={5}
                value={revRating}
                onChange={(e) => setRevRating(Number(e.target.value) || 5)}
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
              <input
                type="text"
                value={revDate}
                onChange={(e) => setRevDate(e.target.value)}
                placeholder="Date (e.g. October 2026)"
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <textarea
              rows={3}
              required
              value={revText}
              onChange={(e) => setRevText(e.target.value)}
              placeholder="Authentic customer review text..."
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <label className="flex items-center gap-2 text-xs text-[#CBD5E1]">
              <input
                type="checkbox"
                checked={revVerified}
                onChange={(e) => setRevVerified(e.target.checked)}
              />
              Confirmed real booking evidence exists
            </label>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
            >
              Publish Review
            </button>
          </form>
        </div>
      )}

      {/* 7. GALLERY MANAGEMENT */}
      {activeSection === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-3">
            {gallery.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={g.imageUrl}
                    alt={g.altText}
                    referrerPolicy="no-referrer"
                    className="w-14 h-10 object-cover rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{g.caption}</div>
                    <div className="text-[11px] text-[#94A3B8]">
                      {g.destination} · {g.category}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteGalleryImageAdmin(g.id)}
                  className="p-2 rounded bg-red-950/60 text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!galUrl.trim() || !galCaption.trim()) return;
              const item: GalleryImageItem = {
                id: `gal_${Date.now()}`,
                imageUrl: galUrl,
                caption: galCaption,
                altText: galAlt || galCaption,
                category: galCategory,
                destination: galDest,
                featured: true,
              };
              await saveGalleryImageAdmin(item);
              setGalCaption('');
              setGalAlt('');
              setStatusBanner('Added photograph to Gallery.');
            }}
            className="lg:col-span-6 bg-[#111722] border border-white/10 rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-white">
              Add Gallery Photograph
            </h2>
            <input
              type="text"
              required
              value={galUrl}
              onChange={(e) => setGalUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <input
              type="text"
              required
              value={galCaption}
              onChange={(e) => setGalCaption(e.target.value)}
              placeholder="Caption"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <input
              type="text"
              value={galAlt}
              onChange={(e) => setGalAlt(e.target.value)}
              placeholder="Accessible Alt Text"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={galCategory}
                onChange={(e) => setGalCategory(e.target.value)}
                placeholder="Category (e.g. Hunza, Mountains)"
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
              <input
                type="text"
                value={galDest}
                onChange={(e) => setGalDest(e.target.value)}
                placeholder="Destination"
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
            >
              Save Gallery Image
            </button>
          </form>
        </div>
      )}

      {/* 8. BLOG / TRAVEL GUIDES MANAGEMENT */}
      {activeSection === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-3">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-white">{post.title}</div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {post.category} · {post.published ? 'Published' : 'Draft'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteBlogPostAdmin(post.id)}
                  className="p-2 rounded bg-red-950/60 text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!blogTitle.trim() || !blogContent.trim()) return;
              const slug =
                blogSlug.trim() ||
                blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const newPost: BlogPostItem = {
                id: slug,
                slug,
                title: blogTitle,
                category: blogCategory,
                excerpt: blogExcerpt || blogContent.slice(0, 160),
                content: blogContent,
                imageUrl: VISUAL_ASSETS.heroKarakoram,
                published: true,
                readTime: '5 min read',
                seoTitle: `${blogTitle} | ${business.name}`,
                seoDescription: blogExcerpt || blogContent.slice(0, 150),
              };
              await saveBlogPostAdmin(newPost);
              setBlogTitle('');
              setBlogSlug('');
              setBlogExcerpt('');
              setBlogContent('');
              setStatusBanner('Published travel guide.');
            }}
            className="lg:col-span-7 bg-[#111722] border border-white/10 rounded-xl p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-white">
              Create / Edit Travel Guide Article
            </h2>
            <input
              type="text"
              required
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Article Title"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={blogSlug}
                onChange={(e) => setBlogSlug(e.target.value)}
                placeholder="Slug (optional)"
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
              <input
                type="text"
                value={blogCategory}
                onChange={(e) => setBlogCategory(e.target.value)}
                placeholder="Category"
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <textarea
              rows={2}
              value={blogExcerpt}
              onChange={(e) => setBlogExcerpt(e.target.value)}
              placeholder="Short summary excerpt"
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <textarea
              rows={6}
              required
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              placeholder="Full article content..."
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
            >
              Publish Travel Guide
            </button>
          </form>
        </div>
      )}

      {/* 9. USER MANAGEMENT */}
      {activeSection === 'users' && (
        <div className="space-y-3">
          {allUsers.map((u) => (
            <div
              key={u.uid}
              className="p-4 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-bold text-white">{u.displayName}</div>
                <div className="text-xs text-[#94A3B8] font-mono-num">
                  UID: {u.uid} · Saved Tours: {u.savedTourIds.length}
                </div>
              </div>
              <span className="text-xs font-semibold text-[#D4AF37] uppercase">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 10. WEBSITE SETTINGS (Centralized Business Config Editor) */}
      {activeSection === 'settings' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await saveSiteSettingsAdmin(settingsForm);
            setStatusBanner('Updated live Website Settings across the platform.');
          }}
          className="bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6"
        >
          <h2 className="font-display text-2xl font-bold text-white">
            Centralized Business &amp; Website Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">
                Business Name (Global Spelling)
              </label>
              <input
                type="text"
                value={settingsForm.name}
                onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">Phone Number</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">
                WhatsApp International Number
              </label>
              <input
                type="text"
                value={settingsForm.whatsapp}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">Public Email</label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">
                JazzCash Account / Number
              </label>
              <input
                type="text"
                value={settingsForm.jazzcashNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, jazzcashNumber: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">JazzCash Account Name</label>
              <input
                type="text"
                value={settingsForm.jazzcashName}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, jazzcashName: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">Hero Headline</label>
              <input
                type="text"
                value={settingsForm.heroHeadline}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#CBD5E1] mb-1">Hero Supporting Text</label>
            <textarea
              rows={2}
              value={settingsForm.heroDescription}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, heroDescription: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">
                Office Address (Displayed only when filled)
              </label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-[#CBD5E1] mb-1">
                Business Hours (Displayed only when filled)
              </label>
              <input
                type="text"
                value={settingsForm.businessHours}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, businessHours: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-[#0B0F14] border border-white/15 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
          >
            Save Website Settings
          </button>
        </form>
      )}
    </div>
  );
};
