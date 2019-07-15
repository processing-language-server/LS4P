
export const setUpChecker = `setup`
export const drawChecker = `draw`
export const classChecker = `class`
export const voidChecker = `void`
const sizeX = 300
const sizeY = 300
const fillR = 120
const fillG = 50
const fillB = 240
const defaultClassName = "ProcessingDefault"
const defaultLib = `PApplet`

export function defaultBehaviour(unProcessedTest: String): String {
	let processedText = `
	import processing.core.${defaultLib};
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

export function setupDrawBehaviour(unProcessedTest: String): String {
	let processedText = `
	import processing.core.${defaultLib};
	public class ${defaultClassName} extends ${defaultLib}{
    	public static void main(String[] args) {
    		PApplet.main(\"${defaultClassName}\");
    	}
   		${unProcessedTest}
	}
	`
	return processedText
}

export function classBehaviour(unProcessedTest: String): String {
	let processedText = `${unProcessedTest}`
	return processedText
}