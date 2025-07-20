const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./config/winstonLoggerConfig')
const errorHandler = require('./utils/errorHandler')
const { NODE_ENV } = require('./config/constant')
const { authRoutes } = require('./routes')

app.use(cors())
app.use(helmet())
app.use(express.json())

require('./config/database')

//routes here
app.use('/api/auth', authRoutes)

app.use(errorHandler)

app.use((req, res, next) => {
    logger.info(req.url)
    res.status(404).json({ "message": "Page not found !!!" })
})


module.exports = app