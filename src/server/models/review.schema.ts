import {
  HydratedDocument,
  model,
  Model,
  models,
  Schema,
  SchemaTimestampsConfig,
  Types,
} from "mongoose";
import { UserDoc, ProductDoc } from "~/server/models";

// Review Interface
export interface Review {
  user: UserDoc;
  product: ProductDoc;
  rating: number;
  comment: string;
}

const ReviewSchema = new Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type ReviewDoc = HydratedDocument<Review & SchemaTimestampsConfig>;

export const ReviewModel: Model<ReviewDoc> =
  models.Review || model("Review", ReviewSchema);
