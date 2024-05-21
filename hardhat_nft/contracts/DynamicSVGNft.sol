//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "base64-sol/base64.sol";
import {AggregatorInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorInterface.sol";

import {PriceConvertor} from "./library/PriceFeedConvertor.sol";

error DynamicSVGNft__RequireTokenId();

contract DynamicSVGNft is ERC721 {
    // using PriceConvertor for uint256;
    event NewEpicNFTMinted(uint256 indexed tokenId, address sender);

    uint256 private s_tokenCounter;
    string private i_lowImageUri;
    string private i_highImageUri;
    address private immutable i_priceFeedAddress;
    string private constant base64EncodedSvgPrefix =
        "data:image/svg+xml;base64,";

    mapping(uint256 => int256) s_tokenToHighValue;

    constructor(
        address priceFeedAddress, // use 0x694AA1769357215DE4FAC081bf1f309aDC325306
        string memory lowSvg,
        string memory highSvg
    ) ERC721("DynamicSVG", "DSVG") {
        s_tokenCounter = 0;
        i_lowImageUri = svgToImageURI(lowSvg);
        i_highImageUri = svgToImageURI(highSvg);
        i_priceFeedAddress = priceFeedAddress;
    }

    function svgToImageURI(
        string memory svg
    ) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return
            string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded)); // concatenating strings
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function mintNFT(int256 _highValue) public {
        s_tokenCounter++;
        s_tokenToHighValue[s_tokenCounter] = _highValue;
        _mint(msg.sender, s_tokenCounter);
        emit NewEpicNFTMinted(s_tokenCounter, msg.sender);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert DynamicSVGNft__RequireTokenId();
        }
        string memory imageUri = i_lowImageUri;
        int256 ethPrice = PriceConvertor.getCurrentEthPrice(i_priceFeedAddress);
        if (ethPrice > s_tokenToHighValue[tokenId]) {
            imageUri = i_highImageUri;
        }

        return
            // type casted
            string(
                // prefixed base 64 hex / bytes
                abi.encodePacked(
                    _baseURI(),
                    // base 64 encoded full size metadata json
                    Base64.encode(
                        // full size encoded metadata json
                        bytes(
                            // encoded and concatenated json metadata
                            abi.encodePacked(
                                // metadata json
                                '{"name":"',
                                name(),
                                '","description":"An NFT that changes based on the ETH price"',
                                '","attributes":[{"train_type":"coolness","value":100}],"image":',
                                imageUri,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function getLowSvg() public view returns (string memory) {
        return i_lowImageUri;
    }

    function getHighSvg() public view returns (string memory) {
        return i_highImageUri;
    }

    function getPriceFeed() public view returns (address) {
        return i_priceFeedAddress;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
