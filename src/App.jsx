import { useState } from "react";
import "./App.css";

/* =========================
   LOCAL STORAGE HELPERS
========================= */
const getWorkoutData = () => {
  const raw = localStorage.getItem("symmetryfit-data");
  return raw ? JSON.parse(raw) : {};
};

const calculatePRs = () => {
  const data = getWorkoutData();

  let prs = {
    hipThrust: 0,
    prensa: 0,
    smithSquat: 0
  };

  Object.values(data).forEach((day) => {
    Object.entries(day || {}).forEach(([exercise, values]) => {
      const weight = Number(values?.peso || 0);

      if (exercise.toLowerCase().includes("hip thrust")) {
        if (weight > prs.hipThrust) prs.hipThrust = weight;
      }

      if (exercise.toLowerCase().includes("prensa")) {
        if (weight > prs.prensa) prs.prensa = weight;
      }

      if (exercise.toLowerCase().includes("smith")) {
        if (weight > prs.smithSquat) prs.smithSquat = weight;
      }
    });
  });

  return prs;
};

/* =========================
   RUTINAS
========================= */
const routines = {
  Lunes: ["Hip Thrust", "Prensa", "Patada glúteo", "Aductores", "Abductores"],
  Martes: ["Jalón", "Remo", "Face Pull", "Bíceps", "Tríceps", "Abs"],
  Jueves: ["Hip Thrust ligero", "Patada izquierda", "Abductores", "Puente glúteo"],
  Viernes: ["Hip Thrust", "Smith squat", "Prensa", "Aductores", "Abductores"]
};

/* =========================
   ENTRENOS
========================= */
function Entrenos() {
  const [day, setDay] = useState("Lunes");
  const [data, setData] = useState({});

  const handleChange = (exercise, field, value) => {
    setData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exercise]: {
          ...prev[day]?.[exercise],
          [field]: value
        }
      }
    }));
  };

  const saveData = () => {
    localStorage.setItem("symmetryfit-data", JSON.stringify(data));
    alert("✔ Entreno guardado");
  };

  const clearData = () => {
    localStorage.removeItem("symmetryfit-data");
    setData({});
    alert("🗑 Datos eliminados");
  };

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

          <input
  placeholder="Peso"
  type="number"
  onChange={(e) => handleChange(ex, "peso", e.target.value)}
/>

{/* 🍑 GLÚTEO IZQ / DER SOLO PARA EJERCICIOS DE GLÚTEO */}
{ex.toLowerCase().includes("glúteo") && (
  <>
    <input
      placeholder="Izquierdo"
      type="number"
      onChange={(e) => handleChange(ex, "izq", e.target.value)}
    />

    <input
      placeholder="Derecho"
      type="number"
      onChange={(e) => handleChange(ex, "der", e.target.value)}
    />
  </>
)}
          <input
            placeholder="Reps"
            onChange={(e) => handleChange(ex, "reps", e.target.value)}
          />
        </div>
      ))}

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={saveData} className="dayBtn">💾 Guardar</button>
        <button onClick={clearData} className="dayBtn">🗑 Borrar</button>
      </div>
    </div>
  );
}

/* =========================
   PROGRESO (REAL)
========================= */
let totalLeft = 0;
let totalRight = 0;
let count = 0;
function Progreso() {
  const prs = calculatePRs();
  const data = getWorkoutData();

  const getGluteImbalance = () => {
    let left = 0;
    let right = 0;
    let count = 0;

    Object.values(data).forEach((day) => {
      Object.values(day || {}).forEach((ex) => {
       const left = Number(ex.izq || 0);
const right = Number(ex.der || 0);

if (left > 0 && right > 0) {
  totalLeft += left;
  totalRight += right;
  count++;
}
      });
    });

    if (count === 0) return null;

    return {
  left: totalLeft / count,
  right: totalRight / count,
  diff: Math.abs(totalLeft - totalRight) / count
};
  };

  const imbalance = getGluteImbalance();

  return (
    <div>
      <h2 className="title">📊 Progreso</h2>

      <div className="card">
        <h3>🏆 PRs</h3>
        <p>Hip Thrust: {prs.hipThrust} kg</p>
        <p>Prensa: {prs.prensa} kg</p>
        <p>Smith Squat: {prs.smithSquat} kg</p>
      </div>

      {imbalance && (
        <div className="card">
          <h3>🍑 Glúteo izq vs der</h3>
          <p>Izquierdo: {imbalance.left.toFixed(1)} kg</p>
          <p>Derecho: {imbalance.right.toFixed(1)} kg</p>
          <p>Diferencia: {imbalance.diff.toFixed(1)} kg</p>
        </div>
      )}
    </div>
  );
}

