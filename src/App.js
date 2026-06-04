import { useState, useEffect, useCallback, useRef } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const APP_PASSWORD = process.env.REACT_APP_APP_PASSWORD || "BTV2026#"; // Mot de passe salariés
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "Marius24#"; // Mot de passe administrateur

const EQUIPAGE = [
  "BARBARROUX",
  "CHELAGHA",
  "CLEMENT",
  "CUGNOT",
  "DE VANSSAY",
  "DELTEIL",
  "JOUFFRAIS",
  "LAMAZURE",
  "NICOL",
  "POËNTIS",
  "RAULT",
  "SCHLAUBERG",
  "SLIMANI",
  "BOUILLIS",
  "BOUNEZOUR",
  "CAILLABET",
  "DEBOURG",
  "DEIDIER",
  "PELISSIER",
  "BRION",
  "CAPDEVIELLE",
  "CASTELLY",
  "CICHON",
  "CROZET",
  "FERRON",
  "HAMDELLOU",
  "HELLIN",
  "LEHEMBRE",
  "LOEMBE",
  "MARIN",
  "RAULT D.",
  "RAULT J.",
  "SANCHEZ",
  "SCHMITT",
  "SERVERA",
  "VELLA",
  "ANDRE"
];

const CAPITAINES = EQUIPAGE;
const MARINS = EQUIPAGE;

const BATEAUX = [
  "MARLIN",
  "ESPADON III",
  "GIPSY VI",
  "GIPSY IX",
  "GIPSY X",
  "GIPSY XI",
  "GIPSY XII",
  "GIPSY XIV",
  "GIPSY XV",
  "GIPSY XX",
  "GIPSY XXI",
  "AQUASCOPE",
  "GRIMALDINE I",
  "GRIMALDINE II",
  "ILES D'OR XV",
  "ILES D'OR XIX",
  "ILES D'OR XX",
  "CORSAIRE I",
  "CORSAIRE II"
];


const BATEAUX_MAINTENANCE = [
  "MARLIN",
  "ESPADON III",
  "GIPSY VI",
  "GIPSY IX",
  "GIPSY X",
  "GIPSY XI",
  "GIPSY XII",
  "GIPSY XIV",
  "GIPSY XV",
  "GIPSY XX",
  "GIPSY XXI",
  "AQUASCOPE",
  "GRIMALDINE I",
  "GRIMALDINE II",
  "GUICHET ISSAMBRES",
  "GUICHET MAXIME",
  "GUICHET AQUA",
  "GUICHET PG CAPIT",
  "GUICHET PG Eglise",
  "GUICHET COGOLIN",
  "GUICHET ST-TROPEZ"
];

const PORTS = [
  "Sainte-Maxime",
  "Sainte-Maxime Excu",
  "St-Tropez Vieux Port",
  "St-Tropez Estacade",
  "Les Issambres",
  "Port Grimaud Eglise",
  "Port Grimaud Capit",
  "Cogolin"
];

const PROGRAMMES = [
  "1/2 JOURNEE",
  "1/2 JOURNEE XX",
  "1/2 JOURNEE XXI",
  "3 CAPS",
  "AQUASCOPE",
  "ATELIER",
  "BAIE",
  "BAIE MATIN",
  "BAIE SOIR",
  "BOFO",
  "CALANQUES",
  "CANNES",
  "COMMENTAIRES",
  "EGLISE PG MATIN",
  "EXP",
  "EXP 4",
  "EXP1",
  "EXP2",
  "EXP3",
  "FORMATION",
  "GRIM VOILES MATIN",
  "GRIM VOILES SOIR",
  "GRIMALDINE 1",
  "ISSAMBRES",
  "ISSAMBRES MATIN",
  "ISSAMBRES SOIR",
  "MAX 1",
  "MAX 1M",
  "MAX 1S",
  "MAX 2",
  "MAX 2M",
  "MAX 2S",
  "MAX 3",
  "MAX 4",
  "MAX 4M",
  "MAX 4S",
  "PG EGLISE SOIR",
  "PORQUEROLLES",
  "PORT GRIMAUD",
  "PORT GRIMAUD EST",
  "PORT GRIMAUD VP MATIN",
  "PORT GRIMAUD VP SOIR",
  "RENFORT",
  "RENFORT 1",
  "RENFORT 2",
  "RENFORT 3",
  "RESIDENT",
  "RESIDENT MATIN",
  "RESIDENT SOIR",
  "RUNNER",
  "RUNNER SOIR",
  "SALON CANNES",
  "STAGIAIRE",
  "TAXI"
];


const CHAMPS_DEFAUT = () => ({
  navire: "",
  capitaine_journee: "", capitaine_matin: "", capitaine_aprem: "",
  observation_capitaines: "",
  matelot1_journee: "", matelot2_journee: "", matelot3_journee: "", matelot4_journee: "",
  matelot1_matin: "", matelot2_matin: "", matelot3_matin: "", matelot4_matin: "",
  matelot1_aprem: "", matelot2_aprem: "", matelot3_aprem: "", matelot4_aprem: "",
  observation_matelots: "",
  heure_carburant: "", quantite_carburant: "",
  port: "", port_carburant: "", heure_debut: "", heure_fin: "",
  observation: "",
});

const INFO_GROUPES_DEFAUT = () => ({
  masque: false,
  port_depart: "",
  port_arrivee: "",
  heure_depart: "",
  heure_arrivee: "",
  nombre: "",
  lignes: [],
});

const CHAMPS_MAINTENANCE_DEFAUT = () => ({
  travaux1: "", date_maintenance1: "", importance1: "", etat1: "",
  travaux2: "", date_maintenance2: "", importance2: "", etat2: "",
  travaux3: "", date_maintenance3: "", importance3: "", etat3: "",
  travaux4: "", date_maintenance4: "", importance4: "", etat4: "",
});

const IMPORTANCES = ["Faible", "Moyenne", "Haute", "Urgent"];
const ETATS_MAINTENANCE = ["À venir", "En cours", "Réglé"];

const maintenanceTravauxCount = (j) => [1, 2, 3, 4].filter(n => j[`travaux${n}`] || j[`date_maintenance${n}`] || j[`importance${n}`] || j[`etat${n}`]).length;

const TOTAL_CHAMPS = Object.keys(CHAMPS_DEFAUT()).length;
const TOTAL_CHAMPS_MAINTENANCE = Object.keys(CHAMPS_MAINTENANCE_DEFAUT()).length;

const GROUPES = [
  {
    label: "🚢 Navire", accent: "#38bdf8",
    fields: [
      { key: "navire", label: "Navire", icon: "🚢", type: "boat" },
      { key: "port",   label: "Port",   icon: "⚓", type: "port" },
    ]
  },
  {
    label: "⚓ Capitaines", accent: "#1a6ebd",
    fields: [
      { key: "capitaine_journee", label: "Capitaine Journée", icon: "capitaine", type: "captain", hideKey: "masquer_capitaine_journee" },
      { key: "capitaine_matin",  label: "Capitaine Matin",      icon: "capitaine", type: "captain", hideKey: "masquer_capitaine_matin" },
      { key: "capitaine_aprem", label: "Capitaine Après-midi",  icon: "capitaine", type: "captain", hideKey: "masquer_capitaine_aprem" },
      { key: "observation_capitaines", label: "Observation capitaines", icon: "📝", type: "textarea", placeholder: "Observation liée aux capitaines..." },
    ]
  },
  {
    label: "⚓ Matelots", accent: "#0e9a6a",
    fields: [
      { key: "matelot1_journee", label: "Matelot 1 — Journée", icon: "matelot", type: "marin", hideKey: "masquer_matelot1_journee" },
      { key: "matelot2_journee", label: "Matelot 2 — Journée", icon: "matelot", type: "marin", hideKey: "masquer_matelot2_journee" },
      { key: "matelot3_journee", label: "Matelot 3 — Journée", icon: "matelot", type: "marin", hideKey: "masquer_matelot3_journee" },
      { key: "matelot4_journee", label: "Matelot 4 — Journée", icon: "matelot", type: "marin", hideKey: "masquer_matelot4_journee" },
      { key: "matelot1_matin", label: "Matelot 1 — Matin", icon: "matelot", type: "marin", hideKey: "masquer_matelot1_matin" },
      { key: "matelot1_aprem", label: "Matelot 1 — Après-midi", icon: "matelot", type: "marin", hideKey: "masquer_matelot1_aprem" },
      { key: "matelot2_matin", label: "Matelot 2 — Matin", icon: "matelot", type: "marin", hideKey: "masquer_matelot2_matin" },
      { key: "matelot2_aprem", label: "Matelot 2 — Après-midi", icon: "matelot", type: "marin", hideKey: "masquer_matelot2_aprem" },
      { key: "matelot3_matin", label: "Matelot 3 — Matin", icon: "matelot", type: "marin", hideKey: "masquer_matelot3_matin" },
      { key: "matelot3_aprem", label: "Matelot 3 — Après-midi", icon: "matelot", type: "marin", hideKey: "masquer_matelot3_aprem" },
      { key: "matelot4_matin", label: "Matelot 4 — Matin", icon: "matelot", type: "marin", hideKey: "masquer_matelot4_matin" },
      { key: "matelot4_aprem", label: "Matelot 4 — Après-midi", icon: "matelot", type: "marin", hideKey: "masquer_matelot4_aprem" },
      { key: "observation_matelots", label: "Observation matelots", icon: "📝", type: "textarea", placeholder: "Observation liée aux matelots..." },
    ]
  },
  {
    label: "⛽ Carburant & Moteur", accent: "#d97706",
    fields: [
      { key: "heure_carburant",    label: "Heure carburant",   icon: "🕐", type: "time" },
      { key: "quantite_carburant", label: "Quantité (litres)", icon: "💧", type: "number", placeholder: "ex: 350" },
      { key: "port_carburant", label: "Port", icon: "⚓", type: "port" },
    ]
  },
  {
    label: "🕐 Horaires Journée", accent: "#7c3aed",
    fields: [
      { key: "heure_debut", label: "Heure début", icon: "▶️", type: "time" },
      { key: "heure_fin",   label: "Heure fin",   icon: "⏹️", type: "time" },
    ]
  },
  {
    label: "📝 Observation", accent: "#0891b2",
    fields: [
      { key: "observation", label: "Observation", icon: "📝", type: "textarea", placeholder: "Notes, incident, remarque..." },
    ]
  },
];

const GROUPES_MAINTENANCE = [1, 2, 3, 4].map(n => ({
  label: `🛠️ Travaux ${n}`, accent: "#d97706",
  fields: [
    { key: `travaux${n}`, label: `Travaux ${n}`, icon: "🛠️", type: "textarea", placeholder: "Décrire les travaux à prévoir ou réalisés..." },
    { key: `date_maintenance${n}`, label: "Date", icon: "📅", type: "date" },
    { key: `importance${n}`, label: "Importance", icon: "⚠️", type: "importance" },
    { key: `etat${n}`, label: "État", icon: "✅", type: "etat" },
  ]
}));

// ─── UTILITAIRES ──────────────────────────────────────────────────────────────
const todayKey = () => new Date().toISOString().slice(0, 10);
const tomorrowKey = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};
const dbKey = (b) => b.replace(/[.#$[\]/]/g, "_");

const ASSET_BASE = process.env.PUBLIC_URL || "";
const CAPITAINE_ICON_SRC = `${ASSET_BASE}/icon-capitaine.png`;
const MATELOT_ICON_SRC = `${ASSET_BASE}/icon-matelot.png`;
const BRAND_LOGO_SRC = `${ASSET_BASE}/logo-bateauxverts-white.png`;

const normalizeSearch = (value = "") => value
  .toString()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim();


const toDateAtNoon = (d) => new Date(`${d}T12:00:00`);
const dateKeyFromDate = (d) => d.toISOString().slice(0, 10);
const addDaysToKey = (d, days) => {
  const x = toDateAtNoon(d);
  x.setDate(x.getDate() + days);
  return dateKeyFromDate(x);
};
const startOfWeekKey = (d) => {
  const x = toDateAtNoon(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return dateKeyFromDate(x);
};
const weekDatesFromKey = (d) => {
  const start = startOfWeekKey(d);
  return Array.from({ length: 7 }, (_, i) => addDaysToKey(start, i));
};
const monthDatesFromKey = (d) => {
  const base = toDateAtNoon(d);
  const year = base.getFullYear();
  const month = base.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => dateKeyFromDate(new Date(year, month, i + 1, 12)));
};
const formatDateLabel = (d, options) => toDateAtNoon(d).toLocaleDateString("fr-FR", options);
const parseDataListValue = (text) => Array.from(new Set(String(text || "").split(/\r?\n/).map(v => v.trim()).filter(Boolean)));

function Pictogram({ src, alt = "", size = 14, style = {} }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "-2px",
        marginRight: 6,
        ...style,
      }}
    />
  );
}

function BrandLogo({ size = 40, style = {} }) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt="Les Bateaux Verts"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
        ...style,
      }}
    />
  );
}


const FORMAT_COLORS = {
  rouge: "#ef4444",
  vert: "#4ade80",
  bleu: "#7ec8e3",
  jaune: "#fbbf24",
  orange: "#fbbf24",
};

const stripFormattedText = (value = "") => value
  .toString()
  .replace(/\*\*(.*?)\*\*/g, "$1")
  .replace(/\[(rouge|vert|bleu|jaune|orange)\](.*?)\[\/\1\]/g, "$2");

const formatPreview = (value = "", limit = 70) => {
  const cleaned = stripFormattedText(value);
  return cleaned.length > limit ? `${cleaned.slice(0, limit)}…` : cleaned;
};

