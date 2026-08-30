import { CorsOptions } from 'cors'

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CORS_ORIGIN,
].filter(Boolean) as string[]

console.log('🔐 CORS allowed origins:', allowedOrigins)

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans Origin
    // Exemple : curl, Postman, certains health checks
    if (!origin) {
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed: ${origin}`)
      return callback(null, true)
    }

    console.error(`❌ CORS blocked: ${origin}`)

    return callback(new Error('Not allowed by CORS'))
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],

  optionsSuccessStatus: 204,
}