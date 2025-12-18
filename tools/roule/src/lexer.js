/**
 * QcLang Lexer (Tokenizer)
 * Convertit le code source QcLang en tokens
 */

// Types de tokens
export const TokenType = {
    // Keywords
    FAIK: 'FAIK',                    // Faik'
    CTUN: 'CTUN',                    // C't'un / C't'une
    PATENTE: 'PATENTE',              // Patente
    PUBLIQUE: 'PUBLIQUE',            // Publique
    FONCTION: 'FONCTION',            // Fonction
    QYARTOURNE: 'QYARTOURNE',        // Qyartourne
    FOTUIPAWCE: 'FOTUIPAWCE',        // Fotuïpawce
    PIAFAIT: 'PIAFAIT',              // Piafait / Pifait
    ARTOURNE: 'ARTOURNE',            // Artourne
    SI: 'SI',                        // Si
    PISSI: 'PISSI',                  // PisSi
    OUSINON: 'OUSINON',              // OuSinon / Oussinon
    LOOPSU: 'LOOPSU',                // LoopSu'
    DANS: 'DANS',                    // Dans
    TANK: 'TANK',                    // Tank'
    CREE: 'CREE',                    // Crée
    PISSACRELEDANS: 'PISSACRELEDANS', // PisSacreLéDans
    CALL: 'CALL',                    // Call
    SU: 'SU',                        // Su
    PISPAWCEZY: 'PISPAWCEZY',        // PisPawceZy
    PREND: 'PREND',                  // Prend
    DE: 'DE',                        // De
    RENDS: 'RENDS',                  // Rends
    DISPOPARTOUT: 'DISPOPARTOUT',    // DispoPartout
    LOG: 'LOG',                      // Log
    UN: 'UN',                        // un

    // Types
    TYPE_CHIF: 'TYPE_CHIF',          // Chif
    TYPE_TEX: 'TYPE_TEX',            // Tex
    TYPE_BOULE: 'TYPE_BOULE',        // Boule
    TYPE_TABLO: 'TYPE_TABLO',        // Tablo / TabloD'...
    TYPE_DATE: 'TYPE_DATE',          // Date
    TYPE_OBJET: 'TYPE_OBJET',        // Objet
    TYPE_CUSTOM: 'TYPE_CUSTOM',      // Types personnalisés (Todo, Request, etc.)

    // Literals
    OUIN: 'OUIN',                    // ouin (true)
    TETUMALADE: 'TETUMALADE',        // tétumalade (false)
    ARDJIEN: 'ARDJIEN',              // ardjien (null)
    NUMBER: 'NUMBER',                // Nombres
    STRING: 'STRING',                // Chaînes de caractères

    // Identifiers & Operators
    IDENTIFIER: 'IDENTIFIER',
    DOT: 'DOT',                      // .
    COMMA: 'COMMA',                  // ,
    COLON: 'COLON',                  // :
    ASSIGN: 'ASSIGN',                // =
    PLUS: 'PLUS',                    // +
    MINUS: 'MINUS',                  // -
    MULTIPLY: 'MULTIPLY',            // *
    DIVIDE: 'DIVIDE',                // /
    MODULO: 'MODULO',                // %
    EQ: 'EQ',                        // ==
    NEQ: 'NEQ',                      // !=
    LT: 'LT',                        // <
    GT: 'GT',                        // >
    LTE: 'LTE',                      // <=
    GTE: 'GTE',                      // >=
    AND: 'AND',                      // &&
    OR: 'OR',                        // ||
    NOT: 'NOT',                      // !
    INCREMENT: 'INCREMENT',          // ++
    DECREMENT: 'DECREMENT',          // --

    // Brackets
    LPAREN: 'LPAREN',                // (
    RPAREN: 'RPAREN',                // )
    LBRACKET: 'LBRACKET',            // [
    RBRACKET: 'RBRACKET',            // ]
    LBRACE: 'LBRACE',                // {
    RBRACE: 'RBRACE',                // }

    // Special
    NEWLINE: 'NEWLINE',
    INDENT: 'INDENT',
    DEDENT: 'DEDENT',
    EOF: 'EOF',
    COMMENT: 'COMMENT',
};

