---
description: Créer une nouvelle branche Git en respectant la nomenclature standard
---

# Création de branche Git

## Nomenclature des branches

Utilise le format suivant : `<type>/<description-courte>`

### Types disponibles

| Type | Utilisation |
|------|-------------|
| `feature/` | Nouvelle fonctionnalité |
| `bugfix/` | Correction de bug |
| `hotfix/` | Correction urgente en production |
| `chore/` | Tâches de maintenance (refactoring, dépendances, etc.) |
| `docs/` | Modifications de documentation uniquement |
| `test/` | Ajout ou modification de tests |
| `refactor/` | Refactoring de code sans changement fonctionnel |

### Règles de nommage

- Utiliser le **kebab-case** (mots séparés par des tirets)
- Garder la description **courte et descriptive** (3-5 mots max)
- Utiliser l'**anglais** pour les noms de branches
- Pas d'espaces, accents ou caractères spéciaux

### Exemples

```
feature/add-async-support
bugfix/fix-parser-error
chore/update-dependencies
docs/update-readme
refactor/simplify-transpiler
```

## Étapes de création

1. S'assurer d'être sur la branche principale (main/master)
// turbo
2. Récupérer les dernières modifications : `git pull origin main`
// turbo
3. Créer et basculer sur la nouvelle branche : `git checkout -b <type>/<description>`

## Auteur des commits

- **Nom** : Sylvain Cloutier
- **Email** : sylvain.cloutier@ezoqc.com

## Convention de commits

Utiliser les commits conventionnels :

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

Types de commits : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
