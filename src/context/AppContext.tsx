import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BusinessConfig, defaultBusinessConfig } from '../config/business';
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

export interface LocalUser {
  uid: string;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedTourIds: string[];
  password?: string;
  status: 'active' | 'disabled';
  createdAt: string;
}

export interface UserProfileData {
  uid: string;
  displayName: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'admin';
  savedTourIds: string[];
}

export interface UserPrivateData {
  uid: string;
  email: string;
  phone: string;
  status: 'active' | 'disabled';
}

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
  status: 'pending' | 'contacted' | 'resolved' | 'archived';
  internalNotes: string;
  createdAt?: string;
}

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
  bookingStatus: 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'verification_pending' | 'confirmed_by_admin' | 'refunded';
  paymentMethod: string;
  notes: string;
  createdAt?: string;
}

// Exact LocalStorage Keys requested + Legacy Sync Keys
const LS_KEYS = {
  IS_ADMIN: 'isAdmin',
  USER_ROLE: 'userRole',
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
  SYNC_TS: 'btt_last_sync_ts',
};

const BROADCAST_CHANNEL_NAME = 'baig_treks_live_sync_v1';

// Hardcoded Admin Credentials
export const ADMIN_EMAIL = 'admin@baigtreks.com';
export const ADMIN_PASSWORD = 'admin123';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function readMergedUsers(): LocalUser[] {
  const primary = readStorage<LocalUser[]>(LS_KEYS.USERS, []);
  const legacy = readStorage<LocalUser[]>(LS_KEYS.LEGACY_USERS, []);
  const map = new Map<string, LocalUser>();
  [...legacy, ...primary].forEach((u) => {
    if (u && u.email) {
      const normalized: LocalUser = {
        ...u,
        name: u.name || u.displayName || u.email.split('@')[0],
        displayName: u.displayName || u.name || u.email.split('@')[0],
      };
      map.set(u.email.toLowerCase(), normalized);
    }
  });
  return Array.from(map.values());
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

function readCurrentUserFromStorage(): LocalUser | null {
  const primary = readStorage<LocalUser | null>(LS_KEYS.CURRENT_USER, null);
  if (primary && primary.email) {
    return {
      ...primary,
      name: primary.name || primary.displayName || primary.email.split('@')[0],
      displayName: primary.displayName || primary.name || primary.email.split('@')[0],
    };
  }
  const legacy = readStorage<LocalUser | null>(LS_KEYS.LEGACY_CURRENT_USER, null);
  if (legacy && legacy.email) {
    return {
      ...legacy,
      name: legacy.name || legacy.displayName || legacy.email.split('@')[0],
      displayName: legacy.displayName || legacy.name || legacy.email.split('@')[0],
    };
  }
  return null;
}

async function pushSharedStateToServer(payload: Record<string, unknown>): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/shared-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.updatedAt) {
        window.localStorage.setItem(LS_KEYS.SYNC_TS, String(data.updatedAt));
      }
    }
  } catch {
    // Silent fallback when deployed on static-only Vercel
  }
}

