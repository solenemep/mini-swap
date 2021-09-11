contracts/PoolFactory.sol
PoolFactory
pool factory
Solène PETTIER
you can use this contract to create and manage pool factories

constructor nonpayable (address)
Parameters
address owner\_
Events
Created (address,address,address)
Parameters
address sender
address token1
address token2
OwnerSet (address,address)
Parameters
address oldOwner
address newOwner
Methods
create nonpayable (address,address,uint256)
create a new pool

create a pool, registered in a mapping

Parameters
address tokenA: address of tokenA
address tokenB: address of tokenB
uint256 fees: fees of this pool
getPoolAddressByInfo view (address,address,uint256)
get specific pool

Parameters
address tokenA: address of tokenA
address tokenB: address of tokenB
uint256 fees: fees of this pool
Return Values
address \_0: address of the researched pool
owner view ()
get owner of contract

Return Values
address \_0: address of the owner
setOwner nonpayable (address)
set owner of the Pool factory

only owner can use this function

Parameters
address owner\_: new owner
