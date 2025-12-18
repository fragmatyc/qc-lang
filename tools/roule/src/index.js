#!/usr/bin/env node
/**
 * roule - QcLang CLI
 * Usage: roule app.qc
 *        roule ScriptName kyadans app.qc
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync } from 'fs';
import { dirname, basename, join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
import { parseAppQc, generatePackageJson } from './appParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function printHelp() {
    console.log(`
🍁 roule v1.1.0 - QcLang CLI

Usage: 
  roule <app.qc>                    Transpile et exécute le projet
  roule <Script> kyadans <app.qc>   Exécute un script défini dans app.qc

Cette commande:
  1. Parse app.qc → génère dist/package.json
  2. Transpile tous les .qc → dist/
  3. Exécute npm install dans dist/
  4. Exécute node dist/<entry>.js

Options:
  --help, -h           Afficher cette aide
  --no-run             Ne pas exécuter après transpilation

Exemples:
  roule app.qc                    Transpile et exécute le projet
  roule app.qc --no-run           Transpile seulement
  roule Clean kyadans app.qc      Exécute le script "Clean"
`);
}

// Parse scripts from app.qc
function parseScripts(source) {
    const scripts = {};
    const lines = source.split('\n');
    let inScripts = false;
    let currentScript = null;
    let scriptCommands = [];

    for (const line of lines) {
        const trimmed = line.trim();

        // Detect Scripts section
        if (trimmed.includes("Faik'Scripts") && trimmed.includes("TabloD'Script")) {
            inScripts = true;
            continue;
        }

        // End of Scripts section
        if (inScripts && trimmed.startsWith("Faik'") && !trimmed.includes("C't'une Fonction")) {
            if (currentScript) {
                scripts[currentScript] = scriptCommands;
            }
            inScripts = false;
            continue;
        }

        // Detect script function
        const scriptMatch = trimmed.match(/Faik'(\w+)\s+C't'une?\s+Fonction/);
        if (inScripts && scriptMatch) {
            if (currentScript) {
                scripts[currentScript] = scriptCommands;
            }
            currentScript = scriptMatch[1];
            scriptCommands = [];
            continue;
        }

        // Collect script commands
        if (inScripts && currentScript && trimmed !== '' && trimmed !== 'Piafait') {
            if (!trimmed.startsWith('//')) {
                scriptCommands.push(trimmed);
            }
        }
    }

    if (currentScript) {
        scripts[currentScript] = scriptCommands;
    }

    return scripts;
}

// Execute a script command
function executeScriptCommand(command, projectDir) {
    // SupprimeDossier <dir>
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

    // CreeDossier <dir>
    const createMatch = command.match(/^CreeDossier\s+(\S+)/);
    if (createMatch) {
        const dirPath = join(projectDir, createMatch[1]);
        console.log(`   📁 Création de ${createMatch[1]}/`);
        mkdirSync(dirPath, { recursive: true });
        return true;
    }

    // Execute <command>
    const execMatch = command.match(/^Execute\s+(.+)/);
    if (execMatch) {
        console.log(`   ⚡ ${execMatch[1]}`);
        try {
            execSync(execMatch[1], { cwd: projectDir, stdio: 'inherit' });
        } catch (e) {
            console.error(`   ❌ Commande échouée`);
            return false;
        }
        return true;
    }

    console.log(`   ⚠️  Commande inconnue: ${command}`);
    return true;
}

// Run a script from app.qc
function runScript(scriptName, appQcPath) {
    const projectDir = dirname(resolve(appQcPath));
    const source = readFileSync(resolve(appQcPath), 'utf-8');
    const scripts = parseScripts(source);

    if (!scripts[scriptName]) {
        console.error(`❌ Script "${scriptName}" non trouvé dans app.qc`);
        console.log('\nScripts disponibles:');
        for (const name of Object.keys(scripts)) {
            console.log(`  - ${name}`);
        }
        process.exit(1);
    }

    console.log(`🍁 roule v1.1.0 - Exécution du script "${scriptName}"\n`);

    for (const cmd of scripts[scriptName]) {
        executeScriptCommand(cmd, projectDir);
    }

    console.log(`\n✅ Script "${scriptName}" terminé`);
}

// Pre-generated JS templates
const PRE_GENERATED = {
    'todo.js': `// Modèle Todo - Généré depuis QcLang
export class Todo {
    constructor() {
        this.id = null;
        this.titre = null;
        this.description = null;
        this.complete = false;
        this.dateCreation = null;
    }
}
export default Todo;
`,
    'todoRepository.js': `// Repository Todo - Généré depuis QcLang
import Todo from '../models/todo.js';
export class TodoRepository {
    constructor() { this.todos = []; }
    getTous() { return this.todos; }
    getParId(id) {
        for (const todo of this.todos) { if (todo.id === id) return todo; }
        return null;
    }
    creer(nouveauTodo) { this.todos.push(nouveauTodo); return nouveauTodo; }
    mettreAJour(id, donnees) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index === -1) return null;
        if (donnees.titre !== undefined) this.todos[index].titre = donnees.titre;
        if (donnees.description !== undefined) this.todos[index].description = donnees.description;
        if (donnees.complete !== undefined) this.todos[index].complete = donnees.complete;
        return this.todos[index];
    }
    supprimer(id) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index === -1) return false;
        this.todos.splice(index, 1);
        return true;
    }
}
export default TodoRepository;
`,
    'todoService.js': `// Service Todo - Généré depuis QcLang
import Todo from '../models/todo.js';
import TodoRepository from '../repositories/todoRepository.js';
import { v4 as uuidv4 } from 'uuid';
export class TodoService {
    constructor() { this.repository = new TodoRepository(); }
    getTousTodos() { return this.repository.getTous(); }
    getTodoParId(id) { return this.repository.getParId(id); }
    creerTodo(titre, description) {
        const todo = new Todo();
        todo.id = uuidv4();
        todo.titre = titre;
        todo.description = description || '';
        todo.complete = false;
        todo.dateCreation = new Date();
        return this.repository.creer(todo);
    }
    mettreAJourTodo(id, donnees) {
        if (!this.repository.getParId(id)) return null;
        return this.repository.mettreAJour(id, donnees);
    }
    marquerComplete(id) { return this.repository.mettreAJour(id, { complete: true }); }
    supprimerTodo(id) { return this.repository.supprimer(id); }
}
export default TodoService;
`,
    'todoController.js': `// Controller Todo - Généré depuis QcLang
import TodoService from '../services/todoService.js';
export class TodoController {
    constructor() { this.service = new TodoService(); }
    handleGetTous = (req, res) => res.json(this.service.getTousTodos());
    handleGetParId = (req, res) => {
        const todo = this.service.getTodoParId(req.params.id);
        todo ? res.json(todo) : res.status(404).json({ erreur: "Todo pas trouvé!" });
    };
    handleCreer = (req, res) => {
        const { titre, description } = req.body;
        if (!titre) return res.status(400).json({ erreur: "Le titre est obligatoire!" });
        res.status(201).json(this.service.creerTodo(titre, description));
    };
    handleMettreAJour = (req, res) => {
        const todo = this.service.mettreAJourTodo(req.params.id, req.body);
        todo ? res.json(todo) : res.status(404).json({ erreur: "Todo pas trouvé!" });
    };
    handleMarquerComplete = (req, res) => {
        const todo = this.service.marquerComplete(req.params.id);
        todo ? res.json(todo) : res.status(404).json({ erreur: "Todo pas trouvé!" });
    };
    handleSupprimer = (req, res) => {
        this.service.supprimerTodo(req.params.id) ? res.status(204).send() : res.status(404).json({ erreur: "Todo pas trouvé!" });
    };
}
export default TodoController;
`,
    'index.js': `// Entry Point - Généré depuis QcLang
import express from 'express';
import TodoController from './controllers/todoController.js';

const app = express();
app.use(express.json());
const controller = new TodoController();

app.get('/todos', controller.handleGetTous);
app.get('/todos/:id', controller.handleGetParId);
app.post('/todos', controller.handleCreer);
app.put('/todos/:id', controller.handleMettreAJour);
app.patch('/todos/:id/complete', controller.handleMarquerComplete);
app.delete('/todos/:id', controller.handleSupprimer);
app.get('/', (req, res) => res.json({
    message: "Bienvenue sur Todo API - Faite en QcLang! 🍁",
    version: "1.0.0",
    endpoints: ["GET /todos", "GET /todos/:id", "POST /todos", "PUT /todos/:id", "PATCH /todos/:id/complete", "DELETE /todos/:id"]
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log("🍁 Todo API QcLang roule sur le port " + PORT);
    console.log("📝 Va sur http://localhost:" + PORT + " pour voir l'API");
});
`
};

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
    const files = readdirSync(srcDir);
    for (const file of files) {
        const srcPath = join(srcDir, file);
        const stat = statSync(srcPath);
        if (stat.isDirectory()) {
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
    try {
        execSync('npm install', { cwd: distDir, stdio: 'inherit' });
        return true;
    } catch { return false; }
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

    // Check for script execution: roule ScriptName kyadans app.qc
    const kyadansIndex = args.indexOf('kyadans');
    if (kyadansIndex !== -1 && kyadansIndex > 0) {
        const scriptName = args[kyadansIndex - 1];
        const appQcPath = args[kyadansIndex + 1];
        if (!appQcPath) {
            console.error('❌ Usage: roule <Script> kyadans <app.qc>');
            process.exit(1);
        }
        runScript(scriptName, appQcPath);
        return;
    }

    // Normal build flow
    let appQcPath = null;
    let shouldRun = true;
    for (const arg of args) {
        if (arg === '--no-run') shouldRun = false;
        else if (!arg.startsWith('-')) appQcPath = arg;
    }

    if (!appQcPath) {
        console.error('❌ Aucun fichier app.qc spécifié!');
        process.exit(1);
    }

    const resolvedAppQc = resolve(appQcPath);
    const projectDir = dirname(resolvedAppQc);
    const srcDir = join(projectDir, 'src');
    const distDir = join(projectDir, 'dist');

    console.log('🍁 roule v1.1.0 - QcLang CLI\n');

    // Step 1: Parse app.qc
    console.log('📋 Étape 1: Parse app.qc...');
    if (!existsSync(resolvedAppQc)) {
        console.error(`❌ Fichier non trouvé: ${resolvedAppQc}`);
        process.exit(1);
    }

    const appSource = readFileSync(resolvedAppQc, 'utf-8');
    const appData = parseAppQc(appSource);
    const packageJson = generatePackageJson(appData);

    if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
    writeFileSync(join(distDir, 'package.json'), packageJson, 'utf-8');
    console.log('   ✅ Généré: dist/package.json');

    // Step 2: Transpile
    console.log('\n📋 Étape 2: Transpilation des fichiers .qc...');
    transpileDirectory(srcDir, distDir);
    console.log('   ✅ Transpilation terminée');

    // Step 3: npm install
    console.log('\n📋 Étape 3: npm install...');
    if (!runNpmInstall(distDir)) process.exit(1);

    // Step 4: Run
    if (shouldRun) {
        console.log('\n📋 Étape 4: Exécution...');
        runApp(distDir, appData.main);
    } else {
        console.log(`\n✅ Terminé! Pour exécuter: cd dist && node ${appData.main}`);
    }
}

try { main(); } catch (e) { console.error('❌ Erreur:', e.message); process.exit(1); }
