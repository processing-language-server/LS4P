import * as server from './server'
import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import * as log from './scripts/syslogs'
import * as preprocessing from './preprocessing'
import * as pstandard from './grammer/terms/preprocessingsnippets'
import { Definition } from 'vscode-languageserver'
import * as parser from './parser'
import * as javaSpecific from './grammer/terms/javaspecific'
import { ClassDeclarationContext, VariableDeclaratorIdContext, MethodDeclarationContext } from 'java-ast/dist/parser/JavaParser';
import * as sketch from './sketch'

let currentTempAST: [ParseTree][] = new Array();
let _currentTempCounter = -1
// [string,string,number,number] => [type, name, line number, character number]
let foundDeclaration: [string,string,number,number][] = new Array();
let _foundDeclarationCount = 0

export function scheduleLookUpDefinition(receivedUri: string,lineNumber: number, charNumber: number): Definition | null  {
	let currentContent = server.latestChangesInTextDoc.getText()
	let splitDefine = currentContent.split(`\n`)
	let currentLine = splitDefine[lineNumber]
	let currentTokens = parse(currentLine)
	// [string, number, number] => [Token Name, Start Character, End Character]
	let currentDefineMap: [string, number, number][] = new Array()
	let _currentDefineCount = 0
	for (let i = 0; i < currentTokens.childCount; i++) {
		currentLineASTExtract(currentTokens.children![i])
	}
	currentTempAST.forEach(function (word) {
		currentDefineMap[_currentDefineCount] = [word[0].text, currentLine.indexOf(word[0].text), currentLine.indexOf(word[0].text) + word[0].text.length]
		_currentDefineCount += 1
	})
	
	let adjustOffset = 0
	if(preprocessing.defaultBehaviourEnable){
		adjustOffset = pstandard.reduceLineDefaultBehaviour
	} else if(preprocessing.methodBehaviourEnable){
		adjustOffset = pstandard.reduceLineMethodBehaviour
	}

	parser.tokenArray.forEach(function(token){
		if(token[1] instanceof ClassDeclarationContext){
			if(!(javaSpecific.TOP_LEVEL_KEYWORDS.indexOf(token[0].text) > -1)){
				foundDeclaration[_foundDeclarationCount] = [`class`, token[0].text, token[0].payload._line-(adjustOffset), token[0].payload._charPositionInLine]
				_foundDeclarationCount +=1
			}
		} else if(token[1] instanceof VariableDeclaratorIdContext){
			foundDeclaration[_foundDeclarationCount] = [`var`, token[0].text, token[0].payload._line-(adjustOffset), token[0].payload._charPositionInLine]
			_foundDeclarationCount +=1
		} else if(token[1] instanceof MethodDeclarationContext){
			// TODO: conflict in `_charPositionInLine` due to addition of `public` infront during preprocessing -> tabs should also be handled
			foundDeclaration[_foundDeclarationCount] = [`method`, token[0].text, token[0].payload._line-(adjustOffset), token[0].payload._charPositionInLine - 3]
			_foundDeclarationCount +=1
		}
	})

	// Default Range value
	let finalDefinition: Definition | null = null
	currentDefineMap.forEach(function(word){
		// params.position.character -> can be of any character, even a character within a word
		if((word[1] <= charNumber) && (charNumber <= word[2])){
			foundDeclaration.forEach(function(delarationName){
				if(word[0] == delarationName[1]){

					let lineNumberJavaFile = delarationName[2];
					let diffLine : number = 0;
					let docUri : string = '';
					if (sketch.transformMap.get(lineNumberJavaFile)) {
						diffLine = sketch.transformMap.get(lineNumberJavaFile)!.lineNumber
						let docName =  sketch.transformMap.get(lineNumberJavaFile)!.fileName
						docUri = sketch.uri+docName
					}

					finalDefinition = {
						uri: docUri,
						range:{
							start: {
								line: diffLine-1,
								character: delarationName[3]
							},
							end: {
								line: diffLine-1,
								character: delarationName[3]+word[0].length
							}
						}
					}
				}
			})
		}
	})
	clearTempAST()
	return finalDefinition
}

function currentLineASTExtract(gotOne: ParseTree){
	_currentTempCounter += 1
	currentTempAST[_currentTempCounter] = [gotOne]
	for(let j=0;j<gotOne.childCount;j++){
		currentLineASTExtract(gotOne.getChild(j))
	}
}

function clearTempAST(){
	currentTempAST = []
	_currentTempCounter = 0
	foundDeclaration = []
	_foundDeclarationCount = 0
}