import dotenv from 'dotenv'

dotenv.config()

interface WhatsAppMessageData {
  phone: string
  message: string
  isAdmin?: boolean
}

class WhatsAppService {
  private adminPhone: string

  constructor() {
    // Numéro de l'admin (configurable dans .env)
    this.adminPhone = process.env.ADMIN_WHATSAPP || '+33712345678'
  }

  /**
   * Envoyer un message WhatsApp
   * Ouvre WhatsApp Web/App avec le message pré-rempli
   * Retourne l'URL WhatsApp générée
   */
  sendWhatsAppMessage(data: WhatsAppMessageData): string {
    const { phone, message, isAdmin = false } = data
    
    // Utiliser le numéro admin ou celui du client
    const targetPhone = isAdmin ? this.adminPhone : phone
    
    // Nettoyer le numéro de téléphone
    const cleanPhone = targetPhone.replace(/[^0-9+]/g, '')
    
    // Encoder le message
    const encodedMessage = encodeURIComponent(message)
    
    // Créer le lien WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    
    console.log('📱 WhatsApp Link:', whatsappUrl)
    
    // En développement, afficher juste le lien
    if (process.env.NODE_ENV === 'development') {
      console.log('\n📱 ========== WHATSAPP (DEV MODE) ==========')
      console.log('   Phone:', cleanPhone)
      console.log('   Message:', message)
      console.log('   Link:', whatsappUrl)
      console.log('   ==========================================\n')
    }
    
    return whatsappUrl
  }

  /**
   * Notifier l'admin d'une nouvelle demande de visite
   */
  notifyAdminVisit(data: {
    clientName: string
    clientPhone: string
    propertyTitle: string
    preferredDate: Date
    message?: string
  }): void {
    const formattedDate = new Date(data.preferredDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const message = `
📅 NOUVELLE DEMANDE DE VISITE

👤 Client: ${data.clientName}
📱 Téléphone: ${data.clientPhone}
🏠 Bien: ${data.propertyTitle}
📆 Date souhaitée: ${formattedDate}
💬 Message: ${data.message || 'Aucun message'}

⚠️ Cliquez sur le lien pour répondre au client
    `.trim()

    this.sendWhatsAppMessage({
      phone: this.adminPhone,
      message,
      isAdmin: true,
    })
  }

  /**
   * Notifier l'admin d'une nouvelle demande de contact
   */
  notifyAdminContact(data: {
    clientName: string
    clientPhone: string
    clientEmail: string
    requestType: string
    message: string
    propertyTitle?: string
  }): void {
    const message = `
📩 NOUVELLE DEMANDE DE CONTACT

👤 Client: ${data.clientName}
📱 Téléphone: ${data.clientPhone}
📧 Email: ${data.clientEmail}
📋 Type: ${data.requestType}
${data.propertyTitle ? `🏠 Bien: ${data.propertyTitle}` : ''}
💬 Message: ${data.message}

⚠️ Cliquez sur le lien pour répondre au client
    `.trim()

    this.sendWhatsAppMessage({
      phone: this.adminPhone,
      message,
      isAdmin: true,
    })
  }

  /**
   * Envoyer un message de confirmation au client
   */
  sendConfirmationToClient(data: {
    clientName: string
    clientPhone: string
    propertyTitle: string
    preferredDate?: Date
    message?: string
  }): void {
    const dateStr = data.preferredDate 
      ? new Date(data.preferredDate).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'à confirmer'

    const message = `
✅ Confirmation de votre demande

Bonjour ${data.clientName},

Nous avons bien reçu votre demande pour le bien:
🏠 ${data.propertyTitle}

📆 Date souhaitée: ${dateStr}

Nous vous contacterons dans les plus brefs délais pour confirmer la disponibilité.

Merci de votre confiance ! 🙏
    `.trim()

    this.sendWhatsAppMessage({
      phone: data.clientPhone,
      message,
      isAdmin: false,
    })
  }

  /**
   * Générer un lien WhatsApp pour un bien
   */
  getPropertyWhatsAppLink(phone: string, propertyTitle: string, propertyId: string): string {
    const message = `
Bonjour, je suis intéressé par le bien :
🏠 ${propertyTitle}
📋 Référence: ${propertyId}

Pouvez-vous me donner plus d'informations ?
    `.trim()
    
    const cleanPhone = phone.replace(/[^0-9+]/g, '')
    const encodedMessage = encodeURIComponent(message)
    
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }
}

export default new WhatsAppService()
