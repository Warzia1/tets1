const express = require('express');
const router = express.Router();
const ueController = require('../controllers/ueController');
const checkPermission = require('../middlewares/authorization');

router.get('/', checkPermission('view_ue'), ueController.showIndex);

// Route for showing the create ue form
router.get('/create', checkPermission('create_ue'), ueController.showCreate);

// Route for handling the form submission to create a ue
router.post('/create', checkPermission('create_ue'), ueController.create);

// Route for handling the form submission to modify a ue
router.post('/modify', checkPermission('modify_ue'), ueController.modify);

// Route for handling the form submission to delete a ue
router.post('/delete', checkPermission('delete_ue'), ueController.delete);

module.exports = router;
