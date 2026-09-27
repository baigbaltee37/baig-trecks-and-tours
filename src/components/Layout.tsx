import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Shield,
  User,
  LogOut,
  Compass,
  Calendar,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { useApp, ADMIN_EMAIL } from '../context/AppContext';
import { buildWhatsAppLink } from '../config/business';
import { BrandLogo3D } from './BrandLogo3D';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    business,
    user,
    profile,
    isAdmin,
    signOut,
    signupNotificationNote,
    clearSignupNotificationNote,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo(0, 0);

    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute('content', canonicalUrl);
    }
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Tours', to: '/tours' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'Experiences', to: '/experiences' },
    { label: 'About', to: '/about' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Travel Guides', to: '/travel-guides' },
    { label: 'Contact', to: '/contact' },
  ];

  const defaultWaLink = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I would like to inquire about Gilgit-Baltistan tours and travel packages.`,
    business.whatsapp
  );

  const isLoggedIn = Boolean(user || isAdmin);
  const displayName = user?.name || profile?.displayName || (isAdmin ? 'Admin' : 'Traveler');

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 bg-grid-pattern text-slate-900 overflow-x-hidden pb-16 md:pb-0">
      {/* 2026 Ultra-Premium Sticky Navbar with Blur on Scroll */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-lg shadow-slate-900/5'
            : 'bg-white/70 backdrop-blur-md border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-3">
          {/* Modern Mountain "B" Logo */}
          <Link to="/" className="shrink-0 focus:outline-none">
            <BrandLogo3D size="sm" variant="light" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-semibold text-slate-700"
          >
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-2xl transition-all duration-200 whitespace-nowrap ${
                    active
                      ? 'text-white bg-emerald-700 font-bold shadow-2xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: User Dropdown OR Login/Signup + Animated Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              {isAdmin && (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/admin"
                    className="px-3.5 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-2xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                </motion.div>
              )}

              {isLoggedIn ? (
                /* Logged-in User Dropdown Menu: My Bookings, Profile, Logout */
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="px-3.5 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl shadow-xs flex items-center gap-2 transition-all"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-xl p-2 z-50 space-y-1"
                      >
                        <div className="px-3 py-2 border-b border-slate-100">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {displayName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {user?.email || profile?.email || ADMIN_EMAIL}
                          </div>
                        </div>

                        <Link
                          to="/my-bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-2xl flex items-center gap-2.5 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-emerald-700" />
                          <span>My Bookings</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-2xl flex items-center gap-2.5 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-teal-600" />
                          <span>Profile Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 rounded-2xl flex items-center gap-2.5 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-emerald-700" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <div className="pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-2xl flex items-center gap-2.5 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/signup"
                      className="px-4 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-300 hover:border-emerald-600 rounded-2xl shadow-2xs transition-colors"
                    >
                      Signup
                    </Link>
                  </motion.div>
                </>
              )}

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={defaultWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-2xl shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </motion.a>
            </div>

            {/* Mobile Quick Status & Animated Hamburger Button */}
            {isLoggedIn && (
              <Link
                to="/my-bookings"
                className="md:hidden px-2.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/80 border border-emerald-200 rounded-xl flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span className="max-w-[72px] truncate">{displayName}</span>
              </Link>
            )}

            <motion.button
              whileTap={{ scale: 0.93 }}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl border border-slate-200/90 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Animated Mobile & Tablet Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 overflow-hidden shadow-xl"
            >
              <div className="px-4 pt-4 pb-6 space-y-4">
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {navItems.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full px-4 py-3 rounded-2xl text-sm font-medium transition-colors flex items-center justify-between ${
                          active
                            ? 'bg-emerald-50 text-emerald-800 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.label}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-emerald-700" />}
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{displayName}</div>
                            <div className="text-[11px] text-slate-500">
                              {user?.email || profile?.email || ADMIN_EMAIL}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Link
                          to="/my-bookings"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full py-3 px-4 text-sm font-semibold text-center bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>My Bookings</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full py-3 px-4 text-sm font-semibold text-center bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center gap-2"
                        >
                          <Settings className="w-4 h-4 text-teal-600" />
                          <span>Profile</span>
                        </Link>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full py-3 px-4 text-sm font-semibold text-center bg-emerald-800 text-white rounded-2xl flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full py-3 px-4 text-sm font-semibold text-center bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-3 px-4 text-sm font-semibold text-center bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-3 px-4 text-sm font-semibold text-center bg-emerald-800 text-white rounded-2xl"
                      >
                        Signup
                      </Link>
                    </div>
                  )}

                  <a
                    href={defaultWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 text-sm font-semibold text-center bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-2xl flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp ({business.phone})</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Signup / System Notification Banner */}
      {signupNotificationNote && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 text-xs md:text-sm text-emerald-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <span>{signupNotificationNote}</span>
            <button
              type="button"
              onClick={clearSignupNotificationNote}
              className="text-emerald-800 hover:text-emerald-950 font-semibold whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {/* 2026 Premium Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-12 md:pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pb-10 border-b border-slate-800/80">
            {/* Brand & Description */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-block">
                <BrandLogo3D size="md" variant="dark" />
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                {business.tagline}
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <div>{business.locationLabel}</div>
                {business.address && <div>Address: {business.address}</div>}
                {business.businessHours && <div>Hours: {business.businessHours}</div>}
              </div>
            </div>

            {/* Explore Links */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="hover:text-emerald-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/my-bookings" className="hover:text-emerald-400 transition-colors">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-emerald-400 transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Contact &amp; Social</h3>
              <div className="space-y-2.5 text-sm">
                <a
                  href={`tel:+92${business.phone.replace(/^0/, '')}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{business.phone}</span>
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{business.email}</span>
                </a>
                <div className="pt-1 space-y-1.5">
                  {business.instagram.map((ig) => (
                    <a
                      key={ig.handle}
                      href={ig.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Instagram className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{ig.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* JazzCash Payment Card */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-white tracking-tight">JazzCash Payment</h3>
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                <div className="text-emerald-400 font-semibold">Official Account</div>
                <div className="text-slate-300">
                  Number:{' '}
                  <span className="font-mono-num text-white font-semibold">
                    {business.jazzcashNumber}
                  </span>
                </div>
                <div className="text-slate-300">
                  Title: <span className="text-white font-semibold">{business.jazzcashName}</span>
                </div>
                <p className="text-slate-400 pt-1 leading-normal">
                  Confirm tour dates before sending payment.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400 text-center sm:text-left">
            <div>© 2026 Baig Treks &amp; Tours. All rights reserved.</div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span>
                JazzCash: {business.jazzcashNumber} ({business.jazzcashName})
              </span>
              <span aria-hidden="true">·</span>
              <a
                href={defaultWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-medium"
              >
                WhatsApp: {business.phone}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Desktop Floating WhatsApp Button */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        href={defaultWaLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 px-4 py-3 rounded-3xl bg-emerald-700 text-white font-semibold text-sm shadow-xl shadow-emerald-900/25 hover:bg-emerald-800 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Chat on WhatsApp</span>
      </motion.a>

      {/* Mobile Bottom Navigation Bar */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 grid ${
          isLoggedIn ? 'grid-cols-4' : 'grid-cols-3'
        } h-14 text-xs font-semibold shadow-lg`}
      >
        <Link
          to="/tours"
          className="flex flex-col items-center justify-center gap-0.5 text-slate-700 hover:text-emerald-700 border-r border-slate-100"
        >
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>Tours</span>
        </Link>
        {isLoggedIn && (
          <Link
            to="/my-bookings"
            className="flex flex-col items-center justify-center gap-0.5 text-emerald-800 bg-emerald-50/50 border-r border-slate-100"
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>My Bookings</span>
          </Link>
        )}
        <Link
          to="/contact"
          className="flex flex-col items-center justify-center gap-0.5 text-slate-700 hover:text-emerald-700 border-r border-slate-100"
        >
          <Mail className="w-4 h-4 text-teal-600" />
          <span>Inquire</span>
        </Link>
        <a
          href={defaultWaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 bg-emerald-700 text-white"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
