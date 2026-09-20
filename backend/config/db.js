import mongoose from "mongoose";

export const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to database")
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}