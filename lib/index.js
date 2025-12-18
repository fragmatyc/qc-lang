/**
 * QcLang - Main entry point
 */

export { parseAppQc, generatePackageJson } from './appParser.js';
export { PRE_GENERATED } from './templates.js';
export { transpileQcLang } from './transpiler.js';

export const version = '1.2.0';
