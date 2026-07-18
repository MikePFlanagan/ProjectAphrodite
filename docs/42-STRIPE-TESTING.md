# Stripe Test Setup

Project Aphrodite uses Stripe-hosted Checkout, the Stripe customer portal, and verified webhook
events. A Checkout redirect never grants access by itself; the application authorizes Premium only
after synchronized Stripe subscription state is stored in PostgreSQL.

## Test-mode configuration

1. In a Stripe sandbox, create a product named `Aphrodite Premium`.
2. Add a recurring monthly USD Price for `$19.00`.
3. Put the sandbox secret key and recurring Price ID in the root `.env`:

   ```dotenv
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PREMIUM_PRICE_ID="price_..."
   ```

4. Install and authenticate the Stripe CLI, then forward only the lifecycle events the application
   consumes:

   ```sh
   stripe listen \
     --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted \
     --forward-to http://127.0.0.1:3002/api/billing/webhook
   ```

5. Copy the `whsec_...` signing secret printed by the listener into the root `.env` as
   `STRIPE_WEBHOOK_SECRET`, then restart the web application with that environment loaded.

   ```sh
   set -a
   source .env
   set +a
   pnpm --filter @aphrodite/web dev:3002
   ```

## Subscription acceptance pass

Use Stripe sandbox keys and test payment data only.

1. Sign up or log in, open `/billing`, and choose **Upgrade with Stripe**.
2. Complete Checkout with card `4242 4242 4242 4242`, any future expiration, any three-digit CVC,
   and any postal code.
3. Confirm the listener reports HTTP 200 for `checkout.session.completed` and subscription events.
4. Confirm `/billing` displays `PREMIUM` and 500 messages per day.
5. Log out and back in; confirm Premium remains active.
6. Open **Manage subscription**, schedule cancellation, and confirm access remains Premium through
   the displayed paid period.
7. End the subscription in the Stripe sandbox and confirm the next webhook changes the application
   back to Free and the chat endpoint enforces the Free quota.

The intended access policy is fail-closed: `active` and `trialing` are eligible for Premium;
`incomplete`, `past_due`, `unpaid`, `paused`, or `canceled` fall back to Free. A subscription set to
cancel at period end remains `active` until that paid period ends.
