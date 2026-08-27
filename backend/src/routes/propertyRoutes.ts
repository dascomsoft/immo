import express from 'express'
import * as propertyController from '../controllers/propertyController'
import { authMiddleware } from '../middleware/auth'
import { uploadMultiple } from '../config/multer'
import { validateProperty } from '../middleware/validation'

const router = express.Router()

// Routes publiques
router.get('/', propertyController.getAll)
router.get('/slug/:slug', propertyController.getBySlug)
router.get('/:id', propertyController.getById)

// Routes protégées (admin)
router.use(authMiddleware)
router.post('/', uploadMultiple, validateProperty, propertyController.create)
router.put('/:id', uploadMultiple, validateProperty, propertyController.update)
router.delete('/:id', propertyController.remove)
router.delete('/:id/images/:publicId', propertyController.deleteImage)
router.patch('/:id/publish', propertyController.togglePublish)

export default router