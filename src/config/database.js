const { Sequelize } = require('sequelize');
const config = require('../../config/config.json');
const logger = require('./winstonLoggerConfig');

const environment = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect } = config[environment];

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    logging: false, // Set to console.log if you want to see SQL queries
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Function to run migrations automatically
const runMigrations = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        logger.info('Database connected successfully!!!');

        // TEMPORARILY DISABLED: Automatic schema updates to prevent errors
        // TODO: Fix model/table mismatches before re-enabling
        logger.warn('⚠️  Automatic schema updates temporarily disabled due to table structure conflicts');
        logger.warn('⚠️  Please run: npm run db:migrate to apply proper migrations');

        // Just sync without altering for now
        await sequelize.sync({ force: false });
        logger.info('Database connection established - schema not modified');

    } catch (error) {
        logger.error('Database connection/migration error: ', error);
        throw error;
    }
};

// Initialize database and run migrations
runMigrations();

module.exports = sequelize;