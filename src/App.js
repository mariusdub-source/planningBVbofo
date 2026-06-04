import React, { useMemo, useState } from 'react';
import bottomPagePhoto from './bottom-page-photo.jpg';

const APP_PASSWORD = 'BV2026#';
const ADMIN_PASSWORD = 'Marius24#';
const STORAGE_KEY = 'planning-salaries-horaires-v1';
const EMPLOYEE_KEY = 'planning-salaries-noms-v1';
const PLACES_KEY = 'planning-salaries-lieux-v1';
const MINUTE_DECIMALS_KEY = 'planning-salaries-minutes-decimales-v1';
const BREAK_DECIMALS_KEY = 'planning-salaries-pauses-decimales-v1';
const AUTH_KEY = 'planning-salaries-auth-v2';

const defaultEmployees = [
  'Julie', 'Caroline', 'Marius', 'Véronique', 'Fabienne', 'Carine', 'Corinne',
  'Olympia', 'Cendrine', 'Hélène', 'Anaïs', 'Agathe', 'Myriam', 'Nôa',
  'Salarié 15', 'Salarié 16', 'Salarié 17', 'Salarié 18', 'Salarié 19', 'Salarié 20'
];

const defaultPlaces = [
  'Sainte-Maxime',
  'St-Tropez Vieux Port',
  'Les Issambres',
  'Aquascope',
  'Port Grimaud Eglise',
  'Port Grimaud Capit',
  'Marines Cog'
];

const defaultMinuteDecimals = ['0', '0,08', '0,16', '0,25', '0,33', '0,41', '0,5', '0,58', '0,66', '0,75', '0,83', '0,91'];
const defaultBreakDecimals = ['0,25', '0,33', '0,50', '0,75', '1', '1,25', '1,33', '1,50', '1,75', '2,00'];

const days = [
  { key: 'mon', label: 'Lundi' },
  { key: 'tue', label: 'Mardi' },
  { key: 'wed', label: 'Mercredi' },
  { key: 'thu', label: 'Jeudi' },
  { key: 'fri', label: 'Vendredi' },
  { key: 'sat', label: 'Samedi' },
  { key: 'sun', label: 'Dimanche' }
];

function pad(value) {
  return String(value).padStart(2, '0');
}

function toDateInputValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function getMonday(date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function weekKeyFromDate(date) {
  return toDateInputValue(getMonday(date));
}

function monthKeyFromDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function displayDate(date) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' }).format(date);
}

function displayLongDate(date) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function emptyShift() {
  return { start: '', end: '', breakMinutes: '0', counter: '', note: '' };
}

function decimalMinuteToMinutes(value) {
  const normalized = String(value || '0').replace(',', '.');
  const decimal = Number(normalized);
  if (Number.isNaN(decimal)) return 0;
  return Math.round(decimal * 60);
}

function pauseDecimalToMinutes(value) {
  const normalized = String(value || '0').replace(',', '.');
  const decimal = Number(normalized);
  if (Number.isNaN(decimal)) return 0;
  return Math.round(decimal * 60);
}

function splitTime(value) {
  if (!value || !String(value).includes(':')) return { hour: '', minute: '' };
  const [hour, minute] = String(value).split(':');
  return { hour: pad(Number(hour || 0)), minute: pad(Number(minute || 0)) };
}

function minuteToDecimalValue(minutes, minuteDecimals) {
  const target = Number(minutes || 0);
  const list = (minuteDecimals || defaultMinuteDecimals).filter(Boolean);
  const found = list.find((item) => decimalMinuteToMinutes(item) === target);
  return found || list[0] || '0';
}

function buildTime(hour, minuteDecimal) {
  if (hour === '' || hour === null || hour === undefined) return '';
  return `${pad(Number(hour))}:${pad(decimalMinuteToMinutes(minuteDecimal))}`;
}

