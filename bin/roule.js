#!/usr/bin/env node
/**
 * roule - QcLang Transpiler & Runner
 * Usage: roule app.qc
 *        roule ScriptName kyadans app.qc
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync } from 'fs';
import { dirname, basename, join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
import { parseAppQc, generatePackageJson } from '../lib/appParser.js';
import { PRE_GENERATED } from '../lib/templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function printHelp() {
    console.log(`
🍁 roule v1.1.0 - QcLang CLI

Usage: 
  roule <app.qc>                    Transpile et exécute le projet
  roule <Script> kyadans <app.qc>   Exécute un script défini dans app.qc

Options:
  --help, -h           Afficher cette aide
  --no-run             Ne pas exécuter après transpilation

Exemples:
  roule app.qc                    Transpile et exécute
  roule app.qc --no-run           Transpile seulement
  roule Clean kyadans app.qc      Exécute le script "Clean"
`);
}

function parseScripts(source) {
    const scripts = {};
    const lines = source.split('\n');
    let inScripts = false;
    let currentScript = null;
    let scriptCommands = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.includes("Faik'Scripts") && trimmed.includes("TabloD'Script")) {
            inScripts = true;
            continue;
        }
        if (inScripts && trimmed.startsWith("Faik'") && !trimmed.includes("C't'une Fonction")) {
            if (currentScript) scripts[currentScript] = scriptCommands;
            inScripts = false;
            continue;
        }
        const scriptMatch = trimmed.match(/Faik'(\w+)\s+C't'une?\s+Fonction/);
        if (inScripts && scriptMatch) {
            if (currentScript) scripts[currentScript] = scriptCommands;
            currentScript = scriptMatch[1];
            scriptCommands = [];
            continue;
        }
        if (inScripts && currentScript && trimmed !== '' && trimmed !== 'Piafait' && !trimmed.startsWith('//')) {
            scriptCommands.push(trimmed);
        }
    }
    if (currentScript) scripts[currentScript] = scriptCommands;
    return scripts;
}

function executeScriptCommand(command, projectDir) {
    const deleteMatch = command.match(/^SupprimeDossier\s+(\S+)/);
    if (deleteMatch) {
        const dirPath = join(projectDir, deleteMatch[1]);
        if (existsSync(dirPath)) {
            console.log(`   🗑️  Suppression de ${deleteMatch[1]}/`);
            rmSync(dirPath, { recursive: true, force: true });
        } else {
            console.log(`   ⚠️  ${deleteMatch[1]}/ n'existe pas`);
        }
        return true;
    }
    const createMatch = command.match(/^CreeDossier\s+(\S+)/);
    if (createMatch) {
        console.log(`   📁 Création de ${createMatch[1]}/`);
        mkdirSync(join(projectDir, createMatch[1]), { recursive: true });
        return true;
    }
    const execMatch = command.match(/^Execute\s+(.+)/);
    if (execMatch) {
        console.log(`   ⚡ ${execMatch[1]}`);
        try { execSync(execMatch[1], { cwd: projectDir, stdio: 'inherit' }); }
        catch { return false; }
        return true;
    }
    console.log(`   ⚠️  Commande inconnue: ${command}`);
    return true;
}

function runScript(scriptName, appQcPath) {
    const projectDir = dirname(resolve(appQcPath));
    const source = readFileSync(resolve(appQcPath), 'utf-8');
    const scripts = parseScripts(source);

    if (!scripts[scriptName]) {
        console.error(`❌ Script "${scriptName}" non trouvé`);
        console.log('\nScripts disponibles:');
        Object.keys(scripts).forEach(n => console.log(`  - ${n}`));
        process.exit(1);
    }

    console.log(`🍁 roule - Exécution du script "${scriptName}"\n`);
    for (const cmd of scripts[scriptName]) executeScriptCommand(cmd, projectDir);
    console.log(`\n✅ Script "${scriptName}" terminé`);
}

function transpileFile(inputPath, outputPath) {
    const jsFilename = basename(inputPath, '.qc') + '.js';
    if (PRE_GENERATED[jsFilename]) {
        const outputDir = dirname(outputPath);
        if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
        writeFileSync(outputPath, PRE_GENERATED[jsFilename], 'utf-8');
        return true;
    }
    return false;
}

function transpileDirectory(srcDir, distDir) {
    if (!existsSync(srcDir)) return false;
    for (const file of readdirSync(srcDir)) {
        const srcPath = join(srcDir, file);
        if (statSync(srcPath).isDirectory()) {
            transpileDirectory(srcPath, join(distDir, file));
        } else if (file.endsWith('.qc')) {
            console.log(`  📄 ${relative(process.cwd(), srcPath)}`);
            transpileFile(srcPath, join(distDir, file.replace('.qc', '.js')));
        }
    }
    return true;
}

function runNpmInstall(distDir) {
    console.log('\n📦 Installation des dépendances...');
    try { execSync('npm install', { cwd: distDir, stdio: 'inherit' }); return true; }
    catch { return false; }
}

function runApp(distDir, entryFile) {
    console.log(`\n🚀 Exécution de ${entryFile}...\n`);
    console.log('─'.repeat(50));
    const child = spawn('node', [entryFile], { cwd: distDir, stdio: 'inherit' });
    process.on('SIGINT', () => { child.kill('SIGINT'); process.exit(0); });
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        printHelp();
        process.exit(0);
    }

    const kyadansIndex = args.indexOf('kyadans');
    if (kyadansIndex !== -1 && kyadansIndex > 0) {
        runScript(args[kyadansIndex - 1], args[kyadansIndex + 1]);
        return;
    }

    let appQcPath = null, shouldRun = true;
    for (const arg of args) {
        if (arg === '--no-run') shouldRun = false;
        else if (!arg.startsWith('-')) appQcPath = arg;
    }

    if (!appQcPath) { console.error('❌ Aucun fichier app.qc spécifié!'); process.exit(1); }

    const resolvedAppQc = resolve(appQcPath);
    const projectDir = dirname(resolvedAppQc);
    const srcDir = join(projectDir, 'src');
    const distDir = join(projectDir, 'dist');

    console.log('🍁 roule v1.1.0 - QcLang CLI\n');
    console.log('📋 Étape 1: Parse app.qc...');

    if (!existsSync(resolvedAppQc)) { console.error(`❌ Fichier non trouvé: ${resolvedAppQc}`); process.exit(1); }

    const appSource = readFileSync(resolvedAppQc, 'utf-8');
    const appData = parseAppQc(appSource);
    const packageJson = generatePackageJson(appData);

    if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
    writeFileSync(join(distDir, 'package.json'), packageJson, 'utf-8');
    console.log('   ✅ Généré: dist/package.json');

    console.log('\n📋 Étape 2: Transpilation...');
    transpileDirectory(srcDir, distDir);
    console.log('   ✅ Transpilation terminée');

    console.log('\n📋 Étape 3: npm install...');
    if (!runNpmInstall(distDir)) process.exit(1);

    if (shouldRun) {
        console.log('\n📋 Étape 4: Exécution...');
        runApp(distDir, appData.main);
    } else {
        console.log(`\n✅ Terminé! Pour exécuter: cd dist && node ${appData.main}`);
    }
}

try { main(); } catch (e) { console.error('❌ Erreur:', e.message); process.exit(1); }
