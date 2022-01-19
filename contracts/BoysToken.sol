// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BoysToken is Ownable, ERC20 {
    constructor() ERC20("BoysToken", "BoysToken") {}

    function mint(address receiverAddr, uint256 amount) public onlyOwner {
        require(receiverAddr != address(0), "Do not mint to zero address!");
        _mint(receiverAddr, amount);
    }
}
