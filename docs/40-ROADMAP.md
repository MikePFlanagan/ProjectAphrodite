# Product Roadmap

## Roadmap Principles

The roadmap prioritizes:

1. A complete user journey
2. Revenue capability
3. Retention
4. Product differentiation
5. Scale

Features should not be added only because competitors have them.

## Version 0.1 Alpha — Foundation

Status: Complete

### Delivered

- pnpm monorepo
- Turborepo
- Next.js application
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Docker Compose
- Auth.js
- Login and signup pages
- Protected routes
- Seeded characters
- Landing page
- GitHub repository
- Initial CI workflow

## Version 0.2 Alpha — Premium Workspace

Status: Complete

### Delivered

- Premium protected workspace layout
- Redesigned desktop sidebar
- Active navigation states
- Dashboard welcome experience
- Featured companions
- Recently added companions
- Continue-chatting cards
- Subscription status panel
- Creator Studio placeholder
- Billing placeholder
- Production build validation

## Version 0.3 Alpha — Live AI Chat

Status: Complete

### Goals

- Enable the message composer
- Add authenticated chat endpoint
- Validate conversation ownership
- Stream AI responses
- Persist user messages
- Persist assistant messages
- Construct character-specific prompts
- Display loading and error states
- Add basic usage limits
- Add provider error handling

### Completion Criteria

- A logged-in user can send a message.
- The selected character responds in real time.
- Both messages persist after page refresh.
- Another user cannot access the conversation.
- Provider failures produce a recoverable interface state.
- AI cost per conversation can be measured.

## Version 0.4 Alpha — Monetization

Status: Implementation Complete — Stripe Test Configuration Required

### Goals

- Stripe products and prices
- Free and Premium plans
- Stripe Checkout
- Billing portal
- Webhook verification
- Subscription synchronization
- Usage quotas
- Upgrade prompts
- Paid feature authorization

### Completion Criteria

- A user can subscribe.
- Subscription status is updated by verified webhooks.
- Paid access survives logout and login.
- Canceled subscriptions follow the intended access policy.
- Usage limits are enforced server-side.

## Version 0.5 Alpha — Retention

Status: Next

### Goals

- Long-term memory
- Conversation summaries
- Improved recent-chat navigation
- Search
- Personalized recommendations
- Relationship or engagement progression
- Notification strategy

## Version 0.6 Alpha — Creator Studio

Status: Planned

### Goals

- Character creation
- Personality configuration
- Greeting editor
- Character preview
- Draft and publish workflow
- Creator profile
- Basic analytics

## Version 0.7 Alpha — Media

Status: Planned

### Goals

- Character image generation
- User galleries
- Voice output
- Optional voice input
- Media moderation
- Storage integration

## Version 0.8 Beta — Marketplace

Status: Planned

### Goals

- Public creator listings
- Character discovery improvements
- Ratings or engagement signals
- Creator analytics
- Revenue-sharing research
- Moderation and reporting

## Version 0.9 Beta — Production Hardening

Status: Planned

### Goals

- End-to-end tests
- Rate limiting
- Structured logging
- Error monitoring
- Security review
- Accessibility review
- Performance optimization
- Backup and recovery procedures
- Production deployment documentation

## Version 1.0 — Public Launch

Status: Future

### Launch Requirements

- Reliable authentication
- Stable streaming chat
- Working paid subscriptions
- Clear privacy and terms pages
- Production database
- Error monitoring
- Usage analytics
- Moderation workflow
- Customer support channel
- Conversion tracking
