# Database Structure Fix Guide

## 🚨 Current Issue

Your application is crashing with the error:
```
Incorrect table definition; there can be only one auto column and it must be defined as a key
```

This happens because there's a **mismatch between your models and the existing database structure**.

## 🔍 Root Cause

**The Problem:**
- Your **User model** expects a column called `user_id` as primary key
- But your **migration** created a table with `id` as primary key
- When Sequelize tries to sync, it finds conflicts in auto-increment columns

## 🛠️ How to Fix

### Step 1: Check Current Database Structure
```bash
npm run db:check-structure
```

This will show you exactly what columns exist in your database vs. what your models expect.

### Step 2: Choose Your Fix Strategy

#### Option A: Fix Models to Match Database (Recommended)
Update your models to match the existing database structure:

```javascript
// In models/user.model.js - Change this:
user_id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
}

// To this:
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
}
```

#### Option B: Fix Database to Match Models
If you prefer to keep your current model structure:

1. **Backup your database first:**
   ```bash
   npm run db:backup
   ```

2. **Undo the problematic migration:**
   ```bash
   npm run db:migrate:undo
   ```

3. **Fix the migration file** to match your model expectations

4. **Re-run migrations:**
   ```bash
   npm run db:migrate
   ```

### Step 3: Re-enable Automatic Migrations

After fixing the structure mismatch, update `src/config/database.js`:

```javascript
// Replace the temporary disabled code with:
if (environment === 'development') {
    await sequelize.sync({ alter: true });
    logger.info('Database schema updated successfully (development mode)');
} else if (environment === 'production') {
    await sequelize.sync({ force: false });
    logger.info('Database schema synchronized (production mode)');
}
```

## 📋 Files That Need Updates

1. **`models/user.model.js`** - Fix primary key column name
2. **`models/userbranch.model.js`** - Update foreign key references if needed
3. **Any other models** that reference `user_id` instead of `id`

## 🔧 Quick Fix Commands

```bash
# 1. Check current structure
npm run db:check-structure

# 2. Backup database
npm run db:backup

# 3. Fix your models (edit the files)

# 4. Test the fix
npm run dev

# 5. If successful, re-enable auto-migrations
# (edit src/config/database.js)
```

## ⚠️ Important Notes

- **Always backup before making changes**
- **Test in development first**
- **The current fix disables automatic migrations temporarily**
- **You must manually fix the structure before re-enabling**

## 🎯 Expected Result

After fixing:
- ✅ Application starts without errors
- ✅ Database structure matches your models
- ✅ Automatic migrations work again
- ✅ No more "auto column" errors

## 🆘 Still Having Issues?

If the problem persists:
1. Check the database structure output from `npm run db:check-structure`
2. Compare it with your model definitions
3. Ensure all foreign key references are correct
4. Consider dropping and recreating the database (development only) 