// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Lock is ERC721 {
    uint public unlockTime;
    address payable public owner;
    uint private _tokenIdCounter;
    mapping(uint => string) private _documentHashes;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable ERC721("DocumentToken", "DOC") {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    function uploadDocument(string memory docHash) public {
        _tokenIdCounter++;
        uint newTokenId = _tokenIdCounter;
        _documentHashes[newTokenId] = docHash;
        _safeMint(msg.sender, newTokenId);
    }
}
