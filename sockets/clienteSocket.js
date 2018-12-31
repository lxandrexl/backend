module.exports = function(io) {
    io.on('connection', socket => {
        socket.on('llamar_psiquica', data => {
            io.emit('llamada_cliente', data);
        });
        socket.on('entrar_chat_cliente', data => {
            socket.join(data.roomToken);
        });
        socket.on('refreshPage', data => {
            io.emit('refresh', data);
        });
        socket.on('calendarJosie', data => {
            io.emit('refreshCalendar', data);
        })
    });
};