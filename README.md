# QcLang 🍁

[![npm version](https://badge.fury.io/js/qc-lang.svg)](https://www.npmjs.com/package/qc-lang)
[![GitHub](https://img.shields.io/github/license/fragmatyc/qc-lang)](https://github.com/fragmatyc/qc-lang)

**Le langage de programmation québécois!**

QcLang est un langage transpilé vers JavaScript avec une syntaxe inspirée du français québécois.

## Installation

```bash
# Installer globalement depuis npm
npm install -g qc-lang
```

## Utilisation rapide

```bash
# Créer un nouveau projet
mkdir mon-projet && cd mon-projet
roule init

# Exécuter le projet
roule app.qc

# Exécuter un script
roule Clean kyadans app.qc

# Ajouter une dépendance
mets express dans l'app
```

## Syntaxe

```qclang
// Déclaration de variable
Faik'nom C't'un Tex = "Jean-Guy"
Faik'age C't'un Chif = 42
Faik'actif C't'une Boule = ouin

// Fonction
Faik'saluer C't'une Fonction
    Fotuïpawce nom, C't'un Tex,
Piafait
    Log("Bonjour " + nom + "!")
    Artourne ouin

// Classe
Patente Publique MaClasse
    Faik'propriete C't'un Tex
    
    Faik'methode C't'une Fonction
    Piafait
        Log("Hello!")

Rends MaClasse DispoPartout
```

## Types

| Type | Description |
|------|-------------|
| `Chif` | Nombre |
| `Tex` | Chaîne de caractères |
| `Boule` | Booléen (`ouin` / `tétumalade`) |
| `Objet` | Objet générique |
| `TabloD'X` | Tableau typé |

## Structure d'un projet

```
mon-projet/
├── app.qc          # Configuration du projet
└── src/
    └── index.qc    # Point d'entrée
```

### app.qc

```qclang
Patente Publique MonApp
    Faik'Nom C't'un Tex = "mon-app"
    Faik'Version C't'un Tex = "1.0.0"
    Faik'Entrée C't'un Tex = "src/index.qc"

    Faik'Dependances C't'un TabloD'Dependance
        BzoinD'express v4.18.2

    Faik'Scripts C't'un TabloD'Script
        Faik'Clean C't'une Fonction
        Piafait
            SupprimeDossier dist
```

## CLI

| Commande | Description |
|----------|-------------|
| `roule init` | Crée un nouveau projet |
| `roule app.qc` | Transpile et exécute |
| `roule app.qc --no-run` | Transpile seulement |
| `roule Clean kyadans app.qc` | Exécute un script |
| `mets express dans l'app` | Ajoute une dépendance |

## Extension VS Code / Antigravity

L'extension offre:
- ✅ **Coloration syntaxique** pour tous les mots-clés
- ✅ **Autocomplétion** intelligente
- ✅ **Snippets** (`faik`, `fonction`, `patente`, `app`, etc.)
- ✅ **Validation syntaxique** en temps réel
- ✅ **Documentation hover** sur les mots-clés

### Installation manuelle

```bash
# Pour Antigravity
cp -r qclang-syntax ~/.antigravity/extensions/qclang-1.1.0

# Pour VS Code
cp -r qclang-syntax ~/.vscode/extensions/qclang-1.1.0
```

## Documentation

Voir [documentation/qclang-reference.md](documentation/qclang-reference.md) pour la référence complète.

## Structure du dépôt

```
qc-lang/
├── bin/                 # CLI entry points
├── lib/                 # Core library
├── examples/            # Projets exemples
│   └── todo-api/        # API Todo en QcLang
├── qclang-syntax/       # Extension VS Code
├── documentation/       # Documentation technique
└── README.md
```

## Licence

ISC © sylvain.cloutier@ezoqc.com

---

**GitHub**: [github.com/fragmatyc/qc-lang](https://github.com/fragmatyc/qc-lang)  
**npm**: [npmjs.com/package/qc-lang](https://www.npmjs.com/package/qc-lang)
