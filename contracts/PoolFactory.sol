//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Pool.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PoolFactory {
    using Counters for Counters.Counter;
    using Strings for uint256;
    // State variables
    address private _owner;
    Counters.Counter private _poolIds;

    struct PoolStruct {
        address poolContract;
        address owner;
        address token1;
        address token2;
        uint256 fees;
    }

    mapping(uint256 => PoolStruct) private _poolStructById;

    // Events
    event OwnerSet(address oldOwner, address newOwner);
    event Created(address indexed sender, address token1, address token2);

    constructor(address owner_) {
        _owner = owner_;
    }

    function setOwner(address owner_) external {
        require(msg.sender == _owner, "PoolFactory : only owner can set new owner");
        emit OwnerSet(_owner, owner_);
        _owner = owner_;
    }

    function create(
        address token1,
        address token2,
        uint256 fees
    ) public {
        require(token1 != token2, "PoolFactory : you cannot pair the same token");
        _poolIds.increment();
        uint256 currentId = _poolIds.current();
        Pool pool = new Pool(msg.sender, token1, token2, fees);
        _poolStructById[currentId] = PoolStruct(address(pool), msg.sender, token1, token2, fees);
    }

    function getPoolById(uint256 id) public view returns (PoolStruct memory) {
        return _poolStructById[id];
    }
}
