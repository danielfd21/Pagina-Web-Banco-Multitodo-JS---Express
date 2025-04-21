

const mysql = require('mysql');

function Conectar(){


const conexion = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'banco_multitodo'



});

conexion.connect();


return conexion;


}

module.exports = Conectar;



