import { ParseTree } from 'antlr4ts/tree/ParseTree';

// Identifies Processing specific instances while instantiating
// eg. PFont pf = new PFont();
// [PFont, pf]
export let variableDeclarationContext: [ParseTree, ParseTree][] = new Array()

export function clearVaribaleDeclarationContext() {
	variableDeclarationContext = []
}

// Identifies local class Declarations inside sketch
// eg. class Sample{
// 		int a;
// 		void method(){
// 		}
// 	   }
// [Sample, a, method()]
export let localClassDeclaratorContext: [ParseTree, ParseTree[], ParseTree[]][] = new Array()

export function clearLocalClassDeclarators(){
	localClassDeclaratorContext = []
}