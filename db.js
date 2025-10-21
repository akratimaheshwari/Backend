import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async () => {
  console.log("Connecting to:", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    })
    console.log('MongoDB connected to:',mongoose.connection.name)
  } catch (err) {
    console.error('DB connection failed:', err.message)
    process.exit(1)
  }
}

export default connectDB


