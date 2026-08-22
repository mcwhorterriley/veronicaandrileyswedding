const AUTH_KEY = "wedding_admin_authorized_v1";
const ATTEMPT_KEY = "wedding_admin_attempts_v1";
const MAX_ATTEMPTS = 5;

// Replace these two values with the exact emails Riley and Veronica will use.
// This is intentionally a lightweight, three-month-site gate, not high-security authentication.
const ADMIN_EMAILS = {
  "riley-mcwhorter": "REPLACE_WITH_RILEY_EMAIL",
  "veronica-mcwhorter": "REPLACE_WITH_VERONICA_EMAIL",
};

export const isAdminMember = (memberId) => Object.prototype.hasOwnProperty.call(ADMIN_EMAILS, memberId);

export function readAdminAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch { return null; }
}

export function isAdminAuthorized() {
  return Boolean(readAdminAuth()?.authorized);
}

export function remainingAdminAttempts(memberId) {
  const attempts = Number(JSON.parse(localStorage.getItem(ATTEMPT_KEY) || "{}")[memberId] || 0);
  return Math.max(0, MAX_ATTEMPTS - attempts);
}

export function verifyAdminEmail(memberId, email) {
  const normalized = String(email || "").trim().toLowerCase();
  const expected = String(ADMIN_EMAILS[memberId] || "").trim().toLowerCase();
  const attempts = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || "{}");
  const used = Number(attempts[memberId] || 0);

  if (!expected || expected.startsWith("replace_with_")) {
    return { ok: false, configurationError: true, remaining: MAX_ATTEMPTS - used };
  }
  if (used >= MAX_ATTEMPTS) return { ok: false, locked: true, remaining: 0 };

  if (normalized === expected) {
    const auth = { authorized: true, memberId, verifiedAt: new Date().toISOString() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    return { ok: true, auth, remaining: MAX_ATTEMPTS - used };
  }

  attempts[memberId] = used + 1;
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempts));
  const remaining = Math.max(0, MAX_ATTEMPTS - (used + 1));
  return { ok: false, locked: remaining === 0, remaining };
}
