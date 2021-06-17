pragma solidity ^0.5.0;

contract SimpleStorage {
    string public simpleStorage = "Simple Storage. Change me";

    function updateSimpleStorage(string memory _newContent) public {
        simpleStorage = _newContent;
    }

    function getSimpleStorageValue() public view returns (string memory) {
        return simpleStorage;
    }

}