/**
 * QcLang Transpiler - Converts QcLang source code to JavaScript
 */

export function transpileQcLang(source, filename = '') {
    // Normalize line endings
    source = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    const lines = source.split('\n');
    let output = [];
    let imports = [];
    let inClass = false;
    let inFunction = false;
    let functionIndent = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const srcIndent = Math.floor(getIndent(line) / 4);

        // Skip empty lines
        if (trimmed === '') {
            output.push('');
            continue;
        }

        // Comments
        if (trimmed.startsWith('//')) {
            output.push(makeIndent(srcIndent) + trimmed);
            continue;
        }

        // Imports
        const importMatch = trimmed.match(/^Prend\s+(\w+)\s+De\s+"([^"]+)"/);
        if (importMatch) {
            let path = importMatch[2];
            if (path.endsWith('.qc')) path = path.replace('.qc', '.js');
            imports.push(`import ${importMatch[1]} from "${path}";`);
            continue;
        }

        // Exports
        if (trimmed.match(/^Rends\s+\w+\s+DispoPartout/)) {
            const name = trimmed.match(/^Rends\s+(\w+)/)[1];
            if (inFunction) { output.push('}'); inFunction = false; }
            if (inClass) { output.push('}'); inClass = false; }
            output.push(`export default ${name};`);
            continue;
        }

        // Class
        const classMatch = trimmed.match(/^Patente\s+(?:Publique\s+)?(\w+)/);
        if (classMatch) {
            if (inFunction) { output.push('}'); inFunction = false; }
            if (inClass) output.push('}');
            output.push(`class ${classMatch[1]} {`);
            output.push('    constructor() {}');
            inClass = true;
            continue;
        }

        // Function definition - close previous function first if at same indent level
        const funcMatch = trimmed.match(/^Faik'(\w+)\s+C't'une?\s+Fonction/);
        if (funcMatch) {
            // Close previous function if we're not indented (new function at same level)
            if (inFunction && srcIndent <= functionIndent) {
                output.push(makeIndent(functionIndent) + '}');
                inFunction = false;
            }

            // Collect parameters
            const params = [];
            let j = i + 1;
            while (j < lines.length) {
                const nextLine = lines[j].trim();
                if (nextLine.startsWith('Fotuïpawce')) {
                    const paramMatch = nextLine.match(/Fotuïpawce\s+(\w+)/);
                    if (paramMatch) params.push(paramMatch[1]);
                    j++;
                } else if (nextLine === 'Piafait') {
                    j++;
                    break;
                } else if (nextLine === '' || nextLine.startsWith('//')) {
                    j++;
                } else {
                    break;
                }
            }
            i = j - 1;

            const indent = inClass ? '    ' : '';
            const fnKeyword = inClass ? '' : 'function ';
            output.push(`${indent}${fnKeyword}${funcMatch[1]}(${params.join(', ')}) {`);
            inFunction = true;
            functionIndent = srcIndent;
            continue;
        }

        // Skip param and Piafait (handled above)
        if (trimmed.startsWith('Fotuïpawce') || trimmed === 'Piafait') {
            continue;
        }

        // Check if we're exiting a function (non-indented Call like app.get)
        if (inFunction && srcIndent === 0 && trimmed.startsWith('Call')) {
            output.push('}');
            inFunction = false;
        }

        // Transpile the line
        const js = transpileLine(trimmed);
        const indent = inFunction ? '    ' : (inClass ? '    ' : '');
        output.push(indent + js);
    }

    // Close open blocks
    if (inFunction) output.push('}');
    if (inClass) output.push('}');

    // Build result
    let result = imports.length > 0 ? imports.join('\n') + '\n\n' : '';
    result += output.join('\n');
    return result;
}

function makeIndent(level) {
    return '    '.repeat(Math.max(0, level));
}

function getIndent(line) {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
}

