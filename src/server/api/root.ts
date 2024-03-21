import drivers from '~/server/api/routers/drivers';
import rides from '~/server/api/routers/rides';
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
  rides,
  drivers,
});

// export type definition of API
export type AppRouter = typeof appRouter;
