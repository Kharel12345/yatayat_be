const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const cors = require('cors')
const logger = require('./config/winstonLoggerConfig')
const errorHandler = require('./utils/errorHandler');
const { authRoutes } = require('./routes')

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // if you're sending cookies or auth headers
};

app.use(cors(corsOptions));
app.use(helmet())
app.use(cookieParser());
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