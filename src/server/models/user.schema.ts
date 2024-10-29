import {
  CallbackError,
  HydratedDocument,
  model,
  Model,
  models,
  Schema,
  Types,
} from "mongoose";
import argon2 from "argon2";
import { CartItemDoc } from "~/server/models";

// User Interface
export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  admin?: boolean;
  cart?: CartItemDoc[];
}

export type UserDoc = HydratedDocument<User>;

const UserSchema = new Schema<UserDoc>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        type: Types.ObjectId,
        ref: "CartItem",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  // only hash the password if it has been modified or is new
  if (!user.isModified("password")) {
    return next();
  }

  try {
    // generate a hash of the password using argon2
    const hash = await argon2.hash(user.password);

    // replace the plain-text password with the hash
    user.password = hash;

    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

//create a middleware using argon2 to hash the password before saving it to the database
export const UserModel: Model<UserDoc> =
  models.User || model("User", UserSchema);
