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
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useApp, ADMIN_EMAIL } from '../context/AppContext';
import { buildWhatsAppLink } from '../config/business';
import { BrandLogo } from './BrandLogo';
import { SEOHead } from './SEOHead';

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
    { label: 'About Us', to: '/about' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'FAQs', to: '/#faqs' },
    { label: 'Contact', to: '/contact' },
  ];

  const defaultWaLink = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I would like to inquire about Gilgit-Baltistan tours and expeditions.`,
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#242824] overflow-x-hidden pb-16 md:pb-0">
      <SEOHead />

      {/* TOP ANNOUNCEMENT BAR: Local Expertise & 24/7 WhatsApp Assistance */}
      <div className="bg-[#0F261F] text-[#F4EFDF] border-b border-[#B99A58]/25 text-xs py-2 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B99A58] animate-pulse" />
            <span className="font-medium tracking-wide">
              Beyond the Mountains · Authentic Gilgit-Baltistan Expeditions with Local Guides
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#F4EFDF]/85">
            <a
              href={defaultWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#B99A58] flex items-center gap-1.5 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#B99A58]" />
              <span>WhatsApp: {business.phone}</span>
            </a>
            <span className="text-[#B99A58]/40">|</span>
            <a
              href={`mailto:${business.email}`}
              className="hover:text-[#B99A58] flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#B99A58]" />
              <span>{business.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* LUXURY FOREST GREEN STICKY HEADER */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#183C30]/95 backdrop-blur-xl border-b border-[#B99A58]/30 shadow-xl shadow-[#0F261F]/20'
            : 'bg-[#183C30] border-b border-[#B99A58]/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 md:h-20 flex items-center justify-between gap-3">
          {/* Logo with Karakoram Emblem & BAIG TREKS & TOURS Wordmark */}
          <Link
            to="/"
            className="shrink-0 focus:outline-none focus:ring-2 focus:ring-[#B99A58] rounded-2xl p-1 -m-1"
            aria-label="Baig Treks & Tours Homepage"
          >
            <BrandLogo layout="horizontal" variant="dark" size="sm" showTagline={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-[#F4EFDF]"
          >
            {navItems.map((item) => {
              const isFaq = item.to.startsWith('/#');
              const active = !isFaq && location.pathname === item.to;
              return isFaq ? (
                <a
                  key={item.to}
                  href={item.to}
                  className="px-3.5 py-2 rounded-xl text-[#F4EFDF]/90 hover:text-white hover:bg-[#24342D]/70 transition-all duration-200 whitespace-nowrap"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3.5 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                    active
                      ? 'text-white bg-[#24342D] border border-[#B99A58]/40 font-semibold shadow-xs'
                      : 'text-[#F4EFDF]/90 hover:text-white hover:bg-[#24342D]/70'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Admin Quick Link */}
              {isAdmin && (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/admin"
                    className="px-3 py-2 text-xs font-bold text-[#F4EFDF] bg-[#24342D] border border-[#B99A58]/50 hover:border-[#B99A58] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#B99A58]" />
                    <span>Admin</span>
                  </Link>
                </motion.div>
              )}

              {/* User Dropdown or Sign In */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="px-3 py-2 text-xs font-semibold text-[#F4EFDF] bg-[#24342D] border border-[#B99A58]/30 hover:border-[#B99A58]/70 rounded-xl shadow-xs flex items-center gap-2 transition-all"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#B99A58] text-[#183C30] text-[10px] font-bold flex items-center justify-center">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                    <span className="max-w-[100px] truncate">{displayName}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#B99A58] transition-transform duration-200 ${
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
                        className="absolute right-0 mt-2 w-56 bg-[#183C30] border border-[#B99A58]/40 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-[#F4EFDF]"
                      >
                        <div className="px-3 py-2 border-b border-[#24342D]">
                          <div className="text-xs font-bold text-white truncate">
                            {displayName}
                          </div>
                          <div className="text-[11px] text-[#F4EFDF]/70 truncate">
                            {user?.email || profile?.email || ADMIN_EMAIL}
                          </div>
                        </div>

                        <Link
                          to="/my-bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2 text-xs font-medium text-[#F4EFDF] hover:text-white hover:bg-[#24342D] rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-[#B99A58]" />
                          <span>My Bookings</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2 text-xs font-medium text-[#F4EFDF] hover:text-white hover:bg-[#24342D] rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#B99A58]" />
                          <span>Profile Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-3 py-2 text-xs font-semibold text-[#B99A58] bg-[#24342D] hover:bg-[#24342D]/80 rounded-xl flex items-center gap-2.5 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-[#B99A58]" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <div className="pt-1 border-t border-[#24342D]">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 rounded-xl flex items-center gap-2.5 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs font-medium">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-[#F4EFDF] hover:text-white hover:bg-[#24342D]/60 rounded-xl transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}

              {/* PRIMARY CTA: Plan Your Trip (Gold Luxury Button) */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="/#inquiry"
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#B99A58] hover:bg-[#A38443] text-[#183C30] rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Your Trip</span>
                </a>
              </motion.div>

              {/* WhatsApp Quick Icon */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={defaultWaLink}
                target="_blank"
                rel="noopener noreferrer"
                title={`Chat on WhatsApp (${business.phone})`}
                aria-label="Chat on WhatsApp"
                className="p-2.5 bg-[#24342D] hover:bg-[#1E4D3E] border border-[#B99A58]/40 text-[#B99A58] hover:text-white rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.a>
            </div>

            {/* Mobile & Tablet User Icon + Hamburger */}
            {isLoggedIn && (
              <Link
                to="/my-bookings"
                className="md:hidden px-2 py-1.5 text-xs font-semibold text-[#F4EFDF] bg-[#24342D] border border-[#B99A58]/30 rounded-lg flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-[#B99A58]" />
                <span className="max-w-[70px] truncate">{displayName}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 text-[#F4EFDF] hover:text-white bg-[#24342D] hover:bg-[#1E4D3E] border border-[#B99A58]/30 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ACCESSIBLE MOBILE MENU DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="lg:hidden bg-[#183C30] border-t border-[#B99A58]/25 shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-5 space-y-4">
                <nav className="grid grid-cols-1 gap-1">
                  {navItems.map((item) => {
                    const isFaq = item.to.startsWith('/#');
                    const active = !isFaq && location.pathname === item.to;
                    return isFaq ? (
                      <a
                        key={item.to}
                        href={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-xl text-sm font-medium text-[#F4EFDF] hover:bg-[#24342D] transition-colors flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                          active
                            ? 'bg-[#24342D] text-white font-bold border-l-4 border-[#B99A58]'
                            : 'text-[#F4EFDF] hover:bg-[#24342D]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-[#B99A58]" />}
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-3 border-t border-[#B99A58]/20 flex flex-col gap-2.5">
                  <a
                    href="/#inquiry"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-center bg-[#B99A58] hover:bg-[#A38443] text-[#183C30] rounded-xl flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Plan Your Trip</span>
                  </a>

                  <a
                    href={defaultWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 text-xs font-bold text-center bg-[#24342D] hover:bg-[#1E4D3E] text-[#F4EFDF] border border-[#B99A58]/40 rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-[#B99A58]" />
                    <span>Chat on WhatsApp ({business.phone})</span>
                  </a>

                  {isLoggedIn ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/my-bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 text-xs font-semibold text-center bg-[#24342D] text-[#F4EFDF] rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#B99A58]" />
                        <span>Bookings</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="py-2.5 px-3 text-xs font-semibold text-center bg-rose-950/40 text-rose-300 border border-rose-900/50 rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 text-xs font-semibold text-center bg-[#24342D] text-[#F4EFDF] rounded-xl"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 text-xs font-semibold text-center bg-[#F4EFDF] text-[#183C30] rounded-xl font-bold"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 px-4 text-xs font-bold text-center bg-[#24342D] border border-[#B99A58] text-[#B99A58] rounded-xl flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Notification Banner */}
      {signupNotificationNote && (
        <div className="bg-[#183C30] text-[#F4EFDF] border-b border-[#B99A58]/30 px-4 py-2.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B99A58] shrink-0" />
              <span>{signupNotificationNote}</span>
            </span>
            <button
              type="button"
              onClick={clearSignupNotificationNote}
              className="text-[#B99A58] hover:text-white font-semibold underline underline-offset-2 shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {/* LUXURY FOOTER: Deep Pine Background & Gold Accents */}
      <footer className="bg-[#12261E] text-[#F4EFDF] pt-14 md:pt-20 pb-12 border-t border-[#B99A58]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-[#24342D]">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-block">
                <BrandLogo layout="stacked" variant="dark" size="md" showTagline={false} />
              </Link>
              <p className="text-xs sm:text-sm text-[#F4EFDF]/80 leading-relaxed font-normal">
                A premium local travel company specializing in authentic journeys through Gilgit-Baltistan, Pakistan.
              </p>
              <div className="pt-2 p-3.5 rounded-2xl bg-[#183C30]/70 border border-[#B99A58]/25 text-xs space-y-1.5">
                <div className="font-serif italic text-[#B99A58] text-sm font-semibold">
                  “Beyond the Mountains. Discover Gilgit-Baltistan.”
                </div>
                <div className="text-[11px] text-[#F4EFDF]/75">
                  Authentic journeys. Extraordinary landscapes. Local expertise.
                </div>
              </div>
            </div>

            {/* Quick Links & Tour Destinations */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#B99A58]">
                Expeditions &amp; Valleys
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-xs text-[#F4EFDF]/80">
                <li>
                  <Link to="/tours" className="hover:text-[#B99A58] transition-colors">
                    All Tour Packages
                  </Link>
                </li>
                <li>
                  <Link to="/destinations" className="hover:text-[#B99A58] transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/hunza" className="hover:text-[#B99A58] transition-colors">
                    Hunza Valley
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/skardu" className="hover:text-[#B99A58] transition-colors">
                    Skardu &amp; Baltistan
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/passu" className="hover:text-[#B99A58] transition-colors">
                    Passu Cones
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/attabad-lake" className="hover:text-[#B99A58] transition-colors">
                    Attabad Lake
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/fairy-meadows" className="hover:text-[#B99A58] transition-colors">
                    Fairy Meadows
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/deosai" className="hover:text-[#B99A58] transition-colors">
                    Deosai Plains
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/khaplu" className="hover:text-[#B99A58] transition-colors">
                    Khaplu Palace
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/shigar" className="hover:text-[#B99A58] transition-colors">
                    Shigar Fort
                  </Link>
                </li>
              </ul>
            </div>

            {/* Verified Contact Details & Social */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#B99A58]">
                Contact &amp; Inquiries
              </h3>
              <div className="space-y-2.5 text-xs">
                <a
                  href={defaultWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#F4EFDF] hover:text-[#B99A58] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#B99A58] shrink-0" />
                  <span>WhatsApp: {business.phone}</span>
                </a>
                <a
                  href={`tel:${business.phoneInternational}`}
                  className="flex items-center gap-2 text-[#F4EFDF] hover:text-[#B99A58] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#B99A58] shrink-0" />
                  <span>Direct: {business.phone}</span>
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-2 text-[#F4EFDF] hover:text-[#B99A58] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#B99A58] shrink-0" />
                  <span>{business.email}</span>
                </a>
                <div className="flex items-center gap-2 text-[#F4EFDF]/75">
                  <MapPin className="w-4 h-4 text-[#B99A58] shrink-0" />
                  <span>Gilgit &amp; Skardu, Gilgit-Baltistan</span>
                </div>

                <div className="pt-2 border-t border-[#24342D] space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#B99A58] uppercase tracking-wider">
                    Official Instagram
                  </div>
                  {business.instagram.map((ig) => (
                    <a
                      key={ig.handle}
                      href={ig.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#F4EFDF]/80 hover:text-white transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5 text-[#B99A58] shrink-0" />
                      <span>{ig.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Payment Security & JazzCash Card */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#B99A58]">
                Payment Advisory
              </h3>
              <div className="p-3.5 rounded-2xl bg-[#183C30]/80 border border-[#B99A58]/30 space-y-2 text-xs">
                <div className="text-[#B99A58] font-bold text-[11px] tracking-wide uppercase">
                  JazzCash Official Account
                </div>
                <div className="text-[#F4EFDF]/90">
                  Number:{' '}
                  <span className="font-mono-num text-white font-bold tracking-wider">
                    {business.jazzcashNumber}
                  </span>
                </div>
                <div className="text-[#F4EFDF]/90">
                  Title:{' '}
                  <span className="text-white font-semibold">{business.jazzcashName}</span>
                </div>
                <p className="text-[10px] text-[#F4EFDF]/70 pt-1 leading-normal border-t border-[#24342D]">
                  Verify dates with our team via WhatsApp prior to sending advances.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4EFDF]/70 text-center sm:text-left">
            <div>
              © 2026 <strong className="text-[#F4EFDF]">Baig Treks &amp; Tours</strong>. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/about" className="hover:text-[#B99A58] transition-colors">
                About Us
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/contact" className="hover:text-[#B99A58] transition-colors">
                Contact &amp; Location
              </Link>
              <span aria-hidden="true">·</span>
              <a
                href={defaultWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B99A58] hover:underline font-semibold"
              >
                WhatsApp: {business.phone}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* DESKTOP FLOATING WHATSAPP BUTTON (Forest Green + Gold Accent) */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={defaultWaLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Baig Treks & Tours on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#183C30] hover:bg-[#0F261F] text-[#F4EFDF] border border-[#B99A58] text-xs font-bold uppercase tracking-wider shadow-2xl shadow-black/40 transition-all"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B99A58] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B99A58]" />
        </span>
        <MessageCircle className="w-4 h-4 text-[#B99A58]" />
        <span>Chat on WhatsApp</span>
      </motion.a>

      {/* MOBILE BOTTOM FLOATING NAVIGATION BAR */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#183C30]/95 backdrop-blur-xl border-t border-[#B99A58]/25 grid ${
          isLoggedIn ? 'grid-cols-4' : 'grid-cols-3'
        } h-15 text-[11px] font-semibold text-[#F4EFDF] shadow-2xl`}
      >
        <Link
          to="/tours"
          className="flex flex-col items-center justify-center gap-0.5 hover:text-[#B99A58] border-r border-[#24342D]"
        >
          <Compass className="w-4 h-4 text-[#B99A58]" />
          <span>Tours</span>
        </Link>
        {isLoggedIn && (
          <Link
            to="/my-bookings"
            className="flex flex-col items-center justify-center gap-0.5 text-white bg-[#24342D]/50 border-r border-[#24342D]"
          >
            <Calendar className="w-4 h-4 text-[#B99A58]" />
            <span>Bookings</span>
          </Link>
        )}
        <a
          href="/#inquiry"
          className="flex flex-col items-center justify-center gap-0.5 hover:text-[#B99A58] border-r border-[#24342D]"
        >
          <Sparkles className="w-4 h-4 text-[#B99A58]" />
          <span>Plan Trip</span>
        </a>
        <a
          href={defaultWaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 bg-[#B99A58] text-[#183C30] font-bold"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
