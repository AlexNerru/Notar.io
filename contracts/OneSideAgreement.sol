pragma solidity ^0.4.24;

import "./NotarHelpers.sol";

contract OneSideAgreement {
    //NotarHelpers _notarHelpers;
    // Stakeholders (heirs) addresses
    address[] benefitiars;
    // Indiciates whether the agreement is certified or not
    bool public isCertified;
    // Notary address
    address private notar;
    // The document (hash/link)
    bytes32 private data;
    // Client address
    address private client;
    // The agreement is being considered
    bool public inProgress;

    // The agreement is certified (event)
    event Certified(address _notar, bytes32 _data);
    // The agreement is uncertified (event)
    event Denied(address _notar, bytes32 _data);
    
    event Debug(address toCheck, string comments);
    // Modifier to limit access (meaning notary only)
    modifier particularNotar() {
        /*require(msg.sender == address(notar));
        _;*/
        if(msg.sender == notar){
            _;
        }
    }

    // Constructor 
    constructor (address _notar, bytes32 _data, address[] _benefitiars) public  {
        //isCertified;
        notar = _notar;
        data = _data;
        client = tx.origin;
        inProgress = true;
        benefitiars = _benefitiars;
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

    function GetBenefitiars() view public returns(address[]){
        return benefitiars;
    }

    // Certifying the agreement (notary only)
    function Certify () public particularNotar(){
        //require(inProgress);
        if(inProgress){
            isCertified = true;
            inProgress = false;
            emit Certified(notar, data);
        }
    }
    
    // Deny the agreement (notary only)
    function Deny() public particularNotar(){
        //require(inProgress);
        if(inProgress){
            isCertified = false;
            inProgress = false;
            emit Denied(notar, data);
        }
    }

    // Checking agreement status
    function CheckStatus() public view returns (string){
        if(inProgress){
            return "In progress";
        }

        if(isCertified){
            return "Certified";
        }

        return "Denied"; 
    }
}