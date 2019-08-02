import * as lsp from 'vscode-languageserver'
import * as server from './server'
const fs = require('fs');
import { Hover } from 'vscode-languageserver';
import { parse } from 'java-ast'
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import { errorNodeLine } from './diagnostics'
import * as log from './scripts/syslogs'

let tempAST: [ParseTree][] = new Array();
let _tempCounter = -1

// This contains Insights for keywords - used in `Hover for Insights`
export let insightMap: [string,string][] = new Array();
let _insightCounter = 0

try{
	let data = fs.readFileSync(`${__dirname}/processing/insightscontainer/insightlist.txt`, 'utf-8')
	let inisghtSpitMap = data.split('\n')
	inisghtSpitMap.forEach(function(value: string){
		if(value.includes(`.xml`)){
			let tempfileRead = fs.readFileSync(`${__dirname}/processing/lspinsights/${value}`, 'utf-8') as string
			let mainDescription: string
			try{
				mainDescription = (tempfileRead.split("<description><![CDATA[")[1]).split("]]></description>")[0]
			} catch(e){
				mainDescription = "Unable to find insights"
			}
			if(value.includes(`_`)){
				let tempKey = value.substring(0,value.length-4).split(`_`)
				insightMap[_insightCounter] = [tempKey[1], `${tempKey[0]} - ${mainDescription}` as string]
			} else {
				insightMap[_insightCounter] = [value.substring(0,value.length-4), mainDescription]
			}
			_insightCounter += 1
		}
	})
	_insightCounter = 0
} catch(e) {
	console.log(`Error fetching Insights`)
}


export async function checkforHoverContents(textDocument: lsp.TextDocument): Promise<void>{

	server.connection.onHover(
		(params: lsp.TextDocumentPositionParams): lsp.Hover | null => {
			let hoverResult: lsp.Hover | null = null
			if(errorNodeLine.length == 0){
				hoverResult = scheduleHover(textDocument, params)
			} else {
				errorNodeLine.forEach(function(errorLine){
					hoverResult = scheduleHover(textDocument, params, errorLine)
				})
			}
			log.writeLog(`Hover Invoked`)
			return hoverResult
		}
	)
}

function scheduleHover(textDocument: lsp.TextDocument, params: lsp.TextDocumentPositionParams, errorLine: number = -10): lsp.Hover | null {
	if(errorLine-1 != params.position.line){
		let text = textDocument.getText();
		let splitHover = text.split(`\n`)
		let currentLine = splitHover[params.position.line]
		let tempTokens = parse(currentLine)
		let hover : Hover | null = null
		let hoverMap: [string, number, number][] = new Array()
		let _hoverCount = 0
		for(let i = 0; i < tempTokens.childCount; i++){
			tempASTExtract(tempTokens.children![i])
		}
		tempAST.forEach(function(word){
			hoverMap[_hoverCount] = [word[0].text, currentLine.indexOf(word[0].text), currentLine.indexOf(word[0].text) + word[0].text.length]
			_hoverCount += 1
		})

		hoverMap.forEach(function(word){
			// params.position.character -> can be of any character, even a character within a word
			if((word[1] <= params.position.character) && (params.position.character <= word[2])){
				insightMap.forEach(function(value){
					if(value[0] == word[0]){
						hover = {
							contents:{
								language: 'processing',
								value: value[1],
								kind: "plaintext"
							},
							range: {
								start: {
									line: params.position.line,
									character: word[1]
								},
								end: {
									line: params.position.line,
									character: word[2]
								}
							}
						}
					}
				})
			}
		})
		clearTempAST()
		return hover
	} else {
		return null
	}
}

function tempASTExtract(gotOne: ParseTree){
	_tempCounter += 1
	tempAST[_tempCounter] = [gotOne]
	for(let j=0;j<gotOne.childCount;j++){
		tempASTExtract(gotOne.getChild(j))
	}
}

function clearTempAST(){
	tempAST = []
	_tempCounter = 0
}