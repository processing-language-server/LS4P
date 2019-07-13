import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'

let mainParserArray: ParseTree[] = new Array();
let _mainCounter = -1

export function parseAST(processedText: string) {
	let ast = parse(processedText)
	mainParserArray = []
	_mainCounter = -1
	var parserTrees: ParseTree[] = new Array();
	for(let i = 0; i < ast.childCount; i++){
		parserTrees[i] = ast.children![i]
		extractTokens(parserTrees[i])
	}
	console.log(parserTrees)
}

function extractTokens(gotOne: ParseTree){
	for(let j = 0; j < gotOne.childCount; j++){
		if(gotOne.getChild(j).childCount == 0){
			_mainCounter +=1
			mainParserArray[_mainCounter] = gotOne.getChild(j)
		}
		extractTokens(gotOne.getChild(j))
	}
}