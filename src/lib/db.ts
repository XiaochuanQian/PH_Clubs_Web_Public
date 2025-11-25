import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to .env file')
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error: any) {
    console.log(process.env.MONGODB_URI)
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

// Add this for debugging
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true)
}