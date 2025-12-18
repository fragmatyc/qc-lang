/**
 * App.qc Parser
 * Parse le fichier app.qc pour extraire les métadonnées
 */

export function parseAppQc(source) {
    const result = {
        name: '',
        version: '1.0.0',
        description: '',
        author: '',
        license: 'ISC',
        main: 'index.js',
        type: 'module',
        scripts: { start: 'node index.js' },
        dependencies: {},
        devDependencies: {}
    };

    const lines = source.split('\n');
    let inDependances = false, inDependancesDev = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed === '') continue;

        const nomMatch = trimmed.match(/Faik'Nom\s+C't'un\s+Tex\s*=\s*"([^"]+)"/);
        if (nomMatch) { result.name = nomMatch[1].toLowerCase().replace(/\s+/g, '-'); continue; }

        const versionMatch = trimmed.match(/Faik'Version\s+C't'un\s+Tex\s*=\s*"([^"]+)"/);
        if (versionMatch) { result.version = versionMatch[1]; continue; }

        const auteurMatch = trimmed.match(/Faik'Auteur\s+C't'un\s+Tex\s*=\s*"([^"]+)"/);
        if (auteurMatch) { result.author = auteurMatch[1]; continue; }

        const descriptionMatch = trimmed.match(/Faik'Description\s+C't'un\s+Tex\s*=\s*"([^"]+)"/);
        if (descriptionMatch) { result.description = descriptionMatch[1]; continue; }

        const licenseMatch = trimmed.match(/Faik'License\s+C't'un\s+Tex\s*=\s*"([^"]+)"/);
        if (licenseMatch) { result.license = licenseMatch[1]; continue; }

        const entreeMatch = trimmed.match(/Faik'Entrée\s+C't'un\s+Tex\s*=\s*"([^"]+)"/);
        if (entreeMatch) {
            let entry = entreeMatch[1].replace('.qc', '.js');
            if (entry.startsWith('src/')) entry = entry.substring(4);
            result.main = entry;
            result.scripts.start = `node ${entry}`;
            continue;
        }

        if (trimmed.includes("Faik'Dependances") && trimmed.includes("TabloD'Dependance")) {
            inDependances = true; inDependancesDev = false; continue;
        }
        if (trimmed.includes("Faik'DependancesDev") && trimmed.includes("TabloD'Dependance")) {
            inDependances = false; inDependancesDev = true; continue;
        }

        const depMatch = trimmed.match(/BzoinD'(\S+)\s+v?([\d.]+)?/);
        if (depMatch) {
            const pkg = depMatch[1], ver = depMatch[2] ? `^${depMatch[2]}` : 'latest';
            if (inDependancesDev) result.devDependencies[pkg] = ver;
            else if (inDependances) result.dependencies[pkg] = ver;
            continue;
        }

        if (trimmed.startsWith("Faik'") && !trimmed.includes("Dependance")) {
            inDependances = false; inDependancesDev = false;
        }
    }

    return result;
}

export function generatePackageJson(appData) {
    if (Object.keys(appData.devDependencies).length === 0) delete appData.devDependencies;
    if (Object.keys(appData.dependencies).length === 0) delete appData.dependencies;
    return JSON.stringify(appData, null, 2);
}
