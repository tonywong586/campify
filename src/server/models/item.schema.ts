import { Schema, Types } from "mongoose";
import { ProductDoc } from "./product.schema";
import { UserDoc } from "./user.schema";

export interface Item {
  product: ProductDoc;
  quantity: number;
  rental: boolean;
  rentDuration?: {
    start: Date;
    end: Date;
  };
  user: UserDoc;
}

export const ItemSchema = new Schema<Item>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    rental: {
      type: Boolean,
      default: false,
    },
    rentDuration: {
      start: {
        type: Date,
        default: null,
      },
      end: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    _id: false, // We don't want this schema to have its own _id
  }
);
