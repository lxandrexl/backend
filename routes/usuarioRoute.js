const express = require('express');
const router = express.Router();

const UsuarioCtrl = require('../controllers/usuarioCtrl');

router.post('/usuario/paquetes', UsuarioCtrl.GetPaquetes);

router.post('/usuario/llamar', UsuarioCtrl.LlamarPsiquica);

router.post('/usuario/sendMessage', UsuarioCtrl.SendMessage);

router.post('/usuario/getMessages', UsuarioCtrl.GetMessages);

module.exports = router;