function renderFormattedText(value) {
  if (!value) return null;
  const source = value.toString();
  const parts = [];
  const regex = /(\*\*(.*?)\*\*)|\[(rouge|vert|bleu|jaune|orange)\](.*?)\[\/\3\]/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(source)) !== null) {
    if (match.index > lastIndex) parts.push({ text: source.slice(lastIndex, match.index) });
    if (match[2] !== undefined) parts.push({ text: match[2], bold: true });
    else parts.push({ text: match[4], color: FORMAT_COLORS[match[3]] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < source.length) parts.push({ text: source.slice(lastIndex) });
  return parts.map((part, index) => (
    <span key={index} style={{ fontWeight: part.bold ? 900 : undefined, color: part.color || undefined }}>
      {part.text}
    </span>
  ));
}

function RichTextEditor({ value, onChange, disabled, placeholder, accent = "#1a6ebd", rows = 4 }) {
  const textareaRef = useRef(null);

  if (disabled) {
    return (
      <div style={{ background: "#0d1a2c", border: `1px solid ${value ? accent : "#1a3a5c"}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, color: value ? "#dce8f5" : "#1e3a5c", lineHeight: 1.5, whiteSpace: "pre-wrap", minHeight: 44 }}>
        {value ? renderFormattedText(value) : (placeholder || "—")}
      </div>
    );
  }

  const applyWrapper = (prefix, suffix, fallback = "texte") => {
    if (disabled) return;
    const el = textareaRef.current;
    const current = value || "";
    if (!el) {
      onChange(`${current}${prefix}${fallback}${suffix}`);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const selected = current.slice(start, end) || fallback;
    const next = `${current.slice(0, start)}${prefix}${selected}${suffix}${current.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + selected.length;
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const colorButtons = [
    { label: "Rouge", tag: "rouge", color: "#ef4444" },
    { label: "Vert", tag: "vert", color: "#4ade80" },
    { label: "Bleu", tag: "bleu", color: "#7ec8e3" },
    { label: "Jaune", tag: "jaune", color: "#fbbf24" },
  ];

  return (
    <div>
      {!disabled && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 7 }}>
          <button type="button" onClick={() => applyWrapper("**", "**", "texte en gras")}
            style={{ background: "#0c1e30", border: `1px solid ${accent}`, borderRadius: 7, color: "#e8f4ff", padding: "5px 9px", fontSize: 11, fontWeight: 900, cursor: "pointer" }}>
            B Gras
          </button>
          {colorButtons.map(btn => (
            <button key={btn.tag} type="button" onClick={() => applyWrapper(`[${btn.tag}]`, `[/${btn.tag}]`, "texte")}
              style={{ background: "#0c1e30", border: `1px solid ${btn.color}`, borderRadius: 7, color: btn.color, padding: "5px 9px", fontSize: 11, fontWeight: 900, cursor: "pointer" }}>
              {btn.label}
            </button>
          ))}
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value || ""}
        placeholder={placeholder || "Observation"}
        disabled={disabled}
        rows={rows}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", background: disabled ? "#0a1422" : "#0d1a2c",
          border: `1.5px solid ${value ? accent : "#1a3a5c"}`,
          borderRadius: 8, color: value ? "#dce8f5" : "#2a5a7a",
          padding: "10px 12px", fontSize: 14, outline: "none",
          fontFamily: "inherit", opacity: disabled ? 0.7 : 1,
          cursor: disabled ? "default" : "text", resize: "vertical",
          minHeight: 90, lineHeight: 1.45,
        }}
      />
      {!!value && (
        <div style={{ marginTop: 7, background: "#0d1a2c", border: "1px solid #102f4c", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#dce8f5", lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
          {renderFormattedText(value)}
        </div>
      )}
    </div>
  );
}

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────
function Dropdown({ value, onChange, options, placeholder, accent, disabled }) {
  const normalizedOptions = Array.from(new Set([...(options || [])]));
  const listId = `list-${placeholder.replace(/[^a-zA-Z0-9]/g, "-")}-${normalizedOptions.length}`;

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        list={disabled ? undefined : listId}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          width: "100%", background: disabled ? "#0a1422" : "#0d1a2c",
          border: `1.5px solid ${value ? accent : "#1a3a5c"}`,
          borderRadius: 8, color: value ? "#dce8f5" : "#2a5a7a",
          padding: "9px 32px 9px 12px", fontSize: 14, outline: "none",
          boxSizing: "border-box", fontFamily: "inherit",
          cursor: disabled ? "default" : "text",
          opacity: disabled ? 0.6 : 1,
        }}
      />
      {!disabled && <datalist id={listId}>{normalizedOptions.map(o => <option key={o} value={o} />)}</datalist>}
      {!disabled && (
        <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: accent, pointerEvents: "none", fontSize: 10, fontWeight: 800 }}>⌄</span>
      )}
    </div>
  );
}

