// Client navigation hint only. Server authorization uses a signed HttpOnly cookie.

const SESSION_KEY = 'sudo-squad-admin-ok'

export function setAdminSession(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // sessionStorage tidak tersedia (mis. mode privat ekstrem) — abaikan
  }
}

export function isAdminSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // abaikan
  }
}
