import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long'
);

// JWT functions
export async function createToken(payload: { username: string }): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { username: string };
  } catch (error) {
    return null;
  }
}

// Password functions
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Get admin credentials from environment
export function getAdminCredentials() {
  // Support both regular hash and base64 encoded hash
  let passwordHash = process.env.ADMIN_PASSWORD_HASH || '';
  
  // If base64 version is provided, decode it
  if (process.env.ADMIN_PASSWORD_HASH_BASE64) {
    passwordHash = Buffer.from(process.env.ADMIN_PASSWORD_HASH_BASE64, 'base64').toString('utf-8');
  }
  
  // Fallback to default if still empty
  if (!passwordHash) {
    passwordHash = '$2a$10$YourDefaultHashHere';
  }
  
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: passwordHash
  };
}

// Verify admin login
export async function verifyAdminLogin(username: string, password: string): Promise<boolean> {
  const admin = getAdminCredentials();
  
  if (username !== admin.username) {
    return false;
  }
  
  return verifyPassword(password, admin.passwordHash);
}