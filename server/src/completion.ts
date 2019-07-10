import * as lsp from 'vscode-languageserver';
import { CompletionItemKind } from 'vscode-languageserver';
import * as server from './server'
const exec = require('child_process').execSync;
const fs = require('fs');
const { JavaClassFileReader } = require('java-class-tools')

export const reader = new JavaClassFileReader();

// exec(`mkdir ${__dirname}/processing/extractor`)
// exec(`mkdir ${__dirname}/processing/container`)
// exec(`mv ${__dirname.substring(0,__dirname.length-4)}/src/processing/class ${__dirname}/processing`)
exec(`unzip -o ${__dirname.substring(0,__dirname.length-4)}/src/processing/jar/core.jar -d ${__dirname}/processing/extractor`)
exec(`ls ${__dirname}/processing/extractor/processing/core | tee ${__dirname}/processing/container/core.txt`)
exec(`ls ${__dirname}/processing/extractor/processing/awt | tee ${__dirname}/processing/container/awt.txt`)
exec(`ls ${__dirname}/processing/extractor/processing/data | tee ${__dirname}/processing/container/data.txt`)
exec(`ls ${__dirname}/processing/extractor/processing/event | tee ${__dirname}/processing/container/event.txt`)
exec(`ls ${__dirname}/processing/extractor/processing/javafx | tee ${__dirname}/processing/container/javafx.txt`)
exec(`ls ${__dirname}/processing/extractor/processing/opengl | tee ${__dirname}/processing/container/opengl.txt`)

let extractionModules = [
	`${__dirname}/processing/container/core.txt`, 
	`${__dirname}/processing/container/awt.txt`, 
	`${__dirname}/processing/container/data.txt`, 
	`${__dirname}/processing/container/event.txt`, 
	`${__dirname}/processing/container/javafx.txt`, 
	`${__dirname}/processing/container/opengl.txt`
]

let extractionModuleType = [
	'CORE',
	'AWT',
	'DATA',
	'EVENT',
	'JAVAFX',
	'OPENGL'
]

let classMap = new Map()
let completeClassMap = new Map()

for(let _counter: number = 0; _counter < 6; _counter++){
	try {  
		let data = fs.readFileSync(extractionModules[_counter], 'utf-8')
		let tempSplit = data.split('\n')
		let tempCheck: String[] = []
		let _innerCounter = 0
		tempSplit.forEach(function(className: any){
			if(!className.includes('$') && className.includes('.class')){
				tempCheck[_innerCounter] = className
				_innerCounter += 1
			}
		})
		classMap.set(extractionModuleType[_counter], tempCheck)
	} catch(e) {}
}

initAllCompletionClasses()

export function asCompletionItem(
	completionEntry: string, completionType: lsp.CompletionItemKind, data: number): lsp.CompletionItem {
	const item: lsp.CompletionItem = {
		label: completionEntry,
		kind: completionType,
		data: data
	}
	return item
}

