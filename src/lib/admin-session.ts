import { createHmac, timingSafeEqual } from 'node:crypto'

export const ADMIN_SESSION_COOKIE = 'sudo-squad-admin'
const SESSION_DURATION_SECONDS = 8 * 60 * 60

function sign(timestamp: string): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return null
  return createHmac('sha256', secret).update(timestamp).digest('base64url')
}

export function createAdminSessionToken(): string | null {
  const timestamp = String(Date.now())
  const signature = sign(timestamp)
  return signature ? `${timestamp}.${signature}` : null
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false
  const [timestamp, signature, extra] = token.split('.')
  if (!timestamp || !signature || extra || !/^\d+$/.test(timestamp)) return false

  const age = Date.now() - Number(timestamp)
  if (age < 0 || age > SESSION_DURATION_SECONDS * 1000) return false

  const expected = sign(timestamp)
  if (!expected) return false
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

export function adminSessionCookie(token: string, secure: boolean): string {
  return `${ADMIN_SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}${secure ? '; Secure' : ''}`
}

export function clearedAdminSessionCookie(secure: boolean): string {
  return `${ADMIN_SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure ? '; Secure' : ''}`
}
