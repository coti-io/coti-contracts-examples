// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@coti-io/coti-contracts/contracts/utils/mpc/MpcCore.sol";

contract DataOnChain {

    uint64 private clearValue;
    ctUint64 private ctUserSomeEncryptedValue;
    ctUint64 private ctUserSomeEncryptedValueEncryptedInput;
    ctUint64 private ctNetworkSomeEncryptedValue;
    ctUint64 private ctNetworkSomeEncryptedValueEncryptedInput;
    ctUint64 private ctUserArithmeticResult;
    ctString private ctUserSomeEncryptedStringEncryptedInput;
    ctString private ctNetworkSomeEncryptedStringEncryptedInput;
    ctString private ctUserSomeEncryptedStringValue;

    constructor () {
        clearValue = 5;
    }

    event UserEncryptedValue(address indexed _from, ctUint64 ctUserSomeEncryptedValue);

    event UserEncryptedStringValue(address indexed _from, ctString ctUserSomeEncryptedStringValue);


    function getNetworkSomeEncryptedValue() external view returns (ctUint64 ctSomeEncryptedValue) {
        return ctNetworkSomeEncryptedValue;
    }

    function setNetworkSomeEncryptedValue(ctUint64 networkEncrypted) external {
        ctNetworkSomeEncryptedValue = networkEncrypted;
    }

    function getNetworkSomeEncryptedValueEncryptedInput() external view returns (ctUint64 ctSomeEncryptedValue) {
        return ctNetworkSomeEncryptedValueEncryptedInput;
    }

    function getUserSomeEncryptedValue() external view returns (ctUint64 ctSomeEncryptedValue) {
        return ctUserSomeEncryptedValue;
    }

    function getUserSomeEncryptedValueEncryptedInput() external view returns (ctUint64 ctSomeEncryptedValue) {
        return ctUserSomeEncryptedValueEncryptedInput;
    }

    function getUserSomeEncryptedStringEncryptedInput() external view returns (ctString memory ctSomeEncryptedValue) {
        return ctUserSomeEncryptedStringEncryptedInput;
    }

    function setSomeEncryptedValue(uint64 _value) external {
        gtUint64 gtNetworkSomeEncryptedValue = MpcCore.setPublic64(_value); // passage step to make the clear value publicly available by having it encrypted
        ctNetworkSomeEncryptedValue = MpcCore.offBoard(gtNetworkSomeEncryptedValue); // saves it as cipher text (by network aes key)
    }

    function setSomeEncryptedValueEncryptedInput(itUint64 calldata itValue) external {
        gtUint64 gtNetworkSomeEncryptedValue = MpcCore.validateCiphertext(itValue);  // passage step to make the clear value publicly available by having it encrypted,
        // only after decrypting it and validating its cryptographically correct by the sender's key
        ctNetworkSomeEncryptedValueEncryptedInput = MpcCore.offBoard(gtNetworkSomeEncryptedValue); // saves it as cipher text (by network aes key)
    }

    function setSomeEncryptedStringEncryptedInput(itString calldata itValue) external {
        gtString memory _encryptedValueGt = MpcCore.validateCiphertext(itValue);

        ctNetworkSomeEncryptedStringEncryptedInput = MpcCore.offBoard(_encryptedValueGt);
    }

    function setUserSomeEncryptedValue() external {
        gtUint64 gtNetworkSomeEncryptedValue = MpcCore.onBoard(ctNetworkSomeEncryptedValue);        // loads encrypted (by network) into a circuit producing garbled-text representation
        ctUserSomeEncryptedValue = MpcCore.offBoardToUser(gtNetworkSomeEncryptedValue, msg.sender); // form change from garbled-text to cipher text (encryption) by wallet key
        emit UserEncryptedValue(msg.sender, ctUserSomeEncryptedValue);
    }

    function setUserSomeEncryptedValueEncryptedInput() external {
        gtUint64 gtEncryptedUserSomeEncryptedValue = MpcCore.onBoard(ctNetworkSomeEncryptedValueEncryptedInput);
        ctUserSomeEncryptedValueEncryptedInput = MpcCore.offBoardToUser(gtEncryptedUserSomeEncryptedValue, msg.sender);
        emit UserEncryptedValue(msg.sender, ctUserSomeEncryptedValueEncryptedInput);
    }

    function setUserSomeEncryptedStringEncryptedInput() external {
        gtString memory userGt = MpcCore.onBoard(ctNetworkSomeEncryptedStringEncryptedInput);

        ctUserSomeEncryptedStringEncryptedInput = MpcCore.offBoardToUser(userGt, msg.sender);

        emit UserEncryptedStringValue(msg.sender, ctUserSomeEncryptedStringEncryptedInput);
    }

    function getSomeValue() external view returns (uint64 value) {
        return clearValue;
    }

    function add() external {
        gtUint64 a = MpcCore.onBoard(ctNetworkSomeEncryptedValue);
        gtUint64 b = MpcCore.onBoard(ctNetworkSomeEncryptedValueEncryptedInput);
        gtUint64 result = MpcCore.add(a, b); // input for function need to be in the form of garbled-text (not user nor network encrypted)
        ctUserArithmeticResult = MpcCore.offBoardToUser(result, msg.sender);
    }

    function getUserArithmeticResult() external view returns (ctUint64 value){
        return ctUserArithmeticResult;
    }
}