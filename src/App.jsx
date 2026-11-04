import { useEffect, useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import { getSession, saveSession, clearSession } from "./utils/auth";

export default function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  // Cek session saat aplikasi pertama kali dimuat (session persistence)
  useEffect(() => {
    setSession(getSession());
    setChecking(false);
  }, []);

  const handleLogin = (newSession) => {
    saveSession(newSession);
    setSession(newSession);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  // Hindari kedipan Login saat session sedang diperiksa
  if (checking) return null;

  return session ? (
    <Dashboard session={session} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}