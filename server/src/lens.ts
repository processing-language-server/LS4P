import { CodeLens, CodeLensParams } from 'vscode-languageserver'
import * as parser from './parser'
import * as server from './server'
import { parse } from 'java-ast'
import * as preprocessing from './preprocessing'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import * as pstandard from './grammer/terms/preprocessingsnippets'
import * as javaSpecific from './grammer/terms/javaspecific'
import { ClassDeclarationContext, VariableDeclaratorIdContext, MethodDeclarationContext } from 'java-ast/dist/parser/JavaParser';

// [string,string,number,number] => [type, name, line number, character number]
let lensDeclaration: [string,string,number,number][] = new Array();
let _lensDeclarationCount = 0


export function scheduleLookUpLens(_codeLensParams: CodeLensParams): CodeLens[] | null{

	let adjustOffset = 0
	if(preprocessing.defaultBehaviourEnable){
		adjustOffset = pstandard.reduceLineDefaultBehaviour
	} else if(preprocessing.methodBehaviourEnable){
		adjustOffset = pstandard.reduceLineMethodBehaviour
	}

	parser.tokenArray.forEach(function(token){
		if(token[1] instanceof ClassDeclarationContext) {
			if(!(javaSpecific.TOP_LEVEL_KEYWORDS.indexOf(token[0].text) > -1)){
				lensDeclaration[_lensDeclarationCount] = [`class`, token[0].text, token[0].payload._line-(adjustOffset+1), token[0].payload._charPositionInLine]
				_lensDeclarationCount +=1
			}
		} else if(token[1] instanceof VariableDeclaratorIdContext) {
			lensDeclaration[_lensDeclarationCount] = [`var`, token[0].text, token[0].payload._line-(adjustOffset+1), token[0].payload._charPositionInLine]
			_lensDeclarationCount +=1
		} else if(token[1] instanceof MethodDeclarationContext) {
			// TODO: conflict in `_charPositionInLine` due to addition of `public` infront during preprocessing -> tabs should also be handled
			lensDeclaration[_lensDeclarationCount] = [`method`, token[0].text, token[0].payload._line-(adjustOffset+1), token[0].payload._charPositionInLine - 3]
			_lensDeclarationCount +=1
		}
	})

	if(lensDeclaration.length > 0){
		let resultant: CodeLens[] = new Array()
		let _resultantCount = 0
		// Remove Tokens generated through Preprocessing
		lensDeclaration.forEach(function(declaration){
			if(!((declaration[1] == `ProcessingDefault`) || (declaration[1] == `main`) || (declaration[1] == `args`))){
				resultant[_resultantCount] = {
					command: {
						title: `${findReferenceNumber(declaration[1])} References`,
						command: `processing.command.findReferences`,
						arguments: [
							{
								uri: _codeLensParams.textDocument.uri,
								// Line Number and Column of the keyword for which the code lens has to be invoked
								lineNumber: declaration[2],
								column: declaration[3]
							}
						]
					},
					range: {
						// Position of `n Reference`
						// line -> n+1
						// char -> n+1
						// This is because LSP is 0 based and workspace is 1 based
						start: {
							line: declaration[2],
							character: declaration[3]
						},
						end: {
							line: declaration[2],
							character: declaration[3] + declaration[1].length
						}
					}
				}
				_resultantCount += 1
			}
		})
		clearCapturedDeclarations()
		return resultant
	} else {
		clearCapturedDeclarations()
		return null
	}
}

function findReferenceNumber(tokenName: string): number{
	let referenceCount = 0
	parser.tokenArray.forEach(function(innerToken){
		if(innerToken[0].text == tokenName){
			referenceCount += 1
		}
	})
	// excluding the source reference
	return referenceCount - 1
}


function clearCapturedDeclarations(){
	lensDeclaration = []
	_lensDeclarationCount = 0
}