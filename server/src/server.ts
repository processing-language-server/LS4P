import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionParams,
	TextDocument
} from 'vscode-languageserver';
import * as log from './scripts/syslogs'

import * as completion from './completion'
import * as diagnostics from './diagnostics'
import * as hover from './hover'
import * as preprocessing from './preprocessing'

export let connection = createConnection(ProposedFeatures.all);

let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
export let hasDiagnosticRelatedInformationCapability: boolean = false;

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

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			completionProvider: {
				resolveProvider: true,
				triggerCharacters: [ '.' ]
			},
			hoverProvider: true
		}
	};
});

connection.onInitialized(() => {
	log.writeLog(`Server initialized`)
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
	log.writeLog(`Config change event occured`)
	if (hasConfigurationCapability) {
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	documents.all().forEach(diagnostics.checkForRealtimeDiagnostics);
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

export let latestChangesInTextDoc: TextDocument

documents.onDidChangeContent(change => {
	log.writeLog(`Content change event occured`)
	latestChangesInTextDoc = change.document
	preprocessing.performPreProcessing(change.document)
	// Diagnostics diabled since Auto completion is IP
	diagnostics.checkForRealtimeDiagnostics(change.document)
	// Hover disabled for now
	hover.checkforHoverContents(change.document)
});

connection.onDidChangeWatchedFiles(_change => {
	connection.console.log('We received an file change event');
});

// Perform auto-completion -> Deligated tp `completion.ts`
connection.onCompletion(
	(_textDocumentParams: CompletionParams): CompletionItem[] => {
		return completion.decideCompletionMethods(_textDocumentParams, latestChangesInTextDoc)
	}
);

// Completion Resolved suspended for now -> TODO: Refactoring required with real data points
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		// use `item.label`
		item.detail = 'Field Details';
		item.documentation = 'Field Documentation';
		return item;
	}
);

documents.listen(connection);
connection.listen();
