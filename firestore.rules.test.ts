/**
 * Hardened Firestore Security Rules Test Specification (Dirty Dozen Verification)
 * Verifies all 12 adversarial payloads against firestore.rules invariants.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on UserProfile Create',
    collectionPath: '/users/user_123',
    operation: 'create',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    payload: {
      uid: 'user_123',
      displayName: 'Ali Khan',
      role: 'customer',
      savedTourIds: [],
      isSuperAdmin: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Privilege Escalation on UserProfile Create',
    collectionPath: '/users/user_123',
    operation: 'create',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    payload: {
      uid: 'user_123',
      displayName: 'Ali Khan',
      role: 'admin',
      savedTourIds: [],
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified Admin Email Spoof on Tour Create',
    collectionPath: '/tours/skardu-tour',
    operation: 'create',
    auth: { uid: 'spoof_admin', email: 'baigbaltee37@gmail.com', email_verified: false },
    payload: {
      slug: 'skardu-tour',
      title: 'Skardu Expedition',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Cross-User PII Read on Private Subcollection',
    collectionPath: '/users/user_target/private/info',
    operation: 'get',
    auth: { uid: 'user_attacker', email: 'attacker@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'ID Poisoning Attack on Inquiry Create',
    collectionPath: '/inquiries/invalid$id!with@spaces',
    operation: 'create',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Unbounded Array Exhaustion on Saved Tours',
    collectionPath: '/users/user_123',
    operation: 'update',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    payload: {
      savedTourIds: Array.from({ length: 25 }, (_, i) => `tour_${i}`),
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Client Timestamp Forgery on Create',
    collectionPath: '/inquiries/inq_101',
    operation: 'create',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    payload: {
      createdAt: '2020-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immutable Field Mutation on UserProfile Update',
    collectionPath: '/users/user_123',
    operation: 'update',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    payload: {
      uid: 'other_uid',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Inquiry Scraping via Unfiltered List Query',
    collectionPath: '/inquiries',
    operation: 'list',
    auth: { uid: 'user_attacker', email: 'attacker@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Customer Self-Confirming Booking Payment Status',
    collectionPath: '/bookings/book_101',
    operation: 'update',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    payload: {
      paymentStatus: 'confirmed_by_admin',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Terminal State Bypass on Completed Booking',
    collectionPath: '/bookings/book_completed',
    operation: 'update',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    payload: {
      notes: 'Trying to edit after completion',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unauthorized CMS Settings Mutation',
    collectionPath: '/settings/main',
    operation: 'update',
    auth: { uid: 'user_123', email: 'traveler@example.com', email_verified: true },
    payload: {
      businessName: 'Hacked Name',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
];
