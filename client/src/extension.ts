import * as path from 'path';
import * as vscode from 'vscode';
const childProcess = require('child_process');
const fs = require('fs')
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

	let disposable = vscode.commands.registerCommand('extension.processing', () => {
		// Running the Sketch entered in Extension Host
		vscode.window.showInformationMessage(`Running Processing Sketch.!`);
		try{

			copyRecursiveSync(`${__dirname.substring(0,__dirname.length-11)}/server/out/compile/`, `${__dirname}/class`)
			let workDir = `${__dirname.substring(0,__dirname.length-11)}/client/out/class`
			let corePath = `${__dirname.substring(0,__dirname.length-11)}/server/src/processing/jar/core.jar`
			let command
			if (process.platform === 'win32') {
				command =`java -cp ${corePath}; ProcessingDefault`
				console.log("Windows environment, using -cp corePath \";\" as command")
			}
			else {
				command = `java -cp ${corePath}: ProcessingDefault`
				console.log("Linux/Mac environment, using -cp corePath \":\" as command")
			}
			childProcess.exec(command, {cwd: workDir})
			
		} catch(e) {
			vscode.window.showInformationMessage(`Error occured while running sketch.!`);
		}

	});

	let referenceDisposable = vscode.commands.registerCommand('processing.command.findReferences', (...args: any[]) => {
		vscode.commands.executeCommand('editor.action.findReferences', vscode.Uri.file(args[0].uri.substring(7,args[0].uri.length)), new vscode.Position(args[0].lineNumber,args[0].column));
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(referenceDisposable)

	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */

 var copyRecursiveSync = function(src, dest) {

	var exists = fs.existsSync(src);
	var stats = exists && fs.statSync(src);
	var isDirectory = exists && stats.isDirectory();

	if (isDirectory) {
		if(!fs.existsSync(src)) {
	  		fs.mkdirSync(dest);
		}

	  fs.readdirSync(src).forEach(function(childItemName) {
		copyRecursiveSync(path.join(src, childItemName),

						  path.join(dest, childItemName));

	  });

	} else {
	  fs.copyFileSync(src, dest);

	}

  };