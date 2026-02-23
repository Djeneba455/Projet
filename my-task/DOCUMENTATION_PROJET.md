# DOCUMENTATION DU PROJET MY-TASK
## Application de Gestion des Tâches Étudiants

**Version du document :** 1.0  
**Date :** Février 2025  
**Auteur :** Documentation technique

---

## TABLE DES MATIÈRES

1. [Introduction et vue d'ensemble](#1-introduction-et-vue-densemble)
2. [Architecture du projet](#2-architecture-du-projet)
3. [Stack technique détaillée](#3-stack-technique-détaillée)
4. [Modèle de données](#4-modèle-de-données)
5. [Système d'authentification](#5-système-dauthentification)
6. [Gestion des rôles et permissions](#6-gestion-des-rôles-et-permissions)
7. [Fonctionnalités par module](#7-fonctionnalités-par-module)
8. [Structure du code source](#8-structure-du-code-source)
9. [Server Actions et logique métier](#9-server-actions-et-logique-métier)
10. [Composants React principaux](#10-composants-react-principaux)
11. [Interface utilisateur et thèmes](#11-interface-utilisateur-et-thèmes)
12. [Système de notifications](#12-système-de-notifications)
13. [Export et rapports PDF](#13-export-et-rapports-pdf)
14. [Installation et configuration](#14-installation-et-configuration)
15. [Déploiement en production](#15-déploiement-en-production)
16. [Sécurité et bonnes pratiques](#16-sécurité-et-bonnes-pratiques)
17. [Guide de maintenance](#17-guide-de-maintenance)
18. [Troubleshooting et FAQ](#18-troubleshooting-et-faq)

---

# 1. INTRODUCTION ET VUE D'ENSEMBLE

## 1.1 Objectif du projet

**My-Task** est une application fullstack de gestion des tâches destinée à un contexte éducatif. Elle permet aux étudiants, enseignants et administrateurs de collaborer efficacement dans la gestion et le suivi des tâches scolaires ou académiques.

## 1.2 Public cible

- **Étudiants** : Création et suivi de leurs tâches personnelles, consultation des tâches assignées par les enseignants
- **Enseignants** : Attribution de tâches aux étudiants, suivi des progrès, gestion des catégories
- **Administrateurs** : Gestion complète des utilisateurs, classes et catégories, vue d'ensemble du système

## 1.3 Valeur ajoutée

- Interface moderne et intuitive avec mode sombre/clair
- Collaboration enseignant-étudiant intégrée
- Tableau Kanban drag & drop pour une gestion visuelle
- Calendrier des échéances
- Notifications automatiques
- Export de rapports en PDF
- Application responsive (mobile, tablette, desktop)

## 1.4 Points clés du projet

| Aspect | Détail |
|--------|--------|
| Type | Application web fullstack |
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript |
| Base de données | PostgreSQL (production) / SQLite (développement) |
| Authentification | NextAuth.js v5 (Credentials) |
| Déploiement | Vercel (recommandé) |

---

# 2. ARCHITECTURE DU PROJET

## 2.1 Architecture globale

L'application suit une architecture **client-serveur** moderne basée sur Next.js :

```
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE PRÉSENTATION                       │
│  React Components | Tailwind CSS | Responsive Design         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE APPLICATION                        │
│  Server Actions | API Routes | Middleware                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE DONNÉES                            │
│  Prisma ORM | PostgreSQL | Migrations                        │
└─────────────────────────────────────────────────────────────┘
```

## 2.2 Flux de données

1. **Rendu côté serveur (SSR)** : Les pages principales chargent les données via Server Components
2. **Actions serveur** : Les formulaires et interactions utilisent les Server Actions pour les mutations
3. **Revalidation** : `revalidatePath()` rafraîchit le cache après chaque modification
4. **Client Components** : Utilisés pour l'interactivité (Kanban, formulaires, thème)

## 2.3 Patterns utilisés

- **Composition de composants** : Composants réutilisables (UI, layout, métier)
- **Server Actions** : Remplacent les API REST traditionnelles
- **Validation Zod** : Validation côté serveur avant toute opération
- **Gestion d'état** : useState/useEffect pour l'état local, pas de store global

---

# 3. STACK TECHNIQUE DÉTAILLÉE

## 3.1 Framework et runtime

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 16.1.1 | Framework React fullstack avec App Router |
| React | 19.2.3 | Bibliothèque UI |
| Node.js | 20+ | Runtime JavaScript |
| TypeScript | 5.x | Typage statique |

## 3.2 Base de données et ORM

| Technologie | Rôle |
|-------------|------|
| Prisma | ORM type-safe, migrations, client généré |
| PostgreSQL | Base de données production (Vercel, Neon) |
| SQLite | Base de données développement local |

## 3.3 Bibliothèques principales

| Bibliothèque | Usage |
|--------------|-------|
| NextAuth.js | Authentification (Credentials, JWT) |
| Tailwind CSS v4 | Styling utilitaire, thèmes |
| @dnd-kit | Drag & drop Kanban |
| react-big-calendar | Vue calendrier |
| react-hook-form + Zod | Formulaires et validation |
| jspdf + jspdf-autotable | Génération de rapports PDF |
| date-fns | Manipulation des dates |
| bcryptjs | Hashage des mots de passe |
| lucide-react | Icônes |

## 3.4 Configuration TypeScript

Le projet utilise une configuration stricte pour TypeScript avec les chemins d'alias `@/` pointant vers le répertoire racine.

---

# 4. MODÈLE DE DONNÉES

## 4.1 Schéma Prisma - Vue d'ensemble

Le schéma définit 7 modèles principaux :

```
User ──┬── Task (creator)
       ├── Task (assignee)
       ├── Notification
       ├── Session
       └── Account

Task ──┬── User (creator, assignee)
       └── Category

Category ── Task[]
Classe ── User[]
```

## 4.2 Modèle User

| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Identifiant unique |
| name | String | Nom complet |
| email | String (unique) | Adresse email |
| password | String | Mot de passe hashé (bcrypt) |
| role | Role | STUDENT, TEACHER, ADMIN |
| classeId | String? | Référence vers la classe (étudiants/enseignants) |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Dernière mise à jour |

**Relations :** classe, createdTasks, assignedTasks, notifications, sessions, accounts

## 4.3 Modèle Task

| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Identifiant unique |
| title | String | Titre de la tâche |
| description | String? | Description détaillée |
| status | TaskStatus | TODO, IN_PROGRESS, COMPLETED |
| priority | Priority | LOW, MEDIUM, HIGH, URGENT |
| dueDate | DateTime? | Date d'échéance |
| completedAt | DateTime? | Date de complétion |
| creatorId | String | Créateur de la tâche |
| assigneeId | String? | Assigné à (optionnel) |
| categoryId | String? | Catégorie (optionnel) |

## 4.4 Modèle Category

Catégories globales pour organiser les tâches (ex : Mathématiques, Français).

## 4.5 Modèle Classe

Classes pédagogiques pour regrouper les étudiants et enseignants.

## 4.6 Modèle Notification

Notifications utilisateur (échéances, rappels, mises à jour).

## 4.7 Modèles Account et Session

Gérés par NextAuth pour l'authentification (OAuth, sessions JWT).

---

# 5. SYSTÈME D'AUTHENTIFICATION

## 5.1 Configuration NextAuth

- **Stratégie** : JWT (JSON Web Tokens)
- **Provider** : Credentials (email + mot de passe)
- **Page de login** : `/login`
- **Callback** : Extension de la session avec `id` et `role`

## 5.2 Flux d'authentification

1. L'utilisateur soumet email + mot de passe
2. Recherche de l'utilisateur par email dans la base
3. Vérification du mot de passe avec `bcrypt.compare()`
4. Création du token JWT contenant id, email, name, role
5. Stockage de la session côté client (cookie)
6. Redirection vers le dashboard

## 5.3 Protection des routes

- **Layout Dashboard** : Vérifie `auth()` avant de rendre le contenu
- **Redirection** : Utilisateurs non authentifiés → `/login`
- **Pages publiques** : `/`, `/login`, `/register`, `/api/auth/*`

## 5.4 Sécurité des mots de passe

- Hashage avec bcrypt (coût par défaut)
- Pas de stockage en clair
- Validation côté serveur uniquement

---

# 6. GESTION DES RÔLES ET PERMISSIONS

## 6.1 Les trois rôles

| Rôle | Accès | Permissions |
|------|-------|-------------|
| STUDENT | Ses tâches personnelles + tâches assignées | Créer, modifier, compléter ses tâches |
| TEACHER | Ses tâches + tâches assignées à ses étudiants | + Assigner des tâches, gérer catégories |
| ADMIN | Tout le système | + Gestion utilisateurs, classes, catégories |

## 6.2 Filtrage des données par rôle

- **STUDENT** : `where.OR = [{ assigneeId: userId }, { creatorId: userId }]`
- **TEACHER** : Tâches créées ou assignées par lui
- **ADMIN** : Aucun filtre (accès complet)

## 6.3 Interface conditionnelle

La Sidebar affiche des liens différents selon `session.user.role` :
- Étudiants : Dashboard, Tâches, Calendrier, Rapports, Profil
- Enseignants : + Assignations
- Admins : + Utilisateurs, Classes, Catégories

---

# 7. FONCTIONNALITÉS PAR MODULE

## 7.1 Module Dashboard

- Vue d'ensemble personnalisée selon le rôle
- Statistiques : tâches à faire, en cours, terminées
- Prochaines échéances
- Vue par catégories
- Liens rapides vers les sections

## 7.2 Module Tâches

**Fonctionnalités :**
- Liste des tâches avec filtres (statut, priorité, catégorie, assigné)
- Recherche par titre/description
- Tableau Kanban drag & drop (3 colonnes : À faire, En cours, Terminé)
- Création et édition de tâches
- Détail d'une tâche
- Assignation (enseignants)

**Composants clés :** KanbanBoard, KanbanColumn, TaskCard, TaskForm, TaskFilters

## 7.3 Module Calendrier

- Vue mensuelle des tâches
- Affichage des échéances par date
- Clic sur une tâche pour les détails
- Composant : react-big-calendar

## 7.4 Module Rapports

- Sélection de la période (dates de début/fin)
- Génération de rapport PDF
- Statistiques : total, par statut, taux de complétion
- Tableau des tâches avec colonnes personnalisées

## 7.5 Module Notifications

- Liste des notifications
- Marquage comme lu
- Types : info, rappel échéance, tâche assignée
- Badge de compteur dans la navbar

## 7.6 Module Profil

- Modification du nom et email
- Changement de mot de passe
- Formulaire avec validation Zod

## 7.7 Module Enseignant (Assignations)

- Liste des étudiants de la classe
- Attribution de tâches aux étudiants
- Suivi des tâches assignées

## 7.8 Module Administration

**Utilisateurs :**
- Liste avec filtre par rôle
- Création, modification, suppression
- Gestion du rôle et de la classe

**Classes :**
- CRUD des classes
- Affectation des enseignants et étudiants

**Catégories :**
- CRUD des catégories
- Couleur personnalisable
- Utilisation dans les tâches

---

# 8. STRUCTURE DU CODE SOURCE

## 8.1 Arborescence principale

```
my-task/
├── app/                      # App Router Next.js
│   ├── (auth)/               # Groupe de routes authentification
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/          # Routes protégées
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── calendar/
│   │   ├── reports/
│   │   ├── notifications/
│   │   ├── profile/
│   │   ├── teacher/
│   │   └── admin/
│   ├── actions/              # Server Actions
│   │   ├── auth.ts
│   │   ├── tasks.ts
│   │   ├── users.ts
│   │   ├── categories.ts
│   │   ├── classes.ts
│   │   ├── notifications.ts
│   │   └── profile.ts
│   ├── api/                  # Routes API
│   │   ├── auth/[...nextauth]/
│   │   └── cron/notifications/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/                # Composants admin
│   ├── calendar/
│   ├── layout/               # Navbar, Sidebar
│   ├── notifications/
│   ├── profile/
│   ├── providers/
│   ├── reports/
│   ├── task/                 # Kanban, formulaires
│   └── ui/                   # Composants réutilisables
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── utils.ts
│   ├── pdf-generator.ts
│   ├── notifications.ts
│   └── validations/          # Schémas Zod
├── prisma/
│   ├── schema.prisma
│   ├── schema-postgresql.prisma
│   └── seed.ts
├── hooks/
├── types/
├── middleware.ts
├── tailwind.config.ts
└── package.json
```

## 8.2 Conventions de nommage

- **Composants** : PascalCase (TaskCard.tsx)
- **Fichiers** : kebab-case ou PascalCase pour composants
- **Actions** : verbes (createTask, updateTask)
- **Variables** : camelCase

## 8.3 Organisation des imports

- Alias `@/` pour les imports absolus
- Imports groupés : React, bibliothèques, composants locaux, styles

---

# 9. SERVER ACTIONS ET LOGIQUE MÉTIER

## 9.1 Principes des Server Actions

- Directive `'use server'` en tête de fichier
- Fonctions async exportées
- Appelées directement depuis les composants (sans fetch)
- Validation avec Zod avant traitement
- Utilisation de `revalidatePath()` pour rafraîchir le cache

## 9.2 Actions principales - Tâches

| Action | Description |
|--------|-------------|
| getTasks | Récupère les tâches selon les filtres et le rôle |
| createTask | Crée une tâche (validation Zod) |
| updateTask | Met à jour une tâche |
| updateTaskStatus | Change le statut (Kanban drag) |
| deleteTask | Supprime une tâche |
| getTaskById | Détail d'une tâche |

## 9.3 Actions - Utilisateurs

| Action | Description |
|--------|-------------|
| createUser | Création par admin |
| updateUser | Modification |
| updateUserRole | Changement de rôle |
| deleteUser | Suppression |

## 9.4 Actions - Autres

- **Categories** : CRUD
- **Classes** : CRUD
- **Notifications** : createNotification, markAsRead
- **Auth** : signIn, signOut (via NextAuth)
- **Profile** : updateProfile, updatePassword

## 9.5 Gestion des erreurs

Les actions retournent un objet `{ error?: string }` ou `{ success: boolean }`. Les composants affichent les erreurs dans des modales ou toasts.

---

# 10. COMPOSANTS REACT PRINCIPAUX

## 10.1 Composants layout

- **Navbar** : Barre de navigation, thème, notifications
- **Sidebar** : Menu latéral conditionnel par rôle
- **ThemeToggle** : Bascule mode sombre/clair
- **NotificationBell** : Badge et dropdown des notifications

## 10.2 Composants tâches

- **KanbanBoard** : Conteneur DnD avec @dnd-kit
- **KanbanColumn** : Colonne (TODO, IN_PROGRESS, COMPLETED)
- **TaskCard** : Carte de tâche draggable
- **TaskForm** : Formulaire création/édition
- **TaskFilters** : Filtres et recherche

## 10.3 Composants UI

- Button, Input, Select, Textarea
- Badge, Modal, Toast
- SearchableSelect (sélection avec recherche)

## 10.4 Composants métier

- **CalendarView** : Intégration react-big-calendar
- **ReportGenerator** : Interface de génération PDF
- **NotificationsList** : Liste des notifications
- **UserManagement** : Table et modales CRUD utilisateurs
- **CategoryManagement** : CRUD catégories
- **ClasseManagement** : CRUD classes

---

# 11. INTERFACE UTILISATEUR ET THÈMES

## 11.1 Système de thèmes

- **Mode sombre** : Par défaut (fond #111827)
- **Mode clair** : Fond gradient bleu clair
- **Persistance** : localStorage (`theme`)
- **Application** : `data-theme="light"` ou classe `.light` sur `<html>`

## 11.2 Tailwind et variante custom

Tailwind v4 utilise `@custom-variant light` dans globals.css pour les classes `light:` qui s'appliquent quand le thème clair est actif.

## 11.3 Responsive design

- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar repliable sur mobile
- Tableaux avec scroll horizontal
- Formulaires en colonne sur mobile

## 11.4 Accessibilité

- Labels sur les formulaires
- aria-label sur les boutons d'action
- Contraste respecté (texte sur fond)

---

# 12. SYSTÈME DE NOTIFICATIONS

## 12.1 Types de notifications

- Échéances proches (24h avant)
- Tâches en retard
- Tâches assignées
- Résumé hebdomadaire

## 12.2 Cron job

Route `/api/cron/notifications` appelée toutes les 6 heures (vercel.json). Envoie les notifications selon les règles définies dans `lib/notifications.ts`.

## 12.3 Stockage

Les notifications sont stockées dans la table `Notification` avec userId, title, message, read, type, createdAt.

---

# 13. EXPORT ET RAPPORTS PDF

## 13.1 Bibliothèque

jspdf + jspdf-autotable pour générer des PDF côté client.

## 13.2 Contenu du rapport

- En-tête : utilisateur, rôle, date
- Statistiques : total, par statut, taux de complétion
- Tableau des tâches : titre, statut, priorité, catégorie, échéance, assigné

## 13.3 Filtres

Période optionnelle (date début, date fin) pour limiter les tâches incluses.

---

# 14. INSTALLATION ET CONFIGURATION

## 14.1 Prérequis

- Node.js 20+
- npm ou yarn
- Compte PostgreSQL (pour production)

## 14.2 Étapes d'installation

```bash
# 1. Cloner / accéder au projet
cd my-task

# 2. Installer les dépendances
npm install

# 3. Configurer .env
# DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 4. Générer le client Prisma
npx prisma generate

# 5. Migrer la base
npx prisma migrate dev --name init

# 6. Peupler (données de test)
npx prisma db seed

# 7. Lancer le serveur
npm run dev
```

## 14.3 Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| DATABASE_URL | URL de connexion DB | `postgresql://...` |
| DIRECT_URL | URL directe (Neon) | `postgresql://...` |
| NEXTAUTH_SECRET | Clé secrète JWT | `openssl rand -base64 32` |
| NEXTAUTH_URL | URL de l'app | `http://localhost:3000` |

## 14.4 Comptes de test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@example.com | admin123 |
| Enseignant | teacher@example.com | teacher123 |
| Étudiant | student1@example.com | student123 |

---

# 15. DÉPLOIEMENT EN PRODUCTION

## 15.1 Plateforme recommandée

**Vercel** : Intégration native Next.js, variables d'environnement, Cron jobs.

## 15.2 Base de données

- Vercel Postgres, Supabase ou Neon.tech
- Utiliser le schéma `schema-postgresql.prisma` (provider postgresql)

## 15.3 Étapes Vercel

1. Connecter le dépôt Git
2. Configurer les variables d'environnement
3. Déployer (build automatique)
4. Exécuter `prisma migrate deploy` et `prisma db seed` si nécessaire

## 15.4 Cron jobs

Configurés dans vercel.json pour appeler `/api/cron/notifications` selon une schedule (ex : toutes les 6 heures).

---

# 16. SÉCURITÉ ET BONNES PRATIQUES

## 16.1 Mesures de sécurité

- Mots de passe hashés (bcrypt)
- Validation des entrées (Zod)
- Protection contre l'injection SQL (Prisma)
- Authentification requise pour les routes sensibles
- Permissions basées sur les rôles

## 16.2 Recommandations

- Changer NEXTAUTH_SECRET en production
- Utiliser HTTPS
- Limiter les tentatives de connexion (à implémenter si nécessaire)
- Auditer régulièrement les dépendances (npm audit)

---

# 17. GUIDE DE MAINTENANCE

## 17.1 Mises à jour

```bash
npm update          # Mises à jour mineures
npm outdated        # Voir les paquets obsolètes
npm audit fix       # Corriger les vulnérabilités
```

## 17.2 Migrations Prisma

```bash
npx prisma migrate dev --name <nom>   # Créer une migration
npx prisma migrate deploy             # Appliquer en production
npx prisma migrate status             # État des migrations
```

## 17.3 Logs et débogage

- Consulter les logs Vercel pour les erreurs production
- Utiliser `console.log` ou un logger en développement
- Prisma Studio pour inspecter la base : `npx prisma studio`

---

# 18. TROUBLESHOOTING ET FAQ

## 18.1 Erreur Prisma "Unknown env config"

```bash
npx prisma generate
```

## 18.2 Erreur d'authentification

Vérifier NEXTAUTH_SECRET et NEXTAUTH_URL. Régénérer le secret si besoin.

## 18.3 Erreur de build Vercel

- Vérifier que les variables d'environnement sont définies
- S'assurer que `prisma generate` est dans le script postinstall
- Vérifier la compatibilité Node.js (20+)

## 18.4 Le mode sombre/clair ne s'applique pas

Vérifier que le ThemeProvider enveloppe l'application et que la variante `light:` est correctement définie dans globals.css.

## 18.5 Les polices ne se chargent pas

Erreurs de connexion aux fonts Google en build : souvent dû au sandbox. En production, cela fonctionne généralement.

---

## ANNEXES

### A. Scripts npm

| Script | Commande | Description |
|--------|----------|-------------|
| dev | npm run dev | Serveur de développement |
| build | npm run build | Build production |
| start | npm start | Démarrer en production |
| prisma:migrate | npm run prisma:migrate | Créer une migration |
| prisma:studio | npm run prisma:studio | Interface DB |
| prisma:seed | npm run prisma:seed | Peupler la DB |

### B. Ressources et documentation

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)

### C. Contact et licence

- Licence : MIT
- Projet créé à des fins d'apprentissage

---

*Fin de la documentation - Document généré pour le projet My-Task*
