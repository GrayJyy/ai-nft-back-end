// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

//errors
error AiNft__PaymentIsNotEnough();
error AiNft__PaymentFailed();
error AiNft__BalanceIsZero();

contract AiNft is ERC721URIStorage {
    using Counters for Counters.Counter;

    // variables
    Counters.Counter private s_tokenIds;
    uint256 private s_cost;
    address private s_owner;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        s_owner = msg.sender;
        s_cost = _cost;
    }

    // modifiers
    modifier isEnough() {
        if (msg.value < s_cost) {
            revert AiNft__PaymentIsNotEnough();
        }
        _;
    }

    // events
    event Minted(uint256 indexed tokenId, address to);

    //function
    function mintNft(string memory tokenUri) public payable isEnough {
        uint256 _tokenId = s_tokenIds.current();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, tokenUri);
        emit Minted(_tokenId, msg.sender);
        s_tokenIds.increment();
    }

    function totalSupply() public view returns (uint256) {
        return s_tokenIds.current();
    }

    function withdraw() public payable {
        if (s_tokenIds.current() == 0) {
            revert AiNft__BalanceIsZero();
        }
        (bool success, ) = s_owner.call{value: payable(address(this)).balance}(
            ""
        );
        if (!success) {
            revert AiNft__PaymentFailed();
        }
    }

    function getCost() public view returns (uint256) {
        return s_cost;
    }

    function getOwner() public view returns (address) {
        return s_owner;
    }
}
