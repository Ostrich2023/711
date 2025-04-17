# 711

IFN711
global installation
npm install -g firebase-tools

Functions
#1. npm init -y
#2. npm install express mysql2 dotenv firebase-admin cors
#3. firebase emulators:start

Frontend
#1. npm init -y
#2. npm install firebase axios ethers react-router-dom firebase-tools
#3. npm install @mantine/core @mantine/hooks

how to run：
#1. back to ddigital-skill-wallet run code:firebase emulators:start --only functions
#2. cd to frontend run: npm run dev


Biqing Changes:(pending)
smart-contracts:
cd smart-contracts
#1 npm install --save-dev hardhat
#2 npx hardhat compile
#3 npx hardhat node        (#4 and #5 should be run at the same time, keep this running)
#4 npx hardhat run scripts/deploy.js --network localhost (and open a new terminal to run this line)
