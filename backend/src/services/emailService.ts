import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: {
    filename: string
    content?: string | Buffer
    path?: string
    contentType?: string
  }[]
}

interface ContactEmailData {
  name: string
  email: string
  phone: string
  message: string
  requestType: string
  propertyTitle?: string
  organizationName: string
  organizationEmail: string
}

interface VisitEmailData {
  name: string
  email: string
  phone: string
  preferredDate: Date
  message: string
  propertyTitle: string
  organizationName: string
  organizationEmail: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private isConfigured: boolean = false

  constructor() {
    this.initializeTransporter()
  }

  /**
   * Initialiser le transporteur SMTP
   */
  private initializeTransporter(): void {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (smtpHost && smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        })
        this.isConfigured = true
        console.log('✅ Email service configured successfully')
      } catch (error) {
        console.error('❌ Email service configuration error:', error)
        this.isConfigured = false
      }
    } else {
      console.warn('⚠️ Email service not configured. SMTP credentials missing.')
      this.isConfigured = false
    }
  }

  /**
   * Vérifier si l'email est configuré
   */
  isEmailConfigured(): boolean {
    return this.isConfigured && this.transporter !== null
  }

  /**
   * Envoyer un email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.isEmailConfigured()) {
      console.warn('⚠️ Email not sent: service not configured')
      return
    }

    try {
      const from = options.from || process.env.SMTP_USER || 'noreply@realestate.com'

      const mailOptions = {
        from,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text || '',
        html: options.html,
        attachments: options.attachments,
      }

      await this.transporter!.sendMail(mailOptions)
      console.log(`✅ Email sent to: ${options.to}`)
    } catch (error) {
      console.error('❌ Email sending error:', error)
      throw new Error('Erreur lors de l\'envoi de l\'email')
    }
  }

  /**
   * Envoyer un email de confirmation de contact
   */
  async sendContactConfirmation(data: ContactEmailData): Promise<void> {
    const subject = `Confirmation de votre demande - ${data.organizationName}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #21130D; color: #F5F1EA; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #F5F1EA; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { color: #B97845; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.organizationName}</h1>
            <p>Confirmation de votre demande</p>
          </div>
          <div class="content">
            <p>Bonjour <strong>${data.name}</strong>,</p>
            <p>Nous avons bien reçu votre demande du type <strong>${data.requestType}</strong>.</p>
            ${data.propertyTitle ? `<p>Bien concerné : <strong>${data.propertyTitle}</strong></p>` : ''}
            <p>Voici un récapitulatif de votre message :</p>
            <blockquote style="background: #EDE8DF; padding: 15px; border-left: 4px solid #B97845;">
              ${data.message}
            </blockquote>
            <p>Nous vous répondrons dans les plus brefs délais.</p>
            <p>Cordialement,<br><strong>L'équipe ${data.organizationName}</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${data.organizationName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject,
      html,
      text: `Bonjour ${data.name},\n\nNous avons bien reçu votre demande.\n\nCordialement,\nL'équipe ${data.organizationName}`,
    })
  }

  /**
   * Envoyer un email de notification à l'agence pour une nouvelle demande
   */
  async sendContactNotification(data: ContactEmailData): Promise<void> {
    const subject = `Nouvelle demande de contact - ${data.organizationName}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #21130D; color: #F5F1EA; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #F5F1EA; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .info-item { background: #EDE8DF; padding: 10px; border-radius: 5px; }
          .label { font-weight: bold; color: #21130D; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { color: #B97845; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.organizationName}</h1>
            <p>Nouvelle demande de contact</p>
          </div>
          <div class="content">
            <h2>Informations du demandeur</h2>
            <div class="info-grid">
              <div class="info-item">
                <p class="label">Nom</p>
                <p>${data.name}</p>
              </div>
              <div class="info-item">
                <p class="label">Email</p>
                <p>${data.email}</p>
              </div>
              <div class="info-item">
                <p class="label">Téléphone</p>
                <p>${data.phone}</p>
              </div>
              <div class="info-item">
                <p class="label">Type de demande</p>
                <p>${data.requestType}</p>
              </div>
              ${data.propertyTitle ? `
              <div class="info-item" style="grid-column: 1 / -1;">
                <p class="label">Bien concerné</p>
                <p>${data.propertyTitle}</p>
              </div>
              ` : ''}
            </div>

            <h2 style="margin-top: 20px;">Message</h2>
            <blockquote style="background: #EDE8DF; padding: 15px; border-left: 4px solid #B97845;">
              ${data.message}
            </blockquote>

            <p style="margin-top: 20px;">
              <a href="${process.env.CORS_ORIGIN || 'http://localhost:3000'}/admin/requests" 
                 style="background: #B97845; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Voir la demande
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${data.organizationName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail({
      to: data.organizationEmail,
      subject,
      html,
      text: `Nouvelle demande de ${data.name} - ${data.requestType}\n\n${data.message}`,
    })
  }

  /**
   * Envoyer un email de confirmation de visite
   */
  async sendVisitConfirmation(data: VisitEmailData): Promise<void> {
    const subject = `Confirmation de votre demande de visite - ${data.organizationName}`
    const formattedDate = new Date(data.preferredDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #21130D; color: #F5F1EA; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #F5F1EA; }
          .highlight { color: #B97845; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .info-box { background: #EDE8DF; padding: 15px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.organizationName}</h1>
            <p>Confirmation de votre demande de visite</p>
          </div>
          <div class="content">
            <p>Bonjour <strong>${data.name}</strong>,</p>
            <p>Nous avons bien reçu votre demande de visite pour le bien :</p>
            <div class="info-box">
              <p><strong>Bien :</strong> ${data.propertyTitle}</p>
              <p><strong>Date souhaitée :</strong> ${formattedDate}</p>
            </div>
            ${data.message ? `
            <p><strong>Votre message :</strong></p>
            <blockquote style="background: #EDE8DF; padding: 15px; border-left: 4px solid #B97845;">
              ${data.message}
            </blockquote>
            ` : ''}
            <p>Nous vous confirmerons la disponibilité dans les plus brefs délais.</p>
            <p>Cordialement,<br><strong>L'équipe ${data.organizationName}</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${data.organizationName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail({
      to: data.email,
      subject,
      html,
      text: `Bonjour ${data.name},\n\nVotre demande de visite pour ${data.propertyTitle} le ${formattedDate} a été reçue.\n\nCordialement,\nL'équipe ${data.organizationName}`,
    })
  }

  /**
   * Envoyer un email de notification de visite à l'agence
   */
  async sendVisitNotification(data: VisitEmailData): Promise<void> {
    const subject = `Nouvelle demande de visite - ${data.organizationName}`
    const formattedDate = new Date(data.preferredDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #21130D; color: #F5F1EA; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #F5F1EA; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .info-item { background: #EDE8DF; padding: 10px; border-radius: 5px; }
          .label { font-weight: bold; color: #21130D; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { color: #B97845; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.organizationName}</h1>
            <p>Nouvelle demande de visite</p>
          </div>
          <div class="content">
            <h2>Informations du visiteur</h2>
            <div class="info-grid">
              <div class="info-item">
                <p class="label">Nom</p>
                <p>${data.name}</p>
              </div>
              <div class="info-item">
                <p class="label">Email</p>
                <p>${data.email}</p>
              </div>
              <div class="info-item">
                <p class="label">Téléphone</p>
                <p>${data.phone}</p>
              </div>
              <div class="info-item">
                <p class="label">Date souhaitée</p>
                <p>${formattedDate}</p>
              </div>
              <div class="info-item" style="grid-column: 1 / -1;">
                <p class="label">Bien</p>
                <p>${data.propertyTitle}</p>
              </div>
            </div>

            ${data.message ? `
            <h2 style="margin-top: 20px;">Message</h2>
            <blockquote style="background: #EDE8DF; padding: 15px; border-left: 4px solid #B97845;">
              ${data.message}
            </blockquote>
            ` : ''}

            <p style="margin-top: 20px;">
              <a href="${process.env.CORS_ORIGIN || 'http://localhost:3000'}/admin/requests" 
                 style="background: #B97845; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Voir la demande
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${data.organizationName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail({
      to: data.organizationEmail,
      subject,
      html,
      text: `Nouvelle demande de visite de ${data.name} pour ${data.propertyTitle} le ${formattedDate}`,
    })
  }

  /**
   * Envoyer un email générique
   */
  async sendGenericEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    })
  }
}

export default new EmailService()
