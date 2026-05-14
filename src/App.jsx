import React, { useMemo, useState } from 'react';

const SITE_PASSWORD = 'BV2026#';
const ADMIN_PASSWORD = 'Marius24#';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const EMPLOYEES = [
  'Salarié 01', 'Salarié 02', 'Salarié 03', 'Salarié 04', 'Salarié 05',
  'Salarié 06', 'Salarié 07', 'Salarié 08', 'Salarié 09', 'Salarié 10',
  'Salarié 11', 'Salarié 12', 'Salarié 13', 'Salarié 14', 'Salarié 15',
  'Salarié 16', 'Salarié 17', 'Salarié 18', 'Salarié 19', 'Salarié 20',
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

const SCHEDULE_PRESETS = [
  { label: '', title: '', start: '', end: '', pause: '', total: '' },
  { label: 'Bureau 2 — 9h00-13h00 / 14h00-17h30 — 7,5', title: 'Bureau 2', start: '09:00', end: '17:30', pause: '01:00', total: '7,5' },
  { label: 'Bureau — 8h30-13h00 / 13h30-17h00 — 8,00', title: 'Bureau', start: '08:30', end: '17:00', pause: '00:30', total: '8,00' },
  { label: 'Bureau 1 — 7h00-12h00 / 12h30-15h30 — 8', title: 'Bureau 1', start: '07:00', end: '15:30', pause: '00:30', total: '8' },
  { label: 'Ouv Bureau — 7h30-12h00 / 12h30-16h00 — 8,00', title: 'Ouv Bureau', start: '07:30', end: '16:00', pause: '00:30', total: '8,00' },
  { label: 'Bureau 3 — 11h30-14h00 / 15h00-20h30 — 8', title: 'Bureau 3', start: '11:30', end: '20:30', pause: '01:00', total: '8' },
  { label: 'Repos', title: 'repos', start: '', end: '', pause: '', total: '0' },
  { label: 'Max Renfort — 8h00-12h00 / 13h00-16h00 — 7', title: 'Max Renfort', start: '08:00', end: '16:00', pause: '01:00', total: '7' },
  { label: 'Bureau — 10h00-13h00 / 14h00-19h00 — 8,00', title: 'Bureau 10-19', start: '10:00', end: '19:00', pause: '01:00', total: '8,00' },
  { label: 'Renfort PG C — 8h00-14h00 — 6', title: 'Renfort PG C', start: '08:00', end: '14:00', pause: '00:00', total: '6' },
  { label: 'Renfort Max — 8h00-13h00 — 5,00', title: 'Renfort Max', start: '08:00', end: '13:00', pause: '00:00', total: '5,00' },
  { label: 'Max Ouv — 7h00-11h30 / 12h00-14h30 — 7', title: 'Max Ouv', start: '07:00', end: '14:30', pause: '00:30', total: '7' },
  { label: 'Max Ferm — 13h30-15h00 / 15h45-21h15 — 7,00', title: 'Max Ferm', start: '13:30', end: '21:15', pause: '00:45', total: '7,00' },
  { label: 'PG C Marché — 8h00-13h00 / 14h00-15h15 — 6,25', title: 'PG C Marché', start: '08:00', end: '15:15', pause: '01:00', total: '6,25' },
  { label: 'Renfort Iss — 8h00-13h30 — 5,5', title: 'Renfort Iss', start: '08:00', end: '13:30', pause: '00:00', total: '5,5' },
  { label: 'Issambres — 8h00-12h00 / 13h45-17h00 — 7,25', title: 'Issambres', start: '08:00', end: '17:00', pause: '01:45', total: '7,25' },
  { label: 'PG Ég Jour — 8h00-14h00 — 6', title: 'PG Ég Jour', start: '08:00', end: '14:00', pause: '00:00', total: '6' },
  { label: 'PG Église — 8h00-12h35 / 13h20-17h30 — 8,75', title: 'PG Église', start: '08:00', end: '17:30', pause: '00:45', total: '8,75' },
  { label: 'Renfort PG C — 8h00-13h30 — 5,50', title: 'Renfort PG C 13h30', start: '08:00', end: '13:30', pause: '00:00', total: '5,50' },
  { label: 'Marines — 8h00-14h00 — 6,00', title: 'Marines', start: '08:00', end: '14:00', pause: '00:00', total: '6,00' },
  { label: 'Trop Soir — 16h00-20h00 / 20h20-23h15 — 6,92', title: 'Trop Soir', start: '16:00', end: '23:15', pause: '00:20', total: '6,92' },
  { label: 'Trop Matin — 9h45-15h45 — 6,00', title: 'Trop Matin', start: '09:45', end: '15:45', pause: '00:00', total: '6,00' },
  { label: 'Trop Apm — 15h20-20h20 — 5,00', title: 'Trop Apm', start: '15:20', end: '20:20', pause: '00:00', total: '5,00' },
  { label: 'Aqua — 8h30-12h00 / 13h30-17h00 — 7', title: 'Aqua', start: '08:30', end: '17:00', pause: '01:30', total: '7' },
  { label: 'Max Journée — 9h00-13h00 / 14h30-18h00 — 7,50', title: 'Max Journée', start: '09:00', end: '18:00', pause: '01:30', total: '7,50' },
  { label: 'Max Apm — 14h30-17h00 / 18h00-22h30 — 7', title: 'Max Apm', start: '14:30', end: '22:30', pause: '01:00', total: '7' },
  { label: 'Aqua — 9h45-12h00 / 13h30-17h15 — 6,00', title: 'Aqua 9h45', start: '09:45', end: '17:15', pause: '01:30', total: '6,00' },
  { label: 'PG C Apm — 15h00-21h00 — 6', title: 'PG C Apm', start: '15:00', end: '21:00', pause: '00:00', total: '6' },
  { label: 'Max Ouv — 7h20-12h00 / 12h30-15h20 — 7,50', title: 'Max Ouv 7h20', start: '07:20', end: '15:20', pause: '00:30', total: '7,50' },
  { label: 'PG Ég Apm — 13h50-19h50 — 6', title: 'PG Ég Apm', start: '13:50', end: '19:50', pause: '00:00', total: '6' },
  { label: 'PG Capit — 8h00-12h45 / 13h30-17h00 — 8,25', title: 'PG Capit', start: '08:00', end: '17:00', pause: '00:45', total: '8,25' },
  { label: 'Trop Jour — 9h00-13h10 / 13h30-16h15 — 6,92', title: 'Trop Jour', start: '09:00', end: '16:15', pause: '00:20', total: '6,92' },
  { label: 'Max Ferm — 16h00-19h00 / 19h30-23h30 — 7', title: 'Max Ferm soir', start: '16:00', end: '23:30', pause: '00:30', total: '7' },
  { label: 'Max Journée — 9h00-14h30 / 16h00-18h00 — 7,5', title: 'Max Journée 9h14h30', start: '09:00', end: '18:00', pause: '01:30', total: '7,5' },
  { label: 'Bureau 1 — 7h30-12h00 / 12h30-15h00 — 7,00', title: 'Bureau 1 7h30', start: '07:30', end: '15:00', pause: '00:30', total: '7,00' },
  { label: 'Max Ouv Dim — 7h30-12h00 / 12h30-15h00 — 7,00', title: 'Max Ouv Dim', start: '07:30', end: '15:00', pause: '00:30', total: '7,00' },
];

const STORAGE_KEY = 'planning-maritime-horaires-total-semaine-v1';

function createEmptyDay() {
  return { guichet: '', schedule: '', start: '', end: '', pause: '', manualTotal: '', note: '' };
}

function createEmptyWeek() {
  const data = {};
  EMPLOYEES.forEach((employee) => {
    data[employee] = {};
    DAYS.forEach((day) => data[employee][day] = createEmptyDay());
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
          schedule: cell.schedule || '',
          start: cell.start || '',
          end: cell.end || '',
          pause: cell.pause || '',
          manualTotal: cell.manualTotal || '',
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
  const number = Number(String(value).replace(',', '.'));
  if (Number.isNaN(number)) return 0;
  return Math.round(number * 60);
}

function numberHoursToMinutes(value) {
  if (!value) return null;
  const number = Number(String(value).replace(',', '.'));
  if (Number.isNaN(number)) return null;
  return Math.round(number * 60);
}

function minutesToHours(minutes) {
  if (!minutes || minutes <= 0) return '0h00';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${String(m).padStart(2, '0')}`;
}

function minutesToDecimal(minutes) {
  if (!minutes || minutes <= 0) return '0,00';
  return (minutes / 60).toFixed(2).replace('.', ',');
}

function calculateDayTotal(cell) {
  const manual = numberHoursToMinutes(cell.manualTotal);
  if (manual !== null) return manual;

  const start = timeToMinutes(cell.start);
  const end = timeToMinutes(cell.end);
  const pause = pauseToMinutes(cell.pause);

  if (start === null || end === null) return 0;

  let duration = end - start;
  if (duration < 0) duration += 24 * 60;

  return Math.max(0, duration - pause);
}

function isAbsence(guichet, schedule) {
  return guichet === 'Repos' || guichet === 'Congé' || guichet === 'Maladie' || schedule === 'repos';
}

function formatGuichetTotals(totals) {
  const entries = Object.entries(totals).filter(([, count]) => count > 0);
  if (entries.length === 0) return 'Aucun guichet';
  return entries.map(([name, count]) => `${name}: ${count}`).join(' / ');
}

function getPresetByTitle(title) {
  return SCHEDULE_PRESETS.find((preset) => preset.title === title);
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

        if ((cell.guichet || cell.schedule) && !isAbsence(cell.guichet, cell.schedule)) {
          workedDays += 1;
          const label = cell.guichet || cell.schedule || 'Affectation';
          guichetTotals[label] = (guichetTotals[label] || 0) + 1;
        }
      });

      return { employee, totalMinutes, workedDays, guichetTotals };
    });
  }, [planning]);

  const monthlyTotals = useMemo(() => {
    return weeklyTotals.map((row) => {
      const guichetTotals = {};
      Object.entries(row.guichetTotals).forEach(([guichet, count]) => guichetTotals[guichet] = count * monthWeeks);
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
    savePlanning({
      ...planning,
      [employee]: {
        ...planning[employee],
        [day]: {
          ...planning[employee][day],
          [field]: value,
        },
      },
    });
  }

  function applySchedule(employee, day, title) {
    if (!adminMode) return;
    const preset = getPresetByTitle(title);
    const current = planning[employee][day];

    savePlanning({
      ...planning,
      [employee]: {
        ...planning[employee],
        [day]: {
          ...current,
          schedule: title,
          start: preset?.start || '',
          end: preset?.end || '',
          pause: preset?.pause || '',
          manualTotal: preset?.total || '',
          note: title === 'repos' ? 'repos' : current.note,
        },
      },
    });
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
    if (window.confirm('Réinitialiser tout le planning ?')) savePlanning(createEmptyWeek());
  }

  function exportCsv() {
    const rows = [
      ['Salarié', ...DAYS.flatMap((day) => [`${day} - Guichet`, `${day} - Horaire`, `${day} - Début`, `${day} - Fin`, `${day} - Pause`, `${day} - Total`, `${day} - Note`]), 'Total semaine'],
      ...EMPLOYEES.map((employee) => {
        const weekly = DAYS.reduce((sum, day) => sum + calculateDayTotal(planning[employee][day]), 0);
        return [
          employee,
          ...DAYS.flatMap((day) => {
            const cell = planning[employee][day];
            return [cell.guichet, cell.schedule, cell.start, cell.end, cell.pause, minutesToHours(calculateDayTotal(cell)), cell.note];
          }),
          minutesToHours(weekly),
        ];
      }),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'planning-maritime-horaires.csv';
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

          <input type="password" value={accessInput} onChange={(event) => setAccessInput(event.target.value)} placeholder="Mot de passe" autoFocus />
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
            <p>{adminMode ? 'Mode admin actif : modification autorisée.' : 'Lecture seule : activez le mode admin pour modifier.'}</p>
          </div>
        </div>

        <div className="top-actions">
          <button className={page === 'planning' ? 'active' : ''} onClick={() => setPage('planning')} type="button">Planning</button>
          <button className={page === 'week' ? 'active' : ''} onClick={() => setPage('week')} type="button">Total semaine</button>
          <button className={page === 'month' ? 'active' : ''} onClick={() => setPage('month')} type="button">Total mensuel</button>
          <button onClick={exportCsv} type="button">Export CSV</button>
          {adminMode ? (
            <button className="admin-on" onClick={() => setAdminMode(false)} type="button">Quitter admin</button>
          ) : (
            <button className="admin-button" onClick={() => setShowAdminBox(true)} type="button">Mode admin</button>
          )}
        </div>
      </header>

      {showAdminBox && !adminMode && (
        <section className="admin-panel">
          <form onSubmit={handleAdminSubmit}>
            <strong>Connexion admin</strong>
            <input type="password" value={adminInput} onChange={(event) => setAdminInput(event.target.value)} placeholder="Mot de passe admin" autoFocus />
            <button type="submit">Valider</button>
            <button type="button" onClick={() => setShowAdminBox(false)}>Annuler</button>
          </form>
          {adminError && <div className="error">{adminError}</div>}
        </section>
      )}

      {page === 'planning' && (
        <>
          <section className="toolbar">
            <span>📋 {EMPLOYEES.length} salariés</span>
            <span>🗓️ 7 jours + total semaine</span>
            <span>⏱️ Liste horaires intégrée</span>
            <button disabled={!adminMode} onClick={resetPlanning} type="button">Réinitialiser</button>
          </section>

          <section className="planning-board">
            <div className="corner-cell">Salariés</div>
            {DAYS.map((day) => <div className="day-title" key={day}>📋 {day}</div>)}
            <div className="week-title">Total semaine</div>

            {EMPLOYEES.map((employee) => {
              const employeeTotal = DAYS.reduce((sum, day) => sum + calculateDayTotal(planning[employee][day]), 0);

              return (
                <React.Fragment key={employee}>
                  <div className="employee-card">
                    <input type="checkbox" readOnly checked={false} />
                    <strong>{employee}</strong>
                  </div>

                  {DAYS.map((day) => {
                    const cell = planning[employee][day];
                    const total = calculateDayTotal(cell);
                    const isEmpty = !cell.guichet && !cell.schedule && !cell.start && !cell.end && !cell.pause && !cell.note;

                    return (
                      <article className="day-card" key={`${employee}-${day}`}>
                        <div className="card-top">
                          <span className="mini-title">📋 Affectation</span>
                          <span className="empty-pill">{isEmpty ? 'VIDE' : 'OK'}</span>
                        </div>

                        <label>
                          <span>⏱️ Horaire</span>
                          <select value={cell.schedule} onChange={(event) => applySchedule(employee, day, event.target.value)} disabled={!adminMode}>
                            {SCHEDULE_PRESETS.map((preset, index) => (
                              <option key={`${preset.title}-${index}`} value={preset.title}>{preset.label || 'Choisir un horaire'}</option>
                            ))}
                          </select>
                        </label>

                        <label>
                          <span>🏢 Guichet</span>
                          <select value={cell.guichet} onChange={(event) => updateCell(employee, day, 'guichet', event.target.value)} disabled={!adminMode}>
                            {GUICHETS.map((guichet) => <option key={guichet} value={guichet}>{guichet || 'Non choisi'}</option>)}
                          </select>
                        </label>

                        <div className="time-row">
                          <label>
                            <span>🕒 Début</span>
                            <input type="time" value={cell.start} onChange={(event) => updateCell(employee, day, 'start', event.target.value)} disabled={!adminMode} />
                          </label>

                          <label>
                            <span>🕘 Fin</span>
                            <input type="time" value={cell.end} onChange={(event) => updateCell(employee, day, 'end', event.target.value)} disabled={!adminMode} />
                          </label>
                        </div>

                        <div className="time-row">
                          <label>
                            <span>☕ Pause</span>
                            <input type="text" value={cell.pause} onChange={(event) => updateCell(employee, day, 'pause', event.target.value)} disabled={!adminMode} placeholder="1 ou 01:00" />
                          </label>

                          <label>
                            <span>Total manuel</span>
                            <input type="text" value={cell.manualTotal} onChange={(event) => updateCell(employee, day, 'manualTotal', event.target.value)} disabled={!adminMode} placeholder="ex: 7,50" />
                          </label>
                        </div>

                        <label>
                          <span>✍️ Note</span>
                          <textarea value={cell.note} onChange={(event) => updateCell(employee, day, 'note', event.target.value)} disabled={!adminMode} placeholder="Saisie libre" />
                        </label>

                        <div className="day-total">
                          <span>Total journée</span>
                          <strong>{minutesToHours(total)}</strong>
                        </div>
                      </article>
                    );
                  })}

                  <aside className="week-total-card">
                    <span>Total semaine</span>
                    <strong>{minutesToHours(employeeTotal)}</strong>
                    <em>{minutesToDecimal(employeeTotal)} h</em>
                  </aside>
                </React.Fragment>
              );
            })}
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
                <tr><th>Salarié</th><th>Jours travaillés</th><th>Total heures</th><th>Détail guichet</th></tr>
              </thead>
              <tbody>
                {weeklyTotals.map((row) => (
                  <tr key={row.employee}><th>{row.employee}</th><td>{row.workedDays}</td><td>{minutesToHours(row.totalMinutes)}</td><td>{formatGuichetTotals(row.guichetTotals)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {page === 'month' && (
        <section className="totals-page">
          <div className="month-header">
            <div><h2>Total mensuel par personne</h2><p>Calcul estimé à partir de la semaine affichée.</p></div>
            <label className="month-select">Nombre de semaines
              <select value={monthWeeks} onChange={(event) => setMonthWeeks(Number(event.target.value))}>
                <option value={4}>4 semaines</option>
                <option value={5}>5 semaines</option>
              </select>
            </label>
          </div>
          <div className="table-wrapper totals-wrapper">
            <table className="totals-table">
              <thead>
                <tr><th>Salarié</th><th>Jours travaillés</th><th>Total heures</th><th>Détail guichet</th></tr>
              </thead>
              <tbody>
                {monthlyTotals.map((row) => (
                  <tr key={row.employee}><th>{row.employee}</th><td>{row.workedDays}</td><td>{minutesToHours(row.totalMinutes)}</td><td>{formatGuichetTotals(row.guichetTotals)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
