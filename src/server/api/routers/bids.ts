import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const idListSchema = z.array(z.number());

export default createTRPCRouter({
  get: publicProcedure.input(idListSchema).query(async ({ input, ctx }) => {
    // Get one or many depending on input
    let res;

    if (input) {
      // One or Many
      if (input.length === 1) {
        res = ctx.db.bids.findFirst({
          orderBy: { id: "asc" },
        });
      } else if (input.length) {
        res = ctx.db.bids.findMany({
          where: {
            id: { in: input },
          },
        });
      }
    } else {
      // All
      res = ctx.db.bids.findMany();
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
