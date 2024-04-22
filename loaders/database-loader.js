const mysql = require("mysql");

async function loadMySQLConnection(data){

    let pool = mysql.createPool({
        connectionLimit: data.connectionLimit || 20 ,
        host: data.host,
        user: data.user,
        password: data.passw,
        port: data.port || 3306
    });
    
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                return reject(err);
            }
            resolve(connection);
        });
    });
}


module.exports = {loadMySQLConnection: loadMySQLConnection};