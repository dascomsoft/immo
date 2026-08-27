import express from 'express'
import dashboardController from '../controllers/dashboardController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.use(authMiddleware)
router.get('/stats', dashboardController.getStats)
router.get('/property-stats', dashboardController.getPropertyStats)

export default router