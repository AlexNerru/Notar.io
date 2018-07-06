pragma solidity ^0.4.24;


contract OneSideAgreement {
   
    address[] _benefitiars;
    bool public _isCertified;
    address private _notar;
    bytes32 private _data;
   
    constructor (address notar, bytes32 data, address[] benefitiars) public {
        _benefitiars = benefitiars;
        _isCertified = false;
        _notar = notar;
        _data = data;
    }
   
    function Certify () public{
        require(address(_notar) == msg.sender);
        _isCertified = true;
    }
   
    function UnCertify() public {
        require(address(_notar) == msg.sender);
        _isCertified = true;
    }
}