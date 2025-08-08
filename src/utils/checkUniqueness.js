const con = require('../config/database')

const isUniqueforSave = async (tablename, fieldname, value) => {
    const query = `SELECT COUNT(*) AS count FROM ${tablename} WHERE ${fieldname}=${value}`
    const result = await con.query(query)
    return result[0][0].count
}

const isUniqueforUpdate = async (tablename, fieldname, value, primary_key, primary_key_id) => {
    const query = `SELECT COUNT(*) AS count FROM ${tablename} WHERE ${fieldname}=${value} and ${primary_key}!=${primary_key_id}`
    const result = await con.query(query)
    return result[0][0].count
}

module.exports = {
    isUniqueforSave,
    isUniqueforUpdate
}