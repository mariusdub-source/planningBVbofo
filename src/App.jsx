import React, { useMemo, useState } from 'react';

const SITE_PASSWORD = 'BV2026#';
const ADMIN_PASSWORD = 'Marius24#';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const EMPLOYEES = [
  'Salarié 01',
  'Salarié 02',
  'Salarié 03',
  'Salarié 04',
  'Salarié 05',
  'Salarié 06',
  'Salarié 07',
  'Salarié 08',
  'Salarié 09',
  'Salarié 10',
  'Salarié 11',
  'Salarié 12',
  'Salarié 13',
  'Salarié 14',
  'Salarié 15',
  'Salarié 16',
  'Salarié 17',
  'Salarié 18',
  'Salarié 19',
  'Salarié 20',
];

const GUICHETS = [
  '',
  'Sainte-Maxime',
  'St-Tropez Vieux Port',
  'Les Issambres',
  'Aquascope',
  'Port Grimaud Eglise',
  'Port Grimaud Capit',
  'Marines Cog',
  'Repos',
  'Congé',
  'Maladie',
];

const STORAGE_KEY = 'planning-maritime-7jours-visible-v1';

function createEmptyDay() {
  return {
    guichet: '',
    start: '',
    end: '',
    pause: '',
    note: '',
  };
}

function createEmptyWeek() {
  const data = {};
  EMPLOYEES.forEach((employee) => {
    data[employee] = {};
    DAYS.forEach((day) => {
      data[employee][day] = createEmptyDay();
    });
  });
  return data;
}

function loadPlanning() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createEmptyWeek();

    const parsed = JSON.parse(saved);
    const complete = createEmptyWeek();

    EMPLOYEES.forEach((employee) => {
      DAYS.forEach((day) => {
        const cell = parsed?.[employee]?.[day] || {};
        complete[employee][day] = {
          guichet: cell.guichet || '',
          start: cell.start || '',
          end: cell.end || '',
          pause: cell.pause || '',
          note: cell.note || '',
        };
      });
    });

    return complete;
  } catch {
    return createEmptyWeek();
  }
}

