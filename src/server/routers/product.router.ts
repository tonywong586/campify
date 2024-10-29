import { adminProcedure, publicProcedure, router } from "~/server/trpc";
import { ProductModel } from "~/server/models";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.string(),
  images: z.array(z.string()),
  quantity: z.number(),
  rental: z.boolean(),
  rentPrice: z.number().optional(),
  rentDuration: z.number().optional(),
});

export const productRouter = router({
  create: adminProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      const product = new ProductModel(input);
      await product.save();
      return product;
    }),

  list: publicProcedure
    .input(z.object({ column: z.string(), sort: z.number(), category: z.string().optional() }))
    .query(async ({ input }) => {
      const { column, sort } = input;
      const sortOption = {};
      // @ts-ignore
      sortOption[column] = sort;
      const products = (await ProductModel.find({}).sort(sortOption)).filter((product) => {
        // product.populate({
        //   path: "reviews",
        //   select: "rating",
        // });
        // if (product.reviews.length > 0) {
        //   console.log(newReview.rating);
        //   const total = newReview.reduce((acc, review) => acc + review.rating, 0);
        //   product.rating = total / product.reviews.length;
        // }
        if (input.category !== "") {
          if (product.category === input.category) {
            return product;
          }
        } else {
          return product;
        }
      });
      //sort the products
      // const products = await ProductModel.find({}).sort({ createdAt: -1 });

      return products;
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const product = await ProductModel.findById(input.id);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return product;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        updates: createProductSchema.optional(),
      })
    )
    .mutation(async ({ input }) => {
      const product = await ProductModel.findByIdAndUpdate(
        input.id,
        input.updates,
        {
          new: true,
        }
      );
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return product;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const product = await ProductModel.findByIdAndDelete(input.id);

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return product;
    }),
  sorting: publicProcedure
    .input(z.object({ column: z.string(), sort: z.number() }))
    .mutation(async ({ input }) => {
      const { column, sort } = input;
      const sortOption = {};
      // @ts-ignore
      sortOption[column] = sort;
      const products = await ProductModel.find({}).sort(sortOption);
      return products;
    }),
});
