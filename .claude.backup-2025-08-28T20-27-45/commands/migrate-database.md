# Migrate Database

Create and run database migration for: $ARGUMENTS

## Overview

Manages database schema changes using Drizzle ORM migrations for PostgreSQL 17.

## Prerequisites

- PostgreSQL running (via Supabase or locally)
- DATABASE_URL configured in .env.local
- Drizzle schema defined in lib/db/schema.ts

## Workflow Steps

### PHASE 1: Analyze Requirements

Based on $ARGUMENTS, determine:
1. What tables need to be created/modified
2. What columns need to be added/removed
3. What indexes are required
4. What constraints should be enforced
5. Foreign key relationships

### PHASE 2: Update Schema

1. **Modify Drizzle Schema**
   ```typescript
   // lib/db/schema.ts
   import { pgTable, text, timestamp, integer, boolean, index } from 'drizzle-orm/pg-core'
   
   // Example: Add new table for ESG metrics
   export const esgMetrics = pgTable('esg_metrics', {
     id: text('id').primaryKey(), // Text ID for consistency
     organizationId: text('organization_id').notNull()
       .references(() => organizations.id, { onDelete: 'cascade' }),
     metric: text('metric').notNull(),
     value: integer('value').notNull(),
     unit: text('unit').notNull(),
     period: text('period').notNull(),
     verified: boolean('verified').default(false),
     createdAt: timestamp('created_at').defaultNow(),
     updatedAt: timestamp('updated_at').defaultNow(),
   }, (table) => ({
     orgIdx: index('esg_metrics_org_idx').on(table.organizationId),
     periodIdx: index('esg_metrics_period_idx').on(table.period),
   }))
   ```

2. **Schema Best Practices**
   - Use `text` for IDs (Clerk compatibility)
   - Add timestamps to all tables
   - Create indexes for foreign keys
   - Use cascade delete where appropriate
   - Add check constraints for data validation

### PHASE 3: Generate Migration

1. **Generate SQL Migration**
   ```bash
   pnpm drizzle:generate
   ```
   This creates a new migration file in `drizzle/migrations/`

2. **Review Generated SQL**
   ```sql
   -- Example: drizzle/migrations/0001_add_esg_metrics.sql
   CREATE TABLE IF NOT EXISTS "esg_metrics" (
     "id" text PRIMARY KEY NOT NULL,
     "organization_id" text NOT NULL,
     "metric" text NOT NULL,
     "value" integer NOT NULL,
     "unit" text NOT NULL,
     "period" text NOT NULL,
     "verified" boolean DEFAULT false,
     "created_at" timestamp DEFAULT now(),
     "updated_at" timestamp DEFAULT now()
   );
   
   CREATE INDEX IF NOT EXISTS "esg_metrics_org_idx" ON "esg_metrics" ("organization_id");
   CREATE INDEX IF NOT EXISTS "esg_metrics_period_idx" ON "esg_metrics" ("period");
   
   ALTER TABLE "esg_metrics" 
   ADD CONSTRAINT "esg_metrics_organization_id_fkey" 
   FOREIGN KEY ("organization_id") 
   REFERENCES "organizations"("id") 
   ON DELETE CASCADE;
   ```

3. **Customize Migration (if needed)**
   - Add data migrations
   - Add check constraints
   - Add triggers
   - Add custom indexes

### PHASE 4: Test Migration

1. **Dry Run**
   ```bash
   # Check what will be changed
   pnpm drizzle:check
   ```

2. **Apply to Development Database**
   ```bash
   # Push schema changes to development database
   pnpm drizzle:push
   ```

3. **Verify Changes**
   ```bash
   # Open Drizzle Studio to inspect
   pnpm drizzle:studio
   ```

### PHASE 5: Execute Migration

1. **Apply Migration**
   ```bash
   # Run migration on target database
   pnpm drizzle:migrate
   ```

2. **Generate TypeScript Types**
   ```bash
   # Update TypeScript types from new schema
   pnpm drizzle:pull
   ```

### PHASE 6: Rollback Plan

1. **Create Rollback Migration**
   ```sql
   -- drizzle/migrations/rollback_0001.sql
   DROP TABLE IF EXISTS "esg_metrics";
   ```

2. **Test Rollback**
   ```bash
   # Apply rollback in test environment first
   psql $DATABASE_URL -f drizzle/migrations/rollback_0001.sql
   ```

## Migration Types

### Add New Table
```typescript
export const newTable = pgTable('new_table', {
  id: text('id').primaryKey(),
  // columns...
})
```

### Add Column
```typescript
export const existingTable = pgTable('existing_table', {
  // existing columns...
  newColumn: text('new_column').default('default_value'),
})
```

### Add Index
```typescript
export const tableWithIndex = pgTable('table_name', {
  // columns...
}, (table) => ({
  searchIdx: index('search_idx').on(table.searchColumn),
}))
```

### Add Foreign Key
```typescript
export const childTable = pgTable('child_table', {
  parentId: text('parent_id').references(() => parentTable.id),
})
```

## Data Migration Examples

### Migrate Existing Data
```sql
-- In migration file
-- Migrate UUID to text IDs
UPDATE profiles 
SET id = 'user_' || id 
WHERE id NOT LIKE 'user_%';
```

### Backfill New Columns
```sql
-- Set default values for existing rows
UPDATE organizations 
SET slug = LOWER(REPLACE(name, ' ', '-'))
WHERE slug IS NULL;
```

## Safety Checklist

Before applying migrations:
- [ ] Backup production database
- [ ] Test migration on staging
- [ ] Review SQL for destructive changes
- [ ] Check for data loss potential
- [ ] Verify rollback procedure
- [ ] Update application code
- [ ] Plan maintenance window

## Common Patterns

### Soft Delete
```typescript
export const softDeleteTable = pgTable('table', {
  deletedAt: timestamp('deleted_at'),
  // Use in queries: .where(isNull(table.deletedAt))
})
```

### Audit Fields
```typescript
export const auditedTable = pgTable('table', {
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### JSON Columns
```typescript
import { jsonb } from 'drizzle-orm/pg-core'

export const flexibleTable = pgTable('table', {
  metadata: jsonb('metadata').default({}),
})
```

## Troubleshooting

**Issue**: Migration fails with constraint violation
```bash
# Check existing data
psql $DATABASE_URL -c "SELECT * FROM table WHERE condition"
# Fix data before migration
```

**Issue**: Migration is too slow
```bash
# Add CONCURRENTLY for index creation
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_name" ON "table"("column");
```

**Issue**: Cannot drop column with dependencies
```bash
# Find dependencies
psql $DATABASE_URL -c "\d+ table_name"
# Drop dependencies first
```

## Verification

After migration:
1. Check all tables exist: `\dt` in psql
2. Verify indexes: `\di` in psql
3. Check constraints: `\d+ table_name`
4. Test application functionality
5. Monitor performance

## Quick Commands

```bash
# Most common migration commands
pnpm drizzle:generate  # Create migration from schema
pnpm drizzle:push     # Apply schema to database
pnpm drizzle:migrate  # Run migrations
pnpm drizzle:studio   # Visual database browser
pnpm drizzle:pull     # Import existing schema
```