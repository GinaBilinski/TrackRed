// src/pages/Hinzufuegen.tsx
// Seite zum Hinzufügen einer neuen Blutuntersuchung

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Select from "react-select";

// Definition eines Blutwertes
type Definition = {
  id: number;
  name: string;
  unit: string;
  reference_min: number;
  reference_max: number;
  allowed_units: string[];
};

// States für verfügbare Werte, eingegebene Messwerte und Metadaten
export default function Hinzufuegen() {
  const { token } = useAuth();
  const [defs, setDefs] = useState<Definition[]>([]);
  const [values, setValues] = useState([
    { definition_id: 0, measured_value: "", unit: "" },
  ]);
  const [meta, setMeta] = useState({
    date: "",
    doctor: "",
    location: "",
    notes: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Lädt alle Blutwert-Definitionen bei Seitenaufruf
  useEffect(() => {
    axios
      .get<Definition[]>("http://localhost:8000/api/blutwerte", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const parsed = res.data.map((d) => ({
          ...d,
          allowed_units:
            typeof d.allowed_units === "string"
              ? JSON.parse(d.allowed_units)
              : d.allowed_units,
        }));
        setDefs(parsed);
      })
      .catch(console.error);
  }, [token]);

  // Aktualisiert einen Messwert oder eine Einheit
  const handleValueChange = (idx: number, field: string, val: string) => {
    const updated = [...values];
    (updated[idx] as any)[field] = val;
    setValues(updated);
  };

  // Fügt ein neues Wertefeld hinzu
  const addValue = () => {
    setValues([...values, { definition_id: 0, measured_value: "", unit: "" }]);
  };

  // Sendet die eingegebenen Daten an das Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/blood-tests",
        {
          ...meta,
          values: values
            .filter((v) => v.definition_id && v.measured_value)
            .map((v) => ({
              ...v,
              measured_value: parseFloat(
                parseFloat(v.measured_value).toFixed(2)
              ), // runden auf 2 Nachkommastellen
            })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Felder leeren + Erfolgsmeldung anzeigen
      setMeta({ date: "", doctor: "", location: "", notes: "" });
      setValues([{ definition_id: 0, measured_value: "", unit: "" }]);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Fehler beim Speichern");
    }
  };

  return (
    <main className="hinzufuegen">
      <h1>Blutabnahme hinzufügen</h1>
      <p className="form-description">
        Bitte gib die Daten deiner letzten Blutabnahme ein. Du kannst einzelne
        Werte hinzufügen, die du erhalten hast.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Datum:</label>
          <input
            type="date"
            value={meta.date}
            onChange={(e) =>
              setMeta((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Arzt:</label>
          <input
            type="text"
            value={meta.doctor}
            onChange={(e) =>
              setMeta((prev) => ({ ...prev, doctor: e.target.value }))
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Ort:</label>
          <input
            type="text"
            value={meta.location}
            onChange={(e) =>
              setMeta((prev) => ({ ...prev, location: e.target.value }))
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Notizen (optional):</label>
          <textarea
            value={meta.notes}
            onChange={(e) =>
              setMeta((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
          />
        </div>

        <h2>Werte eingeben</h2>

        {values.map((item, idx) => (
          <div key={idx} className="value-row">
            {/* Wert-Auswahl */}
            <div className="value-select value-full">
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                options={defs
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((d) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                value={
                  defs.find((d) => d.id === Number(item.definition_id))
                    ? {
                        value: item.definition_id,
                        label:
                          defs.find((d) => d.id === Number(item.definition_id))
                            ?.name || "",
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  const newId = String(selectedOption?.value || "");
                  const defaultUnit =
                    defs.find((d) => d.id === Number(newId))
                      ?.allowed_units?.[0] || "";
                  const updated = [...values];
                  updated[idx].definition_id = Number(newId);
                  updated[idx].unit = defaultUnit;
                  setValues(updated);
                }}
                placeholder="Wert wählen"
                noOptionsMessage={() => "Keine passenden Werte gefunden"}
              />
            </div>

            {/* Einheit + Messwert */}
            <div className="value-pair">
              <div className="value-select">
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={
                    defs
                      .find((d) => d.id === Number(item.definition_id))
                      ?.allowed_units?.map((unit) => ({
                        value: unit,
                        label: unit,
                      })) || []
                  }
                  value={
                    item.unit ? { value: item.unit, label: item.unit } : null
                  }
                  onChange={(selectedOption) =>
                    handleValueChange(idx, "unit", selectedOption?.value || "")
                  }
                  placeholder="Einheit"
                  isDisabled={
                    !defs.find((d) => d.id === Number(item.definition_id))
                      ?.allowed_units?.length
                  }
                />
              </div>

              <div className="value-input">
                <input
                  type="number"
                  step="any"
                  placeholder="Messwert"
                  value={item.measured_value}
                  onChange={(e) =>
                    handleValueChange(idx, "measured_value", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="add-button" onClick={addValue}>
          + weiteren Wert hinzufügen
        </button>

        <button type="submit" className="submit-button">
          Speichern
        </button>
      </form>

      {/* Erfolgs-Overlay */}
      {showSuccess && (
        <div className="overlay">
          <div className="overlay-box">
            <h2>Erfolgreich gespeichert</h2>
            <p>Die Blutabnahme wurde erfolgreich gespeichert.</p>
            <div className="overlay-actions">
              <button onClick={() => setShowSuccess(false)}>
                Weitere Werte eingeben
              </button>
              <button
                onClick={() => (window.location.href = "/untersuchungen")}
              >
                Zur Übersicht
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
