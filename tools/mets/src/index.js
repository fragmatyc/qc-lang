#!/usr/bin/env node
/**
 * mets - QcLang Package Manager
 * Usage: mets <package> dans l'app
 *        mets <package> v<version> dans l'app
 * 
 * Ajoute une dépendance dans le fichier app.qc
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function printHelp() {
    console.log(`
🍁 mets v1.0.0 - QcLang Package Manager

Usage: mets <package> [version] dans l'app

Ajoute une dépendance dans le fichier app.qc du projet courant.

Exemples:
  mets express dans l'app              Ajoute express (latest)
  mets express v4.18.2 dans l'app      Ajoute express v4.18.2
  mets lodash dans l'app               Ajoute lodash

Options:
  --help, -h           Afficher cette aide
  --dev                Ajouter comme dépendance de développement
`);
}

function findAppQc(startDir = process.cwd()) {
    let currentDir = startDir;

    while (currentDir !== dirname(currentDir)) {
        const appQcPath = join(currentDir, 'app.qc');
        if (existsSync(appQcPath)) {
            return appQcPath;
        }
        currentDir = dirname(currentDir);
    }

    return null;
}

function addDependency(appQcPath, packageName, version, isDev = false) {
    let content = readFileSync(appQcPath, 'utf-8');
    const lines = content.split('\n');

    // Build the new dependency line
    const depLine = version
        ? `        BzoinD'${packageName} v${version.replace('v', '')}`
        : `        BzoinD'${packageName}`;

    // Find the right section to add to
    const sectionName = isDev ? "Faik'DependancesDev" : "Faik'Dependances";
    let sectionIndex = -1;
    let lastDepIndex = -1;
    let inSection = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes(sectionName)) {
            sectionIndex = i;
            inSection = true;
            continue;
        }

        // Check if we've moved to a different section
        if (inSection && (line.includes("Faik'") && !line.includes("BzoinD'"))) {
            break;
        }

        // Track the last dependency in the section
        if (inSection && line.includes("BzoinD'")) {
            lastDepIndex = i;

            // Check if this package already exists
            if (line.includes(`BzoinD'${packageName}`)) {
                // Update existing dependency
                lines[i] = depLine;
                writeFileSync(appQcPath, lines.join('\n'), 'utf-8');
                return { updated: true, action: 'updated' };
            }
        }
    }

    // If section exists, add after last dependency
    if (sectionIndex !== -1) {
        const insertIndex = lastDepIndex !== -1 ? lastDepIndex + 1 : sectionIndex + 1;
        lines.splice(insertIndex, 0, depLine);
    } else {
        // Need to create the section
        // Find the end of the Patente block (before any other Patente or end of file)
        let insertIndex = lines.length;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() !== '') {
                insertIndex = i + 1;
                break;
            }
        }

        const sectionHeader = isDev
            ? "\n    Faik'DependancesDev C't'un TabloD'Dependance"
            : "\n    Faik'Dependances C't'un TabloD'Dependance";

        lines.splice(insertIndex, 0, sectionHeader);
        lines.splice(insertIndex + 1, 0, depLine);
    }

    writeFileSync(appQcPath, lines.join('\n'), 'utf-8');
    return { updated: true, action: 'added' };
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        printHelp();
        process.exit(0);
    }

    // Parse: mets <package> [v<version>] dans l'app [--dev]
    let packageName = null;
    let version = null;
    let isDev = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--dev') {
            isDev = true;
        } else if (arg === 'dans' || arg === "l'app") {
            // Skip these keywords
            continue;
        } else if (arg.startsWith('v') && /^v?\d/.test(arg)) {
            version = arg;
        } else if (!packageName && !arg.startsWith('-')) {
            packageName = arg;
        }
    }

    if (!packageName) {
        console.error("❌ Nom du package manquant!");
        console.error("Usage: mets <package> dans l'app");
        process.exit(1);
    }

    // Find app.qc
    const appQcPath = findAppQc();

    if (!appQcPath) {
        console.error("❌ Fichier app.qc non trouvé!");
        console.error("   Assurez-vous d'être dans un projet QcLang.");
        process.exit(1);
    }

    console.log(`🍁 mets v1.0.0\n`);
    console.log(`📦 Ajout de ${packageName}${version ? ` ${version}` : ''} dans app.qc...`);

    try {
        const result = addDependency(appQcPath, packageName, version, isDev);

        if (result.action === 'updated') {
            console.log(`✅ ${packageName} mis à jour dans app.qc`);
        } else {
            console.log(`✅ ${packageName} ajouté à app.qc`);
        }

        console.log(`\n💡 Pour installer, exécute: roule app.qc`);
    } catch (error) {
        console.error(`❌ Erreur: ${error.message}`);
        process.exit(1);
    }
}

main();
