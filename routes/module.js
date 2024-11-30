const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const checkPermission = require('../middlewares/authorization');

router.get('/', checkPermission('view_module'), moduleController.showIndex);
router.get('/create', checkPermission('create_module'), moduleController.showCreate);
router.post('/create', checkPermission('create_module'), moduleController.create);
router.get('/modify', checkPermission('modify_module'), moduleController.showModify);
router.post('/modify', checkPermission('modify_module'), moduleController.modify);
router.post('/delete', checkPermission('delete_module'), moduleController.delete);

module.exports = router;
