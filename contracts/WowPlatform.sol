// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WowPlatform {
    IERC20 private _token;
    mapping(address => uint256) _balances;

    constructor(address tokenAddr) {
        _token = IERC20(tokenAddr);
    }

    function deposit(uint256 amount) public {
        require(amount > 0, "amount should be more than 0");

        address userAddr = msg.sender;
        _balances[userAddr] += amount;
        _token.transferFrom(userAddr, address(this), amount);
    }

    function withdraw(uint256 amount) public {
        address userAddr = msg.sender;
        require(
            _balances[userAddr] >= amount,
            "amount is too much for withdraw"
        );

        _balances[userAddr] -= amount;
        _token.transfer(userAddr, amount);
    }
}
