
export const classChecker = `class`

// Dynamic Imports should take format - `import __.__.__;`
export let dynamicImports = ``
const sizeX = 300
const sizeY = 300
const fillR = 120
const fillG = 50
const fillB = 240
export let defaultClassName = "ProcessingDefault"
const defaultLib = `PApplet`

export function setDefaultClassName(className : String){
	defaultClassName = className as string
}

// dynamic imports can increase in line number so handle it properly when it comes to dyagnostic line positions
export function defaultBehaviour(unProcessedTest: String): String {
	let processedText = `
import processing.core.${defaultLib};
${dynamicImports}
public class ${defaultClassName} extends ${defaultLib}{
public static void main(String[] args) {
PApplet.main(\"${defaultClassName}\");
}
public void settings(){
size(${sizeX},${sizeY});
}
public void setup(){
fill(${fillR},${fillG},${fillB});
}
public void draw(){
${unProcessedTest}
}
}
`
	return processedText
}

// dynamic imports can increase in line number so handle it properly when it comes to dyagnostic line positions
export function methodBehaviour(unProcessedTest: String): String {
	let processedText = `
import processing.core.${defaultLib};
${dynamicImports}
public class ${defaultClassName} extends ${defaultLib}{
public static void main(String[] args) {
PApplet.main(\"${defaultClassName}\");
}
${unProcessedTest}
}
`
	return processedText
}

export function rawBehaviour(unProcessedTest: String): String {
	let processedText = `${unProcessedTest}`
	return processedText
}