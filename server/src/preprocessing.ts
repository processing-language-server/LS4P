import * as lsp from 'vscode-languageserver'
import { parse } from 'java-ast'
import * as pStandards from './grammer/terms/preprocessingsnippets'

export async function performPreProcessing(textDocument: lsp.TextDocument): Promise<void>{
	let unProcessedText = textDocument.getText()
	let processedText: String
	if(unProcessedText.includes(pStandards.classChecker)) {
		processedText = pStandards.classBehaviour(unProcessedText)
	} else if(unProcessedText.includes(pStandards.setUpChecker)) {
		processedText = pStandards.setupDrawBehaviour(unProcessedText)
	} else {
		processedText = pStandards.defaultBehaviour(unProcessedText)
	}
	let ast = parse(processedText as string)
	console.log(ast)
}