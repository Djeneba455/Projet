# MY-TASK — POINTS ESSENTIELS DE LA DOCUMENTATION

**Application de gestion des tâches étudiants**  
Version 1.0 | Février 2025

---

## 1. PRÉSENTATION DU PROJET

**Objectif :** Application fullstack de gestion des tâches pour un contexte éducatif (étudiants, enseignants, administrateurs).

**Stack principale :** Next.js 16 | React 19 | TypeScript | Prisma | PostgreSQL

**Fonctionnalités clés :** Authentification, tableau Kanban drag & drop, calendrier, notifications, export PDF, mode sombre/clair, responsive.

---

## 2. ARCHITECTURE

**Couches :**
- **Présentation** : React, Tailwind CSS
- **Application** : Server Actions, API Routes, Middleware
- **Données** : Prisma ORM, PostgreSQL

**Flux :** Server Components pour le chargement → Server Actions pour les mutations → Revalidation du cache.

---

## 3. MODÈLE DE DONNÉES (Prisma)

**Entités principales :**
- **User** : id, name, email, password, role (STUDENT/TEACHER/ADMIN), classeId
- **Task** : title, description, status (TODO/IN_PROGRESS/COMPLETED), priority (LOW/MEDIUM/HIGH/URGENT), dueDate, creatorId, assigneeId, categoryId
- **Category** : name, color, description
- **Classe** : name, description
- **Notification** : userId, title, message, read, type

---

## 4. AUTHENTIFICATION (NextAuth.js v5)

- **Provider** : Credentials (email + mot de passe)
- **Session** : JWT
- **Sécurité** : bcrypt pour le hash des mots de passe
- **Pages publiques** : /, /login, /register
- **Protection** : vérification `auth()` dans le layout dashboard

---

## 5. RÔLES ET PERMISSIONS

| Rôle | Accès |
|------|-------|
| STUDENT | Ses tâches + tâches assignées |
| TEACHER | Ses tâches + assignation aux étudiants + catégories |
| ADMIN | Gestion utilisateurs, classes, catégories |

---

## 6. MODULES ET FONCTIONNALITÉS

- **Dashboard** : Statistiques, prochaines échéances
- **Tâches** : Kanban, filtres, recherche, CRUD
- **Calendrier** : Vue mensuelle (react-big-calendar)
- **Rapports** : Export PDF (jspdf)
- **Notifications** : Liste, marquage lu, Cron toutes les 6h
- **Profil** : Modification nom, email, mot de passe
- **Admin** : CRUD utilisateurs, classes, catégories
- **Enseignant** : Assignation de tâches aux étudiants

---

## 7. STRUCTURE DU PROJET

```
app/           → (auth), (dashboard), actions/, api/
components/    → admin, layout, task, ui, calendar, etc.
lib/           → auth, prisma, utils, validations, pdf-generator
prisma/        → schema.prisma, seed.ts
```

---

## 8. INSTALLATION

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

**Variables d'environnement :** DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

**Comptes test :** admin@example.com / admin123 | student1@example.com / student123

---

## 9. DÉPLOIEMENT (Vercel)

- PostgreSQL (Vercel Postgres, Supabase, Neon)
- Variables d'environnement configurées
- `prisma migrate deploy` après le premier déploiement

---

## 10. SÉCURITÉ

- Mots de passe hashés (bcrypt)
- Validation Zod côté serveur
- Prisma (protection injection SQL)
- Permissions par rôle

---

## CONVERSION EN WORD / PDF

**Pour obtenir un fichier Word (.docx) ou PDF :**
1. Ouvrir ce fichier dans Microsoft Word (Word ouvre les .md) → Enregistrer sous → .docx ou PDF
2. Ou utiliser l’extension "Markdown PDF" dans VS Code → Export PDF
3. Ou coller le contenu dans Google Docs → Télécharger en .docx ou PDF