function AccessScreen({ onAccess }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const handleAccess = () => {
    if (pwd === APP_PASSWORD) {
      sessionStorage.setItem("app_access_ok", "1");
      onAccess();
    } else {
      setErr(true); setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0b1626",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: 20,
    }}>
      <div style={{
        background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 16,
        padding: "40px 36px", width: "100%", maxWidth: 380, textAlign: "center",
        animation: shake ? "shake 0.4s ease" : "none",
      }}>
        <BrandLogo size={96} style={{ margin: "0 auto 16px" }} />
        <h1 style={{ color: "#e8f4ff", fontSize: 20, fontWeight: 800, margin: "0 0 6px" }}>EXPLOITATION</h1>
        <p style={{ color: "#3a6a8a", fontSize: 13, margin: "0 0 28px" }}>Accès salariés</p>
        <input
          type="password" placeholder="Mot de passe" value={pwd}
          onChange={e => { setPwd(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && handleAccess()}
          autoFocus
          style={{
            width: "100%", background: "#0d1a2c",
            border: `1.5px solid ${err ? "#ef4444" : "#1a3a5c"}`,
            borderRadius: 8, color: "#dce8f5", padding: "11px 14px",
            fontSize: 15, outline: "none", boxSizing: "border-box",
            fontFamily: "inherit", marginBottom: 12, textAlign: "center",
            letterSpacing: "0.15em",
          }}
        />
        {err && <p style={{ color: "#ef4444", fontSize: 12, margin: "0 0 12px" }}>Mot de passe incorrect</p>}
        <button onClick={handleAccess} style={{
          width: "100%", background: "#0e4a85", border: "1px solid #1a6ebd",
          borderRadius: 8, color: "#7ec8e3", padding: "11px", fontSize: 15,
          fontWeight: 800, cursor: "pointer",
        }}>
          Entrer →
        </button>
        <p style={{ color: "#1e3a5c", fontSize: 11, marginTop: 20 }}>
          Marius
        </p>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (pwd === ADMIN_PASSWORD) { onLogin(); }
    else {
      setErr(true); setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0b1626",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: 20,
    }}>
      <div style={{
        background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 16,
        padding: "40px 36px", width: "100%", maxWidth: 380, textAlign: "center",
        animation: shake ? "shake 0.4s ease" : "none",
      }}>
        <BrandLogo size={96} style={{ margin: "0 auto 16px" }} />
        <h1 style={{ color: "#e8f4ff", fontSize: 20, fontWeight: 800, margin: "0 0 6px" }}>EXPLOITATION</h1>
        <p style={{ color: "#3a6a8a", fontSize: 13, margin: "0 0 28px" }}>Accès administration</p>
        <input
          type="password" placeholder="Mot de passe" value={pwd}
          onChange={e => { setPwd(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", background: "#0d1a2c",
            border: `1.5px solid ${err ? "#ef4444" : "#1a3a5c"}`,
            borderRadius: 8, color: "#dce8f5", padding: "11px 14px",
            fontSize: 15, outline: "none", boxSizing: "border-box",
            fontFamily: "inherit", marginBottom: 12, textAlign: "center",
            letterSpacing: "0.15em",
          }}
        />
        {err && <p style={{ color: "#ef4444", fontSize: 12, margin: "0 0 12px" }}>Mot de passe incorrect</p>}
        <button onClick={handleLogin} style={{
          width: "100%", background: "#0e4a85", border: "1px solid #1a6ebd",
          borderRadius: 8, color: "#7ec8e3", padding: "11px", fontSize: 15,
          fontWeight: 800, cursor: "pointer",
        }}>
          Connexion →
        </button>
        <p style={{ color: "#1e3a5c", fontSize: 11, marginTop: 20 }}>
          Mot de passe administrateur requis pour modifier
        </p>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App() {
  const [hasAppAccess, setHasAppAccess] = useState(() => sessionStorage.getItem("app_access_ok") === "1");
  const [isAdmin, setIsAdmin]     = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [data, setData]           = useState({});
  const [loading, setLoading]     = useState(true);
  const [activePage, setActivePage] = useState("exploitation");
  const [planningView, setPlanningView] = useState("semaine");
  const [boat, setBoat]           = useState(null);
  const [date, setDate]           = useState(tomorrowKey());
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const [copyStatus, setCopyStatus] = useState("idle"); // idle | copied | empty | same
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [copySourceDate, setCopySourceDate] = useState("");
  const [crewSearch, setCrewSearch] = useState("");
  const [programmeSearch, setProgrammeSearch] = useState("");
  const [dataListDrafts, setDataListDrafts] = useState({ capitaines: "", marins: "", ports: "" });
  const [dataListDirty, setDataListDirty] = useState(false);
  const dataListNewItemRefs = useRef({});
  const horairesFileInputRefs = useRef({});
  const [dataListStatus, setDataListStatus] = useState("idle"); // idle | saving | saved | error
  const [attachmentStatus, setAttachmentStatus] = useState("idle"); // idle | saving | saved | error
  const [horaireImportProgramme, setHoraireImportProgramme] = useState("");
  const pendingChangesRef = useRef({});
  const dataRef = useRef({});
  const isAdminRef = useRef(false);
  const dataListDraftsRef = useRef(dataListDrafts);
  const dataListDirtyRef = useRef(false);


  // Écoute Firebase en temps réel
  useEffect(() => {
    const r = ref(db);
    const unsub = onValue(r, (snap) => {
      setData(snap.val() || {});
      setLoading(false);
    }, (err) => {
      console.error("Firebase error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { pendingChangesRef.current = pendingChanges; }, [pendingChanges]);
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { isAdminRef.current = isAdmin; }, [isAdmin]);
  useEffect(() => { dataListDraftsRef.current = dataListDrafts; }, [dataListDrafts]);
  useEffect(() => { dataListDirtyRef.current = dataListDirty; }, [dataListDirty]);

  const sourcePath = activePage === "maintenance" ? "maintenance" : "journees";
  const sourceData = data?.[sourcePath] || {};
  const hiddenProgrammes = Array.isArray(data?.config?.hidden_programmes) ? data.config.hidden_programmes : [];
  const cleanList = (list, fallback) => Array.isArray(list) ? Array.from(new Set(list.map(v => String(v || "").trim()).filter(Boolean))) : fallback;
  const capitainesList = cleanList(data?.config?.capitaines, CAPITAINES);
  const marinsList = cleanList(data?.config?.marins, MARINS);
  const portsList = cleanList(data?.config?.ports, PORTS);
  const equipageRechercheList = Array.from(new Set([...capitainesList, ...marinsList]));

  useEffect(() => {
    if (dataListDirtyRef.current) return;
    setDataListDrafts({
      capitaines: capitainesList.join("\n"),
      marins: marinsList.join("\n"),
      ports: portsList.join("\n"),
    });
  }, [data?.config?.capitaines, data?.config?.marins, data?.config?.ports, capitainesList, marinsList, portsList]);

  const hideProgramme = async (programme) => {
    if (!isAdmin) return;
    const next = hiddenProgrammes.includes(programme) ? hiddenProgrammes : [...hiddenProgrammes, programme];
    await set(ref(db, "config/hidden_programmes"), next);
    if (boat === programme) setBoat(null);
  };

  const showProgramme = async (programme) => {
    if (!isAdmin) return;
    await set(ref(db, "config/hidden_programmes"), hiddenProgrammes.filter(p => p !== programme));
  };

  const getJ = useCallback((b, d) => {
    const key = dbKey(b);
    const saved = data?.[sourcePath]?.[key]?.[d] || {};
    const pending = pendingChanges?.[sourcePath]?.[key]?.[d] || {};
    const defaults = sourcePath === "maintenance" ? CHAMPS_MAINTENANCE_DEFAUT() : CHAMPS_DEFAUT();
    const merged = { ...defaults, ...saved, ...pending };
    if (sourcePath === "maintenance") {
      // Compatibilité avec les anciennes données sauvegardées avant les 4 parties travaux
      if (!merged.travaux1 && merged.travaux) merged.travaux1 = merged.travaux;
      if (!merged.date_maintenance1 && merged.date_maintenance) merged.date_maintenance1 = merged.date_maintenance;
      if (!merged.importance1 && merged.importance) merged.importance1 = merged.importance;
      if (!merged.etat1 && merged.etat) merged.etat1 = merged.etat;
    }
    return merged;
  }, [data, pendingChanges, sourcePath]);

  const updateField = (b, d, key, val) => {
    if (!isAdmin) return;
    const bk = dbKey(b);
    setPendingChanges(prev => {
      const currentDay = ((prev[sourcePath] || {})[bk] || {})[d] || getJ(b, d);
      return {
        ...prev,
        [sourcePath]: {
          ...(prev[sourcePath] || {}),
          [bk]: { ...((prev[sourcePath] || {})[bk] || {}), [d]: { ...currentDay, [key]: val } }
        }
      };
    });
  };

  const updateFields = (b, d, fields) => {
    if (!isAdmin) return;
    const bk = dbKey(b);
    setPendingChanges(prev => {
      const currentDay = ((prev[sourcePath] || {})[bk] || {})[d] || getJ(b, d);
      return {
        ...prev,
        [sourcePath]: {
          ...(prev[sourcePath] || {}),
          [bk]: { ...((prev[sourcePath] || {})[bk] || {}), [d]: { ...currentDay, ...fields } }
        }
      };
    });
  };

  const savePendingChangesNow = useCallback(async (changesSnapshot = pendingChangesRef.current) => {
    if (!isAdminRef.current || Object.keys(changesSnapshot || {}).length === 0) return false;
    setSaveStatus("saving");
    try {
      const currentData = dataRef.current || {};
      for (const [source, entries] of Object.entries(changesSnapshot)) {
        if (source === "info_groupes") {
          for (const [d, champs] of Object.entries(entries)) {
            const existing = currentData?.info_groupes?.[d] || {};
            await set(ref(db, `info_groupes/${d}`), { ...existing, ...champs });
          }
          continue;
        }
        for (const [bk, dates] of Object.entries(entries)) {
          for (const [d, champs] of Object.entries(dates)) {
            const existing = currentData?.[source]?.[bk]?.[d] || {};
            await set(ref(db, `${source}/${bk}/${d}`), { ...existing, ...champs });
          }
        }
      }
      setPendingChanges(prev => prev === changesSnapshot ? {} : prev);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
      return true;
    } catch (e) {
      console.error(e);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
      return false;
    }
  }, []);

  const saveDataListsNow = useCallback(async () => {
    if (!isAdminRef.current || !dataListDirtyRef.current) return false;
    setDataListStatus("saving");
    try {
      const drafts = dataListDraftsRef.current || {};
      await Promise.all([
        set(ref(db, "config/capitaines"), parseDataListValue(drafts.capitaines)),
        set(ref(db, "config/marins"), parseDataListValue(drafts.marins)),
        set(ref(db, "config/ports"), parseDataListValue(drafts.ports)),
      ]);
      dataListDirtyRef.current = false;
      setDataListDirty(false);
      setDataListStatus("saved");
      setTimeout(() => setDataListStatus("idle"), 2500);
      return true;
    } catch (e) {
      console.error(e);
      setDataListStatus("error");
      setTimeout(() => setDataListStatus("idle"), 3000);
      return false;
    }
  }, []);

  const handleSave = async () => {
    await savePendingChangesNow(pendingChanges);
  };

  useEffect(() => {
    const id = setInterval(() => {
      savePendingChangesNow(pendingChangesRef.current);
      saveDataListsNow();
    }, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [savePendingChangesNow, saveDataListsNow]);

  const handleCancelChanges = () => {
    setPendingChanges({});
    setSaveStatus("idle");
    setCopyStatus("idle");
  };

  const handleCopyFromDate = () => {
    if (!isAdmin || !copySourceDate) return;
    if (copySourceDate === date) {
      setCopyStatus("same");
      setTimeout(() => setCopyStatus("idle"), 2500);
      return;
    }

    const entriesToCopy = Object.entries(sourceData).reduce((acc, [bk, dates]) => {
      if (dates?.[copySourceDate]) acc[bk] = { [date]: dates[copySourceDate] };
      return acc;
    }, {});

    if (Object.keys(entriesToCopy).length === 0) {
      setCopyStatus("empty");
      setTimeout(() => setCopyStatus("idle"), 3000);
      return;
    }

    setPendingChanges(prev => ({
      ...prev,
      [sourcePath]: {
        ...(prev[sourcePath] || {}),
        ...Object.entries(entriesToCopy).reduce((acc, [bk, dates]) => ({
          ...acc,
          [bk]: { ...((prev[sourcePath] || {})[bk] || {}), ...dates }
        }), {})
      }
    }));
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 3000);
  };

  const boatPct = (b) => {
    const j = getJ(b, date);
    const defaults = activePage === "maintenance" ? CHAMPS_MAINTENANCE_DEFAUT() : CHAMPS_DEFAUT();
    const total = activePage === "maintenance" ? TOTAL_CHAMPS_MAINTENANCE : TOTAL_CHAMPS;
    const filled = Object.keys(defaults).filter(k => j[k] && j[k] !== "").length;
    return Math.round((filled / total) * 100);
  };

  const hasPending = Object.keys(pendingChanges).length > 0;
  const today = new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const j = boat ? getJ(boat, date) : null;

  if (!hasAppAccess) return <AccessScreen onAccess={() => setHasAppAccess(true)} />;

  if (showLogin) return <LoginScreen onLogin={() => { setIsAdmin(true); setShowLogin(false); }} />;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0b1626", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#7ec8e3", fontSize: 18 }}><BrandLogo size={30} /><span>Chargement...</span></div>
    </div>
  );

  const saveBtnColor = saveStatus === "saved" ? "#1a5c3a" : saveStatus === "error" ? "#7a1a1a" : "#0e4a85";
  const saveBtnBorder = saveStatus === "saved" ? "#2a8c5a" : saveStatus === "error" ? "#ef4444" : "#1a6ebd";
  const saveBtnText = saveStatus === "saving" ? "⏳ Sauvegarde..." : saveStatus === "saved" ? "✓ Sauvegardé !" : saveStatus === "error" ? "⚠️ Erreur Firebase" : `💾 Sauvegarder${hasPending ? " *" : ""}`;
  const programmesMasques = PROGRAMMES.filter(p => hiddenProgrammes.includes(p));
  const programmesAffiches = PROGRAMMES.filter(p => !hiddenProgrammes.includes(p));
  const isPlanning = activePage === "planning";
  const isHoraires = activePage === "horaires";
  const isDataPage = activePage === "donnees";
  const isMaintenance = activePage === "maintenance";
  const itemsAffiches = isMaintenance ? BATEAUX_MAINTENANCE : programmesAffiches;
  const itemsComplets = isMaintenance ? BATEAUX_MAINTENANCE : PROGRAMMES;
  const pageTitle = isHoraires ? "HORAIRES" : isPlanning ? "PLANNING" : isMaintenance ? "MAINTENANCE" : "EXPLOITATION";
  const itemLabel = isMaintenance ? "bateau" : "programme";
  const itemLabelPlural = isMaintenance ? "bateaux" : "programmes";
  const itemIcon = isHoraires ? "🕐" : isMaintenance ? "🚢" : "📋";
  const programmeSearchQuery = normalizeSearch(programmeSearch);
  const programmeFilteredItems = programmeSearchQuery
    ? itemsAffiches.filter(item => normalizeSearch(item).includes(programmeSearchQuery))
    : itemsAffiches;

  const crewSearchQuery = normalizeSearch(crewSearch);
  const crewFields = [
    { key: "capitaine_journee", hideKey: "masquer_capitaine_journee" },
    { key: "capitaine_matin", hideKey: "masquer_capitaine_matin" },
    { key: "capitaine_aprem", hideKey: "masquer_capitaine_aprem" },
    { key: "matelot1_journee", hideKey: "masquer_matelot1_journee" },
    { key: "matelot2_journee", hideKey: "masquer_matelot2_journee" },
    { key: "matelot3_journee", hideKey: "masquer_matelot3_journee" },
    { key: "matelot4_journee", hideKey: "masquer_matelot4_journee" },
    { key: "matelot1_matin", hideKey: "masquer_matelot1_matin" },
    { key: "matelot2_matin", hideKey: "masquer_matelot2_matin" },
    { key: "matelot3_matin", hideKey: "masquer_matelot3_matin" },
    { key: "matelot4_matin", hideKey: "masquer_matelot4_matin" },
    { key: "matelot1_aprem", hideKey: "masquer_matelot1_aprem" },
    { key: "matelot2_aprem", hideKey: "masquer_matelot2_aprem" },
    { key: "matelot3_aprem", hideKey: "masquer_matelot3_aprem" },
    { key: "matelot4_aprem", hideKey: "masquer_matelot4_aprem" },
  ];

  const getCrewValues = (j) => crewFields
    .filter(f => !j[f.hideKey])
    .map(f => j[f.key])
    .filter(Boolean);

  const crewMatches = (j) => !crewSearchQuery || getCrewValues(j).some(v => normalizeSearch(v).includes(crewSearchQuery));
  const filteredItemsAffiches = (!isMaintenance && crewSearchQuery)
    ? programmeFilteredItems.filter(b => crewMatches(getJ(b, date)))
    : programmeFilteredItems;

  const infoGroupes = {
    ...INFO_GROUPES_DEFAUT(),
    ...(data?.info_groupes?.[date] || {}),
    ...((pendingChanges?.info_groupes || {})[date] || {}),
  };

  const updateInfoGroupes = (key, value) => {
    if (!isAdmin) return;
    setPendingChanges(prev => ({
      ...prev,
      info_groupes: {
        ...(prev.info_groupes || {}),
        [date]: { ...infoGroupes, [key]: value }
      }
    }));
  };

  const openProgrammeSearch = () => {
    const value = programmeSearch.trim();
    if (value) {
      setBoat(value);
      setProgrammeSearch("");
    }
  };

  const renderCrewSearchBox = () => (
    <div style={{ maxWidth: 460, margin: "0 0 16px" }}>
      <label style={{ fontSize: 11, color: "#3a6a8a", fontWeight: 800, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        🔎 Rechercher le programme d’un capitaine ou matelot
      </label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7ec8e3", fontSize: 14, pointerEvents: "none" }}>🔎</span>
        <input
          type="text"
          list="liste-equipage-recherche"
          value={crewSearch}
          onChange={e => setCrewSearch(e.target.value)}
          placeholder="Nom capitaine ou matelot"
          style={{
            width: "100%", background: "#0d1a2c", border: `1.5px solid ${crewSearch ? "#1a6ebd" : "#1a3a5c"}`,
            borderRadius: 8, color: "#dce8f5", padding: "10px 42px 10px 36px", fontSize: 14,
            outline: "none", fontFamily: "inherit",
          }}
        />
        <datalist id="liste-equipage-recherche">
          {equipageRechercheList.map(nom => <option key={nom} value={nom} />)}
        </datalist>
        {crewSearch && (
          <button
            onClick={() => setCrewSearch("")}
            title="Effacer la recherche"
            style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", background: "#0c1e30", border: "1px solid #1a3a5c", borderRadius: 6, color: "#7ec8e3", padding: "3px 8px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
          >×</button>
        )}
      </div>
      {crewSearchQuery && (
        <div style={{ fontSize: 11, color: "#3a6a8a", marginTop: 6, fontWeight: 700 }}>
          Recherche active : {crewSearch}
        </div>
      )}
    </div>
  );


  const renderInfoGroupesBox = () => {
    const infoFields = [
      { key: "port_depart", label: "Port de départ", type: "port", placeholder: "Port de départ" },
      { key: "port_arrivee", label: "Port d’arrivée", type: "port", placeholder: "Port d’arrivée" },
      { key: "heure_depart", label: "Heure départ", type: "time", placeholder: "--:--" },
      { key: "heure_arrivee", label: "Heure de retour", type: "time", placeholder: "--:--" },
      { key: "nombre", label: "Nbre", type: "number", placeholder: "0" },
    ];

    const lignes = Array.isArray(infoGroupes.lignes) ? infoGroupes.lignes : [];
    const emptyLine = () => ({ port_depart: "", port_arrivee: "", heure_depart: "", heure_arrivee: "", nombre: "" });

    const updateInfoLine = (index, key, value) => {
      if (!isAdmin) return;
      const nextLines = [...lignes];
      nextLines[index] = { ...emptyLine(), ...(nextLines[index] || {}), [key]: value };
      updateInfoGroupes("lignes", nextLines);
    };

    const addInfoLine = () => {
      if (!isAdmin) return;
      updateInfoGroupes("lignes", [...lignes, emptyLine()]);
    };

    const removeInfoLine = (index) => {
      if (!isAdmin) return;
      updateInfoGroupes("lignes", lignes.filter((_, i) => i !== index));
    };

    const renderInfoField = (f, value, onChange, keyPrefix = "principal") => (
      <div key={`${keyPrefix}-${f.key}`}>
        <label style={{ fontSize: 10, color: "#3a6a8a", fontWeight: 800, display: "block", marginBottom: 5 }}>{f.label}</label>
        {f.type === "port" ? (
          <>
            <input
              type="text"
              list={`liste-info-groupes-${keyPrefix}-${f.key}`}
              value={value || ""}
              onChange={e => onChange(e.target.value)}
              disabled={!isAdmin}
              placeholder={f.placeholder}
              style={{ width: "100%", background: isAdmin ? "#0d1a2c" : "#0a1422", border: `1.5px solid ${value ? "#1a6ebd" : "#1a3a5c"}`, borderRadius: 8, color: value ? "#dce8f5" : "#2a5a7a", padding: "9px 10px", fontSize: 13, outline: "none", fontFamily: "inherit", opacity: isAdmin ? 1 : 0.75 }}
            />
            <datalist id={`liste-info-groupes-${keyPrefix}-${f.key}`}>
              {portsList.map(port => <option key={port} value={port} />)}
            </datalist>
          </>
        ) : (
          <input
            type={f.type}
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            disabled={!isAdmin}
            placeholder={f.placeholder}
            min={f.type === "number" ? "0" : undefined}
            style={{ width: "100%", background: isAdmin ? "#0d1a2c" : "#0a1422", border: `1.5px solid ${value ? "#1a6ebd" : "#1a3a5c"}`, borderRadius: 8, color: value ? "#dce8f5" : "#2a5a7a", padding: "9px 10px", fontSize: 13, outline: "none", fontFamily: "inherit", opacity: isAdmin ? 1 : 0.75 }}
          />
        )}
      </div>
    );

    if (!isAdmin && infoGroupes.masque) return null;

    return (
      <div style={{ background: "#111c2e", border: `1px solid ${infoGroupes.masque ? "#7a3a1a" : "#1a3a5c"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16, opacity: infoGroupes.masque && isAdmin ? 0.72 : 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "#7ec8e3", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>ℹ️ Info Groupes</div>
            <div style={{ fontSize: 10, color: "#2a5a7a", marginTop: 2 }}>{today}</div>
          </div>
          {isAdmin ? (
            <button
              onClick={() => updateInfoGroupes("masque", !infoGroupes.masque)}
              style={{ background: infoGroupes.masque ? "#0e4a85" : "#2a1608", border: `1px solid ${infoGroupes.masque ? "#1a6ebd" : "#d97706"}`, borderRadius: 8, color: infoGroupes.masque ? "#e8f4ff" : "#fbbf24", padding: "7px 10px", fontSize: 11, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {infoGroupes.masque ? "Afficher" : "Masquer"}
            </button>
          ) : (
            <span style={{ fontSize: 10, color: "#3a6a8a", fontWeight: 800 }}>lecture seule</span>
          )}
        </div>

        {infoGroupes.masque && isAdmin && (
          <div style={{ background: "#2a160822", border: "1px solid #d9770644", borderRadius: 8, color: "#fbbf24", padding: "8px 10px", fontSize: 11, fontWeight: 800, marginBottom: 12 }}>
            Cette case est masquée pour la consultation. Cliquez sur Afficher pour la rendre visible.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10 }}>
          {infoFields.map(f => renderInfoField(f, infoGroupes[f.key] || "", value => updateInfoGroupes(f.key, value)))}
        </div>

        {lignes.length > 0 && (
          <div style={{ marginTop: 12, borderTop: "1px solid #1a3a5c", paddingTop: 12 }}>
            {lignes.map((ligne, index) => (
              <div key={index} style={{ background: "#0d1a2c", border: "1px solid #102f4c", borderRadius: 10, padding: 10, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#7ec8e3", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ligne {index + 2}</div>
                  {isAdmin && (
                    <button
                      onClick={() => removeInfoLine(index)}
                      style={{ background: "#2a0f12", border: "1px solid #7a1a1a", borderRadius: 7, color: "#ef4444", padding: "4px 8px", fontSize: 10, fontWeight: 900, cursor: "pointer" }}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10 }}>
                  {infoFields.map(f => renderInfoField(f, ligne[f.key] || "", value => updateInfoLine(index, f.key, value), `ligne-${index}`))}
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <button
            onClick={addInfoLine}
            style={{ marginTop: 12, background: "#0e4a85", border: "1px solid #1a6ebd", borderRadius: 8, color: "#e8f4ff", padding: "9px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
          >
            + Ajouter une ligne
          </button>
        )}
      </div>
    );
  };


  const hasPlanningData = (j) => Object.keys(CHAMPS_DEFAUT()).some(k => j[k] && j[k] !== "");

  const getVisiblePlanningLines = (j) => {
    const lines = [];
    if (j.navire) lines.push({ icon: "🚢", text: j.navire });
    if (!j.masquer_capitaine_journee && j.capitaine_journee) lines.push({ img: CAPITAINE_ICON_SRC, text: `Journée : ${j.capitaine_journee}` });
    if (!j.masquer_capitaine_matin && j.capitaine_matin) lines.push({ img: CAPITAINE_ICON_SRC, text: `Matin : ${j.capitaine_matin}` });
    if (!j.masquer_capitaine_aprem && j.capitaine_aprem) lines.push({ img: CAPITAINE_ICON_SRC, text: `A-M : ${j.capitaine_aprem}` });
    if (j.observation_capitaines) lines.push({ icon: "📝", text: `Obs. capitaines : ${formatPreview(j.observation_capitaines, 70)}` });

    const matJournee = [j.matelot1_journee, j.matelot2_journee, j.matelot3_journee, j.matelot4_journee].filter((v, i) => v && !j[`masquer_matelot${i + 1}_journee`]);
    const matMatin = [j.matelot1_matin, j.matelot2_matin, j.matelot3_matin, j.matelot4_matin].filter((v, i) => v && !j[`masquer_matelot${i + 1}_matin`]);
    const matAprem = [j.matelot1_aprem, j.matelot2_aprem, j.matelot3_aprem, j.matelot4_aprem].filter((v, i) => v && !j[`masquer_matelot${i + 1}_aprem`]);
    if (matJournee.length) lines.push({ img: MATELOT_ICON_SRC, text: `Journée : ${matJournee.join(" · ")}` });
    if (matMatin.length) lines.push({ img: MATELOT_ICON_SRC, text: `Matin : ${matMatin.join(" · ")}` });
    if (matAprem.length) lines.push({ img: MATELOT_ICON_SRC, text: `A-M : ${matAprem.join(" · ")}` });
    if (j.observation_matelots) lines.push({ icon: "📝", text: `Obs. matelots : ${formatPreview(j.observation_matelots, 70)}` });
    if (j.heure_debut || j.heure_fin) lines.push({ icon: "▶️", text: `${j.heure_debut || "—"}${j.heure_fin ? ` → ${j.heure_fin}` : ""}` });
    if (j.port) lines.push({ icon: "⚓", text: j.port });
    if (j.observation) lines.push({ icon: "📝", text: formatPreview(j.observation, 70) });
    return lines;
  };

  const getPlanningEntriesForDate = (d) => itemsAffiches
    .map(programme => ({ programme, j: getJ(programme, d) }))
    .filter(({ j }) => hasPlanningData(j) && crewMatches(j));

  const PlanningEntry = ({ programme, j, compact = false }) => {
    const lines = getVisiblePlanningLines(j);
    return (
      <div onClick={() => { setBoat(programme); setActivePage("exploitation"); }} style={{ background: "#0d1a2c", border: "1px solid #143456", borderRadius: 9, padding: compact ? "8px 9px" : "10px 11px", cursor: "pointer", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <div style={{ color: "#e8f4ff", fontSize: compact ? 12 : 13, fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📋 {programme}</div>
          {j.navire && <span style={{ color: "#7ec8e3", fontSize: 10, fontWeight: 800, border: "1px solid #1a6ebd66", borderRadius: 20, padding: "1px 6px", flexShrink: 0 }}>{j.navire}</span>}
        </div>
        {!compact && lines.slice(0, 6).map((line, idx) => (
          <div key={idx} style={{ color: "#3a8ab7", fontSize: 11, lineHeight: 1.55, display: "flex", alignItems: "center", gap: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {line.img ? <Pictogram src={line.img} size={11} alt="" /> : <span style={{ width: 17, display: "inline-block" }}>{line.icon}</span>}
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const PlanningPage = () => {
    const weekDates = weekDatesFromKey(date);
    const monthDates = monthDatesFromKey(date);
    const base = toDateAtNoon(date);
    const monthStartOffset = (new Date(base.getFullYear(), base.getMonth(), 1).getDay() + 6) % 7;
    const planningDates = planningView === "semaine" ? weekDates : monthDates;
    const totalEntries = planningDates.reduce((sum, d) => sum + getPlanningEntriesForDate(d).length, 0);

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 24, color: "#e8f4ff", margin: "0 0 8px" }}>📅 Planning</h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0c1e30", border: "1px solid #1a6ebd", borderRadius: 12, color: "#7ec8e3", padding: "9px 14px", fontSize: 20, fontWeight: 900, textTransform: "capitalize" }}>
              {planningView === "semaine"
                ? `Semaine du ${formatDateLabel(weekDates[0], { day: "numeric", month: "long" })} au ${formatDateLabel(weekDates[6], { day: "numeric", month: "long", year: "numeric" })}`
                : formatDateLabel(date, { month: "long", year: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setPlanningView("semaine")} style={{ background: planningView === "semaine" ? "#0e4a85" : "#0c1e30", border: `1px solid ${planningView === "semaine" ? "#1a6ebd" : "#1a3a5c"}`, borderRadius: 8, color: planningView === "semaine" ? "#e8f4ff" : "#5a7a9a", padding: "8px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>Semaine</button>
            <button onClick={() => setPlanningView("mois")} style={{ background: planningView === "mois" ? "#0e4a85" : "#0c1e30", border: `1px solid ${planningView === "mois" ? "#1a6ebd" : "#1a3a5c"}`, borderRadius: 8, color: planningView === "mois" ? "#e8f4ff" : "#5a7a9a", padding: "8px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>Mensuel</button>
          </div>
        </div>

        {renderCrewSearchBox()}

        <div style={{ background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 12, padding: "12px 14px", color: "#7ec8e3", fontSize: 12, fontWeight: 800, marginBottom: 14 }}>
          {totalEntries} programme{totalEntries > 1 ? "s" : ""} renseigné{totalEntries > 1 ? "s" : ""} sur la période affichée{crewSearchQuery ? ` pour ${crewSearch}` : ""}. Cliquez sur un programme pour ouvrir sa fiche.
        </div>

        {planningView === "semaine" ? (
          <div className="planning-week">
            {weekDates.map(d => {
              const entries = getPlanningEntriesForDate(d);
              const isToday = d === todayKey();
              return (
                <div key={d} style={{ minWidth: 170, background: "#111c2e", border: `1px solid ${isToday ? "#1a6ebd" : "#1a3a5c"}`, borderRadius: 12, padding: 12 }}>
                  <div style={{ color: isToday ? "#e8f4ff" : "#7ec8e3", fontSize: 14, fontWeight: 900, textTransform: "capitalize", marginBottom: 3 }}>{formatDateLabel(d, { weekday: "long" })}</div>
                  <div style={{ color: "#3a6a8a", fontSize: 11, fontWeight: 800, marginBottom: 10 }}>{formatDateLabel(d, { day: "numeric", month: "long" })}</div>
                  {entries.length ? entries.map(({ programme, j }) => <PlanningEntry key={programme} programme={programme} j={j} />) : (
                    <div style={{ color: "#1e3a5c", fontSize: 12, fontWeight: 800, padding: "18px 4px" }}>Aucun programme</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="planning-month" style={{ marginBottom: 8 }}>
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
                <div key={day} style={{ color: "#3a6a8a", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 4px" }}>{day}</div>
              ))}
            </div>
            <div className="planning-month">
              {Array.from({ length: monthStartOffset }, (_, i) => <div key={`empty-${i}`} />)}
              {monthDates.map(d => {
                const entries = getPlanningEntriesForDate(d);
                const isToday = d === todayKey();
                return (
                  <div key={d} style={{ minHeight: 120, minWidth: 120, background: "#111c2e", border: `1px solid ${isToday ? "#1a6ebd" : "#1a3a5c"}`, borderRadius: 12, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ color: isToday ? "#e8f4ff" : "#7ec8e3", fontSize: 15, fontWeight: 900 }}>{formatDateLabel(d, { day: "numeric" })}</span>
                      {entries.length > 0 && <span style={{ color: "#fbbf24", fontSize: 10, fontWeight: 900, border: "1px solid #fbbf2444", borderRadius: 20, padding: "1px 6px" }}>{entries.length}</span>}
                    </div>
                    {entries.slice(0, 3).map(({ programme, j }) => <PlanningEntry key={programme} programme={programme} j={j} compact />)}
                    {entries.length > 3 && <div style={{ color: "#3a6a8a", fontSize: 11, fontWeight: 800 }}>+ {entries.length - 3} autre{entries.length - 3 > 1 ? "s" : ""}</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </>
    );
  };


  const getHoraireAttachmentRecord = (programme) => data?.horaires_pieces?.[dbKey(programme)] || null;

  const getHoraireAttachment = (programme) => {
    const record = getHoraireAttachmentRecord(programme);
    if (record?.linkedKey) return data?.horaires_pieces?.[record.linkedKey] || null;
    return record;
  };

  const getHoraireAttachmentSelectedKey = (programme) => {
    const record = getHoraireAttachmentRecord(programme);
    if (record?.linkedKey) return record.linkedKey;
    if (record?.dataUrl) return dbKey(programme);
    return "";
  };

  const getHoraireAttachmentOptions = () => {
    const pieces = data?.horaires_pieces || {};
    return Object.entries(pieces)
      .filter(([, attachment]) => attachment?.dataUrl)
      .map(([key, attachment]) => {
        const programmeName = PROGRAMMES.find(p => dbKey(p) === key) || key;
        return { key, label: `${programmeName} — ${attachment.name || "Pièce jointe"}`, attachment };
      })
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  };

  const assignHoraireAttachment = async (programme, sourceKey) => {
    if (!isAdmin || !programme || !sourceKey) return;
    const sourceAttachment = data?.horaires_pieces?.[sourceKey];
    if (!sourceAttachment?.dataUrl) return;
    setAttachmentStatus("saving");
    try {
      const currentKey = dbKey(programme);
      if (sourceKey === currentKey) {
        await set(ref(db, `horaires_pieces/${currentKey}`), { ...sourceAttachment, linkedKey: null, linkedAt: null });
      } else {
        await set(ref(db, `horaires_pieces/${currentKey}`), {
          linkedKey: sourceKey,
          linkedAt: new Date().toISOString(),
        });
      }
      setAttachmentStatus("saved");
      setTimeout(() => setAttachmentStatus("idle"), 2500);
    } catch (e) {
      console.error(e);
      setAttachmentStatus("error");
      setTimeout(() => setAttachmentStatus("idle"), 3000);
    }
  };

  const renderHoraireAttachmentSelect = (programme, compact = false) => {
    const options = getHoraireAttachmentOptions();
    const selectedKey = getHoraireAttachmentSelectedKey(programme);
    return (
      <select
        value={selectedKey}
        onClick={e => e.stopPropagation()}
        onChange={e => assignHoraireAttachment(programme, e.target.value)}
        disabled={!isAdmin || options.length === 0}
        style={{
          width: "100%",
          background: "#0d1a2c",
          border: "1px solid #1a6ebd",
          borderRadius: 8,
          color: selectedKey ? "#e8f4ff" : "#7ec8e3",
          padding: compact ? "7px 9px" : "10px 12px",
          fontSize: compact ? 11 : 13,
          fontWeight: 800,
          outline: "none",
          cursor: options.length ? "pointer" : "not-allowed",
          fontFamily: "inherit",
        }}
      >
        <option value="">{options.length ? "Choisir une pièce jointe" : "Aucune pièce jointe dans Données"}</option>
        {options.map(option => <option key={option.key} value={option.key}>{option.label}</option>)}
      </select>
    );
  };

  const openAttachment = (attachment) => {
    if (!attachment?.dataUrl) return;
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (win) {
      win.document.write(`<!doctype html><html><head><title>${attachment.name || "Pièce jointe"}</title><style>body{margin:0;background:#0b1626;color:#e8f4ff;font-family:Arial,sans-serif}.top{padding:10px 14px;background:#111c2e;border-bottom:1px solid #1a3a5c}a{color:#7ec8e3}iframe,img{display:block;width:100%;height:calc(100vh - 48px);border:0;object-fit:contain}</style></head><body><div class="top"><strong>${attachment.name || "Pièce jointe"}</strong> · <a href="${attachment.dataUrl}" download="${attachment.name || "piece-jointe"}">Télécharger</a></div>${attachment.type?.startsWith("image/") ? `<img src="${attachment.dataUrl}" alt="${attachment.name || "Pièce jointe"}" />` : `<iframe src="${attachment.dataUrl}"></iframe>`}</body></html>`);
      win.document.close();
    } else {
      window.location.href = attachment.dataUrl;
    }
  };

  const handleHoraireFileChange = (programme, file) => {
    if (!isAdmin || !programme || !file) return;
    if (!/^image\//.test(file.type) && file.type !== "application/pdf") {
      setAttachmentStatus("error");
      setTimeout(() => setAttachmentStatus("idle"), 3000);
      return;
    }
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setAttachmentStatus("error");
      alert("La pièce jointe est trop lourde. Taille maximum : 3 Mo.");
      setTimeout(() => setAttachmentStatus("idle"), 3000);
      return;
    }
    setAttachmentStatus("saving");
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await set(ref(db, `horaires_pieces/${dbKey(programme)}`), {
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: reader.result,
          updatedAt: new Date().toISOString(),
        });
        setAttachmentStatus("saved");
        setTimeout(() => setAttachmentStatus("idle"), 2500);
      } catch (e) {
        console.error(e);
        setAttachmentStatus("error");
        setTimeout(() => setAttachmentStatus("idle"), 3000);
      }
    };
    reader.onerror = () => {
      setAttachmentStatus("error");
      setTimeout(() => setAttachmentStatus("idle"), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleHoraireDrop = (e, programme) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleHoraireFileChange(programme, file);
  };

  const renderHoraireFileInput = (programme, compact = false) => (
    <div
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onPointerDown={e => e.stopPropagation()}
      style={{
        marginTop: compact ? 8 : 12,
        position: "relative",
        zIndex: 50,
        pointerEvents: "auto",
        background: "#0d1a2c",
        border: "2px solid #1a6ebd",
        borderRadius: 9,
        padding: compact ? 8 : 10,
      }}
    >
      <div style={{ fontSize: compact ? 10 : 12, color: "#7ec8e3", fontWeight: 900, marginBottom: 6 }}>
        Importer depuis l’ordinateur
      </div>
      <input
        type="file"
        accept="application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png,image/webp,.webp"
        onClick={e => e.stopPropagation()}
        onChange={e => {
          const file = e.currentTarget.files?.[0];
          if (file) handleHoraireFileChange(programme, file);
          e.currentTarget.value = "";
        }}
        style={{
          all: "revert",
          display: "block",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 9999,
          pointerEvents: "auto",
          cursor: "pointer",
          color: "#ffffff",
          background: "transparent",
          fontSize: compact ? 11 : 14,
        }}
      />
      <div style={{ fontSize: compact ? 10 : 11, color: "#2a5a7a", fontWeight: 700, marginTop: 6, lineHeight: 1.35 }}>
        Cliquez directement sur le bouton natif “Choisir un fichier”.
      </div>
    </div>
  );

  const renderHoraireDropZone = (programme, compact = false) => (
    <div
      onClick={e => e.stopPropagation()}
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={e => handleHoraireDrop(e, programme)}
      style={{
        width: "100%",
        border: "1.5px dashed #1a6ebd",
        borderRadius: 9,
        background: "#0d1a2c",
        color: "#7ec8e3",
        padding: compact ? "7px 9px" : "12px 14px",
        fontSize: compact ? 11 : 12,
        fontWeight: 900,
        textAlign: "center",
        cursor: "copy",
        marginTop: compact ? 6 : 10,
      }}
    >
      📎 Glissez le PDF / image ici
    </div>
  );

  const removeHoraireAttachment = async (programme) => {
    if (!isAdmin || !programme) return;
    setAttachmentStatus("saving");
    try {
      await set(ref(db, `horaires_pieces/${dbKey(programme)}`), null);
      setAttachmentStatus("saved");
      setTimeout(() => setAttachmentStatus("idle"), 2500);
    } catch (e) {
      console.error(e);
      setAttachmentStatus("error");
      setTimeout(() => setAttachmentStatus("idle"), 3000);
    }
  };

  const HorairesPage = () => {
    const statusText = attachmentStatus === "saving" ? "⏳ Sauvegarde..." : attachmentStatus === "saved" ? "✓ Pièce jointe sauvegardée" : attachmentStatus === "error" ? "⚠️ Erreur pièce jointe" : "";
    const horairesItems = filteredItemsAffiches;
    if (!boat) {
      return (
        <>
          <h2 style={{ fontWeight: 900, fontSize: 24, color: "#e8f4ff", margin: "0 0 8px" }}>🕐 Horaires</h2>
          <div style={{ color: "#3a6a8a", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
            Même affichage que la page Exploitation : les programmes masqués n’apparaissent pas. Chaque case contient uniquement le lien vers la pièce jointe permanente du programme.
          </div>
          {renderCrewSearchBox()}
          {statusText && <div style={{ color: attachmentStatus === "error" ? "#ef4444" : "#7ec8e3", fontSize: 12, fontWeight: 900, marginBottom: 12 }}>{statusText}</div>}
          {isAdmin && (
            <div style={{ background: "#111c2e", border: "2px solid #1a6ebd", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
              <div style={{ color: "#e8f4ff", fontSize: 14, fontWeight: 900, marginBottom: 8 }}>📎 Import direct depuis l’ordinateur</div>
              <div style={{ color: "#7ec8e3", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                Choisissez le programme, puis cliquez sur le vrai champ fichier ci-dessous. Cette zone est indépendante des cases programme.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(220px,320px) minmax(280px,520px)", gap: 12, alignItems: "start" }}>
                <select
                  value={horaireImportProgramme}
                  onChange={e => setHoraireImportProgramme(e.target.value)}
                  style={{ background: "#0d1a2c", border: "2px solid #1a6ebd", borderRadius: 9, color: "#e8f4ff", padding: "12px", fontSize: 14, fontWeight: 900, outline: "none", fontFamily: "inherit" }}
                >
                  <option value="">— Choisir un programme —</option>
                  {itemsAffiches.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {horaireImportProgramme ? renderHoraireFileInput(horaireImportProgramme) : (
                  <div style={{ color: "#2a5a7a", fontSize: 12, fontWeight: 800, padding: "13px 0" }}>Sélectionnez d’abord un programme.</div>
                )}
              </div>
            </div>
          )}
          <div className="grid-boats">
            {horairesItems.map(programme => {
              const attachment = getHoraireAttachment(programme);
              return (
                <div key={programme} className="boat-card" style={{ background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 12, padding: "14px 16px", transition: "all 0.15s", minHeight: isAdmin ? 178 : 118 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                    <div style={{ fontWeight: 900, fontSize: 14, color: "#e8f4ff" }}>🕐 {programme}</div>
                    <button type="button" onClick={() => setBoat(programme)} style={{ background: "#0c1e30", border: "1px solid #1a3a5c", borderRadius: 7, color: "#7ec8e3", padding: "5px 8px", fontSize: 10, fontWeight: 900, cursor: "pointer" }}>Détails</button>
                  </div>
                  {attachment ? (
                    <button type="button" onClick={(e) => { e.stopPropagation(); openAttachment(attachment); }} style={{ background: "#0e4a85", border: "1px solid #1a6ebd", borderRadius: 8, color: "#e8f4ff", padding: "8px 10px", fontSize: 12, fontWeight: 900, cursor: "pointer", width: "100%" }}>📎 Ouvrir la pièce jointe</button>
                  ) : (
                    <div style={{ color: "#2a5a7a", fontSize: 12, fontWeight: 800, border: "1px dashed #1a3a5c", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>Aucune pièce jointe</div>
                  )}
                  {isAdmin && (
                    <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                      <div style={{ flex: "1 1 160px" }}>{renderHoraireAttachmentSelect(programme, true)}</div>
                      {renderHoraireFileInput(programme, true)}
                      {renderHoraireDropZone(programme, true)}
                      {attachment && (
                        <button type="button" onClick={() => removeHoraireAttachment(programme)} style={{ flex: "0 0 auto", background: "#2a0f12", border: "1px solid #7a1a1a", borderRadius: 8, color: "#ef4444", padding: "8px 10px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>Supprimer</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      );
    }

    const attachment = getHoraireAttachment(boat);
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
          <div style={{ width: 46, height: 46, borderRadius: 10, background: "linear-gradient(135deg,#1a6ebd,#0a3a70)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🕐</div>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 22, color: "#e8f4ff", margin: 0 }}>{boat}</h2>
            <div style={{ fontSize: 12, color: "#3a6a8a", marginTop: 4 }}>Pièce jointe permanente — visible tous les jours jusqu’à remplacement ou suppression.</div>
          </div>
          {statusText && <span style={{ marginLeft: "auto", color: attachmentStatus === "error" ? "#ef4444" : "#7ec8e3", fontSize: 12, fontWeight: 900 }}>{statusText}</span>}
        </div>

        <div style={{ background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 12, padding: "18px", maxWidth: 760 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#7ec8e3", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>📎 Pièce jointe horaires</div>
          {attachment ? (
            <div style={{ background: "#0d1a2c", border: "1px solid #1a3a5c", borderRadius: 10, padding: "14px", marginBottom: 14 }}>
              <div style={{ color: "#e8f4ff", fontWeight: 900, marginBottom: 4 }}>{attachment.name || "Pièce jointe"}</div>
              <div style={{ color: "#3a6a8a", fontSize: 12, marginBottom: 12 }}>{attachment.type || "fichier"}{attachment.size ? ` · ${Math.round(attachment.size / 1024)} Ko` : ""}</div>
              <button type="button" onClick={() => openAttachment(attachment)} style={{ background: "#0e4a85", border: "1px solid #1a6ebd", borderRadius: 8, color: "#e8f4ff", padding: "10px 14px", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>Ouvrir la pièce jointe</button>
            </div>
          ) : (
            <div style={{ background: "#0d1a2c", border: "1px dashed #1a3a5c", borderRadius: 10, padding: "18px", color: "#2a5a7a", fontWeight: 800, marginBottom: 14 }}>Aucune pièce jointe pour ce programme.</div>
          )}

          {isAdmin && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: "1 1 320px", maxWidth: 480 }}>{renderHoraireAttachmentSelect(boat)}</div>
              <div style={{ flex: "1 1 320px", maxWidth: 480 }}>{renderHoraireFileInput(boat)}</div>
              {renderHoraireDropZone(boat)}
              {attachment && <button type="button" onClick={() => removeHoraireAttachment(boat)} style={{ background: "#2a0f12", border: "1px solid #7a1a1a", borderRadius: 8, color: "#ef4444", padding: "10px 14px", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>Supprimer</button>}
            </div>
          )}
        </div>
      </>
    );
  };


  const parseDataList = (text) => Array.from(new Set(String(text || "").split(/\r?\n/).map(v => v.trim()).filter(Boolean)));

  const handleSaveDataLists = async () => {
    await saveDataListsNow();
  };

  const resetDataListsToFirebase = () => {
    setDataListDrafts({
      capitaines: capitainesList.join("\n"),
      marins: marinsList.join("\n"),
      ports: portsList.join("\n"),
    });
    dataListDirtyRef.current = false;
    setDataListDirty(false);
    setDataListStatus("idle");
  };

  const addDataListItem = (field) => {
    const input = dataListNewItemRefs.current[field];
    const raw = input?.value || "";
    const itemsToAdd = raw.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
    if (itemsToAdd.length === 0) return;

    setDataListDrafts(prev => {
      const existing = parseDataListValue(prev[field]);
      const merged = [...itemsToAdd, ...existing.filter(v => !itemsToAdd.includes(v))];
      return { ...prev, [field]: merged.join("\n") };
    });
    dataListDirtyRef.current = true;
    setDataListDirty(true);
    if (input) {
      input.value = "";
      input.focus();
    }
    setDataListStatus("idle");
  };


  const renderHorairesAttachmentsEditor = () => {
    const programmesHoraires = PROGRAMMES.filter(p => !hiddenProgrammes.includes(p));
    const totalPieces = programmesHoraires.filter(p => !!getHoraireAttachment(p)).length;
    return (
      <div style={{ background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 14, color: "#e8f4ff", fontWeight: 900 }}>🕐 Horaires</div>
            <div style={{ fontSize: 11, color: "#3a6a8a", fontWeight: 700, marginTop: 3 }}>{totalPieces} pièce{totalPieces > 1 ? "s" : ""} jointe{totalPieces > 1 ? "s" : ""}</div>
          </div>
        </div>

        <div style={{ color: "#2a5a7a", fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
          Cliquez sur <strong style={{ color: "#7ec8e3" }}>+</strong> pour sélectionner un PDF ou une image depuis l’ordinateur. La pièce jointe reste liée au programme jusqu’à remplacement ou suppression.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "62vh", overflowY: "scroll", WebkitOverflowScrolling: "touch", paddingRight: 8 }}>
          {programmesHoraires.map(programme => {
            const attachment = getHoraireAttachment(programme);
            return (
              <div key={programme} onDragOver={e => { e.preventDefault(); e.stopPropagation(); }} onDrop={e => handleHoraireDrop(e, programme)} style={{ background: "#0d1a2c", border: "1px solid #1a3a5c", borderRadius: 9, padding: "9px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ color: "#e8f4ff", fontWeight: 900, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🕐 {programme}</div>
                    <div style={{ color: attachment ? "#7ec8e3" : "#2a5a7a", fontSize: 10, fontWeight: 700, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {attachment ? attachment.name || "Pièce jointe" : "Aucune pièce jointe"}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <div style={{ flexBasis: "100%", width: "100%" }}>{renderHoraireFileInput(programme, true)}</div>
                    {attachment && (
                      <>
                        <button type="button" title="Ouvrir" onClick={() => openAttachment(attachment)} style={{ width: 30, height: 30, background: "#0c1e30", border: "1px solid #1a3a5c", borderRadius: 8, color: "#7ec8e3", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>↗</button>
                        <button type="button" title="Supprimer" onClick={() => removeHoraireAttachment(programme)} style={{ width: 30, height: 30, background: "#2a0f12", border: "1px solid #7a1a1a", borderRadius: 8, color: "#ef4444", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>×</button>
                      </>
                    )}
                  </div>
                </div>
                {renderHoraireDropZone(programme, true)}
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 11, color: "#2a5a7a", marginTop: 8, lineHeight: 1.5 }}>
          Les programmes masqués dans Exploitation n’apparaissent pas dans cette colonne.
        </div>
      </div>
    );
  };

  const renderDataListEditor = ({ title, icon, value, field, count, help }) => (
    <div style={{ background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 14, color: "#e8f4ff", fontWeight: 900 }}>{icon} {title}</div>
          <div style={{ fontSize: 11, color: "#3a6a8a", fontWeight: 700, marginTop: 3 }}>{count} élément{count > 1 ? "s" : ""}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "stretch", gap: 8, marginBottom: 10 }}>
        <input
          type="text"
          ref={el => { dataListNewItemRefs.current[field] = el; }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addDataListItem(field);
            }
          }}
          placeholder={`Ajouter ${title.toLowerCase().slice(0, -1)} en haut`}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1, minWidth: 0, background: "#0d1a2c", border: "1.5px solid #1a6ebd", borderRadius: 8,
            color: "#dce8f5", padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit",
          }}
        />
        <button
          type="button"
          onClick={() => addDataListItem(field)}
          style={{ background: "#0e4a85", border: "1px solid #1a6ebd", borderRadius: 8, color: "#fff", padding: "0 12px", fontSize: 12, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}
        >+ Ajouter</button>
      </div>

      <textarea
        value={value}
        onChange={e => {
          dataListDirtyRef.current = true;
          setDataListDirty(true);
          setDataListDrafts(prev => ({ ...prev, [field]: e.target.value }));
        }}
        rows={14}
        spellCheck={false}
        placeholder="Un élément par ligne"
        style={{
          width: "100%", background: "#0d1a2c", border: "1.5px solid #1a3a5c", borderRadius: 8,
          color: "#dce8f5", padding: "11px 12px", fontSize: 14, outline: "none", fontFamily: "inherit",
          resize: "vertical", minHeight: 340, maxHeight: "62vh", lineHeight: 1.55, overflowY: "scroll", WebkitOverflowScrolling: "touch",
        }}
      />
      <div style={{ fontSize: 11, color: "#2a5a7a", marginTop: 8, lineHeight: 1.5 }}>{help}</div>
    </div>
  );

  const DataPage = () => {
    const counts = {
      capitaines: parseDataListValue(dataListDrafts.capitaines).length,
      marins: parseDataListValue(dataListDrafts.marins).length,
      ports: parseDataListValue(dataListDrafts.ports).length,
    };
    const statusText = dataListStatus === "saving" ? "⏳ Sauvegarde..." : dataListStatus === "saved" ? "✓ Listes sauvegardées" : dataListStatus === "error" ? "⚠️ Erreur Firebase" : dataListDirty ? "⏱ Sauvegarde auto sous 10 min" : "✓ Listes à jour";
    const statusBg = dataListStatus === "saved" ? "#1a5c3a" : dataListStatus === "error" ? "#7a1a1a" : "#0e4a85";
    const statusBorder = dataListStatus === "saved" ? "#2a8c5a" : dataListStatus === "error" ? "#ef4444" : "#1a6ebd";

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 24, color: "#e8f4ff", margin: "0 0 6px" }}>⚙️ Données</h2>
            <p style={{ color: "#3a6a8a", fontSize: 13, margin: 0, fontWeight: 700 }}>Gestion des listes utilisées dans les champs de saisie.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button onClick={resetDataListsToFirebase} style={{ background: "#1f2937", border: "1px solid #4b5563", borderRadius: 8, color: "#d1d5db", padding: "9px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>↩ Annuler</button>
            <button onClick={handleSaveDataLists} style={{ background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: 8, color: "#fff", padding: "9px 14px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>{statusText}</button>
          </div>
        </div>

        <div style={{ background: "#101d33", border: "1px solid #1a6ebd", borderRadius: 10, padding: "10px 14px", color: "#7ec8e3", fontSize: 12, lineHeight: 1.55, marginBottom: 16 }}>
          Écrivez le nom complet dans le champ <strong>Ajouter</strong>, puis appuyez sur Entrée ou cliquez sur <strong>+ Ajouter</strong>. L’élément est placé en haut de la colonne. Vous pouvez aussi modifier directement la liste : <strong>un élément par ligne</strong>. Après sauvegarde, les nouvelles listes sont utilisées dans les champs avec saisie libre et dans la recherche équipage.
        </div>

        <div className="grid-fields">
          {renderDataListEditor({ title: "Capitaines", icon: "⚓", field: "capitaines", value: dataListDrafts.capitaines, count: counts.capitaines, help: "Liste utilisée pour Capitaine journée, Capitaine matin et Capitaine après-midi." })}
          {renderDataListEditor({ title: "Matelots", icon: "👥", field: "marins", value: dataListDrafts.marins, count: counts.marins, help: "Liste utilisée pour tous les matelots : journée, matin et après-midi." })}
          {renderDataListEditor({ title: "Ports", icon: "📍", field: "ports", value: dataListDrafts.ports, count: counts.ports, help: "Liste utilisée pour le port du navire et le port carburant." })}
          {renderHorairesAttachmentsEditor()}
        </div>
      </>
    );
  };

  const switchPage = (page) => {
    setActivePage(page);
    setBoat(null);
    setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b1626", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#dce8f5", display: "flex", flexDirection: "column" }}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{margin:0}
        .sidebar{width:220px;background:#0a1524;border-right:1px solid #1a3a5c;overflow-y:auto;flex-shrink:0}
        .grid-boats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
        .grid-fields{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
        .recap-wrap{display:flex;flex-wrap:wrap;gap:20px}
        .planning-week{display:grid;grid-template-columns:repeat(7,minmax(170px,1fr));gap:12px;overflow-x:auto;padding-bottom:6px}
        .planning-month{display:grid;grid-template-columns:repeat(7,minmax(120px,1fr));gap:10px;overflow-x:auto;padding-bottom:6px}
        .boat-card:hover{border-color:#1a6ebd!important;background:#0e1e35!important}
        select option{background:#111c2e}
        .save-fab{display:none;position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:200}
        @media(max-width:640px){
          .app-header{height:auto!important;min-height:60px!important;padding:8px 10px!important;align-items:flex-start!important;flex-wrap:wrap!important;gap:8px!important}
          .header-left{width:100%!important;gap:6px!important;align-items:flex-start!important;flex-wrap:wrap!important}
          .brand-mark{display:none!important}
          .main-nav-wrap{flex:1!important;min-width:0!important;width:calc(100% - 42px)!important}
          .main-nav{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important;width:100%!important}
          .main-nav button{font-size:9px!important;padding:6px 3px!important;letter-spacing:0!important;white-space:nowrap!important;min-width:0!important}
          .app-title{display:none!important}
          .header-actions{width:100%!important;justify-content:space-between!important;gap:5px!important;flex-wrap:wrap!important}
          .header-actions input[type=date]{min-width:124px!important;max-width:150px!important;font-size:13px!important;padding:6px 7px!important}
          .header-actions button{font-size:10px!important;padding:5px 8px!important}
          .header-actions span{font-size:10px!important;padding:3px 7px!important}
          .sidebar{position:fixed!important;left:0;top:108px;height:calc(100vh - 108px);z-index:300;transform:translateX(-100%);transition:transform .22s cubic-bezier(.4,0,.2,1)}
          .sidebar.open{transform:translateX(0)}
          .grid-boats{grid-template-columns:1fr 1fr}
          .grid-fields{grid-template-columns:1fr}
          .exploitation-tools{grid-template-columns:1fr!important}
          .planning-week,.planning-month{grid-template-columns:1fr}
          .main-pad{padding:14px 14px 90px!important}
          .save-fab{display:flex!important}
          .recap-wrap{gap:14px}
        }
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
      `}</style>

      {/* HEADER */}
      <header className="app-header" style={{
        background: "linear-gradient(90deg,#0b1d31,#0d294d)", borderBottom: "1px solid #1a3a5c",
        padding: "0 16px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100, flexShrink: 0,
      }}>
        <div className="header-left" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ background: "none", border: "none", color: "#7ec8e3", fontSize: 22, cursor: "pointer", padding: "4px 6px", borderRadius: 6 }}>☰</button>
          <BrandLogo size={30} style={{ flexShrink: 0 }} />
          <div className="main-nav-wrap">
            <div className="main-nav" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {[
                { key: "exploitation", label: "EXPLOITATION" },
                { key: "planning", label: "PLANNING" },
                { key: "horaires", label: "HORAIRES" },
                { key: "maintenance", label: "MAINTENANCE" },
                ...(isAdmin ? [{ key: "donnees", label: "DONNÉES" }] : []),
              ].map(tab => (
                <button key={tab.key} onClick={() => switchPage(tab.key)}
                  style={{
                    background: activePage === tab.key ? "#0e4a85" : "#0c1e30",
                    border: `1px solid ${activePage === tab.key ? "#1a6ebd" : "#1a3a5c"}`,
                    borderRadius: 7, color: activePage === tab.key ? "#e8f4ff" : "#5a7a9a",
                    padding: "4px 8px", fontSize: 11, fontWeight: 800, cursor: "pointer",
                    letterSpacing: "0.03em", fontFamily: "inherit",
                  }}
                >{tab.label}</button>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "#2a5a7a" }}>{itemsComplets.length} {itemLabelPlural}</div>
          </div>
        </div>
        <div className="app-title" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          fontSize: 11, color: "#3a6a8a", fontWeight: 700, letterSpacing: "0.08em",
          opacity: 0.75, pointerEvents: "none", textTransform: "uppercase",
        }}>
          Marius
        </div>

        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            title={today}
            style={{ background: "#0c1e30", border: "1px solid #1a6ebd", borderRadius: 8, color: "#e8f4ff", padding: "7px 10px", fontSize: 15, fontWeight: 800, outline: "none", minWidth: 150 }} />

          {!isAdmin ? (
            <button onClick={() => setShowLogin(true)}
              style={{ background: "#0c1e30", border: "1px solid #1a3a5c", borderRadius: 7, color: "#5a7a9a", padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
              🔐 Admin
            </button>
          ) : (
            <>
              <span style={{ fontSize: 11, color: "#0e9a6a", fontWeight: 700, border: "1px solid #0e9a6a44", borderRadius: 20, padding: "3px 10px" }}>✓ Admin</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#0d1a2c", border: "1px solid #1a3a5c", borderRadius: 7, padding: "3px 5px" }}>
                  <span style={{ fontSize: 10, color: "#3a6a8a", fontWeight: 800 }}>Depuis</span>
                  <input type="date" value={copySourceDate} onChange={e => setCopySourceDate(e.target.value)}
                    style={{ background: "#0c1e30", border: "1px solid #1a3a5c", borderRadius: 5, color: "#7ec8e3", padding: "3px 5px", fontSize: 11, outline: "none" }} />
                  <button onClick={handleCopyFromDate}
                    style={{ background: "#0e4a85", border: "1px solid #1a6ebd", borderRadius: 5, color: "#fff", padding: "3px 8px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                    📋 Copier
                  </button>
                </div>
              {hasPending && (
                <button onClick={handleSave}
                  style={{ background: saveBtnColor, border: `1px solid ${saveBtnBorder}`, borderRadius: 7, color: "#fff", padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", minWidth: 100 }}>
                  {saveBtnText}
                </button>
              )}
              {hasPending && (
                <button onClick={handleCancelChanges}
                  style={{ background: "#1f2937", border: "1px solid #4b5563", borderRadius: 7, color: "#d1d5db", padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  ↩ Annuler
                </button>
              )}
              <button onClick={async () => { await savePendingChangesNow(pendingChangesRef.current); await saveDataListsNow(); setIsAdmin(false); if (activePage === "donnees") setActivePage("exploitation"); }}
                style={{ background: "none", border: "1px solid #3a1a1a", borderRadius: 7, color: "#7a3a3a", padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>
                Déconnexion
              </button>
            </>
          )}
          {boat && (
            <button onClick={() => setBoat(null)}
              style={{
                background: "#0e4a85",
                border: "2px solid #38bdf8",
                borderRadius: 9,
                color: "#e8f4ff",
                padding: "8px 15px",
                fontSize: 14,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 0 12px #1a6ebd55",
                letterSpacing: "0.02em",
              }}>
              🏠 Accueil
            </button>
          )}
        </div>
      </header>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "#00000077", zIndex: 200, top: 60 }} />
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div style={{ padding: "12px 14px 6px", fontSize: 9, fontWeight: 800, color: "#2a5a7a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {filteredItemsAffiches.length} {itemLabelPlural} affichés
          </div>
          {isAdmin && !isMaintenance && programmesMasques.length > 0 && (
            <div style={{ padding: "0 14px 10px" }}>
              <label style={{ display: "block", fontSize: 9, color: "#2a5a7a", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>
                Démasquer un programme
              </label>
              <select
                value=""
                onChange={e => {
                  if (e.target.value) showProgramme(e.target.value);
                }}
                style={{
                  width: "100%", background: "#0c1e30", border: "1px solid #1a3a5c",
                  borderRadius: 7, color: "#7ec8e3", padding: "6px 8px", fontSize: 10,
                  fontWeight: 700, cursor: "pointer", outline: "none", fontFamily: "inherit",
                }}
              >
                <option value="">{programmesMasques.length} masqué{programmesMasques.length > 1 ? "s" : ""}</option>
                {programmesMasques.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          {filteredItemsAffiches.map(b => {
            const isSelected = boat === b;
            const jj = getJ(b, date);
            return (
              <div key={b} onClick={() => { setBoat(b); setSidebarOpen(false); }}
                style={{ padding: "10px 14px", cursor: "pointer", borderLeft: `3px solid ${isSelected ? "#1a6ebd" : "transparent"}`, background: isSelected ? "#0c1e35" : "transparent", borderBottom: "1px solid #0d1e2e", transition: "background 0.1s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0, flex: 1 }}>
                    {isAdmin && !isMaintenance && (
                      <input
                        type="checkbox"
                        checked={false}
                        title="Cocher pour masquer ce programme"
                        onClick={e => e.stopPropagation()}
                        onChange={() => hideProgramme(b)}
                        style={{ accentColor: "#1a6ebd", cursor: "pointer", flexShrink: 0 }}
                      />
                    )}
                    <span style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#e8f4ff" : "#8ab0cc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{itemIcon} {b}</span>
                  </div>
                </div>
                {isMaintenance ? (
                  <>
                    {maintenanceTravauxCount(jj) > 0 && (
                      <div style={{ fontSize: 10, color: "#4a7a9a", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        🛠️ {maintenanceTravauxCount(jj)} travaux renseigné{maintenanceTravauxCount(jj) > 1 ? "s" : ""}
                      </div>
                    )}
                    {(jj.importance1 || jj.etat1) && (
                      <div style={{ fontSize: 10, color: "#2a5a7a", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        T1 : {jj.importance1 || "—"} / {jj.etat1 || "—"}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {jj.navire && (
                      <div style={{ fontSize: 10, color: "#4a7a9a", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        🚢 {jj.navire}
                      </div>
                    )}
                    {((!jj.masquer_capitaine_journee) && jj.capitaine_journee) && (
                      <div style={{ fontSize: 10, color: "#2a5a7a", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
                        <Pictogram src={CAPITAINE_ICON_SRC} alt="Capitaine" size={12} />{jj.capitaine_journee?.split(" ")[0]}
                      </div>
                    )}
                    {(((!jj.masquer_capitaine_matin) && jj.capitaine_matin) || ((!jj.masquer_capitaine_aprem) && jj.capitaine_aprem)) && (
                      <div style={{ fontSize: 10, color: "#2a5a7a", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {(!jj.masquer_capitaine_matin) ? (jj.capitaine_matin?.split(" ")[0] || "—") : "—"} / {(!jj.masquer_capitaine_aprem) ? (jj.capitaine_aprem?.split(" ")[0] || "—") : "—"}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </aside>

        {/* MAIN */}
        <main className="main-pad" style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>


          {isAdmin && copyStatus !== "idle" && (
            <div style={{ background: copyStatus === "copied" ? "#0c1e10" : "#2a1e0c", border: `1px solid ${copyStatus === "copied" ? "#1a5c2a" : "#7a5a1a"}`, borderRadius: 8, padding: "8px 14px", marginBottom: 18, fontSize: 12, color: copyStatus === "copied" ? "#4ade80" : "#fbbf24" }}>
              {copyStatus === "copied" ? "📋 Planning copié en modifications en attente. Cliquez sur Sauvegarder pour valider." : copyStatus === "same" ? "⚠️ La date source est identique à la date affichée." : "⚠️ Aucun planning trouvé à copier pour cette date."}
            </div>
          )}

          {isAdmin && hasPending && (
            <div style={{ background: "#101d33", border: "1px solid #1a6ebd", borderRadius: 8, padding: "8px 14px", marginBottom: 18, fontSize: 12, color: "#7ec8e3", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              ✏️ Modifications non sauvegardées.
              <button onClick={handleSave} style={{ background: saveBtnColor, border: `1px solid ${saveBtnBorder}`, borderRadius: 6, color: "#fff", padding: "4px 10px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>{saveBtnText}</button>
              <button onClick={handleCancelChanges} style={{ background: "#1f2937", border: "1px solid #4b5563", borderRadius: 6, color: "#d1d5db", padding: "4px 10px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>↩ Annuler</button>
            </div>
          )}

          {isDataPage && isAdmin ? (
            <DataPage />
          ) : isPlanning ? (
            <PlanningPage />
          ) : isHoraires ? (
            <HorairesPage />
          ) : !boat ? (
            <>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#e8f4ff", marginBottom: 6 }}>
                {pageTitle}
              </h2>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0c1e30", border: "1px solid #1a6ebd", borderRadius: 12, color: "#7ec8e3", padding: "9px 14px", fontSize: 22, fontWeight: 900, textTransform: "capitalize", marginBottom: 12 }}>
                📅 {today}
              </div>
              <div className="exploitation-tools" style={{ display: "grid", gridTemplateColumns: "minmax(280px,520px)", gap: 16, alignItems: "start", marginBottom: 20 }}>
                <div>
              {!isMaintenance && renderCrewSearchBox()}
                                <p style={{ color: "#2a5a7a", fontSize: 12, marginBottom: 12 }}>Choisissez dans la liste déroulante complète ou cliquez sur l’un des éléments affichés{isMaintenance ? "." : isAdmin ? ". Dans la colonne de gauche, cochez un programme pour le masquer pour tout le monde." : "."}</p>
              <div style={{ maxWidth: 420, marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: "#3a6a8a", fontWeight: 700, display: "block", marginBottom: 6 }}>{itemIcon} {isMaintenance ? "Bateau" : "Programme"}</label>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7ec8e3", fontSize: 14, pointerEvents: "none" }}>🔎</span>
                    <input
                      type="text"
                      list="liste-programmes"
                      value={programmeSearch}
                      placeholder={isMaintenance ? "Rechercher ou écrire un bateau" : "Rechercher ou écrire un programme"}
                      onChange={e => setProgrammeSearch(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          openProgrammeSearch();
                        }
                      }}
                      style={{
                        width: "100%", background: "#0d1a2c", border: `1.5px solid ${programmeSearch ? "#1a6ebd" : "#1a3a5c"}`,
                        borderRadius: 8, color: "#7ec8e3", padding: "10px 38px 10px 36px", fontSize: 14,
                        outline: "none", fontFamily: "inherit", cursor: "text",
                      }}
                    />
                    {programmeSearch && (
                      <button
                        type="button"
                        onClick={() => setProgrammeSearch("")}
                        title="Effacer"
                        style={{
                          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                          background: "#0c1e30", border: "1px solid #1a3a5c", borderRadius: 6,
                          color: "#7ec8e3", width: 24, height: 24, cursor: "pointer", fontWeight: 900,
                        }}
                      >×</button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={openProgrammeSearch}
                    disabled={!programmeSearch.trim()}
                    style={{
                      background: programmeSearch.trim() ? "#0e4a85" : "#0c1e30",
                      border: `1px solid ${programmeSearch.trim() ? "#1a6ebd" : "#1a3a5c"}`,
                      borderRadius: 8, color: programmeSearch.trim() ? "#e8f4ff" : "#3a6a8a",
                      padding: "0 14px", fontSize: 12, fontWeight: 900, cursor: programmeSearch.trim() ? "pointer" : "default",
                      fontFamily: "inherit", whiteSpace: "nowrap",
                    }}
                  >Ouvrir</button>
                </div>
                <datalist id="liste-programmes">
                  {itemsComplets.map(p => <option key={p} value={p} />)}
                </datalist>
                <div style={{ fontSize: 10, color: "#2a5a7a", marginTop: 6 }}>
                  Tapez librement un nom complet, choisissez une suggestion ou cliquez sur Ouvrir. La grille se filtre pendant la saisie.
                </div>
              </div>

                </div>
              </div>
              <div className="grid-boats">
                {filteredItemsAffiches.map(b => {
                  const jj = getJ(b, date);
                  return (
                    <div key={b} className="boat-card" onClick={() => setBoat(b)}
                      style={{ background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#dce8f5" }}>{itemIcon} {b}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#3a6a8a", lineHeight: 1.8 }}>
                        {isMaintenance ? (
                          <>
                            <div>🛠️ {maintenanceTravauxCount(jj) > 0 ? `${maintenanceTravauxCount(jj)} travaux renseigné${maintenanceTravauxCount(jj) > 1 ? "s" : ""}` : <span style={{ color: "#1e3a5c" }}>Aucun travaux renseigné</span>}</div>
                            <div>📅 T1 : {jj.date_maintenance1 || <span style={{ color: "#1e3a5c" }}>Date non renseignée</span>}</div>
                            <div>⚠️ T1 : {jj.importance1 || <span style={{ color: "#1e3a5c" }}>Importance non choisie</span>}</div>
                            <div>✅ T1 : {jj.etat1 || <span style={{ color: "#1e3a5c" }}>État non choisi</span>}</div>
                          </>
                        ) : (
                          <>
                            <div>🚢 {jj.navire || <span style={{ color: "#1e3a5c" }}>Navire non choisi</span>}</div>
                            {(!jj.masquer_capitaine_journee) && <div style={{ display: "flex", alignItems: "center" }}><Pictogram src={CAPITAINE_ICON_SRC} alt="Capitaine" size={12} />{jj.capitaine_journee || <span style={{ color: "#1e3a5c" }}>—</span>}</div>}
                            {(!jj.masquer_capitaine_matin) && <div style={{ display: "flex", alignItems: "center" }}><Pictogram src={CAPITAINE_ICON_SRC} alt="Capitaine" size={12} />{jj.capitaine_matin || <span style={{ color: "#1e3a5c" }}>—</span>}</div>}
                            {(!jj.masquer_capitaine_aprem) && <div style={{ display: "flex", alignItems: "center" }}><Pictogram src={CAPITAINE_ICON_SRC} alt="Capitaine" size={12} />{jj.capitaine_aprem || <span style={{ color: "#1e3a5c" }}>—</span>}</div>}
                            {jj.observation_capitaines && <div>📝 Obs. capitaines : {formatPreview(jj.observation_capitaines, 42)}</div>}
                            {[jj.matelot1_journee, jj.matelot2_journee, jj.matelot3_journee, jj.matelot4_journee].filter((v, i) => v && (!jj[`masquer_matelot${i + 1}_journee`])).length > 0 && (
                              <div style={{ display: "flex", alignItems: "center" }}><Pictogram src={MATELOT_ICON_SRC} alt="Matelot" size={12} />Journée : {[jj.matelot1_journee, jj.matelot2_journee, jj.matelot3_journee, jj.matelot4_journee].filter((v, i) => v && (!jj[`masquer_matelot${i + 1}_journee`])).join(" · ")}</div>
                            )}
                            {[jj.matelot1_matin, jj.matelot2_matin, jj.matelot3_matin, jj.matelot4_matin].filter((v, i) => v && (!jj[`masquer_matelot${i + 1}_matin`])).length > 0 && (
                              <div style={{ display: "flex", alignItems: "center" }}><Pictogram src={MATELOT_ICON_SRC} alt="Matelot" size={12} />Matin : {[jj.matelot1_matin, jj.matelot2_matin, jj.matelot3_matin, jj.matelot4_matin].filter((v, i) => v && (!jj[`masquer_matelot${i + 1}_matin`])).join(" · ")}</div>
                            )}
                            {[jj.matelot1_aprem, jj.matelot2_aprem, jj.matelot3_aprem, jj.matelot4_aprem].filter((v, i) => v && (!jj[`masquer_matelot${i + 1}_aprem`])).length > 0 && (
                              <div style={{ display: "flex", alignItems: "center" }}><Pictogram src={MATELOT_ICON_SRC} alt="Matelot" size={12} />A-M : {[jj.matelot1_aprem, jj.matelot2_aprem, jj.matelot3_aprem, jj.matelot4_aprem].filter((v, i) => v && (!jj[`masquer_matelot${i + 1}_aprem`])).join(" · ")}</div>
                            )}
                            {jj.observation_matelots && <div>📝 Obs. matelots : {formatPreview(jj.observation_matelots, 42)}</div>}
                            {jj.heure_debut && <div>▶️ {jj.heure_debut}{jj.heure_fin ? ` → ${jj.heure_fin}` : ""}</div>}
                            {jj.quantite_carburant && <div>⛽ {jj.quantite_carburant} L</div>}
                            {jj.port && <div>⚓ Port navire : {jj.port}</div>}
                            {jj.port_carburant && <div>⛽ Port carburant : {jj.port_carburant}</div>}
                            {jj.observation && <div>📝 {formatPreview(jj.observation, 42)}</div>}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {!isMaintenance && (
                <div style={{ marginTop: 22 }}>
                  {renderInfoGroupesBox()}
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: "linear-gradient(135deg,#1a6ebd,#0a3a70)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{itemIcon}</div>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: 20, color: "#e8f4ff", margin: 0 }}>{boat}</h2>
                  <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 6, background: "#0c1e30", border: "1px solid #1a3a5c", borderRadius: 10, color: "#7ec8e3", padding: "6px 10px", fontSize: 17, fontWeight: 900, textTransform: "capitalize" }}>📅 {today}</div>
                  {!isMaintenance && <div style={{ fontSize: 11, color: j.navire ? "#7ec8e3" : "#2a5a7a", marginTop: 2 }}>🚢 {j.navire || "Navire non choisi"}</div>}
                </div>
                {!isAdmin && <span style={{ marginLeft: "auto", fontSize: 11, color: "#3a6a8a", fontStyle: "italic" }}>lecture seule</span>}
              </div>

              {/* Récap en premier visuel */}
              <div style={{ marginBottom: 18, background: "#111c2e", border: "1px solid #1a6ebd", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#7ec8e3", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>📋 Récapitulatif & commentaire</div>
                <div className="recap-wrap">
                  {(isMaintenance ? [
                    { label: "Travaux", value: maintenanceTravauxCount(j) ? `${maintenanceTravauxCount(j)}/4` : "" },
                    { label: "T1 État", value: j.etat1 },
                    { label: "T2 État", value: j.etat2 },
                    { label: "T3 État", value: j.etat3 },
                    { label: "T4 État", value: j.etat4 },
                  ] : [
                    { label: "Navire", value: j.navire },
                    { label: "Début", value: j.heure_debut },
                    { label: "Fin", value: j.heure_fin },
                    { label: "Carburant", value: j.quantite_carburant, suffix: " L" },
                    { label: "Port navire", value: j.port },
                    { label: "Port carburant", value: j.port_carburant },
                    { label: "Cap. Journée", value: j.capitaine_journee?.split(" ")[0], hidden: j.masquer_capitaine_journee },
                    { label: "Cap. Matin", value: j.capitaine_matin?.split(" ")[0], hidden: j.masquer_capitaine_matin },
                    { label: "Cap. A-M", value: j.capitaine_aprem?.split(" ")[0], hidden: j.masquer_capitaine_aprem },
                    { label: "Obs. capitaines", value: j.observation_capitaines },
                    { label: "Matelot 1 Journée", value: j.matelot1_journee, hidden: j.masquer_matelot1_journee },
                    { label: "Matelot 2 Journée", value: j.matelot2_journee, hidden: j.masquer_matelot2_journee },
                    { label: "Matelot 3 Journée", value: j.matelot3_journee, hidden: j.masquer_matelot3_journee },
                    { label: "Matelot 4 Journée", value: j.matelot4_journee, hidden: j.masquer_matelot4_journee },
                    { label: "Matelot 1 Matin", value: j.matelot1_matin, hidden: j.masquer_matelot1_matin },
                    { label: "Matelot 2 Matin", value: j.matelot2_matin, hidden: j.masquer_matelot2_matin },
                    { label: "Matelot 3 Matin", value: j.matelot3_matin, hidden: j.masquer_matelot3_matin },
                    { label: "Matelot 4 Matin", value: j.matelot4_matin, hidden: j.masquer_matelot4_matin },
                    { label: "Matelot 1 A-M", value: j.matelot1_aprem, hidden: j.masquer_matelot1_aprem },
                    { label: "Matelot 2 A-M", value: j.matelot2_aprem, hidden: j.masquer_matelot2_aprem },
                    { label: "Matelot 3 A-M", value: j.matelot3_aprem, hidden: j.masquer_matelot3_aprem },
                    { label: "Matelot 4 A-M", value: j.matelot4_aprem, hidden: j.masquer_matelot4_aprem },
                    { label: "Obs. matelots", value: j.observation_matelots },
                    { label: "Observation", value: j.observation ? "Oui" : "" },
                  ]).filter(item => !item.hidden).map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: 9, color: "#2a5a7a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: item.value ? "#7ec8e3" : "#1e3a5c", marginTop: 2 }}>
                        {item.value ? stripFormattedText(item.value) + (item.suffix || "") : "—"}
                      </div>
                    </div>
                  ))}
                </div>
                {isMaintenance && maintenanceTravauxCount(j) > 0 && (
                  <div style={{ marginTop: 14, borderTop: "1px solid #1a3a5c", paddingTop: 12 }}>
                    <div style={{ fontSize: 9, color: "#2a5a7a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Détail des travaux</div>
                    {[1, 2, 3, 4].map(n => (j[`travaux${n}`] || j[`date_maintenance${n}`] || j[`importance${n}`] || j[`etat${n}`]) && (
                      <div key={n} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #10263a" }}>
                        <div style={{ fontSize: 11, color: "#7ec8e3", fontWeight: 800, marginBottom: 4 }}>Travaux {n}</div>
                        <div style={{ fontSize: 12, color: "#3a6a8a", marginBottom: 5 }}>
                          📅 {j[`date_maintenance${n}`] || "—"} · ⚠️ {j[`importance${n}`] || "—"} · ✅ {j[`etat${n}`] || "—"}
                        </div>
                        {j[`travaux${n}`] && <div style={{ fontSize: 13, color: "#dce8f5", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{renderFormattedText(j[`travaux${n}`])}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {!isMaintenance && (j.observation_capitaines || j.observation_matelots) && (
                  <div style={{ marginTop: 14, borderTop: "1px solid #1a3a5c", paddingTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 9, color: "#2a5a7a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Observation capitaines</div>
                      <div style={{ fontSize: 14, color: j.observation_capitaines ? "#dce8f5" : "#1e3a5c", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{j.observation_capitaines ? renderFormattedText(j.observation_capitaines) : "—"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "#2a5a7a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Observation matelots</div>
                      <div style={{ fontSize: 14, color: j.observation_matelots ? "#dce8f5" : "#1e3a5c", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{j.observation_matelots ? renderFormattedText(j.observation_matelots) : "—"}</div>
                    </div>
                  </div>
                )}
                {!isMaintenance && (
                  <div style={{ marginTop: 14, borderTop: "1px solid #1a3a5c", paddingTop: 12 }}>
                    <div style={{ fontSize: 9, color: "#2a5a7a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Commentaire</div>
                    <div style={{ fontSize: 14, color: j.observation ? "#dce8f5" : "#1e3a5c", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{j.observation ? renderFormattedText(j.observation) : "Aucun commentaire"}</div>
                  </div>
                )}
              </div>

              <div className="grid-fields">
                {(isMaintenance ? GROUPES_MAINTENANCE : GROUPES).map(group => {
                  const groupHideKeys = group.fields.map(f => f.hideKey).filter(Boolean);
                  const hasGroupHide = groupHideKeys.length > 0;
                  const allGroupMasked = hasGroupHide && groupHideKeys.every(k => !!j[k]);
                  const setGroupMasked = (masked) => updateFields(boat, date, Object.fromEntries(groupHideKeys.map(k => [k, masked])));
                  return (
                  <div key={group.label} style={{ background: "#111c2e", border: "1px solid #1a3a5c", borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 13, borderBottom: "1px solid #1a3a5c", paddingBottom: 9 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: group.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {group.label}
                      </div>
                      {isAdmin && hasGroupHide && (
                        <button
                          type="button"
                          onClick={() => setGroupMasked(!allGroupMasked)}
                          style={{
                            background: allGroupMasked ? "#12351f" : "#2b1f0a",
                            border: `1px solid ${allGroupMasked ? "#1f7a3a" : "#d97706"}`,
                            borderRadius: 7,
                            color: allGroupMasked ? "#4ade80" : "#fbbf24",
                            padding: "4px 8px",
                            fontSize: 10,
                            fontWeight: 900,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {allGroupMasked ? "Tout démasquer" : "Tout masquer"}
                        </button>
                      )}
                    </div>
                    {group.fields.map(f => {
                      const val = j[f.key] || "";
                      const isFieldMasked = f.hideKey && j[f.hideKey];
                      if (!isAdmin && isFieldMasked) return null;
                      return (
                        <div key={f.key} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
                            <label style={{ fontSize: 11, color: "#3a6a8a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                              {f.icon === "capitaine" ? (
                                <><Pictogram src={CAPITAINE_ICON_SRC} alt="Capitaine" />{f.label}</>
                              ) : f.icon === "matelot" ? (
                                <><Pictogram src={MATELOT_ICON_SRC} alt="Matelot" />{f.label}</>
                              ) : (
                                <>{f.icon} {f.label}</>
                              )}
                            </label>
                            {isAdmin && f.hideKey && (
                              <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: isFieldMasked ? "#fbbf24" : "#2a5a7a", fontWeight: 800, cursor: "pointer", userSelect: "none" }}>
                                <input
                                  type="checkbox"
                                  checked={!!isFieldMasked}
                                  onChange={e => updateField(boat, date, f.hideKey, e.target.checked)}
                                  style={{ accentColor: "#d97706", cursor: "pointer" }}
                                />
                                Masquer
                              </label>
                            )}
                          </div>
                          {f.type === "boat" ? (
                            <Dropdown value={val} onChange={v => updateField(boat, date, f.key, v)}
                              options={BATEAUX} placeholder="— Choisir un navire —" accent={group.accent} disabled={!isAdmin} />
                          ) : f.type === "captain" ? (
                            <Dropdown value={val} onChange={v => updateField(boat, date, f.key, v)}
                              options={capitainesList} placeholder="— Choisir un capitaine —" accent={group.accent} disabled={!isAdmin} />
                          ) : f.type === "marin" ? (
                            <Dropdown value={val} onChange={v => updateField(boat, date, f.key, v)}
                              options={marinsList} placeholder="— Choisir un marin —" accent={group.accent} disabled={!isAdmin} />
                          ) : f.type === "port" ? (
                            <Dropdown value={val} onChange={v => updateField(boat, date, f.key, v)}
                              options={portsList} placeholder="— Choisir un port —" accent={group.accent} disabled={!isAdmin} />
                          ) : f.type === "importance" ? (
                            <Dropdown value={val} onChange={v => updateField(boat, date, f.key, v)}
                              options={IMPORTANCES} placeholder="— Choisir une importance —" accent={group.accent} disabled={!isAdmin} />
                          ) : f.type === "etat" ? (
                            <Dropdown value={val} onChange={v => updateField(boat, date, f.key, v)}
                              options={ETATS_MAINTENANCE} placeholder="— Choisir un état —" accent={group.accent} disabled={!isAdmin} />
                          ) : f.type === "textarea" ? (
                            <RichTextEditor
                              value={val}
                              placeholder={f.placeholder || "Observation"}
                              disabled={!isAdmin}
                              rows={4}
                              accent={group.accent}
                              onChange={v => updateField(boat, date, f.key, v)}
                            />
                          ) : (
                            <input type={f.type} value={val} step={f.step}
                              placeholder={f.placeholder || (f.type === "time" ? "--:--" : "0")}
                              disabled={!isAdmin}
                              onChange={e => updateField(boat, date, f.key, e.target.value)}
                              style={{
                                width: "100%", background: isAdmin ? "#0d1a2c" : "#0a1422",
                                border: `1.5px solid ${val ? group.accent : "#1a3a5c"}`,
                                borderRadius: 8, color: val ? "#dce8f5" : "#2a5a7a",
                                padding: "9px 12px", fontSize: 14, outline: "none",
                                fontFamily: "inherit", opacity: isAdmin ? 1 : 0.7,
                                cursor: isAdmin ? "text" : "default",
                              }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  );
                })}
              </div>



              {/* FAB save mobile (admin seulement) */}
              {isAdmin && hasPending && (
                <div className="save-fab">
                  <button onClick={handleSave} style={{
                    background: saveBtnColor, border: `2px solid ${saveBtnBorder}`,
                    borderRadius: 50, color: "#fff", padding: "14px 36px",
                    fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 24px #000a",
                  }}>{saveBtnText}</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
