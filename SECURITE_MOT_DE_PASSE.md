# Sécurité par mot de passe partagé

Cette version garde un accès simple pour les salariés : un seul mot de passe d'accès à l'application.

## Fichiers modifiés

- `src/App.js` : utilise `REACT_APP_APP_PASSWORD` pour l'accès salarié et `REACT_APP_ADMIN_PASSWORD` pour l'accès administrateur.
- `vercel.json` : ajoute des headers de sécurité navigateur.
- `.env.example` : exemple des variables à créer dans Vercel.

## À configurer dans Vercel

Dans `Project Settings > Environment Variables`, créer :

- `REACT_APP_APP_PASSWORD` : mot de passe salariés.
- `REACT_APP_ADMIN_PASSWORD` : mot de passe admin.

Puis relancer un déploiement.

## Recommandation importante

Pour protéger réellement l'accès au site sans créer une liste de salariés, activez aussi la protection par mot de passe Vercel :

`Project Settings > Deployment Protection > Password Protection`

Cela protège l'accès au site avant même le chargement de l'application.

## Limite à connaître

Un mot de passe dans une application React n'est pas une sécurité forte pour Firebase, car le code final s'exécute dans le navigateur. Pour une sécurité forte de la base de données, il faut soit Firebase Authentication avec comptes utilisateurs, soit une API serveur qui écrit dans Firebase côté serveur.
