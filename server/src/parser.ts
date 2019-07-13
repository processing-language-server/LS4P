import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import * as diagnostics from './diagnostics';
import { TextDocument } from 'vscode-languageserver';

// Tuple -> current Node, Parent Node
let tokenArray: [ParseTree, ParseTree][] = new Array();
let _tokenCounter = -1

// Tuple -> Current Node, Parent Node
// Helps in traversing up the tree
let wholeAST: [ParseTree, ParseTree | undefined][] = new Array();
let _wholeCounter = -1

// Error Node contents
// Defaults to "NO"
export let errorNodeContents = "NO"

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
	tokenArray.forEach(function(value){
		if(value[0] instanceof ErrorNode){
			errorNodeContents = value[0].text
		}
	})
	console.log("parserTrees")
}

export function setErrorNodeBackToDefault(){
	errorNodeContents = "NO"
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