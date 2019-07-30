import * as preprocessing from '../../preprocessing'
export const classChecker = `class`
export const newChecker = `new`
export let defaultClassName = "ProcessingDefault"
const defaultLib = `PApplet`
// Dynamic Imports should take format - `import __.__.__;`
const dynamicImports = `import processing.core.*\;
import processing.awt.*\;
import processing.data.*\;
import processing.event.*\;
import processing.opengl.*\;
import processing.javafx.*\;
import java.util.*\;
import java.io.*\;
import java.lang.*\;
`

// let settingsLineCounter = 0

// TODO - Fix line count offset when settings is added - since some lines will be removed from the workspace code and will be moved to settings
export let reduceLineDefaultBehaviour = 14 
export let reduceLineMethodBehaviour = 13 

let sizePattern = /(size)\([ ]*[0-9]+[ ]*\,[ ]*[0-9]+[ ]*\,*[ ]*[A-Z 0-9]{0,}[ ]*\)\;/
let fullScreenPattern = /(fullScreen)\([ ]*[A-Z 0-9]{0,}[ ]*\,*[ ]*[0-9]*[ ]*\)\;/
let smoothPattern = /(smooth)\([ ]*[0-9]+[ ]*\)\;/
let noSmoothPatterns = /(noSmooth)\(\)\;/

export let settingsContext = ""
export let isSettingsRequired = false
let settingsSet = new Set()

export function setDefaultClassName(className : String){
	defaultClassName = className as string
}

// Similar to : https://github.com/processing/processing/blob/37108add372272d7b1fc23d2500dce911c4d1098/java/src/processing/mode/java/preproc/PdePreprocessor.java#L1149
// Mode.STATIC
export function setupBehaviour(unProcessedTest: String): String {
	let processedText = `
${dynamicImports}
public class ${defaultClassName} extends ${defaultLib}{
public void setup(){
${unProcessedTest}
}
${settingsPreprocessing()}
${preprocessingFooter()}
}
`
	return processedText
}

// Mode.ACTIVE
export function methodBehaviour(unProcessedTest: String): String {
	let processedText = `
${dynamicImports}
public class ${defaultClassName} extends ${defaultLib}{
${unProcessedTest}
${settingsPreprocessing()}
${preprocessingFooter()}
}
`
	return processedText
}

export function mapperPipeline(){
	// Handle PApplet conversions such as float() to PApplet.parseFloat()
	// Provide Access Specifiers
	// handle floating points and doubles
}

// Handle size(), fullScreen(), smooth() & noSmooth()
// Takes in Unprocessed Text and returns UnProcessed Text with the `settings` lines stripped out
export function settingsRenderPipeline(unProcessedTest: String): String {
	let recordLine = unProcessedTest.split(`\n`)
	let newUnProcessedText = ``
	// Fixes method scoping for methods unassigned access specifiers
	recordLine.forEach(function(line,index){
		if(preprocessing.methodPattern.exec(line) && !(line.includes(`public`) || line.includes(`private`) || line.includes(`protected`))){
			recordLine[index] = `public ${line.trimLeft()}`
		}
	})
	recordLine.forEach(function(line){
		if(sizePattern.exec(line)){
			moveToSettings(line)
		}
		if(fullScreenPattern.exec(line)){
			moveToSettings(line)
		}
		if(smoothPattern.exec(line)){
			moveToSettings(line)
		}
		if(noSmoothPatterns.exec(line)){
			moveToSettings(line)
		}
	})
	cookSettingsContext(unProcessedTest)
	recordLine.forEach(function(line,index){
		if(sizePattern.exec(line) || fullScreenPattern.exec(line) || smoothPattern.exec(line) || noSmoothPatterns.exec(line)){
			recordLine[index] = ``
		}
	})
	recordLine.forEach(function(line){
		newUnProcessedText = `${newUnProcessedText}\n${line}`
	})
	return newUnProcessedText
}

export function disableSettingsBeforeParse() {
	isSettingsRequired = false
}

// TODO - appends a new line for every character change after settings is initiated - fix it
function moveToSettings(line: String) {
	isSettingsRequired = true
	settingsSet.add(line);
}

function cookSettingsContext(unProcessedTest: String){
	settingsContext = ``
	settingsSet.forEach(function(setting : any){
		if(unProcessedTest.includes(setting)){
			settingsContext = `${settingsContext}\n${setting}`
		}
	})
}

function settingsPreprocessing(): String{
	let generateSettings: String = ""
	if(isSettingsRequired){
		generateSettings = `
public void settings(){
${settingsContext}
}`
	} else {
		settingsContext = ``
		disableSettingsBeforeParse()
	}
	return generateSettings
}

function preprocessingFooter(): String{
	let generatedFooter: String = `
public static void main(String[] args) {
PApplet.main(\"${defaultClassName}\");
}`
	return generatedFooter
}