// Mots-clés QcLang
const KEYWORDS = {
    "Patente": TokenType.PATENTE,
    "Publique": TokenType.PUBLIQUE,
    "Fonction": TokenType.FONCTION,
    "Qyartourne": TokenType.QYARTOURNE,
    "Fotuïpawce": TokenType.FOTUIPAWCE,
    "Piafait": TokenType.PIAFAIT,
    "Pifait": TokenType.PIAFAIT,
    "Artourne": TokenType.ARTOURNE,
    "Si": TokenType.SI,
    "PisSi": TokenType.PISSI,
    "OuSinon": TokenType.OUSINON,
    "Oussinon": TokenType.OUSINON,
    "Dans": TokenType.DANS,
    "Crée": TokenType.CREE,
    "PisSacreLéDans": TokenType.PISSACRELEDANS,
    "Call": TokenType.CALL,
    "Su": TokenType.SU,
    "PisPawceZy": TokenType.PISPAWCEZY,
    "Prend": TokenType.PREND,
    "De": TokenType.DE,
    "Rends": TokenType.RENDS,
    "DispoPartout": TokenType.DISPOPARTOUT,
    "Log": TokenType.LOG,
    "un": TokenType.UN,
    // Literals
    "ouin": TokenType.OUIN,
    "tétumalade": TokenType.TETUMALADE,
    "ardjien": TokenType.ARDJIEN,
    "Ardjien": TokenType.ARDJIEN,
    // Types
    "Chif": TokenType.TYPE_CHIF,
    "Tex": TokenType.TYPE_TEX,
    "Boule": TokenType.TYPE_BOULE,
    "Date": TokenType.TYPE_DATE,
    "Objet": TokenType.TYPE_OBJET,
    "Tablo": TokenType.TYPE_TABLO,
};

export class Token {
    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }

    toString() {
        return `Token(${this.type}, ${JSON.stringify(this.value)}, L${this.line}:${this.column})`;
    }
}

export class Lexer {
    constructor(source) {
        this.source = source;
        this.pos = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.indentStack = [0];
        this.atLineStart = true;
    }

    peek(offset = 0) {
        const pos = this.pos + offset;
        return pos < this.source.length ? this.source[pos] : null;
    }

    advance() {
        const char = this.peek();
        this.pos++;
        if (char === '\n') {
            this.line++;
            this.column = 1;
            this.atLineStart = true;
        } else {
            this.column++;
        }
        return char;
    }

    match(expected) {
        if (this.peek() === expected) {
            this.advance();
            return true;
        }
        return false;
    }

    skipWhitespace() {
        while (this.peek() && this.peek() !== '\n' && /\s/.test(this.peek())) {
            this.advance();
        }
    }

    skipComment() {
        if (this.peek() === '/' && this.peek(1) === '/') {
            while (this.peek() && this.peek() !== '\n') {
                this.advance();
            }
            return true;
        }
        if (this.peek() === '/' && this.peek(1) === '*') {
            this.advance(); // /
            this.advance(); // *
            while (this.peek() && !(this.peek() === '*' && this.peek(1) === '/')) {
                this.advance();
            }
            if (this.peek()) {
                this.advance(); // *
                this.advance(); // /
            }
            return true;
        }
        return false;
    }

    handleIndentation() {
        if (!this.atLineStart) return;

        let indent = 0;
        while (this.peek() === ' ') {
            indent++;
            this.advance();
        }
        while (this.peek() === '\t') {
            indent += 4; // Tab = 4 espaces
            this.advance();
        }

        // Ignorer les lignes vides ou commentaires
        if (this.peek() === '\n' || this.peek() === '\r' ||
            (this.peek() === '/' && (this.peek(1) === '/' || this.peek(1) === '*'))) {
            return;
        }

        this.atLineStart = false;
        const currentIndent = this.indentStack[this.indentStack.length - 1];

        if (indent > currentIndent) {
            this.indentStack.push(indent);
            this.tokens.push(new Token(TokenType.INDENT, indent, this.line, 1));
        } else if (indent < currentIndent) {
            while (this.indentStack.length > 1 && this.indentStack[this.indentStack.length - 1] > indent) {
                this.indentStack.pop();
                this.tokens.push(new Token(TokenType.DEDENT, indent, this.line, 1));
            }
        }
    }

