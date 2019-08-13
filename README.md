# Processing Language Server

![LS4P](https://img.shields.io/badge/Language%20Server-LS4P-blue) <br />

> What's Processing Language Server

Processing Language Server focuses on creating a Language Server Protocol (LSP) implementation for Processing Programming Language. PDE is currently built using Java and using custom components of the Swing Framework, which is ~ deprecated. The long term goal of Processing is to replace this with a JS based IDE to bring in more contributors and to make building UIs simple. While planning on building such IDE, LSP is of significant importance for any language that the IDE relays on. Since Processing is the targeted Programming language, it’s quite important to build a Language Server Protocol for the same. This shall act as a benchmark for all the crucial activities of the IDE such as auto-completion, go-to-definition, hover-insights and so on. LSP will also help in easy and seamless integration of the above functionalities in any editor such as Atom, VScode, etc.

## Current Capabilities of LS4P

* Pre-note: 
- Please make sure to save the sketch first, with the extension `.pde` to initiate the Processing Language Server.

* Auto-completion:
- Gives you context-aware suggestions to help you code faster. 
- Autocompletion will function as you enter your code in the workspace and can be explicitly triggered using the character `.` after an instance of a class.

* Diagnostics:
- Automatically detects the errors in your code in real-time.
- Represented using squiggly lines.
- Hover over the word that has squiggly lines to find out the cause of the error.

* Go-to definition:
- `cmd+click` on a variable, will move the cursor to the variable declaration.
- This also works for method and class declarations
- An alternate way of invocation: right-click on the variable name and click `Go to Definition`.

* Hover Insights:
- Hover mouse pointer over a keyword - this brings up a pop-up containing what that keyword means.

* Finding References:
- Helps you find all the references of a variable, class or a function used. 
- Can be invoked by clicking on the `n References` link that appears over all the Variable, Class or Method Declarations.
- An alternate way of invocation: Right-click on a Variable, Class or Method name and click `Peek References`.

* Running sketch:
- `cmd+shift+P` to bring up the run console and type Run Processing sketch, press enter - runs the processing sketch.