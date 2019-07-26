import * as lsp from 'vscode-languageserver'
import * as pStandards from './grammer/terms/preprocessingsnippets'
import * as parser from './parser'

export let defaultBehaviourEnable = false
export let methodBehaviourEnable = false

let methodPattern = /[\w\<\>\[\]]+\s+(\w+) *\([^\)]*\) *(\{)/

export async function performPreProcessing(textDocument: lsp.TextDocument): Promise<void>{
	let unProcessedText = textDocument.getText()
	let processedText: String

	// let fileName = textDocument.uri.split('/')
	// pStandards.setDefaultClassName(`${fileName[fileName.length-1].substring(0,fileName[fileName.length-1].length-4)}`)

	// TODO: Handle preprocessing Properly:
	// case 1 -> class and a method inside it without a method in the plain sketch
	// case 2 -> class and a method inside it with a method in the plain sketch

	pStandards.disableSettingsBeforeParse()

	if(methodPattern.exec(pStandards.settingsRenderPipeline(unProcessedText) as string)) {
		processedText = pStandards.methodBehaviour(pStandards.settingsRenderPipeline(unProcessedText))
		setBehaviours(false,true)
	} else {
		processedText = pStandards.setupBehaviour(pStandards.settingsRenderPipeline(unProcessedText))
		setBehaviours(true,false)
	}
	parser.parseAST(processedText as string, textDocument)
	console.log("PreProcessing complete.!")
}

function setBehaviours(_b1:boolean,_b2: boolean){
	defaultBehaviourEnable = _b1
	methodBehaviourEnable = _b2
}