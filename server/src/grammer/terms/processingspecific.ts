
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
// Includes snippets : -> snippets suspended for now
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
	'delay()',
	'frameRate()',
	'pixelDensity()', 
	'size()',
	'smooth()'
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
// Includes snippets : - snippets suspended for now
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
export const P_STR_FUN: string[] = [
	'join()',
	'match()',
	'matchAll()',
	'nf()',
	'nfc()',
	'nfp()',
	'nfs()',
	'split()',
	'splitTokens()',
	'trim()'
]

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

// Processing Shapes functions
export const P_SHAPE_FUN: string[] = [
	'createShape()',
	'loadShape()'
]

// Processing Shapes Classes
export const P_SHAPE_CLASS: string[] = [
	'PShape'
]

export const P_2D_PRIM: string[] = [
	'arc()',
	'circle()',
	'ellipse()',
	'line()',
	'point()',
	'quad()',
	'rect()',
	'square()',
	'triangle()'
]

export const P_CURVES: string[] = [
	'bezier()',
	'bezierDetail()',
	'bezierPoint()',
	'bezierTangent()',
	'curve()',
	'curveDetail()',
	'curvePoint()',
	'curveTangent()',
	'curveTightness()'
]

export const P_3D_PRIM: string[] = [
	'box()',
	'sphere()',
	'sphereDetail()'
]

export const P_ATTR: string[] = [
	'ellipseMode()',
	'rectMode()',
	'strokeCap()',
	'strokeJoin()',
	'strokeWeight()'
]

export const P_VERTEX: string[] = [
	'beginContour()',
	'beginShape()',
	'bezierVertex()',
	'curveVertex()',
	'endContour()',
	'endShape()',
	'quadraticVertex()',
	'vertex()'
]

export const P_LOAD: string[] = [
	'shape()',
	'shapeMode()'
]

export const PI_MOUSE_FUN: string[] = [
	'mouseClicked()',
	'mouseDragged()',
	'mouseMoved()',
	'mousePressed()',
	'mouseReleased()',
	'mouseWheel()'
]

export const PI_MOUSE_VAR: string[] = [
	'mouseButton',
	'mousePressed',
	'mouseX',
	'mouseY',
	'pmouseX',
	'pmouseY'
]

export const PI_KEY_FUN: string[] = [
	'keyPressed()',
	'keyReleased()',
	'keyTyped()'
]

export const PI_KEY_VAR: string[] = [
	'key',
	'keyCode',
	'keyPressed'
]

export const PI_FILES: string[] = [
	'createInput()',
	'createReader()',
	'launch()',
	'loadBytes()',
	'loadJSONArray()',
	'loadJSONObject()',
	'loadStrings()',
	'loadTable()',
	'loadXML()',
	'parseJSONArray()',
	'parseJSONObject()',
	'parseXML()',
	'selectFolder()',
	'selectInput()'
]

export const PI_TIME: string[] = [
	'day()',
	'hour()',
	'millis()',
	'minute()',
	'month()',
	'second()',
	'year()'
]

export const PO_TEXTAREA: string[] = [
	'print()',
	'printArray()',
	'println()'
]

export const PO_IMG: string[] = [
	'save()',
	'saveFrame()'
]

export const PO_FILES: string[] = [
	'beginRaw()',
	'beginRecord()',
	'createOutput()',
	'createWriter()',
	'endRaw()',
	'endRecord()',
	'saveBytes()',
	'saveJSONArray()',
	'saveJSONObject()',
	'saveStream()',
	'saveStrings()',
	'saveTable()',
	'saveXML()',
	'selectOutput()',
]

export const P_TRANS: string[] = [
	'applyMatrix()',
	'popMatrix()',
	'printMatrix()',
	'pushMatrix()',
	'resetMatrix()',
	'rotate()',
	'rotateX()',
	'rotateY()',
	'rotateZ()',
	'scale()',
	'shearX()',
	'shearY()',
	'translate()',
]

export const P_LIGHTS: string[] = [
	'ambientLight()',
	'directionalLight()',
	'lightFalloff()',
	'lights()',
	'lightSpecular()',
	'noLights()',
	'normal()',
	'pointLight()',
	'spotLight()'
]

export const P_CAMERA: string[] = [
	'beginCamera()',
	'camera()',
	'endCamera()',
	'frustum()',
	'ortho()',
	'perspective()',
	'printCamera()',
	'printProjection()'
]

export const P_COOR: string[] = [
	'modelX()',
	'modelY()',
	'modelZ()',
	'screenX()',
	'screenY()',
	'screenZ()'
]

export const P_MATOBJ: string[] = [
	'ambient()',
	'emissive()',
	'shininess()',
	'specular()'
]

export const P_COLOR_SET: string[] = [ 
	'background()',
	'clear()',
	'colorMode()',
	'fill()',
	'noFill()',
	'noStroke()',
	'stroke()'
]

export const P_COLOR_CREATING: string[] = [
	'alpha()',
	'blue()',
	'brightness()',
	'color()',
	'green()',
	'hue()',
	'lerpColor()',
	'red()',
	'saturation()',
]

export const P_IMG_FUN: string[] = [
	'createImage()'
]

export const P_IMG_CLASS: string[] = [
	'PImage'
]

export const P_IMG_LOAD: string[] = [
	'image()',
	'imageMode()',
	'loadImage()',
	'noTint()',
	'requestImage()',
	'tint()'
]

export const P_IMG_TEX: string[] = [
	'texture()',
	'textureMode()',
	'textureWrap()'
]

export const P_IMG_PIXELS: string[] = [
	'blend()',
	'copy()',
	'filter()',
	'get()',
	'loadPixels()',
	'set()',
	'updatePixels()'
]

export const P_RENDER_FUN: string[] = [
	'blendMode()',
	'clip()',
	'createGraphics()',
	'noClip()',
	'loadShader()',
	'resetShader()',
	'shader()'
]

export const P_RENDER_CLASS: string[] = [
	'PGraphics',
	'PShader'
]

export const P_FONT_CLASS: string[] = [
	'PFont'
]

export const P_FONT_FUN: string[] = [
	'createFont()',
	'loadFont()',
	'text()',
	'textFont()',
	'textAlign()',
	'textLeading()',
	'textMode()',
	'textSize()',
	'textWidth()',
	'textAscent()',
	'textDescent()'
]

export const P_MATH_CLASS: string[] = [
	'PVector'
]

export const P_CALC: string[] = [
	'abs()',
	'ceil()',
	'constrain()',
	'dist()',
	'exp()',
	'floor()',
	'lerp()',
	'log()',
	'mag()',
	'map()',
	'max()',
	'min()',
	'norm()',
	'pow()',
	'round()',
	'sq()',
	'sqrt()',
	'acos()',
	'asin()',
	'atan()',
	'atan2()',
	'cos()',
	'degrees()',
	'radians()',
	'sin()',
	'tan()'
]

export const P_RANDOM: string[] = [
	'noise()',
	'noiseDetail()',
	'noiseSeed()',
	'random()',
	'randomGaussian()',
	'randomSeed()'
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