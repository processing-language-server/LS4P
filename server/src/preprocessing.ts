import * as lsp from 'vscode-languageserver'
import * as pStandards from './grammer/terms/preprocessingsnippets'
import * as parser from './parser'

export let setUpDrawBehaviourEnabled = false
export let classBehaviourEnabled = false
export let defaultBehaviourEnable = false

let methodPattern = /[\w\<\>\[\]]+\s+(\w+) *\([^\)]*\) *(\{?|[^;])/

export async function performPreProcessing(textDocument: lsp.TextDocument): Promise<void>{
	let unProcessedText = textDocument.getText()
	let processedText: String

	let fileName = textDocument.uri.split('/')

	pStandards.setDefaultClassName(`${fileName[fileName.length-1].substring(0,fileName[fileName.length-1].length-4)}`)

	if(unProcessedText.includes(pStandards.classChecker)) {
		processedText = pStandards.rawBehaviour(unProcessedText)
		setBehaviours(true,false,false)
	} else if(methodPattern.exec(unProcessedText)) {
		processedText = pStandards.methodBehaviour(unProcessedText)
		setBehaviours(false,true,false)
	} else {
		processedText = pStandards.defaultBehaviour(unProcessedText)
		setBehaviours(false,false,true)
	}
	parser.parseAST(processedText as string, textDocument)
	console.log("PreProcessing complete.!")
}

function setBehaviours(_b1:boolean,_b2: boolean, _b3: boolean){
	classBehaviourEnabled = _b1
	setUpDrawBehaviourEnabled = _b2
	defaultBehaviourEnable = _b3
}