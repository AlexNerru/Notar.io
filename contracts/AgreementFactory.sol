pragma solidity ^0.4.24;

import "contracts/OneSideAgreement.sol";
import "./safemath.sol";
import "contracts/NotarHelpers.sol";

contract AgreementFactory is NotarHelpers {

    using SafeMath for uint256;
   
    OneSideAgreement[] agreements;

    event AgreementCreated(address _notar, bytes32 _data, address[] _benefitiars);

    mapping (uint256 => address) public agreementIdToUser;
    mapping (address => uint256) public agreementsCount;
   
    function CreateAgreement (address _notar, bytes32 _data, address[] _benefitiars) external existNotar(_notar) {
        uint id = agreements.push(new OneSideAgreement(_notar, _data, _benefitiars)) - 1;
        agreementIdToUser[id] = msg.sender;
        agreementsCount[msg.sender] = agreementsCount[msg.sender].add(1);

        emit AgreementCreated(_notar, _data, _benefitiars);
    }
   
    function GetUserAgreements(address _user) public view returns(address[]){
        address[] memory result = new address[](agreemetnsCount[_user]);
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++) {
            if (agreementIdToUser[i] == _user) {
                result[counter] = agreementIdToUser[i];
            }
        }
        return result;
    }
}