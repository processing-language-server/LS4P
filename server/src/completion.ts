import * as lsp from 'vscode-languageserver';
import { CompletionItemKind, CompletionParams, TextDocument } from 'vscode-languageserver';
import * as preprocessing from './preprocessing'
import * as pStandards from './grammer/terms/preprocessingsnippets'
import * as parser from './parser';
import { MethodBodyContext, ClassOrInterfaceTypeContext, VariableDeclaratorIdContext} from 'java-ast/dist/parser/JavaParser';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import * as astUtils from './astutils'
import * as model from './grammer/terms/model'
import { ParseTree } from 'antlr4ts/tree/ParseTree';
const exec = require('child_process').execSync;
const fs = require('fs');
const { JavaClassFileReader } = require('java-class-tools')

export const reader = new JavaClassFileReader();

// exec(`mkdir ${__dirname}/processing/extractor`)
// exec(`mkdir ${__dirname}/processing/container`)
// exec(`mkdir ${__dirname}/processing/custom`)
// exec(`mkdir ${__dirname}/processing/customcontainer`)
// exec(`mv ${__dirname.substring(0,__dirname.length-4)}/src/processing/class ${__dirname}/processing`)
exec(`unzip -o ${__dirname.substring(0,__dirname.length-4)}/src/processing/jar/core.jar -d ${__dirname}/processing/extractor`)
exec(`unzip -o ${__dirname.substring(0,__dirname.length-4)}/src/processing/jar/custom.jar -d ${__dirname}/processing/custom`)
exec(`ls ${__dirname}/processing/custom | tee ${__dirname}/processing/customcontainer/custom.txt`)
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

let currentCompletionClass = `PApplet`

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

function initAllCompletionClasses(){
	extractionModuleType.forEach(function(value){
		classMap.get(value).forEach((element: String) => {
			completeClassMap.set(element, PCompletionMethods(reader.read(`${__dirname}/processing/extractor/processing/${value}/${element}`)))
		})
	})
}

let completeCustomMap = new Map()

try{
	let data = fs.readFileSync(`${__dirname}/processing/customcontainer/custom.txt`, 'utf-8')
	let customSplitMap = data.split('\n')
	customSplitMap.forEach(function(value: string){
		if(value.includes(`.class`)){
			completeCustomMap.set(value, PCompletionMethods(reader.read(`${__dirname}/processing/custom/${value}`)))
		}
	})
} catch(e) {}

export function asCompletionItem(
	completionEntry: string, completionType: lsp.CompletionItemKind): lsp.CompletionItem {
	const item: lsp.CompletionItem = {
		label: completionEntry,
		kind: completionType,
		filterText: completionEntry
	}
	return item
}

