/**
 * QcLang Parser
 * Génère un AST (Abstract Syntax Tree) à partir des tokens
 */

import { TokenType } from './lexer.js';

// Types de nœuds AST
export const NodeType = {
    PROGRAM: 'Program',
    IMPORT: 'Import',
    EXPORT: 'Export',
    CLASS: 'Class',
    FUNCTION: 'Function',
    VARIABLE_DECLARATION: 'VariableDeclaration',
    ASSIGNMENT: 'Assignment',
    RETURN: 'Return',
    IF_STATEMENT: 'IfStatement',
    WHILE_LOOP: 'WhileLoop',
    FOR_EACH_LOOP: 'ForEachLoop',
    CALL_EXPRESSION: 'CallExpression',
    METHOD_CALL: 'MethodCall',
    MEMBER_ACCESS: 'MemberAccess',
    NEW_EXPRESSION: 'NewExpression',
    BINARY_EXPRESSION: 'BinaryExpression',
    UNARY_EXPRESSION: 'UnaryExpression',
    IDENTIFIER: 'Identifier',
    LITERAL: 'Literal',
    ARRAY_LITERAL: 'ArrayLiteral',
    OBJECT_LITERAL: 'ObjectLiteral',
    PROPERTY: 'Property',
    LOG: 'Log',
    BLOCK: 'Block',
};

export class Parser {
    constructor(tokens) {
        this.tokens = tokens.filter(t =>
            t.type !== TokenType.NEWLINE &&
            t.type !== TokenType.COMMENT
        );
        this.pos = 0;
    }

    peek(offset = 0) {
        const pos = this.pos + offset;
        return pos < this.tokens.length ? this.tokens[pos] : null;
    }

    current() {
        return this.peek();
    }

    advance() {
        const token = this.current();
        this.pos++;
        return token;
    }

    expect(type, errorMsg) {
        const token = this.current();
        if (!token || token.type !== type) {
            throw new Error(`${errorMsg}. Got ${token ? token.type : 'EOF'} at line ${token?.line || '?'}`);
        }
        return this.advance();
    }

    match(...types) {
        const token = this.current();
        if (token && types.includes(token.type)) {
            return this.advance();
        }
        return null;
    }

    check(...types) {
        const token = this.current();
        return token && types.includes(token.type);
    }

    skipNewlines() {
        while (this.match(TokenType.NEWLINE)) { }
    }

    parse() {
        const program = {
            type: NodeType.PROGRAM,
            body: []
        };

        while (!this.check(TokenType.EOF)) {
            this.skipNewlines();
            if (this.check(TokenType.EOF)) break;

            const statement = this.parseStatement();
            if (statement) {
                program.body.push(statement);
            }
        }

        return program;
    }

    parseStatement() {
        this.skipNewlines();

        // Import: Prend X De "..."
        if (this.check(TokenType.PREND)) {
            return this.parseImport();
        }

        // Export: Rends X DispoPartout
        if (this.check(TokenType.RENDS)) {
            return this.parseExport();
        }

        // Class: Patente Publique NomClasse
        if (this.check(TokenType.PATENTE)) {
            return this.parseClass();
        }

        // Variable/Function: Faik'Nom ...
        if (this.check(TokenType.FAIK)) {
            return this.parseVariableOrFunction();
        }

        // New instance: Crée X PisSacreLéDans y
        if (this.check(TokenType.CREE)) {
            return this.parseNewExpression();
        }

        // Method call: Call X Su Y PisPawceZy args
        if (this.check(TokenType.CALL)) {
            return this.parseCallStatement();
        }

        // If statement: Si condition
        if (this.check(TokenType.SI)) {
            return this.parseIfStatement();
        }

        // While loop: Tank'condition
        if (this.check(TokenType.TANK)) {
            return this.parseWhileLoop();
        }

        // For-each: LoopSu'array Dans item Pifait
        if (this.check(TokenType.LOOPSU)) {
            return this.parseForEachLoop();
        }

        // Return: Artourne expression
        if (this.check(TokenType.ARTOURNE)) {
            return this.parseReturn();
        }

        // Log: Log(...)
        if (this.check(TokenType.LOG)) {
            return this.parseLog();
        }

        // Expression statement (assignment, method call, etc.)
        if (this.check(TokenType.IDENTIFIER)) {
            return this.parseExpressionStatement();
        }

        // Skip unknown tokens
        if (this.current()) {
            this.advance();
        }
        return null;
    }

