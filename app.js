  const express = require('express');
  const mongoose = require('mongoose');
  const session = require('express-session');
  const dotenv = require('dotenv');
  const { autoLoginAdmin } = require('./config/rugm');

  mongoose.set('strictQuery', false);
  dotenv.config();

  const app = express();
  const parcoursController = require('./controllers/parcoursController');
  const ueController = require('./controllers/ueController');
  const moduleController = require('./controllers/moduleController');
  const parcoursRoutes = require('./routes/parcours');
  const ueRoutes = require('./routes/ue');
  const moduleRoutes = require('./routes/module');
  const exportRoutes = require('./routes/exportRoutes');
  app.use('/api/indicateurs', exportRoutes);

  // Configuration de EJS et MongoDB
  app.set('view engine', 'ejs');
  app.set('views', './views');
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Middleware pour gérer les sessions
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
  }));

  // Middleware pour gérer les données des formulaires
  app.use(express.urlencoded({ extended: true }));



  // Connexion automatique avec test_admin lors du démarrage
  app.use(async (req, res, next) => {
    if (!req.session.accessToken) {
      try {
        await autoLoginAdmin(req);
        req.session.save((err) => {
          if (err) console.error("Erreur lors de la sauvegarde de la session :", err);
          else console.log("Session sauvegardée avec succès après l'authentification.");
        });
      } catch (error) {
        console.error("Erreur lors de la connexion automatique de test_admin :", error);
        return res.status(500).send("Erreur de connexion automatique");
      }
    }
    next();
  });

  // Route par défaut pour rediriger vers /maquette
  app.get('/', (req, res) => {
    res.redirect('/maquette');
  });

  // Configuration des routes
  app.use('/maquette', require('./routes/maquette'));
  app.get('/parcours', parcoursController.showIndex);
  app.get('/ue', ueController.showIndex);
  app.get('/module', moduleController.showIndex);
  app.use('/parcours', parcoursRoutes);
  app.use('/ue', ueRoutes);
  app.use('/module', moduleRoutes);

  // Middleware pour les fichiers statiques
  app.use(express.static('public'));

  // Lancer le serveur
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT} http://localhost:3000`);
  });
