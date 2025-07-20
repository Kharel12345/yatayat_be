const mysql = require('mysql2')
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = require('./constant')
const logger=require('./winstonLoggerConfig')

const con = mysql.createPool({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

con.getConnection((err, connection) => {
    if (err) {
      logger.error('Error connecting to database: ', err)
    } else {
      logger.info('Database connected successfully!!!')
      connection.release()
    }
  })  

module.exports = con.promise()