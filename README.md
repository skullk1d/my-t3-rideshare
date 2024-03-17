# Auction Demo

## Database / Server / Client

Add `.env` to local project root:
https://www.dropbox.com/scl/fi/63grpwobu3mrnzt2j0q79/env.zip?rlkey=wqyk5s4o5b0gorfmbjyw62yu8&dl=0

```
npm install

./start-database.sh

npm run db:push

./fill-database.sh

npm run dev
```

### NOTES

How would you monitor the application to ensure it is running smoothly?

- Exception / performance monitor such as Sentry.

How would you address scalability and performance?

- Setting up FPS KPIs to collect analytics from user clients.
- Native performance tools in Chrome testing resource usage while simulating multiple instances/procedures/windows.
- Unit tests and load tests that simulate high-volume inputs and datasets.

Trade-offs you had to choose when doing this challenge (the things you would do different with more time and resources)

- Unit tests for expected results from queries & mutations.
- Consult with backend engineers to adhere to proper BE development conventions and design patterns for databases.
- Uuids for non-sequential entities such as collections & bids (re-using sequential ids provided for quicker bootstrapping).
- Gatekeeping requests for users based on real authentication tokens.
- Polished FE based on Figma/Zeppelin designs.
- Precision handling in schema and FE (drop assumption of USD floating precision)
- Dedicated custom component primitives with deep validation (e.g. `MyNumberInput`, `MyCurrencyString`, etc).
- Setting limits on bid prices relative to collection prices, and general domain / range management based on assets & currencies.
- Mocking/handling exhaustive error cases in the UI.
- Graceful loading and failure states (spinners, disabled buttons, etc).
- Checking for ownership with authentication result rather than simple user id check.
- Drier classnames / styling.
- `env` variables for testing with artificial latency, etc.
- Sellers cannot bid on their own collections (currently "enforced" with component-level ad-hoc list filtering)
- More sophisticated mechanisms for sorting by price, auto-collapsing/expanding, etc, in the UI.
- Legitimate auth layer instead of `ActiveUserContext`.

### DNF:

- Accepting & rejecting bids.
