# Planning salariés - saisie des horaires

Application React pour 20 salariés avec saisie des horaires de travail.

## Fonctions

- mot de passe général pour ouvrir l'application : `BV2026#`
- 20 salariés affichés dans une colonne à gauche
- mot de passe individuel par salarié pour saisir ses horaires
  - les accents sont acceptés ou non acceptés pour les prénoms accentués
- saisie par jour : heure de début, heure de fin, pause, guichet, total automatique
- aperçu journalier
- aperçu semaine
- aperçu mensuel
- export CSV
- sauvegarde automatique dans le navigateur via `localStorage`
- chaque salarié connecté voit uniquement ses propres horaires
- mode admin visible avec le mot de passe : `Marius24#`
- en mode admin, tous les salariés sont visibles et les noms peuvent être modifiés

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
- Build Command : `npm run build`
- Output Directory : `build`

## Note de sécurité

Les mots de passe sont côté navigateur, donc suffisants pour une application locale/simple mais pas pour une sécurité réelle en production. Pour empêcher techniquement l'accès aux données des autres salariés, il faut ajouter une authentification serveur et une base de données.


## Mise à jour

- Ajout du champ **Guichet** entre **Pause** et **Total** pour indiquer le lieu du poste.
- Le guichet est sauvegardé avec les horaires et inclus dans l'export CSV.

## Mise à jour données

- Ajout d'une page **Données**, accessible en mode admin uniquement.
- Modification centralisée des 20 noms de salariés.
- Modification des lieux / guichets disponibles.
- Ajout et suppression de lieux.
- Le champ **Guichet** utilise maintenant une liste déroulante alimentée par la page Données.

## Mise à jour horaires déroulants

- Remplacement des champs horaires natifs par deux listes déroulantes :
  - une liste **Heure** de `00:00` à `23:00`
  - une liste **Minutes décimales** configurable
- Les minutes décimales par défaut sont : `0`, `0,08`, `0,16`, `0,25`, `0,33`, `0,41`, `0,5`, `0,58`, `0,66`, `0,75`, `0,83`, `0,91`.
- La page **Données** permet aussi de modifier, ajouter ou supprimer les valeurs de minutes décimales.

## Mise à jour accès admin et fond de connexion

- L'accès au site utilise le mot de passe général : `BV2026#`.
- Le bouton **Admin** est maintenant placé en haut du panneau de connexion.
- Le champ mot de passe admin s'affiche uniquement après clic sur **Admin**.
- Ajout de l'image fournie en fond d'écran de la page de connexion, avec une version compressée.


## Accès

- Accès application : `BV2026#`

## Mise à jour

- Ajout de la photo Les Bateaux Verts en bas de la page principale.


## Mise à jour v14

- Largeur des colonnes de l’aperçu semaine ajustée pour afficher entièrement la liste des minutes décimales.
- Largeur générale de l’application augmentée sur écran large.

## Mise à jour v15

- Le champ **Pause** utilise maintenant une liste déroulante avec les valeurs : `0,25`, `0,33`, `0,50`, `0,75`, `1`, `1,25`, `1,33`, `1,50`, `1,75`, `2,00`.
- La saisie manuelle d'une pause reste possible.
- Les valeurs de pause sont exprimées en heures décimales.
- Le total journalier déduit automatiquement la pause.
- Une section **Pauses décimales** a été ajoutée dans la page **Données** pour modifier la liste.

## Vue globale

Un onglet **Vue globale**, réservé au mode administrateur, affiche le planning journalier des 20 salariés pour la date sélectionnée : début, fin, pause, guichet, total de la journée et note.


## Vue globale visible par tous

L’onglet **Vue globale** est accessible à tous les salariés connectés. Il affiche en lecture seule le planning journalier de l’ensemble des salariés afin que chacun puisse savoir qui travaille dans les différents guichets. La modification des horaires des autres salariés reste réservée au mode administrateur.


## Planning prérempli

Le planning du 15 au 21 juin 2026 est prérempli à partir du document transmis. Les données existantes dans le navigateur sont conservées et restent prioritaires en cas de modification manuelle.

## Reconduction automatique des semaines

À partir de la semaine du 15 juin 2026, une nouvelle semaine reprend automatiquement les horaires, pauses, guichets et notes de la semaine précédente. Les valeurs héritées restent affichées jusqu'à leur modification. Toute modification est ensuite enregistrée uniquement pour la semaine concernée et sert de modèle à la semaine suivante.


## Version 21

- Le champ Guichet est placé avant les heures de début et de fin.
- Chaque guichet utilise une couleur différente dans les vues de planning.
- La Vue globale propose désormais un affichage journalier et un affichage semaine.

## Version 22 — aperçu mensuel

- aperçu mensuel présenté comme un calendrier complet
- 7 colonnes du lundi au dimanche
- 5 lignes correspondant aux 5 semaines affichées
- chaque journée indique le guichet, les horaires, la pause et le total
- les journées hors du mois sont atténuées

## Version 23 — Planning théorique et heures réelles

- La **Vue globale** est modifiable par l'administrateur et constitue le planning théorique.
- Le planning théorique est affiché aux salariés dans les vues journalier et mensuel.
- Dans **Aperçu semaine**, chaque salarié saisit ses heures réellement effectuées.
- Une case **Semaine validée** transmet les heures réelles à l'administrateur.
- L'administrateur dispose, pour chaque salarié, d'une ligne **Théorique** et d'une ligne **Compté**.
- Toute modification faite par le salarié après validation retire automatiquement la validation jusqu'à une nouvelle confirmation.

## Version 24 — Affichage réservé à l’administrateur

- Les libellés **Théorique** et **Compté** sont visibles uniquement en mode administrateur.
- Le salarié voit uniquement sa propre ligne de saisie dans l’aperçu semaine.
- La case de validation de semaine reste disponible pour le salarié.

## Version 25

- Suppression de l’onglet Aperçu journalier.
- Les vues disponibles sont Aperçu semaine, Aperçu mensuel et Vue globale.

## Version 26 — Toutes les semaines du mois

Dans l'onglet **Aperçu semaine**, toutes les semaines du mois sélectionné sont désormais affichées sur la même page. Chaque semaine conserve sa propre validation et ses propres données théoriques/réelles.


## V28

- Colonne Total semaine maintenue à droite après le dimanche.
- Flèches de navigation semaine précédente / suivante ajoutées en haut.

## V29 — Shifts horaires prédéfinis

- nouvelle section **Shifts horaires** dans la page **Données** ;
- horaires extraits et triés à partir des plannings fournis ;
- chaque shift contient un nom, un guichet, une heure de début, une heure de fin et une pause ;
- ajout, modification et suppression possibles ;
- sélection d'un shift dans l'aperçu semaine et dans la Vue globale Admin ;
- le choix remplit automatiquement le guichet, le début, la fin et la pause.
