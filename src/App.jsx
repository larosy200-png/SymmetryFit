import { useState } from "react";
import "./App.css";

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

const routines = {
  "Lunes": ["Hip Thrust", "Prensa", "Patada glúteo", "Aductores", "Abductores"],
  "Martes": ["Jalón", "Remo", "Face Pull", "Bíceps", "Tríceps", "Abs"],
  "Jueves": ["Hip Thrust ligero", "Patada izquierda", "Abductores", "Puente glúteo"],
  "Viernes": ["Hip Thrust", "Smith squat", "Prensa", "Aductores", "Abductores"]
};
function Entrenos() {
  const [day, setDay] = useState("Lunes");

  // 📦 estado para guardar datos
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

          <input
            placeholder="Reps"
            onChange={(e) => handleChange(ex, "reps", e.target.value)}
          />
        </div>
      ))}

      {/* BOTONES */}
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={saveData} className="dayBtn">
          💾 Guardar
        </button>

        <button onClick={clearData} className="dayBtn">
          🗑 Borrar
        </button>
      </div>
    </div>
  );
}

function Progreso() {
  // 🔥 PRs (luego los haremos dinámicos)
  const prs = calculatedPRs();{
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
  const [profile, setProfile] = useState({
    weight: "",
    height: "",
    goal: "hipertrofia",
    level: "principiante"
  });

  const saveProfile = () => {
    localStorage.setItem("symmetryfit-profile", JSON.stringify(profile));
    alert("✔ Perfil guardado");
  };

  const clearAll = () => {
    localStorage.removeItem("symmetryfit-profile");
    localStorage.removeItem("symmetryfit-data");
    alert("🗑 Todo eliminado");
  };

  const exportData = () => {
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
  };

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

        <button onClick={saveProfile} className="dayBtn">
          💾 Guardar perfil
        </button>
      </div>

      {/* 🧰 HERRAMIENTAS */}
      <div className="card">
        <h3>🧰 Herramientas</h3>

        <button onClick={clearAll} className="dayBtn">
          🗑 Borrar todo
        </button>

        <button onClick={exportData} className="dayBtn">
          📤 Exportar datos
        </button>
      </div>
    </div>
  );
}