function normalizePassword(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function employeePasswords(employeeName) {
  const lower = String(employeeName || '').trim().toLowerCase().slice(0, 3);
  const normalized = normalizePassword(employeeName).slice(0, 3);
  return Array.from(new Set([lower, normalized].filter(Boolean)));
}

function isEmployeePasswordValid(employeeName, password) {
  const raw = String(password || '').trim().toLowerCase();
  const normalized = normalizePassword(password);
  return employeePasswords(employeeName).some((expected) => expected === raw || expected === normalized);
}

function timeToMinutes(value) {
  if (!value) return null;
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function shiftMinutes(shift) {
  const start = timeToMinutes(shift?.start);
  const end = timeToMinutes(shift?.end);
  const pause = pauseDecimalToMinutes(shift?.breakMinutes || 0);
  if (start === null || end === null) return 0;
  let duration = end - start;
  if (duration < 0) duration += 24 * 60;
  return Math.max(0, duration - pause);
}

function formatHours(minutes) {
  const total = Math.round(minutes || 0);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h${pad(m)}`;
}

function decimalHours(minutes) {
  return Math.round((minutes / 60) * 100) / 100;
}

function getShift(data, weekKey, employeeIndex, dayKey) {
  return data?.[weekKey]?.[employeeIndex]?.[dayKey] || emptyShift();
}

function getWeeksInMonth(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const weeks = [];
  let cursor = getMonday(first);
  while (cursor <= last) {
    weeks.push(toDateInputValue(cursor));
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

function App() {
  const [appUnlocked, setAppUnlocked] = useState(false);
  const [appPassword, setAppPassword] = useState('');
  const [appPasswordError, setAppPasswordError] = useState('');
  const [employees, setEmployees] = useState(() => readJSON(EMPLOYEE_KEY, defaultEmployees));
  const [places, setPlaces] = useState(() => readJSON(PLACES_KEY, defaultPlaces));
  const [minuteDecimals, setMinuteDecimals] = useState(() => readJSON(MINUTE_DECIMALS_KEY, defaultMinuteDecimals));
  const [breakDecimals, setBreakDecimals] = useState(() => readJSON(BREAK_DECIMALS_KEY, defaultBreakDecimals));
  const [data, setData] = useState(() => readJSON(STORAGE_KEY, {}));
  const [auth, setAuth] = useState(() => readJSON(AUTH_KEY, { mode: 'employee', employeeIndex: 0, employeeUnlocked: false }));
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [employeePassword, setEmployeePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(new Date()));
  const [activeView, setActiveView] = useState('week');

  const selectedDateObject = useMemo(() => parseDate(selectedDate), [selectedDate]);
  const weekStart = useMemo(() => getMonday(selectedDateObject), [selectedDateObject]);
  const weekKey = useMemo(() => weekKeyFromDate(selectedDateObject), [selectedDateObject]);
  const monthKey = useMemo(() => monthKeyFromDate(selectedDateObject), [selectedDateObject]);

  const isAdmin = auth.mode === 'admin';
  const isEmployeeUnlocked = auth.mode === 'employee' && auth.employeeUnlocked;
  const canUsePlanning = isAdmin || isEmployeeUnlocked;
  const visibleEmployeeIndexes = isAdmin
    ? employees.map((_, index) => index)
    : isEmployeeUnlocked
      ? [Number(auth.employeeIndex || 0)]
      : [];

  const persistEmployees = (next) => {
    setEmployees(next);
    writeJSON(EMPLOYEE_KEY, next);
  };

  const persistData = (next) => {
    setData(next);
    writeJSON(STORAGE_KEY, next);
  };

  const persistPlaces = (next) => {
    setPlaces(next);
    writeJSON(PLACES_KEY, next);
  };

  const persistMinuteDecimals = (next) => {
    setMinuteDecimals(next);
    writeJSON(MINUTE_DECIMALS_KEY, next);
  };

  const persistBreakDecimals = (next) => {
    setBreakDecimals(next);
    writeJSON(BREAK_DECIMALS_KEY, next);
  };

  const persistAuth = (next) => {
    setAuth(next);
    writeJSON(AUTH_KEY, next);
  };

  const unlockApplication = (event) => {
    event.preventDefault();
    if (appPassword === APP_PASSWORD) {
      setAppUnlocked(true);
      setAppPassword('');
      setAppPasswordError('');
      return;
    }
    setAppPasswordError('Mot de passe application incorrect.');
  };

  const lockApplication = () => {
    setAppUnlocked(false);
    persistAuth({ mode: 'employee', employeeIndex: 0, employeeUnlocked: false });
  };

  const updateEmployeeName = (index, value) => {
    const next = [...employees];
    next[index] = value;
    persistEmployees(next);
  };

  const updatePlace = (index, value) => {
    const next = [...places];
    next[index] = value;
    persistPlaces(next);
  };

  const addPlace = () => {
    persistPlaces([...places, `Nouveau lieu ${places.length + 1}`]);
  };

  const removePlace = (index) => {
    const next = places.filter((_, placeIndex) => placeIndex !== index);
    persistPlaces(next.length ? next : ['Lieu principal']);
  };

  const updateMinuteDecimal = (index, value) => {
    const next = [...minuteDecimals];
    next[index] = value;
    persistMinuteDecimals(next);
  };

  const addMinuteDecimal = () => {
    persistMinuteDecimals([...minuteDecimals, '0']);
  };

  const removeMinuteDecimal = (index) => {
    const next = minuteDecimals.filter((_, minuteIndex) => minuteIndex !== index);
    persistMinuteDecimals(next.length ? next : ['0']);
  };

  const updateBreakDecimal = (index, value) => {
    const next = [...breakDecimals];
    next[index] = value;
    persistBreakDecimals(next);
  };

  const addBreakDecimal = () => {
    persistBreakDecimals([...breakDecimals, '0,25']);
  };

  const removeBreakDecimal = (index) => {
    const next = breakDecimals.filter((_, breakIndex) => breakIndex !== index);
    persistBreakDecimals(next.length ? next : ['0']);
  };

  const updateShift = (employeeIndex, dayKey, field, value) => {
    if (!canUsePlanning) return;
    const current = getShift(data, weekKey, employeeIndex, dayKey);
    const next = {
      ...data,
      [weekKey]: {
        ...(data[weekKey] || {}),
        [employeeIndex]: {
          ...((data[weekKey] || {})[employeeIndex] || {}),
          [dayKey]: { ...current, [field]: value }
        }
      }
    };
    persistData(next);
  };

  const loginAdmin = (event) => {
    event.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      persistAuth({ mode: 'admin', employeeIndex: auth.employeeIndex || 0, employeeUnlocked: false });
      setAdminPassword('');
      setEmployeePassword('');
      setPasswordError('');
      setShowAdminLogin(false);
      return;
    }
    setPasswordError('Mot de passe admin incorrect.');
  };

  const loginEmployee = (event) => {
    event.preventDefault();
    const employeeName = employees[Number(auth.employeeIndex || 0)] || '';
    if (isEmployeePasswordValid(employeeName, employeePassword)) {
      persistAuth({ mode: 'employee', employeeIndex: Number(auth.employeeIndex || 0), employeeUnlocked: true });
      setEmployeePassword('');
      setAdminPassword('');
      setPasswordError('');
      return;
    }
    setPasswordError(`Mot de passe salarié incorrect pour ${employeeName}.`);
  };

  const logoutUser = () => {
    persistAuth({ mode: 'employee', employeeIndex: Number(auth.employeeIndex || 0), employeeUnlocked: false });
    setPasswordError('');
  };

  const changeEmployeeSelection = (employeeIndex) => {
    persistAuth({ mode: 'employee', employeeIndex: Number(employeeIndex), employeeUnlocked: false });
    setEmployeePassword('');
    setPasswordError('');
  };

  const weekTotalForEmployee = (employeeIndex, targetWeekKey = weekKey) => days.reduce((sum, day) => {
    return sum + shiftMinutes(getShift(data, targetWeekKey, employeeIndex, day.key));
  }, 0);

  const dayTotalForEmployee = (employeeIndex, dayKey) => shiftMinutes(getShift(data, weekKey, employeeIndex, dayKey));

  const monthTotalForEmployee = (employeeIndex) => getWeeksInMonth(selectedDateObject).reduce((sum, wk) => {
    return sum + weekTotalForEmployee(employeeIndex, wk);
  }, 0);

  const selectedDayKey = days[(selectedDateObject.getDay() + 6) % 7].key;
  const selectedDayLabel = days.find((day) => day.key === selectedDayKey)?.label;

  const renderPlaceSelect = (employeeIndex, dayKey, shift) => (
    <select
      value={shift.counter || ''}
      onChange={(e) => updateShift(employeeIndex, dayKey, 'counter', e.target.value)}
    >
      <option value="">Sélectionner</option>
      {places.filter(Boolean).map((place, index) => (
        <option key={`${place}-${index}`} value={place}>{place}</option>
      ))}
    </select>
  );

  const renderTimeSelect = (employeeIndex, dayKey, field, value) => {
    const { hour, minute } = splitTime(value);
    const selectedMinuteDecimal = minuteToDecimalValue(minute, minuteDecimals);
    const safeMinuteDecimals = minuteDecimals.filter(Boolean);

    return (
      <div className="time-selectors">
        <select
          aria-label="Heure"
          value={hour}
          onChange={(e) => updateShift(employeeIndex, dayKey, field, buildTime(e.target.value, selectedMinuteDecimal))}
        >
          <option value="">Heure</option>
          {Array.from({ length: 24 }, (_, index) => pad(index)).map((hourOption) => (
            <option key={hourOption} value={hourOption}>{hourOption}:00</option>
          ))}
        </select>
        <select
          aria-label="Minutes décimales"
          value={selectedMinuteDecimal}
          onChange={(e) => updateShift(employeeIndex, dayKey, field, buildTime(hour || '00', e.target.value))}
        >
          {safeMinuteDecimals.map((minuteOption, index) => (
            <option key={`${minuteOption}-${index}`} value={minuteOption}>{minuteOption}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderPauseInput = (employeeIndex, dayKey, shift) => {
    const listId = `pause-decimal-options-${employeeIndex}-${dayKey}`;
    return (
      <div className="pause-input-wrap">
        <input
          list={listId}
          inputMode="decimal"
          value={shift.breakMinutes || '0'}
          onChange={(e) => updateShift(employeeIndex, dayKey, 'breakMinutes', e.target.value)}
          placeholder="0,25"
        />
        <datalist id={listId}>
          {breakDecimals.filter(Boolean).map((pauseOption, index) => (
            <option key={`${pauseOption}-${index}`} value={pauseOption} />
          ))}
        </datalist>
      </div>
    );
  };


  const exportCSV = () => {
    const rows = [['Semaine', 'Salarié', 'Jour', 'Début', 'Fin', 'Pause', 'Guichet', 'Total heures', 'Note']];
    visibleEmployeeIndexes.forEach((employeeIndex) => {
      days.forEach((day) => {
        const shift = getShift(data, weekKey, employeeIndex, day.key);
        rows.push([
          weekKey,
          employees[employeeIndex],
          day.label,
          shift.start,
          shift.end,
          shift.breakMinutes,
          shift.counter || '',
          decimalHours(shiftMinutes(shift)).toString().replace('.', ','),
          shift.note || ''
        ]);
      });
    });
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `horaires-${weekKey}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const changeWeek = (amount) => setSelectedDate(toDateInputValue(addDays(selectedDateObject, amount * 7)));

  if (!appUnlocked) {
    return (
      <div className="login-screen access-login-screen">
        <form className="access-login-card" onSubmit={unlockApplication}>
          <div className="access-logo" aria-label="Les Bateaux Verts">
            <span className="access-logo-boat">▰▰▰</span>
            <span className="access-logo-text">Les Bateaux Verts</span>
          </div>
          <h1>Guichet</h1>
          <p className="access-subtitle">Accès salariés</p>
          <label className="sr-only" htmlFor="app-password">Mot de passe d'accès à l'application</label>
          <input
            id="app-password"
            className="access-password-input"
            type="password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
            placeholder="Mot de passe"
            autoFocus
          />
          {appPasswordError && <small className="error access-error">{appPasswordError}</small>}
          <button className="access-submit" type="submit">Entrer →</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Planning salariés</p>
          <h1>Saisie des horaires de travail</h1>
          <p className="subtitle">Chaque salarié se connecte avec son mot de passe personnel et voit uniquement ses horaires. Le mode admin permet de tout consulter et modifier.</p>
        </div>
        <div className="auth-panel">
          <div className="auth-topline">
            <span className={isAdmin ? 'badge admin' : isEmployeeUnlocked ? 'badge' : 'badge muted'}>
              {isAdmin ? 'Mode admin' : isEmployeeUnlocked ? `Salarié : ${employees[auth.employeeIndex]}` : 'Connexion salarié'}
            </span>
            <div className="top-buttons">
              {!isAdmin && (
                <button
                  type="button"
                  className="secondary small-button admin-toggle"
                  onClick={() => {
                    setShowAdminLogin(!showAdminLogin);
                    setPasswordError('');
                  }}
                >
                  Admin
                </button>
              )}
              <button type="button" className="secondary small-button" onClick={lockApplication}>Verrouiller</button>
            </div>
          </div>

          {!isAdmin && showAdminLogin && (
            <form onSubmit={loginAdmin} className="admin-login admin-login-top">
              <input
                type="password"
                placeholder="Mot de passe admin"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoFocus
              />
              <button>Valider</button>
            </form>
          )}

          {isAdmin ? (
            <button className="secondary" onClick={logoutUser}>Quitter admin</button>
          ) : (
            <>
              <label>
                Salarié
                <select value={auth.employeeIndex} onChange={(e) => changeEmployeeSelection(e.target.value)}>
                  {employees.map((employee, index) => <option key={index} value={index}>{employee}</option>)}
                </select>
              </label>
              {isEmployeeUnlocked ? (
                <button className="secondary" onClick={logoutUser}>Déconnecter le salarié</button>
              ) : (
                <form onSubmit={loginEmployee} className="admin-login">
                  <input type="password" placeholder="Mot de passe salarié" value={employeePassword} onChange={(e) => setEmployeePassword(e.target.value)} />
                  <button>Entrer</button>
                </form>
              )}
              {passwordError && <small className="error">{passwordError}</small>}
            </>
          )}
        </div>
      </header>

      {!canUsePlanning ? (
        <section className="card locked-card">
          <h2>Connexion requise</h2>
          <p>Sélectionnez votre nom, puis entrez votre mot de passe salarié pour afficher et saisir vos horaires.</p>
        </section>
      ) : (
        <>
          <section className="toolbar card">
            <div>
              <label>
                Date
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </label>
              <p>Semaine du <strong>{displayDate(weekStart)}</strong> au <strong>{displayDate(addDays(weekStart, 6))}</strong></p>
            </div>
            <div className="toolbar-actions">
              <button className="secondary" onClick={() => changeWeek(-1)}>Semaine précédente</button>
              <button className="secondary" onClick={() => setSelectedDate(toDateInputValue(new Date()))}>Aujourd'hui</button>
              <button className="secondary" onClick={() => changeWeek(1)}>Semaine suivante</button>
              <button onClick={exportCSV}>Export CSV</button>
            </div>
          </section>

          <nav className="tabs">
            <button className={activeView === 'day' ? 'active' : ''} onClick={() => setActiveView('day')}>Aperçu journalier</button>
            <button className={activeView === 'week' ? 'active' : ''} onClick={() => setActiveView('week')}>Aperçu semaine</button>
            <button className={activeView === 'month' ? 'active' : ''} onClick={() => setActiveView('month')}>Aperçu mensuel</button>
            {isAdmin && <button className={activeView === 'data' ? 'active' : ''} onClick={() => setActiveView('data')}>Données</button>}
          </nav>

          {activeView === 'day' && (
            <section className="card">
              <div className="section-title">
                <h2>{selectedDayLabel} — {displayLongDate(selectedDateObject)}</h2>
                <span className="badge">{visibleEmployeeIndexes.length} salarié{visibleEmployeeIndexes.length > 1 ? 's' : ''}</span>
              </div>
              <div className="table-wrap">
                <table className="compact-table">
                  <thead>
                    <tr><th>Salarié</th><th>Début</th><th>Fin</th><th>Pause</th><th>Guichet</th><th>Total</th><th>Note</th></tr>
                  </thead>
                  <tbody>
                    {visibleEmployeeIndexes.map((employeeIndex) => {
                      const shift = getShift(data, weekKey, employeeIndex, selectedDayKey);
                      return (
                        <tr key={employeeIndex}>
                          <th>{employees[employeeIndex]}</th>
                          <td>{renderTimeSelect(employeeIndex, selectedDayKey, 'start', shift.start)}</td>
                          <td>{renderTimeSelect(employeeIndex, selectedDayKey, 'end', shift.end)}</td>
                          <td>{renderPauseInput(employeeIndex, selectedDayKey, shift)}</td>
                          <td>{renderPlaceSelect(employeeIndex, selectedDayKey, shift)}</td>
                          <td className="total-cell">{formatHours(shiftMinutes(shift))}</td>
                          <td><input value={shift.note || ''} onChange={(e) => updateShift(employeeIndex, selectedDayKey, 'note', e.target.value)} placeholder="Optionnel" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeView === 'week' && (
            <section className="card">
              <div className="section-title">
                <h2>Aperçu semaine</h2>
                <span className="badge">Totaux automatiques</span>
              </div>
              <div className="planning-grid">
                <div className="sticky-left header-cell">Salarié</div>
                {days.map((day, index) => (
                  <div className="day-header" key={day.key}>{day.label}<small>{displayDate(addDays(weekStart, index))}</small></div>
                ))}
                <div className="header-cell total-week">Total semaine</div>

                {visibleEmployeeIndexes.map((employeeIndex) => (
                  <React.Fragment key={employeeIndex}>
                    <div className="sticky-left employee-cell">
                      {isAdmin ? (
                        <input value={employees[employeeIndex]} onChange={(e) => updateEmployeeName(employeeIndex, e.target.value)} />
                      ) : (
                        <strong>{employees[employeeIndex]}</strong>
                      )}
                    </div>
                    {days.map((day) => {
                      const shift = getShift(data, weekKey, employeeIndex, day.key);
                      return (
                        <div className="shift-card" key={`${employeeIndex}-${day.key}`}>
                          <label>Début{renderTimeSelect(employeeIndex, day.key, 'start', shift.start)}</label>
                          <label>Fin{renderTimeSelect(employeeIndex, day.key, 'end', shift.end)}</label>
                          <label>Pause{renderPauseInput(employeeIndex, day.key, shift)}</label>
                          <label>Guichet{renderPlaceSelect(employeeIndex, day.key, shift)}</label>
                          <div className="shift-total">{formatHours(shiftMinutes(shift))}</div>
                        </div>
                      );
                    })}
                    <div className="week-total-cell">{formatHours(weekTotalForEmployee(employeeIndex))}</div>
                  </React.Fragment>
                ))}
              </div>
            </section>
          )}

          {activeView === 'month' && (
            <section className="card">
              <div className="section-title">
                <h2>Aperçu mensuel — {monthKey}</h2>
                <span className="badge">{getWeeksInMonth(selectedDateObject).length} semaines</span>
              </div>
              <div className="table-wrap">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Salarié</th>
                      {getWeeksInMonth(selectedDateObject).map((wk) => <th key={wk}>Semaine du {displayDate(parseDate(wk))}</th>)}
                      <th>Total mois</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleEmployeeIndexes.map((employeeIndex) => (
                      <tr key={employeeIndex}>
                        <th>{employees[employeeIndex]}</th>
                        {getWeeksInMonth(selectedDateObject).map((wk) => <td key={wk}>{formatHours(weekTotalForEmployee(employeeIndex, wk))}</td>)}
                        <td className="total-cell">{formatHours(monthTotalForEmployee(employeeIndex))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeView === 'data' && isAdmin && (
            <section className="card data-page">
              <div className="section-title">
                <div>
                  <h2>Données</h2>
                  <p>Modifiez ici les noms des salariés et les lieux disponibles dans la colonne Guichet.</p>
                </div>
                <span className="badge admin">Admin uniquement</span>
              </div>
              <div className="data-grid">
                <div className="data-block">
                  <div className="data-block-header">
                    <h3>Salariés</h3>
                    <span className="badge muted">20 lignes</span>
                  </div>
                  <div className="settings-list">
                    {employees.map((employee, index) => (
                      <label key={index}>
                        Salarié {index + 1}
                        <input value={employee} onChange={(e) => updateEmployeeName(index, e.target.value)} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="data-block">
                  <div className="data-block-header">
                    <h3>Lieux / guichets</h3>
                    <button onClick={addPlace}>Ajouter un lieu</button>
                  </div>
                  <div className="settings-list">
                    {places.map((place, index) => (
                      <div className="place-row" key={index}>
                        <label>
                          Lieu {index + 1}
                          <input value={place} onChange={(e) => updatePlace(index, e.target.value)} />
                        </label>
                        <button className="secondary danger-button" onClick={() => removePlace(index)}>Supprimer</button>
                      </div>
                    ))}
                  </div>
                  <p className="hint left">Ces lieux apparaissent automatiquement dans le menu déroulant Guichet des vues jour et semaine.</p>
                </div>

                <div className="data-block">
                  <div className="data-block-header">
                    <h3>Minutes décimales</h3>
                    <button onClick={addMinuteDecimal}>Ajouter une valeur</button>
                  </div>
                  <div className="settings-list">
                    {minuteDecimals.map((minuteDecimal, index) => (
                      <div className="place-row" key={index}>
                        <label>
                          Valeur {index + 1}
                          <input value={minuteDecimal} onChange={(e) => updateMinuteDecimal(index, e.target.value)} />
                        </label>
                        <button className="secondary danger-button" onClick={() => removeMinuteDecimal(index)}>Supprimer</button>
                      </div>
                    ))}
                  </div>
                  <p className="hint left">Ces valeurs alimentent la liste déroulante des minutes pour les heures de début et de fin. Exemple : 0,25 correspond à 15 minutes.</p>
                </div>


                <div className="data-block">
                  <div className="data-block-header">
                    <h3>Pauses décimales</h3>
                    <button onClick={addBreakDecimal}>Ajouter une valeur</button>
                  </div>
                  <div className="settings-list">
                    {breakDecimals.map((breakDecimal, index) => (
                      <div className="place-row" key={index}>
                        <label>
                          Pause {index + 1}
                          <input value={breakDecimal} onChange={(e) => updateBreakDecimal(index, e.target.value)} />
                        </label>
                        <button className="secondary danger-button" onClick={() => removeBreakDecimal(index)}>Supprimer</button>
                      </div>
                    ))}
                  </div>
                  <p className="hint left">Ces valeurs alimentent la liste déroulante des pauses. La saisie manuelle reste possible. Exemple : 0,50 correspond à 30 minutes, et le total journalier déduit automatiquement la pause.</p>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <section className="bottom-photo-section" aria-label="Les Bateaux Verts">
        <img src={bottomPagePhoto} alt="Les Bateaux Verts" />
      </section>

      <footer className="footer-note">
        Données sauvegardées dans le navigateur. Pour un vrai accès sécurisé multi-utilisateurs, prévoir une base de données et une authentification côté serveur.
      </footer>
    </div>
  );
}

export default App;
