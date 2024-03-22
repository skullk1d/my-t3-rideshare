# Rideshare Demo

This is a conceptual application that aggregates ride requests & offers across many major rideshare applications. Users may request a ride from any vendor (as long as they are an account holder) while they may also offer rides as a driver to other users at the same time. There are no limits to a user's role as a passenger and as a driver.

Theoretically, if authentication was implemented with real rideshare OAuth providers, requests and offers could be forwarded across multiple services to get the best deal as both a passenger and a driver.

## Database / Server / Client

Make sure [Docker](https://docs.docker.com/engine/install/) is installed.

Create `.env` to local project root and add this line into the file:

`DATABASE_URL="postgresql://postgres:password@localhost:5432/my-t3-rideshare"`

While following the steps below, when prompted by the `start-database` script to generate a new password, accept if you wish.
Or, write your own into the above URL before initializing the database for the first time.

```
npm install

./start-database.sh

npm run db:push

./fill-database.sh

npm run dev
```
