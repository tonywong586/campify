import mongoose from "mongoose";

export const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(process.env.MONGO_URI!, {
    serverSelectionTimeoutMS:
      process.env.NODE_ENV == "development" ? 500 : 30000,
  });
};
