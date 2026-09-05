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
const PREFILL_WEEK_KEY = '2026-03-30';

const defaultEmployees = [
  "Julie", "Caroline", "Marius", "Véronique", "Fabienne", "Carine", "Corinne", "Olympia", "Cendrine", "Léa", "Anaïs", "Briony", "Myriam", "Yoann", "Nôa", "Hélène", "Emma", "Mathys", "Lou", "Jérôme", "Agathe", "Delphine", "Paul", "Mehdi"
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
  "2026-03-30": {
    "0": {
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
        "note": "QSE"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "fri": {
        "start": "07:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
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
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:00",
        "end": "17:00",
        "breakMinutes": "1",
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "08:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
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
    "2": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "08:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
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
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "07:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "ouv & inté"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sun": {
        "start": "08:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "08:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
      },
      "sat": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "wed": {
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "08:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
      },
      "sat": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sun": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "6": {
      "mon": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "fri": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "7": {
      "mon": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "fri": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      }
    },
    "8": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Form°"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Form°"
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
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max journée"
      },
      "fri": {
        "start": "08:00",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Form°"
      },
      "tue": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Form°"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Form°"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "08:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
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
    },
    "23": {
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
        "start": "08:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
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
    "12": {
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
        "start": "08:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
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
    "14": {
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
        "start": "08:30",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "journée inté"
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
    }
  },
  "2026-04-06": {
    "0": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
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
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "1",
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
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
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "1",
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
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
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "08:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sat": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sun": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "6": {
      "mon": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "wed": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
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
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "7": {
      "mon": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "07:30",
        "end": "16:00",
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
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
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
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
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
  },
  "2026-04-13": {
    "0": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "congés"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "congés"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      }
    },
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "1",
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
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
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "1",
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
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
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "07:30",
        "end": "14:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "07:30",
        "end": "14:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "08:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "07:30",
        "end": "16:00",
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
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sun": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "6": {
      "mon": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "fri": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "7": {
      "mon": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "wed": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
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
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
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
  },
  "2026-04-20": {
    "0": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "fri": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "ouv Bureau"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
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
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "ouv Bureau"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
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
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "1",
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
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
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "Form°PG Cap"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "Form°PG Cap"
      },
      "sun": {
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "Form°PG Cap"
      },
      "thu": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Form° Trop"
      },
      "fri": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Form° Trop"
      },
      "sat": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Form° Trop"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "6": {
      "mon": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "wed": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "07:30",
        "end": "15:00",
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "7": {
      "mon": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "wed": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
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
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
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
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "23": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "Form°PG Cap"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
      },
      "fri": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "Form°PG Cap"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "Form°PG Cap"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "20": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Form° Trop"
      },
      "sat": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Form° Trop"
      },
      "sun": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "12": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
      },
      "thu": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Form° Trop"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Observ° Trop"
      }
    },
    "14": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
      },
      "wed": {
        "start": "10:00",
        "end": "15:00",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Observ° Trop"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "08:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    }
  },
  "2026-04-27": {
    "0": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
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
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "thu": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "thu": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "09:30",
        "end": "18:00",
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
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "tue": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Format° MarinesFormat°"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sun": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "4": {
      "mon": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "08:00",
        "end": "15:00",
        "breakMinutes": "1",
        "counter": "",
        "note": "Prépa° guichets"
      },
      "wed": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "6": {
      "mon": {
        "start": "07:30",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      }
    },
    "7": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sun": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
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
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sun": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "10": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "début contrat 28-avr Max Journée"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
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
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "fri": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Format° MarinesFormat°"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sun": {
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "20": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "fri": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sat": {
        "start": "09:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "sun": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
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
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "07:30",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Observ° Iss"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      }
    },
    "14": {
      "mon": {
        "start": "10:00",
        "end": "17:30",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "09:00",
        "end": "15:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "wed": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "end": "15:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
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
    }
  },
  "2026-05-04": {
    "0": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
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
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "thu": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "thu": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "09:30",
        "end": "18:00",
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "2",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "4": {
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
        "note": "Renf PG Cap"
      },
      "wed": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
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
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "6": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
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
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sun": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "10": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
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
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sun": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "20": {
      "mon": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
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
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "sat": {
        "start": "08:00",
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
    "12": {
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
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sun": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "14": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "wed": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
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
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      }
    }
  },
  "2026-05-11": {
    "0": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
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
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "thu": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "09:30",
        "end": "18:00",
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renf PG Cap"
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
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
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "6": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "fri": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
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
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sun": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "10": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "fri": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sun": {
        "start": "08:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "20": {
      "mon": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "thu": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "fri": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "sun": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
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
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
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
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "14": {
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
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "wed": {
        "start": "07:20",
        "end": "13:20",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      }
    }
  },
  "2026-05-18": {
    "0": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "QSE"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "congés"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "congés"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      }
    },
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
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
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "thu": {
        "start": "10:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
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
        "note": "Max Ouv"
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
        "start": "07:20",
        "end": "12:20",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:00",
        "end": "12:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renf PG Cap"
      },
      "wed": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
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
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "5": {
      "mon": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "08:30",
        "end": "18:00",
        "breakMinutes": "1",
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
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "6": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
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
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
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
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
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
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sun": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "10": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
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
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sun": {
        "start": "08:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "20": {
      "mon": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "sun": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
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
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
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
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sun": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "14": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "09:00",
        "end": "15:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "wed": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sun": {
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      }
    }
  },
  "2026-05-25": {
    "0": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "exce secu VIO"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
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
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
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
        "end": "16:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      }
    },
    "2": {
      "mon": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "09:30",
        "end": "17:00",
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
        "note": "Max Ouv"
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "08:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "4": {
      "mon": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "tue": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renf PG Cap"
      },
      "wed": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "07:20",
        "end": "16:20",
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
        "start": "08:00",
        "end": "16:00",
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
    },
    "6": {
      "mon": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "start": "10:00",
        "end": "17:00",
        "breakMinutes": "1,75",
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
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      },
      "sat": {
        "start": "08:00",
        "end": "17:00",
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "wed": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "10": {
      "mon": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "tue": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
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
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1,50",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Marines Cog",
        "note": "Marines"
      },
      "sun": {
        "start": "12:00",
        "end": "20:15",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "20": {
      "mon": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "tue": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "wed": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
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
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "12": {
      "mon": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "fri": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sun": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      }
    },
    "14": {
      "mon": {
        "start": "09:45",
        "end": "17:15",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "tue": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "wed": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "10:00",
        "end": "18:45",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop VP"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    }
  },
  "2026-06-01": {
    "0": {
      "mon": {
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "08:30",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "VIO"
      },
      "thu": {
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
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
    "1": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "thu": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
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
        "start": "10:00",
        "end": "18:00",
        "breakMinutes": "1",
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
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Format° Trop"
      },
      "sat": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "10:00",
        "end": "19:00",
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "sun": {
        "start": "12:00",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      }
    },
    "5": {
      "mon": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "tue": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "wed": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "fri": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
    "10": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
    "20": {
      "mon": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "tue": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "wed": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "thu": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
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
    "14": {
      "mon": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
      },
      "wed": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "thu": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
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
    "13": {
      "mon": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
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
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "fri": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Format° Trop"
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
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "11": {
      "mon": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
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
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Format° Max"
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
        "start": "09:00",
        "end": "16:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    }
  },
  "2026-06-08": {
    "0": {
      "mon": {
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "tue": {
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "wed": {
        "start": "08:30",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "VIO"
      },
      "thu": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "fri": {
        "start": "09:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
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
    "1": {
      "mon": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "tue": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "wed": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "absence Bureau"
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
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
        "start": "10:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sun": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sun": {
        "start": "10:00",
        "end": "19:00",
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
        "start": "08:15",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
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
        "start": "12:00",
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
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
        "start": "08:30",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
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
    "15": {
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
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
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
    "20": {
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
        "note": "Trop Matin"
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
        "start": "15:20",
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
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
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
    "14": {
      "mon": {
        "start": "08:30",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "fri": {
        "start": "08:30",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:30",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "13": {
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
    "11": {
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
        "note": "Max Ouv"
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
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "9": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "wed": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
  },
  "2026-06-15": {
    "0": {
      "mon": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "tue": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "wed": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "thu": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "note": "congés"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "congés Bureau"
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
    "15": {
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
    "20": {
      "mon": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "tue": {
        "start": "09:45",
        "end": "14:50",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
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
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
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
    "14": {
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
    "13": {
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
    "11": {
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
        "note": "Max Ouv"
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
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "9": {
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
        "note": "Renfort PG C"
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
  },
  "2026-06-22": {
    "0": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "VIO lavandou"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
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
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "sat": {
        "start": "07:20",
        "end": "14:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "tue": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "wed": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
      },
      "thu": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Ouv Bureau"
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
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sat": {
        "start": "10:00",
        "end": "18:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "sun": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "10:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau"
      },
      "fri": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
    "4": {
      "mon": {
        "start": "12:30",
        "end": "21:15",
        "breakMinutes": "1,25",
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
        "start": "12:30",
        "end": "21:15",
        "breakMinutes": "1,25",
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
        "start": "12:30",
        "end": "21:15",
        "breakMinutes": "1,25",
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
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "12:30",
        "end": "21:15",
        "breakMinutes": "1,25",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "12:30",
        "end": "21:15",
        "breakMinutes": "1,25",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "09:00",
        "end": "14:30",
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Renfort Max"
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
    "15": {
      "mon": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
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
        "start": "08:00",
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
    "20": {
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
        "note": "Trop Matin"
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
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renf Iss"
      },
      "wed": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "thu": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "1,75",
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
    "14": {
      "mon": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "15:20",
        "end": "20:20",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Apm"
      },
      "wed": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
    "13": {
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
    "11": {
      "mon": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "9": {
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
        "note": "Renfort PG C"
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
  },
  "2026-06-29": {
    "0": {
      "mon": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "tue": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "wed": {
        "start": "08:30",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "réunion inté"
      },
      "thu": {
        "start": "08:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "fri": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "sat": {
        "start": "07:00",
        "end": "12:00",
        "breakMinutes": "0",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "tue": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "wed": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "thu": {
        "start": "07:20",
        "end": "15:50",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "07:30",
        "end": "15:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "11:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "inté + Bureau"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sat": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sun": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "start": "09:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sat": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sun": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "format° Trop"
      }
    },
    "4": {
      "mon": {
        "start": "13:30",
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
        "start": "09:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "",
        "note": "journée découv"
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
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "sun": {
        "start": "16:30",
        "end": "22:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
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
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "",
        "note": "Format° Ferm"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "12:30",
        "end": "21:15",
        "breakMinutes": "1,25",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "07:30",
        "end": "15:00",
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "17:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      },
      "thu": {
        "start": "07:20",
        "end": "12:20",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "end": "17:45",
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
        "end": "17:45",
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
    "15": {
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
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "sun": {
        "start": "09:15",
        "end": "18:00",
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
    "20": {
      "mon": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "tue": {
        "start": "15:20",
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
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
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
        "start": "08:00",
        "end": "13:00",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renf Iss"
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
        "end": "17:00",
        "breakMinutes": "1,75",
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
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "sun": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      }
    },
    "14": {
      "mon": {
        "start": "07:20",
        "end": "15:20",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "wed": {
        "start": "09:45",
        "end": "15:45",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Matin"
      },
      "thu": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      }
    },
    "13": {
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
        "start": "07:00",
        "end": "14:30",
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
    "11": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "wed": {
        "start": "09:00",
        "end": "18:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
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
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
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
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "17": {
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
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Format°"
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
        "end": "18:30",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    },
    "18": {
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
    "19": {
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
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "",
        "note": "Format° Ferm"
      },
      "thu": {
        "start": "13:30",
        "end": "21:15",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
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
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "",
        "note": "journée découv"
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
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Format°"
      },
      "sat": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "Observ° PG Ég"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "21": {
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
        "note": "VOIR HORAIRES"
      },
      "wed": {
        "start": "09:00",
        "end": "19:00",
        "breakMinutes": "1",
        "counter": "",
        "note": "journée découv"
      },
      "thu": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Format°"
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
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Format°"
      },
      "sun": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "format° Trop"
      }
    }
  },
  "2026-07-06": {
    "0": {
      "mon": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "tue": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "fri": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "sat": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "08:30",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "tue": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "wed": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "thu": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "wed": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sat": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sun": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      }
    },
    "3": {
      "mon": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
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
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sat": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sun": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:00",
        "end": "14:30",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "wed": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "tue": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "end": "15:15",
        "breakMinutes": "1",
        "counter": "Port Grimaud Capit",
        "note": "PG C Marché"
      },
      "sun": {
        "start": "09:15",
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "6": {
      "mon": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "tue": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "1",
        "counter": "Port Grimaud Capit",
        "note": "PG C Marché"
      },
      "wed": {
        "start": "07:00",
        "end": "12:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
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
        "start": "09:00",
        "end": "17:45",
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
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renfort Iss"
      },
      "wed": {
        "start": "09:00",
        "end": "20:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renfort Iss"
      },
      "sun": {
        "start": "08:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      }
    },
    "8": {
      "mon": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "wed": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "thu": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "fri": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
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
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "thu": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "fri": {
        "start": "08:00",
        "end": "18:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "sat": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "tue": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
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
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "fri": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
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
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "wed": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
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
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "13": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
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
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
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
        "end": "17:00",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      }
    },
    "14": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "wed": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "sun": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      }
    },
    "15": {
      "mon": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "tue": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "wed": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "thu": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "absence PG Ég Apm"
      },
      "sat": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "16": {
      "mon": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "tue": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "wed": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "thu": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "fri": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "sat": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "17": {
      "mon": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "tue": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "wed": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "thu": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "18": {
      "mon": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1,50",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sun": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      }
    },
    "19": {
      "mon": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
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
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "sun": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm Pot Val Esq"
      }
    },
    "20": {
      "mon": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "09:00",
        "end": "18:00",
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "fri": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sat": {
        "start": "07:00",
        "end": "14:30",
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
    "21": {
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "thu": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "fri": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "sat": {
        "start": "14:30",
        "end": "22:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "sun": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      }
    },
    "22": {
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
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "thu": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
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
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sun": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    }
  },
  "2026-07-13": {
    "0": {
      "mon": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "tue": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "fri": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "sat": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "tue": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "wed": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "thu": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "wed": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sat": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sun": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      }
    },
    "3": {
      "mon": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "tue": {
        "start": "08:00",
        "end": "16:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
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
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sat": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sun": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "wed": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "tue": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
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
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
        "end": "15:15",
        "breakMinutes": "1",
        "counter": "Port Grimaud Capit",
        "note": "PG C Marché"
      },
      "sun": {
        "start": "09:15",
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "6": {
      "mon": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "tue": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "1",
        "counter": "Port Grimaud Capit",
        "note": "PG C Marché"
      },
      "wed": {
        "start": "07:00",
        "end": "12:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
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
        "start": "09:00",
        "end": "17:45",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      }
    },
    "7": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "wed": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
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
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "8": {
      "mon": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "wed": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "thu": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "fri": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
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
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "thu": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "fri": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "sat": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "tue": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
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
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "fri": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      }
    },
    "12": {
      "mon": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "tue": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renfort Iss"
      },
      "wed": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
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
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renfort Iss"
      },
      "sun": {
        "start": "08:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      }
    },
    "13": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
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
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
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
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      }
    },
    "14": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "wed": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "sun": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      }
    },
    "15": {
      "mon": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "tue": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "wed": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "thu": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "fri": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "sat": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "16": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "absence Trop Jour"
      },
      "tue": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "wed": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "thu": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "fri": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "sat": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "17": {
      "mon": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "tue": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "wed": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "thu": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "18": {
      "mon": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sun": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      }
    },
    "19": {
      "mon": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
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
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "sun": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm Pot Gaillarde"
      }
    },
    "20": {
      "mon": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "09:00",
        "end": "18:00",
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "fri": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sat": {
        "start": "07:00",
        "end": "14:30",
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
    "21": {
      "mon": {
        "start": "18:00",
        "end": "19:30",
        "breakMinutes": "0",
        "counter": "",
        "note": "Pot accueil Paradis Camp."
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "thu": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "fri": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "sat": {
        "start": "14:30",
        "end": "22:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "sun": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      }
    },
    "22": {
      "mon": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "thu": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
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
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sun": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    }
  },
  "2026-07-20": {
    "0": {
      "mon": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "tue": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "fri": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "sat": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "tue": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "wed": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "thu": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "wed": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sat": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sun": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      }
    },
    "3": {
      "mon": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
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
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sat": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sun": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "4": {
      "mon": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
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
        "end": "15:15",
        "breakMinutes": "1",
        "counter": "Port Grimaud Capit",
        "note": "PG C Marché"
      },
      "sun": {
        "start": "09:15",
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "6": {
      "mon": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "1",
        "counter": "Port Grimaud Capit",
        "note": "PG C Marché"
      },
      "wed": {
        "start": "09:00",
        "end": "19:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "thu": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
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
        "start": "09:00",
        "end": "17:45",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      }
    },
    "7": {
      "mon": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "tue": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renfort Iss"
      },
      "wed": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
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
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renfort Iss"
      },
      "sun": {
        "start": "08:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      }
    },
    "8": {
      "mon": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "wed": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "thu": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "fri": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
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
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "thu": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "fri": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "sat": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "tue": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
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
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "fri": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
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
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "fri": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "13": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "thu": {
        "start": "14:30",
        "end": "22:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "fri": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
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
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      }
    },
    "14": {
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
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "wed": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "sun": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      }
    },
    "15": {
      "mon": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "tue": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "wed": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "thu": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "fri": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "sat": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "16": {
      "mon": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "tue": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "wed": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "thu": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "fri": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "sat": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "17": {
      "mon": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "tue": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "wed": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "thu": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "fri": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sat": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "18": {
      "mon": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sun": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      }
    },
    "19": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "wed": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
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
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "sun": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm Pot Gaillarde"
      }
    },
    "20": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "wed": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "thu": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "fri": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sat": {
        "start": "07:00",
        "end": "14:30",
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
    "21": {
      "mon": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée visite méd 8h30"
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
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sun": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      }
    },
    "22": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "wed": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "sat": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "sun": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      }
    }
  },
  "2026-07-27": {
    "0": {
      "mon": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "tue": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "fri": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "sat": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "tue": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "wed": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
      },
      "thu": {
        "start": "07:00",
        "end": "15:30",
        "breakMinutes": "0,50",
        "counter": "Bureau",
        "note": "Bureau 1"
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
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "wed": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
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
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sat": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sun": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      }
    },
    "3": {
      "mon": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "tue": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
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
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
      },
      "sat": {
        "start": "09:00",
        "end": "17:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 2"
      },
      "sun": {
        "start": "07:30",
        "end": "16:00",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv Dim"
      }
    },
    "4": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "wed": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "thu": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "fri": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sat": {
        "start": "15:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "5": {
      "mon": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "tue": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "11:30",
        "end": "20:30",
        "breakMinutes": "1",
        "counter": "Bureau",
        "note": "Bureau 3"
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
        "end": "15:15",
        "breakMinutes": "1",
        "counter": "Port Grimaud Capit",
        "note": "PG C Marché"
      },
      "sun": {
        "start": "09:15",
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Capit",
        "note": "PG Capit"
      }
    },
    "6": {
      "mon": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "tue": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "1",
        "counter": "Port Grimaud Capit",
        "note": "PG C Marché"
      },
      "wed": {
        "start": "09:00",
        "end": "19:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "thu": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
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
        "start": "09:00",
        "end": "17:45",
        "breakMinutes": "0,75",
        "counter": "Port Grimaud Eglise",
        "note": "PG Église"
      }
    },
    "7": {
      "mon": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "tue": {
        "start": "08:00",
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renfort Iss"
      },
      "wed": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
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
        "end": "13:30",
        "breakMinutes": "0",
        "counter": "Les Issambres",
        "note": "Renfort Iss"
      },
      "sun": {
        "start": "08:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      }
    },
    "8": {
      "mon": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "tue": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "wed": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "thu": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "fri": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Matin"
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
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "thu": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "fri": {
        "start": "08:00",
        "end": "15:15",
        "breakMinutes": "0,50",
        "counter": "Port Grimaud Capit",
        "note": "PG C Jour"
      },
      "sat": {
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "0,75",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
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
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "tue": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
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
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "fri": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "sat": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "sun": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
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
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "fri": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sat": {
        "start": "07:45",
        "end": "18:00",
        "breakMinutes": "1,25",
        "counter": "Les Issambres",
        "note": "Issambres"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "13": {
      "mon": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "tue": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "wed": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "thu": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
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
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      }
    },
    "14": {
      "mon": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "tue": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "wed": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "thu": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "fri": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "sat": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "sun": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      }
    },
    "15": {
      "mon": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "tue": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "wed": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "thu": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "fri": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "sat": {
        "start": "15:00",
        "end": "21:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "PG C Apm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "16": {
      "mon": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "tue": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "wed": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "thu": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "fri": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "sat": {
        "start": "13:50",
        "end": "19:50",
        "breakMinutes": "0",
        "counter": "Port Grimaud Eglise",
        "note": "PG Ég Apm"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "17": {
      "mon": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "tue": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "wed": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
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
        "end": "16:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      },
      "sat": {
        "start": "16:00",
        "end": "23:15",
        "breakMinutes": "0,33",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Soir"
      },
      "sun": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      }
    },
    "18": {
      "mon": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "thu": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "fri": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sat": {
        "start": "08:30",
        "end": "17:00",
        "breakMinutes": "1",
        "counter": "Aquascope",
        "note": "Aqua"
      },
      "sun": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      }
    },
    "19": {
      "mon": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
      },
      "tue": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm"
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
        "start": "09:00",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "sat": {
        "start": "08:00",
        "end": "14:00",
        "breakMinutes": "0",
        "counter": "Port Grimaud Capit",
        "note": "Renfort PG C"
      },
      "sun": {
        "start": "16:00",
        "end": "23:30",
        "breakMinutes": "0",
        "counter": "Sainte-Maxime",
        "note": "Max Ferm Pot Gaillarde"
      }
    },
    "20": {
      "mon": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "tue": {
        "start": "",
        "end": "",
        "breakMinutes": "0",
        "counter": "",
        "note": "Repos"
      },
      "wed": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "thu": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "fri": {
        "start": "08:00",
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sat": {
        "start": "07:00",
        "end": "14:30",
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
    "21": {
      "mon": {
        "start": "18:00",
        "end": "19:30",
        "breakMinutes": "0",
        "counter": "",
        "note": "Pot accueil Paradis Camp."
      },
      "tue": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
      },
      "wed": {
        "start": "07:00",
        "end": "14:30",
        "breakMinutes": "0,50",
        "counter": "Sainte-Maxime",
        "note": "Max Ouv"
      },
      "thu": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée visite méd 8h30"
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
        "end": "16:00",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Renfort"
      },
      "sun": {
        "start": "09:00",
        "end": "16:15",
        "breakMinutes": "0",
        "counter": "St-Tropez Vieux Port",
        "note": "Trop Jour"
      }
    },
    "22": {
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
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "thu": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "fri": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "sat": {
        "start": "14:30",
        "end": "22:30",
        "breakMinutes": "1",
        "counter": "Sainte-Maxime",
        "note": "Max Apm"
      },
      "sun": {
        "start": "09:30",
        "end": "18:00",
        "breakMinutes": "1,50",
        "counter": "Sainte-Maxime",
        "note": "Max Journée"
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
  return current.slice(0, defaultEmployees.length);
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

function getMonthWeekSegments(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const segments = [];
  let current = [];

  for (let dayNumber = 1; dayNumber <= lastDay; dayNumber += 1) {
    const calendarDate = new Date(year, month, dayNumber);
    current.push({
      date: calendarDate,
      dayKey: dayKeyFromDate(calendarDate),
      label: new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(calendarDate)
    });

    if (calendarDate.getDay() === 0 || dayNumber === lastDay) {
      segments.push(current);
      current = [];
    }
  }

  return segments;
}

function getFiveWeekMonthDays(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = getMonday(first);
  return Array.from({ length: 35 }, (_, index) => addDays(start, index));
}

function getMonthCalendarDays(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const start = getMonday(first);
  const endDay = last.getDay();
  const daysToSunday = endDay === 0 ? 0 : 7 - endDay;
  const end = addDays(last, daysToSunday);
  const count = Math.round((end - start) / 86400000) + 1;
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}


function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: lastDay }, (_, index) => new Date(year, month, index + 1));
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
  const [skelloMode, setSkelloMode] = useState('week');
  const [monthEmployeeIndex, setMonthEmployeeIndex] = useState(0);
  const [skelloEditor, setSkelloEditor] = useState(null);
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

  const visibleDaysWeekTotalForEmployee = (employeeIndex, segmentDays, source = 'theoretical') => segmentDays.reduce((sum, item) => {
    const targetWeekKey = weekKeyFromDate(item.date);
    const shift = source === 'actual'
      ? getActualShift(targetWeekKey, employeeIndex, item.dayKey)
      : getShift(data, targetWeekKey, employeeIndex, item.dayKey);
    return sum + shiftMinutes(shift);
  }, 0);

  const monthTotalForEmployee = (employeeIndex) => {
    const year = selectedDateObject.getFullYear();
    const month = selectedDateObject.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    let total = 0;
    for (let dayNumber = 1; dayNumber <= lastDay; dayNumber += 1) {
      const calendarDate = new Date(year, month, dayNumber);
      const targetWeekKey = weekKeyFromDate(calendarDate);
      const targetDayKey = dayKeyFromDate(calendarDate);
      total += shiftMinutes(getShift(data, targetWeekKey, employeeIndex, targetDayKey));
    }
    return total;
  };

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
            <button className={activeView === 'month' ? 'active' : ''} onClick={() => setActiveView('month')}>Aperçu mensuel</button>
            <button className={activeView === 'skello' ? 'active' : ''} onClick={() => setActiveView('skello')}>Planning visuel</button>
            {isAdmin && <button className={activeView === 'data' ? 'active' : ''} onClick={() => setActiveView('data')}>Données</button>}
            <button className={activeView === 'week' ? 'active' : ''} onClick={() => setActiveView('week')}>Feuille d'Heures</button>
          </nav>

          {activeView === 'week' && (
            <div className="month-weeks-list">
              {getMonthWeekSegments(selectedDateObject).map((segmentDays) => {
                const firstDate = segmentDays[0].date;
                const lastDate = segmentDays[segmentDays.length - 1].date;
                const displayWeekKey = weekKeyFromDate(firstDate);
                return (
                  <section className="card month-week-card" key={`${displayWeekKey}-${toDateInputValue(firstDate)}`}>
                    <div className="section-title">
                      <div>
                        <h2>Semaine du {displayDate(firstDate)} au {displayDate(lastDate)}</h2>
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
                    <div style={{ overflowX: 'auto' }}>
                      <div
                        className="planning-grid admin-comparison-grid"
                        style={{
                          gridTemplateColumns: `125px repeat(${segmentDays.length}, 185px) 110px`,
                          width: 'fit-content',
                          minWidth: '100%'
                        }}
                      >
                      <div className="sticky-left header-cell">{isAdmin ? 'Salarié / type' : 'Salarié'}</div>
                      {segmentDays.map((item) => (
                        <div className="day-header" key={toDateInputValue(item.date)}>
                          {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                          <small>{displayDate(item.date)}</small>
                        </div>
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
                            {segmentDays.map((item) => {
                              const targetWeekKey = weekKeyFromDate(item.date);
                              const shift = row.source === 'actual'
                                ? getActualShift(targetWeekKey, employeeIndex, item.dayKey)
                                : getShift(data, targetWeekKey, employeeIndex, item.dayKey);
                              const canEditRow = row.editable && (isAdmin || isEmployeeUnlocked);
                              const updater = row.source === 'actual'
                                ? (emp, dayKey, field, value) => updateActualShift(emp, dayKey, field, value, targetWeekKey)
                                : (emp, dayKey, field, value) => updateShift(emp, dayKey, field, value, targetWeekKey);
                              return (
                                <div className={`shift-card ${row.source === 'actual' ? 'actual-row' : 'theoretical-row'} ${!canEditRow ? 'readonly-shift' : ''}`} key={`${targetWeekKey}-${employeeIndex}-${row.source}-${item.dayKey}`} style={{ backgroundColor: placeColor(shift.counter) }}>
                                  {canEditRow ? (
                                    <>
                                      <label>Début{renderTimeSelect(employeeIndex, item.dayKey, 'start', shift.start, updater)}</label>
                                      <label>Fin{renderTimeSelect(employeeIndex, item.dayKey, 'end', shift.end, updater)}</label>
                                      <label>Pause{renderPauseInput(employeeIndex, item.dayKey, shift, updater)}</label>
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
                                  {!canEditRow && (
                                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                      <small style={{ color: '#475569', fontWeight: 700 }}>Observation</small>
                                      <span style={{ fontSize: 13, color: '#0f172a', minHeight: 18 }}>{shift.note || '—'}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            <div className={`week-total-cell ${row.source === 'actual' ? 'actual-row' : ''}`}>
                              {formatHours(visibleDaysWeekTotalForEmployee(employeeIndex, segmentDays, row.source))}
                            </div>
                          </React.Fragment>
                        ));
                      })}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {activeView === 'month' && (
            <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {(() => {
                const employeeIndex = isAdmin ? Number(monthEmployeeIndex || 0) : Number(auth.employeeIndex || 0);
                const monthDays = getMonthCalendarDays(selectedDateObject);
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 20px', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                      <div>
                        <h2 style={{ margin: 0 }}>Aperçu mensuel — {employees[employeeIndex]}</h2>
                        <p style={{ margin: '5px 0 0', color: '#64748b' }}>{new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(selectedDateObject)} · Total mois : {formatHours(monthTotalForEmployee(employeeIndex))}</p>
                      </div>
                      {isAdmin && (
                        <label style={{ minWidth: 220 }}>
                          Salarié
                          <select value={employeeIndex} onChange={(e) => setMonthEmployeeIndex(Number(e.target.value))}>
                            {employees.map((employee, index) => <option key={index} value={index}>{employee}</option>)}
                          </select>
                        </label>
                      )}
                    </div>

                    <div style={{ overflowX: 'auto', background: '#f8fafc' }}>
                      <div style={{ minWidth: 980 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(135px, 1fr))', background: '#fff', borderBottom: '1px solid #dbe3ec' }}>
                          {days.map((day) => (
                            <div key={day.key} style={{ textAlign: 'center', padding: '12px 8px', borderLeft: '1px solid #eef2f7', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                              {day.label.slice(0, 3)}
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(135px, 1fr))', background: '#fff' }}>
                          {monthDays.map((calendarDate) => {
                            const targetWeekKey = weekKeyFromDate(calendarDate);
                            const targetDayKey = dayKeyFromDate(calendarDate);
                            const shift = getShift(data, targetWeekKey, employeeIndex, targetDayKey);
                            const inCurrentMonth = calendarDate.getMonth() === selectedDateObject.getMonth();
                            const hasShift = Boolean(shift.counter || shift.start || shift.end || (shift.note && !/^(repos|congés)$/i.test(shift.note)));
                            const isOff = !hasShift && /^(repos|congés)$/i.test(shift.note || '');
                            const isToday = toDateInputValue(calendarDate) === toDateInputValue(new Date());
                            return (
                              <div key={toDateInputValue(calendarDate)} style={{ minHeight: 105, padding: 7, borderLeft: '1px solid #eef2f7', borderBottom: '1px solid #e8edf3', background: inCurrentMonth ? '#fff' : '#f8fafc', opacity: inCurrentMonth ? 1 : .48, boxSizing: 'border-box' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                  <strong style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 12, background: isToday ? '#2563eb' : 'transparent', color: isToday ? '#fff' : '#0f172a' }}>{calendarDate.getDate()}</strong>
                                </div>
                                {hasShift ? (
                                  <div style={{ width: '100%', minHeight: 64, borderRadius: 7, padding: '8px 9px', textAlign: 'left', background: placeColor(shift.counter), boxShadow: 'inset 0 0 0 1px rgba(15,23,42,.08)', color: '#0f172a', boxSizing: 'border-box' }}>
                                    <div style={{ fontSize: 12, fontWeight: 850, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shift.start && shift.end ? `${shift.start} - ${shift.end}` : (shift.note || 'Shift')}</div>
                                    <div style={{ fontSize: 11, marginTop: 5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shift.counter || shift.note || 'Non renseigné'}</div>
                                    <div style={{ fontSize: 10, marginTop: 3, opacity: .72 }}>Pause {shift.breakMinutes || '0'} h · {formatHours(shiftMinutes(shift))}</div>
                                  </div>
                                ) : isOff ? (
                                  <div style={{ minHeight: 64, display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 700 }}>{shift.note}</div>
                                ) : (
                                  <div style={{ minHeight: 64 }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '12px 18px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', background: '#fff' }}>
                      <strong style={{ fontSize: 12 }}>Légende :</strong>
                      {places.filter(Boolean).slice(0, 8).map((place) => <span key={place} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: placeColor(place), border: '1px solid rgba(15,23,42,.1)' }} />{place}</span>)}
                    </div>
                  </>
                );
              })()}
            </section>
          )}


          {activeView === 'skello' && (
            <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 20px', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ margin: 0 }}>Planning visuel — {skelloMode === 'day' ? displayLongDate(selectedDateObject) : `semaine du ${displayDate(weekStart)}`}</h2>
                  <p style={{ margin: '5px 0 0', color: '#64748b' }}>{skelloMode === 'day' ? 'Vue journalière de l’ensemble des salariés.' : 'Vue compacte : un salarié par ligne et un jour par colonne.'}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <div className="global-mode-switch">
                    <button type="button" className={skelloMode === 'day' ? 'active' : 'secondary'} onClick={() => setSkelloMode('day')}>Journalier</button>
                    <button type="button" className={skelloMode === 'week' ? 'active' : 'secondary'} onClick={() => setSkelloMode('week')}>Semaine</button>
                  </div>
                  {skelloMode === 'week' ? (
                    <>
                      <button type="button" className="secondary" onClick={() => changeWeek(-1)}>← Semaine précédente</button>
                      <button type="button" className="secondary" onClick={() => setSelectedDate(toDateInputValue(new Date()))}>Aujourd'hui</button>
                      <button type="button" className="secondary" onClick={() => changeWeek(1)}>Semaine suivante →</button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="secondary" onClick={() => setSelectedDate(toDateInputValue(addDays(selectedDateObject, -1)))}>← Jour précédent</button>
                      <button type="button" className="secondary" onClick={() => setSelectedDate(toDateInputValue(new Date()))}>Aujourd'hui</button>
                      <button type="button" className="secondary" onClick={() => setSelectedDate(toDateInputValue(addDays(selectedDateObject, 1)))}>Jour suivant →</button>
                    </>
                  )}
                </div>
              </div>

              {skelloMode === 'day' ? (
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
                        <th colSpan={5}>Total cumulé de la journée</th>
                        <td className="total-cell">{formatHours(employees.reduce((sum, _, employeeIndex) => sum + dayTotalForEmployee(employeeIndex, selectedDayKey), 0))}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
              <div style={{ overflowX: 'auto', background: '#f8fafc' }}>
                <div style={{ minWidth: 1180 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px repeat(7, minmax(135px, 1fr)) 95px', position: 'sticky', top: 0, zIndex: 4, background: '#fff', borderBottom: '1px solid #dbe3ec' }}>
                    <div style={{ padding: '14px 12px', fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Salarié</div>
                    {days.map((day, index) => {
                      const date = addDays(weekStart, index);
                      const isToday = toDateInputValue(date) === toDateInputValue(new Date());
                      return (
                        <div key={day.key} style={{ textAlign: 'center', padding: '9px 6px', borderLeft: '1px solid #eef2f7' }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{day.label.slice(0, 3)}</div>
                          <div style={{ width: 30, height: 30, margin: '4px auto 0', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 800, background: isToday ? '#2563eb' : 'transparent', color: isToday ? '#fff' : '#0f172a' }}>{date.getDate()}</div>
                        </div>
                      );
                    })}
                    <div style={{ padding: '14px 6px', textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#64748b', borderLeft: '1px solid #eef2f7' }}>TOTAL</div>
                  </div>

                  {employees.map((employee, employeeIndex) => (
                    <div key={employeeIndex} style={{ display: 'grid', gridTemplateColumns: '150px repeat(7, minmax(135px, 1fr)) 95px', minHeight: 82, background: '#fff', borderBottom: '1px solid #e8edf3' }}>
                      <div style={{ padding: '12px 10px', display: 'flex', alignItems: 'center', gap: 9, fontWeight: 750, position: 'sticky', left: 0, zIndex: 2, background: '#fff', borderRight: '1px solid #eef2f7' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', color: '#334155', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, flex: '0 0 auto' }}>{String(employee || '?').slice(0, 2).toUpperCase()}</div>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee}</span>
                      </div>
                      {days.map((day) => {
                        const shift = getShift(data, weekKey, employeeIndex, day.key);
                        const hasShift = Boolean(shift.counter || shift.start || shift.end || (shift.note && !/^(repos|congés)$/i.test(shift.note)));
                        const isOff = !hasShift && /^(repos|congés)$/i.test(shift.note || '');
                        return (
                          <div key={day.key} style={{ padding: 7, borderLeft: '1px solid #eef2f7', minWidth: 0 }}>
                            {hasShift ? (
                              <button
                                type="button"
                                onClick={() => isAdmin && setSkelloEditor({ employeeIndex, dayKey: day.key })}
                                title={isAdmin ? 'Cliquer pour modifier' : `${shift.counter || ''} ${shift.start || ''}-${shift.end || ''}`}
                                style={{ width: '100%', minHeight: 64, border: 'none', borderRadius: 7, padding: '8px 9px', textAlign: 'left', cursor: isAdmin ? 'pointer' : 'default', background: placeColor(shift.counter), boxShadow: 'inset 0 0 0 1px rgba(15,23,42,.08)', color: '#0f172a' }}
                              >
                                <div style={{ fontSize: 12, fontWeight: 850, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shift.start && shift.end ? `${shift.start} - ${shift.end}` : (shift.note || 'Shift')}</div>
                                <div style={{ fontSize: 11, marginTop: 5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shift.counter || shift.note || 'Non renseigné'}</div>
                                <div style={{ fontSize: 10, marginTop: 3, opacity: .72 }}>Pause {shift.breakMinutes || '0'} h · {formatHours(shiftMinutes(shift))}</div>
                              </button>
                            ) : isOff ? (
                              <div style={{ minHeight: 64, display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 700 }}>{shift.note}</div>
                            ) : isAdmin ? (
                              <button type="button" onClick={() => setSkelloEditor({ employeeIndex, dayKey: day.key })} style={{ width: '100%', minHeight: 64, background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 7, color: '#64748b', fontSize: 11, cursor: 'pointer' }}>+ Ajouter un shift</button>
                            ) : (
                              <div style={{ minHeight: 64 }} />
                            )}
                          </div>
                        );
                      })}
                      <div style={{ borderLeft: '1px solid #eef2f7', display: 'grid', placeItems: 'center', fontWeight: 850, fontSize: 13 }}>{formatHours(weekTotalForEmployee(employeeIndex))}</div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              <div style={{ padding: '12px 18px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', background: '#fff' }}>
                <strong style={{ fontSize: 12 }}>Légende :</strong>
                {places.filter(Boolean).slice(0, 8).map((place) => <span key={place} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: placeColor(place), border: '1px solid rgba(15,23,42,.1)' }} />{place}</span>)}
              </div>

              {isAdmin && skelloEditor && (() => {
                const employeeIndex = skelloEditor.employeeIndex;
                const dayKey = skelloEditor.dayKey;
                const shift = getShift(data, weekKey, employeeIndex, dayKey);
                const dayInfo = days.find((item) => item.key === dayKey);
                const dayIndex = days.findIndex((item) => item.key === dayKey);
                return (
                  <div onMouseDown={(e) => { if (e.target === e.currentTarget) setSkelloEditor(null); }} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,.42)', display: 'grid', placeItems: 'center', padding: 18 }}>
                    <div style={{ width: 'min(520px, 96vw)', maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: 14, boxShadow: '0 24px 70px rgba(15,23,42,.28)', padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                        <div><h3 style={{ margin: 0 }}>{employees[employeeIndex]}</h3><p style={{ margin: '4px 0 0', color: '#64748b' }}>{dayInfo?.label} {displayDate(addDays(weekStart, dayIndex))}</p></div>
                        <button type="button" className="secondary" onClick={() => setSkelloEditor(null)}>Fermer</button>
                      </div>
                      <div style={{ display: 'grid', gap: 12 }}>
                        <label>Shift prédéfini{renderShiftPresetSelect(employeeIndex, dayKey, shift, 'theoretical', weekKey)}</label>
                        <label>Guichet / lieu{renderPlaceSelect(employeeIndex, dayKey, shift)}</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <label>Début{renderTimeSelect(employeeIndex, dayKey, 'start', shift.start)}</label>
                          <label>Fin{renderTimeSelect(employeeIndex, dayKey, 'end', shift.end)}</label>
                        </div>
                        <label>Pause (heures décimales){renderPauseInput(employeeIndex, dayKey, shift)}</label>
                        <label>Note<input value={shift.note || ''} onChange={(e) => updateShift(employeeIndex, dayKey, 'note', e.target.value)} placeholder="Optionnel" /></label>
                        <div style={{ padding: 10, borderRadius: 8, background: placeColor(shift.counter), fontWeight: 800 }}>Total : {formatHours(shiftMinutes(shift))}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <button type="button" className="secondary" onClick={() => {
                            updateShift(employeeIndex, dayKey, 'start', '');
                            updateShift(employeeIndex, dayKey, 'end', '');
                            updateShift(employeeIndex, dayKey, 'breakMinutes', '0');
                            updateShift(employeeIndex, dayKey, 'counter', '');
                            updateShift(employeeIndex, dayKey, 'note', 'Repos');
                            setSkelloEditor(null);
                          }}>Mettre en repos</button>
                          <button type="button" onClick={() => setSkelloEditor(null)}>Terminer</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
                    <span className="badge muted">{employees.length} lignes</span>
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
