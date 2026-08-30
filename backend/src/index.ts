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

// Render fournit automatiquement PORT
const PORT = process.env.PORT || 5000

// ========================================
// CONNEXION MONGODB
// ========================================

connectDB()

// ========================================
// SECURITY
// ========================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
)

// ========================================
// CORS
// ========================================

app.use(cors(corsOptions))

// ========================================
// BODY PARSER
// ========================================

app.use(
  express.json({
    limit: '10mb',
  })
)

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
)

// ========================================
// RATE LIMITING
// ========================================

if (process.env.NODE_ENV === 'production') {
  app.use(rateLimiter)
}

// ========================================
// API ROUTES
// ========================================

app.use('/api', routes)

// ========================================
// HEALTH CHECK
// ========================================

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// ========================================
// ERROR HANDLER
// ========================================

app.use(errorHandler)

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log('========================================')
  console.log('🚀 IMMOBILIER BACKEND')
  console.log('========================================')
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log(`🚀 Server running on port: ${PORT}`)
  console.log(`📡 API: /api`)
  console.log(`💚 Health: /health`)
  console.log('========================================')
})

export default app