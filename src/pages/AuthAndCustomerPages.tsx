import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Bookmark,
  MessageCircle,
  Calendar,
  UserCheck,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TourCard } from '../components/InteractiveMapAndScroll';
import { buildWhatsAppLink } from '../config/business';

export const AuthPage: React.FC<{ mode: 'login' | 'signup' | 'forgot' | 'reset' }> = ({
  mode,
}) => {
  const { signInWithGoogle, user, business } = useApp();
  const navigate = useNavigate();

  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
          <UserCheck className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">
          You Are Signed In
        </h1>
        <p className="text-sm text-[#94A3B8]">
          Signed in as <span className="text-white font-semibold">{user.email}</span>
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/customer/dashboard"
            className="px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
          >
            Go to Customer Dashboard
          </Link>
          <Link
            to="/tours"
            className="px-5 py-2.5 text-xs font-semibold bg-white/10 text-white rounded-lg"
          >
            Browse Tours
          </Link>
        </div>
      </div>
    );
  }

  const handleGoogleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle(phoneInput.trim());
      navigate('/customer/dashboard');
    } catch {
      setErrorMsg('Authentication was cancelled or could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#111722] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2 text-center">
          <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
            {business.name} Traveler Portal
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {mode === 'signup'
              ? 'Create Your Traveler Account'
              : mode === 'forgot' || mode === 'reset'
              ? 'Account Recovery'
              : 'Welcome Back'}
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {mode === 'signup'
              ? 'Save tours, track inquiries and bookings, and coordinate your Gilgit-Baltistan journey.'
              : mode === 'forgot' || mode === 'reset'
              ? 'Your account uses verified Google Authentication so you never have to worry about lost passwords.'
              : 'Sign in securely to view your saved tours, inquiries, and trip reservations.'}
          </p>
        </div>

        <form onSubmit={handleGoogleAuth} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                WhatsApp / Phone Number (Optional for Trip Coordination)
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 03155449778"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-xs sm:text-sm font-semibold bg-[#0EA5E9] text-[#0B0F14] hover:bg-[#38BDF8] rounded-lg transition-colors whitespace-nowrap"
          >
            {loading
              ? 'CONNECTING...'
              : mode === 'signup'
              ? 'SIGN UP WITH GOOGLE'
              : 'CONTINUE WITH GOOGLE'}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8]">
          {mode === 'login' ? (
            <>
              <Link to="/signup" className="text-[#0EA5E9] hover:underline">
                Create a new account
              </Link>
              <Link to="/forgot-password" className="hover:text-white">
                Account recovery info
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-[#0EA5E9] hover:underline">
              Already have an account? Log in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Section 20: CUSTOMER DASHBOARD
export const CustomerDashboardPage: React.FC = () => {
  const {
    user,
    profile,
    privateInfo,
    isAdmin,
    tours,
    inquiries,
    bookings,
    business,
    signOut,
    updateCustomerProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'saved' | 'inquiries' | 'bookings' | 'settings'>('saved');
  const [nameInput, setNameInput] = useState(profile?.displayName || '');
  const [phoneInput, setPhoneInput] = useState(privateInfo?.phone || '');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-white">
          Sign In Required
        </h1>
        <p className="text-sm text-[#94A3B8]">
          Please log in to view your saved tours, inquiries, and bookings.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
        >
          GO TO LOGIN
        </Link>
      </div>
    );
  }

  const savedTours = tours.filter((t) => profile?.savedTourIds?.includes(t.id));
  const myInquiries = inquiries.filter((inq) => inq.userId === user.uid);
  const myBookings = bookings.filter((bk) => bk.userId === user.uid);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    await updateCustomerProfile(nameInput, phoneInput);
    setSaveMessage('Profile updated.');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wider">
            Customer Portal
          </div>
          <h1 className="font-display text-3xl font-bold text-white mt-1">
            Welcome, {profile?.displayName || user.displayName || 'Traveler'}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">{user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 text-xs font-semibold border border-[#D4AF37]/50 text-[#D4AF37] rounded-lg flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Open Admin Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 text-white rounded-lg flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'saved', label: `Saved Tours (${savedTours.length})` },
          { id: 'inquiries', label: `My Inquiries (${myInquiries.length})` },
          { id: 'bookings', label: `My Bookings (${myBookings.length})` },
          { id: 'settings', label: 'Account Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#0EA5E9] text-[#0B0F14]'
                : 'bg-[#111722] text-[#CBD5E1] border border-white/10 hover:border-white/25'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Saved Tours */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {savedTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-xl bg-[#111722] border border-white/10 text-center space-y-3">
              <Bookmark className="w-6 h-6 text-[#0EA5E9] mx-auto" />
              <h2 className="font-display text-lg font-bold text-white">
                No Saved Tours Yet
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                Click the bookmark icon on any tour package to save it here for easy comparison.
              </p>
              <Link
                to="/tours"
                className="inline-block px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
              >
                Explore Tours
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {myInquiries.length > 0 ? (
            myInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 rounded-xl bg-[#111722] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <span className="font-semibold text-[#0EA5E9] uppercase">
                      Status: {inq.status}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{inq.destination}</span>
                    <span aria-hidden="true">·</span>
                    <span>{inq.travelers} Travelers</span>
                  </div>
                  <div className="font-display text-base font-bold text-white">
                    {inq.tourType} — Preferred Dates: {inq.preferredDates}
                  </div>
                  <p className="text-xs text-[#CBD5E1]">{inq.message}</p>
                </div>
                <a
                  href={buildWhatsAppLink(
                    `Hello ${business.name}, following up on my inquiry for ${inq.destination} (${inq.preferredDates}).`,
                    business.whatsapp
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg whitespace-nowrap flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Follow Up on WhatsApp
                </a>
              </div>
            ))
          ) : (
            <div className="p-10 rounded-xl bg-[#111722] border border-white/10 text-center space-y-3">
              <h2 className="font-display text-lg font-bold text-white">
                No Inquiries Submitted Yet
              </h2>
              <Link
                to="/contact"
                className="inline-block px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
              >
                Submit a Travel Inquiry
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Bookings & Payment Status */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {myBookings.length > 0 ? (
            <div className="space-y-4">
              {myBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-6 rounded-xl bg-[#111722] border border-white/10 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {bk.tourTitle}
                      </h3>
                      <div className="text-xs text-[#94A3B8] mt-0.5">
                        Dates: {bk.travelDates} · Travelers: {bk.travelers}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[#E2E8F0]">
                        Booking: {bk.bookingStatus.replace('_', ' ')}
                      </span>
                      <span className="px-3 py-1 rounded bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37]">
                        Payment: {bk.paymentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#CBD5E1]">{bk.notes}</p>
                  <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-white font-semibold">JazzCash Payment: </span>
                      <span className="font-mono-num text-[#D4AF37]">
                        {business.jazzcashNumber}
                      </span>{' '}
                      ({business.jazzcashName})
                    </div>
                    <a
                      href={buildWhatsAppLink(
                        `Hello ${business.name}, I am checking on my booking request for "${bk.tourTitle}" (${bk.travelDates}).`,
                        business.whatsapp
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10B981] font-semibold hover:underline"
                    >
                      Confirm Availability / Share Receipt on WhatsApp →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-xl bg-[#111722] border border-white/10 text-center space-y-3">
              <Calendar className="w-6 h-6 text-[#0EA5E9] mx-auto" />
              <h2 className="font-display text-lg font-bold text-white">
                No Active Booking Requests
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                Select any tour package to request availability and track your reservation status here.
              </p>
              <Link
                to="/tours"
                className="inline-block px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
              >
                Browse Tour Packages
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Account Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-xl bg-[#111722] border border-white/10 rounded-xl p-6 space-y-5">
          <h2 className="font-display text-xl font-bold text-white">
            Profile &amp; Contact Settings
          </h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="03155449778"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F14] border border-white/15 text-sm text-white"
              />
            </div>
            {saveMessage && (
              <div className="text-xs text-[#10B981] font-semibold">{saveMessage}</div>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
