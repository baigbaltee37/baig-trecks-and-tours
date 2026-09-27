import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, Phone, Mail, Instagram, Shield, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildWhatsAppLink } from '../config/business';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { business, user, profile, isAdmin, signupNotificationNote, clearSignupNotificationNote } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    `Hello ${business.name}, I would like to inquire about Gilgit-Baltistan tours and travel packages.`,
    business.whatsapp
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F14] text-[#F8FAFC] pb-14 md:pb-0">
      {/* Top Bar Contract: 3 Zones (Brand Wordmark | Clean Text Nav Links | Primary Actions) */}
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          scrolled
            ? 'bg-[#0B0F14]/95 backdrop-blur-md border-b border-white/10'
            : 'bg-[#0B0F14]/80 backdrop-blur-sm border-b border-white/5'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            {business.name}
          </Link>

          {/* Zone 2: Clean typography navigation links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#CBD5E1]">
            {navItems.slice(0, 5).map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                    active
                      ? 'text-white border-[#0EA5E9]'
                      : 'border-transparent hover:text-white hover:border-white/40'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="hidden xl:flex items-center gap-6">
              {navItems.slice(5).map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                      active
                        ? 'text-white border-[#0EA5E9]'
                        : 'border-transparent hover:text-white hover:border-white/40'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Zone 3: Right-side actions (LOGIN / SIGN UP / WHATSAPP) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-1.5 text-xs font-medium text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg hover:bg-[#D4AF37]/10 transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                ADMIN
              </Link>
            )}
            {user ? (
              <Link
                to="/customer/dashboard"
                className="px-3.5 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                {profile?.displayName || 'DASHBOARD'}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-[#E2E8F0] hover:text-white transition-colors whitespace-nowrap"
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-2 text-xs font-semibold text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors whitespace-nowrap"
                >
                  SIGN UP
                </Link>
              </>
            )}
            <a
              href={defaultWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold bg-[#10B981] text-[#0B0F14] hover:bg-[#34D399] rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WHATSAPP
            </a>
          </div>

          {/* Mobile Hamburger & Quick Actions */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={defaultWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-[#10B981] text-[#0B0F14] rounded-lg whitespace-nowrap"
            >
              WHATSAPP
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0F1620] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#E2E8F0] hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
              {user ? (
                <Link
                  to="/customer/dashboard"
                  className="flex-1 text-center py-2.5 text-xs font-semibold bg-white/10 text-white rounded-lg"
                >
                  MY DASHBOARD
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-1 text-center py-2.5 text-xs font-semibold bg-white/10 text-white rounded-lg"
                  >
                    LOGIN
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 text-center py-2.5 text-xs font-semibold bg-[#0EA5E9] text-[#0B0F14] rounded-lg"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="w-full text-center py-2.5 text-xs font-semibold border border-[#D4AF37]/50 text-[#D4AF37] rounded-lg"
                >
                  ADMIN DASHBOARD
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Optional Signup Notification Banner */}
      {signupNotificationNote && (
        <div className="bg-[#0F172A] border-b border-[#0EA5E9]/30 px-4 py-2.5 text-xs text-[#E2E8F0]">
          <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4">
            <span>{signupNotificationNote}</span>
            <button
              type="button"
              onClick={clearSignupNotificationNote}
              className="text-[#94A3B8] hover:text-white font-medium whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Section 56: Premium Footer */}
      <footer className="bg-[#070A0E] border-t border-white/10 pt-16 pb-12 text-sm text-[#94A3B8]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Brand & Tagline */}
            <div className="lg:col-span-4 space-y-4">
              <div className="font-display text-2xl font-bold text-white tracking-tight">
                {business.name.toUpperCase()}
              </div>
              <p className="text-[#CBD5E1] leading-relaxed max-w-sm">
                {business.tagline}
              </p>
              <div className="text-xs text-[#94A3B8] space-y-1 pt-1">
                <div>{business.locationLabel}</div>
                {business.address && <div>Address: {business.address}</div>}
                {business.businessHours && <div>Hours: {business.businessHours}</div>}
              </div>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-3 space-y-3">
              <div className="text-xs font-semibold text-white tracking-wider uppercase">
                Navigation
              </div>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/customer/dashboard" className="hover:text-white transition-colors">
                    Customer Portal
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-white transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Direct Contact & Instagram */}
            <div className="lg:col-span-3 space-y-3">
              <div className="text-xs font-semibold text-white tracking-wider uppercase">
                Contact &amp; Social
              </div>
              <div className="space-y-2.5 text-sm">
                <a
                  href={`tel:+92${business.phone.replace(/^0/, '')}`}
                  className="flex items-center gap-2 text-[#E2E8F0] hover:text-[#0EA5E9] transition-colors font-mono-num"
                >
                  <Phone className="w-4 h-4 text-[#0EA5E9]" />
                  {business.phone}
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-2 text-[#E2E8F0] hover:text-[#0EA5E9] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#0EA5E9]" />
                  {business.email}
                </a>
                <div className="pt-2 space-y-1.5">
                  {business.instagram.map((ig) => (
                    <a
                      key={ig.handle}
                      href={ig.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#CBD5E1] hover:text-white transition-colors"
                    >
                      <Instagram className="w-4 h-4 text-[#D4AF37]" />
                      <span>{ig.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2 & 56: JazzCash Payment Information */}
            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-semibold text-white tracking-wider uppercase">
                JazzCash Payment
              </div>
              <div className="p-3.5 rounded-lg bg-[#0F1620] border border-white/10 space-y-1.5 text-xs">
                <div className="text-white font-semibold">JazzCash Payment</div>
                <div className="text-[#CBD5E1]">
                  Account / Number:{' '}
                  <span className="font-mono-num text-[#D4AF37] font-semibold">
                    {business.jazzcashNumber}
                  </span>
                </div>
                <div className="text-[#CBD5E1]">
                  Account Name:{' '}
                  <span className="text-white font-semibold">{business.jazzcashName}</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] pt-1 leading-normal">
                  Confirm tour dates and availability with {business.name} prior to sending payment.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
            <div>© 2026 {business.name}. All Rights Reserved.</div>
            <div className="flex items-center gap-4">
              <span>JazzCash: {business.jazzcashNumber} — {business.jazzcashName}</span>
              <span aria-hidden="true">·</span>
              <a
                href={defaultWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#10B981] hover:underline"
              >
                WhatsApp: {business.phone}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Section 41: Desktop Floating WhatsApp Button */}
      <a
        href={defaultWaLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3 rounded-full bg-[#10B981] text-[#0B0F14] font-semibold text-xs shadow-lg hover:bg-[#34D399] transition-transform duration-150 hover:-translate-y-0.5"
      >
        <span className="w-2 h-2 rounded-full bg-[#0B0F14] animate-ping" />
        <MessageCircle className="w-4 h-4" />
        <span className="whitespace-nowrap">CHAT WITH US</span>
      </a>

      {/* Section 40: Sticky Mobile Action Bar (EXPLORE | INQUIRE | WHATSAPP) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F14]/95 backdrop-blur-md border-t border-white/15 grid grid-cols-3 h-12 text-xs font-semibold">
        <Link
          to="/tours"
          className="flex items-center justify-center text-[#E2E8F0] hover:text-white border-r border-white/10 whitespace-nowrap"
        >
          EXPLORE
        </Link>
        <Link
          to="/contact"
          className="flex items-center justify-center text-[#0EA5E9] hover:text-white border-r border-white/10 whitespace-nowrap"
        >
          INQUIRE
        </Link>
        <a
          href={defaultWaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-[#10B981] text-[#0B0F14] whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WHATSAPP
        </a>
      </div>
    </div>
  );
};
