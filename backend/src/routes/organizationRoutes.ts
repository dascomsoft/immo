import express from 'express'
import organizationController from '../controllers/organizationController'
import { authMiddleware } from '../middleware/auth'
import { uploadSingle } from '../config/multer'

const router = express.Router()

// Routes protégées
router.use(authMiddleware)
router.get('/', organizationController.getOrganization)
router.put('/', organizationController.updateOrganization)
router.post('/logo', uploadSingle, organizationController.uploadLogo)

export default router