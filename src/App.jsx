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
  return (
    <div>
      <h2 className="title">📊 Progreso</h2>
      <p>Próximamente: gráficos, PRs y evolución 🍑</p>
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