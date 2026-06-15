import { useState } from "react";
import "./App.css";

const routines = {
  "Lunes": [
    "Hip Thrust",
    "Prensa",
    "Patada glúteo",
    "Aductores",
    "Abductores"
  ],
  "Martes": [
    "Jalón",
    "Remo",
    "Face Pull",
    "Bíceps",
    "Tríceps",
    "Abs"
  ],
  "Jueves": [
    "Hip Thrust ligero",
    "Patada izquierda",
    "Abductores",
    "Puente glúteo"
  ],
  "Viernes": [
    "Hip Thrust",
    "Smith squat",
    "Prensa",
    "Aductores",
    "Abductores"
  ]
};

export default function App() {
  const [day, setDay] = useState("Lunes");

  return (
    <div className="container">

      <h1 className="header">🍑 SymmetryFit</h1>

      <div className="nav">
        {Object.keys(routines).map((d) => (
          <button key={d} onClick={() => setDay(d)} className="btn">
            {d}
          </button>
        ))}
      </div>

      <h2 className="day">{day}</h2>

      {routines[day].map((ex, i) => (
        <div key={i} className="card">
          <h3 className="exercise">{ex}</h3>

          <input
            placeholder="Peso"
            type="number"
            className="input"
          />

          <input
            placeholder="Reps"
            className="input"
          />
        </div>
      ))}

    </div>
  );
}