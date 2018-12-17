const mySql = require('../config/connectionDb');

module.exports = {
    async createUser(body, hash) {
        try {
            var result = await mySql.query(`INSERT INTO tbl_usuarios 
            (nombre, apellido_paterno, apellido_materno, sexo, telefono,
                email, password, fecha_nacimiento, direccion, pais) 
            VALUES(
            '${body.nombres}', '${body.apPaterno}', '${body.apMaterno}', '${body.sexo}',
            '${body.telefono}', '${body.email}', '${hash}', '${body.fechaNac}',
            '${body.direccion}', '${body.pais}')
            `)
        } catch (err) { throw new Error(err) }

        return result;
    },

    async UpdateTokenUser(idUser, token) {
        try {
            var result = await mySql.query(`UPDATE tbl_usuarios SET token = '${token}' 
            WHERE id_usuario = ${idUser}`)
        } catch (err) { throw new Error(err) }

        return result;
    },

    async getUser(idUser) {
        try {
            var result = await mySql.query(`SELECT * FROM tbl_usuarios 
            where id_usuario=${idUser}`)
        } catch (err) { throw new Error(err) }

        return result;
    },

    async verifyUser(email) {
        try {
            var result = await mySql.query(`SELECT * FROM tbl_usuarios 
            where email='${email}'`)
        } catch (err) { throw new Error(err) }

        return result;
    },

    async verifyPsiquica(username) {
        try {
            var result = await mySql.query(`SELECT * FROM tbl_psiquicas 
            where usuario='${username.toUpperCase()}' and deleted=0`)
        } catch (err) { throw new Error(err) }

        return result;
    },

    async updateStatus(username) {
        try {
            var result = await mySql.query(`UPDATE tbl_psiquicas set estado = 1 
            where usuario = '${username}'`);
        } catch (err) { throw new Error(err) }

        return result;
    }
}