import React, { useState, useEffect } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
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
  Menu,
  X,
  Eye,
  EyeOff,
  Star,
  AlertOctagon,
  LayoutDashboard,
  Compass,
  MapPin,
  Calendar,
  MessageSquare,
  Users,
  Settings,
  FileText,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import { useApp, ADMIN_EMAIL } from '../context/AppContext';
import {
  TourItem,
  DestinationItem,
  VISUAL_ASSETS,
} from '../data/initialData';
import {
  DeleteConfirmModal,
  ConfirmDialogState,
  AdminBookingsSection,
  AdminInquiriesSection,
  AdminCustomersSection,
  AdminGallerySection,
  AdminReviewsSection,
  AdminGuidesSection,
  AdminSettingsSection,
  AdminUsersSection,
  AdminAuditLogsSection,
} from '../components/AdminSubModules';

export const AdminLoginPage: React.FC = () => {
  const { isAdmin, authReady, loginAdminSecret } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);

  if (!authReady) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-sm font-semibold text-slate-600">
        Verifying administrator session...
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await loginAdminSecret(email.trim(), password);
      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setErrorMsg(res.error || 'Invalid admin credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-16">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-1.5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
            <Shield className="w-6 h-6 text-emerald-700" />
          </div>
          <div className="text-xs font-bold tracking-wider text-emerald-800">
            BAIG TRECKS &amp; TOURS
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Authorized Super Admin &amp; Administrator Sign In
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Email"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Password"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 text-center"
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? 'VERIFYING...' : 'SIGN IN'}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setForgotOpen(!forgotOpen)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
            >
              FORGOT PASSWORD
            </button>
          </div>
        </form>

        {forgotOpen && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-slate-900">Admin Password Recovery</div>
            <p>
              For security reasons, administrator passwords cannot be reset publicly. Contact the primary Super Administrator or update your password from the Admin Users panel while signed in.
            </p>
          </div>
        )}
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
  published: true,
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
  faqs: [],
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
};

const EMPTY_DEST_TEMPLATE: DestinationItem = {
  id: '',
  slug: '',
  name: '',
  region: 'Gilgit-Baltistan',
  shortDescription: '',
  description: '',
  attractions: ['Scenic Viewpoints', 'Local Heritage'],
  bestSeason: 'April to October',
  idealFor: ['Families', 'Adventure Travelers'],
  imageUrl: VISUAL_ASSETS.attabadPassu,
  galleryImages: [],
  relatedTourIds: [],
  seoTitle: '',
  seoDescription: '',
  published: true,
  activeTourOffering: true,
};

type AdminSectionKey =
  | 'dashboard'
  | 'tours'
  | 'destinations'
  | 'bookings'
  | 'inquiries'
  | 'customers'
  | 'gallery'
  | 'reviews'
  | 'guides'
  | 'settings'
  | 'users'
  | 'audit-logs';

function resolveSectionFromPath(pathname: string): AdminSectionKey {
  if (pathname.startsWith('/admin/tours')) return 'tours';
  if (pathname.startsWith('/admin/destinations')) return 'destinations';
  if (pathname.startsWith('/admin/bookings')) return 'bookings';
  if (pathname.startsWith('/admin/inquiries')) return 'inquiries';
  if (pathname.startsWith('/admin/customers')) return 'customers';
  if (pathname.startsWith('/admin/gallery')) return 'gallery';
  if (pathname.startsWith('/admin/reviews')) return 'reviews';
  if (pathname.startsWith('/admin/guides') || pathname.startsWith('/admin/content')) return 'guides';
  if (pathname.startsWith('/admin/settings')) return 'settings';
  if (pathname.startsWith('/admin/users')) return 'users';
  if (pathname.startsWith('/admin/audit-logs')) return 'audit-logs';
  return 'dashboard';
}

