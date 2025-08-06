// src/pages/Werte.tsx
// Übersicht über alle Werte mit Verlauf, Referenzbereich, Einheitenumrechnung & Chart

import { useEffect, useState } from "react";
import axios from "axios";
import { umrechnen } from "../utils/conversion";
import Select from "react-select";
import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Hilfsfunktionen für Datums- und Zahlenformat
const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
};

const formatZahl = (wert: any): string => {
  const num = typeof wert === "number" ? wert : Number(wert);
  return isNaN(num) ? "" : num.toFixed(2);
};

// Datentyp für Blutwert
type Wert = {
  id: number;
  name: string;
  unit: string;
  reference_min: number;
  reference_max: number;
  info: string;
  latest_value: number | null;
  latest_unit?: string;
  latest_date: string | null;
  conversion_factors?: { [key: string]: number };
  values: {
    date: string;
    measured_value: number;
    formattedDate?: string;
    unit: string;
  }[];
};

// State für Werte, Filter und Auswahl
export default function Werte() {
  const { token } = useAuth();
  const [alleWerte, setAlleWerte] = useState<Wert[]>([]);
  const [zeigeAlle, setZeigeAlle] = useState(false);
  const [ausgewählt, setAusgewählt] = useState<Wert | null>(null);
  const [einheit, setEinheit] = useState<string | null>(null);

  // Lade Blutwerte vom Backend + sortiere sie
  useEffect(() => {
    axios
      .get<Wert[]>("http://localhost:8000/api/werte-uebersicht", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const erweitert = res.data.map((wert) => {
          const sorted = [...wert.values].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          const latest = sorted[0];

          return {
            ...wert,
            values: sorted.map((v) => ({
              ...v,
              formattedDate: formatDate(v.date),
              unit: v.unit || wert.unit, // fallback
            })),
            latest_value: latest?.measured_value ?? null,
            latest_unit: latest?.unit ?? wert.unit,
            latest_date: latest?.date ?? null,
          };
        });

        const sortiert = [...erweitert]
          .filter((w) => zeigeAlle || w.latest_value !== null)
          .sort((a, b) => a.name.localeCompare(b.name)); // alphabetisch sortieren

        setAlleWerte(sortiert);
        if (sortiert.length > 0) {
          setAusgewählt(sortiert[0]);
        }
      })
      .catch(console.error);
  }, [token, zeigeAlle]);
  // Setze Standard-Einheit bei Auswahl eines Wertes
  useEffect(() => {
    if (ausgewählt) {
      setEinheit(ausgewählt.latest_unit || ausgewählt.unit);
    }
  }, [ausgewählt]);
  // Filterung & Sortierung
  const gefiltert = zeigeAlle
    ? alleWerte
    : alleWerte.filter((w) => w.latest_value !== null);

  const sortiert = [...gefiltert].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="werte-layout">
      <div className="werte-list">
        <h2>Blutwerte</h2>
        <div className="werte-tabs">
          <button
            onClick={() => setZeigeAlle(false)}
            className={!zeigeAlle ? "active" : ""}
          >
            Gemessene Werte
          </button>
          <button
            onClick={() => setZeigeAlle(true)}
            className={zeigeAlle ? "active" : ""}
          >
            Alle Werte
          </button>
        </div>
        <ul>
          {sortiert.map((w) => (
            <li
              key={w.id}
              className={ausgewählt?.id === w.id ? "selected" : ""}
              onClick={() => setAusgewählt(w)}
            >
              <strong>{w.name}</strong>
              {w.latest_value !== null && (
                <span className="wert-info">
                  {w.latest_value} {w.latest_unit}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Detailansicht zum ausgewählten Wert */}
      <div className="werte-details">
        {ausgewählt ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>{ausgewählt.name}</h2>
              {ausgewählt && (
                <div style={{ width: 180 }}>
                  <Select
                    options={Array.from(
                      new Set([
                        ausgewählt.unit,
                        ...Object.keys(ausgewählt.conversion_factors || {}),
                      ])
                    ).map((e) => ({ value: e, label: e }))}
                    value={{ value: einheit, label: einheit }}
                    onChange={(option) =>
                      setEinheit(option?.value || ausgewählt.unit)
                    }
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Einheit"
                  />
                </div>
              )}
            </div>

            <p className="wert-info-text">{ausgewählt.info}</p>

            <p>
              <strong>Referenzbereich:</strong>{" "}
              {umrechnen(
                ausgewählt.reference_min,
                ausgewählt.unit,
                einheit!,
                ausgewählt.conversion_factors
              )}
              –
              {umrechnen(
                ausgewählt.reference_max,
                ausgewählt.unit,
                einheit!,
                ausgewählt.conversion_factors
              )}{" "}
              {einheit}
            </p>

            {ausgewählt.values.length > 0 ? (
              <>
                <h3>Messverlauf</h3>
                <table className="werte-tabelle">
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Messwert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ausgewählt.values.map((v, i) => (
                      <tr key={i}>
                        <td>{v.formattedDate}</td>
                        <td>
                          {formatZahl(
                            umrechnen(
                              v.measured_value,
                              v.unit,
                              einheit!,
                              ausgewählt.conversion_factors
                            )
                          )}{" "}
                          {einheit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Liniendiagramm */}
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={ausgewählt.values.map((v) => ({
                        ...v,
                        yValue: umrechnen(
                          v.measured_value,
                          v.unit,
                          einheit!,
                          ausgewählt.conversion_factors
                        ),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="formattedDate"
                        interval={0}
                        padding={{ right: 40 }}
                        minTickGap={10}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(val: number) => [
                          `${val} ${einheit}`,
                          "Wert",
                        ]}
                        labelFormatter={(label: string) => `Datum: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="yValue"
                        stroke="rgba(190, 46, 44, 1)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p>
                <em>Für diesen Wert liegt noch keine Messung vor.</em>
              </p>
            )}
          </>
        ) : (
          <p>Bitte wähle einen Wert aus der Liste.</p>
        )}
      </div>
    </main>
  );
}
