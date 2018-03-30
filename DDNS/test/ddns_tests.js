const DDNS = artifacts.require("DDNS");
var SECONDS_PER_DAY = 86400;
var ONE_ETHER = 1000000000000000000;

const timeTravel = function (time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time],
      id: new Date().getTime()
    }, (err, result) => {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}

const mineBlock = function () {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_mine"
    }, (err, result) => {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}

contract('DDNS project tests', async (accounts) => {

  var firstAccount = accounts[0];
  var secondAccount = accounts[1];
  var thirdAccount = accounts[2];
  var forthAccount = accounts[3];
  var fifthAccount = accounts[4];

  it("Should set owner corretly", async () => {
     let instance = await DDNS.deployed();
     
	 let owner = await instance.getOwner();
	 var expected = accounts[0];
     assert.equal(expected, owner);
  })

  it("GetPrice should work correctly", async () => {
     let instance = await DDNS.deployed();
	 var domain = "wwf.bg"; 

	 var initialPrice = 2000000000000000000;
	 
	 for(var i = 0 ; i < 10 ; ++i){
	    let price = await instance.getPrice(domain);
		assert.equal(price.valueOf(), initialPrice);
		
		initialPrice -= 100000000000000000;
		domain += "s";
	 }
  })    

  it("Register should revert if domain is less or equal than 5 symbols", async () => {
     let instance = await DDNS.deployed();
	 var domain = "dirbg";
	 var ip = "192.168.1.1";	 
	 
	try{
		await instance.register(domain, ip, {"from" : secondAccount, "value" : ONE_ETHER });
		assert.fail('Expected throw not received');
	 }
	 catch(error){		
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	 }

	 domain = "";
	 try{
		await instance.register(domain, ip, {"from" : secondAccount, "value" : ONE_ETHER });
		assert.fail('Expected throw not received');
	 }
	 catch(error){		
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	 } 	 
  }) 

  it("Register should revert if value is less than expected", async () => {
     let instance = await DDNS.deployed();
	 var domain = "www.dir.bg";
	 var ip = "192.168.1.1";	 

	 try{
		let price = await instance.getPrice(domain); 
		await instance.register(domain, ip, {"from" : secondAccount, "value" : price - 1000000 });
		assert.fail('Expected throw not received');
	 }
	 catch(error){		
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	 } 		
  })   
 
  it("Register should work correctly", async () => {
     let instance = await DDNS.deployed();
	 var domain = "www.dir.bg";
	 var ip = "192.168.1.1";	 
	  
	 var value = await instance.getPrice(domain); 
	 await instance.register(domain, ip, {"from" : secondAccount, "value" : value });
	 var exist = await instance.domainExist(domain);
	  	 
     assert.equal(true, exist);
  }) 
  
  it("Register should extend with one year if domain already is registered and is called by owner", async () => {
      let instance = await DDNS.deployed();
     
	  var domain = "www.dir.bg";
	  var ip = "192.168.1.1";
	  
	  var receiptOne = await instance.receipts(secondAccount, 0);
	  var expirationDateBefore = receiptOne[2];
	  var amout = receiptOne[0];
 
	  var value = await instance.getPrice(domain); 
	  await instance.register(domain, ip, {"from" : secondAccount, "value" : value });
	  var receiptTwo = await instance.receipts(secondAccount, 1);
	 
	  var expirationDateAfter = receiptTwo[2];
	 
	  var oneYear = 365 * SECONDS_PER_DAY;
	 
	  assert.equal(oneYear, expirationDateAfter - expirationDateBefore);
   })
   
  it("One Account is allowed to register more than one domain ", async () => {
     let instance = await DDNS.deployed();
	 var domain = "www.vesti.bg";
	 var ip = "1.1.3.1";	 
	  
	 var value = await instance.getPrice(domain);  
	 await instance.register(domain, ip, {"from" : secondAccount, "value" : value });
	 var exist = await instance.domainExist(domain);
	  	 
     assert.equal(true, exist);
  }) 
  
  it("Edit should revert if called by non owner", async () => {
     let instance = await DDNS.deployed();
	 var domain = "www.dir.bg";
	 var ip = "192.168.1.1";	 
	 
	 try{
		await instance.edit(domain, ip, {"from" : thirdAccount });
		assert.fail('Expected throw not received');
	 }
	 catch(error){		
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	 }  
  }) 
  
  it("Edit should revert if domain does not exists", async () => {
     let instance = await DDNS.deployed();
	 var domain = "www.dnes.bg";
	 var ip = "192.168.1.1";	 
	 
	 try{
		await instance.edit(domain, ip, {"from" : secondAccount });
		assert.fail('Expected throw not received');
	 }
	 catch(error){		
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	 } 
  }) 
  
  it("Edit should work correctly", async () => {
     let instance = await DDNS.deployed();
	 
	 var domain = "www.dir.bg";
	 var ip = "1.2.3.4"
	   
	 var ipBefore = await instance.getIP(domain, {"from" : secondAccount });
    	 
     await instance.edit(domain, ip, {"from" : secondAccount });
	 var ipAfter = await instance.getIP(domain, {"from" : secondAccount });
	 
     assert(ipBefore != ipAfter, "Before: " + ipBefore + " After: " + ipAfter);
  }) 
  
  it("Register should revert if domain is already registered", async () => {
     let instance = await DDNS.deployed();
     
	 var domain = "www.dir.bg";
	 var ip = "22.11.1.1";	 
	 
	 try{
		 
		var value = await instance.getPrice(domain);  
		await instance.register(domain, ip, {"from" : thirdAccount, "value" : value });
		assert.fail('Expected throw not received');
	 }
	 catch(error){
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	 }
   })
   
  it("Register should be allowed if expiration day has passed", async () => {
      let instance = await DDNS.deployed();
     
	  var domain = "www.dir.bg";
	  var ip = "192.168.1.1";	 
	 	 
	  //simulate 2 year has passed
	  timeTravel(2 * 365 * SECONDS_PER_DAY);
	  mineBlock();
	 
	  var value = await instance.getPrice(domain);  
	  await instance.register(domain, ip, {"from" : thirdAccount, "value" : value });
	  var receipt = await instance.receipts(thirdAccount, 0);
	  
	  assert("Should be able to get here");	     
   })
   
  it("Transfer domain should revert if is called by non domain owner", async () => {
      let instance = await DDNS.deployed();
     
	  var domain = "www.dir.bg";

     try{
		await instance.transferDomain(domain, thirdAccount, {"from" : firstAccount });
		assert.fail('Expected throw not received');
	 }
	 catch(error){
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	 }    
   })
   
  it("Transfer domain should revert if tring to transfer non existing domain", async () => {
      let instance = await DDNS.deployed();
     
	  var domain = "www.dnes.bg";
	 	 	
	  try{
		await instance.transferDomain(domain, secondAccount, {"from" : thirdAccount });
		assert.fail('Expected throw not received');
	  }
	  catch(error){
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	  }    	     
   })
   
  it("Transfer domain should work correctly", async () => {
      let instance = await DDNS.deployed();
     
	  var domain = "www.dir.bg";
	 	 	
	  await instance.transferDomain(domain, secondAccount, {"from" : thirdAccount });
	  var receipt = await instance.receipts(secondAccount, 0);
	      
   })  
   
  it("Withdraw should revert if called by non owner", async () => {
      let instance = await DDNS.deployed();
     
	 try{
		await instance.withdraw({"from" : fifthAccount });
		assert.fail('Expected throw not received');
	 }
	 catch(error){		
		const revert = error.message.search('revert') >= 0;
		assert(revert,'Expected throw, got \'' + error + '\' instead')	  
	 } 
   }) 
})