# ADR 0001: Work One Brick at a Time

- Status: Accepted
- Date: 2026-07-17

## Context

Project Aphrodite has an ambitious product vision spanning character identity, creation, conversation, memory, relationships, media, and a creator ecosystem. Large cross-cutting changes are difficult to validate, review, reverse, and learn from.

## Decision

We will organize engineering work as small, complete, reviewable bricks.

Each brick should:

- Serve one clear outcome.
- Preserve a working repository.
- Include validation proportional to its risk.
- Update documentation when reality changes.
- Be represented by a focused branch, intentional commit, and reviewable pull request when practical.

The first planning question is: **What's the next brick?**

The final product test is: **Does this make the relationship better?**

## Consequences

- Progress remains visible and reversible.
- Reviews are easier to understand and perform well.
- Integration risk is reduced.
- Some broad initiatives require more planning and a sequence of smaller pull requests.
- A brick must still be useful and complete; “small” is not an excuse for unfinished work.
