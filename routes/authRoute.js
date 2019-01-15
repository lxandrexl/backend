const express = require('express');
const router = express.Router();

const AuthCtrl = require('../controllers/authCtrl');

router.post('/register', AuthCtrl.crearCliente);
router.post('/login', AuthCtrl.LoginGeneral);
router.post('/loginPsiquica', AuthCtrl.LoginPsiquica);

module.exports = router;