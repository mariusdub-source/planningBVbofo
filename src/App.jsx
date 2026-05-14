
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

const GUICHET_COLORS = {
  'Sainte-Maxime': '#e0f7ff',
  'St-Tropez Vieux Port': '#fff0d9',
  'Les Issambres': '#ecfdf3',
  'Aquascope': '#f3e8ff',
  'Port Grimaud Eglise': '#ffe4e6',
  'Port Grimaud Capit': '#fff7cc',
  'Marines Cog': '#e0ecff',
  'Repos': '#f3f4f6',
  'Congé': '#e5e7eb',
  'Maladie': '#fee2e2',
};

const ACTIVE_LOCATIONS = [
  'Sainte-Maxime',
  'St-Tropez Vieux Port',
  'Les Issambres',
  'Aquascope',
  'Port Grimaud Eglise',
  'Port Grimaud Capit',
  'Marines Cog',
];

const POST_PRESETS = [
  { label: '', poste: '', start: '', end: '', pauseStart: '', pauseEnd: '', total: '' },
  { label: 'Bureau 2 — 9h00-13h00 / 14h00-17h30 — 7,5', poste: 'Bureau 2', start: '09:00', end: '17:30', pauseStart: '13:00', pauseEnd: '14:00', total: '7,5' },
  { label: 'Bureau — 8h30-13h00 / 13h30-17h00 — 8,00', poste: 'Bureau', start: '08:30', end: '17:00', pauseStart: '13:00', pauseEnd: '13:30', total: '8,00' },
  { label: 'Bureau 1 — 7h00-12h00 / 12h30-15h30 — 8', poste: 'Bureau 1', start: '07:00', end: '15:30', pauseStart: '12:00', pauseEnd: '12:30', total: '8' },
  { label: 'Ouv Bureau — 7h30-12h00 / 12h30-16h00 — 8,00', poste: 'Ouv Bureau', start: '07:30', end: '16:00', pauseStart: '12:00', pauseEnd: '12:30', total: '8,00' },
  { label: 'Bureau 3 — 11h30-14h00 / 15h00-20h30 — 8', poste: 'Bureau 3', start: '11:30', end: '20:30', pauseStart: '14:00', pauseEnd: '15:00', total: '8' },
  { label: 'Repos', poste: 'repos', start: '', end: '', pauseStart: '', pauseEnd: '', total: '0' },
  { label: 'Max Renfort — 8h00-12h00 / 13h00-16h00 — 7', poste: 'Max Renfort', start: '08:00', end: '16:00', pauseStart: '12:00', pauseEnd: '13:00', total: '7' },
  { label: 'Bureau — 10h00-13h00 / 14h00-19h00 — 8,00', poste: 'Bureau 10-19', start: '10:00', end: '19:00', pauseStart: '13:00', pauseEnd: '14:00', total: '8,00' },
  { label: 'Renfort PG C — 8h00-14h00 — 6', poste: 'Renfort PG C', start: '08:00', end: '14:00', pauseStart: '', pauseEnd: '', total: '6' },
  { label: 'Renfort Max — 8h00-13h00 — 5,00', poste: 'Renfort Max', start: '08:00', end: '13:00', pauseStart: '', pauseEnd: '', total: '5,00' },
  { label: 'Max Ouv — 7h00-11h30 / 12h00-14h30 — 7', poste: 'Max Ouv', start: '07:00', end: '14:30', pauseStart: '11:30', pauseEnd: '12:00', total: '7' },
  { label: 'PG C Marché — 8h00-13h00 / 14h00-15h15 — 6,25', poste: 'PG C Marché', start: '08:00', end: '15:15', pauseStart: '13:00', pauseEnd: '14:00', total: '6,25' },
  { label: 'Max Ferm — 13h30-15h00 / 15h45-21h15 — 7,00', poste: 'Max Ferm', start: '13:30', end: '21:15', pauseStart: '15:00', pauseEnd: '15:45', total: '7,00' },
  { label: 'Renfort Iss — 8h00-13h30 — 5,5', poste: 'Renfort Iss', start: '08:00', end: '13:30', pauseStart: '', pauseEnd: '', total: '5,5' },
  { label: 'Issambres — 8h00-12h00 / 13h45-17h00 — 7,25', poste: 'Issambres', start: '08:00', end: '17:00', pauseStart: '12:00', pauseEnd: '13:45', total: '7,25' },
  { label: 'PG Ég Jour — 8h00-14h00 — 6', poste: 'PG Ég Jour', start: '08:00', end: '14:00', pauseStart: '', pauseEnd: '', total: '6' },
  { label: 'PG Église — 8h00-12h35 / 13h20-17h30 — 8,75', poste: 'PG Église', start: '08:00', end: '17:30', pauseStart: '12:35', pauseEnd: '13:20', total: '8,75' },
  { label: 'Renfort PG C — 8h00-13h30 — 5,50', poste: 'Renfort PG C 13h30', start: '08:00', end: '13:30', pauseStart: '', pauseEnd: '', total: '5,50' },
  { label: 'Marines — 8h00-14h00 — 6,00', poste: 'Marines', start: '08:00', end: '14:00', pauseStart: '', pauseEnd: '', total: '6,00' },
  { label: 'Trop Soir — 16h00-20h00 / 20h20-23h15 — 6,92', poste: 'Trop Soir', start: '16:00', end: '23:15', pauseStart: '20:00', pauseEnd: '20:20', total: '6,92' },
  { label: 'Trop Matin — 9h45-15h45 — 6,00', poste: 'Trop Matin', start: '09:45', end: '15:45', pauseStart: '', pauseEnd: '', total: '6,00' },
  { label: 'Trop Apm — 15h20-20h20 — 5,00', poste: 'Trop Apm', start: '15:20', end: '20:20', pauseStart: '', pauseEnd: '', total: '5,00' },
  { label: 'Aqua — 8h30-12h00 / 13h30-17h00 — 7', poste: 'Aqua', start: '08:30', end: '17:00', pauseStart: '12:00', pauseEnd: '13:30', total: '7' },
  { label: 'Max Journée — 9h00-13h00 / 14h30-18h00 — 7,50', poste: 'Max Journée', start: '09:00', end: '18:00', pauseStart: '13:00', pauseEnd: '14:30', total: '7,50' },
  { label: 'Max Apm — 14h30-17h00 / 18h00-22h30 — 7', poste: 'Max Apm', start: '14:30', end: '22:30', pauseStart: '17:00', pauseEnd: '18:00', total: '7' },
  { label: 'Aqua — 9h45-12h00 / 13h30-17h15 — 6,00', poste: 'Aqua 9h45', start: '09:45', end: '17:15', pauseStart: '12:00', pauseEnd: '13:30', total: '6,00' },
  { label: 'PG C Apm — 15h00-21h00 — 6', poste: 'PG C Apm', start: '15:00', end: '21:00', pauseStart: '', pauseEnd: '', total: '6' },
  { label: 'Max Ouv — 7h20-12h00 / 12h30-15h20 — 7,50', poste: 'Max Ouv 7h20', start: '07:20', end: '15:20', pauseStart: '12:00', pauseEnd: '12:30', total: '7,50' },
  { label: 'PG Ég Apm — 13h50-19h50 — 6', poste: 'PG Ég Apm', start: '13:50', end: '19:50', pauseStart: '', pauseEnd: '', total: '6' },
  { label: 'PG Capit — 8h00-12h45 / 13h30-17h00 — 8,25', poste: 'PG Capit', start: '08:00', end: '17:00', pauseStart: '12:45', pauseEnd: '13:30', total: '8,25' },
  { label: 'Trop Jour — 9h00-13h10 / 13h30-16h15 — 6,92', poste: 'Trop Jour', start: '09:00', end: '16:15', pauseStart: '13:10', pauseEnd: '13:30', total: '6,92' },
  { label: 'Max Ferm — 16h00-19h00 / 19h30-23h30 — 7', poste: 'Max Ferm soir', start: '16:00', end: '23:30', pauseStart: '19:00', pauseEnd: '19:30', total: '7' },
  { label: 'Max Journée — 9h00-14h30 / 16h00-18h00 — 7,5', poste: 'Max Journée 9h14h30', start: '09:00', end: '18:00', pauseStart: '14:30', pauseEnd: '16:00', total: '7,5' },
  { label: 'Bureau 1 — 7h30-12h00 / 12h30-15h00 — 7,00', poste: 'Bureau 1 7h30', start: '07:30', end: '15:00', pauseStart: '12:00', pauseEnd: '12:30', total: '7,00' },
  { label: 'Max Ouv Dim — 7h30-12h00 / 12h30-15h00 — 7,00', poste: 'Max Ouv Dim', start: '07:30', end: '15:00', pauseStart: '12:00', pauseEnd: '12:30', total: '7,00' },
];

