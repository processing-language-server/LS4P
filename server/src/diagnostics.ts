import {
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
} from 'vscode-languageserver';

import * as server from './server'
import * as parser from './parser'

// Send Diagnostic reports - For consecutive caps - Regex
export async function checkforDiagnostics(textDocument: TextDocument): Promise<void> {
	let settings = await server.getDocumentSettings(textDocument.uri);

	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray | null;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'syntax grammer'
		};
		if (server.hasDiagnosticRelatedInformationCapability) {
			diagnostic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Unrecognized'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Pattern Mismatch'
				}
			];
		}
		diagnostics.push(diagnostic);
	}
 	server.connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

export async function checkForRealtimeDiagnostics(processedTextDocument: TextDocument): Promise<void> {
	let settings = await server.getDocumentSettings(processedTextDocument.uri);
	let processedText = processedTextDocument.getText()
	let problems = 0;
	let diagnostics: Diagnostic[] = []
	let m: RegExpMatchArray | null;
	if((m = processedText.match(parser.errorNodeContents as string)) && problems < settings.maxNumberOfProblems){
		problems++;
		let diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: {
				start: processedTextDocument.positionAt(m.index as number),
				end: processedTextDocument.positionAt(m.index as number + m[0].length)
			},
			message: `${m[0]} - Error found`,
			source: 'Error in source file'
		}
		if (server.hasDiagnosticRelatedInformationCapability) {
			diagnostic.relatedInformation = [
				{
					location: {
						uri: processedTextDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Error $1'
				},
				{
					location: {
						uri: processedTextDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Error $2'
				}
			];
		}
		diagnostics.push(diagnostic);
		parser.setErrorNodeBackToDefault()
	}
	server.connection.sendDiagnostics({ uri: processedTextDocument.uri, diagnostics });
}