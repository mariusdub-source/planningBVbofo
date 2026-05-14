# Planning Maritime - détail + aperçu global

Cette version comprend :

- **Planning détaillé** conservé comme affichage principal
- **Onglet Aperçu global** pour voir uniquement :
  - le lieu
  - le poste
- **Couleur différente par lieu** dans l'aperçu global
- calendrier pour choisir la semaine du planning
- semaine précédente / suivante / aujourd'hui
- stockage séparé pour chaque semaine
- colonne Total semaine à droite de Dimanche
- total semaine
- total mensuel
- export CSV

## Accès

- mot de passe site : `BV2026#`
- mot de passe admin : `Marius24#`

## Installation

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Vercel

- Framework Preset : Create React App
- Build Command : npm run build
- Output Directory : build


## Nouveauté

- affichage à l'écran du **total de personnes par lieu et par jour**
- comptage automatique pour :
  - Sainte-Maxime
  - St-Tropez Vieux Port
  - Les Issambres
  - Aquascope
  - Port Grimaud Eglise
  - Port Grimaud Capit
  - Marines Cog


## Présentation des totaux par lieu

Les totaux de personnes par lieu sont maintenant affichés **en haut sous forme de cartes** :

- une carte par lieu
- total semaine du lieu
- détail lundi à dimanche
- couleur associée au lieu


## Salariés

La liste garde **20 salariés**.

Les 14 premiers noms sont :

- Julie
- Caroline
- Marius
- Véronique
- Fabienne
- Carine
- Corinne
- Olympia
- Cendrine
- Hélène
- Anaïs
- Agathe
- Myriam
- Nôa

Les 6 lignes restantes restent disponibles et modifiables.

En **mode admin**, les noms des salariés peuvent être modifiés directement dans la colonne de gauche.
