# Processing Language Server - Prebuild scripts
GREEN='\033[1;32m'
NC='\033[0m'

echo "${GREEN}Performing Server Cleanup...${NC}"
# Clean Server
rm -R ./node_modules
cd ./client
rm -R ./node_modules
rm -R ./out
cd ../server
rm -R ./node_modules
rm -R ./out
cd ..
rm -R ./pcore
echo "${GREEN}Server Cleanup successful.!${NC}"