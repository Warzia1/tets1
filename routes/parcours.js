const express = require('express');
const router = express.Router();
const parcoursController = require('../controllers/parcoursController');
const checkPermission = require('../middlewares/authorization');

router.get('/', checkPermission('view_parcours'), parcoursController.showIndex);

// Route for showing the create parcours form
router.get('/create', checkPermission('create_parcours'), parcoursController.showCreate);

// Route for handling the form submission to create a parcours
router.post('/create', checkPermission('create_parcours'), parcoursController.create);

// Route for handling the form submission to modify a parcours
router.post('/modify', checkPermission('modify_parcours'), parcoursController.modify);

// Route for handling the form submission to delete a parcours
router.post('/delete', checkPermission('delete_parcours'), parcoursController.delete);

module.exports = router;
