import mongoose, { ConnectOptions } from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(String(process.env.MONGO_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Successfully Connected to mongoose ✅");
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }
};

export default dbConnect;
