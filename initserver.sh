# Processing Language Server - Prebuild scripts
GREEN='\033[1;32m'
RED='\033[0;31m'
YELLOW='\033[0;1;33m'
NC='\033[0m'

echo "${RED}Installing required node modules...${NC}"
# install required node_modules
npm install
echo "${GREEN}Installation successful.!${NC}"

echo "${RED}Creating out Directories...${NC}"
cd ./client
mkdir out
cd ..
cd ./server
mkdir out
cd ..
echo "${GREEN}Creation successful.!${NC}"

echo "${RED}Cooking client directories...${NC}"
# making the class dir for sketch run
cd ./client/out
mkdir class
cd ..
cd ..
echo "${GREEN}Client setup successful.!${NC}"

echo "${RED}Cooking server directories...${NC}"
# making directories for server compilation
cd ./server/out
mkdir compile
mkdir processing
cd processing
mkdir container
mkdir custom
mkdir customcontainer
mkdir extractor
mkdir insightscontainer
mkdir lspinsights
echo "${GREEN}Server setup successful.!${NC}"

echo "${RED}Cooking Processing Core${NC}"
# extracting Processing core classes
cd ..
mkdir logs
cd ..
cd ..
mkdir pcore
unzip -o ./server/src/processing/lspinsights.zip -d ./server/out/processing/lspinsights
ls ./server/out/processing/lspinsights | tee ./server/out/processing/insightscontainer/insightlist.txt
unzip -o ./server/src/processing/jar/custom.jar -d ./server/out/processing/custom
ls ./server/out/processing/custom | tee ./server/out/processing/customcontainer/custom.txt
unzip -o ./server/src/processing/jar/core.jar -d ./pcore
unzip -o ./server/src/processing/jar/core.jar -d ./server/out/processing/extractor
ls ./server/out/processing/extractor/processing/core | tee ./server/out/processing/container/core.txt
ls ./server/out/processing/extractor/processing/awt | tee ./server/out/processing/container/awt.txt
ls ./server/out/processing/extractor/processing/data | tee ./server/out/processing/container/data.txt
ls ./server/out/processing/extractor/processing/event | tee ./server/out/processing/container/event.txt
ls ./server/out/processing/extractor/processing/javafx | tee ./server/out/processing/container/javafx.txt
ls ./server/out/processing/extractor/processing/opengl | tee ./server/out/processing/container/opengl.txt
echo "${GREEN}Core setup successful.!${NC}"

echo "${RED}Setting up Enviromental Varibales${NC}"
echo "export JAVA_HOME=\$(/usr/libexec/java_home -v 1.8)" >> ~/.bash_profile
echo "${GREEN}Variable setup successful.!${NC}"


echo "${GREEN}Processing Language Server initialized.!${NC}"
echo "${YELLOW}Note: Make sure you have JAVA 8 installed so that you can run Processing sketches${NC}"
echo "${YELLOW}Note: Make sure you have class path setup as environmental variables that point to Processing Core${NC}"

echo "${GREEN} Now Perform: Terminal -> Run Build Task...${NC}"