const STORAGE_PREFIX = 'planning-maritime-detail-apercu-week-';

function createEmptyDay() {
  return { guichet: '', poste: '', start: '', end: '', pauseStart: '', pauseEnd: '', manualTotal: '', note: '' };
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

function loadPlanning(weekKey) {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${weekKey}`);
    if (!saved) return createEmptyWeek();

    const parsed = JSON.parse(saved);
    const complete = createEmptyWeek();

    EMPLOYEES.forEach((employee) => {
      DAYS.forEach((day) => {
        const cell = parsed?.[employee]?.[day] || {};
        complete[employee][day] = {
          guichet: cell.guichet || '',
          poste: cell.poste || '',
          start: cell.start || '',
          end: cell.end || '',
          pauseStart: cell.pauseStart || '',
          pauseEnd: cell.pauseEnd || '',
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

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function getMonday(value = new Date()) {
  const date = new Date(value);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(12, 0, 0, 0);
  return date;
}

function addDays(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  date.setHours(12, 0, 0, 0);
  return date;
}

function formatDateFr(value) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function formatWeekLabel(mondayISO) {
  const monday = new Date(`${mondayISO}T12:00:00`);
  const sunday = addDays(monday, 6);
  return `Semaine du ${formatDateFr(monday)} au ${formatDateFr(sunday)}`;
}

function getDayDate(mondayISO, index) {
  const monday = new Date(`${mondayISO}T12:00:00`);
  return formatDateFr(addDays(monday, index));
}

function timeToMinutes(value) {
  if (!value || !value.includes(':')) return null;
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function numberHoursToMinutes(value) {
  if (!value) return null;
  const number = Number(String(value).replace(',', '.'));
  if (Number.isNaN(number)) return null;
  return Math.round(number * 60);
}

function pauseRangeToMinutes(cell) {
  const start = timeToMinutes(cell.pauseStart);
  const end = timeToMinutes(cell.pauseEnd);
  if (start === null || end === null) return 0;

  let duration = end - start;
  if (duration < 0) duration += 24 * 60;
  return Math.max(0, duration);
}

function calculateDayTotal(cell) {
  const manual = numberHoursToMinutes(cell.manualTotal);
  if (manual !== null) return manual;

  const start = timeToMinutes(cell.start);
  const end = timeToMinutes(cell.end);
  const pause = pauseRangeToMinutes(cell);

  if (start === null || end === null) return 0;

  let duration = end - start;
  if (duration < 0) duration += 24 * 60;

  return Math.max(0, duration - pause);
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

function isAbsence(guichet, poste) {
  return guichet === 'Repos' || guichet === 'Congé' || guichet === 'Maladie' || poste === 'repos';
}

function formatPosteTotals(totals) {
  const entries = Object.entries(totals).filter(([, count]) => count > 0);
  if (entries.length === 0) return 'Aucun poste';
  return entries.map(([name, count]) => `${name}: ${count}`).join(' / ');
}

function getPresetByPoste(poste) {
  return POST_PRESETS.find((preset) => preset.poste === poste);
}

function getOverviewStyle(guichet) {
  return {
    backgroundColor: GUICHET_COLORS[guichet] || '#ffffff',
  };
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
  const [selectedWeek, setSelectedWeek] = useState(() => toISODate(getMonday()));
  const [planning, setPlanning] = useState(() => loadPlanning(toISODate(getMonday())));

  const weeklyTotals = useMemo(() => {
    return EMPLOYEES.map((employee) => {
      let totalMinutes = 0;
      let workedDays = 0;
      const posteTotals = {};

      DAYS.forEach((day) => {
        const cell = planning[employee][day];
        const dayTotal = calculateDayTotal(cell);
        totalMinutes += dayTotal;

        if ((cell.guichet || cell.poste) && !isAbsence(cell.guichet, cell.poste)) {
          workedDays += 1;
          const label = cell.poste || cell.guichet || 'Affectation';
          posteTotals[label] = (posteTotals[label] || 0) + 1;
        }
      });

      return { employee, totalMinutes, workedDays, posteTotals };
    });
  }, [planning]);

  const monthlyTotals = useMemo(() => {
    return weeklyTotals.map((row) => {
      const posteTotals = {};
      Object.entries(row.posteTotals).forEach(([poste, count]) => {
        posteTotals[poste] = count * monthWeeks;
      });
      return {
        employee: row.employee,
        totalMinutes: row.totalMinutes * monthWeeks,
        workedDays: row.workedDays * monthWeeks,
        posteTotals,
      };
    });
  }, [weeklyTotals, monthWeeks]);

  const dailyLocationTotals = useMemo(() => {
    return DAYS.map((day) => {
      const counts = {};
      ACTIVE_LOCATIONS.forEach((location) => {
        counts[location] = 0;
      });

      EMPLOYEES.forEach((employee) => {
        const guichet = planning[employee][day]?.guichet;
        if (ACTIVE_LOCATIONS.includes(guichet)) {
          counts[guichet] += 1;
        }
      });

      return { day, counts };
    });
  }, [planning]);

  function savePlanning(nextPlanning) {
    setPlanning(nextPlanning);
    localStorage.setItem(`${STORAGE_PREFIX}${selectedWeek}`, JSON.stringify(nextPlanning));
  }

  function changeWeek(nextWeek) {
    const monday = toISODate(getMonday(new Date(`${nextWeek}T12:00:00`)));
    setSelectedWeek(monday);
    setPlanning(loadPlanning(monday));
  }

  function goToPreviousWeek() {
    const monday = new Date(`${selectedWeek}T12:00:00`);
    changeWeek(toISODate(addDays(monday, -7)));
  }

  function goToNextWeek() {
    const monday = new Date(`${selectedWeek}T12:00:00`);
    changeWeek(toISODate(addDays(monday, 7)));
  }

  function goToCurrentWeek() {
    changeWeek(toISODate(getMonday()));
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

  function applyPoste(employee, day, poste) {
    if (!adminMode) return;
    const preset = getPresetByPoste(poste);
    const current = planning[employee][day];

    savePlanning({
      ...planning,
      [employee]: {
        ...planning[employee],
        [day]: {
          ...current,
          poste,
          start: preset?.start || '',
          end: preset?.end || '',
          pauseStart: preset?.pauseStart || '',
          pauseEnd: preset?.pauseEnd || '',
          manualTotal: preset?.total || '',
          note: poste === 'repos' ? 'repos' : current.note,
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
    if (window.confirm('Réinitialiser tout le planning de cette semaine ?')) {
      savePlanning(createEmptyWeek());
    }
  }

  function exportCsv() {
    const rows = [
      ['Salarié', ...DAYS.flatMap((day) => [`${day} - Guichet`, `${day} - Poste`, `${day} - Début`, `${day} - Fin`, `${day} - Pause de`, `${day} - Pause à`, `${day} - Total`, `${day} - Note`]), 'Total semaine'],
      ...EMPLOYEES.map((employee) => {
        const weekly = DAYS.reduce((sum, day) => sum + calculateDayTotal(planning[employee][day]), 0);
        return [
          employee,
          ...DAYS.flatMap((day) => {
            const cell = planning[employee][day];
            return [cell.guichet, cell.poste, cell.start, cell.end, cell.pauseStart, cell.pauseEnd, minutesToHours(calculateDayTotal(cell)), cell.note];
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
    link.download = `planning-maritime-${selectedWeek}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!accessGranted) {
    return (
      <main className="login-page">
        <form className="login-card" onSubmit={handleAccessSubmit}>
          <div className="brand-mark">⚓</div>
          <h1>Planning Maritime</h1>
          <p>Accès sécurisé au planning.</p>
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
            <p>{formatWeekLabel(selectedWeek)} — {adminMode ? 'Mode admin actif : modification autorisée.' : 'Lecture seule : activez le mode admin pour modifier.'}</p>
          </div>
        </div>

        <div className="top-actions">
          <button className={page === 'planning' ? 'active' : ''} onClick={() => setPage('planning')} type="button">Planning détaillé</button>
          <button className={page === 'overview' ? 'active' : ''} onClick={() => setPage('overview')} type="button">Aperçu global</button>
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

      <section className="calendar-bar">
        <div>
          <span className="calendar-label">Semaine du planning</span>
          <strong>{formatWeekLabel(selectedWeek)}</strong>
        </div>

        <div className="calendar-actions">
          <button type="button" onClick={goToPreviousWeek}>← Semaine précédente</button>
          <input type="date" value={selectedWeek} onChange={(event) => changeWeek(event.target.value)} />
          <button type="button" onClick={goToNextWeek}>Semaine suivante →</button>
          <button type="button" onClick={goToCurrentWeek}>Aujourd’hui</button>
        </div>
      </section>

      <section className="daily-totals-panel top-cards">
        <div className="section-head">
          <div>
            <h2>Total de personnes par lieu et par jour</h2>
            <p>Vue rapide en cartes, mise à jour automatiquement selon les affectations de la semaine.</p>
          </div>
        </div>

        <div className="location-cards-strip">
          {ACTIVE_LOCATIONS.map((location) => {
            const weeklyLocationTotal = dailyLocationTotals.reduce((sum, item) => sum + item.counts[location], 0);

            return (
              <article className="location-summary-card" key={`location-summary-${location}`} style={{ borderTopColor: GUICHET_COLORS[location] || '#d9e6ef' }}>
                <header>
                  <span className="legend-swatch" style={{ backgroundColor: GUICHET_COLORS[location] || '#ffffff' }} />
                  <strong>{location}</strong>
                </header>

                <div className="location-week-total">
                  <span>Total semaine</span>
                  <strong>{weeklyLocationTotal}</strong>
                </div>

                <div className="location-day-grid">
                  {dailyLocationTotals.map((item) => (
                    <div className="location-day-pill" key={`${location}-${item.day}`}>
                      <span>{item.day.slice(0, 3)}</span>
                      <strong>{item.counts[location]}</strong>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>


      {page === 'planning' && (
        <>
          <section className="toolbar">
            <span>📋 {EMPLOYEES.length} salariés</span>
            <span>🗓️ planning détaillé</span>
            <span>🧭 onglet Aperçu pour la vue globale</span>
            <button disabled={!adminMode} onClick={resetPlanning} type="button">Réinitialiser</button>
          </section>

          <section className="planning-board">
            <div className="corner-cell">Salariés</div>
            {DAYS.map((day, index) => (
              <div className="day-title" key={day}>
                <span>📋 {day}</span>
                <small>{getDayDate(selectedWeek, index)}</small>
              </div>
            ))}
            <div className="week-title">Total semaine</div>

            {EMPLOYEES.map((employee) => {
              const employeeTotal = DAYS.reduce((sum, day) => sum + calculateDayTotal(planning[employee][day]), 0);

              return (
                <React.Fragment key={employee}>
                  <div className="employee-card">
                    <strong>{employee}</strong>
                  </div>

                  {DAYS.map((day) => {
                    const cell = planning[employee][day];
                    const total = calculateDayTotal(cell);
                    const isEmpty = !cell.guichet && !cell.poste && !cell.start && !cell.end && !cell.pauseStart && !cell.pauseEnd && !cell.note;

                    return (
                      <article className="detail-card" key={`${employee}-${day}`}>
                        <div className="card-top">
                          <span className="mini-title">📋 Affectation</span>
                          <span className="empty-pill">{isEmpty ? 'VIDE' : 'OK'}</span>
                        </div>

                        <label>
                          <span>🏢 Guichet</span>
                          <select value={cell.guichet} onChange={(event) => updateCell(employee, day, 'guichet', event.target.value)} disabled={!adminMode}>
                            {GUICHETS.map((guichet) => <option key={guichet} value={guichet}>{guichet || 'Non choisi'}</option>)}
                          </select>
                        </label>

                        <label>
                          <span>⏱️ Poste</span>
                          <select value={cell.poste} onChange={(event) => applyPoste(employee, day, event.target.value)} disabled={!adminMode}>
                            {POST_PRESETS.map((preset, index) => (
                              <option key={`${preset.poste}-${index}`} value={preset.poste}>{preset.label || 'Choisir un poste'}</option>
                            ))}
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
                            <span>☕ Pause de</span>
                            <input type="time" value={cell.pauseStart} onChange={(event) => updateCell(employee, day, 'pauseStart', event.target.value)} disabled={!adminMode} />
                          </label>

                          <label>
                            <span>☕ Pause à</span>
                            <input type="time" value={cell.pauseEnd} onChange={(event) => updateCell(employee, day, 'pauseEnd', event.target.value)} disabled={!adminMode} />
                          </label>
                        </div>

                        <label>
                          <span>Total manuel</span>
                          <input type="text" value={cell.manualTotal} onChange={(event) => updateCell(employee, day, 'manualTotal', event.target.value)} disabled={!adminMode} placeholder="ex: 7,50" />
                        </label>

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

      {page === 'overview' && (
        <>
          <section className="toolbar">
            <span>👁️ Aperçu global : lieu + poste</span>
            <span>🎨 1 couleur par lieu</span>
            <span>🗓️ semaine active : {formatWeekLabel(selectedWeek)}</span>
          </section>

          <section className="legend">
            {Object.entries(GUICHET_COLORS).map(([label, color]) => (
              <div className="legend-item" key={label}>
                <span className="legend-swatch" style={{ backgroundColor: color }} />
                <span>{label}</span>
              </div>
            ))}
          </section>

          <section className="overview-board">
            <div className="corner-cell">Salariés</div>
            {DAYS.map((day, index) => (
              <div className="day-title" key={day}>
                <span>📋 {day}</span>
                <small>{getDayDate(selectedWeek, index)}</small>
              </div>
            ))}

            {EMPLOYEES.map((employee) => (
              <React.Fragment key={`overview-${employee}`}>
                <div className="employee-card compact">
                  <strong>{employee}</strong>
                </div>

                {DAYS.map((day) => {
                  const cell = planning[employee][day];
                  return (
                    <div className="overview-cell" key={`overview-${employee}-${day}`} style={getOverviewStyle(cell.guichet)}>
                      <span className="overview-label">Lieu</span>
                      <strong>{cell.guichet || '—'}</strong>
                      <span className="overview-label">Poste</span>
                      <em>{cell.poste || '—'}</em>
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
          <p>Calcul automatique des heures, jours travaillés et postes attribués.</p>
          <div className="table-wrapper">
            <table className="totals-table">
              <thead>
                <tr>
                  <th>Salarié</th>
                  <th>Jours travaillés</th>
                  <th>Total heures</th>
                  <th>Détail poste</th>
                </tr>
              </thead>
              <tbody>
                {weeklyTotals.map((row) => (
                  <tr key={row.employee}>
                    <th>{row.employee}</th>
                    <td>{row.workedDays}</td>
                    <td>{minutesToHours(row.totalMinutes)}</td>
                    <td>{formatPosteTotals(row.posteTotals)}</td>
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

          <div className="table-wrapper">
            <table className="totals-table">
              <thead>
                <tr>
                  <th>Salarié</th>
                  <th>Jours travaillés</th>
                  <th>Total heures</th>
                  <th>Détail poste</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTotals.map((row) => (
                  <tr key={row.employee}>
                    <th>{row.employee}</th>
                    <td>{row.workedDays}</td>
                    <td>{minutesToHours(row.totalMinutes)}</td>
                    <td>{formatPosteTotals(row.posteTotals)}</td>
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