    readString(quote) {
        const startLine = this.line;
        const startColumn = this.column;
        let value = '';
        this.advance(); // Skip opening quote

        while (this.peek() && this.peek() !== quote) {
            if (this.peek() === '\\') {
                this.advance();
                const escaped = this.advance();
                switch (escaped) {
                    case 'n': value += '\n'; break;
                    case 't': value += '\t'; break;
                    case 'r': value += '\r'; break;
                    case '\\': value += '\\'; break;
                    case '"': value += '"'; break;
                    case "'": value += "'"; break;
                    default: value += escaped;
                }
            } else {
                value += this.advance();
            }
        }

        if (this.peek() === quote) {
            this.advance(); // Skip closing quote
        }

        return new Token(TokenType.STRING, value, startLine, startColumn);
    }

    readNumber() {
        const startLine = this.line;
        const startColumn = this.column;
        let value = '';

        if (this.peek() === '-') {
            value += this.advance();
        }

        while (this.peek() && /[0-9]/.test(this.peek())) {
            value += this.advance();
        }

        if (this.peek() === '.' && this.peek(1) && /[0-9]/.test(this.peek(1))) {
            value += this.advance(); // .
            while (this.peek() && /[0-9]/.test(this.peek())) {
                value += this.advance();
            }
        }

        return new Token(TokenType.NUMBER, parseFloat(value), startLine, startColumn);
    }

