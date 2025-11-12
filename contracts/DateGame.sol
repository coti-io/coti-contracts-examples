// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@coti-io/coti-contracts/contracts/utils/mpc/MpcCore.sol";

contract DateGame {
    // Store age as utUint64 (combined user + network ciphertext)
    utUint64 private _age;
    bool private _ageSet;
    
    // Store comparison result for the owner
    utUint8 private _comparisonResult;
    
    // Owner address for consistent encryption
    address private _owner;
    
    // Events for tracking operations
    event AgeStored(address indexed user);
    
    constructor() {
        _ageSet = false;
        _owner = msg.sender;
    }

    /**
     * @notice Check if an age has been stored
     */
    function isAgeSet() external view returns (bool) {
        return _ageSet;
    }

    /**
     * @notice Set the stored age value directly
     * @param age encrypted input (itUint64) coming from user representing their age in years
     */
    function setAge(itUint64 calldata age) external {
        gtUint64 gtAge = MpcCore.validateCiphertext(age);
        
        // Store the encrypted value - following Counter pattern
        _age = MpcCore.offBoardCombined(gtAge, _owner);
        _ageSet = true;
        
        emit AgeStored(msg.sender);
    }

    /**
     * @notice Compares the stored age with an incoming encrypted age value (greater than)
     * @param value encrypted input (itUint64) coming from user representing an age to compare
     */
    function greaterThan(itUint64 calldata value) external {
        require(_ageSet, "No age has been stored yet");
        
        // Load the stored age - following Counter.add() pattern
        gtUint64 storedAge = MpcCore.onBoard(_age.ciphertext);
        
        // Validate incoming value
        gtUint64 incomingAge = MpcCore.validateCiphertext(value);
        
        // Compare: stored > incoming
        gtBool isGreater = MpcCore.gt(storedAge, incomingAge);
        
        // Convert gtBool to gtUint8: mux(condition, falseValue, trueValue)
        gtUint8 one = MpcCore.setPublic8(1);
        gtUint8 zero = MpcCore.setPublic8(0);
        gtUint8 resultAsUint8 = MpcCore.mux(isGreater, zero, one);
        
        // Store result following Counter pattern
        _comparisonResult = MpcCore.offBoardCombined(resultAsUint8, msg.sender);
    }

    /**
     * @notice Compares the stored age with an incoming encrypted age value (less than)
     * @param value encrypted input (itUint64) coming from user representing an age to compare
     */
    function lessThan(itUint64 calldata value) external {
        require(_ageSet, "No age has been stored yet");
        
        // Load the stored age - following Counter.add() pattern
        gtUint64 storedAge = MpcCore.onBoard(_age.ciphertext);
        
        // Validate incoming value
        gtUint64 incomingAge = MpcCore.validateCiphertext(value);
        
        // Compare: stored < incoming
        gtBool isLess = MpcCore.lt(storedAge, incomingAge);
        
        // Convert gtBool to gtUint8: mux(condition, falseValue, trueValue)
        gtUint8 one = MpcCore.setPublic8(1);
        gtUint8 zero = MpcCore.setPublic8(0);
        gtUint8 resultAsUint8 = MpcCore.mux(isLess, zero, one);
        
        // Store result following Counter pattern
        _comparisonResult = MpcCore.offBoardCombined(resultAsUint8, msg.sender);
    }
    
    /**
     * @notice Returns the encrypted comparison result - following Counter.sum() pattern
     * @return The encrypted result (0 = false, 1 = true) as ctUint8
     */
    function comparisonResult() public view returns (ctUint8) {
        return _comparisonResult.userCiphertext;
    }

}