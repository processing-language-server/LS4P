import {
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
} from 'vscode-languageserver';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { ConstructorDeclarationContext, ClassDeclarationContext } from 'java-ast/dist/parser/JavaParser';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import { ParseTree } from 'antlr4ts/tree/ParseTree'
import * as server from './server'
import * as parser from './parser'

// Error Node contents
// Array because there can be multiple error nodes
// Defaults to "NO"
let errorNodeContents: String[] = []
let errorNodeReasons: String[] = []
let errorNodeCount = 0

// Diagnostics report based on Error Node
export async function checkForRealtimeDiagnostics(processedTextDocument: TextDocument): Promise<void> {
	let settings = await server.getDocumentSettings(processedTextDocument.uri);
	let processedText = processedTextDocument.getText()
	let problems = 0;
	let diagnostics: Diagnostic[] = []
	let m: RegExpMatchArray | null;
	errorNodeContents.forEach(function(errorContent, index){
		if((m = processedText.match(errorContent as string)) && problems < settings.maxNumberOfProblems){
			problems++;
			let diagnostic: Diagnostic = {
				severity: DiagnosticSeverity.Error,
				range: {
					start: processedTextDocument.positionAt(m.index as number),
					end: processedTextDocument.positionAt(m.index as number + m[0].length)
				},
				message: `${m[0]} - Error found`,
				source: `Error in Source File`
			}
			if (server.hasDiagnosticRelatedInformationCapability) {
				diagnostic.relatedInformation = [
					{
						location: {
							uri: processedTextDocument.uri,
							range: Object.assign({}, diagnostic.range)
						},
						message: `${errorNodeReasons[index]}`
					}
				];
			}
			diagnostics.push(diagnostic);
			setErrorNodeBackToDefault()
		}
	})
	server.connection.sendDiagnostics({ uri: processedTextDocument.uri, diagnostics });
}

// Depricated Diagnostics Reports - Should replace with compilation reports
export function cookDiagnosticsReport(processedText: string){
	let classNameTemp: String = ""
	parser.wholeAST.forEach(function(node, index){
		if(node[0] instanceof ClassDeclarationContext){
			// Find class Name
			classNameTemp = node[0].getChild(1).text
		}
		if(node[0] instanceof ErrorNode){
			if(node[0].text == `<missing \';\'>`){
				if(node[1]!.text.substring(0,node[1]!.text.length-13).endsWith(')')){
					// Method calls
					errorNodeContents[errorNodeCount] = node[1]!.text.substring(0,node[1]!.text.length-13)
				} else {
					// Others
					if(node[1]!.getChild(node[1]!.childCount-2) instanceof TerminalNode){
						// If the preceeding child is a Terminal Node
						errorNodeContents[errorNodeCount] = node[1]!.getChild(node[1]!.childCount-2).text
					} else {
						// If the preceeding child is a non-terminal Node
						let intermediateParseTree: ParseTree = node[1]!.getChild(node[1]!.childCount-2)
						// Iterate until you find one
						while(!(intermediateParseTree instanceof TerminalNode)){
							intermediateParseTree = intermediateParseTree.getChild(intermediateParseTree.childCount-1)
						}
						errorNodeContents[errorNodeCount] = intermediateParseTree.text
					}
				}
				errorNodeReasons[errorNodeCount] = "Missing ;"
			} else {
				// Other Reasons
				errorNodeContents[errorNodeCount] = node[0].text
				errorNodeReasons[errorNodeCount] = "???"
			}
			errorNodeCount+=1
		}
		if(node[0] instanceof TerminalNode && node[1] instanceof ConstructorDeclarationContext){
			// Constructot label mismatch
			if(classNameTemp != node[0].text && classNameTemp != ""){
				errorNodeContents[errorNodeCount] = node[0].text
				errorNodeReasons[errorNodeCount] = "Constructor Label Mismatch"
				errorNodeCount+=1
			}
		}
	})
	// Delete current Error if the Error Node is resolved
	errorNodeContents.forEach(function(error, index){
		if(!(processedText.indexOf(error as string) > -1)){
			delete errorNodeContents[index]
			delete errorNodeReasons[index]
		}
	})
}

function setErrorNodeBackToDefault(){
	errorNodeContents = []
	errorNodeCount = 0
}