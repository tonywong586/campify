import {
  HydratedDocument,
  model,
  Model,
  models,
  Schema,
  SchemaTimestampsConfig,
  Types,
} from "mongoose";
import { UserDoc, CartItemDoc, OrderItemDoc } from "~/server/models";

export type PaymentType = "stripe" | "fps" | "cash" | "payme" | "others";

export interface Address {
  street: string;
  building: string;
  floor: string;
  block: string;
  room: string;
}

export type Status =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded"
  | "Returned"
  | "Paid";

export interface Order {
  user: UserDoc;
  items: OrderItemDoc[];
  totalPrice: number;
  paymentIntentId?: string;
  status: Status;
  paymentType: PaymentType;
  address: Address;
}

export type OrderDoc = HydratedDocument<Order & SchemaTimestampsConfig>;

const OrderSchema = new Schema<OrderDoc>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Paid",
      ],
    },
    paymentType: {
      type: String,
      default: "others",
      enum: ["stripe", "fps", "cash", "payme", "others"],
    },
    paymentIntentId: {
      type: String,
      default: "",
    },
    address: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel: Model<OrderDoc> =
  models.Order || model("Order", OrderSchema);
