import React, { useMemo, useState } from 'react';
import bottomPagePhoto from './bottom-page-photo.jpg';
import logoBateauxVerts from './logo-bateaux-verts.jpg';

const APP_PASSWORD = 'BV2026#';
const ADMIN_PASSWORD = 'Marius24#';
const STORAGE_KEY = 'planning-salaries-horaires-v1';
const EMPLOYEE_KEY = 'planning-salaries-noms-v1';
const PLACES_KEY = 'planning-salaries-lieux-v1';
const MINUTE_DECIMALS_KEY = 'planning-salaries-minutes-decimales-v1';
const BREAK_DECIMALS_KEY = 'planning-salaries-pauses-decimales-v1';
const AUTH_KEY = 'planning-salaries-auth-v2';
const POPIN_KEY = 'planning-salaries-popin-v1';
const ACTUAL_STORAGE_KEY = 'planning-salaries-heures-reelles-v1';
const VALIDATION_KEY = 'planning-salaries-validations-v1';
const SHIFT_PRESETS_KEY = 'planning-salaries-shifts-v1';
const PREFILL_WEEK_KEY = '2026-06-15';

const defaultEmployees = [
  'Julie', 'Caroline', 'Marius', 'Véronique', 'Fabienne', 'Carine', 'Corinne',
  'Olympia', 'Cendrine', 'Hélène', 'Anaïs', 'Agathe', 'Myriam', 'Nôa',
  'Yoann', 'Briony', 'Léa', 'Salarié 18', 'Salarié 19', 'Salarié 20'
];

const defaultPlaces = [
  'Bureau',
  'Sainte-Maxime',
  'St-Tropez Vieux Port',
  'Les Issambres',
  'Aquascope',
  'Port Grimaud Eglise',
  'Port Grimaud Capit',
  'Marines Cog'
];

const defaultMinuteDecimals = ['0', '0,08', '0,16', '0,25', '0,33', '0,41', '0,5', '0,58', '0,66', '0,75', '0,83', '0,91'];
const defaultBreakDecimals = ['0', '0,08', '0,25', '0,33', '0,50', '0,75', '1', '1,25', '1,33', '1,50', '1,75', '2,00'];

const defaultShiftPresets = [
  { name: 'Aqua', place: 'Aquascope', start: '08:30', end: '17:00', breakMinutes: '1,50' },
  { name: 'Bureau 07h00', place: 'Bureau', start: '07:00', end: '15:30', breakMinutes: '0,50' },
  { name: 'Bureau 07h30', place: 'Bureau', start: '07:30', end: '16:00', breakMinutes: '0,50' },
  { name: 'Bureau 08h30', place: 'Bureau', start: '08:30', end: '17:00', breakMinutes: '0,50' },
  { name: 'Bureau 11h00', place: 'Bureau', start: '11:00', end: '19:00', breakMinutes: '0' },
  { name: 'Issambres journée', place: 'Les Issambres', start: '07:45', end: '18:00', breakMinutes: '1,25' },
  { name: 'Marines 08h00-13h00', place: 'Marines Cog', start: '08:00', end: '13:00', breakMinutes: '0' },
  { name: 'Marines 08h00-14h00', place: 'Marines Cog', start: '08:00', end: '14:00', breakMinutes: '0' },
  { name: 'Max après-midi', place: 'Sainte-Maxime', start: '14:30', end: '22:30', breakMinutes: '1' },
  { name: 'Max fermeture', place: 'Sainte-Maxime', start: '13:30', end: '21:30', breakMinutes: '1' },
  { name: 'Max fermeture tardive', place: 'Sainte-Maxime', start: '13:30', end: '21:45', breakMinutes: '1,25' },
  { name: 'Max journée 08h30', place: 'Sainte-Maxime', start: '08:30', end: '17:00', breakMinutes: '0,50' },
  { name: 'Max journée 09h00', place: 'Sainte-Maxime', start: '09:00', end: '18:00', breakMinutes: '1,50' },
  { name: 'Max ouverture 07h00', place: 'Sainte-Maxime', start: '07:00', end: '15:30', breakMinutes: '0,50' },
  { name: 'Max ouverture 07h30', place: 'Sainte-Maxime', start: '07:30', end: '15:30', breakMinutes: '0,50' },
  { name: 'Max renfort 08h00', place: 'Sainte-Maxime', start: '08:00', end: '16:00', breakMinutes: '1' },
  { name: 'Max renfort 09h00', place: 'Sainte-Maxime', start: '09:00', end: '16:00', breakMinutes: '0' },
  { name: 'Max renfort 09h30', place: 'Sainte-Maxime', start: '09:30', end: '19:00', breakMinutes: '1,50' },
  { name: 'PG Capit après-midi', place: 'Port Grimaud Capit', start: '15:00', end: '21:00', breakMinutes: '0' },
  { name: 'PG Capit journée', place: 'Port Grimaud Capit', start: '09:00', end: '17:00', breakMinutes: '0,50' },
  { name: 'PG Capit marche', place: 'Port Grimaud Capit', start: '08:00', end: '15:15', breakMinutes: '0,50' },
  { name: 'PG Église après-midi', place: 'Port Grimaud Eglise', start: '13:50', end: '19:50', breakMinutes: '0' },
  { name: 'PG Église journée', place: 'Port Grimaud Eglise', start: '09:00', end: '17:00', breakMinutes: '0,75' },
  { name: 'Renfort Issambres', place: 'Les Issambres', start: '08:00', end: '13:30', breakMinutes: '0' },
  { name: 'Renfort PG Capit 08h00-13h30', place: 'Port Grimaud Capit', start: '08:00', end: '13:30', breakMinutes: '0' },
  { name: 'Renfort PG Capit 08h00-14h00', place: 'Port Grimaud Capit', start: '08:00', end: '14:00', breakMinutes: '0' },
  { name: 'Trop après-midi', place: 'St-Tropez Vieux Port', start: '15:20', end: '21:20', breakMinutes: '0' },
  { name: 'Trop journée', place: 'St-Tropez Vieux Port', start: '09:00', end: '16:15', breakMinutes: '0,33' },
  { name: 'Trop matin', place: 'St-Tropez Vieux Port', start: '09:45', end: '16:00', breakMinutes: '0,08' },
  { name: 'Trop soir', place: 'St-Tropez Vieux Port', start: '16:00', end: '23:15', breakMinutes: '0,33' }
];


