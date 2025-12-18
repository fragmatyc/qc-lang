"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
// QcLang keywords for autocompletion
const KEYWORDS = [
    { label: "Faik'", detail: 'Déclaration de variable', insertText: "Faik'${1:nom} C't'un ${2:Type} = ${3:valeur}" },
    { label: 'Patente', detail: 'Déclaration de classe', insertText: 'Patente Publique ${1:NomClasse}\n    ${0}' },
    { label: 'Fonction', detail: 'Déclaration de fonction', insertText: "Faik'${1:nom} C't'une Fonction\nPiafait\n    ${0}" },
    { label: 'Fotuïpawce', detail: 'Paramètre de fonction', insertText: "Fotuïpawce ${1:param}, C't'un ${2:Type}," },
    { label: 'Piafait', detail: 'Début du corps de fonction', insertText: 'Piafait\n    ${0}' },
    { label: 'Artourne', detail: 'Retourne une valeur', insertText: 'Artourne ${0}' },
    { label: 'Qyartourne', detail: 'Type de retour', insertText: 'Qyartourne un ${1:Type}' },
    { label: 'Si', detail: 'Condition if', insertText: 'Si ${1:condition}\n    ${0}' },
    { label: 'PisSi', detail: 'Condition else if', insertText: 'PisSi ${1:condition}\n    ${0}' },
    { label: 'OuSinon', detail: 'Condition else', insertText: 'OuSinon\n    ${0}' },
    { label: "Tank'", detail: 'Boucle while', insertText: "Tank'${1:condition}\n    ${0}" },
    { label: "LoopSu'", detail: 'Boucle for-each', insertText: "LoopSu'${1:array} Dans ${2:item} Piafait\n    ${0}" },
    { label: 'Prend', detail: 'Import', insertText: 'Prend ${1:module} De "${2:path}"' },
    { label: 'Rends', detail: 'Export', insertText: 'Rends ${1:nom} DispoPartout' },
    { label: 'Call', detail: 'Appel de méthode', insertText: 'Call ${1:methode} Su ${2:objet} PisPawceZy ${0}' },
    { label: 'Crée', detail: 'Instanciation', insertText: 'Crée ${1:Classe} PisSacreLéDans ${2:variable}' },
    { label: "BzoinD'", detail: 'Dépendance', insertText: "BzoinD'${1:package} v${2:version}" },
    { label: 'SupprimeDossier', detail: 'Script: supprime un dossier', insertText: 'SupprimeDossier ${1:dist}' },
    { label: 'CreeDossier', detail: 'Script: crée un dossier', insertText: 'CreeDossier ${1:build}' },
    { label: 'Execute', detail: 'Script: exécute une commande', insertText: 'Execute ${1:npm run build}' },
];
// QcLang types
const TYPES = [
    { label: 'Chif', detail: 'Nombre (number)' },
    { label: 'Tex', detail: 'Texte (string)' },
    { label: 'Boule', detail: 'Booléen (boolean)' },
    { label: 'Objet', detail: 'Objet générique' },
    { label: 'Date', detail: 'Date et heure' },
    { label: 'Tablo', detail: 'Tableau' },
    { label: "TabloD'Chif", detail: 'Tableau de nombres' },
    { label: "TabloD'Tex", detail: 'Tableau de textes' },
    { label: "TabloD'Dependance", detail: 'Liste de dépendances' },
    { label: "TabloD'Script", detail: 'Liste de scripts' },
];
// QcLang constants
const CONSTANTS = [
    { label: 'ouin', detail: 'true' },
    { label: 'tétumalade', detail: 'false' },
    { label: 'ardjien', detail: 'null' },
];
function activate(context) {
    console.log('QcLang extension activated 🍁');
    // Completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider('qclang', {
        provideCompletionItems(document, position) {
            const items = [];
            // Add keywords
            for (const kw of KEYWORDS) {
                const item = new vscode.CompletionItem(kw.label, vscode.CompletionItemKind.Keyword);
                item.detail = kw.detail;
                item.insertText = new vscode.SnippetString(kw.insertText);
                items.push(item);
            }
            // Add types
            for (const type of TYPES) {
                const item = new vscode.CompletionItem(type.label, vscode.CompletionItemKind.TypeParameter);
                item.detail = type.detail;
                items.push(item);
            }
            // Add constants
            for (const c of CONSTANTS) {
                const item = new vscode.CompletionItem(c.label, vscode.CompletionItemKind.Constant);
                item.detail = c.detail;
                items.push(item);
            }
            return items;
        }
    }, "'", // Trigger on apostrophe for Faik', etc.
    "D" // Trigger for TabloD'
    );
    // Diagnostics for syntax validation
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('qclang');
    const validateDocument = (document) => {
        if (document.languageId !== 'qclang')
            return;
        const diagnostics = [];
        const text = document.getText();
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            // Check for unclosed strings
            const quoteCount = (trimmed.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0 && !trimmed.startsWith('//')) {
                const range = new vscode.Range(i, 0, i, line.length);
                diagnostics.push(new vscode.Diagnostic(range, 'Chaîne de caractères non fermée', vscode.DiagnosticSeverity.Error));
            }
            // Check for Faik' without C't'un
            if (trimmed.includes("Faik'") && !trimmed.includes("C't'un") && !trimmed.includes("C't'une") && !trimmed.includes("Dependances") && !trimmed.includes("Scripts")) {
                const range = new vscode.Range(i, 0, i, line.length);
                diagnostics.push(new vscode.Diagnostic(range, "Faik' devrait être suivi de C't'un ou C't'une", vscode.DiagnosticSeverity.Warning));
            }
            // Check for Fonction without Piafait
            if (trimmed.includes("C't'une Fonction") && !trimmed.includes("Qyartourne")) {
                // Check if Piafait is on next lines
                let hasPiafait = false;
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    if (lines[j].trim() === 'Piafait' || lines[j].trim().startsWith('Piafait')) {
                        hasPiafait = true;
                        break;
                    }
                    if (lines[j].trim().startsWith("Faik'") && lines[j].includes("Fonction")) {
                        break;
                    }
                }
                if (!hasPiafait) {
                    const range = new vscode.Range(i, 0, i, line.length);
                    diagnostics.push(new vscode.Diagnostic(range, 'Fonction devrait avoir un corps avec Piafait', vscode.DiagnosticSeverity.Information));
                }
            }
        }
        diagnosticCollection.set(document.uri, diagnostics);
    };
    // Validate on open and change
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(validateDocument), vscode.workspace.onDidChangeTextDocument(e => validateDocument(e.document)), completionProvider, diagnosticCollection);
    // Validate all open documents
    vscode.workspace.textDocuments.forEach(validateDocument);
    // Hover provider for documentation
    const hoverProvider = vscode.languages.registerHoverProvider('qclang', {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position);
            if (!range)
                return;
            const word = document.getText(range);
            const docs = {
                "Faik'": "**Déclaration de variable**\n\n`Faik'nom C't'un Type = valeur`",
                "C't'un": "**Type annotation (masculin)**\n\nExemple: `C't'un Chif`",
                "C't'une": "**Type annotation (féminin)**\n\nExemple: `C't'une Fonction`",
                'Patente': "**Déclaration de classe**\n\n`Patente Publique NomClasse`",
                'Piafait': "**Début du corps de fonction**\n\nÉquivalent à `{` en JavaScript",
                'Artourne': "**Return**\n\nRetourne une valeur",
                'ouin': "**true**\n\nValeur booléenne vraie",
                'tétumalade': "**false**\n\nValeur booléenne fausse",
                'ardjien': "**null**\n\nValeur nulle",
                'Chif': "**number**\n\nType numérique",
                'Tex': "**string**\n\nChaîne de caractères",
                'Boule': "**boolean**\n\nType booléen",
            };
            if (docs[word]) {
                return new vscode.Hover(new vscode.MarkdownString(docs[word]));
            }
        }
    });
    context.subscriptions.push(hoverProvider);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map