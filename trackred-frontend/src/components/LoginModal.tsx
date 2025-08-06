// src/components/LoginModal.tsx
// Das visuelle Popup mit Login- / Registrierungsformular

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/components/_loginmodal.scss";

type Props = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: Props) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister && form.password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    try {
      if (isRegister) {
        await register(form);
        setIsRegister(false);
      } else {
        await login(form.email, form.password);
        onClose();
      }
    } catch (err: any) {
      setError("Fehler beim Einloggen oder Registrieren.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>{isRegister ? "Registrieren" : "Login"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="Vorname"
                value={form.first_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Nachname"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Passwort"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isRegister ? "Registrieren" : "Login"}</button>
        </form>
        <p>
          {isRegister ? "Schon registriert?" : "Noch kein Konto?"}{" "}
          <span className="link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Zum Login" : "Registrieren"}
          </span>
        </p>
      </div>
    </div>
  );
}