    parseImport() {
        this.expect(TokenType.PREND, "Expected 'Prend'");
        const name = this.expect(TokenType.IDENTIFIER, "Expected module name").value;
        this.expect(TokenType.DE, "Expected 'De'");
        const source = this.expect(TokenType.STRING, "Expected module path").value;

        let alias = null;
        if (this.match(TokenType.PISSACRELEDANS)) {
            alias = this.expect(TokenType.IDENTIFIER, "Expected alias name").value;
        }

        return {
            type: NodeType.IMPORT,
            name,
            source,
            alias
        };
    }

    parseExport() {
        this.expect(TokenType.RENDS, "Expected 'Rends'");
        const name = this.expect(TokenType.IDENTIFIER, "Expected export name").value;
        this.expect(TokenType.DISPOPARTOUT, "Expected 'DispoPartout'");

        return {
            type: NodeType.EXPORT,
            name
        };
    }

    parseClass() {
        this.expect(TokenType.PATENTE, "Expected 'Patente'");
        this.match(TokenType.PUBLIQUE); // Optional
        const name = this.expect(TokenType.IDENTIFIER, "Expected class name").value;

        this.skipNewlines();
        this.match(TokenType.INDENT);

        const body = [];
        while (!this.check(TokenType.DEDENT) && !this.check(TokenType.EOF) && !this.check(TokenType.PATENTE)) {
            this.skipNewlines();
            if (this.check(TokenType.DEDENT) || this.check(TokenType.EOF)) break;

            const member = this.parseClassMember();
            if (member) {
                body.push(member);
            }
        }

        this.match(TokenType.DEDENT);

        return {
            type: NodeType.CLASS,
            name,
            body
        };
    }

    parseClassMember() {
        if (this.check(TokenType.FAIK)) {
            return this.parseVariableOrFunction();
        }
        return null;
    }

    parseVariableOrFunction() {
        this.expect(TokenType.FAIK, "Expected 'Faik''");
        const name = this.expect(TokenType.IDENTIFIER, "Expected variable/function name").value;

        // Check for type annotation: C't'un/C't'une Type
        let varType = null;
        if (this.match(TokenType.CTUN)) {
            varType = this.parseType();
        }

        // Check if it's a function: Fonction Qyartourne un Type
        if (varType === 'Fonction' || this.check(TokenType.FONCTION)) {
            return this.parseFunctionDeclaration(name);
        }

        // Variable declaration with optional assignment
        let value = null;
        if (this.match(TokenType.ASSIGN)) {
            value = this.parseExpression();
        }

        return {
            type: NodeType.VARIABLE_DECLARATION,
            name,
            varType,
            value
        };
    }

    parseType() {
        if (this.check(TokenType.TYPE_CHIF)) {
            this.advance();
            return 'number';
        }
        if (this.check(TokenType.TYPE_TEX)) {
            this.advance();
            return 'string';
        }
        if (this.check(TokenType.TYPE_BOULE)) {
            this.advance();
            return 'boolean';
        }
        if (this.check(TokenType.TYPE_DATE)) {
            this.advance();
            return 'Date';
        }
        if (this.check(TokenType.TYPE_OBJET)) {
            this.advance();
            return 'object';
        }
        if (this.check(TokenType.TYPE_TABLO)) {
            const token = this.advance();
            return token.value; // TabloD'Todo, etc.
        }
        if (this.check(TokenType.FONCTION)) {
            this.advance();
            return 'Fonction';
        }
        if (this.check(TokenType.IDENTIFIER)) {
            return this.advance().value; // Custom types like Todo, Request, etc.
        }
        return null;
    }

    parseFunctionDeclaration(name) {
        // Fonction Qyartourne un Type
        this.match(TokenType.FONCTION);

        let returnType = null;
        if (this.match(TokenType.QYARTOURNE)) {
            this.match(TokenType.UN); // "un"
            returnType = this.parseType();
        }

        // Parse parameters: Fotuïpawce param, C't'un Type,
        const params = [];
        this.skipNewlines();
        while (this.check(TokenType.FOTUIPAWCE)) {
            this.advance(); // Fotuïpawce
            const paramName = this.expect(TokenType.IDENTIFIER, "Expected parameter name").value;
            this.match(TokenType.COMMA);
            let paramType = null;
            if (this.match(TokenType.CTUN)) {
                paramType = this.parseType();
            }
            this.match(TokenType.COMMA);
            params.push({ name: paramName, type: paramType });
            this.skipNewlines();
        }

        // Function body: Piafait
        this.skipNewlines();
        this.match(TokenType.PIAFAIT);

        const body = this.parseBlock();

        return {
            type: NodeType.FUNCTION,
            name,
            params,
            returnType,
            body
        };
    }

