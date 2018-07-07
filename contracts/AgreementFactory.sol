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
    
    // Mapping with indexes-addresses that stores ids of agreements in the agreements array that belong
    // to the person with this address
    mapping (address => uint[]) public addressToId;

    function CreateAgreement (address _notar, bytes32 _data, address[] _benefitiars) external existNotar(_notar) {

        // Creating the agreement
        OneSideAgreement agreement = new OneSideAgreement(_notar, _data, _benefitiars);

        // Defining the agreement id and adding it to the agreements array
        uint id = agreements.push(agreement) - 1;

        // Adding the agreement ID to both client's and notary's arrays
        addressToId[_notar].push(id);
        addressToId[agreement.GetClient()].push(id);

        emit AgreementCreated(_notar, _data, _benefitiars);
    }

    function GetContracts(address person) public view returns (OneSideAgreement[]){
        
        // All the contracts' ids in the agreement array that belong to the client/notary
        uint[] storage ids = addressToId[person];

        // Array of that agreements
        OneSideAgreement[] memory agr = new OneSideAgreement[](ids.length);

        uint counter = 0;

        // Getting those agreements
        for(uint i = 0; i < ids.length; i++){
            agr[counter] = agreements[ids[i]];
            counter = counter.add(1);
        }

        return agr;
    }

    /*// Mapping with indexes-Id that stores clients 
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
    }*/
}