////Mit de côté pour le moment


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/', authController.isAuthenticated, userController.showUserManagementPage);
// router.post('/create', authController.isAuthenticated, userController.createUser);
// router.get('/editPassword/:userId', authController.isAuthenticated, userController.editPasswordPage);
// router.post('/editPassword/:userId', authController.isAuthenticated, userController.updatePassword);
// router.get('/editUsername/:userId', authController.isAuthenticated, userController.editUsernamePage);
// router.post('/editUsername/:userId', authController.isAuthenticated, userController.updateUsername);
// router.post('/delete', authController.isAuthenticated, userController.deleteUser);

module.exports = router;
