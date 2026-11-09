# Project conventions
- Keep checkout program amounts and Stripe price IDs in the function-local programs module so pricing can be tested without starting the payment handler.
- Verify the full-price Stripe amount against the configured program amount before creating checkout so stale sale prices cannot be charged.
- Keep outreach and agenda master templates admin-only; student agendas contain their own copied tasks, so members never need master-template access.
- Restrict player-gallery writes by the player ID folder and its editable owner, with an admin bypass, to prevent cross-member changes.
- Serve private free-resource files only when attached to active resources, and testimonial photos only when attached to public approved/published stories; always qualify outer storage object columns in policy subqueries.
- Allow public intake only with safe initial workflow flags; resource download logs are written through the existing download RPC, not direct client inserts.