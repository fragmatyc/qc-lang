# Prompt de Changements

## Description des modifications

```
[Votre description détaillée ici]
```

---

## Avant de commencer

- [ ] Créer une nouvelle branche fraîche depuis `master` en utilisant `/creer-branche`
- [ ] S'assurer que la branche `master` est à jour avant de créer la nouvelle branche

---

## Checklist de validation

Après avoir effectué les modifications demandées, assure-toi de compléter les étapes suivantes :

### 1. ✅ Tests de non-régression
- [ ] Exécuter tous les projets d'exemple dans le dossier `examples/`
- [ ] Vérifier que chaque exemple compile correctement
- [ ] Vérifier que chaque exemple s'exécute sans erreur

### 2. 📚 Mise à jour de la documentation
- [ ] Mettre à jour le `README.md` si nécessaire
- [ ] Mettre à jour la documentation dans `documentation/` si nécessaire
- [ ] Documenter les nouvelles fonctionnalités ou changements d'API

### 3. 📦 Version du package
- [ ] Incrémenter la version dans `package.json` selon le type de changement :
  - **MAJOR** : Changements incompatibles avec les versions précédentes
  - **MINOR** : Nouvelles fonctionnalités rétrocompatibles
  - **PATCH** : Corrections de bugs rétrocompatibles

### 4. 🔌 Plugin VSCode
- [ ] Vérifier que le plugin VSCode (`qclang-syntax/`) est à jour avec les nouveaux changements
- [ ] Mettre à jour la syntaxe si de nouveaux mots-clés ou constructs ont été ajoutés
- [ ] Mettre à jour la version du plugin si nécessaire

### 5. 🧹 Nettoyage
- [ ] Supprimer tous les fichiers temporaires ou de debug
- [ ] Supprimer les fichiers non utilisés ou obsolètes
- [ ] Vérifier qu'aucun fichier `.bak`, `.tmp`, ou similaire ne traîne

---

## Notes additionnelles

```
[Notes optionnelles]
```
