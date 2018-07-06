pragma solidity ^0.4.24;
 
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
 
contract NotarHelpers is Ownable {
   
    struct Notar {
        address account;
        bool exist;
    }
   
    mapping(address => Notar) notarAddressToId;
   
    function AddNotar (address _notarAddress) onlyOwner existNotar(_notarAddress) public {
        notarAddressToId[_notarAddress] = Notar(_notarAddress, true);
    }
   
    function DeleteNotar (address _notarAddress) onlyOwner existNotar(_notarAddress) public {
        delete notarAddressToId[_notarAddress];
    }

    modifier existNotar(address _notarAddress) {
        require(notarAddressToId[_notarAddress].exist);
        _;
    }

    
}
 