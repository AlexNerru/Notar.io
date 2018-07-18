pragma solidity ^0.4.24;
 
import "./Ownable.sol";
 
contract NotarHelpers is Ownable {
   
    // Notary struct
    struct Notar {
        // Notary address
        address account;
        // Indicates whether the notary exists or not
        bool exist;
    }

    // The notary is deleted (event)
    event NotarDeleted(address _notar);
    // The notary is added (event)
    event NotarAdded(address _notar);
    
    // Mapping with indexes-addresses that stores Notar objects
    mapping(address => Notar) public notarAddressToId;

    // Modifier to check whether a notary exists or not
    modifier existNotar(address _notarAddress) {
        if(notarAddressToId[_notarAddress].exist) {
            _;
        }
    }

    // Add notary to the mapping function
    function AddNotar (address _notarAddress) onlyOwner public {
        notarAddressToId[_notarAddress] = Notar(_notarAddress, true);
        emit NotarAdded(_notarAddress);
    }
    
    // Delete notary from the mapping function (if it exists)
    function DeleteNotar (address _notarAddress) onlyOwner public {
        //delete notarAddressToId[_notarAddress];
        notarAddressToId[_notarAddress] = Notar(0, false);
        emit NotarDeleted(_notarAddress);
    } 

    // Check if msg.sender is a notary
    function AmINotar() public view returns (bool) {
        return notarAddressToId[msg.sender].exist;
    }

    // Checking notar status
    function GetNotarStatus(address _address) external view returns(bool){
        return notarAddressToId[_address].exist;
    }
 
}