
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
//  - 'delay()', -> (number)
//  - 'frameRate()', -> (number)
//  - 'pixelDensity()', -> (number)
//  - 'settings()', -> (function)
//  - 'size()', -> (n,n) or (n,n,renderer)
//  - 'smooth()', -> (number -> level)
export const P_ENVI_METHODS : string[] = [
	'cursor()',
	'displayDensity()',
	'fullScreen()',
	'noCursor()',
	'noSmooth()',
]

// Processing `Environment` Var
export const P_ENVI_VAR: string[] = [
	'focused', 
	'frameCount', 
	'framerRate', 
	'height', 
	'pixelHeight', 
	'pixelWidth', 
	'width'
]

// Processing `String Fun`
// Includes snippets :
//'join()', -> (list, separator)
//'match()', -> (str, regexp)
//'matchAll()', -> (str, regexp)
//'nf()', -> (num)
//'nf()', -> (num, digits)
//'nf()', -> (num, left, right)
//'nfc()', -> (num)
//'nfc()', -> (num, right)
//'nfp()', -> (num, digits)
//'nfp()', -> (nnum, left, right)
//'nfs()', -> (num, digits)
//'nfs()', -> (num, left, right)
//'split()', -> (value, delim)
//'splitTokens()', -> (value, delim)
//'splitTokens()', -> (value)
//'trim()' -> (str)
//'trim()' -> (array)
export const P_STR_FUN: string[] = []

// Processing Array Functions
export const P_ARR_FUN: string[] = [
	'append()',
	'arrayCopy()',
	'concat()',
	'expand()',
	'reverse()',
	'shorten()',
	'sort()',
	'splice()',
	'subset()'
]

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