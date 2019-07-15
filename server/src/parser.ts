import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import * as diagnostics from './diagnostics';
import { TextDocument } from 'vscode-languageserver';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { ConstructorDeclarationContext, ClassDeclarationContext } from 'java-ast/dist/parser/JavaParser';

// Tuple -> current Node, Parent Node
let tokenArray: [ParseTree, ParseTree][] = new Array();
let _tokenCounter = -1

// Tuple -> Current Node, Parent Node
// Helps in traversing up the tree
let wholeAST: [ParseTree, ParseTree | undefined][] = new Array();
let _wholeCounter = -1

// Error Node contents
// Array because there can be multiple error nodes
// Defaults to "NO"
export let errorNodeContents: String[] = []
export let errorNodeReasons: String[] = []
let errorNodeCount = 0

export function parseAST(processedText: string, textDocument: TextDocument) {
	let ast = parse(processedText)
	tokenArray = []
	_tokenCounter = -1
	wholeAST = []
	_wholeCounter = -1
	for(let i = 0; i < ast.childCount; i++){
		extractTokens(ast.children![i])
	}
	for(let i = 0; i < ast.childCount; i++){
		wholeASTExtract(ast.children![i])
	}
	cookDiagnosticsReport(processedText)
	console.log("parserTrees")
}

function cookDiagnosticsReport(processedText: string){
	let classNameTemp: String = ""
	wholeAST.forEach(function(node, index){
		if(node[0] instanceof ClassDeclarationContext){
			// Find class Name
			classNameTemp = node[0].getChild(1).text
		}
		if(node[0] instanceof ErrorNode){
			if(node[0].text == `<missing \';\'>`){
				if(node[1]!.text.substring(0,node[1]!.text.length-13).endsWith(')')){
					// Method calls
					errorNodeContents[errorNodeCount] = node[1]!.text.substring(0,node[1]!.text.length-13)
				} else {
					// Others
					if(node[1]!.getChild(node[1]!.childCount-2) instanceof TerminalNode){
						// If the preceeding child is a Terminal Node
						errorNodeContents[errorNodeCount] = node[1]!.getChild(node[1]!.childCount-2).text
					} else {
						// If the preceeding child is a non-terminal Node
						let intermediateParseTree: ParseTree = node[1]!.getChild(node[1]!.childCount-2)
						// Iterate until you find one
						while(!(intermediateParseTree instanceof TerminalNode)){
							intermediateParseTree = intermediateParseTree.getChild(intermediateParseTree.childCount-1)
						}
						errorNodeContents[errorNodeCount] = intermediateParseTree.text
					}
				}
				errorNodeReasons[errorNodeCount] = "Missing ;"
			} else {
				// Other Reasons
				errorNodeContents[errorNodeCount] = node[0].text
				errorNodeReasons[errorNodeCount] = "???"
			}
			errorNodeCount+=1
		}
		if(node[0] instanceof TerminalNode && node[1] instanceof ConstructorDeclarationContext){
			// Constructot label mismatch
			if(classNameTemp != node[0].text && classNameTemp != ""){
				errorNodeContents[errorNodeCount] = node[0].text
				errorNodeReasons[errorNodeCount] = "Constructor Label Mismatch"
				errorNodeCount+=1
			}
		}
	})
	// Delete current Error if the Error Node is resolved
	errorNodeContents.forEach(function(error, index){
		if(!(processedText.indexOf(error as string) > -1)){
			delete errorNodeContents[index]
			delete errorNodeReasons[index]
		}
	})
}

export function setErrorNodeBackToDefault(){
	errorNodeContents = []
	errorNodeCount = 0
}

function extractTokens(gotOne: ParseTree){
	for(let j = 0; j < gotOne.childCount; j++){
		if(gotOne.getChild(j).childCount == 0){
			_tokenCounter +=1
			tokenArray[_tokenCounter] = [gotOne.getChild(j),gotOne]
		}
		extractTokens(gotOne.getChild(j))
	}
}

// top -> bottom ; left -> right
function wholeASTExtract(gotOne: ParseTree){
	_wholeCounter += 1
	wholeAST[_wholeCounter] = [gotOne,gotOne.parent]
	for(let j=0;j<gotOne.childCount;j++){
		wholeASTExtract(gotOne.getChild(j))
	}
}