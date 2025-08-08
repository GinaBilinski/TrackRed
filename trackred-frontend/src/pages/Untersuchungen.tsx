// src/pages/Untersuchungen.tsx
// Seite zur Anzeige aller bisherigen Blutuntersuchungen

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Select from "react-select";
import { umrechnen } from "../utils/conversion";

// Datentypen für eine Untersuchung
type BloodTest = {
  id: number;
  date: string;
  doctor: string;
  location: string;
  notes?: string;
  values: {
    id: number;
    measured_value: number;
    unit: string;
    definition: {
      name: string;
      unit: string;
      reference_min: number;
      reference_max: number;
      conversion_factors?: { [key: string]: number };
    } | null;
  }[];
};
// Formatierungsfunktionen für Datum und Zahlen
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function formatZahl(wert: any): string {
  const num = typeof wert === "number" ? wert : Number(wert);
  return isNaN(num) ? "" : num.toFixed(2);
}

// State: Untersuchungen, Auswahl, Filter, Sortierung
export default function Untersuchungen() {
  const { token } = useAuth();
  const [tests, setTests] = useState<BloodTest[]>([]);
  const [selected, setSelected] = useState<BloodTest | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [doctorFilter, setDoctorFilter] = useState<string>("Alle");

  const uniqueDoctors = [...new Set(tests.map((t) => t.doctor))];

  // Filterung + Sortierung
  const filteredTests = tests
    .filter((test) => doctorFilter === "Alle" || test.doctor === doctorFilter)
    .sort((a, b) =>
      sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  // Lade alle Untersuchungen vom Backend
  const ladeUntersuchungen = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/blood-tests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data);
      if (res.data.length > 0) {
        setSelected(res.data[0]);
      } else {
        setSelected(null);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Untersuchungen:", err);
    }
  };

  useEffect(() => {
    ladeUntersuchungen();
  }, [token]);

  return (
    <main className="untersuchungen-layout">
      {/* Liste der Untersuchungen mit Filter */}
      <div className="untersuchungen-list">
        <h2>Untersuchungen</h2>
        <div className="untersuchungen-filters">
          <div className="filter-element">
            <label htmlFor="arzt-filter">Arzt:</label>
            <div style={{ flex: 1.5 }}>
              <Select
                inputId="arzt-filter"
                className="react-select-container"
                classNamePrefix="react-select"
                options={[
                  { value: "Alle", label: "Alle" },
                  ...uniqueDoctors.map((doc) => ({ value: doc, label: doc })),
                ]}
                value={{ value: doctorFilter, label: doctorFilter }}
                onChange={(option) => {
                  if (option) setDoctorFilter(option.value);
                }}
                placeholder="Arzt auswählen / suchen"
                noOptionsMessage={() => "Kein Arzt gefunden"}
              />
            </div>
          </div>
          {/* Sortierbutton */}
          <button
            className="sort-button"
            onClick={() =>
              setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
            }
          >
            {sortDirection === "asc" ? "Datum ↓" : "Datum ↑"}
          </button>
        </div>
        {/* Auflistung aller Untersuchungen */}
        <ul>
          {filteredTests.map((test) => (
            <li
              key={test.id}
              className={selected?.id === test.id ? "selected" : ""}
              onClick={() => setSelected(test)}
            >
              <strong>{formatDate(test.date)}</strong> <br />
              {test.doctor} – {test.location}
            </li>
          ))}
        </ul>
      </div>
      {/* Detailansicht zur ausgewählten Untersuchung */}
      <div className="untersuchungen-details">
        {selected && tests.length > 0 && (
          <>
            <h2>Details zur Untersuchung</h2>
            <p>
              <strong>Datum:</strong> {formatDate(selected.date)}
            </p>
            <p>
              <strong>Arzt:</strong> {selected.doctor}
            </p>
            <p>
              <strong>Ort:</strong> {selected.location}
            </p>
            {selected.notes && (
              <p>
                <strong>Notizen:</strong> {selected.notes}
              </p>
            )}
            {/* Blutwerte-Tabelle */}
            <h3>Gemessene Werte</h3>
            <div className="werte-tabelle-container">
              <table className="werte-tabelle">
                <thead>
                  <tr>
                    <th>Wert</th>
                    <th>Messwert</th>
                    <th>Einheit</th>
                    <th>Referenz</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.values.map((val, idx) => {
                    if (!val.definition) return null;

                    const conversionFactors =
                      typeof val.definition.conversion_factors === "string"
                        ? JSON.parse(val.definition.conversion_factors)
                        : val.definition.conversion_factors;

                    const refMinConverted = umrechnen(
                      val.definition.reference_min,
                      val.definition.unit,
                      val.unit,
                      conversionFactors
                    );

                    const refMaxConverted = umrechnen(
                      val.definition.reference_max,
                      val.definition.unit,
                      val.unit,
                      conversionFactors
                    );

                    return (
                      <tr key={idx}>
                        <td>{val.definition.name}</td>
                        <td>{val.measured_value}</td>
                        <td>{val.unit ?? val.definition.unit}</td>
                        <td>
                          {formatZahl(refMinConverted)}–
                          {formatZahl(refMaxConverted)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Button: Untersuchung löschen */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(true)}
                className="delete-button"
              >
                Untersuchung löschen
              </button>
            </div>
          </>
        )}
      </div>
      {/* Modal zum Löschen */}
      {showDeleteModal && selected && (
        <div className="overlay">
          <div className="overlay-box">
            <h2>Willst du die Untersuchung wirklich löschen?</h2>
            <div className="overlay-actions">
              <button
                className="secondary-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Abbrechen
              </button>
              <button
                className="primary-button"
                onClick={async () => {
                  try {
                    await axios.delete(
                      `http://localhost:8000/api/blood-tests/${selected.id}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    setShowDeleteModal(false);
                    await ladeUntersuchungen();
                  } catch (err) {
                    alert("Löschen fehlgeschlagen.");
                  }
                }}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
