import express from 'express'
import uploadController from '../controllers/uploadController'
import { authMiddleware } from '../middleware/auth'
import { uploadSingle, uploadMultiple, uploadFields } from '../config/multer'

const router = express.Router()

// Routes protégées (admin)
router.use(authMiddleware)

// Upload simple
router.post('/single', uploadSingle, uploadController.uploadSingle)
router.post('/multiple', uploadMultiple, uploadController.uploadMultiple)

// Images de biens
router.post('/property/:propertyId', uploadSingle, uploadController.uploadPropertyImage)
router.post('/property/:propertyId/multiple', uploadMultiple, uploadController.uploadPropertyImages)
router.delete('/property/:propertyId/image/:publicId', uploadController.deletePropertyImage)
router.put('/property/:propertyId/reorder', uploadController.reorderPropertyImages)

// Logo de l'organisation
router.post('/organization/logo', uploadSingle, uploadController.uploadOrganizationLogo)
router.post('/organization/banner', uploadSingle, uploadController.uploadBanner)

// Suppression d'image
router.delete('/image/:publicId', uploadController.deleteImage)

export default router