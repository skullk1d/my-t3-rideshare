import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { driverSchema, driverUpdateSchema } from './drivers';
import { idListSchema } from './users';

export const rideSchema = z.object({
  app_name: z.string(),
  address: z.string(),
  quantity_passengers: z.number(),
  requested_at: z.date(),
  user_id: z.number(),
  Driver: z.array(driverUpdateSchema),
});
export const rideUpdateSchema = rideSchema.omit({ user_id: true, Driver: true }).merge(
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
        res = ctx.db.ride.findFirst({
          where: {
            id: input[0],
          },
          include: {
            Driver: true,
          },
        });
      } else {
        res = ctx.db.ride.findMany({
          orderBy: { id: 'asc' },
          where: {
            id: { in: input },
          },
          include: {
            Driver: true,
          },
        });
      }
    } else {
      // All
      res = ctx.db.ride.findMany({
        orderBy: { id: 'asc' },
        include: {
          Driver: true,
        },
      });
    }

    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return res;
  }),
  getDriver: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    // Get all drivers of a specified ride
    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return ctx.db.ride.findFirst({
      where: {
        id: input,
      },
      select: {
        Driver: true,
      },
      orderBy: { id: 'desc' },
    });
  }),
  create: publicProcedure.input(rideSchema).mutation(async ({ input, ctx }) => {
    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return ctx.db.ride.create({
      data: {
        ...rideSchema.parse(input),
        Driver: {
          create: z.array(driverSchema).parse(input.Driver),
        },
      },
    });
  }),
  update: publicProcedure.input(rideUpdateSchema).mutation(async ({ input, ctx }) => {
    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return ctx.db.ride.update({
      where: {
        id: input.id,
      },
      data: rideUpdateSchema.parse(input),
    });
  }),
  delete: publicProcedure.input(idListSchema).mutation(async ({ input, ctx }) => {
    let res;

    if (input) {
      // One or Many
      if (input.length === 1) {
        res = ctx.db.ride.delete({
          where: {
            id: input[0],
          },
        });
      } else if (input.length) {
        res = ctx.db.ride.deleteMany({
          where: {
            id: { in: input },
          },
        });
      }
    } else {
      // All
      res = ctx.db.ride.deleteMany();
    }

    /* await new Promise((resolve) => setTimeout(resolve, 1000)); */

    return res;
  }),
});
