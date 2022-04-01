import { Location, ReferenceParams } from 'vscode-languageserver'
import * as server from './server'
import * as preprocessing from './preprocessing'
import * as pstandard from './grammer/terms/preprocessingsnippets'
import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import { tokenArray } from './parser';
import * as sketch from './sketch'

let currentTempAST: [ParseTree][] = new Array();
let _currentTempCounter = -1

export function scheduleLookUpReference(_referenceParams: ReferenceParams): Location[] | null{
	let resultant: Location[] | null
	let currentContent = server.latestChangesInTextDoc.getText()
	let splitDefine = currentContent.split(`\n`)
	let currentLine = splitDefine[_referenceParams.position.line]
	let currentTokens = parse(currentLine)
	// [string, number, number] => [Token Name, Start Character, End Character]
	let currentReferenceMap: [string, number, number][] = new Array()
	let _currentReferenceCount = 0
	
	for (let i = 0; i < currentTokens.childCount; i++) {
		currentLineASTExtract(currentTokens.children![i])
	}
	currentTempAST.forEach(function (word) {
		currentReferenceMap[_currentReferenceCount] = [word[0].text, currentLine.indexOf(word[0].text), currentLine.indexOf(word[0].text) + word[0].text.length]
		_currentReferenceCount += 1
	})

	let adjustOffset = 0
	if(preprocessing.defaultBehaviourEnable){
		adjustOffset = pstandard.reduceLineDefaultBehaviour
	} else if(preprocessing.methodBehaviourEnable){
		adjustOffset = pstandard.reduceLineMethodBehaviour
	}

	let multipleTokenOccurenceLocations: Location[] = new Array()
	let _multipleTokenCount = 0

	// let lineAdjustment = 0

	// if(preprocessing.methodPattern.exec(currentLine)){
	// 	lineAdjustment = 6 // "public " -> 6 characters added during pre-processing
	// }

	currentReferenceMap.forEach(function(word){
		// params.position.character -> can be of any character, even a character within a word
		if((word[1] <= _referenceParams.position.character) && (_referenceParams.position.character <= word[2])){
			tokenArray.forEach(function(token){
				if(token[0].text == word[0]){
					let lineNumberJavaFile = token[0].payload._line-adjustOffset
					let refLine : number = 0;
					let docUri : string = '';
					if (sketch.transformMap.get(lineNumberJavaFile)) {
						refLine = sketch.transformMap.get(lineNumberJavaFile)!.lineNumber
						let docName =  sketch.transformMap.get(lineNumberJavaFile)!.fileName
						docUri = sketch.uri+docName
					}
					multipleTokenOccurenceLocations[_multipleTokenCount] = {
						uri: docUri,
						range: {
							start: {
								line: refLine-1,
								character: token[0].payload._charPositionInLine
							},
							end: {
								line: refLine-1,
								character: token[0].payload._charPositionInLine + word[0].length
							}
						}
					}
					_multipleTokenCount += 1
				}
			})
		}
	})

	clearTempAST()
	if(multipleTokenOccurenceLocations.length > 0){
		resultant = multipleTokenOccurenceLocations
	} else {
		resultant = null
	}
	return resultant
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
}