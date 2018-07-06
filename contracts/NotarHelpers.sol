pragma solidity ^0.4.24;
 
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
 
contract NotarHelpers is Ownable {
   
    struct Notar {
        address account;
    }
   
    Notar[] notars;
   
    mapping(address => uint256) notarAddressToId;
   
    function AddNotar (address notar) onlyOwner public {
        uint id = notars.push(Notar(notar));    
        notarAddressToId[notar] = id;
    }
   
    function DeleteNotar (address notar) onlyOwner public {
        uint id = notarAddressToId[notar];
        delete notars[id];
    }
}
 