    parseBlock() {
        const statements = [];
        this.skipNewlines();
        this.match(TokenType.INDENT);

        while (!this.check(TokenType.DEDENT) && !this.check(TokenType.EOF)) {
            this.skipNewlines();
            if (this.check(TokenType.DEDENT) || this.check(TokenType.EOF)) break;

            // Stop at keywords that end a block
            if (this.check(TokenType.FAIK) && this.isAtClassLevel()) break;
            if (this.check(TokenType.PISSI) || this.check(TokenType.OUSINON)) break;

            const statement = this.parseStatement();
            if (statement) {
                statements.push(statement);
            }
        }

        this.match(TokenType.DEDENT);

        return {
            type: NodeType.BLOCK,
            body: statements
        };
    }

    isAtClassLevel() {
        // Heuristic: check if we're defining a new class member
        // Look ahead to see if pattern matches Faik'X C't'un/une Fonction
        let i = 1;
        while (this.peek(i) && this.peek(i).type !== TokenType.NEWLINE) {
            if (this.peek(i).type === TokenType.FONCTION) {
                return true;
            }
            i++;
        }
        return false;
    }

    parseNewExpression() {
        this.expect(TokenType.CREE, "Expected 'Crée'");
        const className = this.expect(TokenType.IDENTIFIER, "Expected class name").value;
        this.expect(TokenType.PISSACRELEDANS, "Expected 'PisSacreLéDans'");
        const varName = this.expect(TokenType.IDENTIFIER, "Expected variable name").value;

        return {
            type: NodeType.NEW_EXPRESSION,
            className,
            varName
        };
    }

    parseCallStatement() {
        this.expect(TokenType.CALL, "Expected 'Call'");
        const methodName = this.expect(TokenType.IDENTIFIER, "Expected method name").value;
        this.expect(TokenType.SU, "Expected 'Su'");

        // Object can be an identifier or a nested Call
        let object;
        if (this.check(TokenType.CALL)) {
            object = this.parseCallExpression();
        } else {
            object = this.expect(TokenType.IDENTIFIER, "Expected object name").value;
        }

        // Optional arguments: PisPawceZy arg1, arg2
        const args = [];
        if (this.match(TokenType.PISPAWCEZY)) {
            do {
                const arg = this.parseExpression();
                args.push(arg);
            } while (this.match(TokenType.COMMA));
        }

        return {
            type: NodeType.METHOD_CALL,
            object,
            method: methodName,
            arguments: args
        };
    }

    parseCallExpression() {
        this.expect(TokenType.CALL, "Expected 'Call'");
        const methodName = this.expect(TokenType.IDENTIFIER, "Expected method name").value;

        // Check if it's "Call X Su Y" or just "Call X"
        if (this.check(TokenType.SU)) {
            this.advance(); // Su
            let object;
            if (this.check(TokenType.CALL)) {
                object = this.parseCallExpression();
            } else {
                object = this.expect(TokenType.IDENTIFIER, "Expected object name").value;
            }

            const args = [];
            if (this.match(TokenType.PISPAWCEZY)) {
                do {
                    const arg = this.parseExpression();
                    args.push(arg);
                } while (this.match(TokenType.COMMA));
            }

            return {
                type: NodeType.METHOD_CALL,
                object,
                method: methodName,
                arguments: args
            };
        } else {
            // Simple function call: Call X
            return {
                type: NodeType.CALL_EXPRESSION,
                callee: methodName,
                arguments: []
            };
        }
    }

    parseIfStatement() {
        this.expect(TokenType.SI, "Expected 'Si'");
        const condition = this.parseExpression();

        this.skipNewlines();
        const consequent = this.parseBlock();

        let alternate = null;

        // PisSi (else if)
        this.skipNewlines();
        if (this.check(TokenType.PISSI)) {
            this.advance();
            const elseIfCondition = this.parseExpression();
            this.skipNewlines();
            const elseIfBody = this.parseBlock();
            alternate = {
                type: NodeType.IF_STATEMENT,
                condition: elseIfCondition,
                consequent: elseIfBody,
                alternate: null
            };

            // Check for more PisSi or OuSinon
            this.skipNewlines();
            if (this.check(TokenType.OUSINON)) {
                this.advance();
                this.skipNewlines();
                alternate.alternate = this.parseBlock();
            }
        } else if (this.check(TokenType.OUSINON)) {
            this.advance();
            this.skipNewlines();
            alternate = this.parseBlock();
        }

        return {
            type: NodeType.IF_STATEMENT,
            condition,
            consequent,
            alternate
        };
    }

