#!/usr/bin/env node
/**
 * QcLang CLI - roule command
 * Usage: roule <fichier.qc> [options]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, basename, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { transpile } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function printHelp() {
    console.log(`
🍁 QcLang Transpiler v1.0.0 - Le langage de programmation québécois!

Usage: roule <fichier.qc> [options]

Options:
  --output, -o <dir>   Dossier de sortie pour les fichiers JS (défaut: ./dist)
  --run, -r            Exécuter le fichier après transpilation
  --debug, -d          Afficher les tokens et l'AST
  --help, -h           Afficher cette aide

Exemples:
  roule index.qc                    Transpile index.qc vers ./dist/index.js
  roule src/app.qc -o build -r      Transpile et exécute
  roule projet/ -o dist             Transpile tous les .qc du dossier
`);
}

function transpileFile(inputPath, outputDir, debug = false) {
    try {
        console.log(`📄 Transpilation de: ${inputPath}`);

        const source = readFileSync(inputPath, 'utf-8');
        const result = transpile(source);

        if (debug) {
            console.log('\n🔍 Tokens:');
            console.log(result.tokens.slice(0, 20).map(t => t.toString()).join('\n'));
            console.log('...\n');

            console.log('🌳 AST:');
            console.log(JSON.stringify(result.ast, null, 2).substring(0, 1000));
            console.log('...\n');
        }

        // Create output directory
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true });
        }

        // Generate output path
        const baseName = basename(inputPath, '.qc');
        const outputPath = join(outputDir, `${baseName}.js`);

        writeFileSync(outputPath, result.code, 'utf-8');
        console.log(`✅ Généré: ${outputPath}`);

        return outputPath;
    } catch (error) {
        console.error(`❌ Erreur lors de la transpilation de ${inputPath}:`);
        console.error(error.message);
        if (debug) {
            console.error(error.stack);
        }
        return null;
    }
}

function runFile(filePath) {
    console.log(`\n🚀 Exécution de: ${filePath}\n`);
    console.log('─'.repeat(50));

    const child = spawn('node', [filePath], {
        stdio: 'inherit',
        cwd: dirname(filePath)
    });

    child.on('error', (error) => {
        console.error(`❌ Erreur d'exécution: ${error.message}`);
    });

    child.on('exit', (code) => {
        console.log('─'.repeat(50));
        if (code === 0) {
            console.log(`\n✅ Exécution terminée avec succès`);
        } else {
            console.log(`\n⚠️ Exécution terminée avec le code: ${code}`);
        }
    });
}

function transpileDirectory(inputDir, outputDir, debug = false) {
    const files = readdirSync(inputDir);

    for (const file of files) {
        const inputPath = join(inputDir, file);
        const stat = statSync(inputPath);

        if (stat.isDirectory()) {
            const subOutputDir = join(outputDir, file);
            transpileDirectory(inputPath, subOutputDir, debug);
        } else if (file.endsWith('.qc')) {
            transpileFile(inputPath, outputDir, debug);
        }
    }
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        printHelp();
        process.exit(0);
    }

    // Parse arguments
    let inputPath = null;
    let outputDir = './dist';
    let shouldRun = false;
    let debug = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--output' || arg === '-o') {
            outputDir = args[++i];
        } else if (arg === '--run' || arg === '-r') {
            shouldRun = true;
        } else if (arg === '--debug' || arg === '-d') {
            debug = true;
        } else if (!arg.startsWith('-')) {
            inputPath = arg;
        }
    }

    if (!inputPath) {
        console.error('❌ Aucun fichier spécifié!');
        printHelp();
        process.exit(1);
    }

    const resolvedInput = resolve(inputPath);
    const resolvedOutput = resolve(outputDir);

    console.log('🍁 QcLang Transpiler v1.0.0\n');

    // Check if input is directory or file
    const stat = statSync(resolvedInput);

    let outputPath;
    if (stat.isDirectory()) {
        transpileDirectory(resolvedInput, resolvedOutput, debug);
        outputPath = join(resolvedOutput, 'index.js');
    } else {
        outputPath = transpileFile(resolvedInput, resolvedOutput, debug);
    }

    if (shouldRun && outputPath && existsSync(outputPath)) {
        runFile(outputPath);
    }
}

try {
    main();
} catch (error) {
    console.error('❌ Erreur fatale:', error.message);
    console.error(error.stack);
    process.exit(1);
}
