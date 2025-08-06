// src/context/AuthContext.tsx
// Globale Verwaltung von Login-Zustand und Token

import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

// Datentypen
type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type RegisterFormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

// Struktur des AuthContext mit allen Funktionen und States
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider-Komponente, die den Context im gesamten Projekt bereitstellt
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Beim Start: Prüfen, ob ein Token vorhanden ist und User-Daten laden
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem("token");
        });
    }
  }, [token]);

  // Login-Funktion → speichert Token lokal
  const login = async (email: string, password: string) => {
    const res = await axios.post("http://localhost:8000/api/login", {
      email,
      password,
    });
    setToken(res.data.access_token);
    localStorage.setItem("token", res.data.access_token);
    closeModal();
  };

  // Registrierung neuer Nutzer (ohne Login)
  const register = async (formData: RegisterFormData) => {
    await axios.post("http://localhost:8000/api/register", formData);
  };

  // Logout → löscht Token + leitet auf Startseite weiter
  const logout = async () => {
    if (!token) return;
    await axios.post(
      "http://localhost:8000/api/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  // Kontext verfügbar machen für untergeordnete Komponenten
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        showModal,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook zum Zugriff auf den Kontext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
