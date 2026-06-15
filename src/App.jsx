import { useState } from "react";
import "./App.css";

const routines = {
  "Lunes": ["Hip Thrust", "Prensa", "Patada glúteo", "Aductores", "Abductores"],
  "Martes": ["Jalón", "Remo", "Face Pull", "Bíceps", "Tríceps", "Abs"],
  "Jueves": ["Hip Thrust ligero", "Patada izquierda", "Abductores", "Puente glúteo"],
  "Viernes": ["Hip Thrust", "Smith squat", "Prensa", "Aductores", "Abductores"]
};

function Entrenos() {
  const [day, setDay] = useState("Lunes");

  return (
    <div>
      <h2 className="title">🏋️ Entrenos</h2>

      <div className="navDays">
        {Object.keys(routines).map((d) => (
          <button key={d} onClick={() => setDay(d)} className="dayBtn">
            {d}
          </button>
        ))}
      </div>

      <h3 className="day">{day}</h3>

      {routines[day].map((ex, i) => (
        <div key={i} className="card">
          <h4>{ex}</h4>

          <input placeholder="Peso" type="number" />
          <input placeholder="Reps" />
        </div>
      ))}
    </div>
  );
}

function Progreso() {
  // 🔥 PRs (luego los haremos dinámicos)
  const prs = {
    hipThrust: 75,
    prensa: 120,
    smithSquat: 60
  };

  // 📈 evolución simulada (luego será real desde tus entrenos)
  const evolution = [
    { week: "Semana 1", value: 60 },
    { week: "Semana 2", value: 65 },
    { week: "Semana 3", value: 70 },
    { week: "Semana 4", value: 75 }
  ];

  return (
    <div>
      <h2 className="title">📊 Progreso</h2>

      {/* 🏆 PRs */}
      <div className="card">
        <h3>🏆 PRs (máximos)</h3>

        <p>🍑 Hip Thrust: <b>{prs.hipThrust} kg</b></p>
        <p>🦵 Prensa: <b>{prs.prensa} kg</b></p>
        <p>🏋️ Smith Squat: <b>{prs.smithSquat} kg</b></p>
      </div>

      {/* 📈 EVOLUCIÓN */}
      <div className="card">
        <h3>📈 Evolución (Hip Thrust)</h3>

        {evolution.map((item, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{item.week}</strong>
              <span>{item.value} kg</span>
            </div>

            <div
              style={{
                height: 8,
                background: "#2a2a2a",
                borderRadius: 6,
                marginTop: 5
              }}
            >
              <div
                style={{
                  height: 8,
                  width: `${(item.value / 100) * 100}%`,
                  background: "#ff4d6d",
                  borderRadius: 6
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Ajustes() {
  return (
    <div>
      <h2 className="title">⚙️ Ajustes</h2>
      <p>Próximamente: configuración y datos personales</p>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("entrenos");

  let screen;
  if (tab === "entrenos") screen = <Entrenos />;
  if (tab === "progreso") screen = <Progreso />;
  if (tab === "ajustes") screen = <Ajustes />;

  return (
    <div className="app">
      <div className="content">{screen}</div>

      <div className="bottomNav">
        <button onClick={() => setTab("entrenos")}>🏋️</button>
        <button onClick={() => setTab("progreso")}>📊</button>
        <button onClick={() => setTab("ajustes")}>⚙️</button>
      </div>
    </div>
  );
}