export function findCompletionItemKind(value: number): lsp.CompletionItemKind{
	let completionKind: lsp.CompletionItemKind = CompletionItemKind.Text
	switch (value) {
		case 1:
			completionKind = CompletionItemKind.Text
			break;
		case 2:
			completionKind = CompletionItemKind.Method
			break;
		case 3:
			completionKind = CompletionItemKind.Function
			break;
		case 4:
			completionKind = CompletionItemKind.Constructor
			break;
		case 5:
			completionKind = CompletionItemKind.Field
			break;
		case 6:
			completionKind = CompletionItemKind.Variable
			break;
		case 7:
			completionKind = CompletionItemKind.Class
			break;
		case 8:
			completionKind = CompletionItemKind.Interface
			break;
		case 9:
			completionKind = CompletionItemKind.Module
			break;
		case 10:
			completionKind = CompletionItemKind.Property
			break;
		case 11:
			completionKind = CompletionItemKind.Unit
			break;
		case 12:
			completionKind = CompletionItemKind.Value
			break;
		case 13:
			completionKind = CompletionItemKind.Enum
			break;
		case 14:
			completionKind = CompletionItemKind.Keyword
			break;
		case 15:
			completionKind = CompletionItemKind.Snippet
			break;
		case 16:
			completionKind = CompletionItemKind.Color
			break;
		case 17:
			completionKind = CompletionItemKind.File
			break;
		case 18:
			completionKind = CompletionItemKind.Reference
			break;
		case 19:
			completionKind = CompletionItemKind.Folder
			break;
		case 20:
			completionKind = CompletionItemKind.EnumMember
			break;
		case 21:
			completionKind = CompletionItemKind.Constant
			break;
		case 22:
			completionKind = CompletionItemKind.Struct
			break;
		case 23:
			completionKind = CompletionItemKind.Event
			break;
		case 24:
			completionKind = CompletionItemKind.Operator
			break;
		case 25:
			completionKind = CompletionItemKind.TypeParameter
			break;
		default:
			break;
	}
	return completionKind
}

function PCompletionMethods(classType: any): lsp.CompletionItem[] {
	let completionItemList: lsp.CompletionItem[] = []
	let _addIncValue: number = 0
	classType.methods.forEach((method:any) => {
		const nameInConstantPool = classType.constant_pool[method.name_index];
		// const signatureInConstantPool = classType.constant_pool[method.descriptor_index];

		const name = String.fromCharCode.apply(null, nameInConstantPool.bytes);
		// const signature = String.fromCharCode.apply(null, signatureInConstantPool.bytes)

		completionItemList[_addIncValue] = asCompletionItem(`${name}()`, 
			findCompletionItemKind(2), 
			_addIncValue)
		_addIncValue += 1

	});
	return completionItemList
}

function initAllCompletionClasses(){
	extractionModuleType.forEach(function(value){
		classMap.get(value).forEach((element: String) => {
			completeClassMap.set(element, PCompletionMethods(reader.read(`${__dirname}/processing/extractor/processing/${value}/${element}`)))
		})
	})
}

export function decideCompletionMethods(obtainedClass: String): lsp.CompletionItem[] {
	let resultantCompletionItem: lsp.CompletionItem[] = []

	// TODO: Remove this switch once the sketched is preprocessed and ready
	switch(obtainedClass){
		case "PApplet":
			resultantCompletionItem = completeClassMap.get('PApplet.class')
			break
		case "PFont":
			resultantCompletionItem = completeClassMap.get('PFont.class')
			break
		case "PGraphics":
			resultantCompletionItem = completeClassMap.get('PGraphics.class')
			break
		case "PImage":
			resultantCompletionItem = completeClassMap.get('PImage.class')
			break
		case "PMatrix":
			resultantCompletionItem = completeClassMap.get('PMatrix.class')
			break
		case "PMatrix2D":
			resultantCompletionItem = completeClassMap.get('PMatrix2D.class')
			break
		case "PMatrix3D":
			resultantCompletionItem = completeClassMap.get('PMatrix3D.class')
			break
		case "PShape":
			resultantCompletionItem = completeClassMap.get('PShape.class')
			break
		case "PShapeOBJ":
			resultantCompletionItem = completeClassMap.get('PShapeOBJ.class')
			break
		case "PShapeSVG":
			resultantCompletionItem = completeClassMap.get('PShapeSVG.class')
			break
		case "PStyle":
			resultantCompletionItem = completeClassMap.get('PStyle.class')
			break
		case "PSurface":
			resultantCompletionItem = completeClassMap.get('PSurface.class')
			break
		case "PSurfaceNone":
			resultantCompletionItem = completeClassMap.get('PSurfaceNone.class')
			break
		case "PVector":
			resultantCompletionItem = completeClassMap.get('PVector.class')
			break
	}
	return resultantCompletionItem
}