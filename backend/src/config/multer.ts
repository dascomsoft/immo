import multer from 'multer'
import path from 'path'

// Configuration du stockage en mémoire (pour Cloudinary)
const storage = multer.memoryStorage()

// Filtre des types de fichiers autorisés
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Type de fichier non autorisé. Utilisez JPG, JPEG, PNG ou WEBP.'), false)
  }
}

// Configuration multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Maximum 10 fichiers
  },
})

// Middleware pour l'upload unique
export const uploadSingle = upload.single('image')

// Middleware pour l'upload multiple
export const uploadMultiple = upload.array('images', 10)

// Middleware pour les champs multiples
export const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'logo', maxCount: 1 },
])