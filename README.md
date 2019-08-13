# Processing Language Server

![LS4P](https://img.shields.io/badge/Language%20Server-LS4P-blue) <br />

> What's Processing Language Server

<b>Processing Language Server</b> focuses on creating a ![Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) implementation for Processing Programming Language.

## Current Capabilities of LS4P

* <b>Pre-note:</b> 
	- Please make sure to save the sketch first, with the extension <b>.pde</b> to initiate the Processing Language Server.

* <b>Auto-completion:</b>
	- Gives you context-aware suggestions to help you code faster. 
	- Autocompletion will function as you enter your code in the workspace and can be explicitly triggered using the character `.` after an instance of a class.

* <b>Diagnostics:</b>
	- Automatically detects the errors in your code in real-time.
	- Represented using squiggly lines.
	- Hover over the word that has squiggly lines to find out the cause of the error.

* <b>Go-to definition:</b>
	- `cmd+click` on a variable, will move the cursor to the variable declaration.
	- This also works for method and class declarations
	- An alternate way of invocation: right-click on the variable name and click <b>Go to Definition</b>.

* <b>Hover Insights:</b>
	- Hover mouse pointer over a keyword - this brings up a pop-up containing what that keyword means.

* <b>Finding References:</b>
	- Helps you find all the references of a variable, class or a function used. 
	- Can be invoked by clicking on the <b>n References</b> link that appears over all the Variable, Class or Method Declarations.
	- An alternate way of invocation: Right-click on a Variable, Class or Method name and click <b>Peek References</b>.

* <b>Running sketch:</b>
	- `cmd+shift+P` to bring up the run console and type Run Processing sketch, press enter - runs the processing sketch.