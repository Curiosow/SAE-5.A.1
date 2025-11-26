# SAE-5.A.1

Ce projet contient tout le frontend de la SAE.

## Requirement

Pour effectuer toute opération sur le projet, **vous devez accéder au sous-dossier**, le dossier principal étant uniquement destiné à l'utilisation des fichiers readme et autres.

## Installation

Veillez à installer les dépendances :

```bash
npm install
```

## Serveur de développement

Démarrez le serveur de développement sur `http://localhost:3000`:

```bash
npm run dev
```

## Production

> ### Pour de la production, votre machine de production doit absolument utiliser une variable d'environnement, sinon, les requêtes se feront sur le serveur local : 
> NODE_ENV=production

Construisez l'application pour la production :

```bash
npm run build
```

Lancez l'application construite : 

```bash
npm run start
```

## Authors

- [@Curiosow](https://www.github.com/Curiosow)
- [@8rubi](https://www.github.com/8rubi)
- [@MatisT05](https://www.github.com/MatisT05)
- [@NoaBaj](https://www.github.com/NoaBaj)
- [@TWP444](https://www.github.com/TWP444)

## Tech Stack

### Framework & Core
- **Nuxt.js 4** - Framework Vue.js full-stack qui offre le routing automatique, le SSR (Server-Side Rendering), et une simplification du développement en général. Choisi pour sa simplicité de configuration et ses performances optimisées.
- **Vue.js 3** - Framework JavaScript réactif et progressif. Utilisé pour sa syntaxe intuitive, sa réactivité performante, et son écosystème riche.
- **TypeScript** - Langage typé qui améliore la maintenabilité du code et réduit les erreurs à l'exécution.

### Styling
- **Tailwind CSS** - Framework CSS utilitaire permettant de construire rapidement des interfaces modernes et responsives. Choisi pour sa flexibilité, sa personnalisation (couleurs, animations), et sa productivité accrue.

### Visualisation de données
- **Chart.js** & **vue-chartjs** - Bibliothèques pour créer des graphiques interactifs (barres, radar, doughnut). Parfaites pour afficher les statistiques des joueuses, les analyses de performance et les comparaisons visuelles.

### Utilitaires
- **PapaParse** - Bibliothèque robuste pour le parsing de fichiers CSV. Utilisée pour l'importation et le traitement des données de match depuis des fichiers CSV.
- **Vue Router** - Système de routing intégré à Nuxt pour la navigation entre les pages de l'application.
