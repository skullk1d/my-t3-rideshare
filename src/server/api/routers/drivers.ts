import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { idListSchema } from './users';

export const driverSchema = z.object({
  price: z.number(),
  distance: z.number(),
  status: z.enum(['Pending', 'Accepted', 'Rejected']),
  car_model: z.string(),
  user_id: z.number(),
  ride_id: z.number(),
});
export const driverUpdateSchema = driverSchema.merge(
  z.object({
    id: z.number(),
  }),
);

export default createTRPCRouter({
  get: publicProcedure.input(idListSchema).query(async ({ input, ctx }) => {
    // Get one or many depending on input
    let res;

    if (input?.length) {
      // One or Many
      if (input.length === 1) {
        res = ctx.db.driver.findFirst({
          where: {
            id: input[0],
          },
        });
      } else {
        res = ctx.db.driver.findMany({
          orderBy: { price: 'desc' },
          where: {
            id: { in: input },
          },
        });
      }
    } else {
      // All
      res = ctx.db.driver.findMany({
        orderBy: { price: 'desc' },
      });
    }

    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return res;
  }),
  create: publicProcedure.input(driverSchema).mutation(async ({ input, ctx }) => {
    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return ctx.db.driver.create({
      data: driverSchema.parse(input),
    });
  }),
  update: publicProcedure.input(driverUpdateSchema).mutation(async ({ input, ctx }) => {
    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return ctx.db.driver.update({
      where: {
        id: input.id,
      },
      data: driverSchema.parse(input),
    });
  }),
  delete: publicProcedure.input(idListSchema).mutation(async ({ input, ctx }) => {
    let res;

    if (input) {
      // One or Many
      if (input.length === 1) {
        res = ctx.db.driver.delete({
          where: {
            id: input[0],
          },
        });
      } else if (input.length) {
        res = ctx.db.driver.deleteMany({
          where: {
            id: { in: input },
          },
        });
      }
    } else {
      // All
      res = ctx.db.driver.deleteMany();
    }

    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return res;
  }),
  accept: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    // find parent ride
    const driver = await ctx.db.driver.findFirst({
      where: {
        id: input,
      },
    });
    const ride = await ctx.db.ride.findFirst({
      where: {
        id: driver?.ride_id,
      },
      select: {
        Driver: true,
      },
    });

    // reject siblings
    await ctx.db.driver.updateMany({
      where: {
        id: { in: (ride?.Driver ?? []).map((b) => b.id), not: input },
      },
      data: {
        status: 'Rejected',
      },
    });

    // accept this driver
    return ctx.db.driver.update({
      where: {
        id: input,
      },
      data: {
        status: 'Accepted',
      },
    });
  }),
  reject: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    // reject this driver
    return ctx.db.driver.update({
      where: {
        id: input,
      },
      data: {
        status: 'Rejected',
      },
    });
  }),
});
