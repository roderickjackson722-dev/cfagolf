# Project conventions
- Keep checkout program amounts and Stripe price IDs in the function-local programs module so pricing can be tested without starting the payment handler.
- Verify the full-price Stripe amount against the configured program amount before creating checkout so stale sale prices cannot be charged.