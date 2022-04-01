import * as lsp from 'vscode-languageserver'
import * as log from './scripts/syslogs'

const fs = require('fs')
const pathM = require('path')


export let path : string = ''
export let uri : string = ''
export let name : string = '';
export let contents  = new Map<string, string>()
export let initialized = false;

/** 
 * Map which maps the line in the java file to the line in the .pde file (tab). 
 * Index is the java file number.
 * The interface holds the line number and name of the .pde file (tab).
*/
export let transformMap = new Map<number, IOriginalTab>()

export interface IOriginalTab {
	lineNumber: number;
	fileName: string;
}

/**
 * Initializes a sketch. 
 * Determens the sketch folder based on the parameter
 * 
 * @param textDocument  .pde file(tab) in the sketch directory.
 * @returns Creation succes state
 */
export function initialize(textDocument: lsp.TextDocument) {
	
	uri = pathM.dirname(textDocument.uri)+'/'
	path = getPathFromUri(uri)
	name = pathM.basename(path)

	try {
		let mainFileName = name+'.pde'
		let mainFileContents = fs.readFileSync(path+mainFileName, 'utf-8')

		contents.set(mainFileName, mainFileContents)
	}
	catch (e) {
		console.log("Something went wrong while loading the main file")
		console.log(e)
		return false
	}

	try{
		let fileNames = fs.readdirSync(path)
		fileNames.forEach((fileName : string) =>{
			if (fileName.endsWith('.pde') && !fileName.includes(name)){
				let tabContents = fs.readFileSync(path+fileName, 'utf-8')
				contents.set(fileName, tabContents)
			}
		});
	}
	catch(e) {
		console.log("Some thing went wrong while loading the other files")
		console.log(e)
		return false
	}
	
	initialized = true
	return true
}

/**
 * Updates the sketch based on the changed document.
 * The tranform dict is automatically updated to the new changes
 * 
 * @param changedDocument Document of which the content should be updated
 * @returns Update succes state
 */
export function updateContent(changedDocument: lsp.TextDocument) {

	if (!initialized) {
		return false
	}

	//Update content
	let tabName = pathM.basename(changedDocument.uri)
	if(tabName.endsWith('.pde')) {
		contents.set(tabName, changedDocument.getText())
	}

	//Update transformation dict
	let bigCount = 1
	for (let [fileName, fileContents] of contents) {
		fileContents += '\n'

		bigCount = cookTransformDict(fileName, fileContents, bigCount)
	}

	return true
}

/**
 * Provides the current content of a sketch.
 * 
 * @returns sketch content
 */
export function getContent() : string{

	if (!initialized) {
		return ''
	}

	let content = ''

	for (let [fileName, fileContents] of contents) {
		fileContents += '\n' //Tab must end with a new line
		content += fileContents
	}

	return content
}

/**
 * Updates the sketch transformation map
 * 
 * 
 * @param fileName Name of the .pde file (tab)
 * @param fileContents Contents of the .pde file (tab)
 * @param bigCount Line number in the created java file
 * @returns 
 */
function cookTransformDict(fileName: string, fileContents: string, bigCount: number) : number{

	// Revert big count due to new line at end of a tab
	if (bigCount > 1) {
		bigCount -= 1
	}

	try {
		// Create transformation Dictonary
		let lineCount = 1			
		fileContents.split(/\r?\n/).forEach((line) => {
			transformMap.set(bigCount, {lineNumber: lineCount, fileName: fileName})
			bigCount ++
			lineCount ++
		})
		log.writeLog(`[INFO] Transform dictonary created for : ${fileName}`)
	}
	catch (e)
	{
		console.log(`[ERROR] ${e}`)
	}

	return bigCount;

}

/**
 * Transforms a file uri to a path
 * 
 * @param uri File based Uniform resource identifier
 * @returns Path in OS style
 */
function getPathFromUri(uri : string) : string {
	let path = uri.replace('file:///', '')
	path =  path.replace('%3A', ':')

	return path
}

/**
 * Appends the name and content of a .pde file (tab)
 * to the content map of the sketch
 * 
 * @param uri Location to the file that needs adding
 */
export function addTab(uri: string) {
	if (initialized) {
		let fileName = pathM.basename(uri)
		if (fileName.endsWith('.pde')) {
			let tabContents = fs.readdirSync(path+fileName, 'utf-8')
			contents.set(fileName, tabContents)
		}
	}
}


/**
 * Deletes the name and content of a .pde file (tab)
 * from the sketch content map
 * 
 * @param uri Location to the file that needs removing
 */
export function removeTab(uri: string) {
	if (initialized) {
		let fileName = pathM.basename(uri)
		if (fileName.endsWith('.pde') && contents.has(fileName)) {
			contents.delete(fileName)
		}
	}
}

/**
 * Transforms a path to a file uri
 * 
 * @param path Path of a file
 * @returns Uniform resource identifier (URI) to the file path
 */
function getUriFromPath(path : string) : string  {
	let tempUri = path.replace(':', '%3A')
	tempUri = 'file:///'+ + tempUri

	return tempUri
}