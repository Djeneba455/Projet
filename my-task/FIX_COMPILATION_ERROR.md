# Fix: Erreur ECONNRESET lors de la compilation

## Problème
L'erreur `ECONNRESET` se produit généralement lorsque :
1. Prisma essaie de télécharger des binaires pendant que le serveur de développement est en cours d'exécution
2. Des fichiers Prisma sont verrouillés par un processus en cours d'exécution
3. Le cache Next.js est corrompu

## Solution

### Étape 1 : Arrêter le serveur de développement
Si le serveur Next.js est en cours d'exécution, arrêtez-le avec `Ctrl+C` dans le terminal.

### Étape 2 : Nettoyer les caches
Exécutez ces commandes dans PowerShell :

```powershell
cd "C:\Users\LENOVO\Desktop\Projet\my-task"

# Supprimer le cache Next.js
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Supprimer le cache Prisma
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
```

### Étape 3 : Régénérer Prisma Client
```powershell
npx prisma generate
```

Si vous obtenez une erreur `EPERM`, attendez quelques secondes et réessayez. Cela signifie qu'un processus verrouille encore les fichiers.

### Étape 4 : Redémarrer le serveur de développement
```powershell
npm run dev
```

## Alternative : Utiliser --no-engine pour éviter les téléchargements

Si le problème persiste, vous pouvez modifier le script de build dans `package.json` pour utiliser `--no-engine` :

```json
"build": "prisma generate --no-engine && next build"
```

Cela empêchera Prisma de télécharger les binaires pendant le build.

## Vérification

Après avoir suivi ces étapes, la compilation devrait fonctionner sans erreur `ECONNRESET`.
