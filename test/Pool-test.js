/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Pool', async function () {
  let PoolFactory, poolFactory, Pool, pool, dev, owner, alice, bob;

  const TOKEN1 = '';
  const TOKEN2 = '';
  const FEES = 1;

  beforeEach(async function () {
    [dev, owner, alice, bob] = await ethers.getSigners();
    PoolFactory = await ethers.getContractFactory('PoolFactory');
    poolFactory = await PoolFactory.connect(dev).deploy(owner.address);
    await poolFactory.deployed();
    await poolFactory.create(TOKEN1, TOKEN2, FEES);
  });

  describe('Deployment', async function () {});
  describe('depositLiquidity', async function () {});
  describe('removeLiquidity', async function () {});
  describe('swap', async function () {});
  describe('cfmm', async function () {});
  describe('getAmountOut', async function () {});
});
