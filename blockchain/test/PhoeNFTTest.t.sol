pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import "../src/PhoeNFT.sol";

// Declare external errors used from OpenZeppelin
error EnforcedPause();
error OwnableUnauthorizedAccount(address);
error ERC721NonexistentToken(uint256);

contract PhoeNFTTest is Test {
    PhoeNFT public nft;
    address public owner = address(0x1);
    address public user = address(0x2);

    function setUp() public {
        // Deploy PhoeNFT with owner
        vm.prank(owner);
        nft = new PhoeNFT();
    }

    function testMintingByOwner() public {
        // Owner can mint a token
        vm.prank(owner);
        uint256 tokenId = nft.safeMint(user, "ipfs://token-uri");

        assertEq(nft.ownerOf(tokenId), user);
        assertEq(nft.tokenURI(tokenId), "ipfs://token-uri");
    }

    function testMintingByAnyAddress() public {
        // Any address can mint (function is public)
        vm.prank(user);
        uint256 tokenId = nft.safeMint(user, "ipfs://from-user");

        assertEq(nft.ownerOf(tokenId), user);
    }

    function testPauseBlocksMinting() public {
        // Owner pauses the contract
        vm.prank(owner);
        nft.pause();

        // Minting should fail when paused
        vm.expectRevert(EnforcedPause.selector);
        vm.prank(owner);
        nft.safeMint(user, "ipfs://should-fail");
    }

    function testUnpauseRestoresMinting() public {
        // Pause and then unpause the contract
        vm.prank(owner);
        nft.pause();
        vm.prank(owner);
        nft.unpause();

        // Mint should succeed now
        vm.prank(owner);
        uint256 tokenId = nft.safeMint(user, "ipfs://mint-after-unpause");

        assertEq(nft.ownerOf(tokenId), user);
    }

    function testOnlyOwnerCanPause() public {
        // Non-owner cannot pause the contract
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, user));
        vm.prank(user);
        nft.pause();
    }

    function testOnlyOwnerCanUnpause() public {
        vm.prank(owner);
        nft.pause();

        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, user));
        vm.prank(user);
        nft.unpause();
    }

    function testBurningRemovesToken() public {
        // Mint and burn token
        vm.prank(owner);
        uint256 tokenId = nft.safeMint(user, "ipfs://burnable");

        vm.prank(user);
        nft.burn(tokenId);

        // Revert when accessing burned token
        vm.expectRevert(abi.encodeWithSelector(ERC721NonexistentToken.selector, tokenId));
        nft.ownerOf(tokenId);
    }

    function testTokenUriStorage() public {
        // Token URI is stored and retrievable
        vm.prank(owner);
        uint256 tokenId = nft.safeMint(user, "ipfs://tokenuri");

        assertEq(nft.tokenURI(tokenId), "ipfs://tokenuri");
    }

    function testSupportsInterface() public {
        // Contract should support standard ERC721 interfaces
        assertTrue(nft.supportsInterface(0x80ac58cd)); // ERC721
        assertTrue(nft.supportsInterface(0x5b5e139f)); // ERC721Metadata
    }
}
