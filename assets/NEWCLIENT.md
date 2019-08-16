# Creating a new Processing Language Client

The following context explains the process of setting up Processing Language Client that supports Language Server Protocol (LSP) and extends LS4P.

For this Case study, lets consider `Atom` which is one of the most commonly used Generic Editor created and maintained by Github which supports Language Server Protocol.

First to understand `How LSP works` and `How Language Server and Language Client communicates with each other`, it's highly recommended to go through the following reference links:
- [https://microsoft.github.io/language-server-protocol/overview](https://microsoft.github.io/language-server-protocol/overview)
- [https://code.visualstudio.com/api/language-extensions/language-server-extension-guide](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)

Once you're clear with basic constructs of LSP, let's dive into some of the specific features of Processing Language Server and how they can be ported into Atom.

- Autocompletion
	- Server Components:
		- CompletionItem - which is an array that contains all the completion entries - Changes dynamically.
		- CompletionResolver - Gives additional information about each completion Item.
	- RPC Callback to invoke autocompletion in Atom:
		- CompletionItem 
			- textDocument/completion => AutoComplete+
		- CompletionResolver
			- completionItem/resolve =>	AutoComplete+ (Atom 1.24+)

- Diagnostics
	- Server Components:
		- Diagnostics - which is an array that contains all the error reports along with their position in the workspace.
	- RPC Callback to invoke Diagnostics in Atom:
		- textDocument/publishDiagnostics => Linter v2 push/indie

- Go-to definition
	- Server Components:
		- Definition - Gives the location of variable / method or class declaration in the workspace.
	- RPC Callback to invoke goto Definition in Atom:
		- textDocument/definition => Atom-IDE definitions

- Hover Insights
	- Server Components:
		- Hover - Gives the content that has to be shown in the popup on Hover.
	- RPC Callback to invoke Hover Insights in Atom:
		- textDocument/hover => Atom-IDE data tips

- Finding References:
	- Server Components:
		- Location - an array of Locations in the workspace that has the reference names as tokens.
	- RPC Callback to invoke Finding References in Atom:
		- textDocument/findReferences => Atom-IDE findReferences

- Settings
	- Before going into specific features of LS4P, lets understand what LS4P Server is capable of. If you look into VSCode client. A LSP Client can support upto 19 functions from any Language Server namingly,
		- PublishDiagnostics
		- Completion & Completion Resolve
		- Hover
		- SignatureHelp
		- Definition
		- TypeDefinition
		- Implementation
		- References
		- DocumentHighlight
		- DocumentSymbol
		- CodeAction
		- CodeLens & CodeLens Resolve
		- DocumentLink & DocumentLink Resolve
		- DocumentColor & Color Presentation
		- Formatting
		- RangeFormatting
		- OnTypeFormatting
		- Rename & Prepare Rename
		- FoldingRange
	- But currently LS4P supported supports only 6 functions namingly,
		- Completion & Completion Resolve
		- PublishDiagnostics
		- Hover
		- Definition
		- CodeLens & CodeLens Resolve
		- References
	- All the server capabilities can be found here - [https://github.com/processing-language-server/LS4P/blob/aa6a774f01980a48ed9f568c9fdc942783de6573/server/src/server.ts#L53](https://github.com/processing-language-server/LS4P/blob/aa6a774f01980a48ed9f568c9fdc942783de6573/server/src/server.ts#L53). This will be updated as the server gets new features.

- Refer: [https://github.com/atom/atom-languageclient](https://github.com/atom/atom-languageclient)

## Steps to port Language Server to Atom as a Client

Following steps are for setting up a client in Atom.
- ***#1***
	- Create an activation event that triggers the Processing Language Client.
	- This is done in `packages.json` file,
	```
		"activationEvents": [
			"onLanguage:processing"
		]
	```
	- Also make sure to define `processing` as a language explicitly in `packages.json`.
	```
	"languages": [
			{
				"id": "processing",
				"extensions": [
					".pde"
				]
			}
		]
	```

- ***#2***
	- Create a `client.ts` file in `src` of your client directory.
	- Declare the `Language Client` using
	```
	let atomLanguageClient = AutoLanguageClient  // Atom Client
	```

- ***#3***
	- Creating `ServerOptions`
	- This contains 2 parts
		- Server Module
			- This will point to a module that has the server. Here in this case it's significantly `./server/out/server.js`
			- Note: `server.js` will appear in the `out` directory only after successfuly building the server.
		- Transportation Type
			- This specifies the communication type. 
			```
			export declare enum TransportKind {
   				stdio = 0,
   				ipc = 1,
  				pipe = 2,
  				socket = 3,
			}
			```
			- Currently LS4P uses Inter Process Communication .i.e., IPC. So it's highly recommended to use the same for the Atom client.

- ***#4***
	- Creating `ClientOptions`
	- This contains 3 parts
		- Document Selector
			- Make the client prepared to get responses from server when it encounters specific file type.
		- Synchronizer
			- Helps to make the file in sync with the server responses.

- ***#5***
	- Pass the `Server Options` and `Client Options` as the constructor parameters to initialise `atomLanguageClient` which was declared before.

- ***#6***
	- Start Listening to Server by registering a listener .i.e., `atomLanguageClient.start()` during the atom client activation event.

- ***#7***
	- Stop Listening to Server by unregistering a listener .i.e., `atomLanguageClient.end()` during the atom client deactivation event.

This should setup and configure the Atom Client that uses Processing Language Server.

