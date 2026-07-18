# Project Aphrodite Documentation

Welcome to the internal product and engineering documentation for Project Aphrodite.

Project Aphrodite is an original AI companion SaaS platform built with Next.js, TypeScript, PostgreSQL, Prisma, Auth.js, and Turborepo.

These documents describe the current product, engineering architecture, technical decisions, development standards, and roadmap.

## Documentation Index

### Product

- [Vision](./00-VISION.md)

### Engineering

- [Architecture](./01-ARCHITECTURE.md)
- [Technology Stack](./02-TECH-STACK.md)
- [Project Structure](./03-PROJECT-STRUCTURE.md)

### Operations

- [Stripe Test Setup](./42-STRIPE-TESTING.md)

### Planning

- [Roadmap](./40-ROADMAP.md)
- [Changelog](./41-CHANGELOG.md)

## Documentation Principles

Documentation should:

- Describe the current implementation accurately.
- Clearly separate completed work from planned work.
- Be updated in the same pull request as major architectural changes.
- Avoid documenting planned features as though they already exist.
- Help a new developer understand the project without relying on verbal context.

## Current Project Status

The application currently includes:

- Marketing landing page
- Login and signup
- Credentials-based authentication
- Protected application routes
- Premium dashboard workspace
- Character discovery
- Character profiles
- Favorites
- Conversation creation
- Persistent messages
- Live streaming AI chat and usage metering
- Creator identity and appearance tooling
- Stripe Checkout, billing portal, and synchronized subscription authorization
- PostgreSQL database
- Prisma migrations and seed data
- Docker-based local database
- GitHub Actions foundation

The next major milestone is retention through long-term memory and conversation summaries.
