import { useState } from "react";
import { authenticate } from "../utils/auth";

const DEMO_ACCOUNTS = {
  admin: { username: "admin_demo", password: "admin123" },
  user: { username: "user_demo", password: "user123" },
};

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Tombol demo HANYA mengisi input, tidak melakukan login
  const fillDemo = (role) => {
    setUsername(DEMO_ACCOUNTS[role].username);
    setPassword(DEMO_ACCOUNTS[role].password);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    const result = authenticate(username, password);

    if (!result.ok) {
      // Input sengaja tidak dikosongkan
      setError(result.message);
      return;
    }

    setError("");
    onLogin(result.session);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white border border-line rounded-2xl shadow-sm overflow-hidden">
          {/* Aksen emas solid */}
          <div className="h-1.5 bg-gold" />

          <div className="p-6 sm:p-8">
            <header className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white">
                R
              </div>
              <h1 className="text-2xl font-bold text-ink">
                Room Reservation System
              </h1>
              <p className="mt-1 text-sm text-muted">
                Faculty Room Reservation Management
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full rounded-lg border border-line bg-sky-bg px-3.5 py-2.5 text-sm placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full rounded-lg border border-line bg-sky-bg px-3.5 py-2.5 text-sm placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Login
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-line" />
              Akun demo
              <span className="h-px flex-1 bg-line" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="rounded-lg border border-brand bg-white px-3 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
              >
                Login as Admin (Demo)
              </button>
              <button
                type="button"
                onClick={() => fillDemo("user")}
                className="rounded-lg border border-gold bg-white px-3 py-2.5 text-sm font-medium text-gold-dark transition-colors hover:bg-gold-soft"
              >
                Login as User (Demo)
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-muted">
              Prototipe pembelajaran. Token dan session hanya simulasi.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}