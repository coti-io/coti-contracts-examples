// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {PrivateERC20} from "@coti-io/coti-contracts/contracts/token/PrivateERC20/PrivateERC20.sol";
import "@coti-io/coti-contracts/contracts/utils/mpc/MpcCore.sol";

contract PrivateToken is PrivateERC20 {
    uint256 private _totalSupply;

    constructor(string memory name_, string memory symbol_) PrivateERC20(name_, symbol_) {}

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function mint(address account, uint256 amount) external {
        gtBool success = _mint(account, MpcCore.setPublic256(amount));

        if (MpcCore.decrypt(success)) {
            _totalSupply += amount;
        }
    }

    function burn(address account, uint256 amount) external {
        gtBool success = _burn(account, MpcCore.setPublic256(amount));

        if (MpcCore.decrypt(success)) {
            _totalSupply -= amount;
        }
    }
}