const mySql = require('../config/connectionDb');
const moment = require('moment');
const fs = require("fs");

module.exports = {
    async GetUserProfile(_id) {
        try {
            var result = await mySql.query(`
            SELECT * FROM tbl_usuarios where id_usuario = ${_id}`)
        } catch (err) { throw new Error(err) }
        return result;
    },

    async UpdatePhotoProfile(_id, file, extension) {
        const imgName = `${ moment().format('YYYYMMDDHHmmss')}.${extension}`;
        const base64Data = file.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(`./files/profile_img/${imgName}`,
            base64Data,
            'base64',
            err => console.log(err)
        );
        try {
            var result = await mySql.query(`update tbl_usuarios set foto = '${imgName}'
             where id_usuario = ${_id}`)
        } catch (err) { throw new Error(err) }
        return result;
    },
    async UpdateProfile(_id, name, app, apm) {
        try {
            var result = await mySql.query(`update tbl_usuarios set nombre = '${name}',
            apellido_paterno = '${app}', apellido_materno ='${apm}',
            fecha_actualizacion = '${moment().format('YYYY-MM-DD HH:mm:ss')}' 
            where id_usuario = ${_id}`)
        } catch (err) { throw new Error(err) }
        return result;
    },

    async GetCitas(_id) {
        try {
            var result = await mySql.query(`select citas_josie from tbl_usuarios where id_usuario = ${_id}`)
        } catch (err) { throw new Error(err) }
        return result;
    },

    async CitasConfig() {
        const result = [];
        try {
            result['horarios'] = await mySql.query('select * from tbl_horarios_cita');
            result['citas'] = await mySql.query('select * from tbl_citas where estado = 1 or estado = 2');
        } catch (err) { throw new Error(err) }
        return result;
    }
}