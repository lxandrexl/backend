module.exports = function(io) {
    io.on('connection', socket => {
        socket.on('refreshPsiquicas', data => {
            io.emit('refreshPsiquicasList', data);
        });
        socket.on('cancelar_llamada', data => {
            io.emit('cancelo_llamada', data);
        });
        socket.on('crear_chat', data => {
            io.emit('llamada_aceptada', data);
        });
        socket.on('entrar_chat_psiquica', data => {
            socket.join(data.roomToken);
        });
        socket.on('josie_online', data => {
            io.emit('listen_josie', data);
        });
        socket.on('cancelar_llamada_josie', data => {
            io.emit('listen_josie_cancel', data);
        });
        socket.on('crear_chat_josie', data => {
            io.emit('llamada_aceptada_josie', data);
        });
    });
};