function transpileLine(line) {
    if (line === 'OuSinon') return '} else {';

    // Variable with nouveau
    const nouveauMatch = line.match(/^Faik'(\w+(?:\.\w+)?)\s*=\s*nouveau\s+(\w+)\(\)/);
    if (nouveauMatch) {
        return `const ${nouveauMatch[1]} = new ${nouveauMatch[2]}();`;
    }

    // Variable with Call assignment
    const varCallMatch = line.match(/^Faik'(\w+(?:\.\w+)?)\s+C't'une?\s+\w+\s*=\s*Call\s+(\w+)\s+Su\s+(\w+)(?:\s+PisPawceZy\s+(.+))?$/);
    if (varCallMatch) {
        const [, varName, method, obj, args] = varCallMatch;
        return `const ${varName} = ${obj}.${method}(${args ? transpileArgs(args) : ''});`;
    }

    // Variable with simple Call
    const varSimpleCallMatch = line.match(/^Faik'(\w+)\s+C't'une?\s+\w+\s*=\s*Call\s+(\w+)$/);
    if (varSimpleCallMatch) {
        return `const ${varSimpleCallMatch[1]} = ${varSimpleCallMatch[2]}();`;
    }

    // Variable with value
    const varMatch = line.match(/^Faik'(\w+(?:\.\w+)?)\s+C't'une?\s+\w+\s*=\s*(.+)$/);
    if (varMatch) {
        return `const ${varMatch[1]} = ${transpileValue(varMatch[2])};`;
    }

    // Simple assignment
    const simpleAssignMatch = line.match(/^Faik'(\w+(?:\.\w+)?)\s*=\s*(.+)$/);
    if (simpleAssignMatch) {
        return `${simpleAssignMatch[1]} = ${transpileExpr(simpleAssignMatch[2])};`;
    }

    // Variable without value
    const varNoValMatch = line.match(/^Faik'(\w+)\s+C't'une?\s+\w+\s*$/);
    if (varNoValMatch) {
        return `let ${varNoValMatch[1]};`;
    }

    // Return with Call
    const returnCallMatch = line.match(/^Artourne\s+Call\s+(\w+)\s+Su\s+(\w+)(?:\s+PisPawceZy\s+(.+))?$/);
    if (returnCallMatch) {
        const [, method, obj, args] = returnCallMatch;
        return `return ${obj}.${method}(${args ? transpileArgs(args) : ''});`;
    }

    // Return simple
    const returnMatch = line.match(/^Artourne\s*(.*)$/);
    if (returnMatch) {
        return returnMatch[1] ? `return ${transpileValue(returnMatch[1])};` : 'return;';
    }

    // Log
    const logMatch = line.match(/^Log\((.+)\)$/);
    if (logMatch) {
        return `console.log(${transpileValue(logMatch[1])});`;
    }

    // Call with args
    const callArgsMatch = line.match(/^Call\s+(\w+)\s+Su\s+(\w+)\s+PisPawceZy\s+(.+)$/);
    if (callArgsMatch) {
        return `${callArgsMatch[2]}.${callArgsMatch[1]}(${transpileArgs(callArgsMatch[3])});`;
    }

    // Call without args
    const callNoArgsMatch = line.match(/^Call\s+(\w+)\s+Su\s+(\w+)\s*$/);
    if (callNoArgsMatch) {
        return `${callNoArgsMatch[2]}.${callNoArgsMatch[1]}();`;
    }

    // Simple call
    const simpleCallMatch = line.match(/^Call\s+(\w+)\s*$/);
    if (simpleCallMatch) {
        return `${simpleCallMatch[1]}();`;
    }

    // If
    const ifMatch = line.match(/^Si\s+(.+)/);
    if (ifMatch) {
        return `if (${transpileCondition(ifMatch[1])}) {`;
    }

    // While
    const whileMatch = line.match(/^Tank'(.+)/);
    if (whileMatch) {
        return `while (${transpileCondition(whileMatch[1])}) {`;
    }

    // For each
    const forEachMatch = line.match(/^LoopSu'(\w+)\s+Dans\s+(\w+)/);
    if (forEachMatch) {
        return `for (const ${forEachMatch[2]} of ${forEachMatch[1]}) {`;
    }

    return `// [QC] ${line}`;
}

function transpileExpr(expr) {
    if (!expr) return 'null';
    const nouveauMatch = expr.match(/^nouveau\s+(\w+)\(\)$/);
    if (nouveauMatch) return `new ${nouveauMatch[1]}()`;

    const callMatch = expr.match(/^Call\s+(\w+)\s+Su\s+(\w+)(?:\s+PisPawceZy\s+(.+))?$/);
    if (callMatch) {
        return `${callMatch[2]}.${callMatch[1]}(${callMatch[3] ? transpileArgs(callMatch[3]) : ''})`;
    }

    const simpleCall = expr.match(/^Call\s+(\w+)$/);
    if (simpleCall) return `${simpleCall[1]}()`;

    return transpileValue(expr);
}

function transpileArgs(argsStr) {
    if (!argsStr) return '';
    return argsStr.split(',').map(p => transpileValue(p.trim())).join(', ');
}

function transpileCondition(cond) {
    return transpileValue(cond);
}

function transpileValue(value) {
    if (!value) return 'null';
    return value
        .replace(/\bouin\b/g, 'true')
        .replace(/\btétumalade\b/g, 'false')
        .replace(/\bardjien\b/g, 'null');
}
