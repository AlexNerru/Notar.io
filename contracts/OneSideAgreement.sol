pragma solidity ^0.4.24;

contract OneSideAgreement {
    
    // Stakeholders (heirs) addresses
    address[] benefitiars;
    // Indiciates whether the agreement is certified or not
    bool public isCertified;
    // Notary address
    address private notar;
    // The document (hash/link)
    bytes32 private data;

    // The agreement is certified (event)
    event Certified(address _notar, byte32 _data);
    // The agreement is uncertified (event)
    event Uncertified(address _notar, byte32 _data);
    
    // Modifier to limit access (meaning notary only)
    modifier particularNotar() {
        require(msg.sender == address(notar));
        _;
    }

    // Constructor 
    constructor (address _notar, bytes32 _data, address[] _benefitiars) public {
        benefitiars = _benefitiars;
        isCertified = false;
        notar = _notar;
        data = _data;
    }
    
    // Getting the agreement notary
    function GetNotar() view public returns(address) {
        return notar;
    }

    // Getting the agreement data
    function GetData() view public returns(bytes32) {
        return data;
    }

    // Certifying the agreement (notary only)
    function Certify () public particularNotar(){
        isCertified = true;
        emit Certified(notar, data);
    }
    
    // Uncertifying the agreement (notary only)
    function UnCertify() public particularNotar(){
        isCertified = false;
        emit Uncertified(notar, data);
    }
}