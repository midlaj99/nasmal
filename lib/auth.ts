import crypto from 'crypto';
import { getDb } from './mongodb';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'nasmal_tourism_secure_admin_jwt_secret_key_2026';
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'nasmaltourism@admin').toLowerCase().trim();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'nasmaltourism@gmail.com').toLowerCase().trim();

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  failedAttempts: number;
  lockUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  id: string;
  adminId: string;
  username: string;
  email: string;
  userAgent?: string;
  ip?: string;
  createdAt: string;
  expiresAt: string;
}

export interface AdminOtp {
  id: string;
  email: string;
  codeHash: string;
  attempts: number;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

/**
 * Enterprise Password Hashing using Node.js built-in scrypt
 * Format: scrypt:salt:derivedKey (Hex encoded)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 3 || parts[0] !== 'scrypt') {
      return false;
    }
    const salt = parts[1];
    const key = Buffer.from(parts[2], 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
    return crypto.timingSafeEqual(key, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Cryptographically secure token signing using HMAC-SHA256
 */
export function signToken(payload: string): string {
  const hmac = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export function verifySignedToken(signedToken: string): string | null {
  try {
    const lastDot = signedToken.lastIndexOf('.');
    if (lastDot === -1) return null;
    const payload = signedToken.substring(0, lastDot);
    const signature = signedToken.substring(lastDot + 1);
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Initializes or retrieves the primary admin account
 */
export async function getOrCreateAdmin(): Promise<AdminUser> {
  const db = await getDb();
  const collection = db.collection('admins');

  let admin = (await collection.findOne({
    $or: [
      { username: ADMIN_USERNAME },
      { email: ADMIN_EMAIL }
    ]
  })) as unknown as AdminUser | null;

  if (!admin) {
    // Default initial password: nasmal123
    const defaultPassword = 'nasmal123';
    const newAdmin: AdminUser = {
      id: 'admin_primary',
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash: hashPassword(defaultPassword),
      failedAttempts: 0,
      lockUntil: null,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await collection.insertOne(newAdmin as any);
    admin = newAdmin;
  }

  return admin;
}

/**
 * Creates a secure session in MongoDB and returns the signed session cookie value
 */
export async function createAdminSession(admin: AdminUser, userAgent?: string, ip?: string): Promise<string> {
  const db = await getDb();
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  const session: AdminSession = {
    id: sessionId,
    adminId: admin.id,
    username: admin.username,
    email: admin.email,
    userAgent,
    ip,
    createdAt: new Date().toISOString(),
    expiresAt,
  };

  await db.collection('sessions').insertOne(session as any);

  // Return signed session token
  return signToken(sessionId);
}

/**
 * Verifies admin session from cookie string or request headers
 */
export async function verifyAdminSessionToken(signedToken?: string | null): Promise<AdminSession | null> {
  if (!signedToken) return null;

  const sessionId = verifySignedToken(signedToken);
  if (!sessionId) return null;

  try {
    const db = await getDb();
    const session = (await db.collection('sessions').findOne({ id: sessionId })) as unknown as AdminSession | null;

    if (!session) return null;

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      // Session expired, delete it
      await db.collection('sessions').deleteOne({ id: sessionId });
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Destroys an active admin session (Logout)
 */
export async function destroyAdminSession(signedToken?: string | null): Promise<boolean> {
  if (!signedToken) return false;
  const sessionId = verifySignedToken(signedToken);
  if (!sessionId) return false;

  try {
    const db = await getDb();
    const res = await db.collection('sessions').deleteOne({ id: sessionId });
    return res.deletedCount > 0;
  } catch {
    return false;
  }
}

/**
 * OTP Utilities (Cryptographically Secure 6-digit code)
 */
export function generateOtpCode(): string {
  // Uniform cryptographically secure 6-digit random number
  return crypto.randomInt(100000, 999999).toString();
}

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp.trim()).digest('hex');
}

export function verifyOtpHash(enteredOtp: string, storedHash: string): boolean {
  try {
    const enteredHash = hashOtp(enteredOtp);
    const bufA = Buffer.from(enteredHash, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Route protection helper for administrative API endpoints
 */
export async function requireAdminAuth(request: Request): Promise<{ authorized: boolean; error?: string }> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/nasmal_admin_session=([^;]+)/);
  const sessionToken = match ? match[1] : null;

  if (!sessionToken) {
    return { authorized: false, error: 'Unauthorized. Admin session required.' };
  }

  const session = await verifyAdminSessionToken(sessionToken);
  if (!session) {
    return { authorized: false, error: 'Unauthorized. Session expired or invalid.' };
  }

  return { authorized: true };
}
