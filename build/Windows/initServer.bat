@echo off
echo === Processing Language Server - Init ===
echo.

cd ../../
set cwd=%cd%

echo Installing required node modules...
call npm install
echo Installation succesful
echo.

rem client directories
echo Creating client Directories...
mkdir %cwd%\client\out
mkdir %cwd%\client\out\class
echo Client directories created
echo.

rem server directories
echo Creating server Directories...
mkdir %cwd%\server\out
mkdir %cwd%\server\out\compile
mkdir %cwd%\server\out\logs
mkdir %cwd%\server\out\processing
mkdir %cwd%\server\out\processing\container
mkdir %cwd%\server\out\processing\custom
mkdir %cwd%\server\out\processing\customcontainer
mkdir %cwd%\server\out\processing\extractor
mkdir %cwd%\server\out\processing\insightscontainer
mkdir %cwd%\server\out\processing\lspinsights
echo Server directories created
echo.

rem Unpacking Processing core
echo Cooking processing core classes
mkdir %cwd%\pcore

rem copying archives
copy %cwd%\server\src\processing\lspinsights.zip %cwd%\server\out\processing\lspinsights 1>nul
echo Copied \server\src\processing\lspinsights.zip to \server\out\processing\lspinsights
copy %cwd%\server\src\processing\jar\custom.jar  %cwd%\server\out\processing\custom 1>nul
echo Copied \server\src\processing\jar\custom.jar to \server\out\processing\custom
copy %cwd%\server\src\processing\jar\core.jar    %cwd%\server\out\processing\extractor 1>nul
echo Copied \server\src\processing\jar\core.jar to \server\out\processing\extractor
copy %cwd%\server\src\processing\jar\core.jar    %cwd%\pcore 1>nul
echo Copied \server\src\processing\jar\core.jar to \pcore

rem unpacking archives
cd %cwd%\server\out\processing\lspinsights
echo Unpacking: %cwd%\server\out\processing\lspinsights\lspinsights.zip
jar xf %cwd%\server\out\processing\lspinsights\lspinsights.zip
del lspinsights.zip
cd %cwd%\server\out\processing\custom
echo Unpacking: %cwd%\server\out\processing\custom\custom.jar
jar xf %cwd%\server\out\processing\custom\custom.jar
del custom.jar
cd %cwd%\server\out\processing\extractor
echo Unpacking: %cwd%\server\out\processing\extractor\core.jar
jar xf %cwd%\server\out\processing\extractor\core.jar
del core.jar
cd %cwd%\pcore
echo Unpacking: %cwd%\pcore\core.jar
jar xf %cwd%\pcore\core.jar
del core.jar

rem listing folder contents
dir /B %cwd%\server\out\processing\lspinsights > %cwd%\server\out\processing\insightscontainer\insightlist.txt
call %cwd%\build\windows\tools\removeCR.bat %cwd%\server\out\processing\insightscontainer\insightlist.txt

dir /B %cwd%\server\out\processing\custom > %cwd%\server\out\processing\customcontainer\custom.txt
call %cwd%\build\windows\tools\removeCR.bat %cwd%\server\out\processing\customcontainer\custom.txt

dir /B %cwd%\server\out\processing\extractor\processing\core > %cwd%\server\out\processing\container\core.txt
call %cwd%\build\windows\tools\removeCR.bat %cwd%\server\out\processing\container\core.txt

dir /B %cwd%\server\out\processing\extractor\processing\awt > %cwd%\server\out\processing\container\awt.txt
call %cwd%\build\windows\tools\removeCR.bat %cwd%\server\out\processing\container\awt.txt

dir /B %cwd%\server\out\processing\extractor\processing\data> %cwd%\server\out\processing\container\data.txt
call %cwd%\build\windows\tools\removeCR.bat %cwd%\server\out\processing\container\data.txt

dir /B %cwd%\server\out\processing\extractor\processing\event > %cwd%\server\out\processing\container\event.txt
call %cwd%\build\windows\tools\removeCR.bat %cwd%\server\out\processing\container\event.txt

dir /B %cwd%\server\out\processing\extractor\processing\javafx > %cwd%\server\out\processing\container\javafx.txt
call %cwd%\build\windows\tools\removeCR.bat %cwd%\server\out\processing\container\javafx.txt

dir /B %cwd%\server\out\processing\extractor\processing\opengl > %cwd%\server\out\processing\container\opengl.txt
call %cwd%\build\windows\tools\removeCR.bat %cwd%\server\out\processing\container\opengl.txt

cd %cwd%

echo Core setup succesful
echo.

echo Processing Language Server initialized.!
echo Note: Make sure you have JAVA 8 installed so that you can run Processing sketches
echo Note: Make sure you have class path setup as environmental variables that point to Processing Core
echo.
echo Now Perform: Terminal -^> Run Build Task...
echo.
cd build/Windows
pause