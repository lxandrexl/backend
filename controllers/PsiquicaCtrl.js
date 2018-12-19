const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const mySql = require('../config/connectionDb');
const moment = require('moment');

module.exports = {
    async GetPsiquicas(req, res) {
        try {
            var result = await mySql.query(`
            SELECT id_psiquica, estado, usuario, foto,descripcion,
            signo,elemento,piedra FROM tbl_psiquicas 
            where deleted = 0 and usuario != 'JOSIE' order by estado desc`)
        } catch (err) { throw new Error(err) }

        if (result.length > 0) {
            const data = result;

            return res.status(HttpStatus.CREATED)
                .json({ message: 'Listado Psiquicas encontrados correctamente.', data });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'No existen psiquicas en este momento.' });
        }
    },
    async CloseSession(req, res) {
        const _id = req.body.id_psiquica;
        try {
            var result = await mySql.query(`
            UPDATE tbl_psiquicas set estado = 0 where id_psiquica = ${_id}`)
        } catch (err) { throw new Error(err) }

        if (result.affectedRows <= 0) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'No se pudo cerrar la sesión, intente de nuevo por favor.' });
        } else {
            return res.status(HttpStatus.OK)
                .json({ message: 'Sesión terminada.' });
        }
    },
    async UpdateStatus(req, res) {
        const _id = req.body.id_psiquica;
        try {
            var result = await mySql.query(`
            UPDATE tbl_psiquicas set estado = 1 where id_psiquica = ${_id}`)
        } catch (err) { throw new Error(err) }

        if (result.affectedRows <= 0) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'No se pudo actualizar su estado, cierre sesión y vuelva a ingresar.' });
        } else {
            try {
                var data = await mySql.query(`SELECT id_psiquica, estado, 
                usuario, foto,descripcion, signo,elemento,piedra
                FROM tbl_psiquicas where id_psiquica='${_id}'`)
            } catch (err) { throw new Error(err) }
            const psiquica = data[0];

            return res.status(HttpStatus.OK)
                .json({ message: 'Llamada cancelada correctamente.', psiquica: psiquica });
        }
    },
    async MakeRoom(req, res) {
        const Cliente = req.body.cliente;
        const Psiquica = req.body.psiquica;
        if (!Cliente && !Psiquica) {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, vuelva a iniciar sesión.' });
        }

        let chatToken = new Date();

        return bcrypt.hash(chatToken.toString(), 10, async(err, hash) => {
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST)
                    .json({ message: 'Error encriptando el chat privado.' });
            }

            try {
                var result = await mySql.query(`
                INSERT INTO tbl_chat (id_usuario,id_psiquica,token, fecha_inicio) 
                VALUES('${Cliente.id_usuario}', '${Psiquica.id_psiquica}', '${hash}',
                '${moment().format('YYYY-MM-DD HH:mm:ss')}')`)
            } catch (err) { throw new Error(err) }

            if (result.insertId) {
                return res.status(HttpStatus.OK)
                    .json({ message: 'Chat creado correctamente.', chatId: result.insertId, chatToken: hash });
            } else {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Ocurrio un error, al crear el chat privado.' });
            }

        });

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

        const timeRoom = result[0].tiempo;

        if (result.length > 0) {
            let idChat = result[0].id_chat;
            try {
                var chatContent = await mySql.query(`select * from tbl_conversacion 
                where id_chat = '${idChat}'`)
            } catch (err) { throw new Error(err) }

            if (chatContent.length > 0) {
                return res.status(HttpStatus.OK)
                    .json({ message: 'Historial de chats encontrados.', data: chatContent, timeRoom: timeRoom });
            } else {
                return res.status(HttpStatus.OK)
                    .json({ message: 'El chat privado no contiene mensajes', data: [], timeRoom: timeRoom });
            }

        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El chat privado no existe.' });
        }
    },

    async CloseRoom(req, res) {
        try {
            var result = await mySql.query(`update tbl_chat set estado = 0,
            evaluacion = ${req.body.evaluacion}, comentario = '${req.body.comentario}', 
            fecha_fin = '${moment().format('YYYY-MM-DD HH:mm:ss')}'
            where token = '${req.body.room}'`)
        } catch (err) { throw new Error(err) }

        if (result.affectedRows > 0) {
            try {
                await mySql.query(`UPDATE tbl_psiquicas set estado = 1 
                where id_psiquica = ${req.body.psiquica.id_psiquica}`)
            } catch (err) { throw new Error(err) }

            return res.status(HttpStatus.OK)
                .json({ message: 'Chat terminado' });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, intentelo nuevamente' });
        }

    }
}