pragma solidity ^0.4.24;

import "./OneSideAgreement.sol";
import "./SafeMath.sol";
import "./NotarHelpers.sol";

contract AgreementFactory is NotarHelpers {

    using SafeMath for uint256;
    
    // Array of agreements
    OneSideAgreement[] agreements;

    // An agreement is created (event)
    event AgreementCreated(address _notar, bytes32 _data, address[] _benefitiars);

    // Mapping with indexes-Id that stores clients 
    mapping (uint256 => address) public agreementIdToUser;
    // Mapping with indexes-adresses that stores the agreements count
    mapping (address => uint256) public agreementsCount;
   
    // Create agreement function (if the notary exists)
    function CreateAgreement (address _notar, bytes32 _data, address[] _benefitiars) external existNotar(_notar) {
        // Defining the agreement id and adding it to the agreements array
        uint id = agreements.push(new OneSideAgreement(_notar, _data, _benefitiars)) - 1;
        // Adding the client
        agreementIdToUser[id] = msg.sender;
        // Increasing the count
        agreementsCount[msg.sender] = agreementsCount[msg.sender].add(1);

        emit AgreementCreated(_notar, _data, _benefitiars);
    }
    
    // Get user's agreements function
    function GetUserAgreements(address _user) public view returns(address[]){
        // Stores all the agreements
        address[] memory result = new address[](agreemetnsCount[_user]);
        
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++) {
            if (agreementIdToUser[i] == _user) {
                result[counter] = agreementIdToUser[i];
                counter = counter.add(1);
            }
        }
        return result;
    }
}