// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {PrivateERC20} from "@coti-io/coti-contracts/contracts/token/PrivateERC20/PrivateERC20.sol";
import "@coti-io/coti-contracts/contracts/utils/mpc/MpcCore.sol";

contract PrivateToken is PrivateERC20 {
    constructor(string memory name_, string memory symbol_) PrivateERC20(name_, symbol_) {}

    function mint(address account, uint64 amount) external {
        _mint(account, MpcCore.setPublic64(amount));
    }

    function burn(address account, uint64 amount) external {
        _burn(account, MpcCore.setPublic64(amount));
    }
}