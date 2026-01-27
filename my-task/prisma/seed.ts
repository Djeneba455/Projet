import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create users with different roles
  const adminPassword = await hash('admin123', 10)
  const teacherPassword = await hash('teacher123', 10)
  const studentPassword = await hash('student123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      name: 'Prof. Martin',
      password: teacherPassword,
      role: 'TEACHER',
    },
  })

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      name: 'Marie Dupont',
      password: studentPassword,
      role: 'STUDENT',
    },
  })

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      email: 'student2@example.com',
      name: 'Jean Martin',
      password: studentPassword,
      role: 'STUDENT',
    },
  })

  const student3 = await prisma.user.upsert({
    where: { email: 'student3@example.com' },
    update: {},
    create: {
      email: 'student3@example.com',
      name: 'Sophie Bernard',
      password: studentPassword,
      role: 'STUDENT',
    },
  })

  console.log('✅ Users created')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Mathématiques' },
      update: {},
      create: {
        name: 'Mathématiques',
        color: '#3B82F6',
        description: 'Exercices et devoirs de mathématiques',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Physique' },
      update: {},
      create: {
        name: 'Physique',
        color: '#10B981',
        description: 'Travaux pratiques et théoriques',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Informatique' },
      update: {},
      create: {
        name: 'Informatique',
        color: '#8B5CF6',
        description: 'Programmation et projets',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Français' },
      update: {},
      create: {
        name: 'Français',
        color: '#F59E0B',
        description: 'Lectures et dissertations',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Projet Personnel' },
      update: {},
      create: {
        name: 'Projet Personnel',
        color: '#EC4899',
        description: 'Projets individuels',
      },
    }),
  ])

  console.log('✅ Categories created')

  // Create tasks for students
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

  // Tasks assigned by teacher to student1
  await prisma.task.create({
    data: {
      title: 'Résoudre les équations du chapitre 5',
      description: 'Compléter tous les exercices pages 45-48',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: tomorrow,
      creatorId: teacher.id,
      assigneeId: student1.id,
      categoryId: categories[0].id, // Mathématiques
    },
  })

  await prisma.task.create({
    data: {
      title: 'Laboratoire de physique - Mouvement',
      description: 'Préparer le rapport du TP sur le mouvement rectiligne',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      creatorId: teacher.id,
      assigneeId: student1.id,
      categoryId: categories[1].id, // Physique
    },
  })

  await prisma.task.create({
    data: {
      title: 'Projet final - Application web',
      description: 'Développer une application de gestion de tâches avec Next.js',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      dueDate: twoWeeks,
      creatorId: teacher.id,
      assigneeId: student1.id,
      categoryId: categories[2].id, // Informatique
    },
  })

  // Personal tasks for student1
  await prisma.task.create({
    data: {
      title: 'Réviser pour l\'examen de français',
      description: 'Relire les chapitres 1-5 et préparer des fiches',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: nextWeek,
      creatorId: student1.id,
      categoryId: categories[3].id, // Français
    },
  })

  await prisma.task.create({
    data: {
      title: 'Terminer la lecture du livre',
      description: 'Finir "Les Misérables" pour le cours de littérature',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: twoWeeks,
      creatorId: student1.id,
      categoryId: categories[3].id, // Français
    },
  })

  // Tasks for student2
  await prisma.task.create({
    data: {
      title: 'Devoir de mathématiques - Géométrie',
      description: 'Exercices sur les triangles et cercles',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      creatorId: teacher.id,
      assigneeId: student2.id,
      categoryId: categories[0].id, // Mathématiques
    },
  })

  await prisma.task.create({
    data: {
      title: 'Projet de recherche en physique',
      description: 'Recherche sur les énergies renouvelables',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: twoWeeks,
      creatorId: teacher.id,
      assigneeId: student2.id,
      categoryId: categories[1].id, // Physique
    },
  })

  // Tasks for student3
  await prisma.task.create({
    data: {
      title: 'TP Informatique - Algorithmes',
      description: 'Implémenter les algorithmes de tri',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      dueDate: now,
      completedAt: now,
      creatorId: teacher.id,
      assigneeId: student3.id,
      categoryId: categories[2].id, // Informatique
    },
  })

  await prisma.task.create({
    data: {
      title: 'Dissertation de français',
      description: 'Rédiger une dissertation sur le romantisme',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: nextWeek,
      creatorId: teacher.id,
      assigneeId: student3.id,
      categoryId: categories[3].id, // Français
    },
  })

  await prisma.task.create({
    data: {
      title: 'Projet personnel - Portfolio',
      description: 'Créer mon portfolio en ligne',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: twoWeeks,
      creatorId: student3.id,
      categoryId: categories[4].id, // Projet Personnel
    },
  })

  console.log('✅ Tasks created')

  // Create some notifications
  await prisma.notification.create({
    data: {
      userId: student1.id,
      title: 'Nouvelle tâche assignée',
      message: 'Prof. Martin vous a assigné une nouvelle tâche: Résoudre les équations du chapitre 5',
      type: 'info',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: student1.id,
      title: 'Échéance proche',
      message: 'La tâche "Résoudre les équations du chapitre 5" est due demain',
      type: 'warning',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: teacher.id,
      title: 'Tâche complétée',
      message: 'Sophie Bernard a complété la tâche "TP Informatique - Algorithmes"',
      type: 'success',
      read: true,
    },
  })

  console.log('✅ Notifications created')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📝 Test credentials:')
  console.log('Admin: admin@example.com / admin123')
  console.log('Teacher: teacher@example.com / teacher123')
  console.log('Students: student1@example.com / student123')
  console.log('          student2@example.com / student123')
  console.log('          student3@example.com / student123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
