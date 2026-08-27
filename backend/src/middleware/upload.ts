import { Request, Response, NextFunction } from 'express'
import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Type de fichier non autorisé. Utilisez JPG, JPEG, PNG ou WEBP.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

export const uploadSingle = upload.single('image')
export const uploadMultiple = upload.array('images', 10)
export const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'logo', maxCount: 1 },
])