    parseWhileLoop() {
        const token = this.advance(); // Tank'...
        // Extract condition from Tank'condition or parse following expression
        let conditionStr = token.value.substring(5); // Remove "Tank'"

        // If the condition continues on the same line, parse it
        const condition = conditionStr ?
            { type: NodeType.IDENTIFIER, name: conditionStr } :
            this.parseExpression();

        this.skipNewlines();
        const body = this.parseBlock();

        return {
            type: NodeType.WHILE_LOOP,
            condition,
            body
        };
    }

    parseForEachLoop() {
        this.expect(TokenType.LOOPSU, "Expected 'LoopSu''");
        const arrayName = this.expect(TokenType.IDENTIFIER, "Expected array name").value;
        this.expect(TokenType.DANS, "Expected 'Dans'");
        const itemName = this.expect(TokenType.IDENTIFIER, "Expected item name").value;
        this.match(TokenType.PIAFAIT);

        this.skipNewlines();
        const body = this.parseBlock();

        return {
            type: NodeType.FOR_EACH_LOOP,
            array: arrayName,
            item: itemName,
            body
        };
    }

    parseReturn() {
        this.expect(TokenType.ARTOURNE, "Expected 'Artourne'");
        const value = this.parseExpression();

        return {
            type: NodeType.RETURN,
            value
        };
    }

    parseLog() {
        this.expect(TokenType.LOG, "Expected 'Log'");
        this.expect(TokenType.LPAREN, "Expected '('");
        const argument = this.parseExpression();
        this.expect(TokenType.RPAREN, "Expected ')'");

        return {
            type: NodeType.LOG,
            argument
        };
    }

    parseExpressionStatement() {
        const expr = this.parseExpression();

        // Check for assignment: identifier = expression
        if (this.match(TokenType.ASSIGN)) {
            const value = this.parseExpression();
            return {
                type: NodeType.ASSIGNMENT,
                target: expr,
                value
            };
        }

        // Check for increment/decrement
        if (this.match(TokenType.INCREMENT)) {
            return {
                type: NodeType.UNARY_EXPRESSION,
                operator: '++',
                argument: expr,
                prefix: false
            };
        }

        if (this.match(TokenType.DECREMENT)) {
            return {
                type: NodeType.UNARY_EXPRESSION,
                operator: '--',
                argument: expr,
                prefix: false
            };
        }

        return expr;
    }

    parseExpression() {
        return this.parseLogicalOr();
    }

    parseLogicalOr() {
        let left = this.parseLogicalAnd();

        while (this.match(TokenType.OR)) {
            const right = this.parseLogicalAnd();
            left = {
                type: NodeType.BINARY_EXPRESSION,
                operator: '||',
                left,
                right
            };
        }

        return left;
    }

    parseLogicalAnd() {
        let left = this.parseEquality();

        while (this.match(TokenType.AND)) {
            const right = this.parseEquality();
            left = {
                type: NodeType.BINARY_EXPRESSION,
                operator: '&&',
                left,
                right
            };
        }

        return left;
    }

