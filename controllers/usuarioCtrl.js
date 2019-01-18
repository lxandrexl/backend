const HttpStatus = require('http-status-codes');
const mySql = require('../config/connectionDb');
const userModel = require('../models/userModel');
const moment = require('moment');

module.exports = {
    async UpdateProfile(req, res) {
        const data = req.body;
        //if (data.image && data.extension) {
        //    await userModel.UpdatePhotoProfile(data.user, data.image, data.extension);
        //}
        const result = await userModel
            .UpdateProfile(data.user, data.name, data.apPaterno, data.apMaterno);

        if (result.affectedRows > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'Datos actualizados correctamente.' });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, intentelo nuevamente.' });
        }
    },

    async HistorialCompras(req, res) {
        const compras = await userModel.GetHistorialCompras(req.body.email);
        if(compras.length > 0) {
             return res.status(HttpStatus.OK)
                .json({ message: 'Compras encontradas.', data: compras });
        } else {
            return res.status(HttpStatus.OK)
                .json({ message: 'No tiene compras.', data: [] });
        }
    },

    async GetUserProfile(req, res) {
        const user = await userModel.GetUserProfile(req.body.id_usuario);
        if (user.length > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'Datos encontrados exitosamente.', data: user[0] });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'No existe el usuario.' });
        }
    },

    async GetUserProfileByToken(req, res) {
        const user = await userModel.GetUserProfileByToken(req.body.token);
        if (user.length > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'Datos encontrados exitosamente.', data: user[0] });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'No existe el usuario.' });
        }
    },

    async GetDetailsUser(req, res) {
        try {
            var result = await mySql.query(`
            SELECT * FROM tbl_zodiaco where nombre = '${req.body.name}'`)
        } catch (err) { throw new Error(err) }

        if (result.length > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'Detalles encontrados exitosamente.', data: result });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El signo no existe.' });
        }
    },

    async GetZodiaco(req, res) {
        try {
            var result = await mySql.query(`
            SELECT * FROM tbl_zodiaco`)
        } catch (err) { throw new Error(err) }

        if (result.length > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'Signos encontrados exitosamente.', data: result });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El usuario no existe.' });
        }
    },

    async GetVideos(req, res) {
        try {
            var result = await mySql.query(`
            SELECT * FROM tbl_videos`)
        } catch (err) { throw new Error(err) }

        if (result.length > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'Videos encontrados exitosamente.', data: result });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El video no existe.' });
        }
    },

    async GetPaquetes(req, res) {
        try {
            var result = await mySql.query(`
            SELECT citas_josie, min_psiquica, min_gratis 
            FROM tbl_usuarios where id_usuario='${req.body._id}'`)
        } catch (err) { throw new Error(err) }

        if (result.length > 0) {
            const data = result[0];

            return res.status(HttpStatus.OK)
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
    },

    async GetCitas(req, res) {
        const result = await userModel.GetCitas(req.body._id);

        if (result.length > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'Usted cuenta con citas para usar.', data: result[0] });
        } else {
            return res.status(HttpStatus.OK)
                .json({ message: 'Ocurrio un error, no tiene citas disponibles.', data: [] });
        }
    },

    async CitasConf(req, res) {
        const result = await userModel.CitasConfig();
        if (result['horarios'].length > 0) {
            return res.status(HttpStatus.OK)
                .json({
                    message: 'Configuracion encontrada correctamente.',
                    horarios: result['horarios'],
                    citas: result['citas']
                });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, no se pudo configurar el calendario.' });
        }
    },

    async SetCita(req, res) {
        const result = await userModel.GuardarCita(req.body._id, req.body.hour, req.body.date);
        if (result.affectedRows > 0) {
            await userModel.UpdateCita(req.body._id, req.body.citas);
            return res.status(HttpStatus.OK)
                .json({ message: 'Cita reservada exitosamente.' });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, no se pudo guardar la cita. Intentelo nuevamente' });
        }
    },

    async GetCitasById(req, res) {
        const result = await userModel.GetCitasById(req.body._id);
        if (result.length > 0) {
            return res.status(HttpStatus.OK).json({
                message: 'Citas encontradas correctamente.',
                citas: result
            });
        } else {
            return res.status(HttpStatus.OK).json({
                message: 'No tiene citas pendientes.',
                citas: []
            });
        }
    },

    async CloseRoomJosie(req, res) {
        const token = req.body.token;
        let data = token.split('.')[1];
        let buff = new Buffer(data, 'base64');
        let cita = JSON.parse(buff.toString('ascii'));

        const result = await userModel.CloseRoomJosie(cita);

        if (result.affectedRows > 0) {
            return res.status(HttpStatus.OK).json({
                message: 'Cita cerrada exitosamente.'
            });
        } else {
            return res.status(HttpStatus.CONFLIT).json({
                message: 'No se pudo cerrar la cita, error en el servidor.'
            });
        }

    }
}