const util = require('util')
const mysql = require('mysql');
const secret = require('./secretKeys');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: secret.hostDb,
    user: secret.userDb,
    password: secret.passDb,
    database: secret.nameDb
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            console.error('Database connection was closed.')
        if (err.code === 'ER_CON_COUNT_ERROR')
            console.error('Database has too many connections.')
        if (err.code === 'ECONNREFUSED')
            console.error('Database connection was refused.')
        if (err.code === 'ER_BAD_DB_ERROR')
            console.log('Database not exists');
    }

    if (connection) connection.release();

    return
})

pool.query = util.promisify(pool.query);

module.exports = pool;