//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Pool {
    using Address for address payable;

    // State variables
    address private _poolOwner;
    IERC20 private _token1;
    IERC20 private _token2;
    uint256 private _cpmm;
    uint256 private _fees;
    bool private _deposited;

    enum TokenSwapped {
        token1,
        token2
    }

    // Events
    event Deposited(address indexed sender, uint256 amountTKN1, uint256 amountTKN2);
    event Removed(address indexed sender, uint256 amountTKN1, uint256 amountTKN2);
    event Swapped(address indexed sender, uint256 amountTKN1, uint256 amountTKN2);

    constructor(
        address poolOwner_,
        address token1Address_,
        address token2Address_,
        uint256 fees_
    ) {
        _poolOwner = poolOwner_;
        _token1 = IERC20(token1Address_);
        _token2 = IERC20(token2Address_);
        _fees = fees_;
    }

    modifier onlyOnce() {
        require(_deposited == false, "Pool : this Pool has already been opened");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == _poolOwner, "Pool : only owner of the pool can use the function");
        _;
    }

    /// @notice Private function called throught receive and deposit functions
    /// @dev Private function called throught receive and deposit functions
    /// @param amountTKN1 the amount of TKN1 sent to the pool
    /// @param amountTKN2 the amount of TKN2 sent to the pool
    function deposit(uint256 amountTKN1, uint256 amountTKN2) public onlyOnce onlyOwner {
        require(_token1.balanceOf(msg.sender) >= amountTKN1, "PoolTKN : you do not have enought TKN1");
        require(_token2.balanceOf(msg.sender) >= amountTKN2, "PoolTKN : you do not have enought TKN2");
        _deposited = true;
        _cpmm = amountTKN1 * amountTKN2;
        _token1.transferFrom(msg.sender, address(this), amountTKN1);
        _token2.transferFrom(msg.sender, address(this), amountTKN2);
        emit Deposited(msg.sender, amountTKN1, amountTKN2);
    }

    function removeLiquidity() public onlyOwner {
        uint256 amountTKN1 = _token1.balanceOf(address(this));
        uint256 amountTKN2 = _token2.balanceOf(address(this));
        _token1.transferFrom(address(this), msg.sender, amountTKN1);
        _token2.transferFrom(address(this), msg.sender, amountTKN2);
        emit Removed(msg.sender, amountTKN1, amountTKN2);
    }

    function swap(TokenSwapped token, uint256 amountTKN) public {
        if (token == TokenSwapped.token1) {
            require(_token1.balanceOf(msg.sender) >= amountTKN, "Pool : you don't have enought token to swap");
            uint256 amountTKN2 = _cpmm / amountTKN;
            _token1.transferFrom(msg.sender, address(this), amountTKN);
            _token2.transferFrom(address(this), msg.sender, amountTKN2);
            emit Swapped(msg.sender, amountTKN, amountTKN2);
        } else if (token == TokenSwapped.token2) {
            require(_token2.balanceOf(msg.sender) >= amountTKN, "Pool : you don't have enought token to swap");
            uint256 amountTKN1 = _cpmm / amountTKN;
            _token1.transferFrom(address(this), msg.sender, amountTKN1);
            _token2.transferFrom(msg.sender, address(this), amountTKN);
            emit Swapped(msg.sender, amountTKN1, amountTKN);
        }
        // add fees management
    }

    // getters
    function poolOwner() public view returns (address) {
        return _poolOwner;
    }

    function deposited() public view returns (bool) {
        return _deposited;
    }

    function cpmm() public view returns (uint256) {
        return _cpmm;
    }
}
