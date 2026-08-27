import express from 'express'
import contactController from '../controllers/contactController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

// ============================================
// ROUTES PUBLIQUES (sans authentification)
// ============================================

// Envoyer une demande de contact
router.post('/', contactController.sendContact)

// Envoyer une demande de visite
router.post('/visits', contactController.sendVisit)


// ============================================
// ROUTES PROTÉGÉES (authentification requise)
// ============================================

router.use(authMiddleware)

// --- Demandes de visite (DOIT ÊTRE AVANT /:id) ---
router.get('/visits', contactController.getVisits)
router.get('/visits/:id', contactController.getVisitById)
router.patch('/visits/:id/status', contactController.updateVisitStatus)
router.delete('/visits/:id', contactController.deleteVisit)

// --- Demandes de contact (APRÈS /visits) ---
router.get('/', contactController.getContacts)
router.get('/:id', contactController.getContactById)
router.patch('/:id/status', contactController.updateContactStatus)
router.delete('/:id', contactController.deleteContact)

// --- Statistiques ---
router.get('/stats', contactController.getRequestStats)

export default router
