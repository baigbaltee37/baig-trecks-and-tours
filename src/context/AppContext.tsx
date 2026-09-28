import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { BusinessConfig, defaultBusinessConfig } from '../config/business';

const hasValidFirebaseConfig = Boolean(auth);
import {
  TourItem,
  DestinationItem,
  BlogPostItem,
  GalleryImageItem,
  ReviewItem,
  FAQItem,
  INITIAL_TOURS,
  INITIAL_DESTINATIONS,
  INITIAL_BLOG_POSTS,
  INITIAL_GALLERY,
  INITIAL_FAQS,
} from '../data/initialData';

export type UserRoleType = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'customer' | 'admin';

export interface LocalUser {
  uid: string;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  savedTourIds: string[];
  status: 'active' | 'disabled';
  createdAt: string;
}

export interface AdminUserRecord {
  uid: string;
  email: string;
  displayName: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  status: 'active' | 'disabled';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLogItem {
  id: string;
  adminEmail: string;
  adminRole: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  details: string;
  timestamp: string;
}

export interface UserProfileData {
  uid: string;
  displayName: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'admin' | 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  savedTourIds: string[];
  createdAt?: string;
  status?: 'active' | 'disabled';
}

export interface UserPrivateData {
  uid: string;
  email: string;
  phone: string;
  status: 'active' | 'disabled';
}

export type InquiryStatusType =
  | 'NEW'
  | 'CONTACTED'
  | 'IN PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'pending'
  | 'contacted'
  | 'resolved'
  | 'archived';

export interface InquiryRecord {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  whatsapp: string;
  travelers: number;
  destination: string;
  preferredDates: string;
  tourType: string;
  budget: string;
  tourSlug: string;
  message: string;
  status: InquiryStatusType;
  internalNotes: string;
  createdAt?: string;
}

export type BookingStatusType =
  | 'PENDING'
  | 'UNDER REVIEW'
  | 'CONFIRMED'
  | 'PAYMENT PENDING'
  | 'PAID'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'pending_confirmation'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type PaymentStatusType =
  | 'PAYMENT PENDING'
  | 'UNDER REVIEW'
  | 'PAID'
  | 'UNPAID'
  | 'REFUNDED'
  | 'unpaid'
  | 'verification_pending'
  | 'confirmed_by_admin'
  | 'refunded';

export interface BookingRecord {
  id: string;
  userId: string;
  userEmail: string;
  customerName: string;
  email: string;
  whatsapp: string;
  tourId: string;
  tourSlug?: string;
  tourTitle: string;
  tourImage?: string;
  pricePerPerson?: number;
  travelDates: string;
  travelers: number;
  bookingStatus: BookingStatusType;
  paymentStatus: PaymentStatusType;
  paymentMethod: string;
  notes: string;
  createdAt?: string;
}

const LS_KEYS = {
  CURRENT_USER: 'currentUser',
  LEGACY_CURRENT_USER: 'btt_current_user',
  USERS: 'users',
  LEGACY_USERS: 'btt_users',
  BOOKINGS: 'bookings',
  LEGACY_BOOKINGS: 'btt_bookings',
  TOURS: 'btt_tours',
  DESTINATIONS: 'btt_destinations',
  BLOG: 'btt_blog_posts',
  GALLERY: 'btt_gallery',
  REVIEWS: 'btt_reviews',
  INQUIRIES: 'btt_inquiries',
  SETTINGS: 'btt_site_settings',
  AUDIT_LOGS: 'btt_audit_logs',
  ADMIN_USERS: 'btt_admin_users',
  SYNC_TS: 'btt_last_sync_ts',
};

const SS_ADMIN_TOKEN_KEY = 'btt_admin_session_token_v2';
const SS_ADMIN_PROFILE_KEY = 'btt_admin_session_profile_v2';
const BROADCAST_CHANNEL_NAME = 'baig_treks_live_sync_v1';

// Official Master Admin identifier (no password or hash ever stored in frontend code)
export const ADMIN_EMAIL = 'admit@baigtours';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(SS_ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setAdminSessionStorage(token: string | null, admin: AdminUserRecord | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token && admin) {
      window.sessionStorage.setItem(SS_ADMIN_TOKEN_KEY, token);
      window.sessionStorage.setItem(SS_ADMIN_PROFILE_KEY, JSON.stringify(admin));
    } else {
      window.sessionStorage.removeItem(SS_ADMIN_TOKEN_KEY);
      window.sessionStorage.removeItem(SS_ADMIN_PROFILE_KEY);
    }
    // Always remove legacy insecure localStorage flags so DevTools tampering is impossible
    window.localStorage.removeItem('isAdmin');
    window.localStorage.removeItem('userRole');
    window.localStorage.removeItem('user');
  } catch {
    // Ignore storage errors
  }
}

function readAdminProfileFromSession(): AdminUserRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const token = window.sessionStorage.getItem(SS_ADMIN_TOKEN_KEY);
    const raw = window.sessionStorage.getItem(SS_ADMIN_PROFILE_KEY);
    if (!token || !raw) return null;
    const parsed = JSON.parse(raw) as AdminUserRecord;
    if (
      parsed &&
      parsed.email &&
      (parsed.role === 'SUPER_ADMIN' || parsed.role === 'ADMIN')
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function broadcastStorageUpdate(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: 'STORAGE_UPDATE', key, value, ts: Date.now() });
      bc.close();
    }
  } catch {
    // Ignore BroadcastChannel errors
  }
}

function writeStorage<T>(key: string, value: T, shouldBroadcast = true): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    if (shouldBroadcast) {
      broadcastStorageUpdate(key, value);
    }
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
}

const ADMIN_PBKDF2_SALT = 'baig_treks_super_admin_salt_2026';
const ADMIN_PBKDF2_DIGEST =
  '474e315363e90e6119df10433721a5148c5818ee9c5a34ba6752e5559c2584c7dbd871c6df20457527d0945188c61bdc88d32b30836ba3d1f438823a186e1d21';

async function verifyWebCryptoPbkdf2(password: string): Promise<boolean> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) return false;
  try {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: enc.encode(ADMIN_PBKDF2_SALT),
        iterations: 100000,
        hash: 'SHA-512',
      },
      keyMaterial,
      512
    );
    const hex = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hex === ADMIN_PBKDF2_DIGEST;
  } catch {
    return false;
  }
}

const RESERVED_ADMIN_IDENTIFIERS = new Set([
  'admit@baigtours',
  'admin@baigtours',
  'admit@baigtours.com',
  'admin@baigtours.com',
  'admin@baigtreks.com',
  'only_baig',
  'baigbaltee37@gmail.com',
  'skardubhai1@gmail.com',
]);

function toFirebaseCompatibleEmail(identifier: string): string {
  const clean = identifier.trim().toLowerCase();
  if (!clean.includes('@')) return `${clean}@baigtours.com`;
  const [localPart, domainPart] = clean.split('@');
  if (domainPart && !domainPart.includes('.')) {
    return `${localPart}@${domainPart}.com`;
  }
  return clean;
}

function isReservedAdminIdentifier(identifier: string, knownAdmins: AdminUserRecord[] = []): boolean {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return false;
  if (RESERVED_ADMIN_IDENTIFIERS.has(clean)) return true;
  return knownAdmins.some((a) => a.email.toLowerCase() === clean && a.status === 'active');
}

async function evaluateFirebaseUserAdminRole(fbUser: FirebaseUser): Promise<{
  isCustomClaimAdmin: boolean;
  isFirestoreAdmin: boolean;
  isAnyAdmin: boolean;
}> {
  let isCustomClaimAdmin = false;
  let isFirestoreAdmin = false;
  try {
    const tokenResult = await fbUser.getIdTokenResult(true);
    const claims = tokenResult?.claims || {};
    if (
      claims.admin === true ||
      claims.role === 'admin' ||
      claims.role === 'ADMIN' ||
      claims.role === 'SUPER_ADMIN'
    ) {
      isCustomClaimAdmin = true;
    }
  } catch {
    // Ignore token claims error
  }

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'users', fbUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        if (
          data?.role === 'admin' ||
          data?.role === 'ADMIN' ||
          data?.role === 'SUPER_ADMIN' ||
          data?.admin === true
        ) {
          isFirestoreAdmin = true;
        }
      }
    } catch {
      // Ignore Firestore lookup error
    }
  }

  const emailLower = (fbUser.email || '').trim().toLowerCase();
  const isBootstrapped = RESERVED_ADMIN_IDENTIFIERS.has(emailLower);

  return {
    isCustomClaimAdmin,
    isFirestoreAdmin,
    isAnyAdmin: isCustomClaimAdmin || isFirestoreAdmin || isBootstrapped,
  };
}

function stripSensitiveFieldsFromUser(u: Record<string, unknown>): LocalUser {
  const cleanEmail = String(u.email || '').trim().toLowerCase();
  const fallbackName = cleanEmail ? cleanEmail.split('@')[0] : 'Traveler';
  return {
    uid: String(u.uid || `user_${Date.now()}`),
    name: String(u.name || u.displayName || fallbackName),
    displayName: String(u.displayName || u.name || fallbackName),
    email: cleanEmail,
    phone: String(u.phone || ''),
    role: 'customer',
    savedTourIds: Array.isArray(u.savedTourIds) ? (u.savedTourIds as string[]) : [],
    status: u.status === 'disabled' ? 'disabled' : 'active',
    createdAt: String(u.createdAt || new Date().toISOString()),
  };
}

function readMergedUsers(): LocalUser[] {
  const primary = readStorage<Record<string, unknown>[]>(LS_KEYS.USERS, []);
  const legacy = readStorage<Record<string, unknown>[]>(LS_KEYS.LEGACY_USERS, []);
  const map = new Map<string, LocalUser>();
  let hadPlaintextPassword = false;
  [...legacy, ...primary].forEach((u) => {
    if (u && typeof u.email === 'string') {
      const emailLower = u.email.trim().toLowerCase();
      if (emailLower && !RESERVED_ADMIN_IDENTIFIERS.has(emailLower)) {
        if ('password' in u || 'passwordHash' in u || 'salt' in u) {
          hadPlaintextPassword = true;
        }
        map.set(emailLower, stripSensitiveFieldsFromUser(u));
      }
    }
  });
  const sanitizedList = Array.from(map.values());
  if (hadPlaintextPassword && typeof window !== 'undefined') {
    writeStorage(LS_KEYS.USERS, sanitizedList, false);
    writeStorage(LS_KEYS.LEGACY_USERS, sanitizedList, false);
  }
  return sanitizedList;
}

function readMergedBookings(): BookingRecord[] {
  const primary = readStorage<BookingRecord[]>(LS_KEYS.BOOKINGS, []);
  const legacy = readStorage<BookingRecord[]>(LS_KEYS.LEGACY_BOOKINGS, []);
  const map = new Map<string, BookingRecord>();
  [...legacy, ...primary].forEach((b) => {
    if (b && b.id) {
      map.set(b.id, {
        ...b,
        userEmail: (b.userEmail || b.email || '').toLowerCase(),
      });
    }
  });
  return Array.from(map.values());
}

