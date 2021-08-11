// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token1 is ERC20 {
    address private _reserve;

    constructor(address reserve_, uint256 initialSupply) ERC20("Token1", "TKN1") {
        _reserve = reserve_;
        _mint(reserve_, initialSupply);
    }

    function reserve() public view returns (address) {
        return _reserve;
    }
}
