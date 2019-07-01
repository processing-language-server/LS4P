import * as _j from "./terms/javaspecific"
import * as _p from "./terms/processingspecific"
import * as _o from "./objectTerms/PObjectCompletion"

export const containAllKeys: string[][] = [
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
export const containAllKeysType: number[] = [
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

export const PShapeCompletion: string[][] = [
	_o.PShapeMethods,
	_o.PShapeVal
]

export const PShapeCompletionType: number[] = [
	2,
	10
]

export const PImageCompletion: string[][] = [
	_o.PImageMethods,
	_o.PImageVal
]

export const PImageCompletionType: number [] = [
	2,
	12
]

export const PVectorCompletion: string[][] = [
	_o.PVectorMethods
]

export const PVectorCompletionType: number[] = [
	2
]