# Database Setup and Automatic Migrations

## Overview
This project now uses Sequelize ORM with automatic migrations that run when the application starts.

## How It Works
1. **Automatic Migrations**: When you run the project (`npm run dev` or `npm start`), the database automatically:
   - Connects to the database
   - Runs all pending migrations
   - Updates the database schema based on your models

2. **Environment-Based Behavior**:
   - **Development**: Uses `alter: true` to automatically update schema
   - **Production**: Uses `force: false` to prevent data loss
   - **Test**: Uses `force: true` to reset schema

## Configuration
- Database configuration is in `config/config.json`
- Models are in `models/` directory
- Migrations are in `migrations/` directory

## Available Commands
```bash
# Start development server (with auto-migrations)
npm run dev

# Start production server (with auto-migrations)
npm start

# Manual migration commands (if needed)
npm run db:migrate        # Run pending migrations
npm run db:migrate:undo   # Undo last migration
npm run db:seed           # Run seeders
npm run db:reset          # Reset database (drop, create, migrate, seed)
```

## Important Notes
- **No manual migration needed**: Just start the server and migrations run automatically
- **Model changes**: Update your Sequelize models and restart the server
- **Data safety**: Production environment prevents accidental data loss
- **Logging**: Check console logs for migration status

## Troubleshooting
If you encounter issues:
1. Check database connection settings in `config/config.json`
2. Ensure MySQL server is running
3. Verify database exists
4. Check console logs for error messages 