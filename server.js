const app = require('./src/app')
const { PORT } = require('./src/config/constant')
const logger = require('./src/config/winstonLoggerConfig')
const sequelize = require('./src/config/database')

// Function to start server after database is ready
const startServer = async () => {
    try {
        // Wait for database connection and migrations to complete
        await sequelize.authenticate();
        
        app.listen(PORT, () => {
            logger.info(`Server is listening at ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();