function PCompletionMethods(classType: any): lsp.CompletionItem[] {
	let completionItemList: lsp.CompletionItem[] = []
	let _addIncValue: number = 0
	let methodSet = new Set()
	let fieldSet = new Set()
	classType.methods.forEach((method:any) => {
		const nameInConstantPool = classType.constant_pool[method.name_index];
		// const signatureInConstantPool = classType.constant_pool[method.descriptor_index];

		const name = String.fromCharCode.apply(null, nameInConstantPool.bytes);
		// const signature = String.fromCharCode.apply(null, signatureInConstantPool.bytes)

		// To avoid duplicate results
		methodSet.add(name)
	});

	classType.fields.forEach((field:any) => {
		const nameInConstantPool = classType.constant_pool[field.name_index];
		// const signatureInConstantPool = classType.constant_pool[method.descriptor_index];

		const name = String.fromCharCode.apply(null, nameInConstantPool.bytes);
		// const signature = String.fromCharCode.apply(null, signatureInConstantPool.bytes)

		// To avoid duplicate results
		fieldSet.add(name)
	});

	methodSet.forEach(function(method){
		completionItemList[_addIncValue] = asCompletionItem(`${method}()`, 
			findCompletionItemKind(2))
		_addIncValue += 1
	})

	fieldSet.forEach(function(field){
		completionItemList[_addIncValue] = asCompletionItem(`${field}`, 
			findCompletionItemKind(5))
		_addIncValue += 1
	})

	return completionItemList
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

export function decideCompletionMethods(_textDocumentParams: CompletionParams, latestChanges: TextDocument): lsp.CompletionItem[] {
	let resultantCompletionItem: lsp.CompletionItem[] = []
	let lineStartMethodBody: number[] = []
	let lineEndMethodBody: number[] = []
	let avoidLineAuto: number[] = []
	let _methodCounter: number = 0
	let _avoidCounter: number = 0
	let _classNameCounter: number = 0

	// line starts from `0`
	let currentLineInWorkSpace = _textDocumentParams.position.line

	parser.wholeAST.forEach(function(node, index){

		if(node[0] instanceof MethodBodyContext){
			lineStartMethodBody[_methodCounter] = node[0]._start.line
			lineEndMethodBody[_methodCounter] = node[0]._stop!.line
			_methodCounter += 1
		}

		if(node[0] instanceof ErrorNode){
			avoidLineAuto[_avoidCounter] = node[0]._symbol.line
			_avoidCounter += 1
		}

	})

	parser.tokenArray.forEach(function(node, index){
		if(node[1] instanceof ClassOrInterfaceTypeContext && parser.tokenArray[index+1][1] instanceof VariableDeclaratorIdContext){
			model.variableDeclarationContext[_classNameCounter] = [node[0], parser.tokenArray[index+1][1]]
			_classNameCounter += 1
		}
	})

	if(preprocessing.defaultBehaviourEnable){
		lineStartMethodBody.forEach(function(value, index){
			lineStartMethodBody[index] = value - pStandards.reduceLineDefaultBehaviour
		})
		lineEndMethodBody.forEach(function(value, index){
			lineEndMethodBody[index] = value - pStandards.reduceLineDefaultBehaviour
		})
		avoidLineAuto.forEach(function(value, index){
			avoidLineAuto[index] = value - pStandards.reduceLineDefaultBehaviour
		})
	} else if(preprocessing.methodBehaviourEnable){
		lineStartMethodBody.forEach(function(value, index){
			lineStartMethodBody[index] = value - pStandards.reduceLineMethodBehaviour
		})
		lineEndMethodBody.forEach(function(value, index){
			lineEndMethodBody[index] = value - pStandards.reduceLineMethodBehaviour
		})
		avoidLineAuto.forEach(function(value,index){
			avoidLineAuto[index] = value - pStandards.reduceLineMethodBehaviour
		})
	}

	lineStartMethodBody.forEach(function(value, index){
		if(value <= currentLineInWorkSpace && lineEndMethodBody[index] >= currentLineInWorkSpace){
			resultantCompletionItem = completeClassMap.get(`${currentCompletionClass}.class`)
		}
	})

	avoidLineAuto.forEach(function(value,index){
		// since the index in workspace starts with `0` -> currentLineInWorkSpace + 2 (1st -> variable declaration, 2nd -> no autocompletion for variable names)
		// avoid auto completion while naming varaibles
		if(value == currentLineInWorkSpace + 2){
			resultantCompletionItem = []
		}
	})

	// TODO: methods to avoid auto compleion during method declaration.'

	// Produces dynamic auto completion results on the presence of Trigger Character `.`
	let currentLineSplit = latestChanges.getText().split('\n')

	if(_textDocumentParams.context!.triggerCharacter == `.`){
		let tempLine = currentLineSplit[currentLineInWorkSpace].split(`.`)[0].split(` `)
		let objectName = tempLine[tempLine.length-1]
		resultantCompletionItem = completeClassMap.get(`${objectName}.class`)
	}

	if(model.variableDeclarationContext.length > 0){
		model.variableDeclarationContext.forEach(function(value, index){
			if(_textDocumentParams.context!.triggerCharacter == `.`){
				let tempLine = currentLineSplit[currentLineInWorkSpace].split(`.`)[0].split(` `)
				let objectName = tempLine[tempLine.length-1]
				if(value[1].text == objectName){
					resultantCompletionItem = completeClassMap.get(`${value[0].text}.class`)
					if(resultantCompletionItem == undefined){
						resultantCompletionItem = completeCustomMap.get(`${value[0].text}.class`)
						if(resultantCompletionItem == undefined){
							// Handle for locally declared classes
							astUtils.constructClassParams(parser.tokenArray)
							let tempCompletionList: lsp.CompletionItem[] = []
							let _tempCounter = 0
							astUtils.fieldAndClass.forEach(function(fieldName,index){
								if(fieldName[0] == value[0].text){
									tempCompletionList[_tempCounter] = asCompletionItem(fieldName[1], findCompletionItemKind(5))
									_tempCounter += 1
								}
							})
							astUtils.memberAndClass.forEach(function(methodName,index){
								if(methodName[0] == value[0].text){
									tempCompletionList[_tempCounter] = asCompletionItem(`${methodName[1]}()`, findCompletionItemKind(2))
									_tempCounter += 1
								}
							})
							resultantCompletionItem = tempCompletionList
							astUtils.flushRecords()
						}
					}
				}
			}
		})
	}

	// Local class declaration and their dependent fields / methods for auto completion

	model.clearVaribaleDeclarationContext()
	model.clearLocalClassDeclarators()

	return resultantCompletionItem
}