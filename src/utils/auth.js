import { users } from "../data/users";

const SESSION_KEY = "app_session";

/**
 * Validasi credentials terhadap akun dummy.
 * Mengembalikan { ok: true, session } atau { ok: false, message }.
 */
export function authenticate(username, password) {
  const foundUser = users.find((u) => u.username === username.trim());

  if (!foundUser) {
    return { ok: false, message: "Username tidak terdaftar." };
  }

  if (foundUser.password !== password) {
    return { ok: false, message: "Password salah. Silakan coba lagi." };
  }

  const session = {
    user: {
      username: foundUser.username,
      role: foundUser.role,
    },
    // Dummy token berdasarkan role (hanya simulasi)
    token: `dummy-access-token-${foundUser.role}`,
  };

  return { ok: true, session };
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Ambil session dari localStorage.
 * Mengembalikan null jika tidak ada, rusak, atau strukturnya tidak valid.
 */
export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    const isValid =
      session &&
      typeof session.token === "string" &&
      session.user &&
      typeof session.user.username === "string" &&
      (session.user.role === "admin" || session.user.role === "user");

    if (!isValid) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    // JSON rusak: bersihkan agar tidak error berulang
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}