/* =========================
   AJUSTES
========================= */
function Ajustes() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("symmetryfit-profile");

    return saved
      ? JSON.parse(saved)
      : {
          weight: "",
          height: "",
          goal: "hipertrofia",
          level: "principiante"
        };
  });

  // 💾 auto-guardar cada cambio
  useEffect(() => {
    localStorage.setItem("symmetryfit-profile", JSON.stringify(profile));
  }, [profile]);

  return (
    <div>
      <h2 className="title">⚙️ Ajustes</h2>

      {/* 👤 PERFIL */}
      <div className="card">
        <h3>👤 Perfil</h3>

        <input
          placeholder="Peso (kg)"
          value={profile.weight}
          onChange={(e) =>
            setProfile({ ...profile, weight: e.target.value })
          }
        />

        <input
          placeholder="Altura (cm)"
          value={profile.height}
          onChange={(e) =>
            setProfile({ ...profile, height: e.target.value })
          }
        />

        <select
          value={profile.goal}
          onChange={(e) =>
            setProfile({ ...profile, goal: e.target.value })
          }
        >
          <option value="hipertrofia">Hipertrofia</option>
          <option value="fuerza">Fuerza</option>
          <option value="definicion">Definición</option>
        </select>

        <select
          value={profile.level}
          onChange={(e) =>
            setProfile({ ...profile, level: e.target.value })
          }
        >
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>
      </div>

      {/* 🧰 HERRAMIENTAS */}
      <div className="card">
        <h3>🧰 Herramientas</h3>

        <button
          onClick={() => {
            localStorage.clear();
            alert("🗑 Todo eliminado");
          }}
          className="dayBtn"
        >
          🗑 Borrar todo
        </button>

        <button
          onClick={() => {
            const data = {
              profile: JSON.parse(localStorage.getItem("symmetryfit-profile")),
              workouts: JSON.parse(localStorage.getItem("symmetryfit-data"))
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json"
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "symmetryfit-data.json";
            a.click();
          }}
          className="dayBtn"
        >
          📤 Exportar datos
        </button>
      </div>
    </div>
  );
}

  return (
    <div>
      <h2 className="title">⚙️ Ajustes</h2>

      <div className="card">
        <h3>👤 Perfil</h3>

        <input
          placeholder="Peso (kg)"
          value={profile.weight}
          onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
        />

        <input
          placeholder="Altura (cm)"
          value={profile.height}
          onChange={(e) => setProfile({ ...profile, height: e.target.value })}
        />

        <select
          value={profile.goal}
          onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
        >
          <option value="hipertrofia">Hipertrofia</option>
          <option value="fuerza">Fuerza</option>
          <option value="definicion">Definición</option>
        </select>

        <select
          value={profile.level}
          onChange={(e) => setProfile({ ...profile, level: e.target.value })}
        >
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>

        <button onClick={saveProfile} className="dayBtn">💾 Guardar perfil</button>
      </div>

      <div className="card">
        <h3>🧰 Herramientas</h3>

        <button onClick={clearAll} className="dayBtn">🗑 Borrar todo</button>
        <button onClick={exportData} className="dayBtn">📤 Exportar</button>
      </div>
    </div>
  );
}

/* =========================
   APP PRINCIPAL
========================= */
export default function App() {
  const [tab, setTab] = useState("dashboard");

  const prs = calculatePRs();
  const data = getWorkoutData();
  const totalSessions = Object.keys(data).length;

  const Dashboard = () => (
    <div>
      <h2 className="title">🏠 Dashboard</h2>

      <div className="card">
        <h3>📊 Resumen</h3>
        <p>Días registrados: {totalSessions}</p>
        <p>Hip Thrust PR: {prs.hipThrust} kg</p>
        <p>Prensa PR: {prs.prensa} kg</p>
        <p>Smith PR: {prs.smithSquat} kg</p>
      </div>
    </div>
  );

  let screen;
  if (tab === "dashboard") screen = <Dashboard />;
  if (tab === "entrenos") screen = <Entrenos />;
  if (tab === "progreso") screen = <Progreso />;
  if (tab === "ajustes") screen = <Ajustes />;

  return (
    <div className="app">
      <div className="content">{screen}</div>

      <div className="bottomNav">
        <button onClick={() => setTab("dashboard")}>🏠</button>
        <button onClick={() => setTab("entrenos")}>🏋️</button>
        <button onClick={() => setTab("progreso")}>📊</button>
        <button onClick={() => setTab("ajustes")}>⚙️</button>
      </div>
    </div>
  );
}