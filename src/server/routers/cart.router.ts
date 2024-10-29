import { protectedProcedure, router } from "~/server/trpc";
import {
  CartItemDoc,
  CartItemModel,
  OrderModel,
  ProductModel,
  OrderItemModel,
} from "~/server/models";
import { z } from "zod";
import { isEqual } from "lodash";
import format from "dayjs";
import stripe from "~/server/stripe";
import { TRPCError } from "@trpc/server";
import { areDatesEqualIgnoringTime } from "~/utils/misc";

// Helper function to calculate the total price of the cart items
function calculateTotalPrice(cartItems: CartItemDoc[]): number {
  return cartItems.reduce((total, item) => {
    const days =
      item.rentDuration && item.rentDuration.end && item.rentDuration.start
        ? format(item.rentDuration.end).diff(
            format(item.rentDuration.start),
            "day"
          ) + 1
        : 1;
    const price = item.rental
      ? item.product.price * item.quantity * days
      : item.product.price * item.quantity;
    return total + price;
  }, 0);
}

export const cartRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        rentDuration: z
          .object({
            start: z.date(),
            end: z.date(),
          })
          .optional(),
        quantity: z.number().optional().default(1),
        productId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      //get the product, do not select image
      const product = await ProductModel.findById(input.productId).select(
        "-images"
      );
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      //check if the product is already in the cart with the same rentDuration
      const cartItem = await CartItemModel.findOne({
        user: ctx.session.user.id,
        product: product._id,
      });

      // If the product is not a rental, and is already in the cart with the same rentDuration
      if (cartItem && !product.rental) {
        cartItem.quantity += input.quantity;
        await cartItem.save();
        return cartItem;
      }

      //if the product is already in the cart with the same rentDuration and the start and end dates are the same, update the quantity
      if (
        cartItem &&
        product.rental &&
        areDatesEqualIgnoringTime(
          cartItem.rentDuration?.start,
          input.rentDuration?.start
        ) &&
        areDatesEqualIgnoringTime(
          cartItem.rentDuration?.end,
          input.rentDuration?.end
        )
      ) {
        cartItem.quantity += input.quantity;
        await cartItem.save();
        return cartItem;
      }

      //if the product is not in the cart or has a different rentDuration, create a new cart item
      const newCartItem = await CartItemModel.create({
        user: ctx.session.user.id,
        product: product._id,
        quantity: input.quantity,
        rental: product.rental,
        rentDuration: input.rentDuration,
      });

      return newCartItem;
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const cartItems = await CartItemModel.find({
      user: ctx.session.user.id,
    }).populate({
      path: "product",
      options: {
        $project: {
          images: { $slice: ["$images", 1] },
        },
      },
    });

    const totalPrice = calculateTotalPrice(cartItems);

    return { cartItems, totalPrice };
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const cartItem = await CartItemModel.findById({
        _id: input.id,
        user: ctx.session.user.id,
      }).populate({
        path: "product",
        options: {
          $project: {
            images: { $slice: ["$images", 1] },
          },
        },
      });

      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart Item not found",
        });
      }
      return cartItem;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        updates: z.object({
          quantity: z.number().optional(),
          rental: z.boolean().optional(),
          rentDuration: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const cartItem = await CartItemModel.findOneAndUpdate(
        {
          _id: input.id,
          user: ctx.session.user.id,
        },
        input.updates,
        {
          new: true,
        }
      );
      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart Item not found",
        });
      }
      return cartItem;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const cartItem = await CartItemModel.findOneAndDelete({
        _id: input.id,
        user: ctx.session.user.id,
      });

      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart Item not found",
        });
      }
      return cartItem;
    }),

  checkout: protectedProcedure
    .input(
      z.object({
        paymentType: z.string(),
        address: z.object({
          street: z.string(),
          building: z.string(),
          floor: z.string(),
          block: z.string(),
          room: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get cart items
      const cartItems = await CartItemModel.find({
        user: ctx.session.user.id,
      }).populate("product");

      if (cartItems.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty",
        });
      }

      // Check the stock of the products and return an error if the stock is insufficient
      for (const item of cartItems) {
        const product = item.product;
        if (product.quantity < item.quantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Insufficient stock for the product: ${product.name}`,
          });
        }
      }

      // Calculate total price
      const totalPrice = calculateTotalPrice(cartItems);

      // Create a Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Stripe requires the amount in cents
        currency: "hkd",
      });

      // Create OrderItem documents
      const orderItems = await Promise.all(
        cartItems.map((cartItem) =>
          OrderItemModel.create({
            user: ctx.session.user.id,
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            rental: cartItem.rental,
            rentDuration: cartItem.rentDuration,
          })
        )
      );

      // Create an order
      const order = await OrderModel.create({
        user: ctx.session.user.id,
        items: orderItems.map((item) => item._id),
        totalPrice,
        paymentType: input.paymentType,
        paymentIntentId: paymentIntent.id, // Store the payment intent ID in the order
        address: input.address,
      });

      return { order, paymentIntent };
    }),

  processPayment: protectedProcedure
    .input(
      z.object({
        paymentMethodId: z.string(),
        paymentIntentId: z.string(), // Add this line
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { paymentMethodId, paymentIntentId } = input; // Add paymentIntentId

        // Retrieve the PaymentIntent using paymentIntentId instead of clientSecret
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );

        // Confirm the PaymentIntent
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
          paymentIntent.id,
          {
            payment_method: paymentMethodId,
          }
        );

        // Update the order status and payment details
        const order = await OrderModel.findOneAndUpdate(
          {
            paymentIntentId: confirmedPaymentIntent.id,
          },
          {
            status: "Paid",
          },
          { new: true }
        ).populate("items");

        if (!order) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Order not found",
          });
        }

        console.log("product", JSON.stringify(order.items, null, 2));

        // Update the stock of the products
        await Promise.all(
          order.items.map(async (item) => {
            await ProductModel.findOneAndUpdate(
              {
                _id: item.product._id,
              },
              {
                $inc: { quantity: -item.quantity },
              }
            );
          })
        );

        // Clear the cart
        await CartItemModel.deleteMany({
          user: ctx.session.user.id,
        });

        return { success: true, order };
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
    }),
});
