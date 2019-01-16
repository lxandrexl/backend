const express = require('express');
const router = express.Router();

const UsuarioCtrl = require('../controllers/usuarioCtrl');

router.get('/usuario/zodiaco', UsuarioCtrl.GetZodiaco);

router.get('/usuario/videos', UsuarioCtrl.GetVideos);

router.get('/usuario/citasConf', UsuarioCtrl.CitasConf);

router.post('/usuario/profile', UsuarioCtrl.GetUserProfile);

router.post('/usuario/profiletoken', UsuarioCtrl.GetUserProfileByToken);

router.post('/usuario/details', UsuarioCtrl.GetDetailsUser);

router.post('/usuario/paquetes', UsuarioCtrl.GetPaquetes);

router.post('/usuario/llamar', UsuarioCtrl.LlamarPsiquica);

router.post('/usuario/sendMessage', UsuarioCtrl.SendMessage);

router.post('/usuario/getMessages', UsuarioCtrl.GetMessages);

router.post('/usuario/UpdateRoom', UsuarioCtrl.UpdateRoom);

router.post('/usuario/closeRoom', UsuarioCtrl.CloseRoom);

router.post('/usuario/expireRoom', UsuarioCtrl.ExpireRoom);

router.post('/usuario/updateUser', UsuarioCtrl.UpdateProfile);

router.post('/usuario/getCitas', UsuarioCtrl.GetCitas);

router.post('/usuario/setCita', UsuarioCtrl.SetCita);

router.post('/usuario/getCitasPendientes', UsuarioCtrl.GetCitasById);

router.post('/usuario/closeCita', UsuarioCtrl.CloseRoomJosie);


module.exports = router;