// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Arshil {
    uint256 private number = 20;
    string private name = "Nami";

    function setUser(uint256 _number, string memory _name) public {
        number = _number;
        name = _name;
    }
    function getUser() public view returns (uint256, string memory) {
        return (number, name);
    }

    struct Character {
        uint256 id;
        string name;
    }
    Character[] public characters;
    mapping(uint256 => string) public characterIdToCharacterNameMp;

    function addCharacter(uint256 _id, string memory _name) public {
        characters.push(Character(_id, _name));
        characterIdToCharacterNameMp[_id] = _name;
    }
    function getCharacterArray() public view returns (Character[] memory) {
        return characters;
    }
    function getCharacterMappings(
        uint256 _id
    ) public view returns (string memory) {
        return characterIdToCharacterNameMp[_id];
    }
}
