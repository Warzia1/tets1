# Utiliser une image Node.js comme base
FROM node:18

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu de ton projet dans le conteneur
COPY . .

# Ajouter le fichier .env
COPY .env .env

# Exposer le port utilisé par l'application
EXPOSE 3000

# Commande pour démarrer le service
CMD ["node", "app.js"]
