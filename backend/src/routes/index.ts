
import express from 'express'
import propertyRoutes from './propertyRoutes'
import contactRoutes from './contactRoutes'
import organizationRoutes from './organizationRoutes'
import authRoutes from './authRoutes'
import dashboardRoutes from './dashboardRoutes'
import uploadRoutes from './uploadRoutes'

const router = express.Router()

router.use('/properties', propertyRoutes)
router.use('/contact', contactRoutes)
router.use('/organization', organizationRoutes)
router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/upload', uploadRoutes)

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' })
})

export default router