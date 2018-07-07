pragma solidity ^0.4.24;

import "./NotarHelpers.sol";

contract OneSideAgreement is NotarHelpers {
    
    // Stakeholders (heirs) addresses
    address[] benefitiars;
    // Indiciates whether the agreement is certified or not
    bool public isCertified;
    // Notary address
    address private notar;
    // The document (hash/link)
    bytes32 private data;
    // Client address
    address client;

    // The agreement is certified (event)
    event Certified(address _notar, bytes32 _data);
    // The agreement is uncertified (event)
    event Uncertified(address _notar, bytes32 _data);
    
    // Modifier to limit access (meaning notary only)
    modifier particularNotar() {
        require(msg.sender == address(notar));
        _;
    }

    // Constructor 
    constructor (address _notar, bytes32 _data, address[] _benefitiars) public existNotar(_notar) {
        benefitiars = _benefitiars;
        isCertified = false;
        notar = _notar;
        data = _data;
        client = msg.sender;
    }
    
    // Getting the agreement notary
    function GetNotar() view public returns(address) {
        return notar;
    }

    // Getting the agreement data
    function GetData() view public returns(bytes32) {
        return data;
    }

    // Getting the client
    function GetClient() view public returns (address){
        return client;
    }

    // Certifying the agreement (notary only)
    function Certify () public particularNotar() existNotar(notar){
        isCertified = true;
        emit Certified(notar, data);
    }
    
    // Uncertifying the agreement (notary only)
    function UnCertify() public particularNotar() existNotar(notar){
        isCertified = false;
        emit Uncertified(notar, data);
    }
}