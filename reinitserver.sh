# Processing Language Server - Prebuild scripts
GREEN='\033[1;32m'
NC='\033[0m'

# Clean Server
rm -R ./node_modules
cd ./client
rm -R ./node_modules
rm -R ./out
cd ../server
rm -R ./node_modules
rm -R ./out
cd ..
echo "${GREEN}Server Cleanup successful.!${NC}"

# Init Server
sh initserver.sh