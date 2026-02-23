# Comment générer le PDF de la documentation

Le fichier **DOCUMENTATION_PROJET.md** contient la documentation complète du projet (~50 pages équivalent). Voici comment le convertir en PDF.

## Méthode 1 : Extension VS Code (recommandé)

1. Installer l'extension **"Markdown PDF"** dans VS Code/Cursor
2. Ouvrir `DOCUMENTATION_PROJET.md`
3. Clic droit → **"Markdown PDF: Export (pdf)"**
4. Le fichier `DOCUMENTATION_PROJET.pdf` sera créé au même emplacement

## Méthode 2 : Outil en ligne de commande (md-to-pdf)

```bash
# Installer md-to-pdf globalement
npm install -g md-to-pdf

# Générer le PDF
md-to-pdf DOCUMENTATION_PROJET.md
```

Le fichier `DOCUMENTATION_PROJET.pdf` sera créé dans le dossier du projet.

## Méthode 3 : Pandoc (si installé)

```bash
pandoc DOCUMENTATION_PROJET.md -o DOCUMENTATION_PROJET.pdf --pdf-engine=xelatex
```

## Méthode 4 : Navigateur web

1. Ouvrir un convertisseur en ligne (ex : https://www.markdowntopdf.com/)
2. Coller le contenu du fichier DOCUMENTATION_PROJET.md
3. Télécharger le PDF généré

## Méthode 5 : Impression depuis un viewer Markdown

1. Ouvrir `DOCUMENTATION_PROJET.md` dans un viewer Markdown (VS Code preview, Obsidian, etc.)
2. Utiliser Ctrl+P (ou Cmd+P sur Mac) pour imprimer
3. Choisir "Enregistrer au format PDF" comme destination