interface AppContextValue {
  user: LocalUser | null;
  profile: UserProfileData | null;
  privateInfo: UserPrivateData | null;
  authReady: boolean;
  isAdmin: boolean;
  business: BusinessConfig;
  tours: TourItem[];
  destinations: DestinationItem[];
  blogPosts: BlogPostItem[];
  gallery: GalleryImageItem[];
  reviews: ReviewItem[];
  faqs: FAQItem[];
  inquiries: InquiryRecord[];
  bookings: BookingRecord[];
  allUsers: UserProfileData[];
  signupNotificationNote: string | null;
  clearSignupNotificationNote: () => void;
  // Auth Methods
  loginWithCredentials: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; isAdmin: boolean; redirectTo: string; error?: string }>;
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
  // Admin CMS Operations
  saveTourAdmin: (tour: TourItem) => Promise<void>;
  deleteTourAdmin: (tourId: string) => Promise<void>;
  exportToursAsJson: () => void;
  importToursFromJson: (jsonString: string) => { success: boolean; count: number; error?: string };
  resetToursToDefault: () => void;
  saveDestinationAdmin: (dest: DestinationItem) => Promise<void>;
  deleteDestinationAdmin: (destId: string) => Promise<void>;
  saveBlogPostAdmin: (post: BlogPostItem) => Promise<void>;
  deleteBlogPostAdmin: (postId: string) => Promise<void>;
  saveGalleryImageAdmin: (img: GalleryImageItem) => Promise<void>;
  deleteGalleryImageAdmin: (imgId: string) => Promise<void>;
  saveReviewAdmin: (rev: ReviewItem) => Promise<void>;
  deleteReviewAdmin: (revId: string) => Promise<void>;
  updateInquiryAdmin: (
    inquiryId: string,
    status: InquiryRecord['status'],
    internalNotes: string
  ) => Promise<void>;
  updateBookingAdmin: (
    bookingId: string,
    bookingStatus: BookingRecord['bookingStatus'],
    paymentStatus: BookingRecord['paymentStatus'],
    travelDates: string,
    notes: string
  ) => Promise<void>;
  saveSiteSettingsAdmin: (newSettings: Partial<BusinessConfig>) => Promise<void>;
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
  if (!Array.isArray(list) || list.length === 0) return INITIAL_DESTINATIONS;
  return list
    .filter((item): item is Partial<DestinationItem> => Boolean(item && typeof item === 'object'))
    .map((d) => {
      const fallback = INITIAL_DESTINATIONS.find(
        (init) => init.id === d.id || init.slug === d.slug || init.name === d.name
      );
      return {
        id: d.id || fallback?.id || 'dest',
        slug: d.slug || fallback?.slug || d.id || 'dest',
        name: d.name || fallback?.name || 'Destination',
        region: d.region || fallback?.region || 'Gilgit-Baltistan',
        elevation: d.elevation || fallback?.elevation || '2,400 m',
        coordinates: d.coordinates || fallback?.coordinates || { x: 50, y: 35 },
        shortDescription: d.shortDescription || fallback?.shortDescription || '',
        description: d.description || fallback?.description || '',
        attractions:
          Array.isArray(d.attractions) && d.attractions.length > 0
            ? d.attractions
            : fallback?.attractions || ['Scenic Viewpoints', 'Mountain Panoramas', 'Local Heritage'],
        bestSeason: d.bestSeason || fallback?.bestSeason || 'April to October',
        idealFor:
          Array.isArray(d.idealFor) && d.idealFor.length > 0
            ? d.idealFor
            : fallback?.idealFor || ['Families', 'Couples', 'Adventure Travelers'],
        imageUrl: d.imageUrl || fallback?.imageUrl || INITIAL_DESTINATIONS[0].imageUrl,
        isConfirmedTourOffering:
          d.isConfirmedTourOffering ?? fallback?.isConfirmedTourOffering ?? true,
        activeTourOffering: d.activeTourOffering ?? fallback?.activeTourOffering ?? true,
      };
    });
}

