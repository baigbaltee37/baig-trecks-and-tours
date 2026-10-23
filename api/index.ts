import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const SHARED_STATE_FILE = path.join(os.tmpdir(), 'btt-shared-state-v2.json');
const SERVER_TOKEN_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  crypto.createHash('sha256').update('baig-treks-super-admin-hmac-secret-2026').digest('hex');

// Deterministic PBKDF2-SHA512 seed for initial Super Admin accounts
// Plaintext passwords are never stored in source code or sent to client.
const INITIAL_SUPER_ADMIN_SALT = 'baig_treks_super_admin_salt_2026';
const INITIAL_SUPER_ADMIN_HASH =
  '474e315363e90e6119df10433721a5148c5818ee9c5a34ba6752e5559c2584c7dbd871c6df20457527d0945188c61bdc88d32b30836ba3d1f438823a186e1d21';

const OWNER_SUPER_ADMIN_EMAIL = 'baigbaltee37@gmail.com';
const OWNER_SUPER_ADMIN_HASH =
  'a770d23baf258c5bf082dd5335fc7304a80670c4820d3f24d35910803ade54772e9491eba5595dc3f14ce1117eef3599bf3b2d93f58926ef272bd3b778575753';

export interface ServerAdminAccount {
  uid: string;
  email: string;
  displayName: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  salt: string;
  passwordHash: string;
  status: 'active' | 'disabled';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLogEntry {
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

interface SharedAppState {
  updatedAt: number;
  tours?: unknown[];
  destinations?: unknown[];
  blogPosts?: unknown[];
  gallery?: unknown[];
  reviews?: unknown[];
  inquiries?: Record<string, unknown>[];
  bookings?: Record<string, unknown>[];
  users?: Record<string, unknown>[];
  settings?: Record<string, unknown>;
  adminUsers?: ServerAdminAccount[];
  auditLogs?: AuditLogEntry[];
  dryFruits?: Record<string, unknown>[];
}

const revokedTokens = new Set<string>();

function computePasswordHash(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function verifyPasswordTimingSafe(password: string, salt: string, expectedHashHex: string): boolean {
  try {
    const candidateHex = computePasswordHash(password, salt);
    const a = Buffer.from(candidateHex, 'hex');
    const b = Buffer.from(expectedHashHex, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function ensureInitialSuperAdmin(adminUsers?: ServerAdminAccount[]): ServerAdminAccount[] {
  const list = Array.isArray(adminUsers) ? [...adminUsers] : [];
  
  // Ensure Owner Super Admin (baigbaltee37@gmail.com)
  const ownerIdx = list.findIndex(
    (a) => a.email.toLowerCase() === OWNER_SUPER_ADMIN_EMAIL.toLowerCase() || a.uid === 'owner_super_admin'
  );
  if (ownerIdx >= 0) {
    list[ownerIdx] = {
      ...list[ownerIdx],
      uid: 'owner_super_admin',
      email: OWNER_SUPER_ADMIN_EMAIL,
      displayName: list[ownerIdx].displayName || 'Baig (Owner & Super Admin)',
      role: 'SUPER_ADMIN',
      salt: INITIAL_SUPER_ADMIN_SALT,
      passwordHash: OWNER_SUPER_ADMIN_HASH,
      status: 'active',
    };
  } else {
    list.unshift({
      uid: 'owner_super_admin',
      email: OWNER_SUPER_ADMIN_EMAIL,
      displayName: 'Baig (Owner & Super Admin)',
      role: 'SUPER_ADMIN',
      salt: INITIAL_SUPER_ADMIN_SALT,
      passwordHash: OWNER_SUPER_ADMIN_HASH,
      status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  }

  // Ensure Legacy / System Super Admin (admit@baigtours)
  const masterIdx = list.findIndex(
    (a) =>
      a.uid === 'super_admin_baigtours' ||
      a.email.toLowerCase() === 'admit@baigtours' ||
      a.email.toLowerCase() === 'admin@baigtours'
  );
  if (masterIdx >= 0) {
    list[masterIdx] = {
      ...list[masterIdx],
      uid: 'super_admin_baigtours',
      email: 'admit@baigtours',
      displayName: list[masterIdx].displayName || 'Master Admin',
      role: 'SUPER_ADMIN',
      salt: INITIAL_SUPER_ADMIN_SALT,
      passwordHash: INITIAL_SUPER_ADMIN_HASH,
      status: 'active',
    };
  } else {
    list.push({
      uid: 'super_admin_baigtours',
      email: 'admit@baigtours',
      displayName: 'Master Admin',
      role: 'SUPER_ADMIN',
      salt: INITIAL_SUPER_ADMIN_SALT,
      passwordHash: INITIAL_SUPER_ADMIN_HASH,
      status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  }

  return list;
}

function readSharedStateFromDisk(): SharedAppState {
  try {
    if (fs.existsSync(SHARED_STATE_FILE)) {
      const raw = fs.readFileSync(SHARED_STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        parsed.adminUsers = ensureInitialSuperAdmin(parsed.adminUsers);
        if (!Array.isArray(parsed.auditLogs)) {
          parsed.auditLogs = [];
        }
        return parsed as SharedAppState;
      }
    }
  } catch (err) {
    console.warn('[State Sync] Could not read shared state file:', err);
  }
  return {
    updatedAt: 0,
    adminUsers: ensureInitialSuperAdmin([]),
    auditLogs: [],
  };
}

function writeSharedStateToDisk(nextState: SharedAppState): SharedAppState {
  try {
    nextState.adminUsers = ensureInitialSuperAdmin(nextState.adminUsers);
    fs.writeFileSync(SHARED_STATE_FILE, JSON.stringify(nextState, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[State Sync] Could not write shared state file:', err);
  }
  return nextState;
}

interface TokenPayload {
  uid: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  admin: true;
  iat: number;
  exp: number;
  jti: string;
}

function signAdminToken(admin: ServerAdminAccount): string {
  const payload: TokenPayload = {
    uid: admin.uid,
    email: admin.email,
    role: admin.role,
    admin: true,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
    jti: crypto.randomBytes(12).toString('hex'),
  };
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SERVER_TOKEN_SECRET)
    .update(base64Payload)
    .digest('base64url');
  return `${base64Payload}.${signature}`;
}

function verifyAdminTokenFromHeader(authHeader?: string): TokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token || revokedTokens.has(token)) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [base64Payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SERVER_TOKEN_SECRET)
    .update(base64Payload)
    .digest('base64url');

  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8')) as TokenPayload;
    if (!payload || typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return null;
    }
    if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
      return null;
    }
    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);
    const adminRecord = admins.find(
      (a) =>
        a.uid === payload.uid &&
        (a.email.toLowerCase() === payload.email.toLowerCase() ||
          a.uid === 'super_admin_baigtours')
    );
    if (!adminRecord || adminRecord.status !== 'active') {
      return null;
    }
    return {
      ...payload,
      admin: true,
      role: adminRecord.role,
    };
  } catch {
    return null;
  }
}

function appendAuditLog(
  state: SharedAppState,
  entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    id: `audit_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  const currentLogs = Array.isArray(state.auditLogs) ? state.auditLogs : [];
  state.auditLogs = [newEntry, ...currentLogs].slice(0, 500);
  return newEntry;
}

function sanitizeUsersForClient(users: unknown[], includeAdminFields = false): Record<string, unknown>[] {
  if (!Array.isArray(users)) return [];
  return users
    .filter((u): u is Record<string, unknown> => Boolean(u && typeof u === 'object'))
    .map((u) => {
      const copy: Record<string, unknown> = { ...u };
      // Never expose customer passwords to anyone (including admins)
      delete copy.password;
      delete copy.passwordHash;
      delete copy.salt;
      if (!includeAdminFields) {
        // Non-admins only get minimal public/own profile info
      }
      return copy;
    });
}

function sanitizeInquiriesForPublic(inquiries: unknown[]): Record<string, unknown>[] {
  if (!Array.isArray(inquiries)) return [];
  return inquiries
    .filter((i): i is Record<string, unknown> => Boolean(i && typeof i === 'object'))
    .map((inq) => {
      const copy: Record<string, unknown> = { ...inq };
      // Internal notes must NEVER be visible to customers
      delete copy.internalNotes;
      return copy;
    });
}

function sanitizeAdminUsersForClient(admins: ServerAdminAccount[]) {
  return admins.map((a) => ({
    uid: a.uid,
    email: a.email,
    displayName: a.displayName,
    role: a.role,
    status: a.status,
    createdAt: a.createdAt,
    lastLoginAt: a.lastLoginAt,
  }));
}

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(ip: string, maxRequests = 15, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

async function sendNotificationEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpFrom = process.env.SMTP_FROM || 'Baig Trecks & Tours <no-reply@baigtrecks.com>';

  if (!smtpHost || !smtpUser || !smtpPass) {
    return { sent: false, reason: 'smtp_not_configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[Email Service] Failed to send email notification:', err);
    return { sent: false, reason: 'smtp_send_error' };
  }
}

const app = express();
app.use(express.json({ limit: '8mb' }));

function registerRoutes(app: express.Express) {
  // ============================================================================
  // 1. SECURE ADMIN & CUSTOMER AUTHENTICATION + RBAC ENDPOINTS
  // ============================================================================

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

  function isKnownAdminIdentifier(identifier: string, admins: ServerAdminAccount[]): boolean {
    const clean = identifier.trim().toLowerCase();
    if (!clean) return false;
    if (RESERVED_ADMIN_IDENTIFIERS.has(clean)) return true;
    return admins.some((a) => a.email.toLowerCase() === clean && a.status === 'active');
  }

  app.post('/api/admin/login', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(`admin_login_${ip}`, 15, 60_000)) {
      res.status(429).json({ error: 'Invalid admin credentials.' });
      return;
    }

    const { email, identifier, username, password } = req.body || {};
    const cleanEmail = String(email || identifier || username || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    if (!cleanEmail || !rawPassword) {
      res.status(401).json({ error: 'Invalid admin credentials.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);

    // Resolve primary Master Admin alias if user enters admit@baigtours, admin@baigtours, admin@baigtreks.com, or only_baig
    const resolvedAdminEmail =
      cleanEmail === 'admit@baigtours' ||
      cleanEmail === 'admin@baigtours' ||
      cleanEmail === 'admit@baigtours.com' ||
      cleanEmail === 'admin@baigtours.com' ||
      cleanEmail === 'admin@baigtreks.com' ||
      cleanEmail === 'only_baig'
        ? 'admit@baigtours'
        : cleanEmail;

    const matchedAdmin = admins.find(
      (a) => a.email.toLowerCase() === resolvedAdminEmail && a.status === 'active'
    );

    // Requirement 12: If a normal customer tries to log in through /admin/login, show:
    // "You do not have administrator access."
    if (!matchedAdmin) {
      const customerUsers = Array.isArray(state.users) ? state.users : [];
      const isRegisteredCustomer = customerUsers.some(
        (u) => String(u?.email || '').trim().toLowerCase() === cleanEmail
      );
      if (isRegisteredCustomer || (!isKnownAdminIdentifier(cleanEmail, admins) && cleanEmail.includes('@'))) {
        res.status(403).json({
          error: 'You do not have administrator access.',
          code: 'NOT_ADMIN',
        });
        return;
      }
      res.status(401).json({ error: 'Invalid admin credentials.' });
      return;
    }

    if (!verifyPasswordTimingSafe(rawPassword, matchedAdmin.salt, matchedAdmin.passwordHash)) {
      res.status(401).json({ error: 'Invalid admin credentials.' });
      return;
    }

    matchedAdmin.lastLoginAt = new Date().toISOString();
    state.adminUsers = admins;
    appendAuditLog(state, {
      adminEmail: matchedAdmin.email,
      adminRole: matchedAdmin.role,
      action: 'Admin logged in',
      targetType: 'Session',
      targetId: matchedAdmin.uid,
      targetName: matchedAdmin.email,
      details: `Authenticated into Admin Portal (${matchedAdmin.role})`,
    });
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    const token = signAdminToken(matchedAdmin);
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      token,
      admin: {
        uid: matchedAdmin.uid,
        email: matchedAdmin.email,
        displayName: matchedAdmin.displayName,
        role: matchedAdmin.role,
        status: matchedAdmin.status,
        createdAt: matchedAdmin.createdAt,
        lastLoginAt: matchedAdmin.lastLoginAt,
      },
      auditLogs: state.auditLogs,
      adminUsers: sanitizeAdminUsersForClient(admins),
    });
  });

  // Exchange verified Firebase Admin authentication (custom claim admin: true or Firestore admin role) for a server session token
  app.post('/api/admin/firebase-session', (req, res) => {
    const { uid, email, displayName, isCustomClaimAdmin, isFirestoreAdmin } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!uid || !cleanEmail) {
      res.status(400).json({ error: 'Invalid admin credentials.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);
    const isAuthorizedAdmin =
      Boolean(isCustomClaimAdmin) ||
      Boolean(isFirestoreAdmin) ||
      isKnownAdminIdentifier(cleanEmail, admins);

    if (!isAuthorizedAdmin) {
      res.status(403).json({
        error: 'You do not have administrator access.',
        code: 'NOT_ADMIN',
      });
      return;
    }

    let adminRecord = admins.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!adminRecord) {
      const salt = `baig_salt_${crypto.randomBytes(12).toString('hex')}`;
      adminRecord = {
        uid: String(uid),
        email: cleanEmail,
        displayName: String(displayName || cleanEmail.split('@')[0]),
        role: 'SUPER_ADMIN',
        salt,
        passwordHash: computePasswordHash(crypto.randomBytes(24).toString('hex'), salt),
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      admins.push(adminRecord);
    }

    if (adminRecord.status !== 'active') {
      res.status(403).json({ error: 'You do not have administrator access.' });
      return;
    }

    adminRecord.lastLoginAt = new Date().toISOString();
    state.adminUsers = admins;
    appendAuditLog(state, {
      adminEmail: adminRecord.email,
      adminRole: adminRecord.role,
      action: 'Admin logged in (Firebase Auth)',
      targetType: 'Session',
      targetId: adminRecord.uid,
      targetName: adminRecord.email,
      details: `Authenticated via Firebase Auth into Admin Portal (${adminRecord.role})`,
    });
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    const token = signAdminToken(adminRecord);
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      token,
      admin: {
        uid: adminRecord.uid,
        email: adminRecord.email,
        displayName: adminRecord.displayName,
        role: adminRecord.role,
        status: adminRecord.status,
        createdAt: adminRecord.createdAt,
        lastLoginAt: adminRecord.lastLoginAt,
      },
      auditLogs: state.auditLogs,
      adminUsers: sanitizeAdminUsersForClient(admins),
    });
  });

  // Customer Signup & Login Endpoints (Server-side PBKDF2 hashing — no passwords ever stored in localStorage/sessionStorage/Firestore)
  app.post('/api/customer/signup', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(`cust_signup_${ip}`, 15, 60_000)) {
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      return;
    }

    const { displayName, email, password, phone, uid } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(displayName || '').trim();
    const cleanPhone = String(phone || '').trim();
    const rawPassword = String(password || '');

    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);

    if (isKnownAdminIdentifier(cleanEmail, admins)) {
      res.status(400).json({
        error: 'Administrator accounts must sign in at the Admin Portal (/admin/login).',
        code: 'ADMIN_MUST_USE_PORTAL',
      });
      return;
    }

    if (!cleanName || !cleanEmail || rawPassword.length < 6 || !cleanPhone) {
      res.status(400).json({ error: 'Please complete all required registration fields.' });
      return;
    }

    const users = Array.isArray(state.users) ? [...state.users] : [];
    if (users.some((u) => String(u?.email || '').trim().toLowerCase() === cleanEmail)) {
      res.status(409).json({
        error: 'An account with this email already exists. Please log in instead.',
      });
      return;
    }

    const salt = `cust_salt_${crypto.randomBytes(12).toString('hex')}`;
    const passwordHash = computePasswordHash(rawPassword, salt);
    const nowIso = new Date().toISOString();
    const newCustomerRecord: Record<string, unknown> = {
      uid: uid ? String(uid) : `user_${Date.now()}`,
      name: cleanName,
      displayName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'CUSTOMER',
      savedTourIds: [],
      salt,
      passwordHash,
      status: 'active',
      createdAt: nowIso,
    };

    users.unshift(newCustomerRecord);
    state.users = users;
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    const sanitizedUser = sanitizeUsersForClient([newCustomerRecord], false)[0];
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      user: sanitizedUser,
      users: sanitizeUsersForClient(users, false),
    });
  });

  app.post('/api/customer/login', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(`cust_login_${ip}`, 20, 60_000)) {
      res.status(429).json({ error: 'Too many login attempts. Please try again shortly.' });
      return;
    }

    const { email, password } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);

    // Requirement 9: If an administrator accidentally uses the normal customer login page, show:
    // "Administrator accounts must sign in at the Admin Portal (/admin/login)."
    if (isKnownAdminIdentifier(cleanEmail, admins)) {
      res.status(403).json({
        error: 'Administrator accounts must sign in at the Admin Portal (/admin/login).',
        code: 'ADMIN_MUST_USE_PORTAL',
      });
      return;
    }

    const users = Array.isArray(state.users) ? state.users : [];
    const matched = users.find(
      (u) => String(u?.email || '').trim().toLowerCase() === cleanEmail
    );

    if (!matched) {
      res.status(401).json({
        error: 'Invalid email or password. Please check your credentials or sign up.',
      });
      return;
    }

    if (matched.status === 'disabled') {
      res.status(403).json({
        error: 'Your customer account is currently disabled. Please contact support.',
      });
      return;
    }

    // Verify server-side PBKDF2 hash (or migrate legacy record if it existed prior to hashing)
    let passwordValid = false;
    if (typeof matched.salt === 'string' && typeof matched.passwordHash === 'string') {
      passwordValid = verifyPasswordTimingSafe(rawPassword, matched.salt, matched.passwordHash);
    } else if (typeof matched.password === 'string' && matched.password === rawPassword) {
      passwordValid = true;
      const newSalt = `cust_salt_${crypto.randomBytes(12).toString('hex')}`;
      matched.salt = newSalt;
      matched.passwordHash = computePasswordHash(rawPassword, newSalt);
      delete matched.password;
      state.updatedAt = Date.now();
      writeSharedStateToDisk(state);
    }

    if (!passwordValid) {
      res.status(401).json({
        error: 'Invalid email or password. Please check your credentials or sign up.',
      });
      return;
    }

    const sanitizedUser = sanitizeUsersForClient([matched], false)[0];
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      user: sanitizedUser,
    });
  });

  app.post('/api/customer/change-password', (req, res) => {
    const { email, currentPassword, newPassword } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const curPass = String(currentPassword || '');
    const nextPass = String(newPassword || '');

    if (!cleanEmail || nextPass.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const users = Array.isArray(state.users) ? state.users : [];
    const matched = users.find(
      (u) => String(u?.email || '').trim().toLowerCase() === cleanEmail
    );

    if (!matched) {
      res.status(404).json({ error: 'Customer account not found.' });
      return;
    }

    if (typeof matched.salt === 'string' && typeof matched.passwordHash === 'string') {
      if (!verifyPasswordTimingSafe(curPass, matched.salt, matched.passwordHash)) {
        res.status(401).json({ error: 'Current password does not match.' });
        return;
      }
    }

    const newSalt = `cust_salt_${crypto.randomBytes(12).toString('hex')}`;
    matched.salt = newSalt;
    matched.passwordHash = computePasswordHash(nextPass, newSalt);
    delete matched.password;
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    res.setHeader('Cache-Control', 'no-store');
    res.json({ ok: true });
  });

  app.get('/api/admin/session', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    res.setHeader('Cache-Control', 'no-store');
    if (!verified) {
      res.status(401).json({ authenticated: false, error: 'ACCESS DENIED' });
      return;
    }
    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);
    const adminRecord = admins.find((a) => a.uid === verified.uid);
    if (!adminRecord) {
      res.status(401).json({ authenticated: false, error: 'ACCESS DENIED' });
      return;
    }
    res.json({
      authenticated: true,
      admin: {
        uid: adminRecord.uid,
        email: adminRecord.email,
        displayName: adminRecord.displayName,
        role: adminRecord.role,
        status: adminRecord.status,
        createdAt: adminRecord.createdAt,
        lastLoginAt: adminRecord.lastLoginAt,
      },
      auditLogs: state.auditLogs || [],
      adminUsers: sanitizeAdminUsersForClient(admins),
    });
  });

  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const verified = verifyAdminTokenFromHeader(authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      revokedTokens.add(authHeader.slice(7).trim());
    }
    if (verified) {
      const state = readSharedStateFromDisk();
      appendAuditLog(state, {
        adminEmail: verified.email,
        adminRole: verified.role,
        action: 'Admin logged out',
        targetType: 'Session',
        targetId: verified.uid,
        targetName: verified.email,
        details: 'Administrator signed out and destroyed session token',
      });
      state.updatedAt = Date.now();
      writeSharedStateToDisk(state);
    }
    res.setHeader('Cache-Control', 'no-store');
    res.json({ ok: true });
  });

  app.post('/api/admin/change-password', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified) {
      res.status(403).json({ error: 'REQUEST DENIED: Administrator authentication required.' });
      return;
    }
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword || String(newPassword).length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);
    const admin = admins.find((a) => a.uid === verified.uid);
    if (!admin || !verifyPasswordTimingSafe(String(currentPassword), admin.salt, admin.passwordHash)) {
      res.status(401).json({ error: 'Current admin password is incorrect.' });
      return;
    }

    const newSalt = `baig_salt_${crypto.randomBytes(12).toString('hex')}`;
    admin.salt = newSalt;
    admin.passwordHash = computePasswordHash(String(newPassword), newSalt);
    state.adminUsers = admins;
    appendAuditLog(state, {
      adminEmail: verified.email,
      adminRole: verified.role,
      action: 'Admin password changed',
      targetType: 'AdminUser',
      targetId: admin.uid,
      targetName: admin.email,
      details: 'Administrator updated account password securely',
    });
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    res.json({ ok: true, auditLogs: state.auditLogs });
  });

  // Super Admin User Management (/api/admin/users)
  app.post('/api/admin/users', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified || verified.role !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'REQUEST DENIED: Only SUPER_ADMIN can create administrators.' });
      return;
    }
    const { email, displayName, password, role } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(displayName || '').trim() || cleanEmail.split('@')[0];
    const rawPass = String(password || '');
    const targetRole: 'ADMIN' | 'SUPER_ADMIN' = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';

    if (!cleanEmail || rawPass.length < 6) {
      res.status(400).json({ error: 'Valid email/username and password (min 6 chars) required.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);
    if (admins.some((a) => a.email.toLowerCase() === cleanEmail)) {
      res.status(400).json({ error: 'An administrator with this email/username already exists.' });
      return;
    }

    const salt = `baig_salt_${crypto.randomBytes(12).toString('hex')}`;
    const newAdmin: ServerAdminAccount = {
      uid: `admin_${Date.now()}`,
      email: cleanEmail,
      displayName: cleanName,
      role: targetRole,
      salt,
      passwordHash: computePasswordHash(rawPass, salt),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    admins.push(newAdmin);
    state.adminUsers = admins;
    appendAuditLog(state, {
      adminEmail: verified.email,
      adminRole: verified.role,
      action: 'Admin account created',
      targetType: 'AdminUser',
      targetId: newAdmin.uid,
      targetName: newAdmin.email,
      details: `Created ${newAdmin.role} account for ${newAdmin.email}`,
    });
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    res.json({
      ok: true,
      adminUsers: sanitizeAdminUsersForClient(admins),
      auditLogs: state.auditLogs,
    });
  });

  app.patch('/api/admin/users/:uid', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified || verified.role !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'REQUEST DENIED: Only SUPER_ADMIN can modify administrators.' });
      return;
    }
    const { uid } = req.params;
    const { role, status } = req.body || {};

    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);
    const target = admins.find((a) => a.uid === uid);
    if (!target) {
      res.status(404).json({ error: 'Administrator account not found.' });
      return;
    }
    if (
      target.uid === 'super_admin_baigtours' ||
      target.email.toLowerCase() === 'admit@baigtours' ||
      target.email.toLowerCase() === 'admin@baigtours'
    ) {
      res.status(400).json({ error: 'Master Admin (admit@baigtours) cannot be demoted or disabled.' });
      return;
    }

    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      target.role = role;
    }
    if (status === 'active' || status === 'disabled') {
      target.status = status;
    }

    state.adminUsers = admins;
    appendAuditLog(state, {
      adminEmail: verified.email,
      adminRole: verified.role,
      action: 'Admin permissions updated',
      targetType: 'AdminUser',
      targetId: target.uid,
      targetName: target.email,
      details: `Updated ${target.email} (Role: ${target.role}, Status: ${target.status})`,
    });
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    res.json({
      ok: true,
      adminUsers: sanitizeAdminUsersForClient(admins),
      auditLogs: state.auditLogs,
    });
  });

  app.delete('/api/admin/users/:uid', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified || verified.role !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'REQUEST DENIED: Only SUPER_ADMIN can delete administrators.' });
      return;
    }
    const { uid } = req.params;
    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);
    const target = admins.find((a) => a.uid === uid);
    if (!target) {
      res.status(404).json({ error: 'Administrator account not found.' });
      return;
    }
    if (
      target.uid === 'super_admin_baigtours' ||
      target.email.toLowerCase() === 'admit@baigtours' ||
      target.email.toLowerCase() === 'admin@baigtours'
    ) {
      res.status(400).json({ error: 'Master Admin (admit@baigtours) cannot be deleted.' });
      return;
    }

    state.adminUsers = admins.filter((a) => a.uid !== uid);
    appendAuditLog(state, {
      adminEmail: verified.email,
      adminRole: verified.role,
      action: 'Admin account deleted',
      targetType: 'AdminUser',
      targetId: target.uid,
      targetName: target.email,
      details: `Removed administrator privileges and account for ${target.email}`,
    });
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    res.json({
      ok: true,
      adminUsers: sanitizeAdminUsersForClient(state.adminUsers),
      auditLogs: state.auditLogs,
    });
  });

  app.post('/api/admin/audit-log', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified) {
      res.status(403).json({ error: 'REQUEST DENIED: Administrator authentication required.' });
      return;
    }
    const { action, targetType, targetId, targetName, details } = req.body || {};
    const state = readSharedStateFromDisk();
    appendAuditLog(state, {
      adminEmail: verified.email,
      adminRole: verified.role,
      action: String(action || 'Admin action').slice(0, 120),
      targetType: String(targetType || 'System').slice(0, 60),
      targetId: String(targetId || 'N/A').slice(0, 120),
      targetName: String(targetName || 'N/A').slice(0, 160),
      details: String(details || '').slice(0, 500),
    });
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);
    res.json({ ok: true, auditLogs: state.auditLogs });
  });

  // Master Admin Customer Management Endpoint (Create or Edit Customer Account)
  app.post('/api/admin/customers', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified) {
      res.status(403).json({ error: 'REQUEST DENIED: Administrator authentication required.' });
      return;
    }

    const { uid, displayName, email, phone, status, password } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(displayName || '').trim() || cleanEmail.split('@')[0] || 'Traveler';
    const cleanPhone = String(phone || '').trim();
    const nextStatus = status === 'disabled' ? 'disabled' : 'active';
    const rawPassword = String(password || '');

    if (!cleanEmail) {
      res.status(400).json({ error: 'Customer email is required.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const admins = ensureInitialSuperAdmin(state.adminUsers);
    if (isKnownAdminIdentifier(cleanEmail, admins)) {
      res.status(400).json({ error: 'Cannot register an administrator identifier as a customer account.' });
      return;
    }

    const users = Array.isArray(state.users) ? [...state.users] : [];
    const existingIdx = users.findIndex(
      (u) =>
        (uid && String(u?.uid) === String(uid)) ||
        String(u?.email || '').trim().toLowerCase() === cleanEmail
    );

    if (existingIdx >= 0) {
      const prev = users[existingIdx];
      const updatedRecord: Record<string, unknown> = {
        ...prev,
        name: cleanName,
        displayName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'CUSTOMER',
        status: nextStatus,
      };
      if (rawPassword.length >= 6) {
        const newSalt = `cust_salt_${crypto.randomBytes(12).toString('hex')}`;
        updatedRecord.salt = newSalt;
        updatedRecord.passwordHash = computePasswordHash(rawPassword, newSalt);
      }
      delete updatedRecord.password;
      users[existingIdx] = updatedRecord;

      appendAuditLog(state, {
        adminEmail: verified.email,
        adminRole: verified.role,
        action: 'Customer account updated',
        targetType: 'Customer',
        targetId: String(updatedRecord.uid),
        targetName: cleanEmail,
        details: `Updated customer ${cleanName} (${cleanEmail}, Status: ${nextStatus})`,
      });
    } else {
      const salt = `cust_salt_${crypto.randomBytes(12).toString('hex')}`;
      const passwordHash = computePasswordHash(rawPassword.length >= 6 ? rawPassword : `Cust_${Date.now()}`, salt);
      const newRecord: Record<string, unknown> = {
        uid: uid ? String(uid) : `user_${Date.now()}`,
        name: cleanName,
        displayName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'CUSTOMER',
        savedTourIds: [],
        salt,
        passwordHash,
        status: nextStatus,
        createdAt: new Date().toISOString(),
      };
      users.unshift(newRecord);

      appendAuditLog(state, {
        adminEmail: verified.email,
        adminRole: verified.role,
        action: 'Customer account created by Admin',
        targetType: 'Customer',
        targetId: String(newRecord.uid),
        targetName: cleanEmail,
        details: `Created customer account for ${cleanName} (${cleanEmail})`,
      });
    }

    state.users = users;
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    res.json({
      ok: true,
      users: sanitizeUsersForClient(users, true),
      auditLogs: state.auditLogs,
    });
  });

  // ============================================================================
  // 2. ROLE-PROTECTED STATE SYNC ENDPOINTS (/api/shared-state)
  // ============================================================================

  app.get('/api/shared-state', (req, res) => {
    const state = readSharedStateFromDisk();
    const verifiedAdmin = verifyAdminTokenFromHeader(req.headers.authorization);
    res.setHeader('Cache-Control', 'no-store');

    if (verifiedAdmin) {
      res.json({
        ...state,
        users: sanitizeUsersForClient(state.users || [], true),
        adminUsers: sanitizeAdminUsersForClient(ensureInitialSuperAdmin(state.adminUsers)),
        auditLogs: state.auditLogs || [],
        dryFruits: state.dryFruits || [],
      });
      return;
    }

    // Public / Customer response:
    // - Never expose customer passwords
    // - Never expose inquiry internalNotes
    // - Never expose auditLogs or adminUsers
    res.json({
      updatedAt: state.updatedAt,
      tours: state.tours,
      destinations: state.destinations,
      blogPosts: state.blogPosts,
      gallery: state.gallery,
      reviews: state.reviews,
      inquiries: sanitizeInquiriesForPublic(state.inquiries || []),
      bookings: state.bookings || [],
      users: sanitizeUsersForClient(state.users || [], false),
      settings: state.settings,
      dryFruits: (state.dryFruits || []).filter((p: any) => p && p.published !== false),
    });
  });

  app.post('/api/shared-state', (req, res) => {
    const current = readSharedStateFromDisk();
    const incoming = req.body || {};
    const verifiedAdmin = verifyAdminTokenFromHeader(req.headers.authorization);

    // Check if the request attempts to mutate Admin-Only collections
    const adminOnlyKeys = [
      'tours',
      'destinations',
      'blogPosts',
      'gallery',
      'reviews',
      'settings',
      'adminUsers',
      'auditLogs',
      'dryFruits',
    ];
    const touchesAdminCollection = adminOnlyKeys.some((k) => k in incoming);

    // Allow initial seed only when updatedAt === 0
    if (touchesAdminCollection && !verifiedAdmin && current.updatedAt !== 0) {
      res.status(403).json({
        error: 'REQUEST DENIED: Administrator privileges required to modify website content or settings.',
      });
      return;
    }

    const merged: SharedAppState = {
      ...current,
      updatedAt: Date.now(),
    };

    if (verifiedAdmin || current.updatedAt === 0) {
      if (Array.isArray(incoming.tours)) merged.tours = incoming.tours;
      if (Array.isArray(incoming.destinations)) merged.destinations = incoming.destinations;
      if (Array.isArray(incoming.blogPosts)) merged.blogPosts = incoming.blogPosts;
      if (Array.isArray(incoming.gallery)) merged.gallery = incoming.gallery;
      if (Array.isArray(incoming.reviews)) merged.reviews = incoming.reviews;
      if (Array.isArray(incoming.dryFruits)) merged.dryFruits = incoming.dryFruits;
      if (incoming.settings && typeof incoming.settings === 'object') {
        merged.settings = incoming.settings;
      }
      if (verifiedAdmin && incoming.auditEntry && typeof incoming.auditEntry === 'object') {
        const ae = incoming.auditEntry as Record<string, string>;
        appendAuditLog(merged, {
          adminEmail: verifiedAdmin.email,
          adminRole: verifiedAdmin.role,
          action: ae.action || 'Admin update',
          targetType: ae.targetType || 'Content',
          targetId: ae.targetId || '',
          targetName: ae.targetName || '',
          details: ae.details || '',
        });
      }
    }

    // Inquiries: customers can only append new inquiries without internalNotes; only Admin can edit status/internalNotes
    if (Array.isArray(incoming.inquiries)) {
      if (verifiedAdmin) {
        merged.inquiries = incoming.inquiries;
      } else {
        const existingInqMap = new Map(
          (current.inquiries || []).map((i) => [String(i.id), i])
        );
        const existingTokens = new Set(
          (current.inquiries || []).map((i) => String(i.idempotencyToken || '')).filter(Boolean)
        );

        const sanitizedInquiries = [];
        for (const inq of incoming.inquiries as Record<string, unknown>[]) {
          const inqId = String(inq.id || '');
          const inqToken = String(inq.idempotencyToken || '');
          const prev = existingInqMap.get(inqId);
          if (prev) {
            sanitizedInquiries.push(prev); // Keep existing
          } else {
            // Deduplicate if already present by idempotencyToken
            if (inqToken && existingTokens.has(inqToken)) {
              continue;
            }
            if (inqToken) existingTokens.add(inqToken);
            sanitizedInquiries.push({
              ...inq,
              status: inq.status || 'New',
              internalNotes: '',
            });
          }
        }
        merged.inquiries = sanitizedInquiries;
      }
    }

    // Bookings: customers can only create bookings with Pending status; only Admin can mark Confirmed / Cancelled
    if (Array.isArray(incoming.bookings)) {
      if (verifiedAdmin) {
        merged.bookings = incoming.bookings;
      } else {
        const existingBkMap = new Map(
          (current.bookings || []).map((b) => [String(b.id), b])
        );
        const existingBkRefs = new Set(
          (current.bookings || []).map((b) => String(b.bookingReference || b.id || '').toUpperCase())
        );
        const existingTokens = new Set(
          (current.bookings || []).map((b) => String(b.idempotencyToken || '')).filter(Boolean)
        );

        const sanitizedBookings = [];
        for (const bk of incoming.bookings as Record<string, unknown>[]) {
          const bkId = String(bk.id || '');
          const bkRef = String(bk.bookingReference || bkId).toUpperCase();
          const bkToken = String(bk.idempotencyToken || '');
          const prev = existingBkMap.get(bkId);
          if (prev) {
            sanitizedBookings.push(prev); // Prevent customer from modifying existing booking statuses
          } else {
            // Check idempotency token or identical reference to prevent duplicate submissions
            if (bkToken && existingTokens.has(bkToken)) {
              continue;
            }
            if (existingBkRefs.has(bkRef)) {
              continue;
            }
            if (bkToken) existingTokens.add(bkToken);
            existingBkRefs.add(bkRef);
            sanitizedBookings.push({
              ...bk,
              bookingStatus: 'Pending',
              paymentStatus: 'Payment Pending',
            });
          }
        }
        merged.bookings = sanitizedBookings;
      }
    }

    // Users: customers can never escalate their role to admin/SUPER_ADMIN; preserve server-side password hashes
    if (Array.isArray(incoming.users)) {
      const existingUsersByEmail = new Map(
        (current.users || []).map((u) => [String(u.email || '').toLowerCase(), u])
      );
      merged.users = incoming.users.map((u: Record<string, unknown>) => {
        const cleanEmail = String(u.email || '').toLowerCase();
        const prev = existingUsersByEmail.get(cleanEmail);
        const nextRecord: Record<string, unknown> = {
          ...prev,
          ...u,
          role: 'CUSTOMER',
        };
        delete nextRecord.password;
        if (prev?.salt && prev?.passwordHash) {
          nextRecord.salt = prev.salt;
          nextRecord.passwordHash = prev.passwordHash;
        }
        return nextRecord;
      });
    }

    writeSharedStateToDisk(merged);
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      updatedAt: merged.updatedAt,
      auditLogs: verifiedAdmin ? merged.auditLogs : undefined,
    });
  });

  // ============================================================================
  // DRY FRUITS STORE API (Public & Admin Endpoints)
  // ============================================================================

  const DEFAULT_SERVER_DRY_FRUITS = [
    {
      id: 'almonds-badam',
      name: 'Giri Almonds',
      urduName: 'بادام گرئی (Badam)',
      category: 'Nuts & Kernels',
      tagline: 'Sweet, crisp, and high-oil kernels harvested from Northern orchards.',
      description: 'Grown in the high sunlit valleys of Gilgit-Baltistan and Kaghan, these premium sweet almonds are naturally rich in Vitamin E, magnesium, and healthy dietary fats.',
      healthBenefits: ['Sharpens memory & cognitive focus', 'Supports glowing skin & hair', 'Natural sustained energy'],
      origin: 'Gilgit-Baltistan & Swat Valley',
      badge: 'Bestseller',
      imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      pricing: { '250g': 850, '500g': 1650, '1kg': 3100 },
      originalPricing: { '250g': 1000, '500g': 1900, '1kg': 3600 },
      discountPercent: 15,
      stockQuantity: 45,
      inStock: true,
      published: true,
      featured: true,
      rating: 4.9,
      reviewsCount: 38,
    },
    {
      id: 'cashews-kaju',
      name: 'Jumbo Whole Cashews',
      urduName: 'کاجو ثابت (Kaju)',
      category: 'Nuts & Kernels',
      tagline: 'Large buttery-white whole cashews, delicately roasted for extra crispiness.',
      description: 'Selected W240 grade jumbo whole cashews with a rich, buttery melt-in-mouth texture.',
      healthBenefits: ['Rich in heart-healthy unsaturated fats', 'Great source of plant protein', 'High in zinc & iron'],
      origin: 'Selected Premium Import / Northern Packing',
      badge: 'Royal Reserve',
      imageUrl: 'https://images.unsplash.com/photo-1536591375315-0b82f07d2c36?auto=format&fit=crop&w=800&q=80',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      pricing: { '250g': 1050, '500g': 2000, '1kg': 3800 },
      originalPricing: { '250g': 1200, '500g': 2300, '1kg': 4400 },
      discountPercent: 13,
      stockQuantity: 30,
      inStock: true,
      published: true,
      featured: true,
      rating: 4.8,
      reviewsCount: 29,
    },
    {
      id: 'pistachios-pista',
      name: 'Roasted Karakoram Pistachios',
      urduName: 'پستہ نمکین (Pista)',
      category: 'Nuts & Kernels',
      tagline: 'Lightly sea-salted, naturally opened whole roasted pistachios.',
      description: 'Cracked open under natural sun-drying and gently toasted with Himalayan pink salt.',
      healthBenefits: ['Loaded with lutein & eye-protecting antioxidants', 'Cardiovascular wellness', 'Fiber rich'],
      origin: 'Balochistan & Gilgit Borders',
      badge: 'Seasonal Harvest',
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      pricing: { '250g': 1200, '500g': 2350, '1kg': 4500 },
      stockQuantity: 25,
      inStock: true,
      published: true,
      featured: true,
      rating: 4.9,
      reviewsCount: 34,
    },
    {
      id: 'walnuts-akhrot',
      name: 'Kaghzi Soft-Shell Walnuts',
      urduName: 'کاغذی اخروٹ (Akhrot)',
      category: 'Nuts & Kernels',
      tagline: 'Paper-thin shell, easily cracked by hand to reveal whole golden-amber halves.',
      description: 'Harvested from century-old walnut trees along the Hunza and Skardu river terraces.',
      healthBenefits: ['Richest dry fruit in Omega-3 Alpha-Linolenic Acid (ALA)', 'Boosts brain function', 'Supports heart health'],
      origin: 'Hunza & Skardu Valleys',
      badge: 'Organic GB',
      imageUrl: 'https://images.unsplash.com/photo-1568260411186-01292b3c58b4?auto=format&fit=crop&w=800&q=80',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      pricing: { '250g': 650, '500g': 1250, '1kg': 2350 },
      stockQuantity: 50,
      inStock: true,
      published: true,
      featured: true,
      rating: 5.0,
      reviewsCount: 42,
    },
    {
      id: 'dates-khajoor',
      name: 'Royal Amber Dates',
      urduName: 'امبر کھجور (Khajoor)',
      category: 'Dried Fruits',
      tagline: 'Plump, glossy, and caramel-rich dates naturally cured on the palm.',
      description: 'Selected premium large dates with thick flesh, delicate skin, and a natural brown-sugar sweetness.',
      healthBenefits: ['Instant natural endurance boost', 'Packed with dietary fiber & potassium', 'Aids healthy digestion'],
      origin: 'Khairpur Sindh & Northern Distribution',
      badge: 'Bestseller',
      imageUrl: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=800&q=80',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      pricing: { '250g': 550, '500g': 1050, '1kg': 1950 },
      stockQuantity: 40,
      inStock: true,
      published: true,
      featured: true,
      rating: 4.8,
      reviewsCount: 27,
    },
    {
      id: 'raisins-kishmish',
      name: 'Sundried Golden Raisins',
      urduName: 'سنہری کشمش (Kishmish)',
      category: 'Dried Fruits',
      tagline: 'Juicy, long golden grapes naturally dried in shade houses under crisp mountain breeze.',
      description: 'Produced from seedless green grapes grown in high-altitude vineyards. Sweet, tangy, and translucent.',
      healthBenefits: ['Rich in bioavailable iron', 'Contains catechins & polyphenols', 'Boosts bone density'],
      origin: 'Chaman & Quetta Valleys',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      pricing: { '250g': 450, '500g': 850, '1kg': 1600 },
      stockQuantity: 60,
      inStock: true,
      published: true,
      featured: false,
      rating: 4.7,
      reviewsCount: 19,
    },
    {
      id: 'figs-anjeer',
      name: 'Mountain Dried Figs',
      urduName: 'خشک انجیر (Anjeer)',
      category: 'Dried Fruits',
      tagline: 'Large round dried figs with a delicate seed crunch and deep honey aroma.',
      description: 'Strung onto natural cotton twine in traditional circular garlands and sun-dried without chemical sulfur.',
      healthBenefits: ['Exceptional natural soluble fiber', 'High in calcium & iron', 'Natural blood pressure regulation'],
      origin: 'Balochistan & Border Valleys',
      badge: 'Organic GB',
      imageUrl: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=800&q=80',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      pricing: { '250g': 750, '500g': 1450, '1kg': 2750 },
      stockQuantity: 35,
      inStock: true,
      published: true,
      featured: true,
      rating: 4.9,
      reviewsCount: 31,
    },
    {
      id: 'mixed-dry-fruits',
      name: 'Baig Royal Mixed Dry Fruits',
      urduName: 'مکس ڈرائی فروٹ شاہی (Mixed)',
      category: 'Specialty & Mixes',
      tagline: 'Artisanal balanced mix of Giri Almonds, Cashews, Pistachios, Walnuts, and Golden Raisins.',
      description: 'Our signature festive assortment combining equal measures of 5 northern favorites.',
      healthBenefits: ['Complete daily powerhouse of vital micronutrients', 'All-in-one brain & cardiovascular tonic', 'No additives'],
      origin: 'Curated by Baig Dry Fruits Skardu',
      badge: 'Bestseller',
      imageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
      pricing: { '250g': 950, '500g': 1850, '1kg': 3500 },
      originalPricing: { '250g': 1100, '500g': 2100, '1kg': 4000 },
      discountPercent: 14,
      stockQuantity: 80,
      inStock: true,
      published: true,
      featured: true,
      rating: 5.0,
      reviewsCount: 56,
    },
  ];

  // Public: Get all published dry fruits
  app.get('/api/dry-fruits', (_req, res) => {
    const state = readSharedStateFromDisk();
    const list = Array.isArray(state.dryFruits) && state.dryFruits.length > 0 ? state.dryFruits : DEFAULT_SERVER_DRY_FRUITS;
    const published = list.filter((p: any) => p && p.published !== false);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ ok: true, dryFruits: published });
  });

  // Admin: Get all dry fruits (including drafts and out-of-stock items)
  app.get('/api/admin/dry-fruits', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified) {
      res.status(403).json({ error: 'REQUEST DENIED: Administrator authentication required.' });
      return;
    }
    const state = readSharedStateFromDisk();
    const list = Array.isArray(state.dryFruits) && state.dryFruits.length > 0 ? state.dryFruits : DEFAULT_SERVER_DRY_FRUITS;
    res.setHeader('Cache-Control', 'no-store');
    res.json({ ok: true, dryFruits: list });
  });


  // Admin: Add or update a dry fruit product
  app.post('/api/admin/dry-fruits', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified) {
      res.status(403).json({ error: 'REQUEST DENIED: Administrator authentication required.' });
      return;
    }

    const payload = req.body || {};
    const name = String(payload.name || '').trim();
    if (!name) {
      res.status(400).json({ error: 'Product name is required.' });
      return;
    }

    if (!payload.pricing || typeof payload.pricing !== 'object') {
      res.status(400).json({ error: 'Product pricing object is required.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const list = Array.isArray(state.dryFruits) ? [...state.dryFruits] : [];
    const productId = payload.id ? String(payload.id).trim() : `df_${Date.now()}`;
    const existingIdx = list.findIndex((p: any) => String(p?.id) === productId);

    const nowIso = new Date().toISOString();
    const updatedProduct = {
      ...payload,
      id: productId,
      name,
      urduName: String(payload.urduName || '').trim(),
      category: String(payload.category || 'Nuts & Kernels').trim(),
      description: String(payload.description || '').trim(),
      tagline: String(payload.tagline || '').trim(),
      origin: String(payload.origin || 'Gilgit-Baltistan & Northern Pakistan').trim(),
      badge: String(payload.badge || '').trim(),
      imageUrl: String(payload.imageUrl || '').trim(),
      fallbackImageUrl: String(payload.fallbackImageUrl || payload.imageUrl || '').trim(),
      pricing: {
        '250g': Number(payload.pricing['250g']) || 0,
        '500g': Number(payload.pricing['500g']) || 0,
        '1kg': Number(payload.pricing['1kg']) || 0,
      },
      originalPricing: payload.originalPricing ? {
        '250g': Number(payload.originalPricing['250g']) || 0,
        '500g': Number(payload.originalPricing['500g']) || 0,
        '1kg': Number(payload.originalPricing['1kg']) || 0,
      } : undefined,
      discountPercent: Number(payload.discountPercent) || 0,
      stockQuantity: typeof payload.stockQuantity === 'number' ? payload.stockQuantity : Number(payload.stockQuantity) || 50,
      inStock: payload.inStock !== false,
      published: payload.published !== false,
      featured: Boolean(payload.featured),
      rating: Number(payload.rating) || 5.0,
      reviewsCount: Number(payload.reviewsCount) || 1,
      healthBenefits: Array.isArray(payload.healthBenefits) ? payload.healthBenefits : [],
      updatedAt: nowIso,
      createdAt: payload.createdAt || (existingIdx >= 0 ? (list[existingIdx] as any).createdAt : nowIso),
    };

    if (existingIdx >= 0) {
      list[existingIdx] = updatedProduct;
      appendAuditLog(state, {
        adminEmail: verified.email,
        adminRole: verified.role,
        action: 'Dry fruit product updated',
        targetType: 'DryFruit',
        targetId: productId,
        targetName: name,
        details: `Updated product ${name} (PKR ${updatedProduct.pricing['500g']}/500g, Stock: ${updatedProduct.stockQuantity}, InStock: ${updatedProduct.inStock})`,
      });
    } else {
      list.unshift(updatedProduct);
      appendAuditLog(state, {
        adminEmail: verified.email,
        adminRole: verified.role,
        action: 'Dry fruit product created',
        targetType: 'DryFruit',
        targetId: productId,
        targetName: name,
        details: `Created new product ${name} (${updatedProduct.category})`,
      });
    }

    state.dryFruits = list;
    state.updatedAt = Date.now();
    writeSharedStateToDisk(state);

    res.json({
      ok: true,
      product: updatedProduct,
      dryFruits: list,
      auditLogs: state.auditLogs,
    });
  });

  // Admin: Delete a dry fruit product
  app.delete('/api/admin/dry-fruits/:id', (req, res) => {
    const verified = verifyAdminTokenFromHeader(req.headers.authorization);
    if (!verified) {
      res.status(403).json({ error: 'REQUEST DENIED: Administrator authentication required.' });
      return;
    }

    const targetId = String(req.params.id || '').trim();
    if (!targetId) {
      res.status(400).json({ error: 'Product ID is required.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const list = Array.isArray(state.dryFruits) ? [...state.dryFruits] : [];
    const targetProduct = list.find((p: any) => String(p?.id) === targetId);

    if (!targetProduct) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    state.dryFruits = list.filter((p: any) => String(p?.id) !== targetId);
    state.updatedAt = Date.now();

    appendAuditLog(state, {
      adminEmail: verified.email,
      adminRole: verified.role,
      action: 'Dry fruit product deleted',
      targetType: 'DryFruit',
      targetId,
      targetName: (targetProduct as any).name || targetId,
      details: `Deleted product ${(targetProduct as any).name || targetId}`,
    });

    writeSharedStateToDisk(state);

    res.json({
      ok: true,
      deletedId: targetId,
      dryFruits: state.dryFruits,
      auditLogs: state.auditLogs,
    });
  });

  // 3. Server-side Customer Registration Notification
  app.post('/api/notify-signup', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip, 10, 60_000)) {
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      return;
    }

    const { displayName, email, phone, uid, status } = req.body || {};
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Valid customer email is required.' });
      return;
    }

    const sanitizedName = String(displayName || 'Traveler').slice(0, 100);
    const sanitizedEmail = String(email).slice(0, 160);
    const sanitizedPhone = String(phone || 'Not provided').slice(0, 40);
    const sanitizedStatus = String(status || 'active').slice(0, 20);
    const registrationTime = new Date().toISOString();
    const targetEmail = process.env.SIGNUP_NOTIFICATION_EMAIL || 'skardubhai1@gmail.com';
    const subject = 'New Customer Registration — Baig Trecks & Tours';

    const text = [
      'New Customer Registration — Baig Trecks & Tours',
      '------------------------------------------------',
      `Customer Name: ${sanitizedName}`,
      `Email: ${sanitizedEmail}`,
      `User ID: ${String(uid || 'N/A').slice(0, 128)}`,
      `Phone / WhatsApp: ${sanitizedPhone}`,
      `Registration Date/Time: ${registrationTime}`,
      `Account Status: ${sanitizedStatus}`,
    ].join('\n');

    const html = `
      <div style="font-family: sans-serif; color: #0B0F14; max-width: 600px; padding: 24px; border: 1px solid #E2E8F0;">
        <h2 style="margin-top: 0;">New Customer Registration — Baig Trecks &amp; Tours</h2>
        <p>A new customer account has been registered on the platform:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; font-weight: bold;">Customer Name:</td><td>${sanitizedName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${sanitizedEmail}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td><td>${sanitizedPhone}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Registration Date/Time:</td><td>${registrationTime}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Account Status:</td><td>${sanitizedStatus}</td></tr>
        </table>
      </div>
    `;

    const result = await sendNotificationEmail({
      to: targetEmail,
      subject,
      text,
      html,
    });

    res.json({
      recorded: true,
      emailNotificationSent: result.sent,
      recipient: targetEmail,
      note: result.sent
        ? 'Notification email dispatched to administration.'
        : 'Account registered.',
    });
  });

  // 4. Server-side Tour Booking Notification
  app.post('/api/notify-booking', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(`notify_bk_${ip}`, 12, 60_000)) {
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      return;
    }

    const {
      bookingReference,
      customerName,
      email,
      whatsapp,
      tourTitle,
      departureDate,
      returnDate,
      adults,
      children,
      travelers,
      notes,
    } = req.body || {};

    const cleanRef = String(bookingReference || 'BTT-PENDING').slice(0, 50);
    const cleanCustomer = String(customerName || 'Traveler').slice(0, 100);
    const cleanEmail = String(email || 'Not provided').slice(0, 160);
    const cleanWhatsapp = String(whatsapp || '').slice(0, 40);
    const cleanTour = String(tourTitle || 'Gilgit-Baltistan Tour').slice(0, 160);
    const cleanDates = `${departureDate || ''} ${returnDate ? `to ${returnDate}` : ''}`.trim() || 'Flexible';
    const totalCount = Number(travelers) || (Number(adults || 1) + Number(children || 0));

    const targetEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'baigbaltee37@gmail.com';
    const subject = `[New Tour Booking Request ${cleanRef}] ${cleanCustomer} — ${cleanTour}`;

    const text = [
      `New Tour Booking Request: ${cleanRef}`,
      '------------------------------------------------',
      `Customer Name: ${cleanCustomer}`,
      `WhatsApp / Phone: ${cleanWhatsapp}`,
      `Email: ${cleanEmail}`,
      `Tour Package: ${cleanTour}`,
      `Dates: ${cleanDates}`,
      `Adults: ${adults || 1}, Children: ${children || 0} (Total Travelers: ${totalCount})`,
      `Special Requests: ${notes || 'None'}`,
      `Status: Pending Admin Confirmation`,
      `Submitted: ${new Date().toISOString()}`,
    ].join('\n');

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0F172A; max-width: 620px; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background: #FFFFFF;">
        <div style="background: #064E3B; padding: 16px 20px; border-radius: 8px; color: #FFFFFF; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px;">New Booking Request — Baig Treks &amp; Tours</h2>
          <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Reference: <strong>${cleanRef}</strong></div>
        </div>
        <p style="font-size: 14px; line-height: 1.5; color: #334155;">
          A new booking request has been submitted on the website. This booking is currently <strong>Pending Admin Confirmation</strong>.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px;">
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #64748B;">Tour:</td><td style="color: #0F172A; font-weight: bold;">${cleanTour}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Customer:</td><td style="color: #0F172A;">${cleanCustomer}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">WhatsApp / Phone:</td><td style="color: #059669; font-weight: bold;"><a href="https://wa.me/${cleanWhatsapp.replace(/[^0-9]/g, '')}">${cleanWhatsapp}</a></td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Email:</td><td style="color: #0F172A;">${cleanEmail}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Travel Dates:</td><td style="color: #0F172A;">${cleanDates}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Travelers:</td><td style="color: #0F172A;">${adults || 1} Adult(s), ${children || 0} Child(ren) (${totalCount} Total)</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Special Requests:</td><td style="color: #0F172A;">${notes || 'None specified'}</td></tr>
        </table>
        <div style="margin-top: 24px; padding: 12px; background: #F8FAFC; border-radius: 8px; font-size: 12px; color: #64748B;">
          Open the <a href="https://baig-treks-and-tours.vercel.app/admin/bookings" style="color: #059669; font-weight: bold;">Admin Portal</a> to review availability, contact the traveler on WhatsApp, and confirm the reservation.
        </div>
      </div>
    `;

    const result = await sendNotificationEmail({
      to: targetEmail,
      subject,
      text,
      html,
    });

    res.json({
      recorded: true,
      emailNotificationSent: result.sent,
      reason: result.reason || undefined,
      recipient: targetEmail,
      instructions: result.sent
        ? undefined
        : 'Automated email alerts require SMTP_HOST, SMTP_USER, and SMTP_PASS in hosting environment variables.',
    });
  });

  // 5. Server-side Customer Inquiry Notification
  app.post('/api/notify-inquiry', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(`notify_inq_${ip}`, 15, 60_000)) {
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      return;
    }

    const {
      inquiryReference,
      customerName,
      email,
      whatsapp,
      destination,
      tourType,
      travelers,
      preferredDates,
      message,
    } = req.body || {};

    const cleanRef = String(inquiryReference || 'INQ-PENDING').slice(0, 50);
    const cleanCustomer = String(customerName || 'Traveler').slice(0, 100);
    const cleanEmail = String(email || 'Not provided').slice(0, 160);
    const cleanWhatsapp = String(whatsapp || '').slice(0, 40);
    const cleanDestination = String(destination || 'Gilgit-Baltistan').slice(0, 120);

    const targetEmail = process.env.INQUIRY_NOTIFICATION_EMAIL || 'baigbaltee37@gmail.com';
    const subject = `[New Inquiry ${cleanRef}] ${cleanCustomer} — ${cleanDestination}`;

    const text = [
      `New Customer Inquiry: ${cleanRef}`,
      '------------------------------------------------',
      `Customer Name: ${cleanCustomer}`,
      `WhatsApp / Phone: ${cleanWhatsapp}`,
      `Email: ${cleanEmail}`,
      `Destination: ${cleanDestination}`,
      `Tour Type: ${tourType || 'Custom Tour'}`,
      `Travelers: ${travelers || 1}`,
      `Preferred Dates: ${preferredDates || 'Flexible'}`,
      `Message: ${message || 'No additional note'}`,
      `Submitted: ${new Date().toISOString()}`,
    ].join('\n');

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0F172A; max-width: 620px; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background: #FFFFFF;">
        <div style="background: #064E3B; padding: 16px 20px; border-radius: 8px; color: #FFFFFF; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px;">New Customer Inquiry — Baig Treks &amp; Tours</h2>
          <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Reference: <strong>${cleanRef}</strong></div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px;">
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; width: 140px; color: #64748B;">Customer:</td><td style="color: #0F172A; font-weight: bold;">${cleanCustomer}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">WhatsApp / Phone:</td><td style="color: #059669; font-weight: bold;"><a href="https://wa.me/${cleanWhatsapp.replace(/[^0-9]/g, '')}">${cleanWhatsapp}</a></td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Email:</td><td style="color: #0F172A;">${cleanEmail}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Destination:</td><td style="color: #0F172A;">${cleanDestination}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Tour Type:</td><td style="color: #0F172A;">${tourType || 'Custom Tour'}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Travelers:</td><td style="color: #0F172A;">${travelers || 1}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Dates:</td><td style="color: #0F172A;">${preferredDates || 'Flexible'}</td></tr>
          <tr style="border-bottom: 1px solid #F1F5F9;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Customer Message:</td><td style="color: #0F172A; white-space: pre-wrap;">${message || 'N/A'}</td></tr>
        </table>
      </div>
    `;

    const result = await sendNotificationEmail({
      to: targetEmail,
      subject,
      text,
      html,
    });

    res.json({
      recorded: true,
      emailNotificationSent: result.sent,
      reason: result.reason || undefined,
      recipient: targetEmail,
      instructions: result.sent
        ? undefined
        : 'Automated email alerts require SMTP_HOST, SMTP_USER, and SMTP_PASS in hosting environment variables.',
    });
  });

  // 6. Public Booking Reference Status Lookup Endpoint (Zero Authentication Required for Traveler with Valid Reference + Phone/Email)
  app.post('/api/bookings/lookup', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(`bk_lookup_${ip}`, 20, 60_000)) {
      res.status(429).json({ error: 'Too many status check attempts. Please wait a minute.' });
      return;
    }

    const { reference, contact } = req.body || {};
    const cleanRef = String(reference || '').trim().toUpperCase();
    const cleanContact = String(contact || '').trim().toLowerCase();

    if (!cleanRef || !cleanContact) {
      res.status(400).json({ error: 'Please enter both your Booking Reference and Phone or Email.' });
      return;
    }

    const state = readSharedStateFromDisk();
    const bookings = Array.isArray(state.bookings) ? state.bookings : [];

    const matched = bookings.find((b) => {
      const bRef = String(b?.bookingReference || b?.id || '').trim().toUpperCase();
      const bEmail = String(b?.email || b?.userEmail || '').trim().toLowerCase();
      const bPhone = String(b?.whatsapp || '').replace(/[^0-9]/g, '');
      const inputPhone = cleanContact.replace(/[^0-9]/g, '');

      const refMatches = bRef === cleanRef;
      const contactMatches =
        (cleanContact.includes('@') && bEmail === cleanContact) ||
        (inputPhone.length >= 7 && bPhone.endsWith(inputPhone.slice(-7)));

      return refMatches && contactMatches;
    });

    if (!matched) {
      res.status(404).json({
        error: 'No matching booking found for this reference and contact detail. Please check the reference code on your confirmation.',
      });
      return;
    }

    // Return sanitized status info without exposing administrative private notes
    res.json({
      found: true,
      booking: {
        bookingReference: matched.bookingReference || matched.id,
        tourTitle: matched.tourTitle,
        customerName: matched.customerName,
        travelDates: matched.travelDates,
        departureDate: matched.departureDate,
        returnDate: matched.returnDate,
        adults: matched.adults,
        children: matched.children,
        travelers: matched.travelers,
        bookingStatus: matched.bookingStatus || 'Pending',
        paymentStatus: matched.paymentStatus || 'Payment Pending',
        createdAt: matched.createdAt,
      },
    });
  });

  // 4. Server-side SEO Sitemap
  app.get('/sitemap.xml', (_req, res) => {
    const baseUrl = 'https://baig-treks-and-tours.vercel.app';
    const routes = [
      '/',
      '/tours',
      '/tours/hunza-tour-packages',
      '/tours/skardu-tour-packages',
      '/tours/naran-kaghan-tour-packages',
      '/tours/kashmir-tour-packages',
      '/tours/hunza-skardu-tour',
      '/tours/naran-hunza-tour',
      '/tours/naran-skardu-tour',
      '/tours/fairy-meadows-trek-tour',
      '/destinations',
      '/destinations/hunza',
      '/destinations/skardu',
      '/destinations/naran-kaghan',
      '/destinations/kashmir',
      '/destinations/northern-areas',
      '/destinations/gilgit',
      '/destinations/attabad-lake',
      '/destinations/passu',
      '/destinations/khunjerab',
      '/destinations/karimabad',
      '/destinations/shigar',
      '/destinations/khaplu',
      '/destinations/deosai',
      '/destinations/astore',
      '/destinations/naltar',
      '/destinations/fairy-meadows',
      '/destinations/ghizer',
      '/experiences',
      '/about',
      '/gallery',
      '/guides',
      '/guides/best-time-to-visit-hunza',
      '/guides/best-time-to-visit-skardu',
      '/guides/hunza-vs-skardu',
      '/guides/how-to-plan-a-skardu-trip',
      '/guides/how-to-plan-a-hunza-trip',
      '/guides/what-to-pack-for-northern-pakistan',
      '/guides/northern-pakistan-travel-guide',
      '/contact',
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : route.startsWith('/guides/') || route === '/about' || route === '/contact' || route === '/gallery' ? 'monthly' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/tours') || route.startsWith('/destinations') ? '0.9' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // 5. Server-side robots.txt
  app.get('/robots.txt', (_req, res) => {
    res.header('Content-Type', 'text/plain');
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\nDisallow: /baig-admin-secure-786\nDisallow: /customer\nDisallow: /my-bookings\nDisallow: /profile\nDisallow: /api/\n\nSitemap: https://baig-treks-and-tours.vercel.app/sitemap.xml\n`
    );
  });
}

registerRoutes(app);

export { app };
export default app;
