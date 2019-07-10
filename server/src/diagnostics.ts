import {
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
} from 'vscode-languageserver';

import * as server from './server'

// Send Diagnostic reports
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
			severity: DiagnosticSeverity.Error,
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