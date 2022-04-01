import * as path from 'path';
import * as vscode from 'vscode';
import { SketchRunner } from './sketchRunner';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
	
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
		documentSelector: [{ scheme: 'file', language: 'Processing' }],
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	client = new LanguageClient(
		'processingLanguageServer',
		'Processing Language Server',
		serverOptions,
		clientOptions
	);

	let clientPath = context.asAbsolutePath(path.join('client'))
	let serverPath = context.asAbsolutePath(path.join('server'))

	let serverCompilePath = path.join(serverPath, 'out', 'compile')
	let clientSketchPath = path.join(clientPath, 'out', 'class')
	let processingCoreFile = path.join(serverPath, 'src', 'processing', 'jar', 'core.jar')

	const sketchRunner = SketchRunner.getInstance();
	sketchRunner.initilize(processingCoreFile, clientSketchPath, serverCompilePath)

	let sketchRunnerDisp = vscode.commands.registerCommand("extension.processing.runSketch", () => sketchRunner.runSketch())
	let sketchStopperDisp = vscode.commands.registerCommand("extension.processing.stopSketch", () => sketchRunner.stopSketch())

	let referenceDisposable = vscode.commands.registerCommand('processing.command.findReferences', (...args: any[]) => {
		vscode.commands.executeCommand('editor.action.findReferences', vscode.Uri.file(args[0].uri.substring(7,args[0].uri.length)), new vscode.Position(args[0].lineNumber,args[0].column));
	})

	context.subscriptions.push(referenceDisposable)
	context.subscriptions.push(sketchRunnerDisp)
	context.subscriptions.push(sketchStopperDisp)

	client.start();
}

export async function deactivate(): Promise<void> | undefined {
	if (!client) {
		return undefined;
	}
	const sketchRunner = SketchRunner.getInstance();
	await sketchRunner.stopSketch();
	return client.stop();
}
