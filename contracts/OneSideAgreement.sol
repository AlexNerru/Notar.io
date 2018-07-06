pragma solidity ^0.4.24;



contract OneSideAgreement {
   
    address[] benefitiars;
    bool public isCertified;
    address private notar;
    bytes32 private data;
   
    modifier particularNotar() {
        require(msg.sender == address(notar));
        _;
    }

    constructor (address _notar, bytes32 _data, address[] _benefitiars) public {
        benefitiars = _benefitiars;
        isCertified = false;
        notar = _notar;
        data = _data;
    }
   
    function GetNotar() view public returns(address) {
        return notar;
    }

    function GetData() view public returns(bytes32) {
        return data;
    }

    function Certify () public particularNotar(){
        isCertified = true;
    }
   
    function UnCertify() public particularNotar(){
        isCertified = false;
    }
}