import bids from '~/server/api/routers/bids';
import collections from '~/server/api/routers/collections';
import users from '~/server/api/routers/users';
import { createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
// NOTE: Artificial latency of 1000ms
export const appRouter = createTRPCRouter({
  users,
  collections,
  bids,
});

// export type definition of API
export type AppRouter = typeof appRouter;
