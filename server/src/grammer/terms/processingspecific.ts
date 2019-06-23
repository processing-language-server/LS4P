
// Conversion of one datatype to another
export const P_CONVERSIONS : string[] = [
	'binary()',
	'boolean()',
	'byte()',
	'char()',
	'float()',
	'hex()',
	'int()',
	'str()',
	'unbinary()',
	'unhex()'
]

// Processing Specific Constants
export const P_CONSTANTS : string[] = [
	'HALF_PI',
	'PI',
	'QUARTER_PI',
	'TAU',
	'TWO_PI'
]

// Processing `Structure` Methods
// Note: Includes snippet : `thread`
export const P_STRUCTURE_METHODS : string[] = [
	'exit()',
	'loop()',
	'noLoop()',
	'pop()',
	'popStyle()',
	'push()',
	'pushStyle()',
	'redraw()',
	'setup()',
	'draw()'
]

// Processing `Environment` Methods
// Includes snippets : 
//  - 'delay()', -> snippet (number)
//  - 'frameRate()', -> snippet (number)
//  - 'pixelDensity()', -> snippet (number)
//  - 'settings()', -> snippet (function)
//  - 'size()', -> snippet (n,n) or (n,n,renderer)
//  - 'smooth()', -> snippet (number -> level)
export const P_ENVI_METHODS : string[] = [
	'cursor()',
	'displayDensity()',
	'fullScreen()',
	'noCursor()',
	'noSmooth()',
]

// Processing `Environment` Var
export const P_ENVI_VAR : string[] = [
	'focused', 
	'frameCount', 
	'framerRate', 
	'height', 
	'pixelHeight', 
	'pixelWidth', 
	'width'
]