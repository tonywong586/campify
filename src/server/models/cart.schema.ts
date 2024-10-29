import {
  HydratedDocument,
  model,
  Model,
  models,
  Schema,
  Types,
} from "mongoose";
import { Item, ItemSchema } from "./item.schema";

export type CartItemDoc = HydratedDocument<Item>;

const CartItemSchema = new Schema<Item>(
  {
    ...ItemSchema.obj,
  },
  {
    timestamps: true,
  }
);

export const CartItemModel: Model<CartItemDoc> =
  models.CartItem || model("CartItem", CartItemSchema);
