contracts/Pool.sol
Pool
pool
Solène PETTIER
you can use this contract to interact with pool and swap tokens

in existant pool, manage deposit and remove liquidity in exchange of LP token (ERC20)

constructor nonpayable (address,address,uint256)
Parameters
address token1*
address token2*
uint256 fees\_
Events
Approval (address,address,uint256)
Parameters
address owner
address spender
uint256 value
Deposited (address,uint8,uint256)
Parameters
address sender
uint8 token
uint256 amount
Removed (address,uint8,uint256)
Parameters
address sender
uint8 token
uint256 amountLP
Swapped (address,uint8,uint256,uint256)
Parameters
address sender
uint8 token
uint256 amount1
uint256 amount2
Transfer (address,address,uint256)
Parameters
address from
address to
uint256 value
Methods
allowance view (address,address)
See {IERC20-allowance}.

Parameters
address owner
address spender
Return Values
uint256 \_0
approve nonpayable (address,uint256)
See {IERC20-approve}. Requirements: - `spender` cannot be the zero address.

Parameters
address spender
uint256 amount
Return Values
bool \_0
balanceOf view (address)
See {IERC20-balanceOf}.

Parameters
address account
Return Values
uint256 \_0
cfmm view ()
function that return the actual constant of the pool

Return Values
uint256 _0: constant based on number of tokenA \* number of tokenB of pool
decimals view ()
Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5,05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the value {ERC20} uses, unless this function is overridden; NOTE: This information is only used for \_display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}.

Return Values
uint8 \_0
decreaseAllowance nonpayable (address,uint256)
Atomically decreases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.

Parameters
address spender
uint256 subtractedValue
Return Values
bool \_0
depositLiquidity nonpayable (uint8,uint256)
deposit liquidity in existant pool

mint an amount of LP token (ERC20) to depositer

Parameters
uint8 token: address of token (choosed between tokenA & tokenB)
uint256 amount: amount of token to deposit
fees view ()
get fees of pool

Return Values
uint256 \_0: fees
getAmountOut view (address,address,uint256)
calculate amountOut based on parameters of swap and constant

function called in swap function to calculate amountOut based on amountIn

Parameters
address tokenIn: address of tokenIn (choosed between tokenA & tokenB)
address tokenOut: address of tokenOut (based on tokenIn)
uint256 amountIn: amount of choosen tokenIn entering
Return Values
uint256 amountOut
increaseAllowance nonpayable (address,uint256)
Atomically increases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address.

Parameters
address spender
uint256 addedValue
Return Values
bool \_0
name view ()
Returns the name of the token.

Return Values
string \_0
removeLiquidity nonpayable (uint8,uint256)
remove liquidity in existant pool

burn this amount of LP token (ERC20) to remover

Parameters
uint8 token: address of token (choosed between tokenA & tokenB)
uint256 amountLP: amount of LP token to remove in exchange of token
swap nonpayable (uint8,uint256)
swap tokens of the pool

swap of token with the other token of the pool with calculated amount

Parameters
uint8 token: address of token (choosed between tokenA & tokenB)
uint256 amountIn: amount of choosen token entering
symbol view ()
Returns the symbol of the token, usually a shorter version of the name.

Return Values
string \_0
token1 view ()
get token1 address

Return Values
address \_0: address of token1
token2 view ()
get token2 address

Return Values
address \_0: address of token2
totalSupply view ()
See {IERC20-totalSupply}.

Return Values
uint256 \_0
transfer nonpayable (address,uint256)
See {IERC20-transfer}. Requirements: - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.

Parameters
address recipient
uint256 amount
Return Values
bool \_0
transferFrom nonpayable (address,address,uint256)
See {IERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}. Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`'s tokens of at least `amount`.

Parameters
address sender
address recipient
uint256 amount
Return Values
bool \_0
