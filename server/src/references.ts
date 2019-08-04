import { Location, ReferenceParams } from 'vscode-languageserver'
import * as server from './server'
import * as preprocessing from './preprocessing'
import * as pstandard from './grammer/terms/preprocessingsnippets'
import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import { tokenArray } from './parser';

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

	currentReferenceMap.forEach(function(word){
		// params.position.character -> can be of any character, even a character within a word
		if((word[1] <= _referenceParams.position.character) && (_referenceParams.position.character <= word[2])){
			tokenArray.forEach(function(token){
				if(token[0].text == word[0]){
					multipleTokenOccurenceLocations[_multipleTokenCount] = {
						uri: _referenceParams.textDocument.uri,
						range: {
							start: {
								line: token[0].payload._line-(adjustOffset+1),
								character: token[0].payload._charPositionInLine
							},
							end: {
								line: token[0].payload._line-(adjustOffset+1),
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