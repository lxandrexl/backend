module.exports = function(io) {
    io.on('connection', socket => {
        socket.on('mensaje', data => {
            io.to(data.room).emit("recibir_mensaje", {});
        });
        socket.on('close_session', data => {
            io.to(data.room).emit('end_chat', {});
        });
        socket.on('continue_timer_navbar', data => {
            io.to(data.room).emit('continue_timer', {});
        });
        socket.on('expire_time', data => {
            io.to(data.room).emit('end_chat_system', {});
        })
    });
};