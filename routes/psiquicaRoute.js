const express = require('express');
const router = express.Router();

const PsiquicaCtrl = require('../controllers/PsiquicaCtrl');

router.get('/psiquica/all', PsiquicaCtrl.GetPsiquicas);

router.post('/psiquica/closeSession', PsiquicaCtrl.CloseSession);

router.post('/psiquica/updateStatus', PsiquicaCtrl.UpdateStatus);

router.post('/psiquica/makeRoom', PsiquicaCtrl.MakeRoom);

router.post('/psiquica/sendMessage', PsiquicaCtrl.SendMessage);

router.post('/psiquica/getMessages', PsiquicaCtrl.GetMessages);

router.post('/psiquica/closeRoom', PsiquicaCtrl.CloseRoom);

router.get('/psiquica/getJosieData', PsiquicaCtrl.GetJosieData);

module.exports = router;