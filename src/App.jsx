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
  const data = [
    { week: "Semana 1", hipThrust: 60 },
    { week: "Semana 2", hipThrust: 65 },
    { week: "Semana 3", hipThrust: 70 },
    { week: "Semana 4", hipThrust: 75 }
  ];

  return (
    <div>
      <h2 className="title">📊 Progreso</h2>

      {/* PRs */}
      <div className="card">
        <h3>🏆 PRs principales</h3>
        <p>Hip Thrust: 75 kg</p>
        <p>Prensa: 120 kg</p>
        <p>Smith squat: 60 kg</p>
      </div>

      {/* EVOLUCIÓN */}
      <div className="card">
        <h3>📈 Evolución Hip Thrust</h3>

        <div style={{ marginTop: 10 }}>
          {data.map((item, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>{item.week}</strong>
              <div
                style={{
                  background: "#2a2a2a",
                  borderRadius: 6,
                  height: 10,
                  marginTop: 4
                }}
              >
                <div
                  style={{
                    width: `${item.hipThrust * 1.2}px`,
                    height: 10,
                    background: "#ff4d6d",
                    borderRadius: 6
                  }}
                />
              </div>
              <small>{item.hipThrust} kg</small>
            </div>
          ))}
        </div>
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