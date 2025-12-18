# QcLang 🍁

[![npm version](https://badge.fury.io/js/qc-lang.svg)](https://www.npmjs.com/package/qc-lang)
[![GitHub](https://img.shields.io/github/license/fragmatyc/qc-lang)](https://github.com/fragmatyc/qc-lang)

**Le langage de programmation québécois!**

QcLang est un langage transpilé vers JavaScript avec une syntaxe inspirée du français québécois.

## Installation

```bash
# Installer globalement depuis npm
npm install -g qc-lang

# OU cloner le dépôt
git clone https://github.com/fragmatyc/qc-lang.git
cd qc-lang && npm link
```

## Utilisation rapide

```bash
# Créer et exécuter un projet
cd examples/todo-api
roule app.qc

# Exécuter un script
roule Clean kyadans app.qc

# Ajouter une dépendance
mets lodash dans l'app
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
| `roule app.qc` | Transpile et exécute |
| `roule app.qc --no-run` | Transpile seulement |
| `roule Clean kyadans app.qc` | Exécute un script |
| `mets express dans l'app` | Ajoute une dépendance |

## Extension VS Code

L'extension de coloration syntaxique est dans `qclang-syntax/`.

Installer manuellement:
```bash
cp -r qclang-syntax ~/.antigravity/extensions/qclang-1.0.0
# ou pour VS Code:
cp -r qclang-syntax ~/.vscode/extensions/qclang-1.0.0
```

## Documentation

Voir [documentation/qclang-reference.md](documentation/qclang-reference.md) pour la référence complète.

## Licence

ISC © sylvain.cloutier@ezoqc.com
