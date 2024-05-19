// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

contract TaleTrade is ERC721, ERC721URIStorage, ERC721Burnable {

    struct POV{
        uint256 id;
        string identify;
        string name;
        string genre;
        string network;
        string story;
        address creator;
        uint256 amt;
        bool status; 
    }
    
    mapping(uint256 => POV) public mapIdToPov;
    mapping(string => address) mapIdentityToCreator;
    uint256 tokenId;
    event POVCreated(   
        uint256 indexed id,
        string name,
        string genre,
        string identify,
        string network,
        string story,
        address creator,
        uint256 amt,
        bool status
        );

    event POVBought(   
        uint256 indexed id,
        string name,
        string genre,
         string identify,
        string network,
        string story,
        address creator,
        uint256 amt,
        bool status
        );
    event VoteReputation(
        uint256 amt, address creator
    );
    constructor() ERC721("TaleToken", "TALE") {}

    function safeMint(address to, string memory identify, string memory uri, string memory name,string memory genre,string memory network,string memory story,uint256 amt)
        public
     
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        POV memory pov = POV({id: tokenId,identify:identify, name:name, genre:genre, network:network, story: story , creator:msg.sender, amt: amt, status: false});
        mapIdToPov[tokenId] = pov;
        tokenId = tokenId +1;
        mapIdentityToCreator[identify] = msg.sender;
        emit POVCreated(tokenId, name, genre,identify, network, story,msg.sender, amt,false);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 token_id)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(token_id);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function toTransferFrom (address from, address to , uint256 token_id, string memory network) public returns(POV memory){
        super.safeTransferFrom(from , to ,token_id);
        POV memory pov = mapIdToPov[token_id];
        emit POVCreated(pov.id, pov.name, pov.genre, pov.identify, network, pov.story, pov.creator, pov.amt,true);
        return mapIdToPov[token_id];
    }

    function voteInfluencer(string memory identity, uint256 amt) public {
        emit VoteReputation(amt , mapIdentityToCreator[identity]);
    }
}