function normalizeTours(list: unknown): TourItem[] {
  if (!Array.isArray(list) || list.length === 0) return INITIAL_TOURS;
  return list
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
        slug: t.slug || fallback?.slug || t.id || `tour_${Date.now()}`,
        title: t.title || fallback?.title || 'Gilgit-Baltistan Tour',
        destination: t.destination || fallback?.destination || 'Hunza',
        duration: t.duration || fallback?.duration || '5 Days / 4 Nights',
        durationCategory: t.durationCategory || fallback?.durationCategory || '4-6 Days',
        tourType: t.tourType || fallback?.tourType || 'Family Holidays',
        shortDescription: t.shortDescription || fallback?.shortDescription || '',
        overview: t.overview || fallback?.overview || '',
        pricePerPerson: Number(t.pricePerPerson) || 0,
        couplePrice: Number(t.couplePrice) || 0,
        childPrice: Number(t.childPrice) || 0,
        itinerary: Array.isArray(t.itinerary) ? t.itinerary : fallback?.itinerary || [],
        inclusions: Array.isArray(t.inclusions) ? t.inclusions : fallback?.inclusions || [],
        exclusions: Array.isArray(t.exclusions) ? t.exclusions : fallback?.exclusions || [],
      };
    });
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(() => readCurrentUserFromStorage());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const current = readCurrentUserFromStorage();
    return window.localStorage.getItem(LS_KEYS.IS_ADMIN) === 'true' || current?.role === 'admin';
  });
  const [authReady] = useState(true);
  const [signupNotificationNote, setSignupNotificationNote] = useState<string | null>(null);

  const [business, setBusiness] = useState<BusinessConfig>(() =>
    readStorage<BusinessConfig>(LS_KEYS.SETTINGS, defaultBusinessConfig)
  );
  const [tours, setTours] = useState<TourItem[]>(() =>
    normalizeTours(readStorage<TourItem[]>(LS_KEYS.TOURS, INITIAL_TOURS))
  );
  const [destinations, setDestinations] = useState<DestinationItem[]>(() =>
    normalizeDestinations(readStorage<DestinationItem[]>(LS_KEYS.DESTINATIONS, INITIAL_DESTINATIONS))
  );
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(() =>
    readStorage<BlogPostItem[]>(LS_KEYS.BLOG, INITIAL_BLOG_POSTS)
  );
  const [gallery, setGallery] = useState<GalleryImageItem[]>(() =>
    readStorage<GalleryImageItem[]>(LS_KEYS.GALLERY, INITIAL_GALLERY)
  );
  const [reviews, setReviews] = useState<ReviewItem[]>(() =>
    readStorage<ReviewItem[]>(LS_KEYS.REVIEWS, [])
  );
  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(() =>
    readStorage<InquiryRecord[]>(LS_KEYS.INQUIRIES, [])
  );
  const [bookings, setBookings] = useState<BookingRecord[]>(() => readMergedBookings());
  const [allUsers, setAllUsers] = useState<LocalUser[]>(() => readMergedUsers());

  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.localStorage.getItem(LS_KEYS.TOURS)) {
      writeStorage(LS_KEYS.TOURS, INITIAL_TOURS, false);
    }

    const refreshFromLocalStorage = () => {
      const current = readCurrentUserFromStorage();
      setUser(current);
      setIsAdmin(
        window.localStorage.getItem(LS_KEYS.IS_ADMIN) === 'true' || current?.role === 'admin'
      );
      setTours(normalizeTours(readStorage<TourItem[]>(LS_KEYS.TOURS, INITIAL_TOURS)));
      setDestinations(
        normalizeDestinations(
          readStorage<DestinationItem[]>(LS_KEYS.DESTINATIONS, INITIAL_DESTINATIONS)
        )
      );
      setBlogPosts(readStorage<BlogPostItem[]>(LS_KEYS.BLOG, INITIAL_BLOG_POSTS));
      setGallery(readStorage<GalleryImageItem[]>(LS_KEYS.GALLERY, INITIAL_GALLERY));
      setReviews(readStorage<ReviewItem[]>(LS_KEYS.REVIEWS, []));
      setInquiries(readStorage<InquiryRecord[]>(LS_KEYS.INQUIRIES, []));
      setBookings(readMergedBookings());
      setAllUsers(readMergedUsers());
      setBusiness(readStorage<BusinessConfig>(LS_KEYS.SETTINGS, defaultBusinessConfig));
    };

    const handleStorageEvent = () => {
      refreshFromLocalStorage();
    };
    window.addEventListener('storage', handleStorageEvent);

    let bc: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = () => {
          refreshFromLocalStorage();
        };
      } catch {
        bc = null;
      }
    }

    const pullFromServer = async () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      try {
        const res = await fetch('/api/shared-state', { cache: 'no-store' });
        if (!res.ok) return;
        const remote = await res.json();
        const localTs = Number(window.localStorage.getItem(LS_KEYS.SYNC_TS) || '0');

        if (remote && typeof remote.updatedAt === 'number' && remote.updatedAt > localTs) {
          if (Array.isArray(remote.tours) && remote.tours.length > 0) {
            const normalizedTours = normalizeTours(remote.tours);
            writeStorage(LS_KEYS.TOURS, normalizedTours, false);
            setTours(normalizedTours);
          }
          if (Array.isArray(remote.destinations) && remote.destinations.length > 0) {
            const normalizedDests = normalizeDestinations(remote.destinations);
            writeStorage(LS_KEYS.DESTINATIONS, normalizedDests, false);
            setDestinations(normalizedDests);
          }
          if (Array.isArray(remote.blogPosts) && remote.blogPosts.length > 0) {
            writeStorage(LS_KEYS.BLOG, remote.blogPosts, false);
            setBlogPosts(remote.blogPosts);
          }
          if (Array.isArray(remote.gallery) && remote.gallery.length > 0) {
            writeStorage(LS_KEYS.GALLERY, remote.gallery, false);
            setGallery(remote.gallery);
          }
          if (Array.isArray(remote.reviews)) {
            writeStorage(LS_KEYS.REVIEWS, remote.reviews, false);
            setReviews(remote.reviews);
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
            setAllUsers(remote.users);
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
        // Silent fallback on static-only Vercel
      } finally {
        isSyncingRef.current = false;
      }
    };

    pullFromServer();
    const pollInterval = window.setInterval(pullFromServer, 4000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshFromLocalStorage();
        pullFromServer();
      }
    };
    window.addEventListener('focus', handleVisibility);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('focus', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(pollInterval);
      if (bc) bc.close();
    };
  }, []);

  const profile: UserProfileData | null = user
    ? {
        uid: user.uid,
        displayName: user.displayName || user.name || user.email.split('@')[0],
        email: user.email,
        phone: user.phone,
        role: isAdmin ? 'admin' : user.role,
        savedTourIds: user.savedTourIds || [],
      }
    : isAdmin
    ? {
        uid: 'admin_baigtreks',
        displayName: 'Baig Admin',
        email: ADMIN_EMAIL,
        phone: defaultBusinessConfig.phone,
        role: 'admin',
        savedTourIds: [],
      }
    : null;

  const privateInfo: UserPrivateData | null = user
    ? {
        uid: user.uid,
        email: user.email,
        phone: user.phone || '',
        status: user.status || 'active',
      }
    : isAdmin
    ? {
        uid: 'admin_baigtreks',
        email: ADMIN_EMAIL,
        phone: defaultBusinessConfig.phone,
        status: 'active',
      }
    : null;

  // 1. Login with Email & Password (checks email format, min 6 chars, admin credentials, or localStorage 'users')
  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; isAdmin: boolean; redirectTo: string; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return {
        success: false,
        isAdmin: false,
        redirectTo: '/login',
        error: 'Please enter a valid email address (e.g. name@example.com).',
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

    // Check Hardcoded Admin Credentials: admin@baigtreks.com / admin123
    if (cleanEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: LocalUser = {
        uid: 'admin_baigtreks',
        name: 'Baig Admin',
        displayName: 'Baig Admin',
        email: ADMIN_EMAIL,
        phone: business.phone,
        role: 'admin',
        savedTourIds: [],
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      window.localStorage.setItem(LS_KEYS.IS_ADMIN, 'true');
      window.localStorage.setItem(LS_KEYS.USER_ROLE, 'admin');
      writeStorage(LS_KEYS.CURRENT_USER, adminUser);
      writeStorage(LS_KEYS.LEGACY_CURRENT_USER, adminUser);
      broadcastStorageUpdate(LS_KEYS.IS_ADMIN, 'true');
      setIsAdmin(true);
      setUser(adminUser);
      return {
        success: true,
        isAdmin: true,
        redirectTo: '/',
      };
    }

    // Check registered customers in localStorage 'users'
    const storedUsers = readMergedUsers();
    const matched = storedUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!matched) {
      return {
        success: false,
        isAdmin: false,
        redirectTo: '/login',
        error:
          'Invalid email or password. Please check your credentials or create an account on Sign Up.',
      };
    }

    window.localStorage.setItem(LS_KEYS.IS_ADMIN, 'false');
    window.localStorage.setItem(LS_KEYS.USER_ROLE, 'customer');
    writeStorage(LS_KEYS.CURRENT_USER, matched);
    writeStorage(LS_KEYS.LEGACY_CURRENT_USER, matched);
    broadcastStorageUpdate(LS_KEYS.IS_ADMIN, 'false');
    setIsAdmin(false);
    setUser(matched);
    return {
      success: true,
      isAdmin: false,
      redirectTo: '/my-bookings',
    };
  };

  // 2. Signup in localStorage 'users' & auto-login into 'currentUser'
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

    if (cleanEmail === ADMIN_EMAIL) {
      return {
        success: false,
        redirectTo: '/login',
        error: 'This is the reserved Admin email. Please sign in on the Login page using admin123.',
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

    const newUser: LocalUser = {
      uid: `user_${Date.now()}`,
      name: cleanName,
      displayName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'customer',
      savedTourIds: [],
      password: data.password,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [newUser, ...storedUsers];
    writeStorage(LS_KEYS.USERS, updatedUsers);
    writeStorage(LS_KEYS.LEGACY_USERS, updatedUsers);
    writeStorage(LS_KEYS.CURRENT_USER, newUser);
    writeStorage(LS_KEYS.LEGACY_CURRENT_USER, newUser);
    window.localStorage.setItem(LS_KEYS.IS_ADMIN, 'false');
    window.localStorage.setItem(LS_KEYS.USER_ROLE, 'customer');
    broadcastStorageUpdate(LS_KEYS.IS_ADMIN, 'false');

    setAllUsers(updatedUsers);
    setIsAdmin(false);
    setUser(newUser);
    pushSharedStateToServer({ users: updatedUsers });
    setSignupNotificationNote(
      `Welcome, ${cleanName}! You are now signed in.`
    );

    return {
      success: true,
      redirectTo: '/my-bookings',
    };
  };

  const signInWithGoogle = async (phoneInput?: string) => {
    await signupWithCredentials({
      displayName: 'Traveler',
      email: `traveler_${Date.now()}@example.com`,
      password: 'password123',
      phone: phoneInput || '03155449778',
    });
  };

  // 3. Logout (clears currentUser, isAdmin, userRole from localStorage)
  const signOut = async () => {
    window.localStorage.removeItem(LS_KEYS.IS_ADMIN);
    window.localStorage.removeItem(LS_KEYS.USER_ROLE);
    window.localStorage.removeItem(LS_KEYS.CURRENT_USER);
    window.localStorage.removeItem(LS_KEYS.LEGACY_CURRENT_USER);
    broadcastStorageUpdate(LS_KEYS.IS_ADMIN, null);
    setIsAdmin(false);
    setUser(null);
  };

  const toggleSaveTour = async (tourId: string) => {
    if (!user) return;
    const current = user.savedTourIds || [];
    const exists = current.includes(tourId);
    const updatedIds = exists ? current.filter((id) => id !== tourId) : [...current, tourId];
    const updatedUser: LocalUser = { ...user, savedTourIds: updatedIds };
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
    const updatedUser: LocalUser = {
      ...user,
      name: cleanName,
      displayName: cleanName,
      phone: phone.trim(),
    };
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
    if (user.password && currentPassword !== user.password) {
      return { success: false, error: 'Current password does not match.' };
    }

    const updatedUser: LocalUser = {
      ...user,
      password: newPassword,
    };
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
      status: 'pending',
      internalNotes: '',
      createdAt: new Date().toISOString(),
    };
    const next = [newInquiry, ...inquiries];
    setInquiries(next);
    writeStorage(LS_KEYS.INQUIRIES, next);
    pushSharedStateToServer({ inquiries: next });
    return { persistedToDb: true };
  };

  // Save booking in localStorage 'bookings' with userEmail
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
      bookingStatus: 'pending_confirmation',
      paymentStatus: 'unpaid',
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

  const saveTourAdmin = async (tour: TourItem) => {
    const cleanId = sanitizeId(tour.id || tour.slug || tour.title);
    const cleanSlug = sanitizeId(tour.slug || cleanId);
    const normalized: TourItem = {
      ...tour,
      id: cleanId,
      slug: cleanSlug,
      pricePerPerson: Math.max(0, Number(tour.pricePerPerson) || 0),
      couplePrice: Math.max(0, Number(tour.couplePrice) || 0),
      childPrice: Math.max(0, Number(tour.childPrice) || 0),
    };

    setTours((prev) => {
      const idx = prev.findIndex((t) => t.id === cleanId || t.slug === cleanSlug);
      let updated: TourItem[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = normalized;
      } else {
        updated = [normalized, ...prev];
      }
      writeStorage(LS_KEYS.TOURS, updated);
      pushSharedStateToServer({ tours: updated });
      return updated;
    });
  };

  const deleteTourAdmin = async (tourId: string) => {
    setTours((prev) => {
      const updated = prev.filter((t) => t.id !== tourId && t.slug !== tourId);
      writeStorage(LS_KEYS.TOURS, updated);
      pushSharedStateToServer({ tours: updated });
      return updated;
    });
  };

  const exportToursAsJson = () => {
    const dataStr = JSON.stringify(tours, null, 2);
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
            pricePerPerson: Math.max(0, Number(item.pricePerPerson) || 0),
            couplePrice: Math.max(0, Number(item.couplePrice) || 0),
            childPrice: Math.max(0, Number(item.childPrice) || 0),
          } as TourItem;
        });

      if (validTours.length === 0) {
        return { success: false, count: 0, error: 'No valid tour objects found in JSON.' };
      }

      setTours(validTours);
      writeStorage(LS_KEYS.TOURS, validTours);
      pushSharedStateToServer({ tours: validTours });
      return { success: true, count: validTours.length };
    } catch {
      return { success: false, count: 0, error: 'Invalid JSON file format.' };
    }
  };

  const resetToursToDefault = () => {
    setTours(INITIAL_TOURS);
    writeStorage(LS_KEYS.TOURS, INITIAL_TOURS);
    pushSharedStateToServer({ tours: INITIAL_TOURS });
  };

  const saveDestinationAdmin = async (dest: DestinationItem) => {
    const cleanId = sanitizeId(dest.id || dest.slug || dest.name);
    const normalized: DestinationItem = { ...dest, id: cleanId, slug: cleanId };
    setDestinations((prev) => {
      const idx = prev.findIndex((d) => d.id === cleanId);
      const updated =
        idx >= 0 ? prev.map((d, i) => (i === idx ? normalized : d)) : [normalized, ...prev];
      writeStorage(LS_KEYS.DESTINATIONS, updated);
      pushSharedStateToServer({ destinations: updated });
      return updated;
    });
  };

  const deleteDestinationAdmin = async (destId: string) => {
    setDestinations((prev) => {
      const updated = prev.filter((d) => d.id !== destId);
      writeStorage(LS_KEYS.DESTINATIONS, updated);
      pushSharedStateToServer({ destinations: updated });
      return updated;
    });
  };

  const saveBlogPostAdmin = async (post: BlogPostItem) => {
    const cleanId = sanitizeId(post.id || post.slug || post.title);
    const normalized: BlogPostItem = { ...post, id: cleanId, slug: cleanId };
    setBlogPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === cleanId);
      const updated =
        idx >= 0 ? prev.map((p, i) => (i === idx ? normalized : p)) : [normalized, ...prev];
      writeStorage(LS_KEYS.BLOG, updated);
      pushSharedStateToServer({ blogPosts: updated });
      return updated;
    });
  };

  const deleteBlogPostAdmin = async (postId: string) => {
    setBlogPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      writeStorage(LS_KEYS.BLOG, updated);
      pushSharedStateToServer({ blogPosts: updated });
      return updated;
    });
  };

  const saveGalleryImageAdmin = async (img: GalleryImageItem) => {
    const cleanId = sanitizeId(img.id || `gal_${Date.now()}`);
    const normalized: GalleryImageItem = { ...img, id: cleanId };
    setGallery((prev) => {
      const updated = [normalized, ...prev];
      writeStorage(LS_KEYS.GALLERY, updated);
      pushSharedStateToServer({ gallery: updated });
      return updated;
    });
  };

  const deleteGalleryImageAdmin = async (imgId: string) => {
    setGallery((prev) => {
      const updated = prev.filter((g) => g.id !== imgId);
      writeStorage(LS_KEYS.GALLERY, updated);
      pushSharedStateToServer({ gallery: updated });
      return updated;
    });
  };

  const saveReviewAdmin = async (rev: ReviewItem) => {
    const cleanId = sanitizeId(rev.id || `rev_${Date.now()}`);
    const normalized: ReviewItem = { ...rev, id: cleanId };
    setReviews((prev) => {
      const updated = [normalized, ...prev];
      writeStorage(LS_KEYS.REVIEWS, updated);
      pushSharedStateToServer({ reviews: updated });
      return updated;
    });
  };

  const deleteReviewAdmin = async (revId: string) => {
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== revId);
      writeStorage(LS_KEYS.REVIEWS, updated);
      pushSharedStateToServer({ reviews: updated });
      return updated;
    });
  };

  const updateInquiryAdmin = async (
    inquiryId: string,
    status: InquiryRecord['status'],
    internalNotes: string
  ) => {
    setInquiries((prev) => {
      const updated = prev.map((inq) =>
        inq.id === inquiryId ? { ...inq, status, internalNotes } : inq
      );
      writeStorage(LS_KEYS.INQUIRIES, updated);
      pushSharedStateToServer({ inquiries: updated });
      return updated;
    });
  };

  const updateBookingAdmin = async (
    bookingId: string,
    bookingStatus: BookingRecord['bookingStatus'],
    paymentStatus: BookingRecord['paymentStatus'],
    travelDates: string,
    notes: string
  ) => {
    setBookings((prev) => {
      const updated = prev.map((bk) =>
        bk.id === bookingId
          ? { ...bk, bookingStatus, paymentStatus, travelDates, notes }
          : bk
      );
      writeStorage(LS_KEYS.BOOKINGS, updated);
      writeStorage(LS_KEYS.LEGACY_BOOKINGS, updated);
      pushSharedStateToServer({ bookings: updated });
      return updated;
    });
  };

  const saveSiteSettingsAdmin = async (newSettings: Partial<BusinessConfig>) => {
    setBusiness((prev) => {
      const merged = { ...prev, ...newSettings };
      writeStorage(LS_KEYS.SETTINGS, merged);
      pushSharedStateToServer({ settings: merged });
      return merged;
    });
  };

  const seedInitialCatalogToFirestore = async () => {
    resetToursToDefault();
    writeStorage(LS_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
    setDestinations(INITIAL_DESTINATIONS);
    writeStorage(LS_KEYS.BLOG, INITIAL_BLOG_POSTS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    writeStorage(LS_KEYS.GALLERY, INITIAL_GALLERY);
    setGallery(INITIAL_GALLERY);
    pushSharedStateToServer({
      tours: INITIAL_TOURS,
      destinations: INITIAL_DESTINATIONS,
      blogPosts: INITIAL_BLOG_POSTS,
      gallery: INITIAL_GALLERY,
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        privateInfo,
        authReady,
        isAdmin,
        business,
        tours,
        destinations,
        blogPosts,
        gallery,
        reviews,
        faqs,
        inquiries,
        bookings,
        allUsers,
        signupNotificationNote,
        clearSignupNotificationNote: () => setSignupNotificationNote(null),
        loginWithCredentials,
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
