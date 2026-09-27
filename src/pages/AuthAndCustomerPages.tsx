import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LogOut,
  Bookmark,
  MessageCircle,
  Calendar,
  UserCheck,
  Shield,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Lock,
  Users,
  ArrowRight,
  Mountain,
} from 'lucide-react';
import { useApp, ADMIN_EMAIL } from '../context/AppContext';
import { TourCard } from '../components/InteractiveMapAndScroll';
import { buildWhatsAppLink } from '../config/business';
import { BrandLogo3D } from '../components/BrandLogo3D';
import { VISUAL_ASSETS } from '../data/initialData';

export const AuthPage: React.FC<{ mode: 'login' | 'signup' | 'forgot' | 'reset' }> = ({
  mode,
}) => {
  const {
    loginWithCredentials,
    signupWithCredentials,
    user,
    isAdmin,
    authReady,
    signOut,
  } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAdminPortalLink, setShowAdminPortalLink] = useState<boolean>(false);

  if (!authReady) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-sm font-semibold text-slate-600">
        Verifying authentication status...
      </div>
    );
  }

  if (user || isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 md:py-16 text-center space-y-5">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            {isAdmin ? 'Administrator Session Active' : 'You Are Logged In'}
          </h1>
          <p className="text-sm text-slate-600">
            Signed in as{' '}
            <span className="text-slate-900 font-semibold">
              {user?.name || user?.displayName || ADMIN_EMAIL}
            </span>{' '}
            ({user?.email || ADMIN_EMAIL})
          </p>
          <div className="flex flex-col gap-2.5 pt-2">
            {redirectParam && (
              <Link
                to={redirectParam}
                className="w-full py-3 px-4 text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl transition-colors"
              >
                Continue to Tour Booking
              </Link>
            )}
            <Link
              to="/my-bookings"
              className="w-full py-3 px-4 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl transition-colors"
            >
              My Bookings
            </Link>
            <Link
              to="/profile"
              className="w-full py-3 px-4 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl transition-colors"
            >
              Edit Profile &amp; Password
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="w-full py-3 px-4 text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl transition-colors"
              >
                Open Admin Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              className="w-full py-3 px-4 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setShowAdminPortalLink(false);

    const cleanIdentifier = email.trim().toLowerCase();

    if (
      cleanIdentifier === 'admit@baigtours' ||
      cleanIdentifier === 'admin@baigtours' ||
      cleanIdentifier === 'admit@baigtours.com' ||
      cleanIdentifier === 'admin@baigtours.com' ||
      cleanIdentifier === 'admin@baigtreks.com' ||
      cleanIdentifier === 'only_baig'
    ) {
      setErrorMsg('Administrator accounts must sign in at the Admin Portal (/admin/login).');
      setShowAdminPortalLink(true);
      return;
    }

    if (mode === 'signup') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanIdentifier)) {
        setErrorMsg('Please enter a valid email address (e.g. name@example.com).');
        return;
      }
      if (!displayName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!phoneInput.trim()) {
        setErrorMsg('Please enter your phone or WhatsApp number.');
        return;
      }
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await signupWithCredentials({
          displayName,
          email: cleanIdentifier,
          password,
          phone: phoneInput,
        });
        if (!res.success) {
          const msg = res.error || 'Could not create account.';
          setErrorMsg(msg);
          if (msg.includes('/admin/login')) {
            setShowAdminPortalLink(true);
          }
        } else {
          navigate(redirectParam || res.redirectTo);
        }
      } else {
        const res = await loginWithCredentials(cleanIdentifier, password);
        if (!res.success) {
          const msg = res.error || 'Invalid login credentials.';
          setErrorMsg(msg);
          if (res.isAdmin || msg.includes('/admin/login')) {
            setShowAdminPortalLink(true);
          }
        } else {
          navigate(redirectParam || res.redirectTo);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl"
      >
        <div className="space-y-2 text-center">
          <div className="flex justify-center pb-1">
            <BrandLogo3D size="sm" variant="light" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {mode === 'signup' ? 'Create Your Account' : 'Sign In to Your Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {redirectParam
              ? 'Please log in or sign up first to complete your tour booking.'
              : mode === 'signup'
              ? 'Register with your name, email, password, and phone to book tours.'
              : 'Sign in with your customer email and password to manage your bookings.'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 03155449778"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                  if (showAdminPortalLink) setShowAdminPortalLink(false);
                }}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password (min 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Enter your password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-2.5"
            >
              <div className="flex items-start gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              {showAdminPortalLink && (
                <div className="pt-1">
                  <Link
                    to="/admin/login"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Go to Admin Portal (/admin/login)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>
              {loading
                ? 'Please wait...'
                : mode === 'signup'
                ? 'Sign Up & Auto Login'
                : 'Login'}
            </span>
          </motion.button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          {mode === 'signup' ? (
            <>
              <span>Already have an account?</span>
              <Link
                to={
                  redirectParam
                    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
                    : '/login'
                }
                className="text-emerald-800 font-semibold hover:underline"
              >
                Login here
              </Link>
            </>
          ) : (
            <>
              <span>Don&apos;t have an account?</span>
              <Link
                to={
                  redirectParam
                    ? `/signup?redirect=${encodeURIComponent(redirectParam)}`
                    : '/signup'
                }
                className="text-emerald-800 font-semibold hover:underline"
              >
                Create an account
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Dedicated /my-bookings Page
export const MyBookingsPage: React.FC = () => {
  const { user, isAdmin, authReady, bookings, tours, business, profile } = useApp();

  if (!authReady) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-sm font-semibold text-slate-600">
        Verifying authentication status...
      </div>
    );
  }

  if (!user && !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <Calendar className="w-10 h-10 text-emerald-700 mx-auto" />
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Login to View My Bookings
          </h1>
          <p className="text-sm text-slate-600">
            Please log in or sign up to view your booked tours and reservation status.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2.5">
            <Link
              to="/login?redirect=%2Fmy-bookings"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-2xl"
            >
              Login
            </Link>
            <Link
              to="/signup?redirect=%2Fmy-bookings"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-slate-100 text-slate-900 rounded-2xl"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeEmail = (user?.email || ADMIN_EMAIL).toLowerCase();
  const myBookings = bookings.filter(
    (bk) =>
      (bk.userEmail && bk.userEmail.toLowerCase() === activeEmail) ||
      (bk.email && bk.email.toLowerCase() === activeEmail) ||
      (user && bk.userId === user.uid)
  );

  const savedTours = tours.filter((t) => profile?.savedTourIds?.includes(t.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Traveler Reservations</span>
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            My Bookings
          </h1>
          <p className="text-sm text-slate-600">
            Showing booked tours for <strong className="text-slate-900">{activeEmail}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/tours"
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-center"
          >
            Browse More Tours
          </Link>
          <Link
            to="/profile"
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-2xl text-center"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {myBookings.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-lg shadow-slate-900/5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Mountain className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            You Have No Booked Tours Yet
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Click &ldquo;Book Now&rdquo; on any Gilgit-Baltistan tour package to reserve your trip. All bookings are saved automatically to your account.
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-2xl shadow-sm"
          >
            <span>Explore Tours</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myBookings.map((bk) => {
            const matchedTour = tours.find(
              (t) => t.id === bk.tourId || t.slug === bk.tourSlug
            );
            const thumb =
              bk.tourImage || matchedTour?.imageUrl || VISUAL_ASSETS.heroKarakoram;

            return (
              <motion.div
                key={bk.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg shadow-slate-900/5 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={thumb}
                      alt={bk.tourTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto min-h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-emerald-800 text-white text-xs font-semibold px-3 py-1 rounded-2xl">
                        {bk.bookingStatus.replace(/_/g, ' ')}
                      </span>
                      <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1 rounded-2xl">
                        Payment: {bk.paymentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight">
                        {bk.tourTitle}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-2xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-500 block">Travel Dates</span>
                        <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          {bk.travelDates}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Travelers</span>
                        <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                          <Users className="w-3.5 h-3.5 text-teal-600" />
                          {bk.travelers} Person(s)
                        </span>
                      </div>
                    </div>

                    {bk.notes && (
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-800">Notes:</strong> {bk.notes}
                      </p>
                    )}

                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-xs space-y-1">
                      <div className="font-bold text-amber-900">
                        JazzCash Payment ({business.jazzcashNumber} — {business.jazzcashName})
                      </div>
                      <p className="text-slate-600">
                        Confirm dates on WhatsApp before sending deposit.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex flex-col sm:flex-row gap-2.5">
                  {matchedTour && (
                    <Link
                      to={`/tours/${matchedTour.slug}`}
                      className="w-full sm:flex-1 py-2.5 px-4 text-xs font-semibold text-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl"
                    >
                      View Tour Page
                    </Link>
                  )}
                  <a
                    href={buildWhatsAppLink(
                      `Hello Baig Treks & Tours, I am following up on my booking for "${bk.tourTitle}" (${bk.travelDates}, ${bk.travelers} travelers) under ${bk.userEmail}.`,
                      business.whatsapp
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 px-4 text-xs font-semibold text-center bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Confirm on WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {savedTours.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-700" />
            <span>Saved Wishlist Tours ({savedTours.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Dedicated /profile Page to Edit Name/Phone & Change Password
export const ProfilePage: React.FC = () => {
  const {
    user,
    profile,
    privateInfo,
    isAdmin,
    authReady,
    signOut,
    updateCustomerProfile,
    changeCustomerPassword,
  } = useApp();
  const navigate = useNavigate();

  const [nameInput, setNameInput] = useState(
    user?.name || profile?.displayName || ''
  );
  const [phoneInput, setPhoneInput] = useState(
    user?.phone || privateInfo?.phone || ''
  );
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!authReady) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-sm font-semibold text-slate-600">
        Verifying authentication status...
      </div>
    );
  }

  if (!user && !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Login Required
          </h1>
          <p className="text-sm text-slate-600">
            Please log in to manage your profile and password.
          </p>
          <Link
            to="/login?redirect=%2Fprofile"
            className="inline-block px-6 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-2xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCustomerProfile(nameInput, phoneInput);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    const res = await changeCustomerPassword(currentPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.error || 'Could not update password.');
    } else {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold text-emerald-800">Account Management</span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Profile &amp; Security
          </h1>
          <p className="text-sm text-slate-600">{user?.email || ADMIN_EMAIL}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/my-bookings"
            className="px-4 py-2.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl"
          >
            My Bookings
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className="px-4 py-2.5 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Name & Phone */}
        <form
          onSubmit={handleProfileSave}
          className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-lg shadow-slate-900/5"
        >
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
            Personal Information
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ADMIN_EMAIL}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {profileSaved && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-sm"
          >
            Save Profile Changes
          </motion.button>
        </form>

        {/* Change Password */}
        <form
          onSubmit={handlePasswordChange}
          className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-lg shadow-slate-900/5"
        >
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
            Change Password
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {passwordError && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Password changed successfully!</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-sm"
          >
            Update Password
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export const CustomerDashboardPage: React.FC = () => {
  return <MyBookingsPage />;
};
