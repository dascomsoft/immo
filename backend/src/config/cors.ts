import { CorsOptions } from 'cors'

// Autoriser toutes les origines en développement
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
  'http://localhost:3000',
  'https://immo-nu-seven.vercel.app',
  'https://immo-md5d.onrender.com'
]

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (comme les apps mobiles)
    if (!origin) {
      callback(null, true)
      return
    }
    
    // Vérifier si l'origine est autorisée
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true)
    } else {
      console.log(`❌ CORS bloqué pour l'origine: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}
