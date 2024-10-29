import {
  HydratedDocument,
  model,
  Model,
  models,
  Schema,
  SchemaTimestampsConfig,
} from "mongoose";
import { Item, ItemSchema } from "./item.schema";

export type OrderItemDoc = HydratedDocument<Item & SchemaTimestampsConfig>;

const OrderItemSchema = new Schema<Item>(
  {
    ...ItemSchema.obj,
  },
  {
    timestamps: true,
  }
);

export const OrderItemModel: Model<OrderItemDoc> =
  models.OrderItem || model("OrderItem", OrderItemSchema);
