# 📚 Gestion des Tâches Étudiants

Application fullstack de gestion de tâches avec Next.js 16, destinée aux étudiants, enseignants et administrateurs.

## ✨ Fonctionnalités

### Pour tous les utilisateurs
- 🔐 Authentification sécurisée avec NextAuth.js
- 📊 Dashboard personnalisé selon le rôle
- ✅ Tableau Kanban drag & drop pour gérer les tâches
- 🗓️ Vue calendrier avec échéances
- 🔔 Système de notifications en temps réel
- 📄 Export de rapports en PDF
- 🔍 Filtrage et recherche avancés
- 🌗 Mode sombre/clair

### Pour les étudiants
- Créer et gérer leurs tâches personnelles
- Voir les tâches assignées par les enseignants
- Suivre leurs progrès avec des statistiques

### Pour les enseignants
- Attribuer des tâches aux étudiants
- Suivre le progrès de leurs étudiants
- Gérer les catégories de tâches

### Pour les administrateurs
- Gestion complète des utilisateurs
- Gestion des catégories globales
- Vue d'ensemble de toutes les activités

## 🛠️ Stack Technique

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Base de données**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentification**: NextAuth.js v5
- **Validation**: Zod
- **Drag & Drop**: @dnd-kit
- **Calendrier**: react-big-calendar
- **PDF**: jspdf
- **Forms**: react-hook-form

## 🚀 Installation en local

### Prérequis
- Node.js 20+ 
- npm ou yarn

### Étapes

1. **Cloner le projet**
```bash
cd my-task
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
Créer un fichier `.env` (déjà présent) :
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

6. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 🔑 Comptes de test

Après le seed, utilisez ces comptes :

- **Administrateur**: `admin@example.com` / `admin123`
- **Enseignant**: `teacher@example.com` / `teacher123`
- **Étudiant 1**: `student1@example.com` / `student123`
- **Étudiant 2**: `student2@example.com` / `student123`
- **Étudiant 3**: `student3@example.com` / `student123`

## 📦 Déploiement sur Vercel

### 1. Préparer PostgreSQL

L'application utilise SQLite en local mais nécessite PostgreSQL pour la production.

**Option A: Vercel Postgres** (Recommandé)
```bash
# Dans le dashboard Vercel, créer une base Postgres
# Copier l'URL de connexion
```

**Option B: Supabase**
```bash
# Créer un projet sur supabase.com
# Copier l'URL de connexion PostgreSQL
```

**Option C: Neon.tech**
```bash
# Créer un projet sur neon.tech
# Copier l'URL de connexion
```

### 2. Modifier le schéma Prisma

```bash
# Remplacer prisma/schema.prisma par prisma/schema-postgresql.prisma
cp prisma/schema-postgresql.prisma prisma/schema.prisma
```

### 3. Variables d'environnement Vercel

Dans le dashboard Vercel, ajouter :

```env
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="générer-avec-openssl-rand-base64-32"
NEXTAUTH_URL="https://votre-app.vercel.app"
CRON_SECRET="secret-pour-cron-jobs"
```

### 4. Déployer

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ou depuis Git
# Push vers GitHub et connecter le repo à Vercel
```

### 5. Exécuter les migrations

```bash
# Après le premier déploiement
npx prisma migrate deploy
npx prisma db seed
```

## 🔄 Migrations de base de données

### SQLite vers PostgreSQL

```bash
# 1. Exporter les données depuis SQLite (si nécessaire)
npx prisma db pull

# 2. Mettre à jour le schema pour PostgreSQL
# Remplacer provider = "sqlite" par provider = "postgresql"

# 3. Générer le client Prisma
npx prisma generate

# 4. Créer les migrations
npx prisma migrate dev

# 5. Appliquer en production
npx prisma migrate deploy
```

## ⚙️ Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Prisma
npm run prisma:migrate   # Créer une migration
npm run prisma:studio    # Interface visuelle DB
npm run prisma:seed      # Peupler la DB
```

## 🏗️ Structure du projet

```
my-task/
├── app/
│   ├── (auth)/              # Pages publiques (login, register)
│   ├── (dashboard)/         # Pages protégées
│   ├── actions/             # Server Actions
│   ├── api/                 # API routes
│   └── layout.tsx
├── components/              # Composants React
│   ├── ui/                  # Composants UI réutilisables
│   ├── task/                # Composants de tâches
│   ├── layout/              # Layout components
│   └── ...
├── lib/                     # Utilitaires
│   ├── prisma.ts           # Client Prisma
│   ├── auth.ts             # Config NextAuth
│   ├── validations/        # Schémas Zod
│   └── utils.ts
├── prisma/
│   ├── schema.prisma       # Schéma DB
│   └── seed.ts            # Données de test
├── middleware.ts           # Protection routes
└── vercel.json            # Config Vercel (Cron jobs)
```

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Protection CSRF avec NextAuth
- Validation des inputs avec Zod
- Permissions basées sur les rôles
- SQL injection protection via Prisma

## 📝 Notifications automatiques

L'application inclut un système de notifications automatiques via cron jobs :

- **Échéances proches** : Notification 24h avant l'échéance
- **Tâches en retard** : Notification quotidienne
- **Résumé hebdomadaire** : Résumé des tâches en attente

Les cron jobs sont configurés dans `vercel.json` :
```json
{
  "crons": [{
    "path": "/api/cron/notifications",
    "schedule": "0 */6 * * *"
  }]
}
```

## 🐛 Troubleshooting

### Erreur Prisma "Unknown env config"
```bash
# Relancer la génération
npx prisma generate
```

### Erreur d'authentification
```bash
# Vérifier NEXTAUTH_SECRET dans .env
# Générer un nouveau secret si nécessaire
openssl rand -base64 32
```

### Erreur de build Vercel
```bash
# Vérifier que les variables d'env sont configurées
# S'assurer que prisma generate est dans postinstall
```

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licence

MIT

## 👨‍💻 Auteur

Créé comme projet d'apprentissage Next.js fullstack.
