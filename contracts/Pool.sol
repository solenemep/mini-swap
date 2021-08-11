//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Pool is ERC20 {
    using Address for address payable;

    // State variables
    IERC20 private _token1;
    IERC20 private _token2;
    uint256 private _cfmm;
    uint256 private _fees;

    enum Token {
        token1,
        token2
    }

    // Events
    event Deposited(address indexed sender, uint256 amount);
    event Removed(address indexed sender, uint256 amountLP);
    event Swapped(address indexed sender, uint256 amount1, uint256 amount2);

    constructor(
        address token1_,
        address token2_,
        uint256 fees_
    ) ERC20("LiquidityPool", "LP") {
        _token1 = IERC20(token1_);
        _token2 = IERC20(token2_);
        _fees = fees_;
    }

    function depositLiquitity(Token token, uint256 amount) public {
        if (token == Token.token1) {
            _token1.transferFrom(msg.sender, address(this), amount);
        } else if (token == Token.token2) {
            _token2.transferFrom(msg.sender, address(this), amount);
        }
        _mint(msg.sender, amount);
        emit Deposited(msg.sender, amount);
    }

    function removeLiquidity(Token token, uint256 amountLP) public {
        if (token == Token.token1) {
            _token1.transferFrom(address(this), msg.sender, amountLP);
        } else if (token == Token.token2) {
            _token2.transferFrom(address(this), msg.sender, amountLP);
        }
        _burn(msg.sender, amountLP);
        emit Removed(msg.sender, amountLP);
    }

    function swap(Token token, uint256 amountIn) public {
        uint256 amountOut;
        if (token == Token.token1) {
            _token1.transferFrom(msg.sender, address(this), amountIn);
            amountOut = getAmountOut(_token1, _token2, amountIn);
            _token2.transferFrom(address(this), msg.sender, amountOut);
        } else if (token == Token.token2) {
            _token2.transferFrom(msg.sender, address(this), amountIn);
            amountOut = getAmountOut(_token2, _token1, amountIn);
            _token1.transferFrom(address(this), msg.sender, amountOut);
        }
        emit Swapped(msg.sender, amountIn, amountOut);
        // add fees management
    }

    function cfmm() public view returns (uint256) {
        return _token1.balanceOf(address(this)) * _token2.balanceOf(address(this));
    }

    function getAmountOut(
        IERC20 tokenIn,
        IERC20 tokenOut,
        uint256 amountIn
    ) public view returns (uint256 amountOut) {
        uint256 reserveIn = tokenIn.balanceOf(address(this));
        uint256 reserveOut = tokenOut.balanceOf(address(this));
        uint256 newReserveIn = reserveIn + amountIn;
        uint256 newReserveOut = cfmm() / newReserveIn;
        amountOut = reserveOut - newReserveOut;
    }
}