export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    adminUser,
    authReady,
    isAdmin,
    allTours,
    allDestinations,
    inquiries,
    bookings,
    allUsers,
    auditLogs,
    signOut,
    saveTourAdmin,
    deleteTourAdmin,
    togglePublishTourAdmin,
    toggleFeatureTourAdmin,
    exportToursAsJson,
    resetToursToDefault,
    saveDestinationAdmin,
    deleteDestinationAdmin,
    togglePublishDestinationAdmin,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: 'ARE YOU SURE?',
    message: '',
    onConfirm: () => {},
  });

  const activeSection = resolveSectionFromPath(location.pathname);

  // Tour Editor State
  const [editingTour, setEditingTour] = useState<TourItem>(EMPTY_TOUR_TEMPLATE);
  const [inclusionsText, setInclusionsText] = useState('');
  const [exclusionsText, setExclusionsText] = useState('');
  const [itineraryDayRoute, setItineraryDayRoute] = useState('');
  const [itineraryDayDesc, setItineraryDayDesc] = useState('');
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [tourSearch, setTourSearch] = useState('');

  // Destination Editor State
  const [editingDest, setEditingDest] = useState<DestinationItem>(EMPTY_DEST_TEMPLATE);
  const [destGalleryText, setDestGalleryText] = useState('');
  const [destRelatedToursText, setDestRelatedToursText] = useState('');
  const [destSearch, setDestSearch] = useState('');

  useEffect(() => {
    const editId = searchParams.get('editTour');
    if (editId) {
      const found = allTours.find((t) => t.id === editId || t.slug === editId);
      if (found) {
        setEditingTour(found);
        setInclusionsText((found.inclusions || []).join('\n'));
        setExclusionsText((found.exclusions || []).join('\n'));
      }
    }
  }, [searchParams, allTours]);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const askConfirm = (
    message: string,
    onConfirm: () => void,
    confirmLabel = 'DELETE'
  ) => {
    setConfirmDialog({
      open: true,
      title: 'ARE YOU SURE?',
      message,
      confirmLabel,
      onConfirm,
    });
  };

  if (!authReady) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-sm font-semibold text-slate-600">
        Verifying administrator session...
      </div>
    );
  }

  // Case 1: Authenticated as a normal CUSTOMER -> Show explicit ACCESS DENIED
  if (user && !isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white border-2 border-red-200 rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-red-700 tracking-tight">
            ACCESS DENIED
          </h1>
          <p className="text-sm text-slate-700 font-medium">
            Your customer account ({user.email}) does not have administrator privileges to access the Baig Trecks &amp; Tours Admin Portal.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              to="/my-bookings"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
            >
              Return to Customer Dashboard
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
            >
              Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Unauthenticated visitor -> Redirect to /admin/login
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const totalCustomers = allUsers.length;
  const totalTours = allTours.length;
  const publishedToursCount = allTours.filter((t) => t.published !== false).length;
  const pendingInquiriesCount = inquiries.filter(
    (i) => i.status === 'NEW' || i.status === 'pending' || i.status === 'IN PROGRESS'
  ).length;
  const pendingBookingsCount = bookings.filter(
    (b) =>
      b.bookingStatus === 'PENDING' ||
      b.bookingStatus === 'UNDER REVIEW' ||
      b.bookingStatus === 'PAYMENT PENDING' ||
      b.bookingStatus === 'pending_confirmation'
  ).length;
  const confirmedBookingsCount = bookings.filter(
    (b) =>
      b.bookingStatus === 'CONFIRMED' ||
      b.bookingStatus === 'COMPLETED' ||
      b.bookingStatus === 'confirmed' ||
      b.bookingStatus === 'completed'
  ).length;

  const sidebarItems: { id: AdminSectionKey; label: string; to: string; icon: React.ReactNode }[] =
    [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: '/admin/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'tours',
        label: 'Tours',
        to: '/admin/tours',
        icon: <Compass className="w-4 h-4" />,
      },
      {
        id: 'destinations',
        label: 'Destinations',
        to: '/admin/destinations',
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        id: 'bookings',
        label: 'Bookings',
        to: '/admin/bookings',
        icon: <Calendar className="w-4 h-4" />,
      },
      {
        id: 'inquiries',
        label: 'Inquiries',
        to: '/admin/inquiries',
        icon: <MessageSquare className="w-4 h-4" />,
      },
      {
        id: 'customers',
        label: 'Customers',
        to: '/admin/customers',
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: 'gallery',
        label: 'Gallery',
        to: '/admin/gallery',
        icon: <ImageIcon className="w-4 h-4" />,
      },
      {
        id: 'reviews',
        label: 'Reviews',
        to: '/admin/reviews',
        icon: <Star className="w-4 h-4" />,
      },
      {
        id: 'guides',
        label: 'Travel Guides & Content',
        to: '/admin/guides',
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        id: 'settings',
        label: 'Website Settings',
        to: '/admin/settings',
        icon: <Settings className="w-4 h-4" />,
      },
      {
        id: 'users',
        label: 'Admin Users',
        to: '/admin/users',
        icon: <UserCheck className="w-4 h-4" />,
      },
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        to: '/admin/audit-logs',
        icon: <FileText className="w-4 h-4" />,
      },
    ];

  const handleSelectTourToEdit = (t: TourItem) => {
    setEditingTour(t);
    setInclusionsText((t.inclusions || []).join('\n'));
    setExclusionsText((t.exclusions || []).join('\n'));
    const el = document.getElementById('tour-editor-panel');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClearTourForm = () => {
    setEditingTour(EMPTY_TOUR_TEMPLATE);
    setInclusionsText('');
    setExclusionsText('');
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
    notify(`Tour "${updatedTour.title}" saved.`);
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

  const handleAddTourFaq = () => {
    if (!faqQ.trim() || !faqA.trim()) return;
    setEditingTour((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: faqQ.trim(), answer: faqA.trim() }],
    }));
    setFaqQ('');
    setFaqA('');
  };

  const filteredAdminTours = allTours.filter(
    (t) =>
      !tourSearch.trim() ||
      t.title.toLowerCase().includes(tourSearch.toLowerCase()) ||
      t.destination.toLowerCase().includes(tourSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      <DeleteConfirmModal
        state={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      />

      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-emerald-400">BAIG TRECKS &amp; TOURS</div>
          <div className="text-sm font-bold">ADMIN DASHBOARD</div>
        </div>
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 rounded-xl bg-slate-800 text-white"
          aria-label="Toggle Admin Sidebar"
        >
          {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileDrawerOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 bg-slate-900 text-slate-100 shrink-0 lg:min-h-screen p-4 space-y-6`}
      >
        <div className="border-b border-slate-800 pb-4">
          <div className="text-[11px] font-bold tracking-wider text-emerald-400">
            BAIG TRECKS &amp; TOURS
          </div>
          <div className="font-display text-lg font-bold text-white mt-0.5">
            ADMIN DASHBOARD
          </div>
          <div className="text-[11px] text-slate-400 font-mono-num mt-1 truncate">
            {adminUser?.email || ADMIN_EMAIL} ({adminUser?.role || 'SUPER_ADMIN'})
          </div>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/admin/login', { replace: true });
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-950/60 hover:text-red-200 transition-colors mt-4"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-xs font-bold text-emerald-800">
              BAIG TRECKS &amp; TOURS
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              ADMIN DASHBOARD
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportToursAsJson}
              className="px-3.5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <Link
              to="/"
              className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
            >
              Public Website
            </Link>
          </div>
        </div>

        {toastMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{toastMsg}</span>
            </span>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-emerald-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SECTION 1: DASHBOARD OVERVIEW & REAL STATISTICS */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Customers', val: totalCustomers, to: '/admin/customers' },
                { label: 'Total Tours', val: totalTours, to: '/admin/tours' },
                { label: 'Published Tours', val: publishedToursCount, to: '/admin/tours' },
                { label: 'Pending Inquiries', val: pendingInquiriesCount, to: '/admin/inquiries' },
                { label: 'Pending Bookings', val: pendingBookingsCount, to: '/admin/bookings' },
                { label: 'Confirmed Bookings', val: confirmedBookingsCount, to: '/admin/bookings' },
              ].map((stat) => (
                <Link
                  key={stat.label}
                  to={stat.to}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 transition-colors shadow-xs space-y-1"
                >
                  <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
                  <div className="font-mono-num text-2xl font-bold text-slate-900">
                    {stat.val}
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Recent Bookings ({bookings.length})
                  </h2>
                  <Link
                    to="/admin/bookings"
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    View All
                  </Link>
                </div>
                {bookings.length === 0 ? (
                  <p className="text-xs text-slate-500">0 booking requests recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{b.customerName}</div>
                          <div className="text-slate-600">{b.tourTitle}</div>
                        </div>
                        <div className="text-right font-mono-num">
                          <div className="font-bold text-emerald-800">{b.bookingStatus}</div>
                          <div className="text-slate-500">{b.paymentStatus}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Recent Audit Activity ({auditLogs.length})
                  </h2>
                  <Link
                    to="/admin/audit-logs"
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Full Log
                  </Link>
                </div>
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-slate-500">0 audit events recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{log.action}</div>
                          <div className="text-slate-600">{log.targetName}</div>
                        </div>
                        <div className="text-right font-mono-num text-[11px] text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: TOUR MANAGEMENT (/admin/tours) */}
        {activeSection === 'tours' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Tours ({allTours.length})
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleClearTourForm}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD TOUR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        askConfirm(
                          'Reset tour catalog to default Gilgit-Baltistan packages?',
                          () => {
                            resetToursToDefault();
                            notify('Reset tours to default catalog.');
                          },
                          'RESET'
                        )
                      }
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={tourSearch}
                  onChange={(e) => setTourSearch(e.target.value)}
                  placeholder="Filter tours by title or destination..."
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-3">
                {filteredAdminTours.map((t) => {
                  const isPublished = t.published !== false;
                  return (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={t.imageUrl || VISUAL_ASSETS.heroKarakoram}
                          alt={t.title}
                          className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-600">
                            {t.destination} · {t.duration} ·{' '}
                            <span className="font-bold text-slate-900">
                              {isPublished ? 'Published' : 'Unpublished'}
                            </span>
                            {t.featured ? ' · Featured' : ''}
                          </div>
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {t.title}
                          </div>
                          <div className="text-xs font-mono-num text-emerald-800 font-bold mt-0.5">
                            {t.pricePerPerson > 0
                              ? `PKR ${t.pricePerPerson.toLocaleString()}`
                              : 'Custom Quote (PKR 0)'}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleSelectTourToEdit(t)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 rounded-lg flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>EDIT</span>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await togglePublishTourAdmin(t.id);
                            notify(
                              isPublished
                                ? `Unpublished "${t.title}".`
                                : `Published "${t.title}".`
                            );
                          }}
                          className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1"
                        >
                          {isPublished ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>UNPUBLISH</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>PUBLISH</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await toggleFeatureTourAdmin(t.id);
                            notify(
                              t.featured
                                ? `Unfeatured "${t.title}".`
                                : `Featured "${t.title}".`
                            );
                          }}
                          className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>{t.featured ? 'UNFEATURE' : 'FEATURE'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            askConfirm(`Delete tour "${t.title}" permanently?`, async () => {
                              await deleteTourAdmin(t.id);
                              notify(`Deleted tour "${t.title}".`);
                            })
                          }
                          className="ml-auto px-2.5 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>DELETE</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form
              id="tour-editor-panel"
              onSubmit={handleSaveTourSubmit}
              className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {editingTour.id ? `Edit Tour: ${editingTour.title}` : 'Add New Tour Package'}
                </h3>
                {editingTour.id && (
                  <button
                    type="button"
                    onClick={handleClearTourForm}
                    className="text-xs font-semibold text-slate-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tour Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTour.title}
                    onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTour.destination}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, destination: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingTour.duration}
                    onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tour Type
                  </label>
                  <input
                    type="text"
                    value={editingTour.tourType}
                    onChange={(e) => setEditingTour({ ...editingTour, tourType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Season
                  </label>
                  <input
                    type="text"
                    value={editingTour.bestSeason || ''}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, bestSeason: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Difficulty
                  </label>
                  <input
                    type="text"
                    value={editingTour.difficulty || ''}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, difficulty: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs font-mono-num text-slate-900"
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
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs font-mono-num text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={editingTour.bookingStatus}
                    onChange={(e) =>
                      setEditingTour({
                        ...editingTour,
                        bookingStatus: e.target.value as TourItem['bookingStatus'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited Availability">Limited Availability</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Inquiry Only">Inquiry Only</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end gap-1.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editingTour.published !== false}
                      onChange={(e) =>
                        setEditingTour({ ...editingTour, published: e.target.checked })
                      }
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editingTour.featured}
                      onChange={(e) =>
                        setEditingTour({ ...editingTour, featured: e.target.checked })
                      }
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Tour Cover Image</span>
                  <label className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-semibold cursor-pointer">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={editingTour.imageUrl}
                  onChange={(e) => setEditingTour({ ...editingTour, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingTour.shortDescription}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Description / Overview *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingTour.overview}
                  onChange={(e) => setEditingTour({ ...editingTour, overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Included Services (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={inclusionsText}
                    onChange={(e) => setInclusionsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Excluded Services (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={exclusionsText}
                    onChange={(e) => setExclusionsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Itinerary ({editingTour.itinerary?.length || 0} days)
                </div>
                {editingTour.itinerary?.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs"
                  >
                    <span>
                      <strong>{d.dayTitle}:</strong> {d.route} — {d.description}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTour((prev) => ({
                          ...prev,
                          itinerary: prev.itinerary.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-red-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={itineraryDayRoute}
                    onChange={(e) => setItineraryDayRoute(e.target.value)}
                    placeholder="Day Route"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={itineraryDayDesc}
                    onChange={(e) => setItineraryDayDesc(e.target.value)}
                    placeholder="Day Description"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800"
                  >
                    + Add Day
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Tour FAQs ({editingTour.faqs?.length || 0}) &amp; SEO Metadata
                </div>
                {editingTour.faqs?.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs"
                  >
                    <span>
                      <strong>Q: {f.question}</strong> — {f.answer}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTour((prev) => ({
                          ...prev,
                          faqs: (prev.faqs || []).filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-red-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={faqQ}
                    onChange={(e) => setFaqQ(e.target.value)}
                    placeholder="FAQ Question"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={faqA}
                    onChange={(e) => setFaqA(e.target.value)}
                    placeholder="FAQ Answer"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTourFaq}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800"
                  >
                    + Add FAQ
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <input
                    type="text"
                    value={editingTour.seoTitle || ''}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, seoTitle: e.target.value })
                    }
                    placeholder="SEO Title"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={editingTour.seoDescription || ''}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, seoDescription: e.target.value })
                    }
                    placeholder="SEO Meta Description"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
              >
                {editingTour.id ? 'SAVE TOUR CHANGES' : 'CREATE TOUR'}
              </button>
            </form>
          </div>
        )}

        {/* SECTION 3: DESTINATION MANAGEMENT (/admin/destinations) */}
        {activeSection === 'destinations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingDest.name.trim()) return;
                const slug =
                  editingDest.slug.trim() ||
                  editingDest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await saveDestinationAdmin({
                  ...editingDest,
                  id: editingDest.id || slug,
                  slug,
                  galleryImages: destGalleryText
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                  relatedTourIds: destRelatedToursText
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                });
                notify(`Destination "${editingDest.name}" saved.`);
                setEditingDest(EMPTY_DEST_TEMPLATE);
                setDestGalleryText('');
                setDestRelatedToursText('');
              }}
              className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {editingDest.id ? `Edit: ${editingDest.name}` : 'Add Destination'}
                </h2>
                {editingDest.id && (
                  <button
                    type="button"
                    onClick={() => setEditingDest(EMPTY_DEST_TEMPLATE)}
                    className="text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={editingDest.name}
                onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value })}
                placeholder="Destination Name *"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <input
                type="text"
                value={editingDest.imageUrl}
                onChange={(e) => setEditingDest({ ...editingDest, imageUrl: e.target.value })}
                placeholder="Primary Image URL"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <input
                type="text"
                required
                value={editingDest.shortDescription}
                onChange={(e) =>
                  setEditingDest({ ...editingDest, shortDescription: e.target.value })
                }
                placeholder="Short Summary *"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <textarea
                rows={3}
                required
                value={editingDest.description}
                onChange={(e) =>
                  setEditingDest({ ...editingDest, description: e.target.value })
                }
                placeholder="Full Destination Description *"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <textarea
                rows={2}
                value={destGalleryText}
                onChange={(e) => setDestGalleryText(e.target.value)}
                placeholder="Gallery Image URLs (One per line)"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <input
                type="text"
                value={destRelatedToursText}
                onChange={(e) => setDestRelatedToursText(e.target.value)}
                placeholder="Related Tour Slugs (comma-separated)"
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={editingDest.seoTitle || ''}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, seoTitle: e.target.value })
                  }
                  placeholder="SEO Title"
                  className="px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  value={editingDest.seoDescription || ''}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, seoDescription: e.target.value })
                  }
                  placeholder="SEO Description"
                  className="px-3 py-2 rounded-xl bg-gray-50 border border-slate-200 text-xs"
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={editingDest.published !== false}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, published: e.target.checked })
                  }
                />
                <span>Published publicly</span>
              </label>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold bg-emerald-700 text-white rounded-xl"
              >
                {editingDest.id ? 'SAVE DESTINATION' : 'ADD DESTINATION'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Destinations ({allDestinations.length})
                </span>
                <input
                  type="text"
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  placeholder="Search destinations..."
                  className="px-3 py-1.5 rounded-xl bg-gray-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allDestinations
                  .filter(
                    (d) =>
                      !destSearch.trim() ||
                      d.name.toLowerCase().includes(destSearch.toLowerCase()) ||
                      d.region.toLowerCase().includes(destSearch.toLowerCase())
                  )
                  .map((d) => {
                    const isPub = d.published !== false;
                    return (
                      <div
                        key={d.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={d.imageUrl}
                            alt={d.name}
                            className="w-16 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900">{d.name}</div>
                            <div className="text-xs text-slate-500">
                              {d.region} · {isPub ? 'Published' : 'Unpublished'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-1.5 border-t border-slate-100 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDest(d);
                              setDestGalleryText((d.galleryImages || []).join('\n'));
                              setDestRelatedToursText((d.relatedTourIds || []).join(', '));
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                          >
                            EDIT
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await togglePublishDestinationAdmin(d.id);
                              notify(
                                isPub
                                  ? `Unpublished ${d.name}.`
                                  : `Published ${d.name}.`
                              );
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                          >
                            {isPub ? 'UNPUBLISH' : 'PUBLISH'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              askConfirm(`Delete destination "${d.name}"?`, async () => {
                                await deleteDestinationAdmin(d.id);
                                notify(`Deleted destination "${d.name}".`);
                              })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'bookings' && (
          <AdminBookingsSection notify={notify} askConfirm={askConfirm} />
        )}
        {activeSection === 'inquiries' && (
          <AdminInquiriesSection notify={notify} askConfirm={askConfirm} />
        )}
        {activeSection === 'customers' && (
          <AdminCustomersSection notify={notify} askConfirm={askConfirm} />
        )}
        {activeSection === 'gallery' && (
          <AdminGallerySection notify={notify} askConfirm={askConfirm} />
        )}
        {activeSection === 'reviews' && (
          <AdminReviewsSection notify={notify} askConfirm={askConfirm} />
        )}
        {activeSection === 'guides' && (
          <AdminGuidesSection notify={notify} askConfirm={askConfirm} />
        )}
        {activeSection === 'settings' && <AdminSettingsSection notify={notify} />}
        {activeSection === 'users' && (
          <AdminUsersSection notify={notify} askConfirm={askConfirm} />
        )}
        {activeSection === 'audit-logs' && <AdminAuditLogsSection />}
      </div>
    </div>
  );
};
