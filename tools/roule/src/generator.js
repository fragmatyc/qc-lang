/**
 * QcLang Code Generator
 * Convertit l'AST en code JavaScript
 */

import { NodeType } from './parser.js';

export class CodeGenerator {
    constructor() {
        this.indent = 0;
        this.output = '';
    }

    getIndent() {
        return '    '.repeat(this.indent);
    }

    emit(code) {
        this.output += code;
    }

    emitLine(code = '') {
        this.output += this.getIndent() + code + '\n';
    }

    generate(ast) {
        this.output = '';
        this.generateNode(ast);
        return this.output;
    }

    generateNode(node) {
        if (!node) return '';

        switch (node.type) {
            case NodeType.PROGRAM:
                return this.generateProgram(node);
            case NodeType.IMPORT:
                return this.generateImport(node);
            case NodeType.EXPORT:
                return this.generateExport(node);
            case NodeType.CLASS:
                return this.generateClass(node);
            case NodeType.FUNCTION:
                return this.generateFunction(node);
            case NodeType.VARIABLE_DECLARATION:
                return this.generateVariableDeclaration(node);
            case NodeType.ASSIGNMENT:
                return this.generateAssignment(node);
            case NodeType.RETURN:
                return this.generateReturn(node);
            case NodeType.IF_STATEMENT:
                return this.generateIfStatement(node);
            case NodeType.WHILE_LOOP:
                return this.generateWhileLoop(node);
            case NodeType.FOR_EACH_LOOP:
                return this.generateForEachLoop(node);
            case NodeType.CALL_EXPRESSION:
                return this.generateCallExpression(node);
            case NodeType.METHOD_CALL:
                return this.generateMethodCall(node);
            case NodeType.MEMBER_ACCESS:
                return this.generateMemberAccess(node);
            case NodeType.NEW_EXPRESSION:
                return this.generateNewExpression(node);
            case NodeType.BINARY_EXPRESSION:
                return this.generateBinaryExpression(node);
            case NodeType.UNARY_EXPRESSION:
                return this.generateUnaryExpression(node);
            case NodeType.IDENTIFIER:
                return node.name;
            case NodeType.LITERAL:
                return this.generateLiteral(node);
            case NodeType.ARRAY_LITERAL:
                return this.generateArrayLiteral(node);
            case NodeType.OBJECT_LITERAL:
                return this.generateObjectLiteral(node);
            case NodeType.LOG:
                return this.generateLog(node);
            case NodeType.BLOCK:
                return this.generateBlock(node);
            default:
                console.warn(`Unknown node type: ${node.type}`);
                return '';
        }
    }

    generateProgram(node) {
        for (const statement of node.body) {
            this.generateStatement(statement);
        }
        return this.output;
    }

    generateStatement(node) {
        const code = this.generateNode(node);
        if (code && !['Import', 'Export', 'Class', 'Function', 'IfStatement', 'WhileLoop', 'ForEachLoop', 'Block'].includes(node.type)) {
            this.emitLine(code + ';');
        }
    }

    generateImport(node) {
        // Transform .qc imports to .js
        let source = node.source;
        if (source.endsWith('.qc')) {
            source = source.replace('.qc', '.js');
        }

        if (node.alias) {
            this.emitLine(`import ${node.name} from "${source}";`);
            this.emitLine(`const ${node.alias} = ${node.name};`);
        } else {
            this.emitLine(`import ${node.name} from "${source}";`);
        }
        return '';
    }

    generateExport(node) {
        this.emitLine(`export { ${node.name} };`);
        return '';
    }

    generateClass(node) {
        this.emitLine(`class ${node.name} {`);
        this.indent++;

        // Separate properties and methods
        const properties = node.body.filter(m =>
            m.type === NodeType.VARIABLE_DECLARATION && m.varType !== 'Fonction'
        );
        const methods = node.body.filter(m =>
            m.type === NodeType.FUNCTION
        );

        // Generate constructor with properties
        this.emitLine('constructor() {');
        this.indent++;
        for (const prop of properties) {
            const value = prop.value ? this.generateNode(prop.value) : 'null';
            this.emitLine(`this.${prop.name} = ${value};`);
        }
        this.indent--;
        this.emitLine('}');
        this.emitLine('');

        // Generate methods
        for (const method of methods) {
            this.generateMethod(method);
            this.emitLine('');
        }

        this.indent--;
        this.emitLine('}');
        this.emitLine('');
        return '';
    }

    generateMethod(node) {
        const params = node.params.map(p => p.name).join(', ');
        this.emitLine(`${node.name}(${params}) {`);
        this.indent++;

        if (node.body && node.body.body) {
            for (const statement of node.body.body) {
                this.generateStatement(statement);
            }
        }

        this.indent--;
        this.emitLine('}');
        return '';
    }

