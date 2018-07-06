pragma solidity ^0.4.24;



contract OneSideAgreement {
   
    address[] _benefitiars;
    bool public _isCertified;
    address private _notar;
    bytes32 private _data;
   
    modifier particularNotar() {
        require(msg.sender == address(_notar));
        _;
    }

    constructor (address notar, bytes32 data, address[] benefitiars) public {
        _benefitiars = benefitiars;
        _isCertified = false;
        _notar = notar;
        _data = data;
    }
   
    function GetNotar() view public returns(address) {
        return _notar;
    }

    function GetData() view public returns(bytes32) {
        return _data;
    }

    function Certify () public particularNotar(){
        _isCertified = true;
    }
   
    function UnCertify() public particularNotar(){
        _isCertified = false;
    }
}