// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@coti-io/coti-contracts/contracts/access/DataPrivacyFramework/extensions/DataPrivacyFrameworkMpc.sol";

contract OnChainDatabase is DataPrivacyFrameworkMpc {

    struct DatabaseEntry {
        string key;
        address creator;
        uint256 createTimestamp;
        uint256 lastAccessTimestamp;
    }

    mapping(string => ctUint64) internal encryptedValues; // entry ID => encrypted value

    DatabaseEntry[] private entries;

    mapping(string => uint256) internal entryIds;

    uint256 internal entryCount;

    event encryptedUint(address indexed _from, ctUint64 value);

    event encryptedBool(address indexed _from, ctBool value);

    event clearUint(address indexed _from, uint64 value);

    constructor() DataPrivacyFrameworkMpc(false, false) {
        // we allow the owner to read from and write to the database at deployment
        setPermission(InputData (msg.sender, "op_set_item", true, 0, 0, false, false, 0, address(0), ""));
        setPermission(InputData (msg.sender, "op_get_item", true, 0, 0, false, false, 0, address(0), ""));

        gtUint64 gtContractDate = gtUint64.wrap(
            ExtendedOperations(MPC_PRECOMPILE).SetPublic(
                bytes1(
                    uint8(
                        MpcCore.MPC_TYPE.SUINT64_T
                    )
                ),
                uint256(block.timestamp)
            )
        );
        _setItem("contract_date", gtContractDate);

        gtUint64 gtCotiUsd = MpcCore.setPublic64(5);
        _setItem("coti_usd_price", gtCotiUsd);

        gtUint64 gtOilUsdPrice = MpcCore.setPublic64(100);
        _setItem("oil_usd_price", gtOilUsdPrice);
    }

    /**
     * @notice retrieves list of key items stored in KV DB
     */
    function getItems() public view returns (DatabaseEntry[] memory) {
        return entries;
    }

    /**
     * @notice adds a new entry to the database or overwrites an existing entry
     * @param name key of the new database entry (or the entry to overwrite)
     * @param value value of the new database entry encrypted with the users AES key
     */
    function setItem(
        string memory name,
        itUint64 calldata value
    )
        external
        onlyAllowedUserOperation("op_set_item", 0, address(0), "")
    {
        gtUint64 gtEncryptedValue = MpcCore.validateCiphertext(value);
        
        _setItem(name, gtEncryptedValue);
    }

    /**
     * @notice retrieves a value from the database, reencrypts it with the users AES key and emits it as an event
     * @dev keep in mind that on COTI V2, offboarding a value requires that the user completes a transaction (cannot be a view function)
     * @param name ID of the entry for which to return the value of
     */
    function getItem(string memory name)
        external
        onlyAllowedUserOperation("op_get_item", 0, address(0), name)
    {
        gtUint64 gtEncryptedValue = MpcCore.onBoard(encryptedValues[name]);

        entries[entryIds[name]].lastAccessTimestamp = block.timestamp;

        ctUint64 ctEncryptedInput = MpcCore.offBoardToUser(gtEncryptedValue, msg.sender); // reencrypt with the users AES key

        emit encryptedUint(msg.sender, ctEncryptedInput); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }

    /**
     * @notice retrieves the value of Oil/USD from the database, decrypts it with the users AES key and emits it as an event
     */
    function getClearOilUsdPrice()
        external
        onlyAllowedUserOperation("op_get_clear_oil_usd_price", 0, address(0), "")
    {
        gtUint64 a = MpcCore.onBoard(encryptedValues["oil_usd_price"]);

        entries[entryIds["oil_usd_price"]].lastAccessTimestamp = block.timestamp;

        emit clearUint(msg.sender, MpcCore.decrypt(a)); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }

    /**
     * @notice retrieves the value of COTI/USD from the database, decrypts it with the users AES key and emits it as an event
     */
    function getClearCotiUsdPrice()
        external
        onlyAllowedUserOperation("op_get_clear_coti_usd_price", 0, address(0), "")
    {
        gtUint64 a = MpcCore.onBoard(encryptedValues["coti_usd_price"]);

        entries[entryIds["coti_usd_price"]].lastAccessTimestamp = block.timestamp;

        emit clearUint(msg.sender, MpcCore.decrypt(a)); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }

    /**
     * @notice computes the value of Oil/COTI price from the database, decrypts it with the users AES key and emits it as an event
     */
    function getClearOilCotiPrice()
        external
        onlyAllowedUserOperation("op_get_clear_oil_usd_price", 0, address(0), "")
        onlyAllowedUserOperation("op_get_clear_coti_usd_price", 0, address(0), "")
    {
        gtUint64 a = MpcCore.onBoard(encryptedValues["oil_usd_price"]);
        gtUint64 b = MpcCore.onBoard(encryptedValues["coti_usd_price"]);

        entries[entryIds["oil_usd_price"]].lastAccessTimestamp = block.timestamp;
        entries[entryIds["coti_usd_price"]].lastAccessTimestamp = block.timestamp;

        gtUint64 c = MpcCore.div(a, b); // NOTE: Might want to consider using 18 decimals

        emit clearUint(msg.sender, MpcCore.decrypt(c)); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }

    function add(string calldata name, uint64 value) external {
        gtUint64 gtEncryptedValue = MpcCore.onBoard(encryptedValues[name]);
        
        entries[entryIds[name]].lastAccessTimestamp = block.timestamp;

        gtUint64 gtValue = MpcCore.setPublic64(value);

        ctUint64 ctEncryptedInput = MpcCore.offBoardToUser(add(gtEncryptedValue, gtValue, 0, address(0), name), msg.sender); // reencrypt with the users AES key

        emit encryptedUint(msg.sender, ctEncryptedInput); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }

    function subtract(string calldata name, uint64 value) external {
        gtUint64 gtEncryptedValue = MpcCore.onBoard(encryptedValues[name]);
        
        entries[entryIds[name]].lastAccessTimestamp = block.timestamp;

        gtUint64 gtValue = MpcCore.setPublic64(value);

        ctUint64 ctEncryptedInput = MpcCore.offBoardToUser(sub(gtEncryptedValue, gtValue, 0, address(0), name), msg.sender); // reencrypt with the users AES key

        emit encryptedUint(msg.sender, ctEncryptedInput); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }
    
    function greaterThan(string calldata name, uint64 value) external {
        gtUint64 gtEncryptedValue = MpcCore.onBoard(encryptedValues[name]);
        
        entries[entryIds[name]].lastAccessTimestamp = block.timestamp;

        gtUint64 gtValue = MpcCore.setPublic64(value);

        ctBool ctEncryptedInput = MpcCore.offBoardToUser(gt(gtEncryptedValue, gtValue, 0, address(0), name), msg.sender); // reencrypt with the users AES key

        emit encryptedBool(msg.sender, ctEncryptedInput); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }

    function lessThan(string calldata name, uint64 value) external {
        gtUint64 gtEncryptedValue = MpcCore.onBoard(encryptedValues[name]);
        
        entries[entryIds[name]].lastAccessTimestamp = block.timestamp;

        gtUint64 gtValue = MpcCore.setPublic64(value);

        ctBool ctEncryptedInput = MpcCore.offBoardToUser(lt(gtEncryptedValue, gtValue, 0, address(0), name), msg.sender); // reencrypt with the users AES key

        emit encryptedBool(msg.sender, ctEncryptedInput); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }

    function decrypt(string calldata name) external {
        gtUint64 gtEncryptedValue = MpcCore.onBoard(encryptedValues[name]);

        entries[entryIds[name]].lastAccessTimestamp = block.timestamp;

        uint64 clearInput = decrypt(gtEncryptedValue, 0, address(0), name); // reencrypt with the users AES key

        emit clearUint(msg.sender, clearInput); // we emit the value as an event since we cannot return a value off-chain from a transaction
    }

    /**
     * @notice adds a new entry to the database or overwrites an existing entry
     * @param name key of the new database entry (or the entry to overwrite)
     * @param gtEncryptedValue encrypted value of the new database entry
     */
    function _setItem(
        string memory name,
        gtUint64 gtEncryptedValue
    )
        internal
    {
        if (ctUint64.unwrap(encryptedValues[name]) == 0) {
            entries.push(DatabaseEntry(name, msg.sender, block.timestamp, 0));
            entryIds[name] = entryCount++;
        }

        ctUint64 ctEncryptedInput = MpcCore.offBoard(gtEncryptedValue); // reencrypt with the network AES key
        encryptedValues[name] = ctEncryptedInput;
    }
}