# QcLang - Documentation Technique

**Version 1.2.0** | Le langage de programmation québécois 🍁

---

## Table des matières

1. [Introduction](#introduction)
2. [Types de données](#types-de-données)
3. [Variables](#variables)
4. [Fonctions](#fonctions)
5. [Classes (Patentes)](#classes-patentes)
6. [Structures de contrôle](#structures-de-contrôle)
7. [Boucles](#boucles)
8. [Opérateurs](#opérateurs)
9. [Imports et Exports](#imports-et-exports)
10. [Gestion de packages](#gestion-de-packages)
11. [CLI Tools](#cli-tools)

---

## Introduction

QcLang est un langage de programmation transpilé vers JavaScript avec une syntaxe inspirée du français québécois. Il est conçu pour être expressif, amusant et fonctionnel.

```qclang
// Mon premier programme QcLang
Faik'message C't'un Tex = "Bonjour le monde!"
Log(message)
```

---

## Types de données

| Type QcLang | JavaScript | Description |
|-------------|------------|-------------|
| `Chif` | `number` | Nombre entier ou décimal |
| `Tex` | `string` | Chaîne de caractères |
| `Boule` | `boolean` | Valeur booléenne |
| `Date` | `Date` | Date et heure |
| `Objet` | `object` | Objet générique |
| `Tablo` | `Array` | Tableau simple |
| `TabloD'X` | `Array<X>` | Tableau typé |

### Littéraux spéciaux

| QcLang | JavaScript | Description |
|--------|------------|-------------|
| `ouin` | `true` | Vrai |
| `tétumalade` | `false` | Faux |
| `ardjien` | `null` | Null |

---

## Variables

### Déclaration

```qclang
// Syntaxe: Faik'nomVariable C't'un Type = valeur
Faik'age C't'un Chif = 25
Faik'nom C't'un Tex = "Jean-Guy"
Faik'actif C't'une Boule = ouin
Faik'scores C't'un TabloD'Chif = [10, 20, 30]
```

### Notation
- `C't'un` - C'est un (masculin)
- `C't'une` - C'est une (féminin)

---

## Fonctions

### Déclaration simple

```qclang
Faik'direBonjour C't'une Fonction
Piafait
    Log("Bonjour!")
```

### Avec paramètres

```qclang
Faik'saluer C't'une Fonction
    Fotuïpawce nom, C't'un Tex,
Piafait
    Log("Bonjour " + nom + "!")
```

### Avec type de retour

```qclang
Faik'additionner C't'une Fonction Qyartourne un Chif
    Fotuïpawce a, C't'un Chif,
    Fotuïpawce b, C't'un Chif,
Piafait
    Artourne a + b
```

### Mots-clés

| Mot-clé | Description |
|---------|-------------|
| `Fonction` | Déclare une fonction |
| `Fotuïpawce` | Paramètre de fonction |
| `Qyartourne un/une` | Type de retour |
| `Piafait` | Début du corps de fonction |
| `Artourne` | Return |

---

## Classes (Patentes)

### Déclaration

```qclang
Patente Publique Personne
    Faik'nom C't'un Tex
    Faik'age C't'un Chif
    
    Faik'init C't'une Fonction
        Fotuïpawce nomParam, C't'un Tex,
        Fotuïpawce ageParam, C't'un Chif,
    Piafait
        nom = nomParam
        age = ageParam
    
    Faik'sePresenter C't'une Fonction
    Piafait
        Log("Je suis " + nom + ", j'ai " + age + " ans")

Rends Personne DispoPartout
```

### Instanciation

```qclang
Crée Personne PisSacreLéDans maPersonne
Call init Su maPersonne PisPawceZy "Jean", 30
```

### Appel de méthode

```qclang
// Syntaxe: Call méthode Su objet PisPawceZy arguments
Call sePresenter Su maPersonne
Call getTous Su repository PisPawceZy id, donnees
```

---

## Structures de contrôle

### Condition if/else

```qclang
Si age >= 18
    Log("Majeur")
PisSi age >= 13
    Log("Adolescent")
OuSinon
    Log("Enfant")
```

| Mot-clé | JavaScript |
|---------|------------|
| `Si` | `if` |
| `PisSi` | `else if` |
| `OuSinon` | `else` |

---

## Boucles

### While (Tank')

```qclang
Faik'i C't'un Chif = 0
Tank'i < 10
    Log(i)
    i++
```

### For-each (LoopSu')

```qclang
Faik'fruits C't'un TabloD'Tex = ["pomme", "banane", "orange"]
LoopSu'fruits Dans fruit Piafait
    Log(fruit)
```

| Mot-clé | Description |
|---------|-------------|
| `Tank'` | While + condition |
| `LoopSu'` | For-each sur array |
| `Dans` | Variable d'itération |
| `Arcommence` | Continue |

---

## Opérateurs

### Arithmétiques

| Opérateur | Description |
|-----------|-------------|
| `+` | Addition |
| `-` | Soustraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo |
| `++` | Incrément |
| `--` | Décrément |

### Comparaison

| Opérateur | Description |
|-----------|-------------|
| `==` | Égal |
| `!=` | Différent |
| `<` | Inférieur |
| `>` | Supérieur |
| `<=` | Inférieur ou égal |
| `>=` | Supérieur ou égal |

### Logiques

| Opérateur | Description |
|-----------|-------------|
| `&&` | ET |
| `\|\|` | OU |
| `!` | NON |

---

## Imports et Exports

### Import

```qclang
// Import d'un module
Prend express De "express"

// Import avec alias
Prend MonModule De "./monFichier.qc" PisSacreLéDans alias
```

### Export

```qclang
// Exporter une classe ou fonction
Rends MaClasse DispoPartout
```

---

## Gestion de packages

### Fichier app.qc

Le fichier `app.qc` remplace `package.json` et définit les métadonnées du projet:

```qclang
Patente Publique MonApplication
    Faik'Nom C't'un Tex = "mon-app"
    Faik'Version C't'un Tex = "1.0.0"
    Faik'Auteur C't'un Tex = "moi@exemple.com"
    Faik'Description C't'un Tex = "Ma super application"
    Faik'License C't'un Tex = "ISC"
    Faik'Entrée C't'un Tex = "src/index.qc"

    Faik'Dependances C't'un TabloD'Dependance
        BzoinD'express v4.18.2
        BzoinD'uuid v9.0.0

    Faik'DependancesDev C't'un TabloD'Dependance
        BzoinD'nodemon v2.0.22
```

---

## CLI Tools

### roule init - Créer un projet

```bash
# Dans un nouveau dossier
mkdir mon-projet && cd mon-projet
roule init
```

**Fichiers créés:**
- `app.qc` - Configuration du projet
- `src/index.qc` - Point d'entrée
- `.gitignore` - Fichiers à ignorer

---

### roule - Transpiler & Runner

```bash
# Transpile et exécute le projet
roule app.qc

# Transpile seulement (sans exécuter)
roule app.qc --no-run

# Exécute un script défini dans app.qc
roule Clean kyadans app.qc
```

**Étapes exécutées:**
1. Parse `app.qc` → génère `dist/package.json`
2. Transpile `src/*.qc` → `dist/*.js`
3. Exécute `npm install`
4. Exécute `node dist/<entry>.js`

### Scripts dans app.qc

Définir des scripts personnalisés:

```qclang
Faik'Scripts C't'un TabloD'Script
    Faik'Clean C't'une Fonction
    Piafait
        SupprimeDossier dist
    
    Faik'Build C't'une Fonction
    Piafait
        CreeDossier build
        Execute npm run build
```

**Commandes disponibles dans les scripts:**

| Commande | Description |
|----------|-------------|
| `SupprimeDossier <dir>` | Supprime un répertoire |
| `CreeDossier <dir>` | Crée un répertoire |
| `Execute <cmd>` | Exécute une commande shell |

### mets - Package Manager

```bash
# Ajouter une dépendance (version latest)
mets express dans l'app

# Ajouter une dépendance avec version
mets lodash v4.17.21 dans l'app

# Ajouter une dépendance de développement
mets nodemon dans l'app --dev
```

---

## Commentaires

```qclang
// Commentaire sur une ligne

/*
   Commentaire
   sur plusieurs
   lignes
*/
```

---

## Exemple complet

```qclang
// todo.qc - Modèle Todo
Patente Publique Todo
    Faik'id C't'un Tex
    Faik'titre C't'un Tex
    Faik'complete C't'une Boule = tétumalade

Rends Todo DispoPartout
```

```qclang
// index.qc - Point d'entrée
Prend express De "express"
Prend Todo De "./models/todo.qc"

Faik'app C't'un Express = Call express
Call use Su app PisPawceZy Call json Su express

Faik'PORT C't'un Chif = 3000
Call listen Su app PisPawceZy PORT
Log("Serveur démarré sur le port " + PORT)
```

---

## Ressources

- **Package npm**: `npm install -g qc-lang`
- **GitHub**: [github.com/fragmatyc/qc-lang](https://github.com/fragmatyc/qc-lang)
- **Extension VS Code**: `qclang-syntax/`

---

## Extension VS Code

L'extension QcLang offre:

| Fonctionnalité | Description |
|----------------|-------------|
| Coloration syntaxique | Tous les mots-clés colorés |
| Autocomplétion | Suggestions intelligentes |
| Snippets | `faik`, `fonction`, `patente`, `app` |
| Validation | Erreurs affichées en temps réel |
| Hover | Documentation sur les mots-clés |

### Snippets disponibles

| Préfixe | Description |
|---------|-------------|
| `faik` | Déclaration de variable |
| `fonction` | Fonction simple |
| `fonctionp` | Fonction avec paramètres |
| `patente` | Classe complète |
| `app` | Template app.qc |
| `si` | Condition if |
| `loop` | Boucle for-each |
| `call` | Appel de méthode |

---

*Documentation générée pour QcLang v1.1.0* 🍁
