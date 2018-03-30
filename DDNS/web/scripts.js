window.onload = function () {
    if (typeof web3 === 'undefined') {
        //if there is no web3 variable
        showMessage(false, "You are not connected to metamask !");
    } else {
        init();
        showMessage(true, "All settings works as expected !");
    }
}

class DDNSManager {
    constructor(address) {
        this.address = address;
    }

    getPrice(domain) {
        
        var price = "unknown";
        contractInstance.getPrice(domain,  async function (err, res) {
            if (!err) {
                price = res.valueOf();
                console.log("Price for domain " + domain + " is: " + res.valueOf() + " wei");
                //showMessage(true, "Price is: " + web3.fromWei(price, "ether") + " ethers");

            } else {
                console.log("Some Error occured: " + err);
                //showMessage(false, "There is something wrong with your request");
            }
        });

        console.log(price);

        return price;
    }
}

var ddnsManager = new DDNSManager("ssss");


var contractInstance;
var currentAccount;

var abi = [
{
"constant": false,
"inputs": [
{
"name": "domain",
"type": "bytes"
},
{
"name": "newIp",
"type": "bytes4"
}
],
"name": "edit",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"constant": false,
"inputs": [],
"name": "withdraw",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"constant": true,
"inputs": [
{
"name": "domain",
"type": "bytes"
}
],
"name": "getPrice",
"outputs": [
{
"name": "",
"type": "uint256"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": true,
"inputs": [],
"name": "getOwner",
"outputs": [
{
"name": "",
"type": "address"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": true,
"inputs": [
{
"name": "addr",
"type": "address"
}
],
"name": "getReceiptsByAccount",
"outputs": [
{
"components": [
{
"name": "amountPaidWei",
"type": "uint256"
},
{
"name": "timestamp",
"type": "uint256"
},
{
"name": "expires",
"type": "uint256"
}
],
"name": "",
"type": "tuple[]"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": false,
"inputs": [
{
"name": "domain",
"type": "bytes"
},
{
"name": "newOwner",
"type": "address"
}
],
"name": "transferDomain",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"constant": true,
"inputs": [
{
"name": "",
"type": "address"
},
{
"name": "",
"type": "uint256"
}
],
"name": "receipts",
"outputs": [
{
"name": "amountPaidWei",
"type": "uint256"
},
{
"name": "timestamp",
"type": "uint256"
},
{
"name": "expires",
"type": "uint256"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": true,
"inputs": [
{
"name": "domain",
"type": "bytes"
}
],
"name": "getIP",
"outputs": [
{
"name": "",
"type": "bytes4"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": true,
"inputs": [
{
"name": "domain",
"type": "bytes"
}
],
"name": "domainExist",
"outputs": [
{
"name": "",
"type": "bool"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": false,
"inputs": [
{
"name": "domain",
"type": "bytes"
},
{
"name": "ip",
"type": "bytes4"
}
],
"name": "register",
"outputs": [],
"payable": true,
"stateMutability": "payable",
"type": "function"
},
{
"constant": false,
"inputs": [
{
"name": "newOwner",
"type": "address"
}
],
"name": "transferOwnership",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"anonymous": false,
"inputs": [
{
"indexed": false,
"name": "domain",
"type": "bytes"
},
{
"indexed": false,
"name": "ip",
"type": "bytes4"
},
{
"indexed": false,
"name": "owner",
"type": "address"
},
{
"indexed": false,
"name": "timestamp",
"type": "uint256"
}
],
"name": "LogDomainRegistered",
"type": "event"
},
{
"anonymous": false,
"inputs": [
{
"indexed": false,
"name": "domain",
"type": "bytes"
},
{
"indexed": false,
"name": "timestamp",
"type": "uint256"
}
],
"name": "LogDomainExtended",
"type": "event"
},
{
"anonymous": false,
"inputs": [
{
"indexed": false,
"name": "domain",
"type": "bytes"
},
{
"indexed": false,
"name": "newIp",
"type": "bytes4"
},
{
"indexed": false,
"name": "timestamp",
"type": "uint256"
}
],
"name": "LogIpChanged",
"type": "event"
},
{
"anonymous": false,
"inputs": [
{
"indexed": false,
"name": "domain",
"type": "bytes"
},
{
"indexed": false,
"name": "newOwerm",
"type": "address"
},
{
"indexed": false,
"name": "timestamp",
"type": "uint256"
}
],
"name": "LogDomainOwnerTransfered",
"type": "event"
},
{
"anonymous": false,
"inputs": [
{
"indexed": false,
"name": "value",
"type": "uint256"
},
{
"indexed": false,
"name": "timestamp",
"type": "uint256"
}
],
"name": "LogMoneyTransfered",
"type": "event"
},
{
"anonymous": false,
"inputs": [
{
"indexed": true,
"name": "previousOwner",
"type": "address"
},
{
"indexed": true,
"name": "newOwner",
"type": "address"
}
],
"name": "OwnershipTransferred",
"type": "event"
}
]
var address = "0x8cdaf0cd259887258bc13a92c0a6da92698644c0";

function showMessage(connected, message) {
    var msgSuccess = document.getElementById("messageSuccess");
    var msgFail = document.getElementById("messageFail");

    msgSuccess.innerText = "";
    msgFail.innerText = "";

    if (connected) {
        msgSuccess.innerText = message;
        msgSuccess.style.display = "block";

        msgFail.innerText = "";
        msgFail.style.display = "none";
    }
    else {
        msgSuccess.innerText = "";
        msgSuccess.style.display = "none";

        msgFail.innerText = message;
        msgFail.style.display = "block";
    }
}

function init() {
    var Contract = web3.eth.contract(abi);
    contractInstance = Contract.at(address);
    updateAccount();
}

function updateAccount() {
    //in metamask, the accounts array is of size 1 and only contains the currently selected account. The user can select a different account and so we need to update our account variable
    currentAccount = web3.eth.accounts[0];
}


function registerDomain(price) {
    var domain = document.getElementById("domain").value;
    var ip = document.getElementById("ip").value;

    contractInstance.register(domain, ip, { "from": currentAccount, "value": price }, function (err, res) {
        if (!err) {
            console.log("Transaction Hash : " + res.valueOf());
            showMessage(true, "Congratulations! Tx hash: " + res.valueOf());
        } else {
            console.log("Some Error occured: " + err);
            showMessage(false, "There is something wrong with your request");
        }
    });
}

function onButtonRegisterClicked() {
    var domain = document.getElementById("domain").value;

    contractInstance.getPrice(domain, function (err, res) {
        if (!err) {
            var price = res.valueOf();
            console.log("Price for domain " + domain + " is: " + res.valueOf() + " wei");
            registerDomain(price, domain, ip);

        } else {
            console.log("Some Error occured: " + err);
            showMessage(false, "There is something wrong with your request");
        }
    });
}

function onButtonCheckPriceClicked() {
    var domain = document.getElementById("domain").value;
    var price = ddnsManager.getPrice(domain);
}

function onButtonDomainExistClicked() {
    var domain = document.getElementById("domain").value;

    contractInstance.domainExist(domain, function (err, res) {
        if (!err) {          
            console.log("Domain exists: " + res);
            var isFree = res == true ? "in use" : "free";
            var message = "Domain is " + isFree + " !";
            showMessage(true, message);

        } else {
            console.log("Some Error occured: " + err);
            showMessage(false, "There is something wrong with your request");
        }
    });
}

function onButtonTransferDomainClicked() {
    var domain = document.getElementById("domain").value;
    var newOwner = document.getElementById("new-owner").value;

    contractInstance.transferDomain(domain, newOwner, function (err, res) {
        if (!err) {
            var price = res.valueOf();
            console.log("New owner is: " + newOwner);
            showMessage(true, "Congratulation! Successfull changed owner " + newOwner);

        } else {
            console.log("Some Error occured: " + err);
            showMessage(false, "There is something wrong with your request");
        }
    });
}



