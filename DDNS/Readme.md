Prerequisites:
- node js
- truffle
- metamask

How to:
 - run unit test
 1. Open power shell window and go to DDNS project folder
 2. Install missing packages  'npm install'
 3. Run local blockchain 'truffle develop'
 4. Execute test. Open another power shell go to DDNS project folder 'truffle test'
 
 - run web
 1. Run local blockchain 'truffle develop' 
 2. Open power shell and go to web folder
 3. You need to publish DDNS.sol to blockchain, there is a file for that. Type 'node publish.js'
 4. Copy produced contract address and past it in script.js
 5. Type http-server
 You can edit html sites thought provided ips usually this is 127.0.0.1:8080
 