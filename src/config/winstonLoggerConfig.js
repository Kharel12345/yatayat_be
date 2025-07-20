const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const { getCurrentDateTime } = require('../helpers/date');
const { NODE_ENV } = require('./constant');
const DailyRotateFile = require('winston-daily-rotate-file')


const myFormat = printf(({ level, message, timestamp }) => {
    return `${getCurrentDateTime()} [${level}] : ${message}`;
});

let logger;

if (NODE_ENV === 'production') {
    const dailyRotateFileTransport = new DailyRotateFile({
        filename: './logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
    });

    logger = createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            myFormat,
        ),
        transports: [
            dailyRotateFileTransport
        ],
        exceptionHandlers: [
            dailyRotateFileTransport
        ]
    });
} else {
    logger = createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            format.colorize(),
            myFormat,
        ),
        transports: [
            new transports.Console({
                format: combine(
                    timestamp(),
                    format.colorize(),
                    myFormat,
                ),
                level: 'info'
            }),
        ],
        exceptionHandlers: [
            new transports.Console({
                format: combine(
                    timestamp(),
                    format.colorize(),
                    myFormat,
                )
            })
        ]
    });
}


module.exports = logger