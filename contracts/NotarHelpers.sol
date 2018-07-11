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
    mapping(address => Notar) notarAddressToId;
    
    // Add notary to the mapping function
    function AddNotar (address _notarAddress) onlyOwner public {
        notarAddressToId[_notarAddress] = Notar(_notarAddress, true);
        emit NotarAdded(_notarAddress);
    }
    
    // Delete notary from the mapping function (if it exists)
    function DeleteNotar (address _notarAddress) onlyOwner existNotar(_notarAddress) public {
        delete notarAddressToId[_notarAddress];
        emit NotarDeleted(_notarAddress);
    }

    // Check if msg.sender is a notary
    function AmINotar() public view returns (bool) {
        return notarAddressToId[msg.sender].exist;
    }

    // Modifier to check whether a notary exists or not
    modifier existNotar(address _notarAddress) {
        require(notarAddressToId[_notarAddress].exist);
        _;
    }

    
}
 