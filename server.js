const secretKey = require('./config/secretKeys');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const _ = require('lodash');
const logger = require('morgan');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const filePath = express.static('files');

// Dependencias
const auth = require('./routes/authRoute');
const usuario = require('./routes/usuarioRoute');
const psiquica = require('./routes/psiquicaRoute');

// Sockets
require('./sockets/psiquicaSocket')(io);
require('./sockets/clienteSocket')(io);
require('./sockets/privateSocket')(io);

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(logger('dev'));


// Rutas
app.use('/files', filePath);
app.use('/api/josiechat/v1', auth);
app.use('/api/josiechat/v1', usuario);
app.use('/api/josiechat/v1', psiquica);

// Servidor 
server.listen(secretKey.portServer, () => {
    console.log('Servidor escuchando puerto', secretKey.portServer);
});