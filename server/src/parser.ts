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

	let fileName = textDocument.uri.split('/')

	// mkdir /out/compile
	// make sure to set .classpath for Processing core as environment variable
	// This suites for raw java case - should handle for default and setupDraw case
	try{
		childProcess.execSync(`echo \'${processedText}\' > ${__dirname}/compile/${fileName[fileName.length-1].substring(0,fileName[fileName.length-1].length-4)}.java`)
		childProcess.execSync(`javac ${__dirname}/compile/${fileName[fileName.length-1].substring(0,fileName[fileName.length-1].length-4)}.java -Xlint:none -Xstdout ${__dirname}/compile/error.txt`)
	} catch(e){

	}
	// Write methods to handle Error in the Error Stream
	// diagnostics.cookDiagnosticsReport(processedText)
	diagnostics.cookCompilationDiagnostics(processedText)


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