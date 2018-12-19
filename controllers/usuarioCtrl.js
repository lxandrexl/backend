const HttpStatus = require('http-status-codes');
const mySql = require('../config/connectionDb');
const moment = require('moment');

module.exports = {
    async GetPaquetes(req, res) {
        try {
            var result = await mySql.query(`
            SELECT citas_josie, min_psiquica, min_gratis 
            FROM tbl_usuarios where id_usuario='${req.body._id}'`)
        } catch (err) { throw new Error(err) }

        if (result.length > 0) {
            const data = result[0];

            return res.status(HttpStatus.CREATED)
                .json({ message: 'Paquetes encontrados exitosamente.', data });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El usuario no existe.' });
        }
    },
    async LlamarPsiquica(req, res) {
        try {
            var result = await mySql.query(`
            UPDATE tbl_psiquicas set estado = 0 where id_psiquica = ${req.body._id}`)
        } catch (err) { throw new Error(err) }

        if (result.affectedRows <= 0) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Ocurrio un error, intentelo nuevamente.' });
        } else {

            try {
                var data = await mySql.query(`SELECT id_psiquica, estado, 
                usuario, foto,descripcion, signo,elemento,piedra
                FROM tbl_psiquicas where id_psiquica='${req.body._id}'`)
            } catch (err) { throw new Error(err) }
            const psiquica = data[0];
            return res.status(HttpStatus.OK)
                .json({ message: 'Llamada en proceso.', psiquica: psiquica });
        }
    },

    async SendMessage(req, res) {
        try {
            var result = await mySql.query(`select * from tbl_chat 
            where token = '${req.body.room}'`)
        } catch (err) { throw new Error(err) }

        if (result.length > 0) {
            try {
                var result = await mySql.query(`insert into tbl_conversacion
                (id_chat, emisor, mensaje) VALUES (
                ${result[0].id_chat}, '${req.body.sender}', '${req.body.message}'
                )`)
            } catch (err) { throw new Error(err) }

            if (result.affectedRows > 0) {
                return res.status(HttpStatus.OK).json({ message: 'Enviado con exito.' });
            } else {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Ocurrio un error al enviar su mensaje.' });
            }

        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El chat privado no existe.' });
        }
    },

    async GetMessages(req, res) {
        try {
            var result = await mySql.query(`select * from tbl_chat 
            where token = '${req.body.room}'`)
        } catch (err) { throw new Error(err) }

        if (result.length > 0) {
            let idChat = result[0].id_chat;
            try {
                var chatContent = await mySql.query(`select * from tbl_conversacion 
                where id_chat = '${idChat}'`)
            } catch (err) { throw new Error(err) }

            if (chatContent.length > 0) {
                return res.status(HttpStatus.OK)
                    .json({ message: 'Historial de chats encontrados.', data: chatContent });
            } else {
                return res.status(HttpStatus.OK)
                    .json({ message: 'El chat privado no contiene mensajes', data: [] });
            }

        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El chat privado no existe.' });
        }
    },

    async UpdateRoom(req, res) {
        const idCliente = req.body.cliente.id_usuario;
        const tokenRoom = req.body.room;
        const timeRoom = req.body.data.timeTotal;
        const validatorTime = parseInt(req.body.data.paquetePsiquicaActual) - 1;
        let secondsTmp = parseInt(req.body.data.secondsRoom);
        let minutesTmp = parseInt(req.body.data.minutesRoom);

        if (req.body.finish) {
            if (validatorTime >= 0 && validatorTime >= minutesTmp) {
                if (secondsTmp < 30) minutesTmp++;
            }
        }
        try {
            var result = await mySql.query(`update tbl_chat set tiempo = '${timeRoom}'
            where token = '${tokenRoom}'`);
        } catch (err) { throw new Error(err) }

        if (result.affectedRows > 0) {
            try {
                var result = await mySql.query(`update tbl_usuarios set 
                min_psiquica = '${minutesTmp}' where id_usuario = ${idCliente}`);
            } catch (err) { throw new Error(err) }
            console.log(minutesTmp);
            return res.status(HttpStatus.OK)
                .json({ message: 'Actualización realizada correctamente.' });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error al actualizar el tiempo del chat.' });
        }


    },

    async CloseRoom(req, res) {
        if (req.body.tiempo === 'expire_action') {
            try {
                var result = await mySql.query(`update tbl_chat set
                evaluacion = ${req.body.evaluacion}, comentario = '${req.body.comentario}' 
                where token = '${req.body.room}'`)
            } catch (err) { throw new Error(err) }
            if (result.affectedRows > 0) {
                return res.status(HttpStatus.OK)
                    .json({ message: 'Chat cerrado' });
            } else {
                return res.status(HttpStatus.CONFLICT)
                    .json({ message: 'Ocurrio un error, al cerrar el chat' });
            }
        } else {
            try {
                var result = await mySql.query(`update tbl_chat set estado = 0,
                evaluacion = ${req.body.evaluacion}, comentario = '${req.body.comentario}', 
                tiempo = '${req.body.tiempo}', fecha_fin = '${moment().format('YYYY-MM-DD HH:mm:ss')}'
                where token = '${req.body.room}'`)
            } catch (err) { throw new Error(err) }

            if (result.affectedRows > 0) {
                try {
                    await mySql.query(`UPDATE tbl_psiquicas set estado = 1 
                    where id_psiquica = ${req.body.psiquica}`)
                } catch (err) { throw new Error(err) }

                return res.status(HttpStatus.OK)
                    .json({ message: 'Chat cerrado' });
            } else {
                return res.status(HttpStatus.CONFLICT)
                    .json({ message: 'Ocurrio un error, intentelo nuevamente' });
            }
        }
    },

    async ExpireRoom(req, res) {
        try {
            var result = await mySql.query(`update tbl_chat set estado = 0,
            fecha_fin = '${moment().format('YYYY-MM-DD HH:mm:ss')}'
            where token = '${req.body.room}'`)
        } catch (err) { throw new Error(err) }

        if (result.affectedRows > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'El tiempo del chat a terminado.' });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, al cerrar el chat' });
        }
    }
}