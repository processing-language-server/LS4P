
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

export const reduceLineDefaultBehaviour = 13
export const reduceLineMethodBehaviour = 12

export function setDefaultClassName(className : String){
	defaultClassName = className as string
}

// dynamic imports can increase in line number so handle it properly when it comes to dyagnostic line positions
export function defaultBehaviour(unProcessedTest: String): String {
	let processedText = `
${dynamicImports}
public class ${defaultClassName} extends ${defaultLib}{
public void setup(){
${unProcessedTest}
}
}
`
	return processedText
}

// dynamic imports can increase in line number so handle it properly when it comes to dyagnostic line positions
export function methodBehaviour(unProcessedTest: String): String {
	let processedText = `
${dynamicImports}
public class ${defaultClassName} extends ${defaultLib}{
${unProcessedTest}
}
`
	return processedText
}

export function mapperPipeline(){
	// Handle PApplet conversions such as float() to PApplet.parseFloat()
	// Provide Access Specifiers
	// handle floating points and doubles
}