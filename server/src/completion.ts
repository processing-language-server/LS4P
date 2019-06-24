import * as lsp from 'vscode-languageserver';
import { CompletionItemKind } from 'vscode-languageserver';
import * as holder from './grammer/holder'

export let completionItemList: lsp.CompletionItem[] = []

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

export function cookModularCompletionList(): void {
	// Adapting to: 
	// - `PShape`
	// - `PImage`
	// - `PFont`
	// - `PShader`
	// - `PVector`
}

export function prepareCompletionList(): void {
	let _addIncValue: number = 0
	let _incKeyList: number = 0
	holder.containAllKeys.forEach(function(value){
		value.forEach(function(_){
			completionItemList[_addIncValue] = asCompletionItem(_, 
				findCompletionItemKind(holder.overAllCompletiontype[_incKeyList]), 
				_addIncValue)
			_addIncValue += 1
		})
		_incKeyList += 1
	})
}