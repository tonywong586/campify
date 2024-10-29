import { publicProcedure, router } from "~/server/trpc";
import { z } from "zod";

export const helloRouter = router({
  test: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
});
