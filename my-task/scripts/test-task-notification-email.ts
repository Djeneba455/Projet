/**
 * Test bout-en-bout : création tâche → notification → email
 * Usage: npx tsx scripts/test-task-notification-email.ts
 */
import { config } from 'dotenv'
config()

import { prisma } from '../lib/prisma'
import { createNotification } from '../app/actions/notifications'

const TARGET_EMAIL = 'konearmand9698@gmail.com'

async function main() {
  console.log('=== Test notification email (attribution de tâche) ===\n')

  // 1. Vérifier la config mail
  console.log('--- Config mail ---')
  console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'défini' : 'MANQUANT')
  console.log('BREVO_SENDER_EMAIL:', process.env.BREVO_SENDER_EMAIL || '(non défini)')
  console.log('SMTP_FROM:', process.env.SMTP_FROM || '(non défini)')
  console.log('SMTP_USER:', process.env.SMTP_USER ? 'défini' : 'MANQUANT')
  console.log()

  // 2. Trouver le destinataire
  const assignee = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!assignee) {
    console.error(`❌ Aucun utilisateur trouvé avec l'email ${TARGET_EMAIL}`)
    console.log('\nUtilisateurs existants:')
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      take: 15,
    })
    users.forEach((u) => console.log(`  - ${u.email} (${u.role}) id=${u.id}`))
    process.exit(1)
  }

  console.log('--- Destinataire (assigné) ---')
  console.log(JSON.stringify(assignee, null, 2))

  // 3. Trouver un créateur différent (teacher ou admin)
  const creator = await prisma.user.findFirst({
    where: {
      id: { not: assignee.id },
      role: { in: ['TEACHER', 'ADMIN'] },
    },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!creator) {
    console.error('❌ Aucun teacher/admin trouvé pour créer la tâche')
    process.exit(1)
  }

  console.log('\n--- Créateur (attribue la tâche) ---')
  console.log(JSON.stringify(creator, null, 2))

  // 4. Vérifier la condition métier de createTask
  console.log('\n--- Condition createTask ---')
  const wouldNotify = assignee.id !== creator.id
  console.log(`assigneeId (${assignee.id}) !== creatorId (${creator.id}) → notification: ${wouldNotify ? 'OUI' : 'NON'}`)
  if (!wouldNotify) {
    console.error('❌ Vous vous assignez la tâche à vous-même : aucun email ne sera envoyé (comportement normal).')
    process.exit(1)
  }

  // 5. Créer une tâche de test en base
  const taskTitle = `[TEST] Tâche assignée ${new Date().toISOString()}`
  console.log('\n--- Création tâche en base ---')
  const task = await prisma.task.create({
    data: {
      title: taskTitle,
      description: 'Tâche de test pour vérifier l\'envoi email à l\'attribution',
      status: 'TODO',
      priority: 'MEDIUM',
      creatorId: creator.id,
      assigneeId: assignee.id,
    },
    include: { assignee: true, creator: true },
  })
  console.log(`Tâche créée: id=${task.id}, title="${task.title}"`)

  // 6. Déclencher createNotification (même appel que createTask)
  console.log('\n--- Appel createNotification (comme createTask) ---')
  const notifPayload = {
    userId: assignee.id,
    title: 'Nouvelle tâche assignée',
    message: `${creator.name} vous a assigné la tâche: ${task.title}`,
    type: 'info',
    actorId: creator.id,
  }
  console.log('Payload:', JSON.stringify(notifPayload, null, 2))

  const result = await createNotification(notifPayload)

  if ('error' in result && result.error) {
    console.error('❌ createNotification a échoué:', result.error)
    process.exit(1)
  }

  console.log('\n--- Résultat ---')
  console.log('Notification créée:', result.notification?.id)
  console.log('Email envoyé:', result.emailSent ? 'OUI ✅' : 'NON ❌')

  if (result.emailSent) {
    console.log(`\n✅ Flux OK. Vérifiez ${TARGET_EMAIL} (sujet: "🔔 My-Task : Nouvelle tâche assignée").`)
  } else {
    console.log('\n❌ La notification est en base mais l\'email n\'a pas été envoyé.')
    console.log('   Causes possibles: variables mail manquantes, serveur non redémarré après .env.')
    process.exit(1)
  }
}

main()
  .catch((err) => {
    console.error('Erreur fatale:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
