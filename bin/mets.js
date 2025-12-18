#!/usr/bin/env node
/**
 * mets - QcLang Package Manager
 * Usage: mets <package> dans l'app
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';

function printHelp() {
    console.log(`
🍁 mets v1.0.0 - QcLang Package Manager

Usage: mets <package> [version] dans l'app

Exemples:
  mets express dans l'app              # Ajoute express (latest)
  mets lodash v4.17.21 dans l'app      # Ajoute lodash v4.17.21

Options:
  --help, -h    Afficher cette aide
  --dev         Dépendance de développement
`);
}

function findAppQc(startDir = process.cwd()) {
    let dir = startDir;
    while (dir !== dirname(dir)) {
        const appQc = join(dir, 'app.qc');
        if (existsSync(appQc)) return appQc;
        dir = dirname(dir);
    }
    return null;
}

function addDependency(appQcPath, packageName, version, isDev = false) {
    let content = readFileSync(appQcPath, 'utf-8');
    const lines = content.split('\n');
    const depLine = version
        ? `        BzoinD'${packageName} v${version.replace('v', '')}`
        : `        BzoinD'${packageName}`;

    const sectionName = isDev ? "Faik'DependancesDev" : "Faik'Dependances";
    let sectionIndex = -1, lastDepIndex = -1, inSection = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes(sectionName)) { sectionIndex = i; inSection = true; continue; }
        if (inSection && line.includes("Faik'") && !line.includes("BzoinD'")) break;
        if (inSection && line.includes("BzoinD'")) {
            lastDepIndex = i;
            if (line.includes(`BzoinD'${packageName}`)) {
                lines[i] = depLine;
                writeFileSync(appQcPath, lines.join('\n'), 'utf-8');
                return 'updated';
            }
        }
    }

    if (sectionIndex !== -1) {
        lines.splice(lastDepIndex !== -1 ? lastDepIndex + 1 : sectionIndex + 1, 0, depLine);
    } else {
        let insertIndex = lines.length;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() !== '') { insertIndex = i + 1; break; }
        }
        lines.splice(insertIndex, 0, isDev
            ? `\n    Faik'DependancesDev C't'un TabloD'Dependance`
            : `\n    Faik'Dependances C't'un TabloD'Dependance`);
        lines.splice(insertIndex + 1, 0, depLine);
    }

    writeFileSync(appQcPath, lines.join('\n'), 'utf-8');
    return 'added';
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        printHelp();
        process.exit(0);
    }

    let packageName = null, version = null, isDev = false;
    for (const arg of args) {
        if (arg === '--dev') isDev = true;
        else if (arg === 'dans' || arg === "l'app") continue;
        else if (/^v?\d/.test(arg)) version = arg;
        else if (!packageName && !arg.startsWith('-')) packageName = arg;
    }

    if (!packageName) { console.error("❌ Nom du package manquant!"); process.exit(1); }

    const appQcPath = findAppQc();
    if (!appQcPath) { console.error("❌ Fichier app.qc non trouvé!"); process.exit(1); }

    console.log(`🍁 mets v1.0.0\n`);
    console.log(`📦 Ajout de ${packageName}${version ? ` ${version}` : ''}...`);

    const result = addDependency(appQcPath, packageName, version, isDev);
    console.log(`✅ ${packageName} ${result === 'updated' ? 'mis à jour' : 'ajouté'} dans app.qc`);
    console.log(`\n💡 Pour installer: roule app.qc`);
}

main();
