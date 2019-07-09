const { JavaClassFileReader } = require('java-class-tools');

// Obtain Reader
export const reader = new JavaClassFileReader();

let correctAbsolutePath = __dirname.substring(0, __dirname.length-6)

// Processing Core - PConstants - Attributes
export const PConstantsClass = reader.read(`${correctAbsolutePath}/class/core/PConstants.class`);

// Processing Core - Methods 
export const PAppletClass = reader.read(`${correctAbsolutePath}/class/core/PApplet.class`);
export const PFontClass = reader.read(`${correctAbsolutePath}/class/core/PFont.class`);
export const PGraphicsClass = reader.read(`${correctAbsolutePath}/class/core/PGraphics.class`);
export const PImageClass = reader.read(`${correctAbsolutePath}/class/core/PImage.class`);
export const PMatrixClass = reader.read(`${correctAbsolutePath}/class/core/PMatrix.class`);
export const PMatrixTwoDClass = reader.read(`${correctAbsolutePath}/class/core/PMatrix2D.class`);
export const PMatrixThreeDClass = reader.read(`${correctAbsolutePath}/class/core/PMatrix3D.class`);
export const PShapeClass = reader.read(`${correctAbsolutePath}/class/core/PShape.class`);
export const PShapeOBJClass = reader.read(`${correctAbsolutePath}/class/core/PShapeOBJ.class`);
export const PShapeSVGClass = reader.read(`${correctAbsolutePath}/class/core/PShapeSVG.class`);
export const PStyleClass = reader.read(`${correctAbsolutePath}/class/core/PStyle.class`);
export const PSurfaceClass = reader.read(`${correctAbsolutePath}/class/core/PSurface.class`);
export const PSurfaceNoneClass = reader.read(`${correctAbsolutePath}/class/core/PSurfaceNone.class`);
export const PVectorClass = reader.read(`${correctAbsolutePath}/class/core/PVector.class`);