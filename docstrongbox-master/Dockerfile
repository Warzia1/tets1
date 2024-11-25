# Utiliser l'image de base Node.js
FROM node:18

# Créer et définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY ./config ./config
COPY ./model ./model
COPY ./routes ./routes
COPY ./server.js ./server.js
COPY ./openapi.yaml ./openapi.yaml

# Lancer l'application
CMD ["npm", "start"]