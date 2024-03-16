import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { idListSchema } from "./users";
import { bidSchema, bidUpdateSchema } from "./bids";

export const collectionSchema = z.object({
  name: z.string(),
  description: z.string(),
  quantity_stocks: z.number(),
  price: z.number(),
  user_id: z.number(),
  Bids: z.array(bidUpdateSchema),
});
export const collectionUpdateSchema = collectionSchema
  .omit({ user_id: true, Bids: true })
  .merge(
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
        res = ctx.db.collections.findFirst({
          where: {
            id: input[0],
          },
          include: {
            Bids: true,
          },
        });
      } else {
        res = ctx.db.collections.findMany({
          orderBy: { id: "asc" },
          where: {
            id: { in: input },
          },
          include: {
            Bids: true,
          },
        });
      }
    } else {
      // All
      res = ctx.db.collections.findMany({
        orderBy: { id: "asc" },
        include: {
          Bids: true,
        },
      });
    }

    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return res;
  }),
  getBids: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    // Get all bids of a specified collection
    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return ctx.db.collections.findFirst({
      where: {
        id: input,
      },
      select: {
        Bids: true,
      },
      orderBy: { id: "desc" },
    });
  }),
  create: publicProcedure
    .input(collectionSchema)
    .mutation(async ({ input, ctx }) => {
      /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

      return ctx.db.collections.create({
        data: {
          ...collectionSchema.parse(input),
          Bids: {
            create: z.array(bidSchema).parse(input.Bids),
          },
        },
      });
    }),
  update: publicProcedure
    .input(collectionUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

      return ctx.db.collections.update({
        where: {
          id: input.id,
        },
        data: collectionUpdateSchema.parse(input),
      });
    }),
  delete: publicProcedure
    .input(idListSchema)
    .mutation(async ({ input, ctx }) => {
      let res;

      if (input) {
        // One or Many
        if (input.length === 1) {
          res = ctx.db.collections.delete({
            where: {
              id: input[0],
            },
          });
        } else if (input.length) {
          res = ctx.db.collections.deleteMany({
            where: {
              id: { in: input },
            },
          });
        }
      } else {
        // All
        res = ctx.db.collections.deleteMany();
      }

      /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

      return res;
    }),
});
