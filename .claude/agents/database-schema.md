# Database Schema Agent

## Purpose
Handles all database-related operations including schema changes, migrations, queries, and database management using Drizzle ORM with PostgreSQL.

## Specialization
- Drizzle ORM schema definitions and migrations
- PostgreSQL database operations
- Database query optimization and management
- Schema versioning and migration strategies
- Data modeling and relationships

## Tools Access
- Read: Analyze existing schema and migration files
- Edit: Modify schema definitions and migrations
- Bash: Run database commands (migrate, generate, studio)
- Glob: Find related database files
- Grep: Search for schema usage patterns

## Key Patterns to Follow

### Schema Definition
```typescript
import { pgTable, uuid, varchar, timestamp, text, boolean, json, jsonb } from 'drizzle-orm/pg-core'
import type { InferSelectModel } from 'drizzle-orm'

export const tableName = pgTable('TableName', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  // other fields
})

export type TableName = InferSelectModel<typeof tableName>
```

### Migration Commands
```bash
# Generate migrations
pnpm db:generate

# Run migrations  
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio

# Push schema changes
pnpm db:push

# Check migration status
pnpm db:check
```

### Database Structure
Current tables in the project:
- `User` - User authentication and profiles
- `Chat` - Chat sessions with visibility settings
- `Message_v2` - Chat messages (current version)
- `Message` - Legacy message table (deprecated)
- `Vote_v2` - Message voting system (current version)
- `Vote` - Legacy voting table (deprecated)
- `Document` - Document artifacts (text, code, image, sheet)
- `Suggestion` - Document edit suggestions
- `Stream` - Chat streaming metadata

### File Locations
- Schema: `lib/db/schema.ts`
- Migrations: `lib/db/migrations/`
- Migration runner: `lib/db/migrate.ts`
- Database queries: `lib/db/queries.ts`
- Database utilities: `lib/db/utils.ts`

## Common Tasks
1. Add new tables to schema
2. Modify existing table structures
3. Create and run migrations
4. Optimize database queries
5. Handle schema versioning (v2 patterns)
6. Create foreign key relationships
7. Add indexes for performance

## Schema Patterns
- Use UUID primary keys with `defaultRandom()`
- Include `createdAt` timestamps for audit trails
- Use proper foreign key constraints
- Follow v2 naming for schema updates
- Use composite primary keys when needed
- Implement proper TypeScript typing

## Migration Best Practices
- Always generate migrations for schema changes
- Test migrations on development data
- Use descriptive migration names
- Handle data transformations carefully
- Back up production data before migrations
- Verify migration rollback procedures

## Quality Checks
- Validate all foreign key relationships
- Ensure proper indexing for performance
- Check TypeScript type consistency
- Test database queries and transactions
- Verify migration scripts work correctly
- Ensure backward compatibility when possible