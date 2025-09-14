# Database Schema Documentation

This document describes the PostgreSQL database structure for the AI chatbot application built with Next.js 15, Drizzle ORM, and Vercel AI SDK.

## Technology Stack
- **Database**: PostgreSQL (Vercel Postgres)
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Schema Location**: `lib/db/schema.ts`
- **Migration Commands**: See `CLAUDE.md` for database operations

## Core Tables

### 1. User Authentication

#### `User` Table
- **Primary Key**: `id` (UUID, auto-generated)
- **Columns**:
  - `id`: UUID - Primary key, automatically generated
  - `email`: VARCHAR(64) - User email address (required, unique)
  - `password`: VARCHAR(64) - Hashed password (nullable for OAuth users)

### 2. Chat Management

#### `Chat` Table
- **Primary Key**: `id` (UUID, auto-generated)
- **Columns**:
  - `id`: UUID - Primary key, automatically generated
  - `createdAt`: TIMESTAMP - When chat was created (required)
  - `title`: TEXT - Chat title/subject (required)
  - `userId`: UUID - Foreign key to User table (required)
  - `visibility`: VARCHAR - Enum: 'public' or 'private' (default: 'private')
  - `lastContext`: JSONB - Stores LanguageModelV2Usage data for context tracking (nullable)
- **Foreign Keys**:
  - `userId` → `User.id`

### 3. Messages (Current Schema)

#### `Message_v2` Table
- **Primary Key**: `id` (UUID, auto-generated)
- **Columns**:
  - `id`: UUID - Primary key, automatically generated
  - `chatId`: UUID - Foreign key to Chat table (required)
  - `role`: VARCHAR - Message role (user, assistant, system, etc.)
  - `parts`: JSON - Message content parts (array of message components)
  - `attachments`: JSON - File attachments and media (array)
  - `createdAt`: TIMESTAMP - When message was created (required)
- **Foreign Keys**:
  - `chatId` → `Chat.id`

### 4. Voting System (Current Schema)

#### `Vote_v2` Table
- **Composite Primary Key**: (`chatId`, `messageId`)
- **Columns**:
  - `chatId`: UUID - Foreign key to Chat table (required)
  - `messageId`: UUID - Foreign key to Message_v2 table (required)
  - `isUpvoted`: BOOLEAN - True for upvote, false for downvote (required)
- **Foreign Keys**:
  - `chatId` → `Chat.id`
  - `messageId` → `Message_v2.id`

### 5. Document Management

#### `Document` Table
- **Composite Primary Key**: (`id`, `createdAt`)
- **Columns**:
  - `id`: UUID - Document identifier, auto-generated
  - `createdAt`: TIMESTAMP - When document was created (required)
  - `title`: TEXT - Document title (required)
  - `content`: TEXT - Document content (nullable)
  - `kind`: VARCHAR - Document type enum: 'text', 'code', 'image', 'sheet' (default: 'text')
  - `userId`: UUID - Foreign key to User table (required)
- **Foreign Keys**:
  - `userId` → `User.id`

### 6. AI Suggestions

#### `Suggestion` Table
- **Primary Key**: `id` (UUID, auto-generated)
- **Columns**:
  - `id`: UUID - Primary key, automatically generated
  - `documentId`: UUID - Reference to document (required)
  - `documentCreatedAt`: TIMESTAMP - Document creation timestamp (required)
  - `originalText`: TEXT - Original text being suggested for change (required)
  - `suggestedText`: TEXT - AI-suggested replacement text (required)
  - `description`: TEXT - Description of the suggestion (nullable)
  - `isResolved`: BOOLEAN - Whether suggestion has been resolved (default: false)
  - `userId`: UUID - Foreign key to User table (required)
  - `createdAt`: TIMESTAMP - When suggestion was created (required)
- **Foreign Keys**:
  - `userId` → `User.id`
  - `(documentId, documentCreatedAt)` → `Document.(id, createdAt)` (composite)

### 7. Streaming Management

#### `Stream` Table
- **Primary Key**: `id` (UUID, auto-generated)
- **Columns**:
  - `id`: UUID - Primary key, automatically generated
  - `chatId`: UUID - Foreign key to Chat table (required)
  - `createdAt`: TIMESTAMP - When stream was created (required)
- **Foreign Keys**:
  - `chatId` → `Chat.id`

## Deprecated Tables (Legacy Schema)

These tables are marked as deprecated and will be removed in future versions:

### `Message` Table (DEPRECATED)
- **Migration Note**: Being replaced by `Message_v2` - see migration guide at chat-sdk.dev
- Similar structure to `Message_v2` but with different `content` field structure

### `Vote` Table (DEPRECATED)
- **Migration Note**: Being replaced by `Vote_v2`
- References deprecated `Message` table instead of `Message_v2`

## Key Relationships

1. **User → Chat**: One-to-many (users can have multiple chats)
2. **Chat → Message**: One-to-many (chats contain multiple messages)
3. **Chat → Vote**: One-to-many (chats can have multiple votes)
4. **Message → Vote**: One-to-many (messages can be voted on)
5. **User → Document**: One-to-many (users can create multiple documents)
6. **Document → Suggestion**: One-to-many (documents can have multiple AI suggestions)
7. **User → Suggestion**: One-to-many (users can receive multiple suggestions)
8. **Chat → Stream**: One-to-many (chats can have multiple streams)

## Database Operations

### Migration Commands (from CLAUDE.md)
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:push` - Push schema changes
- `pnpm db:pull` - Pull schema from database
- `pnpm db:check` - Check migration status

### Environment Variables
- `POSTGRES_URL` - Database connection URL
- See `.env.example` for complete environment setup

## AI Integration Notes

1. **Message Structure**: Messages use a `parts` array format compatible with Vercel AI SDK v5
2. **Context Tracking**: `Chat.lastContext` stores AI usage metrics for billing/monitoring
3. **Streaming**: `Stream` table manages real-time message streaming
4. **Suggestions**: AI-powered text suggestions are tracked and can be resolved
5. **Document Types**: Support for multiple document types (text, code, image, sheet)

## Query Patterns

Common query patterns for this schema:

1. **Get user's chats**: Join `Chat` with `User` on `userId`
2. **Get chat messages**: Join `Message_v2` with `Chat` on `chatId`, order by `createdAt`
3. **Get message votes**: Join `Vote_v2` with `Message_v2` and `Chat`
4. **Get user documents**: Filter `Document` by `userId`
5. **Get pending suggestions**: Filter `Suggestion` by `isResolved = false`

## TypeScript Types

All tables have corresponding TypeScript types generated by Drizzle:
- `User`, `Chat`, `DBMessage`, `Vote`, `Document`, `Suggestion`, `Stream`
- Deprecated types: `MessageDeprecated`, `VoteDeprecated`