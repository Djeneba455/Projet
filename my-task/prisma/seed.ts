import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')
  console.log('🗑️  Cleaning existing data...')

  // Clean existing data in correct order
  await prisma.notification.deleteMany()
  await prisma.task.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.classe.deleteMany()

  console.log('✅ Database cleaned')

  // ==================== STEP 1: CREATE CLASSES ====================
  console.log('\n📚 Creating classes...')
  
  const classe6A = await prisma.classe.create({
    data: {
      name: '6ème A',
      description: 'Classe de sixième section A',
    },
  })

  const classe5B = await prisma.classe.create({
    data: {
      name: '5ème B',
      description: 'Classe de cinquième section B',
    },
  })

  const classeTermS = await prisma.classe.create({
    data: {
      name: 'Terminal S',
      description: 'Classe de terminale scientifique',
    },
  })

  const classeLicence1 = await prisma.classe.create({
    data: {
      name: 'Licence 1 Info',
      description: 'Première année de licence informatique',
    },
  })

  const classe3C = await prisma.classe.create({
    data: {
      name: '3ème C',
      description: 'Classe de troisième section C',
    },
  })

  console.log('✅ 5 Classes created')

  // ==================== STEP 2: CREATE USERS ====================
  console.log('\n👥 Creating users...')
  
  const adminPassword = await hash('admin123', 10)
  const teacherPassword = await hash('teacher123', 10)
  const studentPassword = await hash('student123', 10)

  // ADMIN
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Directeur Administratif',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // TEACHERS
  const teacherMartin = await prisma.user.create({
    data: {
      email: 'teacher@example.com',
      name: 'Prof. Martin',
      password: teacherPassword,
      role: 'TEACHER',
      classeId: classeLicence1.id, // Professeur principal de Licence 1 Info
    },
  })

  const teacherDubois = await prisma.user.create({
    data: {
      email: 'teacher2@example.com',
      name: 'Prof. Dubois',
      password: teacherPassword,
      role: 'TEACHER',
      classeId: classe6A.id, // Professeur principal de 6ème A
    },
  })

  const teacherLefebvre = await prisma.user.create({
    data: {
      email: 'teacher3@example.com',
      name: 'Prof. Lefebvre',
      password: teacherPassword,
      role: 'TEACHER',
      classeId: classeTermS.id, // Professeur principal de Terminal S
    },
  })

  // STUDENTS - Terminal S (2 étudiants)
  const marieDupont = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      name: 'Marie Dupont',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classeTermS.id,
    },
  })

  const jeanMartin = await prisma.user.create({
    data: {
      email: 'student2@example.com',
      name: 'Jean Martin',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classeTermS.id,
    },
  })

  // STUDENTS - 6ème A (2 étudiants)
  const sophieBernard = await prisma.user.create({
    data: {
      email: 'student3@example.com',
      name: 'Sophie Bernard',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classe6A.id,
    },
  })

  const lucasPetit = await prisma.user.create({
    data: {
      email: 'student4@example.com',
      name: 'Lucas Petit',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classe6A.id,
    },
  })

  // STUDENTS - Licence 1 Info (2 étudiants)
  const emmaMoreau = await prisma.user.create({
    data: {
      email: 'student5@example.com',
      name: 'Emma Moreau',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classeLicence1.id,
    },
  })

  const thomasLaurent = await prisma.user.create({
    data: {
      email: 'student6@example.com',
      name: 'Thomas Laurent',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classeLicence1.id,
    },
  })

  // STUDENTS - 5ème B (1 étudiant)
  const claireRobert = await prisma.user.create({
    data: {
      email: 'student7@example.com',
      name: 'Claire Robert',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classe5B.id,
    },
  })

  // STUDENTS - 3ème C (1 étudiant)
  const pierreSimon = await prisma.user.create({
    data: {
      email: 'student8@example.com',
      name: 'Pierre Simon',
      password: studentPassword,
      role: 'STUDENT',
      classeId: classe3C.id,
    },
  })

  console.log('✅ 11 Users created (1 admin, 3 teachers, 8 students)')

  // ==================== STEP 3: CREATE CATEGORIES ====================
  console.log('\n📁 Creating categories...')
  
  const mathCategory = await prisma.category.create({
    data: {
      name: 'Mathématiques',
      color: '#3B82F6',
      description: 'Exercices et devoirs de mathématiques',
    },
  })

  const physiqueCategory = await prisma.category.create({
    data: {
      name: 'Physique',
      color: '#10B981',
      description: 'Travaux pratiques et théoriques',
    },
  })

  const infoCategory = await prisma.category.create({
    data: {
      name: 'Informatique',
      color: '#8B5CF6',
      description: 'Programmation et projets',
    },
  })

  const francaisCategory = await prisma.category.create({
    data: {
      name: 'Français',
      color: '#F59E0B',
      description: 'Lectures et dissertations',
    },
  })

  const projetCategory = await prisma.category.create({
    data: {
      name: 'Projet Personnel',
      color: '#EC4899',
      description: 'Projets individuels',
    },
  })

  const histoireCategory = await prisma.category.create({
    data: {
      name: 'Histoire',
      color: '#EF4444',
      description: 'Cours et recherches historiques',
    },
  })

  console.log('✅ 6 Categories created')

  // ==================== STEP 4: CREATE TASKS ====================
  console.log('\n📝 Creating tasks...')
  
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

  // ========== Tasks for Terminal S - Prof. Lefebvre ==========
  
  // Tasks for Marie Dupont (Terminal S)
  await prisma.task.create({
    data: {
      title: 'Résoudre les équations du second degré',
      description: 'Compléter tous les exercices pages 45-48 du manuel',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: tomorrow,
      creatorId: teacherLefebvre.id,
      assigneeId: marieDupont.id,
      categoryId: mathCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'TP Physique - Électricité',
      description: 'Réaliser le TP sur les circuits électriques et rendre le rapport',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: in3Days,
      creatorId: teacherLefebvre.id,
      assigneeId: marieDupont.id,
      categoryId: physiqueCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Dissertation - Le Romantisme',
      description: 'Rédiger une dissertation de 3 pages sur le mouvement romantique',
      status: 'TODO',
      priority: 'URGENT',
      dueDate: nextWeek,
      creatorId: teacherLefebvre.id,
      assigneeId: marieDupont.id,
      categoryId: francaisCategory.id,
    },
  })

  // Tasks for Jean Martin (Terminal S)
  await prisma.task.create({
    data: {
      title: 'Exposé Histoire - Révolution Française',
      description: 'Préparer un exposé de 10 minutes sur la Révolution Française',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: nextWeek,
      creatorId: teacherLefebvre.id,
      assigneeId: jeanMartin.id,
      categoryId: histoireCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Exercices de probabilités',
      description: 'Chapitre 8 - Tous les exercices',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      dueDate: yesterday,
      completedAt: yesterday,
      creatorId: teacherLefebvre.id,
      assigneeId: jeanMartin.id,
      categoryId: mathCategory.id,
    },
  })

  // ========== Tasks for 6ème A - Prof. Dubois ==========
  
  // Tasks for Sophie Bernard (6ème A)
  await prisma.task.create({
    data: {
      title: 'Exercices de fractions',
      description: 'Compléter la fiche d\'exercices sur les fractions',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: tomorrow,
      creatorId: teacherDubois.id,
      assigneeId: sophieBernard.id,
      categoryId: mathCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Lecture - Le Petit Prince',
      description: 'Lire les chapitres 1 à 5 et préparer un résumé',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: nextWeek,
      creatorId: teacherDubois.id,
      assigneeId: sophieBernard.id,
      categoryId: francaisCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Dessiner mon avatar',
      description: 'Créer un avatar pour le projet de classe',
      status: 'COMPLETED',
      priority: 'LOW',
      dueDate: yesterday,
      completedAt: yesterday,
      creatorId: sophieBernard.id,
      categoryId: projetCategory.id,
    },
  })

  // Tasks for Lucas Petit (6ème A)
  await prisma.task.create({
    data: {
      title: 'Poésie - Apprendre par cœur',
      description: 'Apprendre le poème "Demain dès l\'aube" de Victor Hugo',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: in3Days,
      creatorId: teacherDubois.id,
      assigneeId: lucasPetit.id,
      categoryId: francaisCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Tables de multiplication',
      description: 'Réviser les tables de 6 à 9',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: tomorrow,
      creatorId: teacherDubois.id,
      assigneeId: lucasPetit.id,
      categoryId: mathCategory.id,
    },
  })

  // ========== Tasks for Licence 1 Info - Prof. Martin ==========
  
  // Tasks for Emma Moreau (Licence 1 Info)
  await prisma.task.create({
    data: {
      title: 'Développer une API REST en Node.js',
      description: 'Créer une API complète avec authentification JWT, CRUD et validation',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: nextWeek,
      creatorId: teacherMartin.id,
      assigneeId: emmaMoreau.id,
      categoryId: infoCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Base de données PostgreSQL',
      description: 'Concevoir et implémenter un schéma de base de données pour un e-commerce',
      status: 'TODO',
      priority: 'URGENT',
      dueDate: in3Days,
      creatorId: teacherMartin.id,
      assigneeId: emmaMoreau.id,
      categoryId: infoCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Apprendre TypeScript',
      description: 'Suivre le cours sur TypeScript et faire les exercices',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: twoWeeks,
      creatorId: emmaMoreau.id,
      categoryId: projetCategory.id,
    },
  })

  // Tasks for Thomas Laurent (Licence 1 Info)
  await prisma.task.create({
    data: {
      title: 'Projet Java - Application de bibliothèque',
      description: 'Développer une application de gestion de bibliothèque avec Java Swing',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: twoWeeks,
      creatorId: teacherMartin.id,
      assigneeId: thomasLaurent.id,
      categoryId: infoCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Sécurité informatique - Étude de cas',
      description: 'Analyser les vulnérabilités courantes (SQL injection, XSS, CSRF)',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      creatorId: teacherMartin.id,
      assigneeId: thomasLaurent.id,
      categoryId: infoCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Portfolio personnel',
      description: 'Créer mon portfolio avec Next.js et Tailwind',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: twoWeeks,
      creatorId: thomasLaurent.id,
      categoryId: projetCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Algorithmes de tri',
      description: 'Implémenter et comparer les algorithmes de tri (bubble, quick, merge)',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      dueDate: yesterday,
      completedAt: yesterday,
      creatorId: teacherMartin.id,
      assigneeId: thomasLaurent.id,
      categoryId: infoCategory.id,
    },
  })

  // ========== Tasks for 5ème B ==========
  
  // Tasks for Claire Robert (5ème B)
  await prisma.task.create({
    data: {
      title: 'Devoir de géométrie',
      description: 'Exercices sur les triangles et les cercles',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: tomorrow,
      creatorId: teacherDubois.id,
      assigneeId: claireRobert.id,
      categoryId: mathCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Fiche de lecture',
      description: 'Lire et résumer "Le Voyage de Monsieur Perrichon"',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      creatorId: teacherDubois.id,
      assigneeId: claireRobert.id,
      categoryId: francaisCategory.id,
    },
  })

  // ========== Tasks for 3ème C ==========
  
  // Tasks for Pierre Simon (3ème C)
  await prisma.task.create({
    data: {
      title: 'Révision Brevet - Mathématiques',
      description: 'Réviser tous les chapitres de l\'année pour le brevet blanc',
      status: 'TODO',
      priority: 'URGENT',
      dueDate: in3Days,
      creatorId: teacherDubois.id,
      assigneeId: pierreSimon.id,
      categoryId: mathCategory.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Stage en entreprise - Rapport',
      description: 'Rédiger le rapport de stage d\'observation de 3 pages',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: nextWeek,
      creatorId: pierreSimon.id,
      categoryId: projetCategory.id,
    },
  })

  console.log('✅ 20 Tasks created')

  // ==================== STEP 5: CREATE NOTIFICATIONS ====================
  console.log('\n🔔 Creating notifications...')

  // Notifications for students
  await prisma.notification.create({
    data: {
      userId: marieDupont.id,
      title: 'Nouvelle tâche assignée',
      message: 'Prof. Lefebvre vous a assigné: Résoudre les équations du second degré',
      type: 'info',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: marieDupont.id,
      title: 'Échéance urgente',
      message: 'La tâche "Dissertation - Le Romantisme" est marquée comme urgente',
      type: 'warning',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: emmaMoreau.id,
      title: 'Échéance proche',
      message: 'La tâche "Base de données PostgreSQL" est due dans 3 jours',
      type: 'warning',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: thomasLaurent.id,
      title: 'Nouvelle tâche assignée',
      message: 'Prof. Martin vous a assigné: Projet Java - Application de bibliothèque',
      type: 'info',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: sophieBernard.id,
      title: 'Nouvelle tâche assignée',
      message: 'Prof. Dubois vous a assigné: Exercices de fractions',
      type: 'info',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: pierreSimon.id,
      title: 'Tâche urgente',
      message: 'Révision Brevet - Mathématiques nécessite votre attention',
      type: 'warning',
      read: false,
    },
  })

  // Notifications for teachers
  await prisma.notification.create({
    data: {
      userId: teacherMartin.id,
      title: 'Tâche complétée',
      message: 'Thomas Laurent a complété: Algorithmes de tri',
      type: 'success',
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: teacherLefebvre.id,
      title: 'Tâche complétée',
      message: 'Jean Martin a complété: Exercices de probabilités',
      type: 'success',
      read: true,
    },
  })

  await prisma.notification.create({
    data: {
      userId: teacherDubois.id,
      title: 'Tâche complétée',
      message: 'Sophie Bernard a complété: Dessiner mon avatar',
      type: 'success',
      read: true,
    },
  })

  console.log('✅ 9 Notifications created')

  // ==================== SUMMARY ====================
  console.log('\n🎉 Seed completed successfully!')
  console.log('\n' + '═'.repeat(60))
  console.log('📝 COMPTES DE TEST')
  console.log('═'.repeat(60))
  
  console.log('\n👤 ADMINISTRATEUR:')
  console.log('   Email: admin@example.com')
  console.log('   Mot de passe: admin123')
  
  console.log('\n👨‍🏫 ENSEIGNANTS:')
  console.log('   1. teacher@example.com / teacher123')
  console.log('      → Prof. Martin (Licence 1 Info)')
  console.log('   2. teacher2@example.com / teacher123')
  console.log('      → Prof. Dubois (6ème A)')
  console.log('   3. teacher3@example.com / teacher123')
  console.log('      → Prof. Lefebvre (Terminal S)')
  
  console.log('\n👨‍🎓 ÉTUDIANTS:')
  console.log('   Terminal S (2 étudiants):')
  console.log('   • student1@example.com / student123 → Marie Dupont')
  console.log('   • student2@example.com / student123 → Jean Martin')
  
  console.log('\n   6ème A (2 étudiants):')
  console.log('   • student3@example.com / student123 → Sophie Bernard')
  console.log('   • student4@example.com / student123 → Lucas Petit')
  
  console.log('\n   Licence 1 Info (2 étudiants):')
  console.log('   • student5@example.com / student123 → Emma Moreau')
  console.log('   • student6@example.com / student123 → Thomas Laurent')
  
  console.log('\n   5ème B (1 étudiant):')
  console.log('   • student7@example.com / student123 → Claire Robert')
  
  console.log('\n   3ème C (1 étudiant):')
  console.log('   • student8@example.com / student123 → Pierre Simon')
  
  console.log('\n' + '═'.repeat(60))
  console.log('📊 RÉSUMÉ DES DONNÉES')
  console.log('═'.repeat(60))
  console.log(`   • 5 Classes`)
  console.log(`   • 11 Utilisateurs (1 admin + 3 enseignants + 8 étudiants)`)
  console.log(`   • 6 Catégories`)
  console.log(`   • 20 Tâches (variété de statuts et priorités)`)
  console.log(`   • 9 Notifications`)
  console.log('═'.repeat(60))
  console.log('\n✨ Tous les enseignants ont une classe principale')
  console.log('✨ Tous les étudiants sont dans une classe')
  console.log('✨ Les tâches sont cohérentes avec les classes')
  console.log('\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
