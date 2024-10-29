import { adminProcedure, publicProcedure, router } from "~/server/trpc";
import { UserModel } from "~/server/models";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        username: z.string().min(3),
        email: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      //check if user already exist
      const userExist = await UserModel.findOne({
        $or: [{ username: input.username }, { email: input.email }],
      });

      if (userExist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exist",
        });
      }

      const user = new UserModel(input);
      await user.save();
      return user;
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = UserModel.findOne({
        username: input.username,
        password: input.password,
      });

      if (user) {
        return user;
      }

      return null;
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        updates: z.object({
          email: z.string().optional(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          username: z.string().min(3).optional(),
          password: z.string().min(8).optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const user = await UserModel.findByIdAndUpdate(input.id, input.updates, {
        new: true,
      });
      if (!user) throw new Error("User not found");
      return user;
    }),
  delete: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await UserModel.findByIdAndDelete(input.id);
      if (!user) throw new Error("User not found");
      return user;
    }),

  getAllUser: adminProcedure.query(async () => {
    const users = await UserModel.find({});

    return users;
  }),
});
