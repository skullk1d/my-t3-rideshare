import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const idListSchema = z.optional(z.array(z.number()));

export default createTRPCRouter({
  get: publicProcedure.input(idListSchema).query(async ({ input, ctx }) => {
    // Get one or many depending on input
    let res;

    if (input?.length) {
      // One or Many
      if (input.length === 1) {
        res = ctx.db.user.findFirst({
          where: {
            id: input[0],
          },
        });
      } else {
        res = ctx.db.user.findMany({
          where: {
            id: { in: input },
          },
          orderBy: { id: 'asc' },
        });
      }
    } else {
      // All
      res = ctx.db.user.findMany();
    }

    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    // NOTE: Intentionally not "include"-ing ride relational data to reduce overhead
    return res;
  }),
  // TODO:
  /*
  create,
  update,
  delete
  */
});
