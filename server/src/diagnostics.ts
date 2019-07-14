import {
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
} from 'vscode-languageserver';

import * as server from './server'
import * as parser from './parser'

// Diagnostics report based on Error Node
export async function checkForRealtimeDiagnostics(processedTextDocument: TextDocument): Promise<void> {
	let settings = await server.getDocumentSettings(processedTextDocument.uri);
	let processedText = processedTextDocument.getText()
	let problems = 0;
	let diagnostics: Diagnostic[] = []
	let m: RegExpMatchArray | null;
	parser.errorNodeContents.forEach(function(errorContent, index){
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
						message: `${parser.errorNodeReasons[index]}`
					}
				];
			}
			diagnostics.push(diagnostic);
			parser.setErrorNodeBackToDefault()
		}
	})
	server.connection.sendDiagnostics({ uri: processedTextDocument.uri, diagnostics });
}