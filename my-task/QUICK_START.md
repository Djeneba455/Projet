# 🚀 Démarrage Rapide

## Installation en 5 minutes

### 1. Installer les dépendances
```bash
cd my-task
npm install
```

### 2. Initialiser la base de données
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Peupler avec des données de test
```bash
npm run prisma:seed
```

### 4. Lancer l'application
```bash
npm run dev
```

### 5. Ouvrir dans le navigateur
```
http://localhost:3000
```

## 🔑 Connexion avec les comptes de test

### Admin (tous les accès)
- Email: `admin@example.com`
- Mot de passe: `admin123`

### Enseignant (peut créer et assigner des tâches)
- Email: `teacher@example.com`
- Mot de passe: `teacher123`

### Étudiant (peut gérer ses propres tâches)
- Email: `student1@example.com`
- Mot de passe: `student123`

## 📱 Fonctionnalités à tester

1. **Dashboard** - Vue d'ensemble de vos tâches
2. **Tâches (Kanban)** - Drag & drop entre les colonnes
3. **Calendrier** - Vue mensuelle des échéances
4. **Notifications** - Cloche en haut à droite
5. **Rapports** - Export PDF
6. **Admin** - Gestion utilisateurs (compte admin uniquement)
7. **Enseignant** - Attribution de tâches (compte teacher)

## 🎨 Interface

- Mode sombre/clair automatique selon vos préférences système
- Design responsive (mobile, tablette, desktop)
- Animations fluides avec Tailwind CSS

## ❗ En cas de problème

### La base de données ne se crée pas
```bash
# Supprimer le fichier de base de données
rm prisma/dev.db
# Relancer les migrations
npx prisma migrate dev --name init
```

### Erreur "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Les changements ne s'affichent pas
```bash
# Nettoyer le cache Next.js
rm -rf .next
npm run dev
```

## 📖 Documentation complète

Consultez le fichier [README.md](./README.md) pour :
- Architecture détaillée
- Guide de déploiement Vercel
- Migration PostgreSQL
- Sécurité et bonnes pratiques

## 🎓 Apprentissage

Ce projet utilise :
- ✅ Next.js 16 App Router avec Server Components
- ✅ TypeScript pour la sécurité des types
- ✅ Prisma ORM pour la base de données
- ✅ NextAuth.js v5 pour l'authentification
- ✅ Tailwind CSS v4 pour le styling
- ✅ Zod pour la validation
- ✅ React Hook Form pour les formulaires

Parfait pour apprendre le développement fullstack moderne !
