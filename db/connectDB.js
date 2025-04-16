import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected ${mongoose.connection.host}`)
    return mongoose.connection
  } catch(error){
    console.log("Error connecting to the database:", error.message)
    throw error
  }
}
