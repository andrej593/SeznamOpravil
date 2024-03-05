var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const { protectRoute } = require("../auth/protect");

router.get('/login', userController.showLogin);
router.get('/register', userController.showRegister);
router.get('/homePage', protectRoute, userController.showHomePage);

router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/', userController.list);
router.get('/:id', userController.show);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;