    parseEquality() {
        let left = this.parseComparison();

        while (true) {
            if (this.match(TokenType.EQ)) {
                const right = this.parseComparison();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '===', left, right };
            } else if (this.match(TokenType.NEQ)) {
                const right = this.parseComparison();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '!==', left, right };
            } else {
                break;
            }
        }

        return left;
    }

    parseComparison() {
        let left = this.parseAdditive();

        while (true) {
            if (this.match(TokenType.LT)) {
                const right = this.parseAdditive();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '<', left, right };
            } else if (this.match(TokenType.GT)) {
                const right = this.parseAdditive();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '>', left, right };
            } else if (this.match(TokenType.LTE)) {
                const right = this.parseAdditive();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '<=', left, right };
            } else if (this.match(TokenType.GTE)) {
                const right = this.parseAdditive();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '>=', left, right };
            } else {
                break;
            }
        }

        return left;
    }

    parseAdditive() {
        let left = this.parseMultiplicative();

        while (true) {
            if (this.match(TokenType.PLUS)) {
                const right = this.parseMultiplicative();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '+', left, right };
            } else if (this.match(TokenType.MINUS)) {
                const right = this.parseMultiplicative();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '-', left, right };
            } else {
                break;
            }
        }

        return left;
    }

    parseMultiplicative() {
        let left = this.parseUnary();

        while (true) {
            if (this.match(TokenType.MULTIPLY)) {
                const right = this.parseUnary();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '*', left, right };
            } else if (this.match(TokenType.DIVIDE)) {
                const right = this.parseUnary();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '/', left, right };
            } else if (this.match(TokenType.MODULO)) {
                const right = this.parseUnary();
                left = { type: NodeType.BINARY_EXPRESSION, operator: '%', left, right };
            } else {
                break;
            }
        }

        return left;
    }

    parseUnary() {
        if (this.match(TokenType.NOT)) {
            const argument = this.parseUnary();
            return { type: NodeType.UNARY_EXPRESSION, operator: '!', argument, prefix: true };
        }
        if (this.match(TokenType.MINUS)) {
            const argument = this.parseUnary();
            return { type: NodeType.UNARY_EXPRESSION, operator: '-', argument, prefix: true };
        }
        if (this.match(TokenType.INCREMENT)) {
            const argument = this.parseUnary();
            return { type: NodeType.UNARY_EXPRESSION, operator: '++', argument, prefix: true };
        }
        if (this.match(TokenType.DECREMENT)) {
            const argument = this.parseUnary();
            return { type: NodeType.UNARY_EXPRESSION, operator: '--', argument, prefix: true };
        }

        return this.parsePostfix();
    }

    parsePostfix() {
        let expr = this.parsePrimary();

        while (true) {
            if (this.match(TokenType.DOT)) {
                const property = this.expect(TokenType.IDENTIFIER, "Expected property name").value;
                expr = {
                    type: NodeType.MEMBER_ACCESS,
                    object: expr,
                    property
                };
            } else if (this.match(TokenType.LBRACKET)) {
                const index = this.parseExpression();
                this.expect(TokenType.RBRACKET, "Expected ']'");
                expr = {
                    type: NodeType.MEMBER_ACCESS,
                    object: expr,
                    property: index,
                    computed: true
                };
            } else if (this.match(TokenType.LPAREN)) {
                // Function call
                const args = [];
                if (!this.check(TokenType.RPAREN)) {
                    do {
                        args.push(this.parseExpression());
                    } while (this.match(TokenType.COMMA));
                }
                this.expect(TokenType.RPAREN, "Expected ')'");
                expr = {
                    type: NodeType.CALL_EXPRESSION,
                    callee: expr,
                    arguments: args
                };
            } else {
                break;
            }
        }

        return expr;
    }

    parsePrimary() {
        // Literals
        if (this.match(TokenType.NUMBER)) {
            return { type: NodeType.LITERAL, value: this.tokens[this.pos - 1].value };
        }
        if (this.match(TokenType.STRING)) {
            return { type: NodeType.LITERAL, value: this.tokens[this.pos - 1].value, raw: true };
        }
        if (this.match(TokenType.OUIN)) {
            return { type: NodeType.LITERAL, value: true };
        }
        if (this.match(TokenType.TETUMALADE)) {
            return { type: NodeType.LITERAL, value: false };
        }
        if (this.match(TokenType.ARDJIEN)) {
            return { type: NodeType.LITERAL, value: null };
        }

        // Call expression
        if (this.check(TokenType.CALL)) {
            return this.parseCallExpression();
        }

        // Array literal
        if (this.match(TokenType.LBRACKET)) {
            const elements = [];
            if (!this.check(TokenType.RBRACKET)) {
                do {
                    elements.push(this.parseExpression());
                } while (this.match(TokenType.COMMA));
            }
            this.expect(TokenType.RBRACKET, "Expected ']'");
            return { type: NodeType.ARRAY_LITERAL, elements };
        }

        // Object literal
        if (this.match(TokenType.LBRACE)) {
            const properties = [];
            if (!this.check(TokenType.RBRACE)) {
                do {
                    const key = this.expect(TokenType.IDENTIFIER, "Expected property name").value;
                    this.expect(TokenType.COLON, "Expected ':'");
                    const value = this.parseExpression();
                    properties.push({ type: NodeType.PROPERTY, key, value });
                } while (this.match(TokenType.COMMA));
            }
            this.expect(TokenType.RBRACE, "Expected '}'");
            return { type: NodeType.OBJECT_LITERAL, properties };
        }

        // Parenthesized expression
        if (this.match(TokenType.LPAREN)) {
            const expr = this.parseExpression();
            this.expect(TokenType.RPAREN, "Expected ')'");
            return expr;
        }

        // Identifier
        if (this.match(TokenType.IDENTIFIER)) {
            return { type: NodeType.IDENTIFIER, name: this.tokens[this.pos - 1].value };
        }

        throw new Error(`Unexpected token: ${this.current()?.type} at line ${this.current()?.line}`);
    }
}

export function parse(tokens) {
    const parser = new Parser(tokens);
    return parser.parse();
}
