import * as lsp from 'vscode-languageserver';
import { CompletionItemKind } from 'vscode-languageserver';
import * as _j from "./grammer/terms/javaspecific"
import * as _p from "./grammer/terms/processingspecific"

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

export function obtainCompletionList(): lsp.CompletionItem[] {
	let completionItemList: lsp.CompletionItem[] = []
	let _addIncValue: number = 0
	let _incKeyList: number = 0
	let containAllKeys: string[][] = [
		_j.METHOD_BODY_KEYWORDS,
		_p.P_CONVERSIONS,
		_p.P_CONSTANTS,
		_p.P_STRUCTURE_METHODS,
		_p.P_ENVI_METHODS,
		_p.P_ENVI_VAR,
		_p.P_STR_FUN,
		_p.P_ARR_FUN,
		_p.P_SHAPE_FUN,
		_p.P_SHAPE_CLASS,
		_p.P_2D_PRIM,
		_p.P_CURVES,
		_p.P_3D_PRIM,
		_p.P_ATTR,
		_p.P_VERTEX,
		_p.P_LOAD,
		_p.PI_MOUSE_FUN,
		_p.PI_MOUSE_VAR,
		_p.PI_KEY_FUN,
		_p.PI_KEY_VAR,
		_p.PI_FILES,
		_p.PI_TIME,
		_p.PO_TEXTAREA,
		_p.PO_IMG,
		_p.PO_FILES,
		_p.P_TRANS,
		_p.P_LIGHTS,
		_p.P_CAMERA,
		_p.P_COOR,
		_p.P_MATOBJ,
		_p.P_COLOR_SET,
		_p.P_COLOR_CREATING,
		_p.P_IMG_FUN,
		_p.P_IMG_CLASS,
		_p.P_IMG_LOAD,
		_p.P_IMG_TEX,
		_p.P_IMG_PIXELS,
		_p.P_RENDER_FUN,
		_p.P_RENDER_CLASS,
		_p.P_FONT_CLASS,
		_p.P_FONT_FUN,
		_p.P_MATH_CLASS,
		_p.P_CALC,
		_p.P_RANDOM
	]
	// Corresponding Type for entries in `containAllKeys`
	let overAllCompletiontype: number[] = [
		14,
		2,
		21,
		2,
		2,
		10,
		2,
		2,
		2,
		7,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		10,
		2,
		10,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		7,
		2,
		2,
		2,
		2,
		7,
		7,
		2,
		7,
		2,
		2

	]
	containAllKeys.forEach(function(value){
		value.forEach(function(_){
			completionItemList[_addIncValue] = asCompletionItem(_, 
				findCompletionItemKind(overAllCompletiontype[_incKeyList]), 
				_addIncValue)
			_addIncValue += 1
		})
		_incKeyList += 1
	})
	return completionItemList
}