import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { idListSchema } from "./users";

export const bidSchema = z.object({
  price: z.number(),
  status: z.enum(["Pending", "Accepted", "Rejected"]),
  user_id: z.number(),
  collection_id: z.number(),
});
export const bidUpdateSchema = bidSchema.merge(
  z.object({
    id: z.number(),
  }),
);

export default createTRPCRouter({
  get: publicProcedure.input(idListSchema).query(async ({ input, ctx }) => {
    // Get one or many depending on input
    let res;

    if (input && input.length) {
      // One or Many
      if (input.length === 1) {
        res = ctx.db.bids.findFirst({
          where: {
            id: input[0],
          },
        });
      } else {
        res = ctx.db.bids.findMany({
          orderBy: { id: "asc" },
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
  create: publicProcedure.input(bidSchema).mutation(async ({ input, ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return ctx.db.bids.create({
      data: bidSchema.parse(input),
    });
  }),
  update: publicProcedure
    .input(bidUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.bids.update({
        where: {
          id: input.id,
        },
        data: bidSchema.parse(input),
      });
    }),
  delete: publicProcedure
    .input(idListSchema)
    .mutation(async ({ input, ctx }) => {
      let res;

      if (input) {
        // One or Many
        if (input.length === 1) {
          res = ctx.db.bids.delete({
            where: {
              id: input[0],
            },
          });
        } else if (input.length) {
          res = ctx.db.bids.deleteMany({
            where: {
              id: { in: input },
            },
          });
        }
      } else {
        // All
        res = ctx.db.bids.deleteMany();
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return res;
    }),
});
