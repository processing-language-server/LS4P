import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'

let tokenArray: ParseTree[] = new Array();
let _tokenCounter = -1

let wholeAST: ParseTree[] = new Array();
let _wholeCounter = -1

export function parseAST(processedText: string) {
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
	
	console.log("parserTrees")
}

function extractTokens(gotOne: ParseTree){
	for(let j = 0; j < gotOne.childCount; j++){
		if(gotOne.getChild(j).childCount == 0){
			_tokenCounter +=1
			tokenArray[_tokenCounter] = gotOne.getChild(j)
		}
		extractTokens(gotOne.getChild(j))
	}
}

// top -> bottom ; right -> left
function wholeASTExtract(gotOne: ParseTree){
	_wholeCounter += 1
	wholeAST[_wholeCounter] = gotOne
	for(let j=0;j<gotOne.childCount;j++){
		wholeASTExtract(gotOne.getChild(j))
	}
}