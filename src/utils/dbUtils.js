const con = require('../config/database')

const getCurrentValue = async (tablename, primary_key, row_id) => {
    const query = `SELECT * FROM ${tablename} WHERE ${primary_key}=${row_id}`
    const result = await con.query(query)
    return result[0][0]
}

const checkIfExists = async (tablename, column_name, column_value) => {
    const query = `SELECT COUNT(*) AS count FROM ${tablename} WHERE ${column_name}=${column_value}`
    const result = await con.query(query)
    return result[0][0].count
}


module.exports = {
    getCurrentValue,
    checkIfExists
}