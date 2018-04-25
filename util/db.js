/**
 * Created by luoming on 2018/4/25
 */
const mysql = require('mysql')

const pool = mysql.createPool({
    host     :  '127.0.0.1',
    user     :  'luoming',
    password :  'TYlm920606',
    database :  'test'
})

let query = ( sql, values )=> {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports = {
    query
}