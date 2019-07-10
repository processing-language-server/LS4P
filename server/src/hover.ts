import * as lsp from 'vscode-languageserver'
import * as server from './server'

export async function checkforHoverContents(textDocument: lsp.TextDocument): Promise<void>{
	let text = textDocument.getText();
	let checkContents = 'setup';
	let hover : lsp.Hover

	if(text.includes(checkContents)){
		hover = {
			contents:{
				language: 'processing',
				value: 'this is the hover text that appears when you hover over setup'
			},
			range: {
				start: textDocument.positionAt(0),
				end: textDocument.positionAt(3)
			}
		}
	}

	server.connection.onHover(
		(params: lsp.TextDocumentPositionParams): lsp.Hover => {
			return hover
		}
	)
}