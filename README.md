# GdMAQ

## Introduction
GdMAQ fait partie de la suite E-SCOLIS et permet au personnel enseignant de gérer des maquettes scolaires. Cette application offre la possibilité de créer, modifier et organiser des maquettes académiques.

## Créateurs
### Projet Gdmaq - Équipe de développement
- **Pierre WADRA** et **Aya FSAHI** : Développeurs principaux, responsables de l'intégration et de la configuration du backend (Node.js, MongoDB, intégration de l'API RUGM).
- **Baptiste COSTAMAGNA** : Contributeur à la gestion du projet et au design.
- **Nathan RUEFF** : Principal collaborateur externe pour l'intégration avec l'API d'authentification (RUGM).
- **Rémy SAIL**, **Léo CUISSET** et **Hadir BARHOUMI** : Initiateurs du projet.

## Installation
Pour installer l'application, suivez les étapes ci-dessous et créez une instance de cluster MongoDB dédiée à cette application.

### Étapes d'installation
```bash
- $ git clone https://forgens.univ-ubs.fr/gitlab/projetwebsecu3/gdmaq.git
- $ cd gdMaq
- $ npm install
- $ npm install json2csv
```
Ensuite, créez un fichier .env contenant les variables d'environnement suivantes :

```bash
SESSION_SECRET="AUERHBAOZHUAOUZEHBUhazjefkqsdcoâpzerzeijn"
MONGODB_URI="mongodb+srv://pierre:vhmYRAxQ2XBPcrUs@cluster0.ltjdl.mongodb.net/?retryWrites=true&w=majority"
RUGM_API_URL=http://rugm.ensibs.fr:5000/api/auth
```
Il est possible que la base de données MongoDB ne soit plus fonctionnelle (pour l'année 2025 ou plus). Dans ce cas, veillez à en créer une nouvelle.

## Utilisation
Pour lancer le projet, utilisez la commande suivante :

```bash
$ node app.js
```