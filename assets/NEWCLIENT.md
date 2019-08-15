# Creating a new Processing Language Client

The following context explains the process of setting up Processing Language Client that supports Language Server Protocol (LSP) and extends LS4P.

For this Case study, lets consider `Atom` which is one of the most commonly used Generic Editor created and maintained by Github which supports Language Server Protocol.

First to understand `How LSP works` and `How Language Server and Language Client communicates with each other`, it's highly recommended to go through the following reference links:
- [https://microsoft.github.io/language-server-protocol/overview](https://microsoft.github.io/language-server-protocol/overview)
- [https://code.visualstudio.com/api/language-extensions/language-server-extension-guide](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)

Once you're clear with basic constructs of LSP, let's dive into some of the specific features of Processing Language Server and how they can be ported into Atom.

- Autocompletion
	- As we all know, autocompletion is the most demanded and crutial part of any Language Server. This primarly has 2 components:
		- CompletionItem - which is an array that contains all the completion entries.
		- CompletionResolver - Gives additional information about each completion Item.
	- RPC Callback to invoke autocompletion
		- CompletionItem 
			- textDocument/completion => AutoComplete+
		- CompletionResolver
			- completionItem/resolve =>	AutoComplete+ (Atom 1.24+)