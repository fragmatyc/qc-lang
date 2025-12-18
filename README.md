# QcLang 🍁

[![npm version](https://badge.fury.io/js/qc-lang.svg)](https://www.npmjs.com/package/qc-lang)
[![GitHub](https://img.shields.io/github/license/fragmatyc/qc-lang)](https://github.com/fragmatyc/qc-lang)

**Le langage de programmation québécois!**

QcLang est un langage transpilé vers JavaScript avec une syntaxe inspirée du français québécois.

## Installation

```bash
npm install -g qc-lang
```

## Démarrage rapide

```bash
# Créer un nouveau projet
mkdir mon-projet && cd mon-projet
roule init

# Exécuter le projet
roule app.qc
```

## Syntaxe

```qclang
// Variables
Faik'nom C't'un Tex = "Jean-Guy"
Faik'age C't'un Chif = 42
Faik'actif C't'une Boule = ouin

// Fonction
Faik'saluer C't'une Fonction
    Fotuïpawce nom, C't'un Tex,
Piafait
    Log("Bonjour " + nom)

// Appels de méthode
Call methode Su objet PisPawceZy arg1, arg2
```

## Types

| Type | Description |
|------|-------------|
| `Chif` | Nombre |
| `Tex` | Chaîne de caractères |
| `Boule` | Booléen (`ouin` / `tétumalade`) |
| `Objet` | Objet générique |
| `Tablo` | Tableau |

## Commandes CLI

| Commande | Description |
|----------|-------------|
| `roule init` | Crée un nouveau projet |
| `roule app.qc` | Transpile et exécute |
| `roule app.qc --no-run` | Transpile seulement |
| `roule Clean kyadans app.qc` | Exécute un script |
| `mets express dans l'app` | Ajoute une dépendance |

## Exemple Todo API

```qclang
// index.qc
Prend express De "express"

Faik'app C't'un Express = Call express
Faik'todos C't'un Tablo = []

Faik'getTodos C't'une Fonction
    Fotuïpawce req, C't'un Request,
    Fotuïpawce res, C't'un Response,
Piafait
    Call json Su res PisPawceZy todos

Call get Su app PisPawceZy "/todos", getTodos

Faik'PORT C't'un Chif = 3000
Call listen Su app PisPawceZy PORT
```

## Documentation

Voir [documentation/qclang-reference.md](documentation/qclang-reference.md)

## Extension VS Code

L'extension `qclang-syntax` offre:
- ✅ Coloration syntaxique
- ✅ Autocomplétion
- ✅ Snippets
- ✅ Validation syntaxique

## Licence

ISC © sylvain.cloutier@ezoqc.com

---

**GitHub**: [github.com/fragmatyc/qc-lang](https://github.com/fragmatyc/qc-lang)  
**npm**: [npmjs.com/package/qc-lang](https://www.npmjs.com/package/qc-lang)
