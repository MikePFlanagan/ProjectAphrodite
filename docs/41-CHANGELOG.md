# Changelog

All notable changes to Project Aphrodite are documented here.

The project currently follows an alpha-stage release process.

## Unreleased

### Added

- Stripe Checkout, customer billing portal, verified subscription webhooks, and synchronized paid access
- Live streaming character chat with persistent user and assistant messages
- Plan-aware daily chat limits enforced server-side
- Per-conversation token usage and configurable cost telemetry
- Recoverable composer states for provider and quota failures

## v0.2.0-alpha

### Added

- Premium protected workspace layout
- Redesigned desktop sidebar
- Active navigation indicators
- Start-new-conversation action
- Dashboard welcome panel
- Recent conversation cards
- Subscription status panel
- Creator Studio placeholder route
- Billing placeholder route
- Documentation foundation

### Changed

- Improved dashboard hierarchy
- Improved spacing and typography
- Improved navigation styling
- Increased workspace maximum width
- Added sticky protected header
- Refined fuchsia and violet visual language

### Verified

- Web TypeScript check
- Web ESLint check
- Next.js production build
- Protected route generation
- Billing route generation

## v0.1.0-alpha

### Added

- pnpm workspace
- Turborepo configuration
- Next.js 16 application
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL database
- Prisma ORM
- Prisma migrations
- Database seed script
- Auth.js credentials authentication
- Login page
- Signup page
- Protected dashboard
- Explore page
- Favorites page
- Character detail pages
- Conversation creation
- Persistent messages
- Docker Compose configuration
- GitHub Actions workflow
- Original seeded characters

### Fixed

- Landing-page navigation anchors
- Login and signup route navigation
- Root environment-variable loading
- Missing `NEXTAUTH_URL`
- PostgreSQL port conflict
- PostgreSQL volume version incompatibility
- Local Docker database configuration

### Security

- Added password hashing
- Added server-side authentication
- Added protected route enforcement
- Added conversation ownership validation
- Kept `.env` and `.env.local` outside Git
