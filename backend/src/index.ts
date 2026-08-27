import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import connectDB from './config/database'
import { corsOptions } from './config/cors'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'
import routes from './routes'

// Charger les variables d'environnement
dotenv.config()

// Initialiser Express
const app: Express = express()
const PORT = process.env.PORT || 5000

// Connexion à MongoDB
connectDB()

// Middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate Limiting
app.use(rateLimiter)

// Routes
app.use('/api', routes)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// Error handler
app.use(errorHandler)

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API URL: http://localhost:${PORT}/api`)
  console.log(`💚 Health check: http://localhost:${PORT}/health`)
})

export default app