# System Architecture

## Status

- Version: 0.2 alpha
- Architecture status: Active development
- Primary application: `apps/web`
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Auth.js

## System Overview

```text
Browser
   ↓
Next.js App Router
   ↓
Server Components and Client Components
   ↓
Auth.js session validation
   ↓
Server actions and route handlers
   ↓
Prisma ORM
   ↓
PostgreSQL
```

The planned AI chat flow is:

```text
Authenticated user
   ↓
Conversation page
   ↓
Chat route handler
   ↓
Authorization and usage validation
   ↓
Conversation history retrieval
   ↓
Character personality prompt
   ↓
AI provider
   ↓
Streaming response
   ↓
Message persistence
```

## Monorepo Architecture

Project Aphrodite uses pnpm workspaces and Turborepo.

```text
ProjectAphrodite/
├── apps/
│   └── web/
├── packages/
│   ├── ai/
│   ├── auth/
│   ├── config/
│   ├── database/
│   └── ui/
├── prisma/
├── docker/
├── docs/
└── .github/
```

## Web Application

The Next.js application is located in `apps/web`.

It is responsible for:

- Marketing pages
- Authentication pages
- Protected workspace layout
- Dashboard
- Explore experience
- Character profiles
- Favorites
- Conversations
- Settings
- Creator Studio
- Subscription billing
- Auth.js route handling

## Routing

Public routes currently include:

```text
/
/login
/signup
/api/auth/[...nextauth]
```

Protected routes currently include:

```text
/dashboard
/explore
/favorites
/characters/[slug]
/chat/[conversationId]
/creator
/billing
/settings
```

Protected routes require a valid authenticated user.

## Authentication Architecture

Authentication uses Auth.js with a credentials provider and Prisma-backed users.

```text
Signup form
   ↓
Server-side Zod validation
   ↓
Password hashing
   ↓
User record creation
   ↓
Login form
   ↓
Credentials validation
   ↓
Auth.js session
   ↓
Protected route access
```

Password hashes must never be included in sessions or returned to clients.

## Database Architecture

Prisma provides typed access to PostgreSQL.

The database currently supports:

- Users
- Auth accounts
- Sessions
- Verification tokens
- Characters
- Conversations
- Messages
- Favorites
- Memories
- Subscriptions

The Prisma schema is located at `prisma/schema.prisma`.

Migrations are located at `prisma/migrations`.

Seed data is located at `prisma/seed.ts`.

## Authorization

Authentication confirms who the user is.

Authorization confirms what the user may access.

Important authorization rules:

- A user may only read their own conversations.
- A user may only modify their own favorites.
- A user may not access another user's conversation by changing a URL.
- Admin-only functionality must verify the user role on the server.
- Client-side route hiding is never sufficient authorization.

## Rendering Strategy

### Server Components

Used for:

- Authenticated page loading
- Database queries
- Protected layouts
- Initial dashboard data
- Character detail data
- Conversation history

### Client Components

Used for:

- Interactive navigation
- Current-route highlighting
- Forms
- Favorite buttons
- Menus
- Streaming chat controls

## Current Limitations

The current application does not yet include:

- Production logging
- Automated end-to-end tests
- Long-term memory extraction
- Creator publishing workflows

## Planned Architecture Evolution

```text
Chat composer
   ↓
POST /api/chat
   ↓
Authenticated conversation ownership check
   ↓
Usage-limit validation
   ↓
Character prompt construction
   ↓
AI provider abstraction
   ↓
Streaming response
   ↓
Message persistence
```

Future AI package structure may include:

```text
packages/ai/
├── providers/
├── prompts/
├── streaming/
├── moderation/
└── usage/
```

## Architectural Principles

- Prefer server-side authorization.
- Keep database access typed through Prisma.
- Keep secrets exclusively on the server.
- Avoid unnecessary client-side data fetching.
- Keep shared packages focused and small.
- Preserve deployability after every milestone.
- Introduce abstraction only when there is a real use case.
- Avoid premature distributed-system complexity.
