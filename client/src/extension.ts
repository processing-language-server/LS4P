import * as path from 'path';
import { workspace, ExtensionContext,commands,window } from 'vscode';
const childProcess = require('child_process');

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	
	let clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'processing' }],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	client = new LanguageClient(
		'processingLanguageServer',
		'Processing Language Server',
		serverOptions,
		clientOptions
	);

	let disposable = commands.registerCommand('extension.processing', () => {
		// Running the Sketch entered in Extension Host
		window.showInformationMessage(`Running Processing Sketch.!`);
		try{
			// exec(`mkdir client/out/class`)
			childProcess.exec(`cp ${__dirname.substring(0,__dirname.length-11)}/server/out/compile/** ${__dirname}/class`)
			childProcess.exec(`cd ${__dirname.substring(0,__dirname.length-11)}/client/out/class ; java ProcessingDefault`)
		} catch(e){
			window.showInformationMessage(`Error occured while running sketch.!`);
		}

	});

	context.subscriptions.push(disposable);

	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
