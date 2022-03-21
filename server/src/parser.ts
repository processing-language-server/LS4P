import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import * as diagnostics from './diagnostics';
import { TextDocument } from 'vscode-languageserver';
import * as pStandards from './grammer/terms/preprocessingsnippets'
import * as log from './scripts/syslogs'
const childProcess = require('child_process');
const fs = require('fs')

// Tuple -> current Node, Parent Node
export let tokenArray: [ParseTree, ParseTree][] = new Array();
let _tokenCounter = -1

// Tuple -> Current Node, Parent Node
// Helps in traversing up the tree
export let wholeAST: [ParseTree, ParseTree | undefined][] = new Array();
let _wholeCounter = -1

// Currently constructed AST after the last character change
export let ast: any

export function parseAST(processedText: string, textDocument: TextDocument) {
	ast = parse(processedText)
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

	console.log("Break point here to obtain AST")

	// mkdir /out/compile
	// make sure to set .classpath for Processing core as environment variable
	// This suites for raw java case - should handle for default and setupDraw case
	try{
		fs.writeFileSync(__dirname+"/compile/"+pStandards.defaultClassName+".java", processedText)
		log.writeLog(`Java File creation successful`)
	} catch(e) {
		log.writeLog(`[[ERR]] - Error in Java File Creation`)
	}

	try{
		childProcess.execSync(`javac -classpath ${__dirname.substring(0,__dirname.length-11)}/pcore/ ${__dirname}/compile/${pStandards.defaultClassName}.java -Xlint:none -Xstdout ${__dirname}/compile/error.txt`,
			{ stdio:[ 'inherit', 'pipe', 'pipe' ] })
		log.writeLog(`Java File compilation successful`)
	} catch(e) {
		log.writeLog(`[[ERR]] - Error in Java File Compilation`)
	}

	// Wrote methods to handle Error in the Error Stream
	// diagnostics.cookDiagnosticsReport(processedText)
	diagnostics.cookCompilationDiagnostics(processedText, `${__dirname}/compile/${pStandards.defaultClassName}.java`)


	log.writeLog("Parse Tree construction Successfully")
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