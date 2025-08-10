# Production Deployment Guide

## ⚠️ IMPORTANT: Model Changes in Production

When you deploy a new release with model changes, the database schema will NOT automatically update in production. This is a safety feature to prevent data loss.

## What Happens in Production

1. **Application Starts**: Your app will start successfully
2. **Schema Check**: Sequelize verifies the current database schema matches your models
3. **Warning Logs**: You'll see warnings if there are schema mismatches
4. **Potential Issues**: If new code expects new columns, you may get runtime errors

## Safe Deployment Process

### Option 1: Manual Migration (Recommended for Production)

```bash
# 1. Before deploying new code, run migrations on production database
npm run db:migrate

# 2. Deploy your new code
# 3. Restart the application
```

### Option 2: Automated Migration (Use with Caution)

If you want automatic migrations in production, you can temporarily change the database config:

```javascript
// In src/config/database.js, change production to:
} else if (environment === 'production') {
    // WARNING: This can cause data loss!
    await sequelize.sync({ alter: true });
    logger.info('Database schema updated automatically (production mode)');
}
```

**⚠️ RISK**: This can cause data loss or corruption if not handled carefully.

## Best Practices for Production

### 1. Always Test Migrations
```bash
# Test migrations on a staging database first
NODE_ENV=staging npm run db:migrate
```

### 2. Backup Before Migrating
```bash
# Create database backup before running migrations
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3. Use Migration Files
Instead of relying on `sequelize.sync()`, create proper migration files:

```bash
# Generate a new migration
npx sequelize-cli migration:generate --name add-new-column

# Run specific migrations
npm run db:migrate
```

### 4. Monitor Application Logs
Watch for these warning messages:
- `⚠️ WARNING: Model changes detected but database schema not updated automatically`
- `⚠️ Run migrations manually or use npm run db:migrate before deploying`

## Emergency Rollback

If something goes wrong:

```bash
# Undo last migration
npm run db:migrate:undo

# Or restore from backup
mysql -u username -p database_name < backup_file.sql
```

## Recommended Production Workflow

1. **Development**: Use `alter: true` for rapid development
2. **Staging**: Test migrations manually before production
3. **Production**: Run migrations manually before deploying code
4. **Monitoring**: Watch logs for schema mismatch warnings

## Environment Variables

Ensure your production environment has:
```bash
NODE_ENV=production
# Database credentials in config/config.json
```

## Summary

- **Development**: Automatic schema updates ✅
- **Production**: Manual migrations required ⚠️
- **Safety**: Production database is protected from automatic changes
- **Flexibility**: You control when and how schema changes happen 