    readIdentifierOrKeyword() {
        const startLine = this.line;
        const startColumn = this.column;
        let value = '';

        // Support pour Faik', Tank', LoopSu' (avec apostrophe à la fin)
        while (this.peek() && /[a-zA-ZÀ-ÿ0-9_']/.test(this.peek())) {
            value += this.advance();
        }

        // Vérifier si c'est Faik' (déclaration de variable/fonction)
        if (value.startsWith("Faik'") && value.length > 5) {
            // Faik'NomDeVariable -> retourner FAIK + IDENTIFIER
            this.tokens.push(new Token(TokenType.FAIK, "Faik'", startLine, startColumn));
            return new Token(TokenType.IDENTIFIER, value.substring(5), startLine, startColumn + 5);
        }

        // Vérifier si c'est Tank' (while)
        if (value.startsWith("Tank'")) {
            return new Token(TokenType.TANK, value, startLine, startColumn);
        }

        // Vérifier si c'est LoopSu' (for-each)
        if (value.startsWith("LoopSu'") && value.length > 7) {
            this.tokens.push(new Token(TokenType.LOOPSU, "LoopSu'", startLine, startColumn));
            return new Token(TokenType.IDENTIFIER, value.substring(7), startLine, startColumn + 7);
        }

        // Vérifier C't'un / C't'une
        if (value === "C't'un" || value === "C't'une") {
            return new Token(TokenType.CTUN, value, startLine, startColumn);
        }

        // Vérifier TabloD'...
        if (value.startsWith("TabloD'")) {
            return new Token(TokenType.TYPE_TABLO, value, startLine, startColumn);
        }

        // Vérifier les mots-clés
        if (KEYWORDS[value]) {
            return new Token(KEYWORDS[value], value, startLine, startColumn);
        }

        // Sinon c'est un identifiant ou un type custom
        return new Token(TokenType.IDENTIFIER, value, startLine, startColumn);
    }

    tokenize() {
        while (this.pos < this.source.length) {
            // Gérer l'indentation en début de ligne
            this.handleIndentation();

            // Sauter les espaces (pas les newlines ni les tabs en début de ligne)
            this.skipWhitespace();

            // Sauter les commentaires
            if (this.skipComment()) continue;

            const char = this.peek();
            if (!char) break;

            const startLine = this.line;
            const startColumn = this.column;

            // Newlines
            if (char === '\n' || char === '\r') {
                if (char === '\r' && this.peek(1) === '\n') {
                    this.advance();
                }
                this.advance();
                this.tokens.push(new Token(TokenType.NEWLINE, '\\n', startLine, startColumn));
                continue;
            }

            // Strings
            if (char === '"' || char === "'") {
                this.tokens.push(this.readString(char));
                continue;
            }

            // Numbers
            if (/[0-9]/.test(char) || (char === '-' && this.peek(1) && /[0-9]/.test(this.peek(1)))) {
                this.tokens.push(this.readNumber());
                continue;
            }

            // Identifiers and keywords
            if (/[a-zA-ZÀ-ÿ_]/.test(char)) {
                this.tokens.push(this.readIdentifierOrKeyword());
                continue;
            }

            // Operators and punctuation
            switch (char) {
                case '+':
                    this.advance();
                    if (this.match('+')) {
                        this.tokens.push(new Token(TokenType.INCREMENT, '++', startLine, startColumn));
                    } else {
                        this.tokens.push(new Token(TokenType.PLUS, '+', startLine, startColumn));
                    }
                    break;
                case '-':
                    this.advance();
                    if (this.match('-')) {
                        this.tokens.push(new Token(TokenType.DECREMENT, '--', startLine, startColumn));
                    } else {
                        this.tokens.push(new Token(TokenType.MINUS, '-', startLine, startColumn));
                    }
                    break;
                case '*':
                    this.advance();
                    this.tokens.push(new Token(TokenType.MULTIPLY, '*', startLine, startColumn));
                    break;
                case '/':
                    this.advance();
                    this.tokens.push(new Token(TokenType.DIVIDE, '/', startLine, startColumn));
                    break;
                case '%':
                    this.advance();
                    this.tokens.push(new Token(TokenType.MODULO, '%', startLine, startColumn));
                    break;
                case '=':
                    this.advance();
                    if (this.match('=')) {
                        this.tokens.push(new Token(TokenType.EQ, '==', startLine, startColumn));
                    } else {
                        this.tokens.push(new Token(TokenType.ASSIGN, '=', startLine, startColumn));
                    }
                    break;
                case '!':
                    this.advance();
                    if (this.match('=')) {
                        this.tokens.push(new Token(TokenType.NEQ, '!=', startLine, startColumn));
                    } else {
                        this.tokens.push(new Token(TokenType.NOT, '!', startLine, startColumn));
                    }
                    break;
                case '<':
                    this.advance();
                    if (this.match('=')) {
                        this.tokens.push(new Token(TokenType.LTE, '<=', startLine, startColumn));
                    } else {
                        this.tokens.push(new Token(TokenType.LT, '<', startLine, startColumn));
                    }
                    break;
                case '>':
                    this.advance();
                    if (this.match('=')) {
                        this.tokens.push(new Token(TokenType.GTE, '>=', startLine, startColumn));
                    } else {
                        this.tokens.push(new Token(TokenType.GT, '>', startLine, startColumn));
                    }
                    break;
                case '&':
                    this.advance();
                    if (this.match('&')) {
                        this.tokens.push(new Token(TokenType.AND, '&&', startLine, startColumn));
                    }
                    break;
                case '|':
                    this.advance();
                    if (this.match('|')) {
                        this.tokens.push(new Token(TokenType.OR, '||', startLine, startColumn));
                    }
                    break;
                case '.':
                    this.advance();
                    this.tokens.push(new Token(TokenType.DOT, '.', startLine, startColumn));
                    break;
                case ',':
                    this.advance();
                    this.tokens.push(new Token(TokenType.COMMA, ',', startLine, startColumn));
                    break;
                case ':':
                    this.advance();
                    this.tokens.push(new Token(TokenType.COLON, ':', startLine, startColumn));
                    break;
                case '(':
                    this.advance();
                    this.tokens.push(new Token(TokenType.LPAREN, '(', startLine, startColumn));
                    break;
                case ')':
                    this.advance();
                    this.tokens.push(new Token(TokenType.RPAREN, ')', startLine, startColumn));
                    break;
                case '[':
                    this.advance();
                    this.tokens.push(new Token(TokenType.LBRACKET, '[', startLine, startColumn));
                    break;
                case ']':
                    this.advance();
                    this.tokens.push(new Token(TokenType.RBRACKET, ']', startLine, startColumn));
                    break;
                case '{':
                    this.advance();
                    this.tokens.push(new Token(TokenType.LBRACE, '{', startLine, startColumn));
                    break;
                case '}':
                    this.advance();
                    this.tokens.push(new Token(TokenType.RBRACE, '}', startLine, startColumn));
                    break;
                default:
                    // Skip unknown characters
                    this.advance();
            }
        }

        // Ajouter les DEDENT finaux
        while (this.indentStack.length > 1) {
            this.indentStack.pop();
            this.tokens.push(new Token(TokenType.DEDENT, 0, this.line, 1));
        }

        this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column));
        return this.tokens;
    }
}

export function tokenize(source) {
    const lexer = new Lexer(source);
    return lexer.tokenize();
}
