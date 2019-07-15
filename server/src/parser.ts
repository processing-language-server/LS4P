import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import * as diagnostics from './diagnostics';
import { TextDocument } from 'vscode-languageserver';
const childProcess = require('child_process');

// Tuple -> current Node, Parent Node
export let tokenArray: [ParseTree, ParseTree][] = new Array();
let _tokenCounter = -1

// Tuple -> Current Node, Parent Node
// Helps in traversing up the tree
export let wholeAST: [ParseTree, ParseTree | undefined][] = new Array();
let _wholeCounter = -1

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

	diagnostics.cookDiagnosticsReport(processedText)

	// mkdir /out/compile
	// make sure to set .classpath for Processing core as environment variable
	childProcess.execSync(`echo \'${processedText}\' > ${__dirname}/compile/ProcessingDefault.java`)
	childProcess.execSync(`javac ${__dirname}/compile/ProcessingDefault.java -Xlint:none -Xstdout ${__dirname}/compile/error.txt`)

	// Write methods to handle Error in the Error Stream

	console.log("Parsed Successfully.!")
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