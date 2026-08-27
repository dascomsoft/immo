import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connected successfully')
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connected')
})

mongoose.connection.on('disconnected', () => {
  console.log('🔴 MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err)
})

export default connectDB