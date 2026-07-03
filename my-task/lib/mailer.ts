import nodemailer from 'nodemailer'

function getAppUrl(): string {
  const fromEnv =
    process.env.NEXTAUTH_URL ||
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL

  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

function parseEmailAddress(header: string): { name?: string; email: string } {
  if (header.includes('<') && header.includes('>')) {
    const parts = header.split('<')
    return {
      name: parts[0].replace(/"/g, '').trim() || undefined,
      email: parts[1].replace(/>/g, '').trim(),
    }
  }
  return { email: header.trim() }
}

function parseRecipient(to: string): { name?: string; email: string } {
  return parseEmailAddress(to)
}

function getBrevoSender(): { name: string; email: string } | null {
  const defaultName = process.env.BREVO_SENDER_NAME || 'My-Task Notifications'

  if (process.env.BREVO_SENDER_EMAIL) {
    return {
      name: defaultName,
      email: process.env.BREVO_SENDER_EMAIL,
    }
  }

  const fromHeader = process.env.SMTP_FROM
  if (fromHeader) {
    const parsed = parseEmailAddress(fromHeader)
    // L'adresse @smtp-brevo.com est un identifiant SMTP, pas un expéditeur vérifié pour l'API
    if (!parsed.email.endsWith('@smtp-brevo.com')) {
      return {
        name: parsed.name || defaultName,
        email: parsed.email,
      }
    }
  }

  return null
}

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587')
  const secure = port === 465

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendViaBrevoApi(
  brevoApiKey: string,
  to: string,
  title: string,
  message: string,
  htmlContent: string,
  actionUrl: string
) {
  const sender = getBrevoSender()
  if (!sender) {
    throw new Error(
      'BREVO_SENDER_EMAIL non configuré (ou SMTP_FROM pointe vers @smtp-brevo.com). ' +
        'Utilisez une adresse expéditeur vérifiée dans Brevo.'
    )
  }

  const recipient = parseRecipient(to)

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender,
      to: [
        {
          email: recipient.email,
          ...(recipient.name ? { name: recipient.name } : {}),
        },
      ],
      subject: `🔔 My-Task : ${title}`,
      textContent: `${title}\n\n${message}\n\nSe connecter au site : ${actionUrl}`,
      htmlContent,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Brevo API returned error status ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  console.log(`[mailer] Email envoyé via Brevo API à ${recipient.email}:`, data)
  return data
}

async function sendViaSmtp(
  to: string,
  title: string,
  message: string,
  htmlContent: string,
  actionUrl: string
) {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!smtpUser || !smtpPass) {
    console.warn(
      '[mailer] Aucune configuration mail valide (BREVO_API_KEY + BREVO_SENDER_EMAIL ou SMTP_USER/SMTP_PASS). Email ignoré.'
    )
    return null
  }

  const from = process.env.SMTP_FROM || `"My-Task Notifications" <${smtpUser}>`
  const mailOptions = {
    from,
    to,
    subject: `🔔 My-Task : ${title}`,
    text: `${title}\n\n${message}\n\nSe connecter au site : ${actionUrl}`,
    html: htmlContent,
  }

  const transporter = getTransporter()
  const result = await transporter.sendMail(mailOptions)
  console.log(`[mailer] Email envoyé via SMTP à ${to}:`, result.messageId)
  return result
}

/**
 * Sends a notification email to a user with a premium HTML template.
 */
export async function sendNotificationEmail(to: string, title: string, message: string) {
  const brevoApiKey = process.env.BREVO_API_KEY
  const actionUrl = getAppUrl()

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 32px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .header .icon {
      font-size: 40px;
      margin-bottom: 12px;
      display: inline-block;
    }
    .content {
      padding: 32px;
      color: #374151;
      line-height: 1.6;
    }
    .content h2 {
      margin-top: 0;
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      letter-spacing: -0.025em;
    }
    .content p {
      font-size: 16px;
      margin-bottom: 24px;
    }
    .card-message {
      background-color: #f9fafb;
      border-left: 4px solid #4f46e5;
      padding: 20px;
      border-radius: 0 8px 8px 0;
      font-size: 15px;
      color: #4b5563;
      margin-bottom: 28px;
    }
    .cta-container {
      text-align: center;
      margin-bottom: 8px;
    }
    .cta-button {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      transition: background-color 0.2s ease;
      box-shadow: 0 4px 6px rgba(79, 70, 229, 0.15);
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="icon">🔔</div>
        <h1>Nouvelle Notification</h1>
      </div>
      <div class="content">
        <h2>${title}</h2>
        <p>Bonjour,</p>
        <p>Vous avez reçu une nouvelle notification sur votre espace My-Task :</p>
        <div class="card-message">
          ${message}
        </div>
        <div class="cta-container">
          <a href="${actionUrl}" class="cta-button">Accéder à mon espace</a>
        </div>
      </div>
      <div class="footer">
        Cet e-mail automatique a été envoyé par <a href="${actionUrl}">My-Task</a>.<br>
        Veuillez ne pas y répondre directement.
      </div>
    </div>
  </div>
</body>
</html>
  `

  if (brevoApiKey) {
    try {
      return await sendViaBrevoApi(brevoApiKey, to, title, message, htmlContent, actionUrl)
    } catch (apiError) {
      console.error('[mailer] Échec Brevo API, tentative SMTP en secours:', apiError)
    }
  }

  return sendViaSmtp(to, title, message, htmlContent, actionUrl)
}
