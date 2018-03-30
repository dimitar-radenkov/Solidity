pragma solidity ^0.4.19; 

contract Ownable {
    address private owner;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    function getOwner() public view returns(address){
        return owner;
    }
    
    function Ownable() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract DDNS is Ownable{
	uint256 private constant MIN_DOMAIN_LENGTH  = 5;
    uint256 private constant MIN_PRICE = 1 ether;
    uint256 private constant MAX_PRICE = 2 ether;	
	
    struct DomainInfo{
        bytes domainInfo;
        bytes4 ipInfo;
        address owner;
        bool isRegistered;
        bool isExtended;
        uint256 expirationDate;
    }

    struct Receipt{
        uint amountPaidWei;
        uint timestamp;
        uint expires;
    }
    
	event LogDomainRegistered(bytes domain, bytes4 ip, address owner, uint256 timestamp);
    event LogDomainExtended(bytes domain, uint256 timestamp);
    event LogIpChanged(bytes domain, bytes4 newIp, uint256 timestamp);
    event LogDomainOwnerTransfered(bytes domain, address newOwerm, uint256 timestamp);
    event LogMoneyTransfered(uint256 value, uint256 timestamp);

    modifier onlyDomainOwner(bytes domain){
        require(domains[domain].owner == msg.sender);
        _;
    }
    
    modifier onlyDomainRegistered(bytes domain){
        require(domains[domain].isRegistered);
        _;
    }
	
	modifier onlyDomainSufficientLength(bytes domain){
        require(domain.length > MIN_DOMAIN_LENGTH);
        _;
    }
	
	mapping (bytes => DomainInfo) private domains;
    mapping(address => Receipt[]) public receipts;

    function register(bytes domain, bytes4 ip) onlyDomainSufficientLength(domain) public payable {
        require(msg.value >= getPrice(domain));

        if(!domains[domain].isRegistered || 
           (domains[domain].isRegistered  && domains[domain].expirationDate <= now)){
               
            domains[domain] = DomainInfo({domainInfo : domain, ipInfo : ip, owner : msg.sender, isRegistered : true, isExtended : false, expirationDate : now + 1 years });
            receipts[msg.sender].push(Receipt({ amountPaidWei : msg.value, timestamp : now, expires : now + 1 years }));
        
            LogDomainRegistered(domain, ip, msg.sender, now);
        }
        else{
            
            if(domains[domain].owner == msg.sender && 
               !domains[domain].isExtended){
                //extend
                uint256 lastExpirationTime =  domains[domain].expirationDate;
                domains[domain].expirationDate + 1 years;
                domains[domain].isExtended = true;
                receipts[msg.sender].push(Receipt({ amountPaidWei : msg.value, timestamp : now, expires : lastExpirationTime + 1 years }));
                   
                LogDomainExtended(domain, now);
            }
            else{
                //not allowed to register, already taken
                revert();
            }
        }
    }
    
    function edit(bytes domain, bytes4 newIp) onlyDomainOwner(domain) onlyDomainRegistered(domain) public {
        domains[domain].ipInfo = newIp;
         
        LogIpChanged(domain, newIp, now);
    }
    
    function transferDomain(bytes domain, address newOwner) onlyDomainOwner(domain) onlyDomainRegistered(domain) public {
        domains[domain].owner = newOwner;
        
        LogDomainOwnerTransfered(domain, newOwner, now);
    }
    
    function getIP(bytes domain) onlyDomainRegistered(domain) public view returns (bytes4) {
        return domains[domain].ipInfo;
    }
    
    function getPrice(bytes domain) onlyDomainSufficientLength(domain) public pure returns (uint) {  
        uint256 currentPrice = MAX_PRICE;
        for(uint256 i = MIN_DOMAIN_LENGTH + 1 ; i < domain.length ; ++i){
            if(currentPrice == MIN_PRICE){
                break;
            }
            
            currentPrice -= 100000000000000000;
        }
        	
        return currentPrice;
    }

    function withdraw() onlyOwner public {
        uint256 value = address(this).balance;
        
        msg.sender.transfer(address(this).balance);
        LogMoneyTransfered(value, now);
    }
	
	function domainExist(bytes domain) onlyDomainSufficientLength(domain) public view returns(bool){
        return domains[domain].isRegistered;
    }
}