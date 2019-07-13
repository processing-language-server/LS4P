import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionParams,
} from 'vscode-languageserver';

import * as completion from './completion'
import * as diagnostics from './diagnostics'
import * as hover from './hover'
import * as preprocessing from './preprocessing'

export let connection = createConnection(ProposedFeatures.all);

let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
export let hasDiagnosticRelatedInformationCapability: boolean = false;

// let initialPositionObj : Position = {
// 	line: 0,
// 	character: 1
// }
// let currentCursorPosition: Position
// let modularCompletionItemEnabled: Boolean = false

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	// currentCursorPosition = initialPositionObj

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			completionProvider: {
				resolveProvider: true,
				// triggerCharacters: [ '.' ]
			},
			hoverProvider: true
		}
	};
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

interface ExampleSettings {
	maxNumberOfProblems: number;
}

const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	documents.all().forEach(diagnostics.checkforDiagnostics);
});

export function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

documents.onDidChangeContent(change => {
	diagnostics.checkforDiagnostics(change.document);
	hover.checkforHoverContents(change.document);
	preprocessing.performPreProcessing(change.document);
	// updateCompletionList(change.document);
});

// async function updateCompletionList(textDocument: TextDocument): Promise<void>{
// 	let textPosition = textDocument.offsetAt(currentCursorPosition);
// 	let text = textDocument.getText();
// 	if((text.charAt(textPosition).toString() === '.') && !(text.charAt(textPosition-1).toString() === ')')){
// 		// Produce modular auto-completion results with respect to the preceeding AST Node.
// 		// completion.cookModularCompletionList()
// 		modularCompletionItemEnabled = true
// 	} else {
// 		// completion.prepareCompletionList()
// 		modularCompletionItemEnabled = false
// 	}
// }

// Hover on context - setup

connection.onDidChangeWatchedFiles(_change => {
	connection.console.log('We received an file change event');
});

// let requestCompletionContext : CompletionContext = {
// 	triggerKind: 1,
// 	triggerCharacter: '.',
// }

// Perform auto-completion -> Deligated tp `completion.ts`
connection.onCompletion(
	(_textDocumentParams: CompletionParams): CompletionItem[] => {
		return completion.decideCompletionMethods("PApplet")
	}
);

// Completion Resolved suspended for now -> TODO: Refactoring required with real data points
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		// use `item.label`
		if (item.data === 1) {
			item.detail = 'Field Details';
			item.documentation = 'Field Documentation';
		} else {
			item.detail = 'Test details Else';
			item.documentation = 'Test Documentation Else';
		}
		return item;
	}
);

documents.listen(connection);
connection.listen();
