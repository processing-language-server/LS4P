import * as lsp from 'vscode-languageserver'
import * as pStandards from './grammer/terms/preprocessingsnippets'
import * as parser from './parser'

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
	parser.parseAST(processedText as string, textDocument)
	console.log("preProcessing complete")
}