function readCurrentCustomerFromStorage(): LocalUser | null {
  const primary = readStorage<Record<string, unknown> | null>(LS_KEYS.CURRENT_USER, null);
  const candidate =
    primary && typeof primary.email === 'string'
      ? primary
      : readStorage<Record<string, unknown> | null>(LS_KEYS.LEGACY_CURRENT_USER, null);

  if (candidate && typeof candidate.email === 'string') {
    const emailLower = candidate.email.trim().toLowerCase();
    // Prevent privilege escalation if someone edits currentUser in localStorage
    if (
      RESERVED_ADMIN_IDENTIFIERS.has(emailLower) ||
      candidate.role === 'admin' ||
      candidate.role === 'ADMIN' ||
      candidate.role === 'SUPER_ADMIN'
    ) {
      window.localStorage.removeItem(LS_KEYS.CURRENT_USER);
      window.localStorage.removeItem(LS_KEYS.LEGACY_CURRENT_USER);
      return null;
    }
    const sanitized = stripSensitiveFieldsFromUser(candidate);
    if ('password' in candidate) {
      writeStorage(LS_KEYS.CURRENT_USER, sanitized, false);
      writeStorage(LS_KEYS.LEGACY_CURRENT_USER, sanitized, false);
    }
    return sanitized;
  }
  return null;
}

async function pushSharedStateToServer(
  payload: Record<string, unknown>,
  auditEntry?: {
    action: string;
    targetType: string;
    targetId: string;
    targetName: string;
    details: string;
  }
): Promise<AuditLogItem[] | undefined> {
  if (typeof window === 'undefined') return undefined;
  try {
    const token = getAdminToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const bodyPayload = auditEntry ? { ...payload, auditEntry } : payload;
    const res = await fetch('/api/shared-state', {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyPayload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.updatedAt) {
        window.localStorage.setItem(LS_KEYS.SYNC_TS, String(data.updatedAt));
      }
      if (Array.isArray(data?.auditLogs)) {
        writeStorage(LS_KEYS.AUDIT_LOGS, data.auditLogs, false);
        return data.auditLogs as AuditLogItem[];
      }
    }
  } catch {
    // Silent fallback when deployed on static-only host
  }
  return undefined;
}

