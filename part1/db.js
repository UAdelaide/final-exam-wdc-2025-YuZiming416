const mysql = require('mysql12/promise');

const pool = mysql.creatPool({
    host: 'localhost',
    user: 'root',
    password: 'mypassword',
    database: 'DogWalkService',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
