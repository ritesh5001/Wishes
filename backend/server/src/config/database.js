import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export const connectDatabase = async (uri) => {
  if (!uri) {
    throw new Error("MongoDB connection string is not defined");
  }

  await mongoose.connect(uri, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose.connection;
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();
};
