import { useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEYS = {
  workouts: "symmetryfit-data",
  profile: "symmetryfit-profile"
};

const initialProfile = {
  weight: "",
  height: "",
  goal: "hipertrofia",
  level: "principiante"
};

const routines = {
  Lunes: [
    { name: "Hip Thrust", focus: "Gluteo", detail: "Fuerza principal" },
    { name: "Prensa", focus: "Pierna", detail: "Volumen controlado" },
    { name: "Patada gluteo", focus: "Gluteo", detail: "Conexion mente-musculo" },
    { name: "Aductores", focus: "Pierna", detail: "Estabilidad" },
    { name: "Abductores", focus: "Gluteo", detail: "Activacion lateral" }
  ],
  Martes: [
    { name: "Jalon", focus: "Espalda", detail: "Tirones" },
    { name: "Remo", focus: "Espalda", detail: "Densidad" },
    { name: "Face Pull", focus: "Hombro", detail: "Postura" },
    { name: "Biceps", focus: "Brazos", detail: "Accesorio" },
    { name: "Triceps", focus: "Brazos", detail: "Accesorio" },
    { name: "Abs", focus: "Core", detail: "Control" }
  ],
  Jueves: [
    { name: "Hip Thrust ligero", focus: "Gluteo", detail: "Tecnica y bombeo" },
    { name: "Patada izquierda", focus: "Gluteo izquierdo", detail: "Trabajo unilateral" },
    { name: "Patada derecha", focus: "Gluteo derecho", detail: "Trabajo unilateral" },
    { name: "Abductores", focus: "Gluteo", detail: "Lateral" },
    { name: "Puente gluteo", focus: "Gluteo", detail: "Finalizador" }
  ],
  Viernes: [
    { name: "Hip Thrust", focus: "Gluteo", detail: "Carga alta" },
    { name: "Smith squat", focus: "Pierna", detail: "Fuerza" },
    { name: "Prensa", focus: "Pierna", detail: "Volumen" },
    { name: "Aductores", focus: "Pierna", detail: "Estabilidad" },
    { name: "Abductores", focus: "Gluteo", detail: "Activacion lateral" }
  ]
};

const dayMeta = {
  Lunes: "Glúteo fuerte",
  Martes: "Tren superior y core",
  Jueves: "Glúteo correctivo",
  Viernes: "Pierna completa"
};

const tabs = [
  { id: "entrenos", label: "Entrenos", icon: "W" },
  { id: "progreso", label: "Progreso", icon: "P" },
  { id: "ajustes", label: "Ajustes", icon: "A" }
];

const readStoredJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const toNumber = (value) => Number(value || 0);

const isEntryFilled = (entry = {}) =>
  Boolean(entry.peso || entry.reps || entry.series || entry.rpe || entry.notes);

const getCompletion = (workouts, day) => {
  const exercises = routines[day];
  const completed = exercises.filter((exercise) =>
    isEntryFilled(workouts?.[day]?.[exercise.name])
  ).length;

  return Math.round((completed / exercises.length) * 100);
};

const calculatePRs = (workouts) => {
  const prs = {
    hipThrust: 0,
    prensa: 0,
    smithSquat: 0
  };

  Object.values(workouts || {}).forEach((day) => {
    Object.entries(day || {}).forEach(([exercise, values]) => {
      const weight = toNumber(values?.peso);
      const normalized = exercise.toLowerCase();

      if (normalized.includes("hip thrust")) {
        prs.hipThrust = Math.max(prs.hipThrust, weight);
      }

      if (normalized.includes("prensa")) {
        prs.prensa = Math.max(prs.prensa, weight);
      }

      if (normalized.includes("smith")) {
        prs.smithSquat = Math.max(prs.smithSquat, weight);
      }
    });
  });

  return prs;
};

const calculateStats = (workouts) => {
  let exercisesLogged = 0;
  let totalVolume = 0;
  let activeDays = 0;

  Object.values(workouts || {}).forEach((day) => {
    const entries = Object.values(day || {}).filter(isEntryFilled);

    if (entries.length > 0) {
      activeDays += 1;
    }

    entries.forEach((entry) => {
      exercisesLogged += 1;
      totalVolume += toNumber(entry.peso) * toNumber(entry.reps) * toNumber(entry.series || 1);
    });
  });

  return {
    activeDays,
    exercisesLogged,
    totalVolume
  };
};

const buildEvolution = (workouts, exerciseName) =>
  Object.entries(workouts || {})
    .map(([day, exercises]) => {
      const match = Object.entries(exercises || {}).find(([name]) =>
        name.toLowerCase().includes(exerciseName)
      );

      return match ? { label: day, value: toNumber(match[1]?.peso) } : null;
    })
    .filter(Boolean);

const calculateGluteBalance = (workouts) => {
  let left = 0;
  let right = 0;

  Object.values(workouts || {}).forEach((day) => {
    Object.entries(day || {}).forEach(([exercise, values]) => {
      const normalized = exercise.toLowerCase();

      if (normalized.includes("izquierda")) {
        left = Math.max(left, toNumber(values?.peso));
      }

      if (normalized.includes("derecha")) {
        right = Math.max(right, toNumber(values?.peso));
      }
    });
  });

  if (!left && !right) {
    return { left, right, diff: 0, status: "Pendiente" };
  }

  const max = Math.max(left, right);
  const diff = max ? Math.round((Math.abs(left - right) / max) * 100) : 0;
  const status = diff >= 12 ? "Revisar asimetria" : "Equilibrada";

  return { left, right, diff, status };
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);

function MetricCard({ label, value, caption }) {
  return (
    <article className="metricCard">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </article>
  );
}

function ProgressBar({ label, value, max }) {
  const width = max ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="progressRow">
      <div className="progressCopy">
        <strong>{label}</strong>
        <span>{value} kg</span>
      </div>
      <div className="progressTrack" aria-hidden="true">
        <div className="progressFill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Entrenos({ workouts, setWorkouts, saveWorkouts, clearWorkouts }) {
  const [day, setDay] = useState("Lunes");
  const completion = getCompletion(workouts, day);

  const handleChange = (exercise, field, value) => {
    setWorkouts((prev) => ({
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

  return (
    <div className="screen">
      <section className="planCard">
        <div className="planMark" aria-hidden="true">
          SF
        </div>
        <div>
          <span className="eyebrow">Plan actual</span>
          <h2>{dayMeta[day]}</h2>
          <p>{routines[day].length} ejercicios programados</p>
        </div>
        <div
          className="completionBadge"
          style={{ "--progress": `${completion}%` }}
          aria-label={`${completion}% completado`}
        >
          {completion}%
        </div>
      </section>

      <div className="daySelector" aria-label="Seleccionar dia">
        {Object.keys(routines).map((routineDay) => (
          <button
            type="button"
            key={routineDay}
            onClick={() => setDay(routineDay)}
            className={routineDay === day ? "dayPill active" : "dayPill"}
          >
            {routineDay}
          </button>
        ))}
      </div>

      <div className="sectionHeader">
        <div>
          <span className="eyebrow">Entreno</span>
          <h1>{day}</h1>
        </div>
        <span className="sessionTag">Gym · 50 min</span>
      </div>

      <div className="exerciseList">
        {routines[day].map((exercise) => {
          const entry = workouts?.[day]?.[exercise.name] || {};

          return (
            <article key={exercise.name} className="exerciseCard">
              <div className="exerciseHeader">
                <div>
                  <span className="exerciseFocus">{exercise.focus}</span>
                  <h3>{exercise.name}</h3>
                  <p>{exercise.detail}</p>
                </div>
                <span className="exerciseStatus">
                  {isEntryFilled(entry) ? "Hecho" : "Plan"}
                </span>
              </div>

              <div className="inputGrid">
                <label>
                  Peso
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="kg"
                    value={entry.peso || ""}
                    onChange={(event) =>
                      handleChange(exercise.name, "peso", event.target.value)
                    }
                  />
                </label>

                <label>
                  Series
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={entry.series || ""}
                    onChange={(event) =>
                      handleChange(exercise.name, "series", event.target.value)
                    }
                  />
                </label>

                <label>
                  Reps
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={entry.reps || ""}
                    onChange={(event) =>
                      handleChange(exercise.name, "reps", event.target.value)
                    }
                  />
                </label>

                <label>
                  RPE
                  <input
                    type="number"
                    inputMode="decimal"
                    min="1"
                    max="10"
                    step="0.5"
                    placeholder="1-10"
                    value={entry.rpe || ""}
                    onChange={(event) =>
                      handleChange(exercise.name, "rpe", event.target.value)
                    }
                  />
                </label>
              </div>

              <label className="notesField">
                Notas
                <textarea
                  rows="2"
                  placeholder="Sensaciones, tecnica, molestias..."
                  value={entry.notes || ""}
                  onChange={(event) =>
                    handleChange(exercise.name, "notes", event.target.value)
                  }
                />
              </label>
            </article>
          );
        })}
      </div>

      <div className="bottomActions">
        <button type="button" onClick={saveWorkouts} className="primaryAction">
          Guardar entreno
        </button>
        <button type="button" onClick={clearWorkouts} className="ghostAction">
          Borrar
        </button>
      </div>
    </div>
  );
}

function Progreso({ workouts }) {
  const prs = useMemo(() => calculatePRs(workouts), [workouts]);
  const stats = useMemo(() => calculateStats(workouts), [workouts]);
  const evolution = useMemo(() => buildEvolution(workouts, "hip thrust"), [workouts]);
  const balance = useMemo(() => calculateGluteBalance(workouts), [workouts]);
  const maxEvolution = Math.max(...evolution.map((item) => item.value), 0);

  return (
    <div className="screen">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Progreso</h1>
        </div>
        <span className="sessionTag">{stats.activeDays} dias activos</span>
      </div>

      <div className="metricGrid">
        <MetricCard label="Volumen" value={`${stats.totalVolume} kg`} caption="carga total" />
        <MetricCard label="Ejercicios" value={stats.exercisesLogged} caption="registrados" />
      </div>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Records personales</span>
            <h2>PRs principales</h2>
          </div>
        </div>

        <div className="recordList">
          <MetricCard label="Hip Thrust" value={`${prs.hipThrust} kg`} caption="mejor carga" />
          <MetricCard label="Prensa" value={`${prs.prensa} kg`} caption="mejor carga" />
          <MetricCard label="Smith Squat" value={`${prs.smithSquat} kg`} caption="mejor carga" />
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Evolucion</span>
            <h2>Hip Thrust</h2>
          </div>
        </div>

        {evolution.length ? (
          evolution.map((item) => (
            <ProgressBar
              key={item.label}
              label={item.label}
              value={item.value}
              max={maxEvolution}
            />
          ))
        ) : (
          <div className="emptyState">Sin registros guardados todavia.</div>
        )}
      </section>

      <section className="panel accentPanel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Gluteo</span>
            <h2>Simetria izquierda/derecha</h2>
          </div>
          <span className="balanceStatus">{balance.status}</span>
        </div>

        <div className="balanceGrid">
          <MetricCard label="Izquierdo" value={`${balance.left} kg`} caption="mejor carga" />
          <MetricCard label="Derecho" value={`${balance.right} kg`} caption="mejor carga" />
          <MetricCard label="Diferencia" value={`${balance.diff}%`} caption="asimetria" />
        </div>
      </section>
    </div>
  );
}

function Ajustes({ profile, setProfile, saveProfile, clearAll, exportData, exportReport }) {
  return (
    <div className="screen">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">Cuenta</span>
          <h1>Ajustes</h1>
        </div>
      </div>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Perfil</span>
            <h2>Datos personales</h2>
          </div>
        </div>

        <div className="settingsGrid">
          <label>
            Peso
            <input
              type="number"
              inputMode="decimal"
              placeholder="kg"
              value={profile.weight}
              onChange={(event) =>
                setProfile({ ...profile, weight: event.target.value })
              }
            />
          </label>

          <label>
            Altura
            <input
              type="number"
              inputMode="numeric"
              placeholder="cm"
              value={profile.height}
              onChange={(event) =>
                setProfile({ ...profile, height: event.target.value })
              }
            />
          </label>

          <label>
            Objetivo
            <select
              value={profile.goal}
              onChange={(event) =>
                setProfile({ ...profile, goal: event.target.value })
              }
            >
              <option value="hipertrofia">Hipertrofia</option>
              <option value="fuerza">Fuerza</option>
              <option value="definicion">Definicion</option>
            </select>
          </label>

          <label>
            Nivel
            <select
              value={profile.level}
              onChange={(event) =>
                setProfile({ ...profile, level: event.target.value })
              }
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </label>
        </div>

        <button type="button" onClick={saveProfile} className="primaryAction fullWidth">
          Guardar perfil
        </button>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Datos</span>
            <h2>Herramientas</h2>
          </div>
        </div>

        <div className="toolActions">
          <button type="button" onClick={exportReport} className="primaryAction">
            Informe PDF
          </button>
          <button type="button" onClick={exportData} className="secondaryAction">
            Exportar JSON
          </button>
          <button type="button" onClick={clearAll} className="dangerAction">
            Borrar todo
          </button>
        </div>
      </section>
    </div>
  );
}

function ReportScreen({ profile, workouts, onClose }) {
  const prs = useMemo(() => calculatePRs(workouts), [workouts]);
  const stats = useMemo(() => calculateStats(workouts), [workouts]);
  const balance = useMemo(() => calculateGluteBalance(workouts), [workouts]);
  const generatedAt = useMemo(() => formatDate(new Date()), []);
  const loggedDays = Object.entries(workouts || {}).filter(([, exercises]) =>
    Object.values(exercises || {}).some(isEntryFilled)
  );

  return (
    <main className="reportPage">
      <div className="reportActions">
        <button type="button" onClick={onClose} className="ghostAction">
          Volver
        </button>
        <button type="button" onClick={() => window.print()} className="primaryAction">
          Guardar como PDF
        </button>
      </div>

      <section className="reportHeader">
        <div>
          <span className="eyebrow">Informe de entrenamiento</span>
          <h1>SymmetryFit</h1>
        </div>
        <p>{generatedAt}</p>
      </section>

      <section className="reportSection">
        <h2>Perfil</h2>
        <div className="reportGrid">
          <MetricCard label="Peso" value={`${profile.weight || "-"} kg`} caption="actual" />
          <MetricCard label="Altura" value={`${profile.height || "-"} cm`} caption="actual" />
          <MetricCard label="Objetivo" value={profile.goal || "-"} caption={profile.level || "-"} />
        </div>
      </section>

      <section className="reportSection">
        <h2>Resumen</h2>
        <div className="reportGrid">
          <MetricCard label="Volumen" value={`${stats.totalVolume} kg`} caption="carga total" />
          <MetricCard label="Ejercicios" value={stats.exercisesLogged} caption="registrados" />
          <MetricCard label="Dias" value={stats.activeDays} caption="con datos" />
        </div>
      </section>

      <section className="reportSection">
        <h2>Records</h2>
        <div className="reportGrid">
          <MetricCard label="Hip Thrust" value={`${prs.hipThrust} kg`} caption="mejor carga" />
          <MetricCard label="Prensa" value={`${prs.prensa} kg`} caption="mejor carga" />
          <MetricCard label="Smith Squat" value={`${prs.smithSquat} kg`} caption="mejor carga" />
        </div>
      </section>

      <section className="reportSection">
        <h2>Simetria gluteo</h2>
        <div className="reportGrid">
          <MetricCard label="Izquierdo" value={`${balance.left} kg`} caption="mejor carga" />
          <MetricCard label="Derecho" value={`${balance.right} kg`} caption="mejor carga" />
          <MetricCard label="Diferencia" value={`${balance.diff}%`} caption={balance.status} />
        </div>
      </section>

      <section className="reportSection">
        <h2>Entrenos guardados</h2>

        {loggedDays.length ? (
          loggedDays.map(([day, exercises]) => (
            <div key={day} className="reportTableBlock">
              <h3>{day}</h3>
              <div className="reportTableWrap">
                <table className="reportTable">
                  <thead>
                    <tr>
                      <th>Ejercicio</th>
                      <th>Peso</th>
                      <th>Series</th>
                      <th>Reps</th>
                      <th>RPE</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(exercises || {})
                      .filter(([, values]) => isEntryFilled(values))
                      .map(([exercise, values]) => (
                        <tr key={exercise}>
                          <td>{exercise}</td>
                          <td>{values.peso || "-"}</td>
                          <td>{values.series || "-"}</td>
                          <td>{values.reps || "-"}</td>
                          <td>{values.rpe || "-"}</td>
                          <td>{values.notes || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="emptyState">No hay entrenos guardados todavia.</div>
        )}
      </section>
    </main>
  );
}

export default function App() {
  const [tab, setTab] = useState("entrenos");
  const [reportOpen, setReportOpen] = useState(false);
  const [workouts, setWorkouts] = useState(() =>
    readStoredJson(STORAGE_KEYS.workouts, {})
  );
  const [profile, setProfile] = useState(() => ({
    ...initialProfile,
    ...readStoredJson(STORAGE_KEYS.profile, {})
  }));

  const saveWorkouts = () => {
    localStorage.setItem(STORAGE_KEYS.workouts, JSON.stringify(workouts));
    window.alert("Entreno guardado");
  };

  const clearWorkouts = () => {
    if (!window.confirm("Quieres borrar los entrenos guardados?")) return;

    localStorage.removeItem(STORAGE_KEYS.workouts);
    setWorkouts({});
  };

  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    window.alert("Perfil guardado");
  };

  const clearAll = () => {
    if (!window.confirm("Quieres borrar perfil y entrenos?")) return;

    localStorage.removeItem(STORAGE_KEYS.profile);
    localStorage.removeItem(STORAGE_KEYS.workouts);
    setProfile(initialProfile);
    setWorkouts({});
  };

  const exportData = () => {
    const data = {
      profile,
      workouts,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "symmetryfit-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportReport = () => setReportOpen(true);

  const screen = {
    entrenos: (
      <Entrenos
        workouts={workouts}
        setWorkouts={setWorkouts}
        saveWorkouts={saveWorkouts}
        clearWorkouts={clearWorkouts}
      />
    ),
    progreso: <Progreso workouts={workouts} />,
    ajustes: (
      <Ajustes
        profile={profile}
        setProfile={setProfile}
        saveProfile={saveProfile}
        clearAll={clearAll}
        exportData={exportData}
        exportReport={exportReport}
      />
    )
  }[tab];

  if (reportOpen) {
    return (
      <div className="appShell reportShell">
        <ReportScreen
          profile={profile}
          workouts={workouts}
          onClose={() => setReportOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="appShell">
      <header className="appHeader">
        <button
          type="button"
          className="iconButton"
          onClick={() => setTab("ajustes")}
          aria-label="Abrir ajustes"
        >
          SF
        </button>
        <div className="brandBlock">
          <span>SymmetryFit</span>
          <strong>{tabs.find((item) => item.id === tab)?.label}</strong>
        </div>
        <button
          type="button"
          className="iconButton muted"
          onClick={() => setTab("progreso")}
          aria-label="Abrir progreso"
        >
          PR
        </button>
      </header>

      <main className="appContent">{screen}</main>

      <nav className="bottomNav" aria-label="Navegacion principal">
        {tabs.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setTab(item.id)}
            className={tab === item.id ? "navItem active" : "navItem"}
            aria-current={tab === item.id ? "page" : undefined}
          >
            <span className="navIcon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
