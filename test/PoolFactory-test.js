describe('Pool', async function () {
  let PoolFactory, poolFactory, dev, owner, alice, bob;

  beforeEach(async function () {
    [dev, owner, alice, bob] = await ethers.getSigners();
    PoolFactory = await ethers.getContractFactory('PoolFactory');
    poolFactory = await PoolFactory.connect(dev).deploy(owner.address);
    await poolFactory.deployed();
  });

  describe('Deployment', async function () {});
  describe('setOwner', async function () {});
  describe('create', async function () {});
  describe('getPoolAddressByInfo', async function () {});
});
