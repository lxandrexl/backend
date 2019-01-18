const mySql = require('../config/connectionDb');
const moment = require('moment');

module.exports = {
    async GetPsiquicas() {
        try {
            var result = await mySql.query(`
            SELECT id_psiquica, estado, usuario, foto,descripcion,
            signo,elemento,piedra FROM tbl_psiquicas 
            where deleted = 0 and usuario != 'JOSIE' order by estado desc`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async GetComentarios(_id) {
        try {
            var result = await mySql.query(`
                SELECT c.id_chat, c.id_usuario as chatusu, c.evaluacion, c.comentario, c.id_psiquica,
                u.id_usuario, u.nombre, u.apellido_paterno from tbl_chat c
                inner join tbl_usuarios u on c.id_usuario = u.id_usuario
                where c.id_psiquica = ${_id} and evaluacion > 1 and comentario != '' order by fecha_fin desc LIMIT 10 
            `)
        } catch (err) { throw new Error(err); }

        return result;
    },

    async GetPsiquica(_id) {
        try {
            var result = await mySql.query(`SELECT id_psiquica, estado, 
                usuario, foto,descripcion, signo,elemento,piedra
                FROM tbl_psiquicas where id_psiquica='${_id}'`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async CloseSession(_id) {
        try {
            var result = await mySql.query(`
              UPDATE tbl_psiquicas set estado = 0 where id_psiquica = ${_id}`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async UpdateStatus(_id) {
        try {
            var result = await mySql.query(`
              UPDATE tbl_psiquicas set estado = 1 where id_psiquica = ${_id}`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async MakeRoom(user, psiquica, hash) {
        try {
            var result = await mySql.query(`
                INSERT INTO tbl_chat (id_usuario,id_psiquica,token, fecha_inicio) 
                VALUES('${user}','${psiquica}', '${hash}',
                '${moment().format('YYYY-MM-DD HH:mm:ss')}')`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async GetRoomBytoken(token) {
        try {
            var result = await mySql.query(`select * from tbl_chat 
              where token = '${token}'`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async SaveConversation(room, emitter, message) {
        try {
            var result = await mySql.query(`insert into tbl_conversacion
                (id_chat, emisor, mensaje) VALUES (
                ${room}, '${emitter}', '${message}'
                )`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async GetConversationByRoom(room) {
        try {
            var result = await mySql.query(`select * from tbl_conversacion 
                where id_chat = '${room}'`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async CloseRoom(room, evaluacion, comentario) {
        try {
            var result = await mySql.query(`update tbl_chat set estado = 0,
              evaluacion = ${evaluacion}, comentario = '${comentario}', 
              fecha_fin = '${moment().format('YYYY-MM-DD HH:mm:ss')}'
              where token = '${room}'`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async GetJosieData() {
        try {
            var result = await mySql.query(`select * from tbl_psiquicas where usuario = 'JOSIE'`);
        } catch (err) {
            throw new Error(err);
        }
        return result;
    },

    async VerifyRoom(room) {
        try {
            var result = await mySql.query(`select * from tbl_chat 
            where token = '${room}'`)
        } catch (err) { throw new Error(err) }
        return result;
    },

    async SaveMessage(id_chat, sender, message) {
        try {
            var result = await mySql.query(`insert into tbl_conversacion
            (id_chat, emisor, mensaje) VALUES (
            ${id_chat}, '${sender}', '${message}'
            )`)
        } catch (err) { throw new Error(err) }
        return result;
    }
};