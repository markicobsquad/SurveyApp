import {
  clearAdminSession,
  createAdminSession,
} from '@/controllers/admin-session-controller'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  return createAdminSession(request)
}

export async function DELETE() {
  return clearAdminSession()
}
