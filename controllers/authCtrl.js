const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dbConfig = require('../config/secretKeys');
const authModel = require('../models/authModel');

module.exports = {
    async crearCliente(req, res) {
        const schema = Joi.object().keys({
            nombres: Joi.string()
                .min(5)
                .max(30)
                .required(),
            apPaterno: Joi.string()
                .required(),
            apMaterno: Joi.string()
                .required(),
            sexo: Joi.string()
                .required(),
            fechaNac: Joi.string()
                .required(),
            telefono: Joi.string()
                .required(),
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .min(5)
                .required(),
            direccion: Joi.string()
                .required(),
            pais: Joi.string()
                .required()
        });

        const { error, value } = Joi.validate(req.body, schema);

        if (error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details })
        }

        let result = await authModel.verifyUser(value.email);

        if (result.length > 0) {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Este email ya existe, intente con otro.' });
        }

        return bcrypt.hash(value.password, 10, async(err, hash) => {
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST)
                    .json({ message: 'Error encriptando la contraseña, intente de nuevo.' });
            }

            let result = await authModel.createUser(value, hash);

            if (result.insertId) {
                let Usuario = await authModel.getUser(result.insertId);
                Usuario = Usuario[0];

                const token = jwt.sign({ data: Usuario }, dbConfig.josieToken, {
                    expiresIn: '5h'
                });

                await authModel.UpdateTokenUser(result.insertId, token)
                res.cookie('auth', token);

                res.status(HttpStatus.CREATED)
                    .json({ message: 'Cuenta creada exitosamente.', Usuario, token });

            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Ocurrio un error, intentelo de nuevo.' });
            }

        });

    },

    // CLIENTE LOGIN

    async LoginUser(req, res) {
        if (!req.body.email || !req.body.password) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error, complete todo los campos por favor.' });
        }

        let result = await authModel.verifyUser(req.body.email);

        if (result.length <= 0) {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El usuario no existe.' });
        }

        const Usuario = result[0];
        Usuario.token = '';

        return bcrypt.compare(req.body.password, Usuario.password).then(result => {
            if (!result) {
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Contraseña incorrecta, intentelo de nuevo.' });
            }
            const token = jwt.sign({ data: Usuario }, dbConfig.josieToken, {
                expiresIn: '5h'
            });
            res.cookie('auth', token);
            return res
                .status(HttpStatus.OK)
                .json({ message: 'Verificación exitosa.', Usuario, token });
        });
    },

    // PSIQUICA LOGIN

    async LoginPsiquica(req, res) {
        if (!req.body.username || !req.body.password) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error, complete todo los campos por favor.' });
        }

        let result = await authModel.verifyPsiquica(req.body.username);

        if (result.length <= 0) {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'El usuario no existe.' });
        }

        const Psiquica = result[0];

        await authModel.updateStatus(Psiquica.usuario);

        if (req.body.password === Psiquica.password) {
            const token = jwt.sign({ data: Psiquica }, dbConfig.josieToken, {
                expiresIn: '5h'
            });
            res.cookie('auth', token);
            return res.status(HttpStatus.OK)
                .json({ message: 'Verificación exitosa.', Psiquica, token });
        } else {
            return res.status(HttpStatus.CONFLICT)
                .json({ message: 'Contraseña incorrecta, intentelo de nuevo.' });
        }


    }
}