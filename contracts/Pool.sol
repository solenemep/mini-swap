//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title pool
/// @author Solène PETTIER
/// @notice you can use this contract to interact with pool and swap tokens
/// @dev in existant pool, manage deposit and remove liquidity in exchange of LP token (ERC20)
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
    event Deposited(address indexed sender, Token token, uint256 amount);
    event Removed(address indexed sender, Token token, uint256 amountLP);
    event Swapped(address indexed sender, Token token, uint256 amount1, uint256 amount2);

    constructor(
        address token1_,
        address token2_,
        uint256 fees_
    ) ERC20("LiquidityPool", "LP") {
        _token1 = IERC20(token1_);
        _token2 = IERC20(token2_);
        _fees = fees_;
    }

    /// @notice deposit liquidity in existant pool
    /// @dev mint an amount of LP token (ERC20) to depositer
    /// @param token address of token (choosed between tokenA & tokenB)
    /// @param amount amount of token to deposit
    function depositLiquidity(Token token, uint256 amount) public {
        if (token == Token.token1) {
            _token1.transferFrom(msg.sender, address(this), amount);
        } else if (token == Token.token2) {
            _token2.transferFrom(msg.sender, address(this), amount);
        }
        _mint(msg.sender, amount);
        emit Deposited(msg.sender, token, amount);
    }

    /// @notice remove liquidity in existant pool
    /// @dev burn this amount of LP token (ERC20) to remover
    /// @param token address of token (choosed between tokenA & tokenB)
    /// @param amountLP amount of LP token to remove in exchange of token
    function removeLiquidity(Token token, uint256 amountLP) public {
        if (token == Token.token1) {
            _token1.transfer(msg.sender, amountLP);
        } else if (token == Token.token2) {
            _token2.transfer(msg.sender, amountLP);
        }
        _burn(msg.sender, amountLP);
        emit Removed(msg.sender, token, amountLP);
    }

    /// @notice swap tokens of the pool
    /// @param token address of token (choosed between tokenA & tokenB)
    /// @param amountIn amount of choosen token entering
    /// @dev swap of token with the other token of the pool with calculated amount
    function swap(Token token, uint256 amountIn) public {
        require(cfmm() != 0, "Pool : do not have liquidity to swap");
        uint256 amountOut;
        if (token == Token.token1) {
            amountOut = getAmountOut(_token1, _token2, amountIn);
            _token1.transferFrom(msg.sender, address(this), amountIn);
            _token2.transfer(msg.sender, amountOut);
        } else if (token == Token.token2) {
            amountOut = getAmountOut(_token2, _token1, amountIn);
            _token1.transfer(msg.sender, amountOut);
            _token2.transferFrom(msg.sender, address(this), amountIn);
        }
        emit Swapped(msg.sender, token, amountIn, amountOut);
        // add fees management
    }

    /// @notice function that return the actual constant of the pool
    /// @return constant based on number of tokenA * number of tokenB of pool
    function cfmm() public view returns (uint256) {
        return _token1.balanceOf(address(this)) * _token2.balanceOf(address(this));
    }

    /// @notice calculate amountOut based on parameters of swap and constant
    /// @param tokenIn address of tokenIn (choosed between tokenA & tokenB)
    /// @param tokenOut address of tokenOut (based on tokenIn)
    /// @param amountIn amount of choosen tokenIn entering
    /// @dev function called in swap function to calculate amountOut based on amountIn
    function getAmountOut(
        IERC20 tokenIn,
        IERC20 tokenOut,
        uint256 amountIn
    ) public view returns (uint256 amountOut) {
        uint256 reserveIn = tokenIn.balanceOf(address(this));
        uint256 reserveOut = tokenOut.balanceOf(address(this));
        uint256 newReserveIn = reserveIn + amountIn;
        uint256 newReserveOut = cfmm() / newReserveIn;
        return amountOut = reserveOut - newReserveOut;
    }

    /// @notice get token1 address
    /// @return address of token1
    function token1() public view returns (IERC20) {
        return _token1;
    }

    /// @notice get token2 address
    /// @return address of token2
    function token2() public view returns (IERC20) {
        return _token2;
    }

    /// @notice get fees of pool
    /// @return fees
    function fees() public view returns (uint256) {
        return _fees;
    }
}
