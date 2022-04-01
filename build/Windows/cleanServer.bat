@ECHO off
ECHO === Processing Language Server - Cleanup ===
ECHO.

cd ../../

ECHO Preforming extenstion cleanup
rd /s /q "./node_modules"
rd /s /q "./pcore"
ECHO Extenstion cleanup succesful
ECHO.

ECHO Preforming client cleanup
cd ./client
rd /s /q "./node_modules"
rd /s /q "./out"
ECHO Client cleanup succesful
ECHO.

ECHO Preforming server cleanup
cd ../server
rd /s /q "./node_modules"
rd /s /q "./out"
ECHO Server cleanup succesful
ECHO.

cd ../build/Windows
ECHO Clean up succesful