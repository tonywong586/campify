import { router } from "~/server/trpc";
import { helloRouter } from "./hello.router";
import { productRouter } from "./product.router";
import { userRouter } from "./user.router";
import { cartRouter } from "./cart.router";
import { ReviewRouter } from "./review.router";
import { OrderRouter } from "./order.router";

export const appRouter = router({
  hello: helloRouter,
  product: productRouter,
  user: userRouter,
  cart: cartRouter,
  review: ReviewRouter,
  order: OrderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
