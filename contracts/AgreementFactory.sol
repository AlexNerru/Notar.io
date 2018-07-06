pragma solidity ^0.4.24;

import "contracts/OneSideAgreement.sol";
import "./safemath.sol";

contract AgreementFactory {

    using SafeMath for uint256;
   
    OneSideAgreement[] agreements;
   
    //mapping(uint256 => OneSideAgreement) public oneSideAgreements;
    

    mapping (uint256 => address) public agreementIdToUser;
    mapping (address => uint256) public agreementsCount;
   
    function CreateAgreement (address notar, bytes32 data, address[] benefitiars) external {
        uint id = agreements.push(new OneSideAgreement(notar, data, benefitiars));
        agreementIdToUser[id] = msg.sender;
        //agreemetnsCount[msg.sender]++;
        agreementsCount[msg.sender] = agreementsCount[msg.sender].add(1);
    }
   
    function GetUserAgreements(address user) public view returns(address[]){
        address[] memory result = new address[](agreemetnsCount[user]);
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++) {
            if (agreementIdToUser[i] == user) {
                result[counter] = agreementIdToUser[i];
            }
        }
        return result;
    }
}