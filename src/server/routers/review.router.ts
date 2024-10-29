import { protectedProcedure, publicProcedure, router } from "~/server/trpc";
import { ReviewModel, UserModel, ProductModel } from "~/server/models";
import { z } from "zod";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

export const ReviewRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number(),
        comment: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ProductModel.findById(input.productId);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      const review = await ReviewModel.create({
        user: ctx.session.user.id,
        product: product._id,
        rating: input.rating,
        comment: input.comment,
      });
      return review;
    }),
  get: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      //get username using populate
      const review = await ReviewModel.find({ product: input.productId }).sort(
        "-createdAt"
      ).populate({
        path: "user",
        select: "username",
      });
      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }
      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        updates: z.object({
          rating: z.number().optional(),
          comment: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const review = await ReviewModel.findByIdAndUpdate(
        input.id,
        input.updates,
        {
          new: true,
        }
      );
      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }
      return review;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const review = await ReviewModel.findByIdAndDelete(input.id);
      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }
      return review;
    }),
});
