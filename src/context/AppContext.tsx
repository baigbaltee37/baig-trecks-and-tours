import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
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

export interface UserProfileData {
  uid: string;
  displayName: string;
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
  createdAt?: unknown;
}

export interface BookingRecord {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  whatsapp: string;
  tourId: string;
  tourTitle: string;
  travelDates: string;
  travelers: number;
  bookingStatus: 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'verification_pending' | 'confirmed_by_admin' | 'refunded';
  paymentMethod: string;
  notes: string;
  createdAt?: unknown;
}

interface AppContextValue {
  user: FirebaseUser | null;
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
  signInWithGoogle: (phoneInput?: string) => Promise<void>;
  signOut: () => Promise<void>;
  toggleSaveTour: (tourId: string) => Promise<void>;
  updateCustomerProfile: (displayName: string, phone: string) => Promise<void>;
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
    tourTitle: string;
    travelDates: string;
    travelers: number;
    notes: string;
  }) => Promise<void>;
  // Admin CMS Operations
  saveTourAdmin: (tour: TourItem) => Promise<void>;
  deleteTourAdmin: (tourId: string) => Promise<void>;
  saveDestinationAdmin: (dest: DestinationItem) => Promise<void>;
  deleteDestinationAdmin: (destId: string) => Promise<void>;
  saveBlogPostAdmin: (post: BlogPostItem) => Promise<void>;
  deleteBlogPostAdmin: (postId: string) => Promise<void>;
  saveGalleryImageAdmin: (img: GalleryImageItem) => Promise<void>;
  deleteGalleryImageAdmin: (imgId: string) => Promise<void>;
  saveReviewAdmin: (rev: ReviewItem) => Promise<void>;
  deleteReviewAdmin: (revId: string) => Promise<void>;
  updateInquiryAdmin: (inquiryId: string, status: InquiryRecord['status'], internalNotes: string) => Promise<void>;
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
  return raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 100) || `id_${Date.now()}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [privateInfo, setPrivateInfo] = useState<UserPrivateData | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [signupNotificationNote, setSignupNotificationNote] = useState<string | null>(null);

  const [business, setBusiness] = useState<BusinessConfig>(defaultBusinessConfig);
  const [tours, setTours] = useState<TourItem[]>(INITIAL_TOURS);
  const [destinations, setDestinations] = useState<DestinationItem[]>(INITIAL_DESTINATIONS);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(INITIAL_BLOG_POSTS);
  const [gallery, setGallery] = useState<GalleryImageItem[]>(INITIAL_GALLERY);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfileData[]>([]);

  const isBootstrappedAdminEmail =
    Boolean(user?.email && user.email.toLowerCase() === 'baigbaltee37@gmail.com' && user.emailVerified);
  const isAdmin = isBootstrappedAdminEmail || profile?.role === 'admin';

  // Ensure user profile & private info exist on login, and send signup notification email on new registration
  const ensureUserRecords = async (fbUser: FirebaseUser, phoneOverride?: string) => {
    const userRef = doc(db, 'users', fbUser.uid);
    const privRef = doc(db, 'users', fbUser.uid, 'private', 'info');

    try {
      const snap = await getDoc(userRef);
      const isNewCustomer = !snap.exists();
      const assignedRole: 'customer' | 'admin' =
        fbUser.email?.toLowerCase() === 'baigbaltee37@gmail.com' && fbUser.emailVerified
          ? 'admin'
          : 'customer';

      if (isNewCustomer) {
        const displayName = (fbUser.displayName || fbUser.email?.split('@')[0] || 'Traveler').slice(0, 100);
        await setDoc(userRef, {
          uid: fbUser.uid,
          displayName,
          role: assignedRole,
          savedTourIds: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const phoneVal = (phoneOverride || fbUser.phoneNumber || '').slice(0, 40);
        const emailVal = (fbUser.email || 'unknown@example.com').slice(0, 160);
        await setDoc(privRef, {
          uid: fbUser.uid,
          email: emailVal,
          phone: phoneVal,
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Trigger server-side notification email to skardubhai1@gmail.com
        try {
          const resp = await fetch('/api/notify-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: fbUser.uid,
              displayName,
              email: emailVal,
              phone: phoneVal || 'Not provided',
              status: 'active',
            }),
          });
          if (resp.ok) {
            const result = await resp.json();
            setSignupNotificationNote(result.note || 'Account registered.');
          }
        } catch (notifyErr) {
          console.warn('Could not reach signup notification endpoint:', notifyErr);
        }
      }

      const freshSnap = await getDoc(userRef);
      if (freshSnap.exists()) {
        const d = freshSnap.data();
        setProfile({
          uid: d.uid,
          displayName: d.displayName,
          role: d.role,
          savedTourIds: Array.isArray(d.savedTourIds) ? d.savedTourIds : [],
        });
      }

      const freshPriv = await getDoc(privRef);
      if (freshPriv.exists()) {
        const pd = freshPriv.data();
        setPrivateInfo({
          uid: pd.uid,
          email: pd.email,
          phone: pd.phone,
          status: pd.status,
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${fbUser.uid}`);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        await ensureUserRecords(fbUser);
      } else {
        setProfile(null);
        setPrivateInfo(null);
        setInquiries([]);
        setBookings([]);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Public Firestore listeners (tours, destinations, reviews, blogPosts, gallery, settings)
  useEffect(() => {
    if (!authReady) return;

    const unsubTours = onSnapshot(
      collection(db, 'tours'),
      (snap) => {
        if (!snap.empty) {
          const loaded: TourItem[] = snap.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              slug: d.slug || docSnap.id,
              title: d.title || '',
              destination: d.destination || '',
              duration: d.duration || '',
              durationCategory: d.durationCategory || '4-6 Days',
              tourType: d.tourType || '',
              startingLocation: d.startingLocation || '',
              endingLocation: d.endingLocation || '',
              groupSize: d.groupSize || '',
              difficulty: d.difficulty || '',
              bestSeason: d.bestSeason || '',
              shortDescription: d.shortDescription || '',
              overview: d.overview || '',
              badge: d.badge || '',
              featured: Boolean(d.featured),
              bookingStatus: d.bookingStatus || 'Inquiry Only',
              pricePerPerson: Number(d.pricePerPerson || 0),
              couplePrice: Number(d.couplePrice || 0),
              childPrice: Number(d.childPrice || 0),
              groupPriceNote: d.groupPriceNote || 'Contact for group pricing',
              imageUrl: d.imageUrl || INITIAL_TOURS[0].imageUrl,
              itinerary: Array.isArray(d.itinerary) ? d.itinerary : [],
              inclusions: Array.isArray(d.inclusions) ? d.inclusions : [],
              exclusions: Array.isArray(d.exclusions) ? d.exclusions : [],
              transportation: d.transportation || '',
              accommodation: d.accommodation || '',
            };
          });
          setTours(loaded);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'tours')
    );

    const unsubDestinations = onSnapshot(
      collection(db, 'destinations'),
      (snap) => {
        if (!snap.empty) {
          const loaded: DestinationItem[] = snap.docs.map((docSnap) => {
            const d = docSnap.data();
            const fallbackMatch = INITIAL_DESTINATIONS.find((item) => item.slug === d.slug);
            return {
              id: docSnap.id,
              slug: d.slug || docSnap.id,
              name: d.name || '',
              region: d.region || 'Gilgit-Baltistan',
              elevation: fallbackMatch?.elevation || '2,400 m',
              coordinates: fallbackMatch?.coordinates || { x: 50, y: 50 },
              shortDescription: d.shortDescription || '',
              description: d.description || '',
              imageUrl: d.imageUrl || INITIAL_DESTINATIONS[0].imageUrl,
              isConfirmedTourOffering: Boolean(d.isConfirmedTourOffering),
            };
          });
          setDestinations(loaded);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'destinations')
    );

    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snap) => {
        const loaded: ReviewItem[] = snap.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            customerName: d.customerName || '',
            rating: Number(d.rating || 5),
            date: d.date || '',
            reviewText: d.reviewText || '',
            photoUrl: d.photoUrl || '',
            verified: Boolean(d.verified),
            source: d.source || 'Direct Traveler Feedback',
          };
        });
        setReviews(loaded);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'reviews')
    );

    const unsubGallery = onSnapshot(
      collection(db, 'gallery'),
      (snap) => {
        if (!snap.empty) {
          const loaded: GalleryImageItem[] = snap.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              imageUrl: d.imageUrl || '',
              caption: d.caption || '',
              altText: d.altText || '',
              category: d.category || 'Mountains',
              destination: d.destination || 'Gilgit-Baltistan',
              featured: Boolean(d.featured),
            };
          });
          setGallery(loaded);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'gallery')
    );

    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          const d = docSnap.data();
          setBusiness((prev) => ({
            ...prev,
            name: d.businessName || prev.name,
            phone: d.phone || prev.phone,
            whatsapp: d.whatsapp || prev.whatsapp,
            whatsappUrl: `https://wa.me/${(d.whatsapp || prev.whatsapp).replace(/[^0-9]/g, '')}`,
            email: d.email || prev.email,
            signupNotificationEmail: d.signupNotificationEmail || prev.signupNotificationEmail,
            jazzcashNumber: d.jazzcashNumber || prev.jazzcashNumber,
            jazzcashName: d.jazzcashName || prev.jazzcashName,
            tagline: d.tagline || prev.tagline,
            heroHeadline: d.heroHeadline || prev.heroHeadline,
            heroDescription: d.heroDescription || prev.heroDescription,
            address: d.address ?? prev.address,
            businessHours: d.businessHours ?? prev.businessHours,
            cancellationPolicy: d.cancellationPolicy ?? prev.cancellationPolicy,
            refundPolicy: d.refundPolicy ?? prev.refundPolicy,
            bookingPolicy: d.bookingPolicy ?? prev.bookingPolicy,
            paymentInstructions: d.paymentInstructions ?? prev.paymentInstructions,
            instagram: [
              {
                handle: '@only_baig',
                url: d.instagramPrimary || 'https://www.instagram.com/only_baig/',
                label: 'Official Perspective (@only_baig)',
              },
              {
                handle: '@baig_treks_and_tours',
                url: d.instagramSecondary || 'https://www.instagram.com/baig_treks_and_tours/',
                label: 'Expeditions & Tours (@baig_treks_and_tours)',
              },
            ],
          }));
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'settings/main')
    );

    return () => {
      unsubTours();
      unsubDestinations();
      unsubReviews();
      unsubGallery();
      unsubSettings();
    };
  }, [authReady]);

  // Authenticated listeners (inquiries, bookings, and admin users list)
  useEffect(() => {
    if (!authReady || !user) return;

    const inquiriesQuery = isBootstrappedAdminEmail
      ? collection(db, 'inquiries')
      : query(collection(db, 'inquiries'), where('userId', '==', user.uid));

    const bookingsQuery = isBootstrappedAdminEmail
      ? collection(db, 'bookings')
      : query(collection(db, 'bookings'), where('userId', '==', user.uid));

    const unsubInquiries = onSnapshot(
      inquiriesQuery,
      (snap) => {
        const items: InquiryRecord[] = snap.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            userId: d.userId,
            customerName: d.customerName,
            email: d.email,
            whatsapp: d.whatsapp,
            travelers: Number(d.travelers || 1),
            destination: d.destination || '',
            preferredDates: d.preferredDates || '',
            tourType: d.tourType || '',
            budget: d.budget || '',
            tourSlug: d.tourSlug || '',
            message: d.message || '',
            status: d.status || 'pending',
            internalNotes: d.internalNotes || '',
            createdAt: d.createdAt,
          };
        });
        setInquiries(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'inquiries')
    );

    const unsubBookings = onSnapshot(
      bookingsQuery,
      (snap) => {
        const items: BookingRecord[] = snap.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            userId: d.userId,
            customerName: d.customerName,
            email: d.email,
            whatsapp: d.whatsapp,
            tourId: d.tourId,
            tourTitle: d.tourTitle,
            travelDates: d.travelDates || '',
            travelers: Number(d.travelers || 1),
            bookingStatus: d.bookingStatus || 'pending_confirmation',
            paymentStatus: d.paymentStatus || 'unpaid',
            paymentMethod: d.paymentMethod || 'JazzCash Manual Transfer',
            notes: d.notes || '',
            createdAt: d.createdAt,
          };
        });
        setBookings(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'bookings')
    );

    let unsubUsers = () => {};
    if (isBootstrappedAdminEmail) {
      unsubUsers = onSnapshot(
        collection(db, 'users'),
        (snap) => {
          const list: UserProfileData[] = snap.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              uid: d.uid || docSnap.id,
              displayName: d.displayName || 'Traveler',
              role: d.role || 'customer',
              savedTourIds: Array.isArray(d.savedTourIds) ? d.savedTourIds : [],
            };
          });
          setAllUsers(list);
        },
        (err) => handleFirestoreError(err, OperationType.LIST, 'users')
      );
    }

    return () => {
      unsubInquiries();
      unsubBookings();
      unsubUsers();
    };
  }, [authReady, user, isBootstrappedAdminEmail]);

  const signInWithGoogle = async (phoneInput?: string) => {
    const cred = await signInWithPopup(auth, googleProvider);
    if (cred.user) {
      await ensureUserRecords(cred.user, phoneInput);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const toggleSaveTour = async (tourId: string) => {
    if (!user || !profile) return;
    const current = profile.savedTourIds || [];
    const exists = current.includes(tourId);
    const updated = exists
      ? current.filter((id) => id !== tourId)
      : [...current, tourId].slice(0, 20);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        savedTourIds: updated,
        updatedAt: serverTimestamp(),
      });
      setProfile({ ...profile, savedTourIds: updated });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const updateCustomerProfile = async (displayName: string, phone: string) => {
    if (!user || !profile) return;
    const cleanName = displayName.trim().slice(0, 100) || profile.displayName;
    const cleanPhone = phone.trim().slice(0, 40);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: cleanName,
        updatedAt: serverTimestamp(),
      });
      if (privateInfo) {
        await updateDoc(doc(db, 'users', user.uid, 'private', 'info'), {
          email: privateInfo.email,
          phone: cleanPhone,
          updatedAt: serverTimestamp(),
        });
        setPrivateInfo({ ...privateInfo, phone: cleanPhone });
      }
      setProfile({ ...profile, displayName: cleanName });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
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
    if (!user) {
      // Unauthenticated visitors can still use the form and continue directly on WhatsApp
      return { persistedToDb: false };
    }
    const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    try {
      await setDoc(doc(db, 'inquiries', inquiryId), {
        userId: user.uid,
        customerName: data.customerName.trim().slice(0, 100) || 'Traveler',
        email: data.email.trim().slice(0, 160),
        whatsapp: data.whatsapp.trim().slice(0, 40),
        travelers: Math.max(1, Math.min(200, Number(data.travelers) || 1)),
        destination: data.destination.trim().slice(0, 100),
        preferredDates: data.preferredDates.trim().slice(0, 100),
        tourType: data.tourType.trim().slice(0, 80),
        budget: data.budget.trim().slice(0, 80),
        tourSlug: (data.tourSlug || '').trim().slice(0, 120),
        message: data.message.trim().slice(0, 2000),
        status: 'pending',
        internalNotes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { persistedToDb: true };
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `inquiries/${inquiryId}`);
    }
  };

  const submitBookingRequest = async (data: {
    customerName: string;
    email: string;
    whatsapp: string;
    tourId: string;
    tourTitle: string;
    travelDates: string;
    travelers: number;
    notes: string;
  }) => {
    if (!user) throw new Error('Please sign in to save a booking request to your account.');
    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const cleanTourId = sanitizeId(data.tourId);

    // Ensure the referenced tour exists in Firestore so the Global Consistency Invariant passes
    const tourRef = doc(db, 'tours', cleanTourId);
    const tourSnap = await getDoc(tourRef);
    if (!tourSnap.exists() && isAdmin) {
      const localTour = tours.find((t) => t.id === cleanTourId || t.slug === cleanTourId);
      if (localTour) {
        await saveTourAdmin(localTour);
      }
    }

    try {
      await setDoc(doc(db, 'bookings', bookingId), {
        userId: user.uid,
        customerName: data.customerName.trim().slice(0, 100) || 'Traveler',
        email: data.email.trim().slice(0, 160),
        whatsapp: data.whatsapp.trim().slice(0, 40),
        tourId: cleanTourId,
        tourTitle: data.tourTitle.trim().slice(0, 160),
        travelDates: data.travelDates.trim().slice(0, 100),
        travelers: Math.max(1, Math.min(200, Number(data.travelers) || 1)),
        bookingStatus: 'pending_confirmation',
        paymentStatus: 'unpaid',
        paymentMethod: 'JazzCash Manual Transfer',
        notes: data.notes.trim().slice(0, 1500),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
    }
  };

  // Admin CMS mutations
  const saveTourAdmin = async (tour: TourItem) => {
    const docId = sanitizeId(tour.id || tour.slug);
    const ref = doc(db, 'tours', docId);
    try {
      const existingSnap = await getDoc(ref);
      const payload = {
        slug: sanitizeId(tour.slug || docId),
        title: tour.title.trim().slice(0, 160),
        destination: tour.destination.trim().slice(0, 80),
        duration: tour.duration.trim().slice(0, 60),
        durationCategory: tour.durationCategory,
        tourType: tour.tourType.trim().slice(0, 60),
        startingLocation: (tour.startingLocation || '').slice(0, 100),
        endingLocation: (tour.endingLocation || '').slice(0, 100),
        groupSize: (tour.groupSize || '').slice(0, 80),
        difficulty: (tour.difficulty || '').slice(0, 80),
        bestSeason: (tour.bestSeason || '').slice(0, 100),
        shortDescription: tour.shortDescription.slice(0, 400),
        overview: tour.overview.slice(0, 3000),
        badge: (tour.badge || '').slice(0, 40),
        featured: Boolean(tour.featured),
        bookingStatus: tour.bookingStatus,
        pricePerPerson: Math.max(0, Number(tour.pricePerPerson) || 0),
        couplePrice: Math.max(0, Number(tour.couplePrice) || 0),
        childPrice: Math.max(0, Number(tour.childPrice) || 0),
        groupPriceNote: (tour.groupPriceNote || 'Contact for group pricing').slice(0, 160),
        imageUrl: (tour.imageUrl || INITIAL_TOURS[0].imageUrl).slice(0, 500),
        itinerary: (tour.itinerary || []).slice(0, 20),
        inclusions: (tour.inclusions || []).slice(0, 20).map((s) => s.slice(0, 200)),
        exclusions: (tour.exclusions || []).slice(0, 20).map((s) => s.slice(0, 200)),
        transportation: (tour.transportation || '').slice(0, 300),
        accommodation: (tour.accommodation || '').slice(0, 300),
        createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(ref, payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `tours/${docId}`);
    }
  };

  const deleteTourAdmin = async (tourId: string) => {
    try {
      await deleteDoc(doc(db, 'tours', tourId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `tours/${tourId}`);
    }
  };

  const saveDestinationAdmin = async (dest: DestinationItem) => {
    const docId = sanitizeId(dest.id || dest.slug);
    const ref = doc(db, 'destinations', docId);
    try {
      const existingSnap = await getDoc(ref);
      await setDoc(ref, {
        slug: sanitizeId(dest.slug || docId),
        name: dest.name.trim().slice(0, 100),
        region: dest.region.trim().slice(0, 100),
        shortDescription: dest.shortDescription.slice(0, 350),
        description: dest.description.slice(0, 2500),
        imageUrl: dest.imageUrl.slice(0, 500),
        isConfirmedTourOffering: Boolean(dest.isConfirmedTourOffering),
        createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `destinations/${docId}`);
    }
  };

  const deleteDestinationAdmin = async (destId: string) => {
    try {
      await deleteDoc(doc(db, 'destinations', destId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `destinations/${destId}`);
    }
  };

  const saveBlogPostAdmin = async (post: BlogPostItem) => {
    const docId = sanitizeId(post.id || post.slug);
    const ref = doc(db, 'blogPosts', docId);
    try {
      const existingSnap = await getDoc(ref);
      await setDoc(ref, {
        slug: sanitizeId(post.slug || docId),
        title: post.title.trim().slice(0, 180),
        category: post.category.trim().slice(0, 80),
        excerpt: post.excerpt.slice(0, 400),
        content: post.content.slice(0, 15000),
        imageUrl: post.imageUrl.slice(0, 500),
        published: Boolean(post.published),
        readTime: (post.readTime || '5 min read').slice(0, 40),
        seoTitle: (post.seoTitle || post.title).slice(0, 160),
        seoDescription: (post.seoDescription || post.excerpt).slice(0, 320),
        createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setBlogPosts((prev) => {
        const idx = prev.findIndex((p) => p.id === docId);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...post, id: docId };
          return copy;
        }
        return [{ ...post, id: docId }, ...prev];
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `blogPosts/${docId}`);
    }
  };

  const deleteBlogPostAdmin = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'blogPosts', postId));
      setBlogPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `blogPosts/${postId}`);
    }
  };

  const saveGalleryImageAdmin = async (img: GalleryImageItem) => {
    const docId = sanitizeId(img.id || `gal_${Date.now()}`);
    const ref = doc(db, 'gallery', docId);
    try {
      const existingSnap = await getDoc(ref);
      await setDoc(ref, {
        imageUrl: img.imageUrl.slice(0, 500),
        caption: img.caption.slice(0, 300),
        altText: img.altText.slice(0, 300),
        category: img.category.slice(0, 80),
        destination: img.destination.slice(0, 80),
        featured: Boolean(img.featured),
        createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `gallery/${docId}`);
    }
  };

  const deleteGalleryImageAdmin = async (imgId: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', imgId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${imgId}`);
    }
  };

  const saveReviewAdmin = async (rev: ReviewItem) => {
    const docId = sanitizeId(rev.id || `rev_${Date.now()}`);
    const ref = doc(db, 'reviews', docId);
    try {
      const existingSnap = await getDoc(ref);
      await setDoc(ref, {
        customerName: rev.customerName.trim().slice(0, 100),
        rating: Math.max(1, Math.min(5, Number(rev.rating) || 5)),
        date: rev.date.slice(0, 40),
        reviewText: rev.reviewText.slice(0, 2000),
        photoUrl: (rev.photoUrl || '').slice(0, 500),
        verified: Boolean(rev.verified),
        source: (rev.source || 'Verified Traveler').slice(0, 60),
        createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `reviews/${docId}`);
    }
  };

  const deleteReviewAdmin = async (revId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', revId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${revId}`);
    }
  };

  const updateInquiryAdmin = async (
    inquiryId: string,
    status: InquiryRecord['status'],
    internalNotes: string
  ) => {
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status,
        internalNotes: internalNotes.slice(0, 1000),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${inquiryId}`);
    }
  };

  const updateBookingAdmin = async (
    bookingId: string,
    bookingStatus: BookingRecord['bookingStatus'],
    paymentStatus: BookingRecord['paymentStatus'],
    travelDates: string,
    notes: string
  ) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        bookingStatus,
        paymentStatus,
        travelDates: travelDates.slice(0, 100),
        notes: notes.slice(0, 1500),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
    }
  };

  const saveSiteSettingsAdmin = async (newSettings: Partial<BusinessConfig>) => {
    const merged = { ...business, ...newSettings };
    try {
      await setDoc(doc(db, 'settings', 'main'), {
        businessName: merged.name.slice(0, 120),
        phone: merged.phone.slice(0, 40),
        whatsapp: merged.whatsapp.slice(0, 40),
        email: merged.email.slice(0, 160),
        signupNotificationEmail: merged.signupNotificationEmail.slice(0, 160),
        jazzcashNumber: merged.jazzcashNumber.slice(0, 40),
        jazzcashName: merged.jazzcashName.slice(0, 100),
        instagramPrimary: (merged.instagram[0]?.url || 'https://www.instagram.com/only_baig/').slice(0, 250),
        instagramSecondary: (merged.instagram[1]?.url || 'https://www.instagram.com/baig_treks_and_tours/').slice(0, 250),
        tagline: merged.tagline.slice(0, 200),
        heroHeadline: merged.heroHeadline.slice(0, 200),
        heroDescription: merged.heroDescription.slice(0, 500),
        address: (merged.address || '').slice(0, 300),
        businessHours: (merged.businessHours || '').slice(0, 200),
        cancellationPolicy: (merged.cancellationPolicy || '').slice(0, 3000),
        refundPolicy: (merged.refundPolicy || '').slice(0, 3000),
        bookingPolicy: (merged.bookingPolicy || '').slice(0, 3000),
        paymentInstructions: (merged.paymentInstructions || '').slice(0, 2000),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/main');
    }
  };

  const seedInitialCatalogToFirestore = async () => {
    if (!isAdmin) return;
    for (const tour of INITIAL_TOURS) {
      await saveTourAdmin(tour);
    }
    for (const dest of INITIAL_DESTINATIONS) {
      await saveDestinationAdmin(dest);
    }
    for (const post of INITIAL_BLOG_POSTS) {
      await saveBlogPostAdmin(post);
    }
    for (const img of INITIAL_GALLERY) {
      await saveGalleryImageAdmin(img);
    }
    await saveSiteSettingsAdmin(defaultBusinessConfig);
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
        signInWithGoogle,
        signOut,
        toggleSaveTour,
        updateCustomerProfile,
        submitInquiry,
        submitBookingRequest,
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
