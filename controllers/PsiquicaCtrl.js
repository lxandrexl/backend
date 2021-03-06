const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const psiquicaModel = require('../models/psiquicaModel');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secretKeys');
const moment = require('moment');
const fs = require('fs');

module.exports = {
    async GetPsiquicas(req, res) {
        const result = await psiquicaModel.GetPsiquicas();

        if (result.length > 0) {
            return res.status(HttpStatus.CREATED).json({
                message: 'Listado Psiquicas encontrados correctamente.',
                result
            });
        } else {
            return res.status(HttpStatus.CONFLICT).json({
                message: 'No existen psiquicas en este momento.'
            });
        }
    },

    async GetComentarios(req, res) {
        const comentarios = await psiquicaModel.GetComentarios(req.body._id);

        if (comentarios.length > 0) {
            return res.status(HttpStatus.OK).json({ message: 'Comentarios encontrados.', data: comentarios });
        } else {
            return res.status(HttpStatus.OK).json({ message: 'No ahi comentarios', data: [] });
        }
    },

    async CloseSession(req, res) {
        const result = await psiquicaModel.CloseSession(req.body.id_psiquica);

        if (result.affectedRows > 0) {
            return res.status(HttpStatus.OK).json({ message: 'Sesión terminada.' });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'No se pudo cerrar la sesión, intente de nuevo por favor.'
            });
        }
    },

    async UpdateStatus(req, res) {
        const result = await psiquicaModel.UpdateStatus(req.body.id_psiquica);

        if (result.affectedRows > 0) {
            const data = await psiquicaModel.GetPsiquica(req.body.id_psiquica);
            const psiquica = data[0];

            return res.status(HttpStatus.OK).json({
                message: 'Llamada cancelada correctamente.',
                psiquica: psiquica
            });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'No se pudo actualizar su estado, cierre sesión y vuelva a ingresar.'
            });
        }
    },

    async MakeRoomJosie(req, res) {
        const Cliente = req.body.cliente;
        const Psiquica = req.body.psiquica;
        const Cita = req.body.cita;
        if (!Cliente && !Psiquica) {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, vuelva a iniciar sesión.' });
        }

        const token = jwt.sign(Cita, dbConfig.josieToken, {
            expiresIn: '1h'
        });

        const result = await psiquicaModel.MakeRoom(
            Cliente.id_usuario,
            Psiquica.id_psiquica,
            token
        );

        if (result.insertId) {
            return res.status(HttpStatus.OK).json({
                message: 'Chat creado correctamente.',
                chatId: result.insertId,
                chatToken: token
            });
        } else {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Ocurrio un error, al crear el chat privado.' });
        }

    },

    async MakeRoom(req, res) {
        const Cliente = req.body.cliente;
        const Psiquica = req.body.psiquica;
        const chatToken = new Date();

        if (!Cliente && !Psiquica) {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, vuelva a iniciar sesión.' });
        }

        return bcrypt.hash(chatToken.toString(), 10, async(err, hash) => {
            if (err) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ message: 'Error encriptando el chat privado.' });
            }

            const result = await psiquicaModel.MakeRoom(
                Cliente.id_usuario,
                Psiquica.id_psiquica,
                hash
            );

            if (result.insertId) {
                return res.status(HttpStatus.OK).json({
                    message: 'Chat creado correctamente.',
                    chatId: result.insertId,
                    chatToken: hash
                });
            } else {
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Ocurrio un error, al crear el chat privado.' });
            }
        });
    },

    async SendMessage(req, res) {
        const room = await psiquicaModel.GetRoomBytoken(req.body.room);

        if (room.length > 0) {
            const result = await psiquicaModel.SaveConversation(
                room[0].id_chat,
                req.body.sender,
                req.body.message
            );

            if (result.affectedRows > 0) {
                return res
                    .status(HttpStatus.OK)
                    .json({ message: 'Enviado con exito.' });
            } else {
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Ocurrio un error al enviar su mensaje.' });
            }
        } else {
            return res
                .status(HttpStatus.CONFLICT)
                .json({ message: 'El chat privado no existe.' });
        }
    },

    async GetMessages(req, res) {
        const result = await psiquicaModel.GetRoomBytoken(req.body.room);

        if (result.length > 0) {
            const timeRoom = result[0].tiempo;
            const chatContent = await psiquicaModel.GetConversationByRoom(
                result[0].id_chat
            );

            if (chatContent.length > 0) {
                return res.status(HttpStatus.OK).json({
                    message: 'Historial de chats encontrados.',
                    data: chatContent,
                    timeRoom: timeRoom
                });
            } else {
                return res.status(HttpStatus.OK).json({
                    message: 'El chat privado no contiene mensajes',
                    data: [],
                    timeRoom: timeRoom
                });
            }
        } else {
            return res
                .status(HttpStatus.CONFLICT)
                .json({ message: 'El chat privado no existe.' });
        }
    },

    async CloseRoom(req, res) {
        const result = await psiquicaModel.CloseRoom(
            req.body.room,
            req.body.evaluacion,
            req.body.comentario
        );

        if (result.affectedRows > 0) {
            await psiquicaModel.UpdateStatus(req.body.psiquica.id_psiquica);
            return res.status(HttpStatus.OK).json({ message: 'Chat terminado' });
        } else {
            return res
                .status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, intentelo nuevamente' });
        }
    },

    async GetJosieData(req, res) {
        const result = await psiquicaModel.GetJosieData();
        if (result.length > 0) {
            return res.status(HttpStatus.OK)
                .json({ message: 'Datos encontrados correctamente', data: result[0] });
        } else {
            return res
                .status(HttpStatus.CONFLICT)
                .json({ message: 'Ocurrio un error, intentelo nuevamente' });
        }
    },

    async GenerateAudio(req, res) {
        const filename = `${req.body.usuario}x${req.body.psiquica}x${moment().format('DDMMYYYYhmmss')}`;
        const buffer = new Buffer(req.body.audio, 'base64');
        fs.writeFile(`files/audios/${filename}.ogg`, buffer, async(err) => {
            if (err) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'No se pudo crear el audio.', data: err })
            } else {
                const rs = await psiquicaModel.VerifyRoom(req.body.room);
                if (rs.length > 0) {
                    const result = await psiquicaModel.SaveMessage(rs[0].id_chat, 'p', `${filename}.ogg`);
                    if (result.affectedRows > 0) {
                        return res.status(HttpStatus.OK).json({ message: 'Audio enviado con exito.' });
                    } else {
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json({ message: 'Ocurrio un error al enviar su mensaje.' });
                    }
                } else {
                    return res.status(HttpStatus.CONFLICT)
                        .json({ message: 'El chat privado no existe.' });
                }
            }
        });
    }
};