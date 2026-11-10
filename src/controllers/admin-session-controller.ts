import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import {
  adminSessionCookie,
  clearedAdminSessionCookie,
  createAdminSessionToken,
} from '@/lib/admin-session'

export async function createAdminSession(request: Request) {
  const configuredPassword = process.env.ADMIN_PASSWORD
  const sessionSecret = process.env.ADMIN_SESSION_SECRET
  if (!configuredPassword || !sessionSecret) {
    return NextResponse.json({ ok: false, error: 'ADMIN_AUTH_NOT_CONFIGURED' }, { status: 503 })
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null
  const password = typeof body?.password === 'string' ? body.password : ''
  const expected = Buffer.from(configuredPassword)
  const actual = Buffer.from(password)
  const valid = expected.length === actual.length && timingSafeEqual(expected, actual)
  if (!valid) {
    return NextResponse.json({ ok: false, error: 'INVALID_CREDENTIALS' }, { status: 401 })
  }

  const token = createAdminSessionToken()
  if (!token) {
    return NextResponse.json({ ok: false, error: 'ADMIN_AUTH_NOT_CONFIGURED' }, { status: 503 })
  }

  const response = NextResponse.json({ ok: true })
  response.headers.append(
    'Set-Cookie',
    adminSessionCookie(token, process.env.NODE_ENV === 'production'),
  )
  return response
}

export async function clearAdminSession() {
  const response = NextResponse.json({ ok: true })
  response.headers.append(
    'Set-Cookie',
    clearedAdminSessionCookie(process.env.NODE_ENV === 'production'),
  )
  return response
}