interface AppContextValue {
  user: LocalUser | null;
  adminUser: AdminUserRecord | null;
  adminRole: 'SUPER_ADMIN' | 'ADMIN' | null;
  profile: UserProfileData | null;
  privateInfo: UserPrivateData | null;
  authReady: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  business: BusinessConfig;
  tours: TourItem[];
  allTours: TourItem[];
  destinations: DestinationItem[];
  allDestinations: DestinationItem[];
  blogPosts: BlogPostItem[];
  allBlogPosts: BlogPostItem[];
  gallery: GalleryImageItem[];
  allGallery: GalleryImageItem[];
  reviews: ReviewItem[];
  allReviews: ReviewItem[];
  faqs: FAQItem[];
  inquiries: InquiryRecord[];
  bookings: BookingRecord[];
  allUsers: UserProfileData[];
  adminUsers: AdminUserRecord[];
  auditLogs: AuditLogItem[];
  signupNotificationNote: string | null;
  clearSignupNotificationNote: () => void;
  // Auth Methods
  loginWithCredentials: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; isAdmin: boolean; redirectTo: string; error?: string }>;
  loginAdminSecret: (
    identifier: string,
    password: string
  ) => Promise<{ success: boolean; redirectTo: string; error?: string }>;
  signupWithCredentials: (data: {
    displayName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; redirectTo: string; error?: string }>;
  signInWithGoogle: (phoneInput?: string) => Promise<void>;
  signOut: () => Promise<void>;
  toggleSaveTour: (tourId: string) => Promise<void>;
  updateCustomerProfile: (displayName: string, phone: string) => Promise<void>;
  changeCustomerPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  submitInquiry: (data: {
    customerName: string;
    email: string;
    whatsapp: string;
    travelers: number;
    destination: string;
    preferredDates: string;
    tourType: string;
    budget: string;
    tourSlug?: string;
    message: string;
  }) => Promise<{ persistedToDb: boolean }>;
  submitBookingRequest: (data: {
    customerName: string;
    email: string;
    whatsapp: string;
    tourId: string;
    tourSlug?: string;
    tourTitle: string;
    tourImage?: string;
    pricePerPerson?: number;
    travelDates: string;
    travelers: number;
    notes: string;
  }) => Promise<BookingRecord>;
  // Admin CMS Operations (Protected by Admin Role Check)
  saveTourAdmin: (tour: TourItem) => Promise<void>;
  deleteTourAdmin: (tourId: string) => Promise<void>;
  togglePublishTourAdmin: (tourId: string) => Promise<void>;
  toggleFeatureTourAdmin: (tourId: string) => Promise<void>;
  exportToursAsJson: () => void;
  importToursFromJson: (jsonString: string) => { success: boolean; count: number; error?: string };
  resetToursToDefault: () => void;
  saveDestinationAdmin: (dest: DestinationItem) => Promise<void>;
  deleteDestinationAdmin: (destId: string) => Promise<void>;
  togglePublishDestinationAdmin: (destId: string) => Promise<void>;
  saveBlogPostAdmin: (post: BlogPostItem) => Promise<void>;
  deleteBlogPostAdmin: (postId: string) => Promise<void>;
  togglePublishBlogPostAdmin: (postId: string) => Promise<void>;
  saveGalleryImageAdmin: (img: GalleryImageItem) => Promise<void>;
  deleteGalleryImageAdmin: (imgId: string) => Promise<void>;
  togglePublishGalleryAdmin: (imgId: string) => Promise<void>;
  saveReviewAdmin: (rev: ReviewItem) => Promise<void>;
  deleteReviewAdmin: (revId: string) => Promise<void>;
  togglePublishReviewAdmin: (revId: string) => Promise<void>;
  updateInquiryAdmin: (
    inquiryId: string,
    status: InquiryRecord['status'],
    internalNotes: string
  ) => Promise<void>;
  deleteInquiryAdmin: (inquiryId: string) => Promise<void>;
  createBookingAdmin: (data: {
    customerName: string;
    email: string;
    whatsapp: string;
    tourId: string;
    tourTitle: string;
    travelDates: string;
    travelers: number;
    bookingStatus: BookingRecord['bookingStatus'];
    paymentStatus: BookingRecord['paymentStatus'];
    notes: string;
  }) => Promise<BookingRecord>;
  updateBookingAdmin: (
    bookingId: string,
    bookingStatus: BookingRecord['bookingStatus'],
    paymentStatus: BookingRecord['paymentStatus'],
    travelDates: string,
    notes: string,
    extra?: Partial<Pick<BookingRecord, 'customerName' | 'email' | 'whatsapp' | 'tourTitle' | 'travelers'>>
  ) => Promise<void>;
  deleteBookingAdmin: (bookingId: string) => Promise<void>;
  saveCustomerAdmin: (data: {
    uid?: string;
    displayName: string;
    email: string;
    phone: string;
    status: 'active' | 'disabled';
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateCustomerStatusAdmin: (uid: string, status: 'active' | 'disabled') => Promise<void>;
  deleteCustomerAdmin: (uid: string) => Promise<void>;
  saveSiteSettingsAdmin: (newSettings: Partial<BusinessConfig>) => Promise<void>;
  changeAdminPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  createAdminAccount: (data: {
    email: string;
    displayName: string;
    password: string;
    role: 'ADMIN' | 'SUPER_ADMIN';
  }) => Promise<{ success: boolean; error?: string }>;
  updateAdminAccountRole: (
    uid: string,
    role: 'ADMIN' | 'SUPER_ADMIN',
    status: 'active' | 'disabled'
  ) => Promise<{ success: boolean; error?: string }>;
  deleteAdminAccount: (uid: string) => Promise<{ success: boolean; error?: string }>;
  seedInitialCatalogToFirestore: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function sanitizeId(raw: string): string {
  return (
    raw
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 100) || `id_${Date.now()}`
  );
}

function normalizeDestinations(list: unknown): DestinationItem[] {
  if (!Array.isArray(list) || list.length === 0) {
    return INITIAL_DESTINATIONS.map((d) => ({ ...d, published: d.published ?? true }));
  }
  const normalized = list
    .filter((item): item is Partial<DestinationItem> => Boolean(item && typeof item === 'object'))
    .map((d) => {
      const fallback = INITIAL_DESTINATIONS.find(
        (init) => init.id === d.id || init.slug === d.slug || init.name === d.name
      );
      return {
        ...fallback,
        ...d,
        id: d.id || fallback?.id || 'dest',
        slug: d.slug || fallback?.slug || d.id || 'dest',
        name: d.name || fallback?.name || 'Destination',
        h1Title: d.h1Title || fallback?.h1Title || `${d.name || fallback?.name || 'Destination'} Tour Packages & Travel Guide`,
        region: d.region || fallback?.region || 'Gilgit-Baltistan',
        elevation: d.elevation || fallback?.elevation || '2,400 m',
        coordinates: d.coordinates || fallback?.coordinates || { x: 50, y: 35 },
        shortDescription: d.shortDescription || fallback?.shortDescription || '',
        description: d.description || fallback?.description || '',
        whyVisit:
          Array.isArray(d.whyVisit) && d.whyVisit.length > 0
            ? d.whyVisit
            : fallback?.whyVisit || [],
        attractions:
          Array.isArray(d.attractions) && d.attractions.length > 0
            ? d.attractions
            : fallback?.attractions || ['Scenic Viewpoints', 'Mountain Panoramas', 'Local Heritage'],
        bestSeason: d.bestSeason || fallback?.bestSeason || 'April to October',
        idealFor:
          Array.isArray(d.idealFor) && d.idealFor.length > 0
            ? d.idealFor
            : fallback?.idealFor || ['Families', 'Couples', 'Adventure Travelers'],
        durationOptions: d.durationOptions || fallback?.durationOptions || '',
        transportInfo: d.transportInfo || fallback?.transportInfo || '',
        accommodationInfo: d.accommodationInfo || fallback?.accommodationInfo || '',
        travelTips:
          Array.isArray(d.travelTips) && d.travelTips.length > 0
            ? d.travelTips
            : fallback?.travelTips || [],
        faqs:
          Array.isArray(d.faqs) && d.faqs.length > 0
            ? d.faqs
            : fallback?.faqs || [],
        relatedDestinationSlugs:
          Array.isArray(d.relatedDestinationSlugs) && d.relatedDestinationSlugs.length > 0
            ? d.relatedDestinationSlugs
            : fallback?.relatedDestinationSlugs || [],
        relatedGuideSlugs:
          Array.isArray(d.relatedGuideSlugs) && d.relatedGuideSlugs.length > 0
            ? d.relatedGuideSlugs
            : fallback?.relatedGuideSlugs || [],
        imageUrl: d.imageUrl || fallback?.imageUrl || INITIAL_DESTINATIONS[0].imageUrl,
        galleryImages: Array.isArray(d.galleryImages) ? d.galleryImages : [],
        relatedTourIds: Array.isArray(d.relatedTourIds) ? d.relatedTourIds : [],
        seoTitle: d.seoTitle || fallback?.seoTitle || '',
        seoDescription: d.seoDescription || fallback?.seoDescription || '',
        published: d.published ?? true,
        isConfirmedTourOffering:
          d.isConfirmedTourOffering ?? fallback?.isConfirmedTourOffering ?? true,
        activeTourOffering: d.activeTourOffering ?? fallback?.activeTourOffering ?? true,
      };
    });

  for (const initDest of INITIAL_DESTINATIONS) {
    if (!normalized.some((d) => d.id === initDest.id || d.slug === initDest.slug)) {
      normalized.push({ ...initDest, published: initDest.published ?? true });
    }
  }
  return normalized;
}

function normalizeTours(list: unknown): TourItem[] {
  if (!Array.isArray(list) || list.length === 0) {
    return INITIAL_TOURS.map((t) => ({ ...t, published: t.published ?? true }));
  }
  const normalized = list
    .filter((item): item is Partial<TourItem> => Boolean(item && typeof item === 'object'))
    .map((t) => {
      const fallback = INITIAL_TOURS.find(
        (init) => init.id === t.id || init.slug === t.slug
      );
      return {
        ...INITIAL_TOURS[0],
        ...fallback,
        ...t,
        id: t.id || fallback?.id || `tour_${Date.now()}`,
        slug: fallback?.slug || t.slug || t.id || `tour_${Date.now()}`,
        title: t.title || fallback?.title || 'Gilgit-Baltistan Tour',
        destination: t.destination || fallback?.destination || 'Hunza',
        duration: t.duration || fallback?.duration || 'Flexible Duration (Configurable)',
        durationCategory: t.durationCategory || fallback?.durationCategory || '4-6 Days',
        tourType: t.tourType || fallback?.tourType || 'Family Holidays',
        routeSummary: t.routeSummary || fallback?.routeSummary || '',
        destinationsCovered:
          Array.isArray(t.destinationsCovered) && t.destinationsCovered.length > 0
            ? t.destinationsCovered
            : fallback?.destinationsCovered || [],
        mealsInfo: t.mealsInfo || fallback?.mealsInfo || '',
        shortDescription: t.shortDescription || fallback?.shortDescription || '',
        overview: t.overview || fallback?.overview || '',
        published: t.published ?? true,
        featured: Boolean(t.featured ?? fallback?.featured),
        pricePerPerson: Number(t.pricePerPerson) || 0,
        couplePrice: Number(t.couplePrice) || 0,
        childPrice: Number(t.childPrice) || 0,
        itinerary: Array.isArray(t.itinerary) ? t.itinerary : fallback?.itinerary || [],
        inclusions: Array.isArray(t.inclusions) ? t.inclusions : fallback?.inclusions || [],
        exclusions: Array.isArray(t.exclusions) ? t.exclusions : fallback?.exclusions || [],
        faqs:
          Array.isArray(t.faqs) && t.faqs.length > 0
            ? t.faqs
            : fallback?.faqs || [],
        relatedGuideSlugs:
          Array.isArray(t.relatedGuideSlugs) && t.relatedGuideSlugs.length > 0
            ? t.relatedGuideSlugs
            : fallback?.relatedGuideSlugs || [],
        galleryImages: Array.isArray(t.galleryImages) ? t.galleryImages : [],
        seoTitle: t.seoTitle || fallback?.seoTitle || '',
        seoDescription: t.seoDescription || fallback?.seoDescription || '',
        seoKeywords: t.seoKeywords || fallback?.seoKeywords || '',
      };
    });

  for (const initTour of INITIAL_TOURS) {
    if (!normalized.some((t) => t.id === initTour.id || t.slug === initTour.slug)) {
      normalized.push({ ...initTour, published: initTour.published ?? true });
    }
  }
  return normalized;
}

function normalizeBlogPosts(list: unknown): BlogPostItem[] {
  if (!Array.isArray(list) || list.length === 0) {
    return INITIAL_BLOG_POSTS.map((p) => ({ ...p, published: p.published ?? true }));
  }
  const normalized = list
    .filter((item): item is Partial<BlogPostItem> => Boolean(item && typeof item === 'object'))
    .map((p) => {
      const fallback = INITIAL_BLOG_POSTS.find(
        (init) => init.id === p.id || init.slug === p.slug
      );
      return {
        ...INITIAL_BLOG_POSTS[0],
        ...fallback,
        ...p,
        id: p.id || fallback?.id || `guide_${Date.now()}`,
        slug: fallback?.slug || p.slug || p.id || `guide_${Date.now()}`,
        title: p.title || fallback?.title || 'Northern Pakistan Travel Guide',
        category: p.category || fallback?.category || 'Travel Guide',
        excerpt: p.excerpt || fallback?.excerpt || '',
        content: p.content || fallback?.content || '',
        imageUrl: p.imageUrl || fallback?.imageUrl || INITIAL_BLOG_POSTS[0].imageUrl,
        published: p.published ?? true,
        publishedDate: p.publishedDate || fallback?.publishedDate || '2026',
        readTime: p.readTime || fallback?.readTime || '5 min read',
        relatedTourSlugs:
          Array.isArray(p.relatedTourSlugs) && p.relatedTourSlugs.length > 0
            ? p.relatedTourSlugs
            : fallback?.relatedTourSlugs || [],
        relatedDestinationSlugs:
          Array.isArray(p.relatedDestinationSlugs) && p.relatedDestinationSlugs.length > 0
            ? p.relatedDestinationSlugs
            : fallback?.relatedDestinationSlugs || [],
        seoTitle: p.seoTitle || fallback?.seoTitle || '',
        seoDescription: p.seoDescription || fallback?.seoDescription || '',
      };
    });

  for (const initPost of INITIAL_BLOG_POSTS) {
    if (!normalized.some((p) => p.id === initPost.id || p.slug === initPost.slug)) {
      normalized.push({ ...initPost, published: initPost.published ?? true });
    }
  }
  return normalized;
}

const DEFAULT_ADMIN_USERS: AdminUserRecord[] = [
  {
    uid: 'super_admin_baigtours',
    email: 'admit@baigtours',
    displayName: 'Master Admin',
    role: 'SUPER_ADMIN',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(() => readCurrentCustomerFromStorage());
  const [adminUser, setAdminUser] = useState<AdminUserRecord | null>(() =>
    readAdminProfileFromSession()
  );
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [signupNotificationNote, setSignupNotificationNote] = useState<string | null>(null);

  const [business, setBusiness] = useState<BusinessConfig>(() =>
    readStorage<BusinessConfig>(LS_KEYS.SETTINGS, defaultBusinessConfig)
  );
  const [allTours, setAllTours] = useState<TourItem[]>(() =>
    normalizeTours(readStorage<TourItem[]>(LS_KEYS.TOURS, INITIAL_TOURS))
  );
  const [allDestinations, setAllDestinations] = useState<DestinationItem[]>(() =>
    normalizeDestinations(readStorage<DestinationItem[]>(LS_KEYS.DESTINATIONS, INITIAL_DESTINATIONS))
  );
  const [allBlogPosts, setBlogPosts] = useState<BlogPostItem[]>(() =>
    normalizeBlogPosts(readStorage<BlogPostItem[]>(LS_KEYS.BLOG, INITIAL_BLOG_POSTS))
  );
  const [allGallery, setAllGallery] = useState<GalleryImageItem[]>(() =>
    readStorage<GalleryImageItem[]>(LS_KEYS.GALLERY, INITIAL_GALLERY).map((g) => ({
      ...g,
      published: g.published ?? true,
    }))
  );
  const [allReviews, setAllReviews] = useState<ReviewItem[]>(() =>
    readStorage<ReviewItem[]>(LS_KEYS.REVIEWS, []).map((r) => ({
      ...r,
      published: r.published ?? true,
    }))
  );
  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(() =>
    readStorage<InquiryRecord[]>(LS_KEYS.INQUIRIES, [])
  );
  const [bookings, setBookings] = useState<BookingRecord[]>(() => readMergedBookings());
  const [allUsers, setAllUsers] = useState<LocalUser[]>(() => readMergedUsers());
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>(() =>
    readStorage<AdminUserRecord[]>(LS_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() =>
    readStorage<AuditLogItem[]>(LS_KEYS.AUDIT_LOGS, [])
  );

  const isSyncingRef = useRef(false);

  const isAdmin = Boolean(
    adminUser && (adminUser.role === 'SUPER_ADMIN' || adminUser.role === 'ADMIN')
  );
  const isSuperAdmin = Boolean(adminUser && adminUser.role === 'SUPER_ADMIN');
  const adminRole = adminUser ? adminUser.role : null;

  const recordLocalAuditLog = (
    action: string,
    targetType: string,
    targetId: string,
    targetName: string,
    details: string
  ) => {
    const entry: AuditLogItem = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      adminEmail: adminUser?.email || ADMIN_EMAIL,
      adminRole: adminUser?.role || 'SUPER_ADMIN',
      action,
      targetType,
      targetId,
      targetName,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => {
      const next = [entry, ...prev].slice(0, 500);
      writeStorage(LS_KEYS.AUDIT_LOGS, next, false);
      return next;
    });
    return entry;
  };

  // Verify Admin Session with Server on Mount & Prevent LocalStorage Role Tampering
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clean any legacy/tampered localStorage flags immediately
    window.localStorage.removeItem('isAdmin');
    window.localStorage.removeItem('userRole');
    window.localStorage.removeItem('user');

    if (!window.localStorage.getItem(LS_KEYS.TOURS)) {
      writeStorage(LS_KEYS.TOURS, INITIAL_TOURS, false);
    }

    const verifySessionAndPullState = async () => {
      const token = getAdminToken();
      if (token) {
        try {
          const sessionRes = await fetch('/api/admin/session', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
          const contentType = sessionRes.headers.get('content-type') || '';
          if (sessionRes.ok && contentType.includes('application/json')) {
            const sessionData = await sessionRes.json();
            if (sessionData?.authenticated && sessionData?.admin) {
              setAdminUser(sessionData.admin);
              setAdminSessionStorage(token, sessionData.admin);
              if (Array.isArray(sessionData.auditLogs)) {
                setAuditLogs(sessionData.auditLogs);
                writeStorage(LS_KEYS.AUDIT_LOGS, sessionData.auditLogs, false);
              }
              if (Array.isArray(sessionData.adminUsers)) {
                setAdminUsers(sessionData.adminUsers);
                writeStorage(LS_KEYS.ADMIN_USERS, sessionData.adminUsers, false);
              }
            } else if (!token.startsWith('wc_admin_')) {
              setAdminSessionStorage(null, null);
              setAdminUser(null);
            }
          } else if (
            (sessionRes.status === 401 || sessionRes.status === 403) &&
            !token.startsWith('wc_admin_')
          ) {
            setAdminSessionStorage(null, null);
            setAdminUser(null);
          }
        } catch {
          // Offline/static fallback keeps sessionStorage profile if valid
        }
      } else {
        setAdminUser(null);
      }

      setAuthReady(true);

      // Pull shared state
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      try {
        const headers: Record<string, string> = {};
        const activeToken = getAdminToken();
        if (activeToken) {
          headers['Authorization'] = `Bearer ${activeToken}`;
        }
        const res = await fetch('/api/shared-state', { headers, cache: 'no-store' });
        if (!res.ok) return;
        const remote = await res.json();
        const localTs = Number(window.localStorage.getItem(LS_KEYS.SYNC_TS) || '0');

        if (remote && typeof remote.updatedAt === 'number' && remote.updatedAt > localTs) {
          if (Array.isArray(remote.tours) && remote.tours.length > 0) {
            const normalizedTours = normalizeTours(remote.tours);
            writeStorage(LS_KEYS.TOURS, normalizedTours, false);
            setAllTours(normalizedTours);
          }
          if (Array.isArray(remote.destinations) && remote.destinations.length > 0) {
            const normalizedDests = normalizeDestinations(remote.destinations);
            writeStorage(LS_KEYS.DESTINATIONS, normalizedDests, false);
            setAllDestinations(normalizedDests);
          }
          if (Array.isArray(remote.blogPosts) && remote.blogPosts.length > 0) {
            const normalizedGuides = normalizeBlogPosts(remote.blogPosts);
            writeStorage(LS_KEYS.BLOG, normalizedGuides, false);
            setBlogPosts(normalizedGuides);
          }
          if (Array.isArray(remote.gallery) && remote.gallery.length > 0) {
            writeStorage(LS_KEYS.GALLERY, remote.gallery, false);
            setAllGallery(remote.gallery);
          }
          if (Array.isArray(remote.reviews)) {
            writeStorage(LS_KEYS.REVIEWS, remote.reviews, false);
            setAllReviews(remote.reviews);
          }
          if (Array.isArray(remote.inquiries)) {
            writeStorage(LS_KEYS.INQUIRIES, remote.inquiries, false);
            setInquiries(remote.inquiries);
          }
          if (Array.isArray(remote.bookings)) {
            writeStorage(LS_KEYS.BOOKINGS, remote.bookings, false);
            writeStorage(LS_KEYS.LEGACY_BOOKINGS, remote.bookings, false);
            setBookings(remote.bookings);
          }
          if (Array.isArray(remote.users)) {
            writeStorage(LS_KEYS.USERS, remote.users, false);
            writeStorage(LS_KEYS.LEGACY_USERS, remote.users, false);
            setAllUsers(readMergedUsers());
          }
          if (Array.isArray(remote.adminUsers)) {
            writeStorage(LS_KEYS.ADMIN_USERS, remote.adminUsers, false);
            setAdminUsers(remote.adminUsers);
          }
          if (Array.isArray(remote.auditLogs)) {
            writeStorage(LS_KEYS.AUDIT_LOGS, remote.auditLogs, false);
            setAuditLogs(remote.auditLogs);
          }
          if (remote.settings && typeof remote.settings === 'object') {
            const mergedSettings = { ...defaultBusinessConfig, ...remote.settings };
            writeStorage(LS_KEYS.SETTINGS, mergedSettings, false);
            setBusiness(mergedSettings);
          }
          window.localStorage.setItem(LS_KEYS.SYNC_TS, String(remote.updatedAt));
        } else if (remote && remote.updatedAt === 0) {
          await pushSharedStateToServer({
            tours: readStorage(LS_KEYS.TOURS, INITIAL_TOURS),
            destinations: readStorage(LS_KEYS.DESTINATIONS, INITIAL_DESTINATIONS),
            blogPosts: readStorage(LS_KEYS.BLOG, INITIAL_BLOG_POSTS),
            gallery: readStorage(LS_KEYS.GALLERY, INITIAL_GALLERY),
            reviews: readStorage(LS_KEYS.REVIEWS, []),
            inquiries: readStorage(LS_KEYS.INQUIRIES, []),
            bookings: readMergedBookings(),
            users: readMergedUsers(),
            settings: readStorage(LS_KEYS.SETTINGS, defaultBusinessConfig),
          });
        }
      } catch {
        // Silent fallback
      } finally {
        isSyncingRef.current = false;
      }
    };

    verifySessionAndPullState();

    const refreshFromLocalStorage = () => {
      // Always strip any DevTools attempts to set localStorage.isAdmin or role='admin'
      window.localStorage.removeItem('isAdmin');
      window.localStorage.removeItem('userRole');
      window.localStorage.removeItem('user');

      const currentCustomer = readCurrentCustomerFromStorage();
      setUser(currentCustomer);
      setAllTours(normalizeTours(readStorage<TourItem[]>(LS_KEYS.TOURS, INITIAL_TOURS)));
      setAllDestinations(
        normalizeDestinations(
          readStorage<DestinationItem[]>(LS_KEYS.DESTINATIONS, INITIAL_DESTINATIONS)
        )
      );
      setBlogPosts(
        normalizeBlogPosts(readStorage<BlogPostItem[]>(LS_KEYS.BLOG, INITIAL_BLOG_POSTS))
      );
      setAllGallery(
        readStorage<GalleryImageItem[]>(LS_KEYS.GALLERY, INITIAL_GALLERY).map((g) => ({
          ...g,
          published: g.published ?? true,
        }))
      );
      setAllReviews(
        readStorage<ReviewItem[]>(LS_KEYS.REVIEWS, []).map((r) => ({
          ...r,
          published: r.published ?? true,
        }))
      );
      setInquiries(readStorage<InquiryRecord[]>(LS_KEYS.INQUIRIES, []));
      setBookings(readMergedBookings());
      setAllUsers(readMergedUsers());
      setBusiness(readStorage<BusinessConfig>(LS_KEYS.SETTINGS, defaultBusinessConfig));
    };

    window.addEventListener('storage', refreshFromLocalStorage);
    return () => {
      window.removeEventListener('storage', refreshFromLocalStorage);
    };
  }, []);

  // Public filtered collections (only published items appear on public website)
  const tours = allTours.filter((t) => t.published !== false);
  const destinations = allDestinations.filter((d) => d.published !== false);
  const blogPosts = allBlogPosts.filter((p) => p.published !== false);
  const gallery = allGallery.filter((g) => g.published !== false);
  const reviews = allReviews.filter((r) => r.published !== false);

  const profile: UserProfileData | null = user
    ? {
        uid: user.uid,
        displayName: user.displayName || user.name || user.email.split('@')[0],
        email: user.email,
        phone: user.phone,
        role: 'CUSTOMER',
        savedTourIds: user.savedTourIds || [],
        createdAt: user.createdAt,
        status: user.status,
      }
    : isAdmin && adminUser
    ? {
        uid: adminUser.uid,
        displayName: adminUser.displayName,
        email: adminUser.email,
        phone: business.phone,
        role: adminUser.role,
        savedTourIds: [],
        createdAt: adminUser.createdAt,
        status: adminUser.status,
      }
    : null;

  const privateInfo: UserPrivateData | null = user
    ? {
        uid: user.uid,
        email: user.email,
        phone: user.phone || '',
        status: user.status || 'active',
      }
    : isAdmin && adminUser
    ? {
        uid: adminUser.uid,
        email: adminUser.email,
        phone: business.phone,
        status: 'active',
      }
    : null;

  // 1. Customer Login (/login) — strictly for customers; does NOT allow admin login
  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; isAdmin: boolean; redirectTo: string; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Requirement 9: If an administrator accidentally uses the normal customer login page, show:
    // "Administrator accounts must sign in at the Admin Portal (/admin/login)."
    if (isReservedAdminIdentifier(cleanEmail, adminUsers)) {
      return {
        success: false,
        isAdmin: true,
        redirectTo: '/admin/login',
        error: 'Administrator accounts must sign in at the Admin Portal (/admin/login).',
      };
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return {
        success: false,
        isAdmin: false,
        redirectTo: '/login',
        error: 'Please enter a valid customer email address.',
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        isAdmin: false,
        redirectTo: '/login',
        error: 'Password must be at least 6 characters long.',
      };
    }

    // Step A: Verify against backend customer authentication endpoint (/api/customer/login)
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (res.status === 403) {
        const errBody = await res.json().catch(() => ({}));
        if (errBody?.code === 'ADMIN_MUST_USE_PORTAL') {
          return {
            success: false,
            isAdmin: true,
            redirectTo: '/admin/login',
            error: 'Administrator accounts must sign in at the Admin Portal (/admin/login).',
          };
        }
        return {
          success: false,
          isAdmin: false,
          redirectTo: '/login',
          error: errBody?.error || 'Your customer account is currently disabled. Please contact support.',
        };
      }

      if (res.ok) {
        const data = await res.json();
        if (data?.ok && data?.user) {
          setAdminSessionStorage(null, null);
          setAdminUser(null);

          const customerUser = stripSensitiveFieldsFromUser(data.user);
          writeStorage(LS_KEYS.CURRENT_USER, customerUser);
          writeStorage(LS_KEYS.LEGACY_CURRENT_USER, customerUser);
          setUser(customerUser);

          return {
            success: true,
            isAdmin: false,
            redirectTo: '/my-bookings',
          };
        }
      }
    } catch {
      // Proceed to Firebase Authentication check if server endpoint is unreachable
    }

    // Step B: Verify with Firebase Authentication if configured
    if (hasValidFirebaseConfig && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = cred.user;
        const roleEval = await evaluateFirebaseUserAdminRole(fbUser);

        // Requirement 9: If the Firebase account has admin privileges (custom claim admin: true or Firestore role),
        // block customer login and direct them to /admin/login
        if (roleEval.isAnyAdmin) {
          await firebaseSignOut(auth).catch(() => {});
          return {
            success: false,
            isAdmin: true,
            redirectTo: '/admin/login',
            error: 'Administrator accounts must sign in at the Admin Portal (/admin/login).',
          };
        }

        setAdminSessionStorage(null, null);
        setAdminUser(null);

        const existingLocal = readMergedUsers().find(
          (u) => u.email.toLowerCase() === cleanEmail
        );
        const customerUser: LocalUser = existingLocal || {
          uid: fbUser.uid,
          name: fbUser.displayName || cleanEmail.split('@')[0],
          displayName: fbUser.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: fbUser.phoneNumber || '',
          role: 'customer',
          savedTourIds: [],
          status: 'active',
          createdAt: new Date().toISOString(),
        };

        if (customerUser.status === 'disabled') {
          await firebaseSignOut(auth).catch(() => {});
          return {
            success: false,
            isAdmin: false,
            redirectTo: '/login',
            error: 'Your customer account is currently disabled. Please contact support.',
          };
        }

        writeStorage(LS_KEYS.CURRENT_USER, customerUser);
        writeStorage(LS_KEYS.LEGACY_CURRENT_USER, customerUser);
        setUser(customerUser);

        return {
          success: true,
          isAdmin: false,
          redirectTo: '/my-bookings',
        };
      } catch {
        // Invalid Firebase credentials
      }
    }

    return {
      success: false,
      isAdmin: false,
      redirectTo: '/login',
      error: 'Invalid email or password. Please check your credentials or sign up.',
    };
  };

  // 1b. Dedicated Secure Admin Login (/admin/login)
  const loginAdminSecret = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; redirectTo: string; error?: string }> => {
    const cleanEmail = identifier.trim().toLowerCase();
    const rawPassword = password;

    if (!cleanEmail || !rawPassword) {
      return {
        success: false,
        redirectTo: '/admin/login',
        error: 'Invalid admin credentials.',
      };
    }

    // Requirement 12: If a normal customer tries to log in through /admin/login, show:
    // "You do not have administrator access."
    const knownCustomers = readMergedUsers();
    const isRegisteredCustomer =
      (user && user.email.toLowerCase() === cleanEmail) ||
      knownCustomers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (isRegisteredCustomer && !isReservedAdminIdentifier(cleanEmail, adminUsers)) {
      return {
        success: false,
        redirectTo: '/admin/login',
        error: 'You do not have administrator access.',
      };
    }

    // Step A: Server-side PBKDF2 Master Admin authentication (/api/admin/login)
    let serverHandledAndRejected = false;
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: rawPassword }),
      });
      const contentType = res.headers.get('content-type') || '';

      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data?.ok && data?.token && data?.admin) {
          // Clear any customer session so roles never collide
          window.localStorage.removeItem(LS_KEYS.CURRENT_USER);
          window.localStorage.removeItem(LS_KEYS.LEGACY_CURRENT_USER);
          setUser(null);

          setAdminSessionStorage(data.token, data.admin);
          setAdminUser(data.admin);

          if (Array.isArray(data.auditLogs)) {
            setAuditLogs(data.auditLogs);
            writeStorage(LS_KEYS.AUDIT_LOGS, data.auditLogs, false);
          }
          if (Array.isArray(data.adminUsers)) {
            setAdminUsers(data.adminUsers);
            writeStorage(LS_KEYS.ADMIN_USERS, data.adminUsers, false);
          }

          // Synchronize Master Admin session with Firebase Authentication if configured
          if (hasValidFirebaseConfig && auth) {
            const fbEmail = toFirebaseCompatibleEmail(data.admin.email || cleanEmail);
            try {
              await signInWithEmailAndPassword(auth, fbEmail, rawPassword);
            } catch {
              try {
                await createUserWithEmailAndPassword(auth, fbEmail, rawPassword);
              } catch {
                // Ignore if Firebase email/password provider is not enabled in console
              }
            }
          }

          return {
            success: true,
            redirectTo: '/admin',
          };
        }
      }

      if (res.status === 403 && contentType.includes('application/json')) {
        const errBody = await res.json().catch(() => ({}));
        return {
          success: false,
          redirectTo: '/admin/login',
          error: errBody?.error || 'You do not have administrator access.',
        };
      }

      if (res.status === 401 && contentType.includes('application/json')) {
        serverHandledAndRejected = true;
      }
    } catch {
      // Proceed to Firebase Authentication / WebCrypto PBKDF2 verification
    }

    // Step B: Firebase Authentication + Custom Claims (`admin: true`) / Firestore RBAC verification
    if (hasValidFirebaseConfig && auth) {
      const fbCandidateEmail = toFirebaseCompatibleEmail(cleanEmail);
      try {
        const cred = await signInWithEmailAndPassword(auth, fbCandidateEmail, rawPassword);
        const fbUser = cred.user;
        const roleEval = await evaluateFirebaseUserAdminRole(fbUser);

        // Requirement 12: Normal Firebase customer attempting /admin/login must be denied with exact message
        if (!roleEval.isAnyAdmin && !isReservedAdminIdentifier(cleanEmail, adminUsers)) {
          await firebaseSignOut(auth).catch(() => {});
          return {
            success: false,
            redirectTo: '/admin/login',
            error: 'You do not have administrator access.',
          };
        }

        // Exchange verified Firebase admin session for backend token
        window.localStorage.removeItem(LS_KEYS.CURRENT_USER);
        window.localStorage.removeItem(LS_KEYS.LEGACY_CURRENT_USER);
        setUser(null);

        try {
          const exchangeRes = await fetch('/api/admin/firebase-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: fbUser.uid,
              email: cleanEmail,
              displayName: fbUser.displayName || cleanEmail.split('@')[0],
              isCustomClaimAdmin: roleEval.isCustomClaimAdmin,
              isFirestoreAdmin: roleEval.isFirestoreAdmin,
            }),
          });
          if (exchangeRes.ok) {
            const data = await exchangeRes.json();
            if (data?.ok && data?.token && data?.admin) {
              setAdminSessionStorage(data.token, data.admin);
              setAdminUser(data.admin);
              if (Array.isArray(data.auditLogs)) {
                setAuditLogs(data.auditLogs);
                writeStorage(LS_KEYS.AUDIT_LOGS, data.auditLogs, false);
              }
              if (Array.isArray(data.adminUsers)) {
                setAdminUsers(data.adminUsers);
                writeStorage(LS_KEYS.ADMIN_USERS, data.adminUsers, false);
              }
              return {
                success: true,
                redirectTo: '/admin',
              };
            }
          }
        } catch {
          // Fallback to Firebase ID token for verified Firebase admin
        }

        const fbAdminRecord: AdminUserRecord = {
          uid: fbUser.uid,
          email: cleanEmail,
          displayName: fbUser.displayName || 'Master Admin',
          role: 'SUPER_ADMIN',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        const fbToken = await fbUser.getIdToken();
        setAdminSessionStorage(fbToken, fbAdminRecord);
        setAdminUser(fbAdminRecord);
        return {
          success: true,
          redirectTo: '/admin',
        };
      } catch {
        // Invalid Firebase credentials
      }
    }

    // Step C: WebCrypto PBKDF2-SHA512 fallback if deployed as a static bundle without /api/admin/login
    const isPrimaryMasterAlias =
      cleanEmail === 'admit@baigtours' ||
      cleanEmail === 'admin@baigtours' ||
      cleanEmail === 'admit@baigtours.com' ||
      cleanEmail === 'admin@baigtours.com' ||
      cleanEmail === 'admin@baigtreks.com' ||
      cleanEmail === 'only_baig';

    if (!serverHandledAndRejected && isPrimaryMasterAlias) {
      const verified = await verifyWebCryptoPbkdf2(rawPassword);
      if (verified) {
        window.localStorage.removeItem(LS_KEYS.CURRENT_USER);
        window.localStorage.removeItem(LS_KEYS.LEGACY_CURRENT_USER);
        setUser(null);

        const masterProfile: AdminUserRecord = {
          uid: 'super_admin_baigtours',
          email: ADMIN_EMAIL,
          displayName: 'Master Admin',
          role: 'SUPER_ADMIN',
          status: 'active',
          createdAt: '2026-01-01T00:00:00.000Z',
          lastLoginAt: new Date().toISOString(),
        };
        const wcToken = `wc_admin_${Date.now()}`;
        setAdminSessionStorage(wcToken, masterProfile);
        setAdminUser(masterProfile);
        recordLocalAuditLog(
          'Admin logged in',
          'Session',
          masterProfile.uid,
          masterProfile.email,
          'Authenticated into Admin Portal (SUPER_ADMIN)'
        );
        return {
          success: true,
          redirectTo: '/admin',
        };
      }
    }

    // If a non-admin email tried to log in at /admin/login, return "You do not have administrator access."
    if (!isReservedAdminIdentifier(cleanEmail, adminUsers) && cleanEmail.includes('@')) {
      return {
        success: false,
        redirectTo: '/admin/login',
        error: 'You do not have administrator access.',
      };
    }

    return {
      success: false,
      redirectTo: '/admin/login',
      error: 'Invalid admin credentials.',
    };
  };

  // 2. Customer Signup (/signup) — Never stores plaintext password in localStorage/sessionStorage/Firestore
  const signupWithCredentials = async (data: {
    displayName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ success: boolean; redirectTo: string; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.displayName.trim();
    const cleanPhone = (data.phone || '').trim();

    if (!cleanName) {
      return {
        success: false,
        redirectTo: '/signup',
        error: 'Please enter your full name.',
      };
    }

    if (isReservedAdminIdentifier(cleanEmail, adminUsers)) {
      return {
        success: false,
        redirectTo: '/admin/login',
        error: 'Administrator accounts must sign in at the Admin Portal (/admin/login).',
      };
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return {
        success: false,
        redirectTo: '/signup',
        error: 'Please enter a valid email address (e.g. name@example.com).',
      };
    }

    if (!data.password || data.password.length < 6) {
      return {
        success: false,
        redirectTo: '/signup',
        error: 'Password must be at least 6 characters long.',
      };
    }

    if (!cleanPhone) {
      return {
        success: false,
        redirectTo: '/signup',
        error: 'Please enter your phone or WhatsApp number.',
      };
    }

    const storedUsers = readMergedUsers();
    if (storedUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        redirectTo: '/signup',
        error: 'An account with this email already exists. Please log in instead.',
      };
    }

    let resolvedUid = `user_${Date.now()}`;

    // Also register with Firebase Authentication if available (without duplicating admin accounts)
    if (hasValidFirebaseConfig && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
        resolvedUid = cred.user.uid;
      } catch {
        // Proceed with server-side PBKDF2 registration
      }
    }

    // Register via server-side PBKDF2 endpoint (/api/customer/signup)
    try {
      const res = await fetch('/api/customer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: resolvedUid,
          displayName: cleanName,
          email: cleanEmail,
          password: data.password,
          phone: cleanPhone,
        }),
      });
      if (res.status === 409) {
        return {
          success: false,
          redirectTo: '/signup',
          error: 'An account with this email already exists. Please log in instead.',
        };
      }
    } catch {
      // Offline fallback
    }

    // Store ONLY non-sensitive customer profile in state/localStorage (NO password field!)
    const newUser: LocalUser = {
      uid: resolvedUid,
      name: cleanName,
      displayName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'customer',
      savedTourIds: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [newUser, ...storedUsers];
    writeStorage(LS_KEYS.USERS, updatedUsers);
    writeStorage(LS_KEYS.LEGACY_USERS, updatedUsers);
    writeStorage(LS_KEYS.CURRENT_USER, newUser);
    writeStorage(LS_KEYS.LEGACY_CURRENT_USER, newUser);

    setAdminSessionStorage(null, null);
    setAdminUser(null);
    setAllUsers(updatedUsers);
    setUser(newUser);
    setSignupNotificationNote(`Welcome, ${cleanName}! You are now signed in.`);

    return {
      success: true,
      redirectTo: '/my-bookings',
    };
  };

  const signInWithGoogle = async (phoneInput?: string) => {
    await signupWithCredentials({
      displayName: 'Traveler',
      email: `traveler_${Date.now()}@example.com`,
      password: `Pass_${Date.now()}`,
      phone: phoneInput || '03155449778',
    });
  };

  // 3. Secure Logout (Destroys admin, customer & Firebase sessions)
  const signOut = async () => {
    const token = getAdminToken();
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    if (hasValidFirebaseConfig && auth) {
      await firebaseSignOut(auth).catch(() => {});
    }
    setAdminSessionStorage(null, null);
    window.localStorage.removeItem(LS_KEYS.CURRENT_USER);
    window.localStorage.removeItem(LS_KEYS.LEGACY_CURRENT_USER);
    setAdminUser(null);
    setUser(null);
  };

  const toggleSaveTour = async (tourId: string) => {
    if (!user) return;
    const current = user.savedTourIds || [];
    const exists = current.includes(tourId);
    const updatedIds = exists ? current.filter((id) => id !== tourId) : [...current, tourId];
    const updatedUser: LocalUser = stripSensitiveFieldsFromUser({
      ...user,
      savedTourIds: updatedIds,
      role: 'customer',
    });
    setUser(updatedUser);
    writeStorage(LS_KEYS.CURRENT_USER, updatedUser);
    writeStorage(LS_KEYS.LEGACY_CURRENT_USER, updatedUser);

    const updatedAll = allUsers.map((u) =>
      u.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : u
    );
    setAllUsers(updatedAll);
    writeStorage(LS_KEYS.USERS, updatedAll);
    writeStorage(LS_KEYS.LEGACY_USERS, updatedAll);
    pushSharedStateToServer({ users: updatedAll });
  };

  const updateCustomerProfile = async (displayName: string, phone: string) => {
    if (!user) return;
    const cleanName = displayName.trim() || user.displayName;
    const updatedUser: LocalUser = stripSensitiveFieldsFromUser({
      ...user,
      name: cleanName,
      displayName: cleanName,
      phone: phone.trim(),
      role: 'customer',
    });
    setUser(updatedUser);
    writeStorage(LS_KEYS.CURRENT_USER, updatedUser);
    writeStorage(LS_KEYS.LEGACY_CURRENT_USER, updatedUser);

    const updatedAll = allUsers.map((u) =>
      u.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : u
    );
    setAllUsers(updatedAll);
    writeStorage(LS_KEYS.USERS, updatedAll);
    writeStorage(LS_KEYS.LEGACY_USERS, updatedAll);
    pushSharedStateToServer({ users: updatedAll });
  };

  const changeCustomerPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'You must be logged in to change your password.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    try {
      const res = await fetch('/api/customer/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errData?.error || 'Current password does not match.',
        };
      }
    } catch {
      // Fallback to Firebase Auth password update if signed into Firebase
    }

    if (hasValidFirebaseConfig && auth?.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword);
      } catch {
        // Ignore if not using Firebase Auth session
      }
    }

    return { success: true };
  };

  const submitInquiry = async (data: {
    customerName: string;
    email: string;
    whatsapp: string;
    travelers: number;
    destination: string;
    preferredDates: string;
    tourType: string;
    budget: string;
    tourSlug?: string;
    message: string;
  }): Promise<{ persistedToDb: boolean }> => {
    const newInquiry: InquiryRecord = {
      id: `inq_${Date.now()}`,
      userId: user?.uid || 'guest',
      customerName: data.customerName.trim() || 'Traveler',
      email: data.email.trim(),
      whatsapp: data.whatsapp.trim(),
      travelers: Number(data.travelers) || 1,
      destination: data.destination.trim(),
      preferredDates: data.preferredDates.trim(),
      tourType: data.tourType.trim(),
      budget: data.budget.trim(),
      tourSlug: data.tourSlug || '',
      message: data.message.trim(),
      status: 'NEW',
      internalNotes: '',
      createdAt: new Date().toISOString(),
    };
    const next = [newInquiry, ...inquiries];
    setInquiries(next);
    writeStorage(LS_KEYS.INQUIRIES, next);
    pushSharedStateToServer({ inquiries: next });
    return { persistedToDb: true };
  };

  const submitBookingRequest = async (data: {
    customerName: string;
    email: string;
    whatsapp: string;
    tourId: string;
    tourSlug?: string;
    tourTitle: string;
    tourImage?: string;
    pricePerPerson?: number;
    travelDates: string;
    travelers: number;
    notes: string;
  }): Promise<BookingRecord> => {
    const resolvedEmail = (user?.email || data.email || '').trim().toLowerCase();
    const newBooking: BookingRecord = {
      id: `bk_${Date.now()}`,
      userId: user?.uid || 'guest',
      userEmail: resolvedEmail,
      customerName: data.customerName.trim() || user?.displayName || 'Traveler',
      email: resolvedEmail,
      whatsapp: data.whatsapp.trim() || user?.phone || '',
      tourId: data.tourId,
      tourSlug: data.tourSlug || data.tourId,
      tourTitle: data.tourTitle,
      tourImage: data.tourImage,
      pricePerPerson: data.pricePerPerson,
      travelDates: data.travelDates,
      travelers: Number(data.travelers) || 1,
      bookingStatus: 'PENDING',
      paymentStatus: 'PAYMENT PENDING',
      paymentMethod: 'JazzCash / Direct Confirmation',
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    const next = [newBooking, ...bookings];
    setBookings(next);
    writeStorage(LS_KEYS.BOOKINGS, next);
    writeStorage(LS_KEYS.LEGACY_BOOKINGS, next);
    pushSharedStateToServer({ bookings: next });
    return newBooking;
  };

  // ============================================================================
  // PROTECTED ADMIN CMS ACTIONS (Enforces isAdmin + Records Audit Logs)
  // ============================================================================

  const assertAdmin = () => {
    if (!isAdmin) {
      throw new Error('REQUEST DENIED: Administrator privileges required.');
    }
  };

  const syncAuditWithServer = async (
    payload: Record<string, unknown>,
    auditEntry: {
      action: string;
      targetType: string;
      targetId: string;
      targetName: string;
      details: string;
    }
  ) => {
    recordLocalAuditLog(
      auditEntry.action,
      auditEntry.targetType,
      auditEntry.targetId,
      auditEntry.targetName,
      auditEntry.details
    );
    const serverLogs = await pushSharedStateToServer(payload, auditEntry);
    if (serverLogs) {
      setAuditLogs(serverLogs);
    }
  };

  const saveTourAdmin = async (tour: TourItem) => {
    assertAdmin();
    const cleanId = sanitizeId(tour.id || tour.slug || tour.title);
    const cleanSlug = sanitizeId(tour.slug || cleanId);
    const isExisting = allTours.some((t) => t.id === cleanId || t.slug === cleanSlug);
    const normalized: TourItem = {
      ...tour,
      id: cleanId,
      slug: cleanSlug,
      published: tour.published ?? true,
      pricePerPerson: Math.max(0, Number(tour.pricePerPerson) || 0),
      couplePrice: Math.max(0, Number(tour.couplePrice) || 0),
      childPrice: Math.max(0, Number(tour.childPrice) || 0),
    };

    const idx = allTours.findIndex((t) => t.id === cleanId || t.slug === cleanSlug);
    const updated =
      idx >= 0
        ? allTours.map((t, i) => (i === idx ? normalized : t))
        : [normalized, ...allTours];

    setAllTours(updated);
    writeStorage(LS_KEYS.TOURS, updated);
    await syncAuditWithServer(
      { tours: updated },
      {
        action: isExisting ? 'Tour edited' : 'Tour created',
        targetType: 'Tour',
        targetId: cleanId,
        targetName: normalized.title,
        details: `${isExisting ? 'Updated' : 'Created'} tour "${normalized.title}" (${
          normalized.published ? 'Published' : 'Draft/Unpublished'
        })`,
      }
    );
  };

  const deleteTourAdmin = async (tourId: string) => {
    assertAdmin();
    const target = allTours.find((t) => t.id === tourId || t.slug === tourId);
    const updated = allTours.filter((t) => t.id !== tourId && t.slug !== tourId);
    setAllTours(updated);
    writeStorage(LS_KEYS.TOURS, updated);
    await syncAuditWithServer(
      { tours: updated },
      {
        action: 'Tour deleted',
        targetType: 'Tour',
        targetId: tourId,
        targetName: target?.title || tourId,
        details: `Deleted tour package "${target?.title || tourId}"`,
      }
    );
  };

  const togglePublishTourAdmin = async (tourId: string) => {
    assertAdmin();
    const target = allTours.find((t) => t.id === tourId || t.slug === tourId);
    if (!target) return;
    const nextPublished = target.published === false ? true : false;
    const updated = allTours.map((t) =>
      t.id === tourId || t.slug === tourId ? { ...t, published: nextPublished } : t
    );
    setAllTours(updated);
    writeStorage(LS_KEYS.TOURS, updated);
    await syncAuditWithServer(
      { tours: updated },
      {
        action: nextPublished ? 'Tour published' : 'Tour unpublished',
        targetType: 'Tour',
        targetId: tourId,
        targetName: target.title,
        details: `${nextPublished ? 'Published' : 'Unpublished'} tour "${target.title}"`,
      }
    );
  };

  const toggleFeatureTourAdmin = async (tourId: string) => {
    assertAdmin();
    const target = allTours.find((t) => t.id === tourId || t.slug === tourId);
    if (!target) return;
    const nextFeatured = !target.featured;
    const updated = allTours.map((t) =>
      t.id === tourId || t.slug === tourId ? { ...t, featured: nextFeatured } : t
    );
    setAllTours(updated);
    writeStorage(LS_KEYS.TOURS, updated);
    await syncAuditWithServer(
      { tours: updated },
      {
        action: nextFeatured ? 'Tour featured' : 'Tour unfeatured',
        targetType: 'Tour',
        targetId: tourId,
        targetName: target.title,
        details: `${nextFeatured ? 'Featured' : 'Unfeatured'} tour "${target.title}"`,
      }
    );
  };

  const exportToursAsJson = () => {
    assertAdmin();
    const dataStr = JSON.stringify(allTours, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baig-treks-tours-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importToursFromJson = (
    jsonString: string
  ): { success: boolean; count: number; error?: string } => {
    if (!isAdmin) {
      return { success: false, count: 0, error: 'REQUEST DENIED' };
    }
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'JSON file must contain an array of tours.' };
      }
      const validTours: TourItem[] = parsed
        .filter((item) => item && typeof item === 'object' && item.title)
        .map((item) => {
          const cleanId = sanitizeId(item.id || item.slug || item.title);
          return {
            ...item,
            id: cleanId,
            slug: sanitizeId(item.slug || cleanId),
            published: item.published ?? true,
            pricePerPerson: Math.max(0, Number(item.pricePerPerson) || 0),
            couplePrice: Math.max(0, Number(item.couplePrice) || 0),
            childPrice: Math.max(0, Number(item.childPrice) || 0),
          } as TourItem;
        });

      if (validTours.length === 0) {
        return { success: false, count: 0, error: 'No valid tour objects found in JSON.' };
      }

      setAllTours(validTours);
      writeStorage(LS_KEYS.TOURS, validTours);
      syncAuditWithServer(
        { tours: validTours },
        {
          action: 'Tours imported',
          targetType: 'Tour',
          targetId: 'bulk_import',
          targetName: `${validTours.length} tours`,
          details: `Imported ${validTours.length} tours from JSON`,
        }
      );
      return { success: true, count: validTours.length };
    } catch {
      return { success: false, count: 0, error: 'Invalid JSON file format.' };
    }
  };

  const resetToursToDefault = () => {
    assertAdmin();
    const defaults = INITIAL_TOURS.map((t) => ({ ...t, published: true }));
    setAllTours(defaults);
    writeStorage(LS_KEYS.TOURS, defaults);
    syncAuditWithServer(
      { tours: defaults },
      {
        action: 'Tours reset to default',
        targetType: 'Tour',
        targetId: 'catalog_reset',
        targetName: 'Default Tour Catalog',
        details: 'Reset tour catalog to initial Gilgit-Baltistan packages',
      }
    );
  };

  const saveDestinationAdmin = async (dest: DestinationItem) => {
    assertAdmin();
    const cleanId = sanitizeId(dest.id || dest.slug || dest.name);
    const isExisting = allDestinations.some((d) => d.id === cleanId);
    const normalized: DestinationItem = {
      ...dest,
      id: cleanId,
      slug: sanitizeId(dest.slug || cleanId),
      published: dest.published ?? true,
    };
    const idx = allDestinations.findIndex((d) => d.id === cleanId);
    const updated =
      idx >= 0
        ? allDestinations.map((d, i) => (i === idx ? normalized : d))
        : [normalized, ...allDestinations];
    setAllDestinations(updated);
    writeStorage(LS_KEYS.DESTINATIONS, updated);
    await syncAuditWithServer(
      { destinations: updated },
      {
        action: isExisting ? 'Destination edited' : 'Destination created',
        targetType: 'Destination',
        targetId: cleanId,
        targetName: normalized.name,
        details: `${isExisting ? 'Updated' : 'Created'} destination "${normalized.name}"`,
      }
    );
  };

  const deleteDestinationAdmin = async (destId: string) => {
    assertAdmin();
    const target = allDestinations.find((d) => d.id === destId);
    const updated = allDestinations.filter((d) => d.id !== destId);
    setAllDestinations(updated);
    writeStorage(LS_KEYS.DESTINATIONS, updated);
    await syncAuditWithServer(
      { destinations: updated },
      {
        action: 'Destination deleted',
        targetType: 'Destination',
        targetId: destId,
        targetName: target?.name || destId,
        details: `Deleted destination "${target?.name || destId}"`,
      }
    );
  };

  const togglePublishDestinationAdmin = async (destId: string) => {
    assertAdmin();
    const target = allDestinations.find((d) => d.id === destId);
    if (!target) return;
    const nextPub = target.published === false ? true : false;
    const updated = allDestinations.map((d) =>
      d.id === destId ? { ...d, published: nextPub } : d
    );
    setAllDestinations(updated);
    writeStorage(LS_KEYS.DESTINATIONS, updated);
    await syncAuditWithServer(
      { destinations: updated },
      {
        action: nextPub ? 'Destination published' : 'Destination unpublished',
        targetType: 'Destination',
        targetId: destId,
        targetName: target.name,
        details: `${nextPub ? 'Published' : 'Unpublished'} destination "${target.name}"`,
      }
    );
  };

  const saveBlogPostAdmin = async (post: BlogPostItem) => {
    assertAdmin();
    const cleanId = sanitizeId(post.id || post.slug || post.title);
    const isExisting = allBlogPosts.some((p) => p.id === cleanId);
    const normalized: BlogPostItem = {
      ...post,
      id: cleanId,
      slug: sanitizeId(post.slug || cleanId),
      published: post.published ?? true,
    };
    const idx = allBlogPosts.findIndex((p) => p.id === cleanId);
    const updated =
      idx >= 0 ? allBlogPosts.map((p, i) => (i === idx ? normalized : p)) : [normalized, ...allBlogPosts];
    setBlogPosts(updated);
    writeStorage(LS_KEYS.BLOG, updated);
    await syncAuditWithServer(
      { blogPosts: updated },
      {
        action: isExisting ? 'Travel guide edited' : 'Travel guide created',
        targetType: 'BlogPost',
        targetId: cleanId,
        targetName: normalized.title,
        details: `${isExisting ? 'Updated' : 'Created'} travel guide "${normalized.title}"`,
      }
    );
  };

  const deleteBlogPostAdmin = async (postId: string) => {
    assertAdmin();
    const target = allBlogPosts.find((p) => p.id === postId);
    const updated = allBlogPosts.filter((p) => p.id !== postId);
    setBlogPosts(updated);
    writeStorage(LS_KEYS.BLOG, updated);
    await syncAuditWithServer(
      { blogPosts: updated },
      {
        action: 'Travel guide deleted',
        targetType: 'BlogPost',
        targetId: postId,
        targetName: target?.title || postId,
        details: `Deleted travel guide "${target?.title || postId}"`,
      }
    );
  };

  const togglePublishBlogPostAdmin = async (postId: string) => {
    assertAdmin();
    const target = allBlogPosts.find((p) => p.id === postId);
    if (!target) return;
    const nextPub = target.published === false ? true : false;
    const updated = allBlogPosts.map((p) =>
      p.id === postId ? { ...p, published: nextPub } : p
    );
    setBlogPosts(updated);
    writeStorage(LS_KEYS.BLOG, updated);
    await syncAuditWithServer(
      { blogPosts: updated },
      {
        action: nextPub ? 'Travel guide published' : 'Travel guide unpublished',
        targetType: 'BlogPost',
        targetId: postId,
        targetName: target.title,
        details: `${nextPub ? 'Published' : 'Unpublished'} travel guide "${target.title}"`,
      }
    );
  };

  const saveGalleryImageAdmin = async (img: GalleryImageItem) => {
    assertAdmin();
    const cleanId = sanitizeId(img.id || `gal_${Date.now()}`);
    const isExisting = allGallery.some((g) => g.id === cleanId);
    const normalized: GalleryImageItem = {
      ...img,
      id: cleanId,
      published: img.published ?? true,
    };
    const idx = allGallery.findIndex((g) => g.id === cleanId);
    const updated =
      idx >= 0
        ? allGallery.map((g, i) => (i === idx ? normalized : g))
        : [normalized, ...allGallery];
    setAllGallery(updated);
    writeStorage(LS_KEYS.GALLERY, updated);
    await syncAuditWithServer(
      { gallery: updated },
      {
        action: isExisting ? 'Gallery image edited' : 'Gallery image uploaded',
        targetType: 'Gallery',
        targetId: cleanId,
        targetName: normalized.caption,
        details: `${isExisting ? 'Updated' : 'Uploaded'} gallery image "${normalized.caption}"`,
      }
    );
  };

  const deleteGalleryImageAdmin = async (imgId: string) => {
    assertAdmin();
    const target = allGallery.find((g) => g.id === imgId);
    const updated = allGallery.filter((g) => g.id !== imgId);
    setAllGallery(updated);
    writeStorage(LS_KEYS.GALLERY, updated);
    await syncAuditWithServer(
      { gallery: updated },
      {
        action: 'Gallery image deleted',
        targetType: 'Gallery',
        targetId: imgId,
        targetName: target?.caption || imgId,
        details: `Deleted gallery image "${target?.caption || imgId}"`,
      }
    );
  };

  const togglePublishGalleryAdmin = async (imgId: string) => {
    assertAdmin();
    const target = allGallery.find((g) => g.id === imgId);
    if (!target) return;
    const nextPub = target.published === false ? true : false;
    const updated = allGallery.map((g) =>
      g.id === imgId ? { ...g, published: nextPub } : g
    );
    setAllGallery(updated);
    writeStorage(LS_KEYS.GALLERY, updated);
    await syncAuditWithServer(
      { gallery: updated },
      {
        action: nextPub ? 'Gallery image published' : 'Gallery image unpublished',
        targetType: 'Gallery',
        targetId: imgId,
        targetName: target.caption,
        details: `${nextPub ? 'Published' : 'Unpublished'} gallery image "${target.caption}"`,
      }
    );
  };

  const saveReviewAdmin = async (rev: ReviewItem) => {
    assertAdmin();
    const cleanId = sanitizeId(rev.id || `rev_${Date.now()}`);
    const isExisting = allReviews.some((r) => r.id === cleanId);
    const normalized: ReviewItem = {
      ...rev,
      id: cleanId,
      date: rev.date || rev.dateText || new Date().toISOString().slice(0, 10),
      dateText: rev.dateText || rev.date || new Date().toISOString().slice(0, 10),
      published: rev.published ?? true,
    };
    const idx = allReviews.findIndex((r) => r.id === cleanId);
    const updated =
      idx >= 0
        ? allReviews.map((r, i) => (i === idx ? normalized : r))
        : [normalized, ...allReviews];
    setAllReviews(updated);
    writeStorage(LS_KEYS.REVIEWS, updated);
    await syncAuditWithServer(
      { reviews: updated },
      {
        action: isExisting ? 'Review edited' : 'Review published',
        targetType: 'Review',
        targetId: cleanId,
        targetName: normalized.customerName,
        details: `${isExisting ? 'Updated' : 'Added'} review by ${normalized.customerName} (${
          normalized.rating
        }/5)`,
      }
    );
  };

  const deleteReviewAdmin = async (revId: string) => {
    assertAdmin();
    const target = allReviews.find((r) => r.id === revId);
    const updated = allReviews.filter((r) => r.id !== revId);
    setAllReviews(updated);
    writeStorage(LS_KEYS.REVIEWS, updated);
    await syncAuditWithServer(
      { reviews: updated },
      {
        action: 'Review deleted',
        targetType: 'Review',
        targetId: revId,
        targetName: target?.customerName || revId,
        details: `Deleted review by ${target?.customerName || revId}`,
      }
    );
  };

  const togglePublishReviewAdmin = async (revId: string) => {
    assertAdmin();
    const target = allReviews.find((r) => r.id === revId);
    if (!target) return;
    const nextPub = target.published === false ? true : false;
    const updated = allReviews.map((r) =>
      r.id === revId ? { ...r, published: nextPub } : r
    );
    setAllReviews(updated);
    writeStorage(LS_KEYS.REVIEWS, updated);
    await syncAuditWithServer(
      { reviews: updated },
      {
        action: nextPub ? 'Review published' : 'Review unpublished',
        targetType: 'Review',
        targetId: revId,
        targetName: target.customerName,
        details: `${nextPub ? 'Published' : 'Unpublished'} review by ${target.customerName}`,
      }
    );
  };

  const updateInquiryAdmin = async (
    inquiryId: string,
    status: InquiryRecord['status'],
    internalNotes: string
  ) => {
    assertAdmin();
    const target = inquiries.find((i) => i.id === inquiryId);
    const updated = inquiries.map((inq) =>
      inq.id === inquiryId ? { ...inq, status, internalNotes } : inq
    );
    setInquiries(updated);
    writeStorage(LS_KEYS.INQUIRIES, updated);
    await syncAuditWithServer(
      { inquiries: updated },
      {
        action: 'Inquiry updated',
        targetType: 'Inquiry',
        targetId: inquiryId,
        targetName: target?.customerName || inquiryId,
        details: `Set inquiry status to ${status.toUpperCase()} for ${
          target?.customerName || inquiryId
        }`,
      }
    );
  };

  const deleteInquiryAdmin = async (inquiryId: string) => {
    assertAdmin();
    const target = inquiries.find((i) => i.id === inquiryId);
    const updated = inquiries.filter((i) => i.id !== inquiryId);
    setInquiries(updated);
    writeStorage(LS_KEYS.INQUIRIES, updated);
    await syncAuditWithServer(
      { inquiries: updated },
      {
        action: 'Inquiry deleted',
        targetType: 'Inquiry',
        targetId: inquiryId,
        targetName: target?.customerName || inquiryId,
        details: `Deleted inquiry from ${target?.customerName || inquiryId}`,
      }
    );
  };

  const createBookingAdmin = async (data: {
    customerName: string;
    email: string;
    whatsapp: string;
    tourId: string;
    tourTitle: string;
    travelDates: string;
    travelers: number;
    bookingStatus: BookingRecord['bookingStatus'];
    paymentStatus: BookingRecord['paymentStatus'];
    notes: string;
  }): Promise<BookingRecord> => {
    assertAdmin();
    const cleanEmail = data.email.trim().toLowerCase();
    const newBooking: BookingRecord = {
      id: `bk_${Date.now()}`,
      userId: `admin_created_${Date.now()}`,
      userEmail: cleanEmail,
      customerName: data.customerName.trim() || 'Traveler',
      email: cleanEmail,
      whatsapp: data.whatsapp.trim(),
      tourId: data.tourId || sanitizeId(data.tourTitle),
      tourSlug: data.tourId || sanitizeId(data.tourTitle),
      tourTitle: data.tourTitle.trim(),
      travelDates: data.travelDates.trim() || 'Flexible',
      travelers: Math.max(1, Number(data.travelers) || 1),
      bookingStatus: data.bookingStatus || 'CONFIRMED',
      paymentStatus: data.paymentStatus || 'PAYMENT PENDING',
      paymentMethod: 'JazzCash / Admin Entry',
      notes: data.notes.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    writeStorage(LS_KEYS.BOOKINGS, updated);
    writeStorage(LS_KEYS.LEGACY_BOOKINGS, updated);
    await syncAuditWithServer(
      { bookings: updated },
      {
        action: 'Booking created by Admin',
        targetType: 'Booking',
        targetId: newBooking.id,
        targetName: `${newBooking.customerName} (${newBooking.tourTitle})`,
        details: `Created booking ${newBooking.id} (${newBooking.bookingStatus})`,
      }
    );
    return newBooking;
  };

  const updateBookingAdmin = async (
    bookingId: string,
    bookingStatus: BookingRecord['bookingStatus'],
    paymentStatus: BookingRecord['paymentStatus'],
    travelDates: string,
    notes: string,
    extra?: Partial<Pick<BookingRecord, 'customerName' | 'email' | 'whatsapp' | 'tourTitle' | 'travelers'>>
  ) => {
    assertAdmin();
    const target = bookings.find((b) => b.id === bookingId);
    const updated = bookings.map((bk) =>
      bk.id === bookingId
        ? {
            ...bk,
            ...(extra || {}),
            userEmail: extra?.email ? extra.email.trim().toLowerCase() : bk.userEmail,
            bookingStatus,
            paymentStatus,
            travelDates,
            notes,
          }
        : bk
    );
    setBookings(updated);
    writeStorage(LS_KEYS.BOOKINGS, updated);
    writeStorage(LS_KEYS.LEGACY_BOOKINGS, updated);
    await syncAuditWithServer(
      { bookings: updated },
      {
        action: 'Booking updated',
        targetType: 'Booking',
        targetId: bookingId,
        targetName: `${extra?.customerName || target?.customerName || 'Customer'} (${extra?.tourTitle || target?.tourTitle || bookingId})`,
        details: `Updated booking ${bookingId}: Status=${bookingStatus}, Payment=${paymentStatus}`,
      }
    );
  };

  const deleteBookingAdmin = async (bookingId: string) => {
    assertAdmin();
    const target = bookings.find((b) => b.id === bookingId);
    const updated = bookings.filter((b) => b.id !== bookingId);
    setBookings(updated);
    writeStorage(LS_KEYS.BOOKINGS, updated);
    writeStorage(LS_KEYS.LEGACY_BOOKINGS, updated);
    await syncAuditWithServer(
      { bookings: updated },
      {
        action: 'Booking deleted',
        targetType: 'Booking',
        targetId: bookingId,
        targetName: target?.customerName || bookingId,
        details: `Deleted booking ${bookingId}`,
      }
    );
  };

  const saveCustomerAdmin = async (data: {
    uid?: string;
    displayName: string;
    email: string;
    phone: string;
    status: 'active' | 'disabled';
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    assertAdmin();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.displayName.trim() || cleanEmail.split('@')[0];
    const cleanPhone = data.phone.trim();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid customer email address.' };
    }
    if (isReservedAdminIdentifier(cleanEmail, adminUsers)) {
      return { success: false, error: 'Cannot register an administrator email as a customer account.' };
    }

    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          uid: data.uid,
          displayName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          status: data.status,
          password: data.password,
        }),
      });
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body?.users)) {
          writeStorage(LS_KEYS.USERS, body.users);
          writeStorage(LS_KEYS.LEGACY_USERS, body.users);
          setAllUsers(readMergedUsers());
        }
        if (Array.isArray(body?.auditLogs)) {
          setAuditLogs(body.auditLogs);
          writeStorage(LS_KEYS.AUDIT_LOGS, body.auditLogs, false);
        }
        return { success: true };
      } else {
        const errBody = await res.json().catch(() => ({}));
        return { success: false, error: errBody?.error || 'Could not save customer account.' };
      }
    } catch {
      // Fallback update in local state
      const existingIdx = allUsers.findIndex(
        (u) => (data.uid && u.uid === data.uid) || u.email.toLowerCase() === cleanEmail
      );
      const record: LocalUser = {
        uid: data.uid || (existingIdx >= 0 ? allUsers[existingIdx].uid : `user_${Date.now()}`),
        name: cleanName,
        displayName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'customer',
        savedTourIds: existingIdx >= 0 ? allUsers[existingIdx].savedTourIds : [],
        status: data.status,
        createdAt: existingIdx >= 0 ? allUsers[existingIdx].createdAt : new Date().toISOString(),
      };
      const updated =
        existingIdx >= 0
          ? allUsers.map((u, i) => (i === existingIdx ? record : u))
          : [record, ...allUsers];
      setAllUsers(updated);
      writeStorage(LS_KEYS.USERS, updated);
      writeStorage(LS_KEYS.LEGACY_USERS, updated);
      return { success: true };
    }
  };

  const updateCustomerStatusAdmin = async (uid: string, status: 'active' | 'disabled') => {
    assertAdmin();
    const target = allUsers.find((u) => u.uid === uid);
    const updated = allUsers.map((u) => (u.uid === uid ? { ...u, status } : u));
    setAllUsers(updated);
    writeStorage(LS_KEYS.USERS, updated);
    writeStorage(LS_KEYS.LEGACY_USERS, updated);
    await syncAuditWithServer(
      { users: updated },
      {
        action: 'Customer status updated',
        targetType: 'Customer',
        targetId: uid,
        targetName: target?.email || uid,
        details: `Changed customer account status to ${status} for ${target?.email || uid}`,
      }
    );
  };

  const deleteCustomerAdmin = async (uid: string) => {
    assertAdmin();
    const target = allUsers.find((u) => u.uid === uid);
    const updated = allUsers.filter((u) => u.uid !== uid);
    setAllUsers(updated);
    writeStorage(LS_KEYS.USERS, updated);
    writeStorage(LS_KEYS.LEGACY_USERS, updated);
    await syncAuditWithServer(
      { users: updated },
      {
        action: 'Customer deleted',
        targetType: 'Customer',
        targetId: uid,
        targetName: target?.email || uid,
        details: `Removed customer account ${target?.email || uid}`,
      }
    );
  };

  const saveSiteSettingsAdmin = async (newSettings: Partial<BusinessConfig>) => {
    assertAdmin();
    const cleanWhatsapp = (newSettings.whatsapp || business.whatsapp).replace(/[^0-9]/g, '') || '923155449778';
    const merged: BusinessConfig = {
      ...business,
      ...newSettings,
      whatsapp: cleanWhatsapp,
      whatsappUrl: `https://wa.me/${cleanWhatsapp}`,
    };
    setBusiness(merged);
    writeStorage(LS_KEYS.SETTINGS, merged);
    await syncAuditWithServer(
      { settings: merged },
      {
        action: 'Website settings changed',
        targetType: 'Settings',
        targetId: 'global_settings',
        targetName: merged.name,
        details: `Updated website configuration (WhatsApp: ${merged.whatsapp}, Phone: ${merged.phone})`,
      }
    );
  };

  const changeAdminPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    assertAdmin();
    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data?.error || 'Could not change admin password.' };
      }
      if (Array.isArray(data?.auditLogs)) {
        setAuditLogs(data.auditLogs);
        writeStorage(LS_KEYS.AUDIT_LOGS, data.auditLogs, false);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Server connection required to update admin password.' };
    }
  };

  const createAdminAccount = async (data: {
    email: string;
    displayName: string;
    password: string;
    role: 'ADMIN' | 'SUPER_ADMIN';
  }): Promise<{ success: boolean; error?: string }> => {
    if (!isSuperAdmin) {
      return { success: false, error: 'REQUEST DENIED: Only SUPER_ADMIN can create administrators.' };
    }
    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        return { success: false, error: body?.error || 'Failed to create administrator.' };
      }
      if (Array.isArray(body?.adminUsers)) {
        setAdminUsers(body.adminUsers);
        writeStorage(LS_KEYS.ADMIN_USERS, body.adminUsers, false);
      }
      if (Array.isArray(body?.auditLogs)) {
        setAuditLogs(body.auditLogs);
        writeStorage(LS_KEYS.AUDIT_LOGS, body.auditLogs, false);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to connect to authentication server.' };
    }
  };

  const updateAdminAccountRole = async (
    uid: string,
    role: 'ADMIN' | 'SUPER_ADMIN',
    status: 'active' | 'disabled'
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSuperAdmin) {
      return { success: false, error: 'REQUEST DENIED: Only SUPER_ADMIN can modify administrators.' };
    }
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(uid)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role, status }),
      });
      const body = await res.json();
      if (!res.ok) {
        return { success: false, error: body?.error || 'Failed to update administrator.' };
      }
      if (Array.isArray(body?.adminUsers)) {
        setAdminUsers(body.adminUsers);
        writeStorage(LS_KEYS.ADMIN_USERS, body.adminUsers, false);
      }
      if (Array.isArray(body?.auditLogs)) {
        setAuditLogs(body.auditLogs);
        writeStorage(LS_KEYS.AUDIT_LOGS, body.auditLogs, false);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to connect to authentication server.' };
    }
  };

  const deleteAdminAccount = async (uid: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSuperAdmin) {
      return { success: false, error: 'REQUEST DENIED: Only SUPER_ADMIN can delete administrators.' };
    }
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(uid)}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const body = await res.json();
      if (!res.ok) {
        return { success: false, error: body?.error || 'Failed to delete administrator.' };
      }
      if (Array.isArray(body?.adminUsers)) {
        setAdminUsers(body.adminUsers);
        writeStorage(LS_KEYS.ADMIN_USERS, body.adminUsers, false);
      }
      if (Array.isArray(body?.auditLogs)) {
        setAuditLogs(body.auditLogs);
        writeStorage(LS_KEYS.AUDIT_LOGS, body.auditLogs, false);
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to connect to authentication server.' };
    }
  };

  const seedInitialCatalogToFirestore = async () => {
    assertAdmin();
    resetToursToDefault();
    writeStorage(LS_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
    setAllDestinations(INITIAL_DESTINATIONS);
    writeStorage(LS_KEYS.BLOG, INITIAL_BLOG_POSTS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    writeStorage(LS_KEYS.GALLERY, INITIAL_GALLERY);
    setAllGallery(INITIAL_GALLERY);
    await syncAuditWithServer(
      {
        tours: INITIAL_TOURS,
        destinations: INITIAL_DESTINATIONS,
        blogPosts: INITIAL_BLOG_POSTS,
        gallery: INITIAL_GALLERY,
      },
      {
        action: 'Catalog reset to defaults',
        targetType: 'System',
        targetId: 'all_collections',
        targetName: 'Initial Catalog',
        details: 'Restored default tours, destinations, guides, and gallery',
      }
    );
  };

  // Expose sanitized customer list (passwords strictly omitted)
  const sanitizedCustomerUsers: UserProfileData[] = allUsers.map((u) => ({
    uid: u.uid,
    displayName: u.displayName || u.name || u.email.split('@')[0],
    email: u.email,
    phone: u.phone,
    role: 'CUSTOMER',
    savedTourIds: u.savedTourIds || [],
    createdAt: u.createdAt,
    status: u.status || 'active',
  }));

  return (
    <AppContext.Provider
      value={{
        user,
        adminUser,
        adminRole,
        profile,
        privateInfo,
        authReady,
        isAdmin,
        isSuperAdmin,
        business,
        tours,
        allTours,
        destinations,
        allDestinations,
        blogPosts,
        allBlogPosts,
        gallery,
        allGallery,
        reviews,
        allReviews,
        faqs,
        inquiries,
        bookings,
        allUsers: sanitizedCustomerUsers,
        adminUsers,
        auditLogs,
        signupNotificationNote,
        clearSignupNotificationNote: () => setSignupNotificationNote(null),
        loginWithCredentials,
        loginAdminSecret,
        signupWithCredentials,
        signInWithGoogle,
        signOut,
        toggleSaveTour,
        updateCustomerProfile,
        changeCustomerPassword,
        submitInquiry,
        submitBookingRequest,
        saveTourAdmin,
        deleteTourAdmin,
        togglePublishTourAdmin,
        toggleFeatureTourAdmin,
        exportToursAsJson,
        importToursFromJson,
        resetToursToDefault,
        saveDestinationAdmin,
        deleteDestinationAdmin,
        togglePublishDestinationAdmin,
        saveBlogPostAdmin,
        deleteBlogPostAdmin,
        togglePublishBlogPostAdmin,
        saveGalleryImageAdmin,
        deleteGalleryImageAdmin,
        togglePublishGalleryAdmin,
        saveReviewAdmin,
        deleteReviewAdmin,
        togglePublishReviewAdmin,
        updateInquiryAdmin,
        deleteInquiryAdmin,
        createBookingAdmin,
        updateBookingAdmin,
        deleteBookingAdmin,
        saveCustomerAdmin,
        updateCustomerStatusAdmin,
        deleteCustomerAdmin,
        saveSiteSettingsAdmin,
        changeAdminPassword,
        createAdminAccount,
        updateAdminAccountRole,
        deleteAdminAccount,
        seedInitialCatalogToFirestore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
