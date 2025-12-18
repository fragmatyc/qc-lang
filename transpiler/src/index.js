/**
 * QcLang Transpiler - Module principal
 * Combine lexer, parser et generator
 */

import { tokenize } from './lexer.js';
import { parse } from './parser.js';
import { generate } from './generator.js';

export function transpile(source) {
    // Step 1: Tokenize
    const tokens = tokenize(source);

    // Step 2: Parse to AST
    const ast = parse(tokens);

    // Step 3: Generate JavaScript
    const jsCode = generate(ast);

    return {
        tokens,
        ast,
        code: jsCode
    };
}

export { tokenize, parse, generate };
