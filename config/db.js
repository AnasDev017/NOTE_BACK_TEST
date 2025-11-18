import mongoose from "mongoose";

// Use a cached connection across serverless invocations to avoid
// creating a new connection on every cold start.
const DbCon = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment");
    }

    // If mongoose already connected, reuse it
    if (mongoose.connection.readyState === 1) {
      console.log("Mongodb already connected (reused)");
      return;
    }

    // For serverless, just await the connection. Newer drivers ignore those options.
    await mongoose.connect(mongoUri);

    console.log("Mongodb is connected");
  } catch (error) {
    console.error("Error in mongodb connection", error);
    // rethrow so calling code can react (and logs will show)
    throw error;
  }
};

export default DbCon;
