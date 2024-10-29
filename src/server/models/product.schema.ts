import {
  HydratedDocument,
  model,
  Model,
  models,
  Schema,
  Types,
} from "mongoose";

// Product Interface
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  quantity: number;
  rental: boolean;
  reviews: string[];
  rating: number;
}

export type ProductDoc = HydratedDocument<Product>;

const ProductSchema = new Schema<ProductDoc>(
  {
    rating: {
      type: Number,
      default: 5,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    rental: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        type: Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ProductModel: Model<ProductDoc> =
  models.Product || model("Product", ProductSchema);
