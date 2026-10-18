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
  Mountain,
  Heart,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    { label: 'Tours & Packages', to: '/tours' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'Experiences', to: '/experiences' },
    { label: 'About Us', to: '/about' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Travel Guides', to: '/travel-guides' },
    { label: 'Contact', to: '/contact' },
  ];

  const defaultWaLink = buildWhatsAppLink(
    `Hello Baig Treks & Tours, I would like to inquire about private tours and custom itineraries in Northern Pakistan.`,
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
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#252B27] overflow-x-hidden selection:bg-[#174734] selection:text-[#F8F6F0]">
      <SEOHead />

      {/* REFINED TOP CONTACT & ANNOUNCEMENT BAR */}
      <div className="bg-[#102B24] text-white/90 text-xs py-2 px-4 hidden sm:block border-b border-[#174734]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#C5A46D] font-medium">
              <Mountain className="w-3.5 h-3.5" />
              <span>Certified Local Guides · Gilgit-Baltistan &amp; Northern Pakistan</span>
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <a
              href={`tel:${business.phoneInternational}`}
              className="hover:text-[#C5A46D] flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C5A46D]" />
              <span>{business.phone}</span>
            </a>
            <span className="text-white/20">|</span>
            <a
              href={`mailto:${business.email}`}
              className="hover:text-[#C5A46D] flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3 h-3 text-[#C5A46D]" />
              <span>{business.email}</span>
            </a>
            <span className="text-white/20">|</span>
            <a
              href={defaultWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C5A46D] flex items-center gap-1.5 transition-colors font-medium text-[#C5A46D]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* REFINED WARM IVORY NAVBAR HEADER */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F8F6F0]/95 backdrop-blur-md border-b border-[#E8E4D9] shadow-md shadow-[#174734]/5'
            : 'bg-[#F8F6F0] border-b border-[#E8E4D9]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-22 flex items-center justify-between gap-4">
          {/* Brand Logo with Mountain Emblem & Elegant Serif Wordmark */}
          <Link
            to="/"
            className="shrink-0 focus:outline-none focus:ring-2 focus:ring-[#174734]/20 rounded-xl p-1 -m-1"
            aria-label="Baig Treks & Tours Homepage"
          >
            <BrandLogo layout="horizontal" variant="light" size="sm" showTagline={true} />
          </Link>

          {/* Clean Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-[#252B27]"
          >
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                    active
                      ? 'text-[#174734] font-bold bg-[#EAE6DB]'
                      : 'text-[#252B27]/85 hover:text-[#174734] hover:bg-[#F0EDE4]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Admin Quick Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-1.5 text-xs font-semibold text-[#174734] bg-[#EAE6DB] hover:bg-[#DED7C8] rounded-full border border-[#D9D3C3] transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-[#174734]" />
                  <span>Admin</span>
                </Link>
              )}

              {/* User Account Dropdown */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#174734] bg-white border border-[#E8E4D9] rounded-full hover:border-[#174734]/30 shadow-xs transition-colors"
                  >
                    <User className="w-4 h-4 text-[#174734]" />
                    <span className="max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#808D86]" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-[#E8E4D9] rounded-2xl shadow-xl py-2 z-50 text-sm"
                      >
                        <div className="px-4 py-2 border-b border-[#E8E4D9]/60">
                          <p className="text-xs text-[#808D86]">Signed in as</p>
                          <p className="font-semibold text-[#174734] truncate">
                            {user?.email || (isAdmin ? 'Admin' : displayName)}
                          </p>
                        </div>

                        <Link
                          to="/my-bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-4 py-2.5 text-[#252B27] hover:bg-[#F8F6F0] hover:text-[#174734] flex items-center gap-2.5 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-[#C5A46D]" />
                          <span>My Bookings</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-4 py-2.5 text-[#252B27] hover:bg-[#F8F6F0] hover:text-[#174734] flex items-center gap-2.5 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#C5A46D]" />
                          <span>Profile &amp; Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-4 py-2.5 font-medium text-[#174734] hover:bg-[#F8F6F0] flex items-center gap-2.5 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-[#174734]" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        <div className="pt-1 mt-1 border-t border-[#E8E4D9]/60">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors text-left"
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
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-[#252B27] hover:text-[#174734] transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* TASTEFUL DEEP FOREST GREEN PRIMARY CTA */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="/#plan-trip"
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#174734] hover:bg-[#0D2B20] rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
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
                title={`Chat with us on WhatsApp (${business.phone})`}
                aria-label="Direct WhatsApp Chat"
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.a>
            </div>

            {/* Mobile & Tablet User Icon + Hamburger */}
            {isLoggedIn && (
              <Link
                to="/my-bookings"
                className="md:hidden px-2.5 py-1.5 text-xs font-semibold text-[#174734] bg-white border border-[#E8E4D9] rounded-full flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-[#174734]" />
                <span className="max-w-[70px] truncate">{displayName}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-[#174734] bg-white hover:bg-[#F0EDE4] border border-[#E8E4D9] rounded-full transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#F8F6F0] border-b border-[#E8E4D9] shadow-xl overflow-hidden"
            >
              <div className="px-5 py-5 space-y-4">
                {/* Mobile Drawer Brand Logo Header */}
                <div className="pb-3 border-b border-[#E8E4D9] flex items-center justify-between">
                  <BrandLogo layout="horizontal" variant="light" size="sm" showTagline={false} />
                  <span className="text-[11px] font-semibold text-[#174734] bg-white px-2.5 py-1 rounded-full border border-[#E8E4D9]">
                    Verified DTS
                  </span>
                </div>

                <nav className="grid grid-cols-1 gap-1">
                  {navItems.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 text-sm font-medium rounded-xl transition-all flex items-center justify-between ${
                          active
                            ? 'bg-[#174734] text-white font-semibold shadow-xs'
                            : 'text-[#252B27] hover:bg-white hover:text-[#174734]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-4 h-4 opacity-40" />
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-3 border-t border-[#E8E4D9] space-y-2.5">
                  <a
                    href="/#plan-trip"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 text-sm font-semibold rounded-full bg-[#174734] text-white shadow-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#C5A46D]" />
                    <span>Plan Your Adventure</span>
                  </a>

                  <a
                    href={defaultWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <span>WhatsApp: {business.phone}</span>
                  </a>

                  {!isLoggedIn && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 text-xs font-semibold rounded-full text-center bg-white border border-[#E8E4D9] text-[#252B27]"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 text-xs font-semibold rounded-full text-center bg-[#174734] text-white"
                      >
                        Register
                      </Link>
                    </div>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 px-4 text-xs font-semibold rounded-full text-center bg-[#EAE6DB] text-[#174734] border border-[#D9D3C3] flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Console</span>
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
        <div className="bg-[#174734] text-white px-4 py-2.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0" />
              <span>{signupNotificationNote}</span>
            </span>
            <button
              type="button"
              onClick={clearSignupNotificationNote}
              className="text-[#C5A46D] hover:text-white font-semibold underline underline-offset-2 shrink-0 text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {/* REFINED LUXURY FOOTER (Deep Forest Green #102B24) */}
      <footer className="bg-[#102B24] text-white pt-16 pb-12 border-t border-[#174734]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/10">
            {/* Brand Column with Photo Emblem */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-block">
                <BrandLogo layout="stacked" variant="dark" size="md" showTagline={false} />
              </Link>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                BAIG TREKS &amp; TOURS is a licensed expedition and travel operator based in Skardu &amp; Gilgit, crafting unforgettable, respectful journeys through Hunza, Skardu, Fairy Meadows, and the Karakoram mountains of Northern Pakistan.
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-1.5">
                <div className="text-[#C5A46D] font-semibold text-xs flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Licensed Department of Tourist Services (DTS)</span>
                </div>
                <div className="text-white/65 leading-relaxed">
                  Govt. of Pakistan Certified Alpine &amp; Cultural Guides. Over a decade of native mountain hospitality.
                </div>
              </div>
            </div>

            {/* Popular Destinations */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-serif text-base font-semibold text-[#C5A46D] tracking-wide">
                Popular Destinations
              </h3>
              <ul className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-white/75">
                <li>
                  <Link to="/destinations/hunza" className="hover:text-[#C5A46D] transition-colors">
                    Hunza Valley
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/skardu" className="hover:text-[#C5A46D] transition-colors">
                    Skardu &amp; Baltistan
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/fairy-meadows" className="hover:text-[#C5A46D] transition-colors">
                    Fairy Meadows &amp; Nanga Parbat
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/deosai" className="hover:text-[#C5A46D] transition-colors">
                    Deosai National Park
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/attabad-lake" className="hover:text-[#C5A46D] transition-colors">
                    Attabad Lake &amp; Upper Hunza
                  </Link>
                </li>
                <li>
                  <Link to="/destinations/khaplu" className="hover:text-[#C5A46D] transition-colors">
                    Khaplu Palace &amp; Shigar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links & Info */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-serif text-base font-semibold text-[#C5A46D] tracking-wide">
                Explore &amp; Company
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-white/75">
                <li>
                  <Link to="/tours" className="hover:text-[#C5A46D] transition-colors">
                    Tour Packages
                  </Link>
                </li>
                <li>
                  <Link to="/destinations" className="hover:text-[#C5A46D] transition-colors">
                    All Destinations
                  </Link>
                </li>
                <li>
                  <Link to="/experiences" className="hover:text-[#C5A46D] transition-colors">
                    Signature Experiences
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#C5A46D] transition-colors">
                    About Baig Treks
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="hover:text-[#C5A46D] transition-colors">
                    Photo Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/travel-guides" className="hover:text-[#C5A46D] transition-colors">
                    Travel Guides &amp; Tips
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#C5A46D] transition-colors">
                    Contact &amp; Bookings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Verified Contact Details & Advisory */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-serif text-base font-semibold text-[#C5A46D] tracking-wide">
                Get in Touch
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <a
                  href={defaultWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/90 hover:text-[#C5A46D] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A46D] shrink-0" />
                  <span>WhatsApp: {business.phone}</span>
                </a>
                <a
                  href={`tel:${business.phoneInternational}`}
                  className="flex items-center gap-2 text-white/90 hover:text-[#C5A46D] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" />
                  <span>Direct: {business.phone}</span>
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-2 text-white/90 hover:text-[#C5A46D] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#C5A46D] shrink-0" />
                  <span>{business.email}</span>
                </a>
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0" />
                  <span>Skardu &amp; Gilgit, Gilgit-Baltistan</span>
                </div>

                {/* Verified Payment Advisory */}
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 text-xs mt-3">
                  <div className="text-[#C5A46D] font-semibold text-[11px] uppercase tracking-wider">
                    Official JazzCash Account
                  </div>
                  <div className="text-white/80">
                    Number: <strong className="text-white">{business.jazzcashNumber}</strong>
                  </div>
                  <div className="text-white/80">
                    Title: <span className="text-white font-medium">{business.jazzcashName}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-1.5">
                  <div className="text-xs font-semibold text-[#C5A46D]">
                    Follow Our Adventures
                  </div>
                  {business.instagram.map((ig) => (
                    <a
                      key={ig.handle}
                      href={ig.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs"
                    >
                      <Instagram className="w-3.5 h-3.5 text-[#C5A46D] shrink-0" />
                      <span>{ig.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 text-center sm:text-left">
            <div>
              © 2026 <strong className="text-white">Baig Treks &amp; Tours</strong>. Handcrafted with pride in Northern Pakistan.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link to="/about" className="hover:text-[#C5A46D] transition-colors">
                About Us
              </Link>
              <span>·</span>
              <Link to="/contact" className="hover:text-[#C5A46D] transition-colors">
                Contact
              </Link>
              <span>·</span>
              <a
                href={defaultWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5A46D] hover:underline"
              >
                Direct WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP PILL BUTTON (Refined Emerald & White) */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={defaultWaLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Baig Treks & Tours on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3 bg-[#174734] hover:bg-[#0D2B20] text-white text-xs font-semibold rounded-full shadow-lg border border-white/20 transition-all"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A46D] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5A46D]" />
        </span>
        <MessageCircle className="w-4 h-4 text-[#C5A46D]" />
        <span>Chat on WhatsApp</span>
      </motion.a>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F6F0]/95 backdrop-blur-md border-t border-[#E8E4D9] grid ${
          isLoggedIn ? 'grid-cols-4' : 'grid-cols-3'
        } h-16 text-[11px] font-semibold text-[#252B27] shadow-lg`}
      >
        <Link
          to="/tours"
          className="flex flex-col items-center justify-center gap-0.5 hover:text-[#174734] border-r border-[#E8E4D9]"
        >
          <Compass className="w-4 h-4 text-[#174734]" />
          <span>Tours</span>
        </Link>
        {isLoggedIn && (
          <Link
            to="/my-bookings"
            className="flex flex-col items-center justify-center gap-0.5 text-[#174734] border-r border-[#E8E4D9]"
          >
            <Calendar className="w-4 h-4 text-[#174734]" />
            <span>Bookings</span>
          </Link>
        )}
        <a
          href="/#plan-trip"
          className="flex flex-col items-center justify-center gap-0.5 hover:text-[#174734] border-r border-[#E8E4D9]"
        >
          <Sparkles className="w-4 h-4 text-[#C5A46D]" />
          <span>Plan Trip</span>
        </a>
        <a
          href={defaultWaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 bg-[#174734] text-white font-semibold"
        >
          <MessageCircle className="w-4 h-4 text-[#C5A46D]" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
