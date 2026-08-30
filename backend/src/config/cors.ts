import { CorsOptions } from 'cors'

const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://immo-five-eta.vercel.app',
  ...configuredOrigins,
]

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans Origin
    // (Postman, curl, health checks, etc.)
    if (!origin) {
      return callback(null, true)
    }

    // Origines explicitement autorisées
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed: ${origin}`)
      return callback(null, true)
    }

    // Autoriser les previews Vercel du projet IMMO
    if (
      /^https:\/\/immo-[a-z0-9]+-dascomsofts-projects\.vercel\.app$/.test(origin)
    ) {
      console.log(`✅ CORS allowed Vercel preview: ${origin}`)
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