import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create classes first
  const classe6A = await prisma.classe.upsert({
    where: { name: '6ème A' },
    update: {},
    create: {
      name: '6ème A',
      description: 'Classe de sixième section A',
    },
  })

  const classe5B = await prisma.classe.upsert({
    where: { name: '5ème B' },
    update: {},
    create: {
      name: '5ème B',
      description: 'Classe de cinquième section B',
    },
  })

  const classeTermS = await prisma.classe.upsert({
    where: { name: 'Terminal S' },
    update: {},
    create: {
      name: 'Terminal S',
      description: 'Classe de terminale scientifique',
    },
  })

  const classeLicence1 = await prisma.classe.upsert({
    where: { name: 'Licence 1 Info' },
    update: {},
    create: {
      name: 'Licence 1 Info',
      description: 'Première année de licence informatique',
    },
  })

  console.log('✅ Classes created')

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
      classeId: classeLicence1.id, // Professeur principal de Licence 1 Info
    },
  })

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@example.com' },
    update: {},
    create: {
      email: 'teacher2@example.com',
      name: 'Prof. Dubois',
      password: teacherPassword,
      role: 'TEACHER',
      classeId: classe6A.id, // Professeur principal de 6ème A
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
      classeId: classeTermS.id,
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
      classeId: classeTermS.id,
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
      classeId: classe6A.id,
    },
  })

  const student4 = await prisma.user.upsert({
    where: { email: 'student4@example.com' },
    update: {},
    create: {
      email: 'student4@example.com',
      name: 'Lucas Petit',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classe5B.id,
    },
  })

  const student5 = await prisma.user.upsert({
    where: { email: 'student5@example.com' },
    update: {},
    create: {
      email: 'student5@example.com',
      name: 'Emma Moreau',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classeLicence1.id,
    },
  })

  const student6 = await prisma.user.upsert({
    where: { email: 'student6@example.com' },
    update: {},
    create: {
      email: 'student6@example.com',
      name: 'Thomas Laurent',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classeLicence1.id,
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

  // Tasks for student4
  await prisma.task.create({
    data: {
      title: 'Exercices de mathématiques',
      description: 'Compléter les exercices du manuel page 75-80',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: tomorrow,
      creatorId: teacher2.id,
      assigneeId: student4.id,
      categoryId: categories[0].id,
    },
  })

  // Tasks for student5
  await prisma.task.create({
    data: {
      title: 'Développer une API REST',
      description: 'Créer une API avec Node.js et Express',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: nextWeek,
      creatorId: teacher.id,
      assigneeId: student5.id,
      categoryId: categories[2].id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Base de données SQL',
      description: 'Concevoir et implémenter une base de données relationnelle',
      status: 'TODO',
      priority: 'URGENT',
      dueDate: nextWeek,
      creatorId: teacher.id,
      assigneeId: student5.id,
      categoryId: categories[2].id,
    },
  })

  // Tasks for student6
  await prisma.task.create({
    data: {
      title: 'Projet Java - Application de gestion',
      description: 'Développer une application de gestion de bibliothèque en Java',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: twoWeeks,
      creatorId: teacher.id,
      assigneeId: student6.id,
      categoryId: categories[2].id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Étude de cas - Sécurité informatique',
      description: 'Analyser les vulnérabilités d\'une application web',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: twoWeeks,
      creatorId: teacher.id,
      assigneeId: student6.id,
      categoryId: categories[2].id,
    },
  })

  // Personal task for student6
  await prisma.task.create({
    data: {
      title: 'Apprendre React',
      description: 'Suivre le tutoriel officiel de React',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: twoWeeks,
      creatorId: student6.id,
      categoryId: categories[4].id,
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

  await prisma.notification.create({
    data: {
      userId: student2.id,
      title: 'Nouvelle tâche assignée',
      message: 'Prof. Martin vous a assigné: Devoir de mathématiques - Géométrie',
      type: 'info',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: student5.id,
      title: 'Échéance urgente',
      message: 'La tâche "Base de données SQL" est marquée comme urgente',
      type: 'warning',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: student6.id,
      title: 'Nouvelle tâche assignée',
      message: 'Prof. Martin vous a assigné: Projet Java - Application de gestion',
      type: 'info',
      read: false,
    },
  })

  console.log('✅ Notifications created')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📝 Test credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👤 Admin: admin@example.com / admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👨‍🏫 Teachers:')
  console.log('   teacher@example.com / teacher123')
  console.log('   teacher2@example.com / teacher123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👨‍🎓 Students:')
  console.log('   student1@example.com / student123 (Terminal S)')
  console.log('   student2@example.com / student123 (Terminal S)')
  console.log('   student3@example.com / student123 (6ème A)')
  console.log('   student4@example.com / student123 (5ème B)')
  console.log('   student5@example.com / student123 (Licence 1 Info)')
  console.log('   student6@example.com / student123 (Licence 1 Info)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n📊 Summary:')
  console.log('   • 4 Classes')
  console.log('   • 9 Users (1 admin, 2 teachers, 6 students)')
  console.log('   • 5 Categories')
  console.log('   • 18+ Tasks')
  console.log('   • 7+ Notifications')
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
