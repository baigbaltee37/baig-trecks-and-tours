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

// Deterministic PBKDF2-SHA512 seed for initial Super Admin (admin@baigtours)
// Plaintext password is never stored in source code or sent to client.
const INITIAL_SUPER_ADMIN_SALT = 'baig_treks_super_admin_salt_2026';
const INITIAL_SUPER_ADMIN_HASH =
  '474e315363e90e6119df10433721a5148c5818ee9c5a34ba6752e5559c2584c7dbd871c6df20457527d0945188c61bdc88d32b30836ba3d1f438823a186e1d21';

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
  const existingIdx = list.findIndex(
    (a) =>
      a.uid === 'super_admin_baigtours' ||
      a.email.toLowerCase() === 'admit@baigtours' ||
      a.email.toLowerCase() === 'admin@baigtours'
  );
  if (existingIdx >= 0) {
    list[existingIdx] = {
      ...list[existingIdx],
      uid: 'super_admin_baigtours',
      email: 'admit@baigtours',
      displayName: list[existingIdx].displayName || 'Master Admin',
      role: 'SUPER_ADMIN',
      status: 'active',
    };
    // Deduplicate if both admit@baigtours and admin@baigtours existed
    return list.filter(
      (a, idx) =>
        idx === existingIdx ||
        (a.email.toLowerCase() !== 'admit@baigtours' &&
          a.email.toLowerCase() !== 'admin@baigtours' &&
          a.uid !== 'super_admin_baigtours')
    );
  }
  list.unshift({
    uid: 'super_admin_baigtours',
    email: 'admit@baigtours',
    displayName: 'Master Admin',
    role: 'SUPER_ADMIN',
    salt: INITIAL_SUPER_ADMIN_SALT,
    passwordHash: INITIAL_SUPER_ADMIN_HASH,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  });
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
        merged.inquiries = incoming.inquiries.map((inq: Record<string, unknown>) => {
          const prev = existingInqMap.get(String(inq.id));
          if (prev) return prev; // Customers cannot overwrite existing inquiries or internalNotes
          return {
            ...inq,
            status: 'NEW',
            internalNotes: '',
          };
        });
      }
    }

    // Bookings: customers can only create bookings with PENDING / PAYMENT PENDING; only Admin can mark CONFIRMED / PAID
    if (Array.isArray(incoming.bookings)) {
      if (verifiedAdmin) {
        merged.bookings = incoming.bookings;
      } else {
        const existingBkMap = new Map(
          (current.bookings || []).map((b) => [String(b.id), b])
        );
        merged.bookings = incoming.bookings.map((bk: Record<string, unknown>) => {
          const prev = existingBkMap.get(String(bk.id));
          if (prev) return prev;
          return {
            ...bk,
            bookingStatus: 'PENDING',
            paymentStatus: 'PAYMENT PENDING',
          };
        });
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