const prefilledPlanning = {
  "2026-06-15": {
    "0": {
      "mon": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Ouverture bureau"
      },
      "tue": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Ouverture bureau"
      },
      "wed": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Ouverture bureau"
      },
      "thu": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Ouverture bureau"
      },
      "fri": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "1": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Congés"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Congés"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Congés"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Congés"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      }
    },
    "2": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "thu": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "3": {
      "mon": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sun": {
        "start": "10:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      }
    },
    "4": {
      "mon": {
        "start": "12:00",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "08:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "12:00",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "5": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "12:00",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "12:00",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "08:15",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "sun": {
        "start": "08:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "6": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      }
    },
    "7": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "tue": {
        "start": "08:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sun": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      }
    },
    "8": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:00",
        "end": "17:30",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "08:00",
        "end": "17:30",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "9": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "10": {
      "mon": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "wed": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "thu": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "fri": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "11": {
      "mon": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "tue": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin - visite médicale 15h30"
      },
      "wed": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "thu": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "fri": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "sat": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "12": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "14:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "wed": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "thu": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "sun": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "13": {
      "mon": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "fri": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "14": {
      "mon": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "tue": {
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "wed": {
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "thu": {
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "fri": {
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sat": {
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "15": {
      "mon": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv - visite médicale 15h30"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "fri": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,00",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "16": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C - visite médicale 14h30 à Maxime"
      },
      "wed": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    }
  }
};

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

function mergePrefilledPlanning(storedData) {
  const next = { ...(storedData || {}) };
  Object.entries(prefilledPlanning).forEach(([targetWeek, employeeRows]) => {
    const currentWeek = next[targetWeek] || {};
    const mergedWeek = { ...employeeRows };
    Object.entries(currentWeek).forEach(([employeeIndex, employeeDays]) => {
      mergedWeek[employeeIndex] = {
        ...(employeeRows[employeeIndex] || {}),
        ...(employeeDays || {})
      };
    });
    next[targetWeek] = mergedWeek;
  });
  return next;
}

function migrateEmployees(storedEmployees) {
  const current = Array.isArray(storedEmployees) ? [...storedEmployees] : [...defaultEmployees];
  defaultEmployees.forEach((name, index) => {
    if (!current[index] || /^Salarié\s+\d+$/i.test(current[index])) current[index] = name;
  });
  return current.slice(0, 20);
}

function migratePlaces(storedPlaces) {
  const current = Array.isArray(storedPlaces) ? storedPlaces.filter(Boolean) : [];
  return Array.from(new Set([...defaultPlaces, ...current]));
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

function normalizePauseInput(value) {
  const raw = String(value || '').trim();
  if (!raw) return '0';
  const normalized = raw.replace(/\s+/g, '').replace(',', '.');
  const decimal = Number(normalized);
  if (Number.isNaN(decimal) || decimal < 0) return raw;
  return normalized.replace('.', ',');
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

function normalizeTimeInput(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const compact = raw.replace(/\s+/g, '').replace(/[hH]/g, ':').replace(/[.]/g, ':');

  if (/^\d{1,2}$/.test(compact)) {
    const hours = Number(compact);
    if (hours >= 0 && hours <= 23) return `${pad(hours)}:00`;
  }

  if (/^\d{3,4}$/.test(compact)) {
    const normalizedDigits = compact.length === 3 ? `0${compact}` : compact;
    const hours = Number(normalizedDigits.slice(0, 2));
    const minutes = Number(normalizedDigits.slice(2));
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${pad(hours)}:${pad(minutes)}`;
    }
  }

  const match = compact.match(/^(\d{1,2}):(\d{1,2})$/);
  if (match) {
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${pad(hours)}:${pad(minutes)}`;
    }
  }

  return raw;
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

function previousWeekKey(weekKey) {
  return toDateInputValue(addDays(parseDate(weekKey), -7));
}

function getShift(data, weekKey, employeeIndex, dayKey, depth = 0) {
  const explicitShift = data?.[weekKey]?.[employeeIndex]?.[dayKey];
  if (explicitShift) return explicitShift;

  // À partir de la semaine préremplie, toute nouvelle semaine reprend
  // automatiquement la valeur de la semaine précédente jusqu'à modification.
  if (weekKey > PREFILL_WEEK_KEY && depth < 104) {
    return getShift(data, previousWeekKey(weekKey), employeeIndex, dayKey, depth + 1);
  }

  return emptyShift();
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

function getFiveWeekMonthDays(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = getMonday(first);
  return Array.from({ length: 35 }, (_, index) => addDays(start, index));
}

function dayKeyFromDate(date) {
  return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
}

function App() {
  const [appUnlocked, setAppUnlocked] = useState(false);
  const [appPassword, setAppPassword] = useState('');
  const [appPasswordError, setAppPasswordError] = useState('');
  const [employees, setEmployees] = useState(() => migrateEmployees(readJSON(EMPLOYEE_KEY, defaultEmployees)));
  const [places, setPlaces] = useState(() => migratePlaces(readJSON(PLACES_KEY, defaultPlaces)));
  const [minuteDecimals, setMinuteDecimals] = useState(() => readJSON(MINUTE_DECIMALS_KEY, defaultMinuteDecimals));
  const [breakDecimals, setBreakDecimals] = useState(() => readJSON(BREAK_DECIMALS_KEY, defaultBreakDecimals));
  const [shiftPresets, setShiftPresets] = useState(() => readJSON(SHIFT_PRESETS_KEY, defaultShiftPresets));
  const [data, setData] = useState(() => mergePrefilledPlanning(readJSON(STORAGE_KEY, {})));
  const [actualData, setActualData] = useState(() => readJSON(ACTUAL_STORAGE_KEY, {}));
  const [validations, setValidations] = useState(() => readJSON(VALIDATION_KEY, {}));
  const [auth, setAuth] = useState(() => readJSON(AUTH_KEY, { mode: 'employee', employeeIndex: 0, employeeUnlocked: false }));
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [employeePassword, setEmployeePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedDate, setSelectedDate] = useState(PREFILL_WEEK_KEY);
  const [activeView, setActiveView] = useState('week');
  const [globalMode, setGlobalMode] = useState('day');
  const [popInSettings, setPopInSettings] = useState(() => readJSON(POPIN_KEY, { message: '', hidden: false }));
  const [showPopIn, setShowPopIn] = useState(false);

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

  const persistActualData = (next) => {
    setActualData(next);
    writeJSON(ACTUAL_STORAGE_KEY, next);
  };

  const persistValidations = (next) => {
    setValidations(next);
    writeJSON(VALIDATION_KEY, next);
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

  const persistShiftPresets = (next) => {
    const sorted = [...next].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'fr'));
    setShiftPresets(sorted);
    writeJSON(SHIFT_PRESETS_KEY, sorted);
  };

  const persistAuth = (next) => {
    setAuth(next);
    writeJSON(AUTH_KEY, next);
  };

  const persistPopInSettings = (next) => {
    setPopInSettings(next);
    writeJSON(POPIN_KEY, next);
  };

  const openPopInAfterLogin = () => {
    if (!popInSettings.hidden && String(popInSettings.message || '').trim()) {
      setShowPopIn(true);
    }
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


  const updateShiftPreset = (index, field, value) => {
    const next = shiftPresets.map((preset, presetIndex) => presetIndex === index ? { ...preset, [field]: value } : preset);
    persistShiftPresets(next);
  };

  const addShiftPreset = () => {
    persistShiftPresets([...shiftPresets, { name: 'Nouveau shift', place: places[0] || '', start: '08:00', end: '16:00', breakMinutes: '0' }]);
  };

  const removeShiftPreset = (index) => {
    const next = shiftPresets.filter((_, presetIndex) => presetIndex !== index);
    persistShiftPresets(next.length ? next : defaultShiftPresets);
  };

  const updateShift = (employeeIndex, dayKey, field, value, targetWeekKey = weekKey) => {
    if (!isAdmin) return;
    const current = getShift(data, targetWeekKey, employeeIndex, dayKey);
    const next = {
      ...data,
      [targetWeekKey]: {
        ...(data[targetWeekKey] || {}),
        [employeeIndex]: {
          ...((data[targetWeekKey] || {})[employeeIndex] || {}),
          [dayKey]: { ...current, [field]: value }
        }
      }
    };
    persistData(next);
  };

  const getActualShift = (targetWeekKey, employeeIndex, dayKey) => {
    return actualData?.[targetWeekKey]?.[employeeIndex]?.[dayKey] || getShift(data, targetWeekKey, employeeIndex, dayKey);
  };

  const updateActualShift = (employeeIndex, dayKey, field, value, targetWeekKey = weekKey) => {
    if (!isEmployeeUnlocked || Number(auth.employeeIndex) !== Number(employeeIndex)) return;
    const current = getActualShift(targetWeekKey, employeeIndex, dayKey);
    const next = {
      ...actualData,
      [targetWeekKey]: {
        ...(actualData[targetWeekKey] || {}),
        [employeeIndex]: {
          ...((actualData[targetWeekKey] || {})[employeeIndex] || {}),
          [dayKey]: { ...current, [field]: value }
        }
      }
    };
    persistActualData(next);
    persistValidations({
      ...validations,
      [targetWeekKey]: { ...(validations[targetWeekKey] || {}), [employeeIndex]: false }
    });
  };

  const applyTheoreticalPreset = (employeeIndex, dayKey, preset, targetWeekKey = weekKey) => {
    if (!isAdmin || !preset) return;
    const current = getShift(data, targetWeekKey, employeeIndex, dayKey);
    const nextShift = { ...current, start: preset.start, end: preset.end, breakMinutes: preset.breakMinutes, counter: preset.place, note: preset.name };
    const next = { ...data, [targetWeekKey]: { ...(data[targetWeekKey] || {}), [employeeIndex]: { ...((data[targetWeekKey] || {})[employeeIndex] || {}), [dayKey]: nextShift } } };
    persistData(next);
  };

  const applyActualPreset = (employeeIndex, dayKey, preset, targetWeekKey = weekKey) => {
    if (!isEmployeeUnlocked || Number(auth.employeeIndex) !== Number(employeeIndex) || !preset) return;
    const current = getActualShift(targetWeekKey, employeeIndex, dayKey);
    const nextShift = { ...current, start: preset.start, end: preset.end, breakMinutes: preset.breakMinutes, counter: preset.place, note: preset.name };
    const next = { ...actualData, [targetWeekKey]: { ...(actualData[targetWeekKey] || {}), [employeeIndex]: { ...((actualData[targetWeekKey] || {})[employeeIndex] || {}), [dayKey]: nextShift } } };
    persistActualData(next);
    persistValidations({ ...validations, [targetWeekKey]: { ...(validations[targetWeekKey] || {}), [employeeIndex]: false } });
  };

  const setWeekValidated = (employeeIndex, checked, targetWeekKey = weekKey) => {
    if (!isEmployeeUnlocked || Number(auth.employeeIndex) !== Number(employeeIndex)) return;
    persistValidations({
      ...validations,
      [targetWeekKey]: { ...(validations[targetWeekKey] || {}), [employeeIndex]: checked }
    });
  };

  const isWeekValidated = (employeeIndex, targetWeekKey = weekKey) => Boolean(validations?.[targetWeekKey]?.[employeeIndex]);

  const loginAdmin = (event) => {
    event.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      persistAuth({ mode: 'admin', employeeIndex: auth.employeeIndex || 0, employeeUnlocked: false });
      setAdminPassword('');
      setEmployeePassword('');
      setPasswordError('');
      setShowAdminLogin(false);
      openPopInAfterLogin();
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
      openPopInAfterLogin();
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

  const actualWeekTotalForEmployee = (employeeIndex, targetWeekKey = weekKey) => days.reduce((sum, day) => {
    return sum + shiftMinutes(getActualShift(targetWeekKey, employeeIndex, day.key));
  }, 0);

  const monthTotalForEmployee = (employeeIndex) => getWeeksInMonth(selectedDateObject).reduce((sum, wk) => {
    return sum + weekTotalForEmployee(employeeIndex, wk);
  }, 0);

  const selectedDayKey = days[(selectedDateObject.getDay() + 6) % 7].key;
  const selectedDayLabel = days.find((day) => day.key === selectedDayKey)?.label;

  const placePalette = ['#dbeafe', '#dcfce7', '#fef3c7', '#fce7f3', '#ede9fe', '#cffafe', '#ffedd5', '#e2e8f0', '#f3e8ff', '#ccfbf1'];
  const placeColor = (place) => {
    if (!place) return '#ffffff';
    const index = places.filter(Boolean).findIndex((item) => item === place);
    return placePalette[(index >= 0 ? index : 0) % placePalette.length];
  };


  const renderShiftPresetSelect = (employeeIndex, dayKey, shift, source = 'theoretical', targetWeekKey = weekKey) => (
    <select
      value=""
      onChange={(e) => {
        const preset = shiftPresets.find((item) => item.name === e.target.value);
        if (source === 'actual') applyActualPreset(employeeIndex, dayKey, preset, targetWeekKey);
        else applyTheoreticalPreset(employeeIndex, dayKey, preset, targetWeekKey);
      }}
      aria-label="Shift prédéfini"
    >
      <option value="">Choisir un shift</option>
      {shiftPresets.map((preset, index) => (
        <option key={`${preset.name}-${index}`} value={preset.name}>{preset.name}</option>
      ))}
    </select>
  );

  const renderPlaceSelect = (employeeIndex, dayKey, shift, updater = updateShift) => (
    <select
      value={shift.counter || ''}
      onChange={(e) => updater(employeeIndex, dayKey, 'counter', e.target.value)}
      style={{ backgroundColor: placeColor(shift.counter) }}
    >
      <option value="">Sélectionner</option>
      {places.filter(Boolean).map((place, index) => (
        <option key={`${place}-${index}`} value={place}>{place}</option>
      ))}
    </select>
  );

  const renderTimeSelect = (employeeIndex, dayKey, field, value, updater = updateShift) => (
    <div className="time-manual-wrap">
      <input
        className="time-manual-input"
        inputMode="numeric"
        value={value || ''}
        onChange={(e) => updater(employeeIndex, dayKey, field, e.target.value)}
        onBlur={(e) => updater(employeeIndex, dayKey, field, normalizeTimeInput(e.target.value))}
        placeholder="07:30"
        aria-label={field === 'start' ? 'Heure de début' : 'Heure de fin'}
      />
    </div>
  );

  const renderPauseInput = (employeeIndex, dayKey, shift, updater = updateShift) => {
    const listId = `pause-decimal-options-${employeeIndex}-${dayKey}`;
    return (
      <div className="pause-input-wrap">
        <input
          list={listId}
          inputMode="decimal"
          value={shift.breakMinutes || '0'}
          onChange={(e) => updater(employeeIndex, dayKey, 'breakMinutes', e.target.value)}
          onBlur={(e) => updater(employeeIndex, dayKey, 'breakMinutes', normalizePauseInput(e.target.value))}
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
  const changeMonth = (amount) => setSelectedDate(toDateInputValue(new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth() + amount, 1)));

  if (!appUnlocked) {
    return (
      <div className="login-screen access-login-screen">
        <form className="access-login-card" onSubmit={unlockApplication}>
          <img className="access-logo-image" src={logoBateauxVerts} alt="Les Bateaux Verts" />
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
          <p className="subtitle">Consultez votre planning, renseignez vos horaires et validez votre semaine.</p>
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
              <div className="toolbar-month-label">Mois</div>
              <h2 className="toolbar-month-title">{new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(selectedDateObject)}</h2>
              <p>Toutes les semaines du mois sélectionné</p>
            </div>
            <div className="toolbar-actions">
              <button className="secondary week-arrow-button" onClick={() => changeMonth(-1)} aria-label="Mois précédent" title="Mois précédent">← <span>Mois précédent</span></button>
              <button className="secondary" onClick={() => setSelectedDate(toDateInputValue(new Date()))}>Aujourd'hui</button>
              <button className="secondary week-arrow-button" onClick={() => changeMonth(1)} aria-label="Mois suivant" title="Mois suivant"><span>Mois suivant</span> →</button>
              <button onClick={exportCSV}>Export CSV</button>
            </div>
          </section>

          <nav className="tabs">
            <button className={activeView === 'week' ? 'active' : ''} onClick={() => setActiveView('week')}>Feuille d'Heures</button>
            <button className={activeView === 'month' ? 'active' : ''} onClick={() => setActiveView('month')}>Aperçu mensuel</button>
            <button className={activeView === 'global' ? 'active' : ''} onClick={() => setActiveView('global')}>Vue globale</button>
            {isAdmin && <button className={activeView === 'data' ? 'active' : ''} onClick={() => setActiveView('data')}>Données</button>}
          </nav>

          {activeView === 'week' && (
            <div className="month-weeks-list">
              {getWeeksInMonth(selectedDateObject).map((displayWeekKey) => {
                const displayWeekStart = parseDate(displayWeekKey);
                return (
                  <section className="card month-week-card" key={displayWeekKey}>
                    <div className="section-title">
                      <div>
                        <h2>Semaine du {displayDate(displayWeekStart)} au {displayDate(addDays(displayWeekStart, 6))}</h2>
                        <p>{isAdmin ? 'Comparaison entre le planning théorique et les heures validées par chaque salarié.' : 'Saisissez vos heures réellement effectuées, puis validez cette semaine.'}</p>
                      </div>
                      {!isAdmin && visibleEmployeeIndexes.length === 1 && (
                        <label className={`week-validation ${isWeekValidated(visibleEmployeeIndexes[0], displayWeekKey) ? 'validated' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isWeekValidated(visibleEmployeeIndexes[0], displayWeekKey)}
                            onChange={(e) => setWeekValidated(visibleEmployeeIndexes[0], e.target.checked, displayWeekKey)}
                          />
                          Semaine validée
                        </label>
                      )}
                    </div>
                    <div className="planning-grid admin-comparison-grid">
                      <div className="sticky-left header-cell">{isAdmin ? 'Salarié / type' : 'Salarié'}</div>
                      {days.map((day, index) => (
                        <div className="day-header" key={day.key}>{day.label}<small>{displayDate(addDays(displayWeekStart, index))}</small></div>
                      ))}
                      <div className="header-cell total-week">Total semaine</div>

                      {visibleEmployeeIndexes.map((employeeIndex) => {
                        const rows = isAdmin
                          ? [
                              { type: 'Théorique', source: 'theoretical', editable: true },
                              { type: isWeekValidated(employeeIndex, displayWeekKey) ? 'Compté ✓' : 'Compté — en attente', source: 'actual', editable: false }
                            ]
                          : [{ type: '', source: 'actual', editable: true }];
                        return rows.map((row) => (
                          <React.Fragment key={`${displayWeekKey}-${employeeIndex}-${row.source}`}>
                            <div className={`sticky-left employee-cell comparison-label ${row.source}`}>
                              <strong>{employees[employeeIndex]}</strong>
                              {isAdmin && <small>{row.type}</small>}
                            </div>
                            {days.map((day) => {
                              const shift = row.source === 'actual'
                                ? getActualShift(displayWeekKey, employeeIndex, day.key)
                                : getShift(data, displayWeekKey, employeeIndex, day.key);
                              const canEditRow = row.editable && (isAdmin || isEmployeeUnlocked);
                              const updater = row.source === 'actual'
                                ? (emp, dayKey, field, value) => updateActualShift(emp, dayKey, field, value, displayWeekKey)
                                : (emp, dayKey, field, value) => updateShift(emp, dayKey, field, value, displayWeekKey);
                              return (
                                <div className={`shift-card ${row.source === 'actual' ? 'actual-row' : 'theoretical-row'} ${!canEditRow ? 'readonly-shift' : ''}`} key={`${displayWeekKey}-${employeeIndex}-${row.source}-${day.key}`} style={{ backgroundColor: placeColor(shift.counter) }}>
                                  {canEditRow ? (
                                    <>
                                      <label>Guichet{renderPlaceSelect(employeeIndex, day.key, shift, updater)}</label>
                                      <label>Shift{renderShiftPresetSelect(employeeIndex, day.key, shift, row.source, displayWeekKey)}</label>
                                      <label>Début{renderTimeSelect(employeeIndex, day.key, 'start', shift.start, updater)}</label>
                                      <label>Fin{renderTimeSelect(employeeIndex, day.key, 'end', shift.end, updater)}</label>
                                      <label>Pause{renderPauseInput(employeeIndex, day.key, shift, updater)}</label>
                                    </>
                                  ) : (
                                    <div className="readonly-shift-content">
                                      <strong>{shift.counter || '—'}</strong>
                                      <span>{shift.start && shift.end ? `${shift.start} – ${shift.end}` : '—'}</span>
                                      <small>Pause : {shift.breakMinutes || '0'} h</small>
                                      {!isWeekValidated(employeeIndex, displayWeekKey) && row.source === 'actual' && <em>Non validé</em>}
                                    </div>
                                  )}
                                  <div className="shift-total">{formatHours(shiftMinutes(shift))}</div>
                                </div>
                              );
                            })}
                            <div className={`week-total-cell ${row.source === 'actual' ? 'actual-row' : ''}`}>
                              {row.source === 'actual' ? formatHours(actualWeekTotalForEmployee(employeeIndex, displayWeekKey)) : formatHours(weekTotalForEmployee(employeeIndex, displayWeekKey))}
                            </div>
                          </React.Fragment>
                        ));
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {activeView === 'month' && (
            <section className="card">
              <div className="section-title">
                <div>
                  <h2>Aperçu mensuel — {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(selectedDateObject)}</h2>
                  <p>Le mois complet est présenté sur 5 lignes, du lundi au dimanche.</p>
                </div>
                <span className="badge">5 semaines</span>
              </div>

              {visibleEmployeeIndexes.map((employeeIndex) => {
                const monthDays = getFiveWeekMonthDays(selectedDateObject);
                return (
                  <div className="employee-month" key={employeeIndex}>
                    <div className="employee-month-heading">
                      <h3>{employees[employeeIndex]}</h3>
                      <strong>Total mois : {formatHours(monthTotalForEmployee(employeeIndex))}</strong>
                    </div>
                    <div className="month-calendar">
                      {days.map((day) => <div className="month-weekday" key={day.key}>{day.label}</div>)}
                      {monthDays.map((calendarDate) => {
                        const targetWeekKey = weekKeyFromDate(calendarDate);
                        const targetDayKey = dayKeyFromDate(calendarDate);
                        const shift = getShift(data, targetWeekKey, employeeIndex, targetDayKey);
                        const inCurrentMonth = calendarDate.getMonth() === selectedDateObject.getMonth();
                        const hasShift = Boolean(shift.start || shift.end || shift.counter || shift.note);
                        return (
                          <div
                            className={`month-day ${inCurrentMonth ? '' : 'outside-month'} ${hasShift ? 'has-shift' : ''}`}
                            key={toDateInputValue(calendarDate)}
                            style={hasShift ? { backgroundColor: placeColor(shift.counter) } : undefined}
                          >
                            <div className="month-day-number">
                              <span>{calendarDate.getDate()}</span>
                              <small>{displayDate(calendarDate)}</small>
                            </div>
                            {hasShift ? (
                              <div className="month-shift-details">
                                <strong>{shift.counter || 'Poste non renseigné'}</strong>
                                <span>{shift.start || '--:--'} – {shift.end || '--:--'}</span>
                                <small>Pause : {String(shift.breakMinutes || '0').replace('.', ',')}</small>
                                <b>{formatHours(shiftMinutes(shift))}</b>
                                {shift.note ? <em>{shift.note}</em> : null}
                              </div>
                            ) : (
                              <span className="month-empty">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {activeView === 'global' && (
            <section className="card">
              <div className="section-title global-title-row">
                <div>
                  <h2>Vue globale — {globalMode === 'day' ? displayLongDate(selectedDateObject) : `semaine du ${displayDate(weekStart)}`}</h2>
                  <p>Planning de l’ensemble des salariés, visible par tous pour connaître la répartition dans les guichets.</p>
                </div>
                <div className="global-controls">
                  <div className="global-week-nav">
                    <button type="button" className="secondary week-arrow-button" onClick={() => changeWeek(-1)} aria-label="Semaine précédente" title="Semaine précédente">← <span>Semaine précédente</span></button>
                    <button type="button" className="secondary week-arrow-button" onClick={() => changeWeek(1)} aria-label="Semaine suivante" title="Semaine suivante"><span>Semaine suivante</span> →</button>
                  </div>
                  <div className="global-mode-switch">
                    <button type="button" className={globalMode === 'day' ? 'active' : 'secondary'} onClick={() => setGlobalMode('day')}>Journalier</button>
                    <button type="button" className={globalMode === 'week' ? 'active' : 'secondary'} onClick={() => setGlobalMode('week')}>Semaine</button>
                  </div>
                </div>
              </div>

              {globalMode === 'day' ? (
                <div className="table-wrap global-view-wrap">
                  <table className="compact-table global-view-table">
                    <thead>
                      <tr>
                        <th>Salarié</th>
                        <th>Guichet</th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th>Pause</th>
                        <th>Total journée</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, employeeIndex) => {
                        const shift = getShift(data, weekKey, employeeIndex, selectedDayKey);
                        return (
                          <tr key={employeeIndex}>
                            <th>{employee}</th>
                            <td className="global-place-cell" style={{ backgroundColor: placeColor(shift.counter) }}>{isAdmin ? (
                              <div className="global-day-editor">
                                {renderPlaceSelect(employeeIndex, selectedDayKey, shift)}
                                {renderShiftPresetSelect(employeeIndex, selectedDayKey, shift, 'theoretical', weekKey)}
                              </div>
                            ) : (shift.counter || '—')}</td>
                            <td>{isAdmin ? renderTimeSelect(employeeIndex, selectedDayKey, 'start', shift.start) : (shift.start || '—')}</td>
                            <td>{isAdmin ? renderTimeSelect(employeeIndex, selectedDayKey, 'end', shift.end) : (shift.end || '—')}</td>
                            <td>{isAdmin ? renderPauseInput(employeeIndex, selectedDayKey, shift) : (shift.breakMinutes ? `${shift.breakMinutes} h` : '—')}</td>
                            <td className="total-cell">{formatHours(shiftMinutes(shift))}</td>
                            <td>{isAdmin ? <input value={shift.note || ''} onChange={(e) => updateShift(employeeIndex, selectedDayKey, 'note', e.target.value)} placeholder="Optionnel" /> : (shift.note || '—')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={isAdmin ? 5 : 5}>Total cumulé de la journée</th>
                        <td className="total-cell">{formatHours(employees.reduce((sum, _, employeeIndex) => sum + dayTotalForEmployee(employeeIndex, selectedDayKey), 0))}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="table-wrap global-week-wrap">
                  <table className="compact-table global-week-table">
                    <thead>
                      <tr>
                        <th>Salarié</th>
                        {days.map((day, index) => <th key={day.key}>{day.label}<small>{displayDate(addDays(weekStart, index))}</small></th>)}
                        <th>Total semaine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, employeeIndex) => (
                        <tr key={employeeIndex}>
                          <th>{employee}</th>
                          {days.map((day) => {
                            const shift = getShift(data, weekKey, employeeIndex, day.key);
                            return (
                              <td key={day.key} className="global-week-shift" style={{ backgroundColor: placeColor(shift.counter) }}>
                                {isAdmin ? (
                                  <div className="global-week-editor">
                                    {renderPlaceSelect(employeeIndex, day.key, shift)}
                                    {renderShiftPresetSelect(employeeIndex, day.key, shift, 'theoretical', weekKey)}
                                    {renderTimeSelect(employeeIndex, day.key, 'start', shift.start)}
                                    {renderTimeSelect(employeeIndex, day.key, 'end', shift.end)}
                                    {renderPauseInput(employeeIndex, day.key, shift)}
                                  </div>
                                ) : (
                                  <>
                                    <strong>{shift.counter || 'Repos / non renseigné'}</strong>
                                    <span>{shift.start && shift.end ? `${shift.start} – ${shift.end}` : '—'}</span>
                                    <small>Pause : {shift.breakMinutes || '0'} h</small>
                                  </>
                                )}
                                <b>{formatHours(shiftMinutes(shift))}</b>
                              </td>
                            );
                          })}
                          <td className="total-cell">{formatHours(weekTotalForEmployee(employeeIndex))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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


                <div className="data-block shift-presets-block">
                  <div className="data-block-header">
                    <h3>Shifts horaires</h3>
                    <button onClick={addShiftPreset}>Créer un shift</button>
                  </div>
                  <div className="shift-presets-list">
                    {shiftPresets.map((preset, index) => (
                      <div className="shift-preset-row" key={`${preset.name}-${index}`}>
                        <label>Nom<input value={preset.name} onChange={(e) => updateShiftPreset(index, 'name', e.target.value)} /></label>
                        <label>Guichet<select value={preset.place} onChange={(e) => updateShiftPreset(index, 'place', e.target.value)}>{places.filter(Boolean).map((place) => <option key={place} value={place}>{place}</option>)}</select></label>
                        <label>Début<input type="time" value={preset.start} onChange={(e) => updateShiftPreset(index, 'start', e.target.value)} /></label>
                        <label>Fin<input type="time" value={preset.end} onChange={(e) => updateShiftPreset(index, 'end', e.target.value)} /></label>
                        <label>Pause<input list={`shift-break-${index}`} value={preset.breakMinutes} onChange={(e) => updateShiftPreset(index, 'breakMinutes', e.target.value)} /><datalist id={`shift-break-${index}`}>{breakDecimals.map((value) => <option key={value} value={value} />)}</datalist></label>
                        <button className="secondary danger-button" onClick={() => removeShiftPreset(index)}>Supprimer ce shift</button>
                      </div>
                    ))}
                  </div>
                  <p className="hint left">Les shifts sont triés par nom. En sélectionnant un shift dans le planning, le guichet, l'heure de début, l'heure de fin et la pause sont remplis automatiquement.</p>
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

                <div className="data-block popin-settings-block">
                  <div className="data-block-header">
                    <h3>Pop-In</h3>
                    <span className={popInSettings.hidden ? 'badge muted' : 'badge'}>
                      {popInSettings.hidden ? 'Masquée' : 'Active'}
                    </span>
                  </div>
                  <label className="popin-message-label">
                    Message affiché à la connexion
                    <textarea
                      rows="6"
                      value={popInSettings.message || ''}
                      onChange={(e) => persistPopInSettings({ ...popInSettings, message: e.target.value })}
                      placeholder="Saisissez ici le message à afficher aux salariés..."
                    />
                  </label>
                  <label className="popin-hide-option">
                    <input
                      type="checkbox"
                      checked={Boolean(popInSettings.hidden)}
                      onChange={(e) => persistPopInSettings({ ...popInSettings, hidden: e.target.checked })}
                    />
                    Masquer la Pop-In
                  </label>
                  <p className="hint left">La fenêtre s'affiche après la connexion d'un salarié ou de l'administrateur. Elle peut être fermée par l'utilisateur.</p>
                  {!popInSettings.hidden && String(popInSettings.message || '').trim() && (
                    <button type="button" className="secondary" onClick={() => setShowPopIn(true)}>Prévisualiser</button>
                  )}
                </div>
              </div>
            </section>
          )}
        </>
      )}


      {showPopIn && !popInSettings.hidden && String(popInSettings.message || '').trim() && (
        <div className="popin-overlay" role="dialog" aria-modal="true" aria-labelledby="popin-title">
          <div className="popin-modal">
            <button type="button" className="popin-close" aria-label="Fermer" onClick={() => setShowPopIn(false)}>×</button>
            <h2 id="popin-title">Information</h2>
            <div className="popin-message">{popInSettings.message}</div>
            <button type="button" onClick={() => setShowPopIn(false)}>Fermer</button>
          </div>
        </div>
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