function timeToMinutes(value) {
  if (!value || !value.includes(':')) return null;
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function pauseToMinutes(value) {
  if (!value) return 0;

  if (value.includes(':')) {
    const [hours, minutes] = value.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
    return hours * 60 + minutes;
  }

  const normalized = String(value).replace(',', '.');
  const number = Number(normalized);
  if (Number.isNaN(number)) return 0;

  return Math.round(number * 60);
}

function minutesToHours(minutes) {
  if (!minutes || minutes <= 0) return '0h00';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${String(m).padStart(2, '0')}`;
}

function calculateDayTotal(cell) {
  const start = timeToMinutes(cell.start);
  const end = timeToMinutes(cell.end);
  const pause = pauseToMinutes(cell.pause);

  if (start === null || end === null) return 0;

  let duration = end - start;
  if (duration < 0) duration += 24 * 60;

  return Math.max(0, duration - pause);
}

function isAbsence(guichet) {
  return guichet === 'Repos' || guichet === 'Congé' || guichet === 'Maladie';
}

function formatGuichetTotals(totals) {
  const entries = Object.entries(totals).filter(([, count]) => count > 0);
  if (entries.length === 0) return 'Aucun guichet';
  return entries.map(([name, count]) => `${name}: ${count}`).join(' / ');
}

export default function App() {
  const [accessInput, setAccessInput] = useState('');
  const [accessGranted, setAccessGranted] = useState(() => sessionStorage.getItem('site-access') === 'true');
  const [accessError, setAccessError] = useState('');

  const [adminInput, setAdminInput] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminBox, setShowAdminBox] = useState(false);
  const [adminError, setAdminError] = useState('');

  const [page, setPage] = useState('planning');
  const [monthWeeks, setMonthWeeks] = useState(4);
  const [planning, setPlanning] = useState(loadPlanning);

  const weeklyTotals = useMemo(() => {
    return EMPLOYEES.map((employee) => {
      let totalMinutes = 0;
      let workedDays = 0;
      const guichetTotals = {};

      DAYS.forEach((day) => {
        const cell = planning[employee][day];
        const dayTotal = calculateDayTotal(cell);
        totalMinutes += dayTotal;

        if (cell.guichet && !isAbsence(cell.guichet)) {
          workedDays += 1;
          guichetTotals[cell.guichet] = (guichetTotals[cell.guichet] || 0) + 1;
        }
      });

      return {
        employee,
        totalMinutes,
        workedDays,
        guichetTotals,
      };
    });
  }, [planning]);

  const monthlyTotals = useMemo(() => {
    return weeklyTotals.map((row) => {
      const guichetTotals = {};
      Object.entries(row.guichetTotals).forEach(([guichet, count]) => {
        guichetTotals[guichet] = count * monthWeeks;
      });

      return {
        employee: row.employee,
        totalMinutes: row.totalMinutes * monthWeeks,
        workedDays: row.workedDays * monthWeeks,
        guichetTotals,
      };
    });
  }, [weeklyTotals, monthWeeks]);

  function savePlanning(nextPlanning) {
    setPlanning(nextPlanning);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlanning));
  }

  function updateCell(employee, day, field, value) {
    if (!adminMode) return;

    const nextPlanning = {
      ...planning,
      [employee]: {
        ...planning[employee],
        [day]: {
          ...planning[employee][day],
          [field]: value,
        },
      },
    };

    savePlanning(nextPlanning);
  }

  function handleAccessSubmit(event) {
    event.preventDefault();

    if (accessInput === SITE_PASSWORD) {
      sessionStorage.setItem('site-access', 'true');
      setAccessGranted(true);
      setAccessError('');
      return;
    }

    setAccessError('Mot de passe incorrect.');
  }

  function handleAdminSubmit(event) {
    event.preventDefault();

    if (adminInput === ADMIN_PASSWORD) {
      setAdminMode(true);
      setShowAdminBox(false);
      setAdminInput('');
      setAdminError('');
      return;
    }

    setAdminError('Mot de passe admin incorrect.');
  }

  function resetPlanning() {
    if (!adminMode) return;

    if (window.confirm('Réinitialiser tout le planning ?')) {
      savePlanning(createEmptyWeek());
    }
  }

  function exportCsv() {
    const rows = [
      ['Salarié', ...DAYS.flatMap((day) => [`${day} - Guichet`, `${day} - Début`, `${day} - Fin`, `${day} - Pause`, `${day} - Total`, `${day} - Note manuelle`])],
      ...EMPLOYEES.map((employee) => [
        employee,
        ...DAYS.flatMap((day) => {
          const cell = planning[employee][day];
          return [
            cell.guichet,
            cell.start,
            cell.end,
            cell.pause,
            minutesToHours(calculateDayTotal(cell)),
            cell.note,
          ];
        }),
      ]),
      [],
      ['TOTAL SEMAINE'],
      ['Salarié', 'Jours travaillés', 'Total heures', 'Détail guichet'],
      ...weeklyTotals.map((row) => [
        row.employee,
        row.workedDays,
        minutesToHours(row.totalMinutes),
        formatGuichetTotals(row.guichetTotals),
      ]),
      [],
      [`TOTAL MENSUEL (${monthWeeks} semaines)`],
      ['Salarié', 'Jours travaillés', 'Total heures', 'Détail guichet'],
      ...monthlyTotals.map((row) => [
        row.employee,
        row.workedDays,
        minutesToHours(row.totalMinutes),
        formatGuichetTotals(row.guichetTotals),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'planning-maritime-guichets.csv';
    link.click();

    URL.revokeObjectURL(url);
  }

  if (!accessGranted) {
    return (
      <main className="login-page">
        <form className="login-card" onSubmit={handleAccessSubmit}>
          <div className="brand-mark">⚓</div>
          <h1>Planning Maritime</h1>
          <p>Accès sécurisé au planning des guichets.</p>

          <input
            type="password"
            value={accessInput}
            onChange={(event) => setAccessInput(event.target.value)}
            placeholder="Mot de passe"
            autoFocus
          />

          {accessError && <div className="error">{accessError}</div>}

          <button type="submit">Accéder au planning</button>
        </form>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="title-zone">
          <div className="brand-mark small">⚓</div>
          <div>
            <h1>Planning Maritime</h1>
            <p>
              {adminMode
                ? 'Mode admin actif : modification autorisée.'
                : 'Lecture seule : activez le mode admin pour modifier.'}
            </p>
          </div>
        </div>

        <div className="top-actions">
          <button className={page === 'planning' ? 'active' : ''} onClick={() => setPage('planning')} type="button">
            Planning
          </button>
          <button className={page === 'week' ? 'active' : ''} onClick={() => setPage('week')} type="button">
            Total semaine
          </button>
          <button className={page === 'month' ? 'active' : ''} onClick={() => setPage('month')} type="button">
            Total mensuel
          </button>
          <button onClick={exportCsv} type="button">Export CSV</button>

          {adminMode ? (
            <button className="admin-on" onClick={() => setAdminMode(false)} type="button">
              Quitter admin
            </button>
          ) : (
            <button className="admin-button" onClick={() => setShowAdminBox(true)} type="button">
              Mode admin
            </button>
          )}
        </div>
      </header>

      {showAdminBox && !adminMode && (
        <section className="admin-panel">
          <form onSubmit={handleAdminSubmit}>
            <strong>Connexion admin</strong>
            <input
              type="password"
              value={adminInput}
              onChange={(event) => setAdminInput(event.target.value)}
              placeholder="Mot de passe admin"
              autoFocus
            />
            <button type="submit">Valider</button>
            <button type="button" onClick={() => setShowAdminBox(false)}>Annuler</button>
          </form>
          {adminError && <div className="error">{adminError}</div>}
        </section>
      )}

      {page === 'planning' && (
        <>
          <section className="toolbar">
            <span>{EMPLOYEES.length} salariés</span>
            <span>7 jours visibles sans curseur horizontal</span>
            <span>Guichet déroulant + saisie manuelle</span>
            <button disabled={!adminMode} onClick={resetPlanning} type="button">
              Réinitialiser
            </button>
          </section>

          <section className="planning-grid">
            <div className="grid-header employee-header">Salariés</div>
            {DAYS.map((day) => (
              <div className="grid-header day-header" key={day}>{day}</div>
            ))}

            {EMPLOYEES.map((employee) => (
              <React.Fragment key={employee}>
                <div className="employee-name">{employee}</div>

                {DAYS.map((day) => {
                  const cell = planning[employee][day];
                  const total = calculateDayTotal(cell);

                  return (
                    <div className="planning-cell" key={`${employee}-${day}`}>
                      <label>
                        <span>Guichet</span>
                        <select
                          value={cell.guichet}
                          onChange={(event) => updateCell(employee, day, 'guichet', event.target.value)}
                          disabled={!adminMode}
                        >
                          {GUICHETS.map((guichet) => (
                            <option key={guichet} value={guichet}>
                              {guichet || '—'}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="time-row">
                        <label>
                          <span>Début</span>
                          <input
                            type="time"
                            value={cell.start}
                            onChange={(event) => updateCell(employee, day, 'start', event.target.value)}
                            disabled={!adminMode}
                          />
                        </label>

                        <label>
                          <span>Fin</span>
                          <input
                            type="time"
                            value={cell.end}
                            onChange={(event) => updateCell(employee, day, 'end', event.target.value)}
                            disabled={!adminMode}
                          />
                        </label>
                      </div>

                      <label>
                        <span>Pause</span>
                        <input
                          type="text"
                          value={cell.pause}
                          onChange={(event) => updateCell(employee, day, 'pause', event.target.value)}
                          disabled={!adminMode}
                          placeholder="1 ou 01:00"
                        />
                      </label>

                      <label>
                        <span>Note</span>
                        <textarea
                          value={cell.note}
                          onChange={(event) => updateCell(employee, day, 'note', event.target.value)}
                          disabled={!adminMode}
                          placeholder="Saisie libre"
                        />
                      </label>

                      <div className="day-total">
                        <span>Total</span>
                        <strong>{minutesToHours(total)}</strong>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </section>
        </>
      )}

      {page === 'week' && (
        <section className="totals-page">
          <h2>Total semaine par personne</h2>
          <p>Calcul automatique des heures, jours travaillés et guichets attribués.</p>

          <div className="table-wrapper totals-wrapper">
            <table className="totals-table">
              <thead>
                <tr>
                  <th>Salarié</th>
                  <th>Jours travaillés</th>
                  <th>Total heures</th>
                  <th>Détail guichet</th>
                </tr>
              </thead>

              <tbody>
                {weeklyTotals.map((row) => (
                  <tr key={row.employee}>
                    <th>{row.employee}</th>
                    <td>{row.workedDays}</td>
                    <td>{minutesToHours(row.totalMinutes)}</td>
                    <td>{formatGuichetTotals(row.guichetTotals)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {page === 'month' && (
        <section className="totals-page">
          <div className="month-header">
            <div>
              <h2>Total mensuel par personne</h2>
              <p>Calcul estimé à partir de la semaine affichée.</p>
            </div>

            <label className="month-select">
              Nombre de semaines
              <select value={monthWeeks} onChange={(event) => setMonthWeeks(Number(event.target.value))}>
                <option value={4}>4 semaines</option>
                <option value={5}>5 semaines</option>
              </select>
            </label>
          </div>

          <div className="table-wrapper totals-wrapper">
            <table className="totals-table">
              <thead>
                <tr>
                  <th>Salarié</th>
                  <th>Jours travaillés</th>
                  <th>Total heures</th>
                  <th>Détail guichet</th>
                </tr>
              </thead>

              <tbody>
                {monthlyTotals.map((row) => (
                  <tr key={row.employee}>
                    <th>{row.employee}</th>
                    <td>{row.workedDays}</td>
                    <td>{minutesToHours(row.totalMinutes)}</td>
                    <td>{formatGuichetTotals(row.guichetTotals)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
