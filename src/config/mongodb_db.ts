import mongoose from "mongoose";
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DATABASE_URL_MONGODB as string);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