    generateFunction(node) {
        const params = node.params.map(p => p.name).join(', ');
        this.emitLine(`function ${node.name}(${params}) {`);
        this.indent++;

        if (node.body && node.body.body) {
            for (const statement of node.body.body) {
                this.generateStatement(statement);
            }
        }

        this.indent--;
        this.emitLine('}');
        this.emitLine('');
        return '';
    }

    generateVariableDeclaration(node) {
        const value = node.value ? this.generateNode(node.value) : 'null';
        return `let ${node.name} = ${value}`;
    }

    generateAssignment(node) {
        const target = this.generateNode(node.target);
        const value = this.generateNode(node.value);
        return `${target} = ${value}`;
    }

    generateReturn(node) {
        const value = this.generateNode(node.value);
        return `return ${value}`;
    }

    generateIfStatement(node) {
        const condition = this.generateNode(node.condition);
        this.emitLine(`if (${condition}) {`);
        this.indent++;

        if (node.consequent && node.consequent.body) {
            for (const statement of node.consequent.body) {
                this.generateStatement(statement);
            }
        }

        this.indent--;

        if (node.alternate) {
            if (node.alternate.type === NodeType.IF_STATEMENT) {
                this.emit(this.getIndent() + '} else ');
                // Reset indent for else-if
                const savedIndent = this.indent;
                this.indent = 0;
                this.generateIfStatement(node.alternate);
                this.indent = savedIndent;
            } else {
                this.emitLine('} else {');
                this.indent++;
                if (node.alternate.body) {
                    for (const statement of node.alternate.body) {
                        this.generateStatement(statement);
                    }
                }
                this.indent--;
                this.emitLine('}');
            }
        } else {
            this.emitLine('}');
        }

        return '';
    }

    generateWhileLoop(node) {
        const condition = this.generateNode(node.condition);
        this.emitLine(`while (${condition}) {`);
        this.indent++;

        if (node.body && node.body.body) {
            for (const statement of node.body.body) {
                this.generateStatement(statement);
            }
        }

        this.indent--;
        this.emitLine('}');
        return '';
    }

    generateForEachLoop(node) {
        this.emitLine(`for (const ${node.item} of ${node.array}) {`);
        this.indent++;

        if (node.body && node.body.body) {
            for (const statement of node.body.body) {
                this.generateStatement(statement);
            }
        }

        this.indent--;
        this.emitLine('}');
        return '';
    }

    generateCallExpression(node) {
        const callee = typeof node.callee === 'string' ? node.callee : this.generateNode(node.callee);
        const args = node.arguments.map(arg => this.generateNode(arg)).join(', ');
        return `${callee}(${args})`;
    }

    generateMethodCall(node) {
        let object;
        if (typeof node.object === 'string') {
            object = node.object;
        } else {
            object = this.generateNode(node.object);
        }

        const args = node.arguments.map(arg => this.generateNode(arg)).join(', ');
        return `${object}.${node.method}(${args})`;
    }

    generateMemberAccess(node) {
        const object = this.generateNode(node.object);
        if (node.computed) {
            const property = this.generateNode(node.property);
            return `${object}[${property}]`;
        } else {
            return `${object}.${node.property}`;
        }
    }

    generateNewExpression(node) {
        this.emitLine(`let ${node.varName} = new ${node.className}();`);
        return '';
    }

    generateBinaryExpression(node) {
        const left = this.generateNode(node.left);
        const right = this.generateNode(node.right);
        return `${left} ${node.operator} ${right}`;
    }

    generateUnaryExpression(node) {
        const argument = this.generateNode(node.argument);
        if (node.prefix) {
            return `${node.operator}${argument}`;
        } else {
            return `${argument}${node.operator}`;
        }
    }

    generateLiteral(node) {
        if (node.value === null) {
            return 'null';
        }
        if (node.value === true) {
            return 'true';
        }
        if (node.value === false) {
            return 'false';
        }
        if (node.raw) {
            return JSON.stringify(node.value);
        }
        return String(node.value);
    }

    generateArrayLiteral(node) {
        const elements = node.elements.map(e => this.generateNode(e)).join(', ');
        return `[${elements}]`;
    }

    generateObjectLiteral(node) {
        if (node.properties.length === 0) {
            return '{}';
        }
        const properties = node.properties.map(p => {
            const value = this.generateNode(p.value);
            return `${p.key}: ${value}`;
        }).join(', ');
        return `{ ${properties} }`;
    }

    generateLog(node) {
        const argument = this.generateNode(node.argument);
        return `console.log(${argument})`;
    }

    generateBlock(node) {
        for (const statement of node.body) {
            this.generateStatement(statement);
        }
        return '';
    }
}

export function generate(ast) {
    const generator = new CodeGenerator();
    return generator.generate(ast);
}
