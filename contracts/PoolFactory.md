# contracts/PoolFactory.sol

## PoolFactory

#### pool factory

#### Solène PETTIER

##### you can use this contract to create and manage pool factories

**constructor nonpayable (address)**

_Parameters_

address owner\_

###### Events

**Created (address,address,address)**

_Parameters_

address sender

address token1

address token2

**OwnerSet (address,address)**

_Parameters_

address oldOwner

address newOwner

###### Methods

**create nonpayable (address,address,uint256)**

create a new pool

create a pool, registered in a mapping

_Parameters_

address tokenA: address of tokenA

address tokenB: address of tokenB

uint256 fees: fees of this pool

**getPoolAddressByInfo view (address,address,uint256)**

get specific pool

_Parameters_

address tokenA: address of tokenA

address tokenB: address of tokenB

uint256 fees: fees of this pool

_Return Values_

address \_0: address of the researched pool

**owner view ()**

get owner of contract

_Return Values_

address \_0: address of the owner

**setOwner nonpayable (address)**

set owner of the Pool factory

only owner can use this function

_Parameters_

address owner\_: new owner
