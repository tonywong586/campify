import { adminProcedure, protectedProcedure, router } from "~/server/trpc";
import { OrderModel } from "~/server/models";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const OrderRouter = router({
  create: adminProcedure
    .input(
      z.object({
        totalPrice: z.number(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const order = new OrderModel(input);
      await order.save();
      return order;
    }),

  listAll: adminProcedure
    .input(
      z.object({
        //filter by status
        status: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const orders = await OrderModel.find(
        input.status ? { status: input.status } : {}
      )
        .sort({ createdAt: -1 })
        .populate({
          path: "items",
          populate: {
            path: "product",
            model: "Product",
          },
        });

      return orders;
    }),

  list: protectedProcedure
    .input(
      z.object({
        //filter by status
        status: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const orders = await OrderModel.find({
        user: ctx.session.user.id,
        ...(input.status ? { status: input.status } : {}),
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "items",
          populate: {
            path: "product",
            model: "Product",
          },
        });

      return orders;
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const order = await OrderModel.findById(input.id);
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      return order;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        updates: z.object({
          totalPrice: z.number().optional(),
          status: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const order = await OrderModel.findByIdAndUpdate(
        input.id,
        input.updates,
        {
          new: true,
        }
      );
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      return order;
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const order = await OrderModel.findByIdAndUpdate(
        input.id,
        { status: input.status },
        {
          new: true,
        }
      );

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      return order;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const order = await OrderModel.findByIdAndDelete(input.id);
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      return order;
    }),
});
