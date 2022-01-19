// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BoysToken is Ownable, ERC20 {
    // ไปเรียก constructor ของ ERC20 ด้วย (string memory name_, string memory symbol_)
    constructor() ERC20("BoysToken", "BoysToken") {}

    function mint(address receiverAddr, uint256 amount) public onlyOwner {
        _mint(receiverAddr, amount);
    }
}
