import mongoose from "mongoose";

declare global {
  var _mongooseConnection: typeof mongoose | null | undefined;
}

const dbConnect = async () => {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI environment variable is not defined.");
    return Promise.resolve();
  }

  if (global._mongooseConnection) {
    return Promise.resolve();
  }

  try {
    await mongoose.connect(`${process.env.MONGO_URI}`, {
      dbName: `${process.env.MONGODB_DATABASE_NAME}`,
    } as any);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully!");
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDb connection failed. Make sure mongo url is correct! " + err
      );
    });

    global._mongooseConnection = mongoose;
    return Promise.resolve();
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    return Promise.reject(error);
  }
};

export default dbConnect;
