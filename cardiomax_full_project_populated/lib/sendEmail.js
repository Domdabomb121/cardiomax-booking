import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendConfirmationEmail({ to, subject, html }) {
  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM || 'CardioMax Fitness <no-reply@cardiomax.example>',
    subject,
    html
  })
}
