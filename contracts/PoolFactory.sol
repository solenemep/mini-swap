//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Pool.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title pool factory
/// @author Solène PETTIER
/// @notice you can use this contract to create and manage pool factories
contract PoolFactory {
    // State variables
    address private _owner;

    // token + token + fees => pool
    mapping(address => mapping(address => mapping(uint256 => address))) private _poolAddressByInfo;

    // Events
    event OwnerSet(address oldOwner, address newOwner);
    event Created(address indexed sender, address token1, address token2);

    constructor(address owner_) {
        _owner = owner_;
    }

    /// @notice set owner of the Pool factory
    /// @dev only owner can use this function
    /// @param owner_ new owner
    function setOwner(address owner_) external {
        require(msg.sender == _owner, "PoolFactory : only owner can set new owner");
        emit OwnerSet(_owner, owner_);
        _owner = owner_;
    }

    /// @notice create a new pool
    /// @dev create a pool, registered in a mapping
    /// @param tokenA address of tokenA
    /// @param tokenB address of tokenB
    /// @param fees fees of this pool
    function create(
        address tokenA,
        address tokenB,
        uint256 fees
    ) public {
        require(tokenA != tokenB, "PoolFactory : you cannot pair the same token");
        (address token1, address token2) = (tokenA < tokenB) ? (tokenA, tokenB) : (tokenB, tokenA);
        require(_poolAddressByInfo[token1][token2][fees] == address(0), "PoolFactory : this pool alreday exists");
        Pool pool = new Pool(token1, token2, fees);
        _poolAddressByInfo[token1][token2][fees] = address(pool);
    }

    /// @notice get specific pool
    /// @param tokenA address of tokenA
    /// @param tokenB address of tokenB
    /// @param fees fees of this pool
    /// @return address of the researched pool
    function getPoolAddressByInfo(
        address tokenA,
        address tokenB,
        uint256 fees
    ) public view returns (address) {
        (address token1, address token2) = (tokenA < tokenB) ? (tokenA, tokenB) : (tokenB, tokenA);
        return _poolAddressByInfo[token1][token2][fees];
    }

    /// @notice get owner of contract
    /// @return address of the owner
    function owner() public view returns (address) {
        return _owner;
    }
}
