pragma solidity ^0.4.24;

import "./OneSideAgreement.sol";
import "./SafeMath.sol";
import "./NotarHelpers.sol";

contract AgreementFactory {
    using SafeMath for uint256;
    
    NotarHelpers private nh;
    
    // Array of agreements
    OneSideAgreement[] public agreements;

    // An agreement is created (event)
    event AgreementCreated(address _notar, bytes32 _data, address[] _benefitiars);
    
    // Mapping with indexes-addresses that stores ids of agreements in the agreements array that belong
    // to the person with this address
    mapping (address => uint[]) public addressToId;
    
    constructor (address _nh) public {
        nh = NotarHelpers(_nh);
    }

    // Create agreement function (if the notary exists)
    function CreateAgreement (address _notar, bytes32 _data, address[] _benefitiars) external returns(address) {
        bool flag = nh.GetNotarStatus(_notar);
        if (flag) {
            // Creating the agreement
            OneSideAgreement agreement = new OneSideAgreement(_notar, _data, _benefitiars);
    
            // Defining the agreement id and adding it to the agreements array
            uint id = agreements.push(agreement) - 1;
    
            // Adding the agreement ID to both client's and notary's arrays
            addressToId[_notar].push(id);
            addressToId[agreement.GetClient()].push(id);
    
            emit AgreementCreated(_notar, _data, _benefitiars);
            
            return agreement;
        } else {
            return _notar;
        }
    }

    // Get all the agreements of a person (either client's or notary's)
    function GetAgreements(address person) public view returns (OneSideAgreement[]){
        
        // All the agreements' ids in the agreement array that belong to the client/notary
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
}