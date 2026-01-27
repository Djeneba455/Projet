# 🚨 FIX VERCEL - PROBLÈME DE BASE DE DONNÉES

## LE PROBLÈME
Vercel utilise encore l'ancien schema.prisma avec SQLite au lieu de PostgreSQL.

## SOLUTION EN 3 ÉTAPES

### ÉTAPE 1 : Configurer les Variables d'Environnement ⚙️

1. Allez sur : https://vercel.com/dashboard
2. Cliquez sur votre projet : **taskmanager-sigma-dusky**
3. Allez dans : **Settings** → **Environment Variables**
4. **Supprimez TOUTES les anciennes variables** (s'il y en a)
5. **Ajoutez ces 4 nouvelles variables** :

#### Variable 1 : DATABASE_URL
```
postgresql://neondb_owner:npg_uXBhr7l9HteR@ep-restless-union-ah58noc9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```
- ✅ Cochez : **Production**
- ✅ Cochez : **Preview**
- ✅ Cochez : **Development**

#### Variable 2 : DIRECT_URL
```
postgresql://neondb_owner:npg_uXBhr7l9HteR@ep-restless-union-ah58noc9.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```
- ✅ Cochez : **Production**
- ✅ Cochez : **Preview**
- ✅ Cochez : **Development**

#### Variable 3 : NEXTAUTH_SECRET
```
XQSmDDNBlYo+O2pXSSPelvNQaL6LX/7VrhulN3BWFUI=
```
- ✅ Cochez : **Production**
- ✅ Cochez : **Preview**
- ✅ Cochez : **Development**

#### Variable 4 : NEXTAUTH_URL
**Pour Production :**
```
https://taskmanager-sigma-dusky.vercel.app
```
- ✅ Cochez SEULEMENT : **Production**

**IMPORTANT** : Cliquez sur **Save** après chaque variable !

---

### ÉTAPE 2 : Forcer un Redéploiement 🔄

Après avoir ajouté les variables :

1. Allez dans : **Deployments** (onglet en haut)
2. Trouvez le dernier déploiement (celui en haut de la liste)
3. Cliquez sur les **3 petits points** à droite
4. Cliquez sur **Redeploy**
5. ⚠️ **IMPORTANT** : Cochez la case **"Use existing build cache"** → **DÉCOCHEZ-LA** pour forcer une reconstruction complète
6. Cliquez sur **Redeploy**

---

### ÉTAPE 3 : Vérifier le Build 🔍

1. Attendez que le build se termine (2-3 minutes)
2. Regardez les logs pendant le build :
   - Cherchez : `✓ Compiled successfully`
   - Vérifiez qu'il n'y a pas d'erreur `prisma` ou `sqlite`

3. Une fois le déploiement terminé (icône verte ✓) :
   - Cliquez sur **Visit** ou allez sur : https://taskmanager-sigma-dusky.vercel.app
   - Essayez de vous connecter :
     - **Email** : `admin@test.com`
     - **Password** : `admin123`

---

## ✅ CHECKLIST

- [ ] Toutes les 4 variables ajoutées sur Vercel
- [ ] Redéploiement lancé SANS cache
- [ ] Build terminé avec succès (vert ✓)
- [ ] Connexion réussie sur l'app

---

## 🆘 SI ÇA NE FONCTIONNE TOUJOURS PAS

Copiez-moi :
1. Les **logs de build** complets (depuis le Dashboard Vercel → Deployments → votre déploiement → Build Logs)
2. Les **logs de fonction** (Function Logs) quand vous essayez de vous connecter

Je pourrai alors voir exactement où est le problème !
