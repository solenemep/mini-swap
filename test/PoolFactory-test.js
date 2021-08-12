/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Pool', async function () {
  let PoolFactory, poolFactory, dev, owner, alice, bob;

  const TOKEN1 = '0x9C07889781F2913E660bD80b1652E8D7Cc156B65';
  const TOKEN2 = '0x29085D91a43f9C94856DFc3164481a9c5f6E7cA6';
  const FEES = 1;
  const ADDRESS0 = '0x0';

  beforeEach(async function () {
    [dev, owner, alice, bob] = await ethers.getSigners();
    PoolFactory = await ethers.getContractFactory('PoolFactory');
    poolFactory = await PoolFactory.connect(dev).deploy(owner.address);
    await poolFactory.deployed();
  });

  describe('Deployment', async function () {
    it(`sets owner`, async function () {
      expect(await poolFactory.owner()).to.equal(owner.address);
    });
  });

  describe('setOwner', async function () {
    it(`reverts if not owner`, async function () {
      await expect(poolFactory.connect(alice).setOwner(alice.address)).to.be.revertedWith(
        'PoolFactory : only owner can set new owner'
      );
    });
    it(`sets owner`, async function () {
      await poolFactory.connect(owner).setOwner(alice.address);
      expect(await poolFactory.owner()).to.equal(alice.address);
    });
    it('emits OwnerSet event', async function () {
      await expect(poolFactory.connect(owner).setOwner(alice.address))
        .to.emit(poolFactory, 'OwnerSet')
        .withArgs(owner.address, alice.address);
    });
  });
  describe('create', async function () {
    it(`reverts token address are equals`, async function () {
      await expect(poolFactory.create(TOKEN1, TOKEN1, FEES)).to.be.revertedWith(
        'PoolFactory : you cannot pair the same token'
      );
    });
    it(`reverts if combination already exists`, async function () {
      await poolFactory.create(TOKEN1, TOKEN2, FEES);
      await expect(poolFactory.create(TOKEN1, TOKEN2, FEES)).to.be.revertedWith(
        'PoolFactory : this pool alreday exists'
      );
    });
    it(`creates new Pool`, async function () {
      await poolFactory.create(TOKEN1, TOKEN2, FEES);
      expect(await poolFactory.getPoolAddressByInfo(TOKEN1, TOKEN2, FEES)).not.equal(ADDRESS0);
    });
  });
});
