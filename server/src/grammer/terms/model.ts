import { ParseTree } from 'antlr4ts/tree/ParseTree';

export let variableDeclarationContext: [ParseTree, ParseTree][] = new Array()

export function clearVaribaleDeclarationContext() {
	variableDeclarationContext = []
}