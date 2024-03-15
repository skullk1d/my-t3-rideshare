import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const idListSchema = z.optional(z.array(z.number()));

export default createTRPCRouter({
  get: publicProcedure.input(idListSchema).query(async ({ input, ctx }) => {
    // Get one or many depending on input
    let res;

    if (input && input.length) {
      // One or Many
      if (input.length === 1) {
        res = ctx.db.users.findFirst({
          orderBy: { id: "asc" },
        });
      } else {
        res = ctx.db.users.findMany({
          where: {
            id: { in: input },
          },
        });
      }
    } else {
      // All
      res = ctx.db.users.findMany();
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return res;
  }),
  // TODO:
  /*
  create,
  update,
  delete
  */
});
