/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Pool', async function () {
  let Pool, pool, Token1, token1, Token2, token2, dev, reserve, owner, alice, bob;

  const FEES = 1;
  const ADDRESS0 = '0x0';
  const NAME = 'LiquidityPool';
  const SYMBOL = 'LP';
  const AMOUNT1 = 100;
  const AMOUNT2 = 200;
  const AMOUNT_SWAP = 200;
  const INIT_SUPPLY = 10 ** 9;

  beforeEach(async function () {
    [dev, reserve, owner, alice, bob] = await ethers.getSigners();
    Token1 = await ethers.getContractFactory('Token1');
    token1 = await Token1.connect(dev).deploy(reserve.address, INIT_SUPPLY);
    await token1.deployed();
    Token2 = await ethers.getContractFactory('Token2');
    token2 = await Token2.connect(dev).deploy(reserve.address, INIT_SUPPLY);
    await token2.deployed();
    Pool = await ethers.getContractFactory('Pool');
    pool = await Pool.connect(dev).deploy(token1.address, token2.address, FEES);
    await pool.deployed();
  });

  describe('Deployment', async function () {
    it(`sets name : ${NAME}`, async function () {
      expect(await pool.name()).to.equal(NAME);
    });
    it(`sets symbol : ${SYMBOL}`, async function () {
      expect(await pool.symbol()).to.equal(SYMBOL);
    });
    it(`sets token1`, async function () {
      expect(await pool.token1()).to.equal(token1.address);
    });
    it(`sets token2`, async function () {
      expect(await pool.token2()).to.equal(token2.address);
    });
    it(`sets fees : ${FEES}`, async function () {
      expect(await pool.fees()).to.equal(FEES);
    });
  });

  describe('functions', async function () {
    beforeEach(async function () {
      await token1.connect(reserve).approve(pool.address, INIT_SUPPLY);
      await token2.connect(reserve).approve(pool.address, INIT_SUPPLY);
    });

    describe('depositLiquidity', async function () {
      it(`changes balances`, async function () {
        await pool.connect(reserve).depositLiquidity(0, AMOUNT2);
        expect(await token1.balanceOf(pool.address)).to.equal(AMOUNT2);
        expect(await token2.balanceOf(pool.address)).to.equal(0);
        expect(await token1.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT2);
        expect(await token2.balanceOf(reserve.address)).to.equal(INIT_SUPPLY);
        await pool.connect(reserve).depositLiquidity(1, AMOUNT2);
        expect(await token1.balanceOf(pool.address)).to.equal(AMOUNT2);
        expect(await token2.balanceOf(pool.address)).to.equal(AMOUNT2);
        expect(await token1.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT2);
        expect(await token2.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT2);
        await pool.connect(reserve).depositLiquidity(0, AMOUNT1);
        expect(await token1.balanceOf(pool.address)).to.equal(AMOUNT1 + AMOUNT2);
        expect(await token2.balanceOf(pool.address)).to.equal(AMOUNT2);
        expect(await token1.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - (AMOUNT1 + AMOUNT2));
        expect(await token2.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT2);
      });
      it(`mints LP token to sender`, async function () {
        await pool.connect(reserve).depositLiquidity(0, AMOUNT2);
        expect(await pool.balanceOf(reserve.address)).to.equal(AMOUNT2);
        await pool.connect(reserve).depositLiquidity(1, AMOUNT2);
        expect(await pool.balanceOf(reserve.address)).to.equal(AMOUNT2 + AMOUNT2);
        await pool.connect(reserve).depositLiquidity(0, AMOUNT1);
        expect(await pool.balanceOf(reserve.address)).to.equal(AMOUNT1 + AMOUNT2 + AMOUNT2);
      });
      it(`emits Deposited event`, async function () {
        await expect(pool.connect(reserve).depositLiquidity(0, AMOUNT2))
          .to.emit(pool, 'Deposited')
          .withArgs(reserve.address, 0, AMOUNT2);
        await expect(pool.connect(reserve).depositLiquidity(1, AMOUNT2))
          .to.emit(pool, 'Deposited')
          .withArgs(reserve.address, 1, AMOUNT2);
        await expect(pool.connect(reserve).depositLiquidity(0, AMOUNT1))
          .to.emit(pool, 'Deposited')
          .withArgs(reserve.address, 0, AMOUNT1);
      });
    });
    describe('removeLiquidity', async function () {
      it(`changes balances`, async function () {
        await pool.connect(reserve).depositLiquidity(0, AMOUNT1 + AMOUNT2);
        await pool.connect(reserve).depositLiquidity(1, AMOUNT2);

        await pool.connect(reserve).removeLiquidity(0, AMOUNT2);
        expect(await token1.balanceOf(pool.address)).to.equal(AMOUNT1);
        expect(await token2.balanceOf(pool.address)).to.equal(AMOUNT2);
        expect(await token1.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT1);
        expect(await token2.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT2);
        await pool.connect(reserve).removeLiquidity(1, AMOUNT2);
        expect(await token1.balanceOf(pool.address)).to.equal(AMOUNT1);
        expect(await token2.balanceOf(pool.address)).to.equal(0);
        expect(await token1.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT1);
        expect(await token2.balanceOf(reserve.address)).to.equal(INIT_SUPPLY);
        await pool.connect(reserve).removeLiquidity(0, AMOUNT1);
        expect(await token1.balanceOf(pool.address)).to.equal(0);
        expect(await token2.balanceOf(pool.address)).to.equal(0);
        expect(await token1.balanceOf(reserve.address)).to.equal(INIT_SUPPLY);
        expect(await token2.balanceOf(reserve.address)).to.equal(INIT_SUPPLY);
      });
      it(`burns LP token from sender`, async function () {
        await pool.connect(reserve).depositLiquidity(0, AMOUNT1 + AMOUNT2);
        await pool.connect(reserve).depositLiquidity(1, AMOUNT2);

        await pool.connect(reserve).removeLiquidity(0, AMOUNT2);
        expect(await pool.balanceOf(reserve.address)).to.equal(AMOUNT1 + AMOUNT2);
        await pool.connect(reserve).removeLiquidity(1, AMOUNT2);
        expect(await pool.balanceOf(reserve.address)).to.equal(AMOUNT1);
        await pool.connect(reserve).removeLiquidity(0, AMOUNT1);
        expect(await pool.balanceOf(reserve.address)).to.equal(0);
      });
      it(`emits Removed event`, async function () {
        await pool.connect(reserve).depositLiquidity(0, AMOUNT1 + AMOUNT2);
        await pool.connect(reserve).depositLiquidity(1, AMOUNT2);

        await expect(pool.connect(reserve).removeLiquidity(0, AMOUNT2))
          .to.emit(pool, 'Removed')
          .withArgs(reserve.address, 0, AMOUNT2);
        await expect(pool.connect(reserve).removeLiquidity(1, AMOUNT2))
          .to.emit(pool, 'Removed')
          .withArgs(reserve.address, 1, AMOUNT2);
        await expect(pool.connect(reserve).removeLiquidity(0, AMOUNT1))
          .to.emit(pool, 'Removed')
          .withArgs(reserve.address, 0, AMOUNT1);
      });
    });

    describe('swap', async function () {
      it(`reverts if cfmm is null`, async function () {
        await expect(pool.connect(reserve).swap(0, AMOUNT_SWAP)).to.be.revertedWith(
          'Pool : do not have liquidity to swap'
        );
        await expect(pool.connect(reserve).swap(1, AMOUNT_SWAP)).to.be.revertedWith(
          'Pool : do not have liquidity to swap'
        );
        await pool.connect(reserve).depositLiquidity(0, AMOUNT2);
        await expect(pool.connect(reserve).swap(0, AMOUNT_SWAP)).to.be.revertedWith(
          'Pool : do not have liquidity to swap'
        );
        await expect(pool.connect(reserve).swap(1, AMOUNT_SWAP)).to.be.revertedWith(
          'Pool : do not have liquidity to swap'
        );
        await pool.connect(reserve).depositLiquidity(1, AMOUNT2);
        await pool.connect(reserve).removeLiquidity(0, AMOUNT2);
        await expect(pool.connect(reserve).swap(0, AMOUNT_SWAP)).to.be.revertedWith(
          'Pool : do not have liquidity to swap'
        );
        await expect(pool.connect(reserve).swap(1, AMOUNT_SWAP)).to.be.revertedWith(
          'Pool : do not have liquidity to swap'
        );
      });
      it(`changes balances`, async function () {
        it(`in token1 swap case`, async function () {
          await pool.connect(reserve).depositLiquidity(0, AMOUNT1 + AMOUNT2);
          await pool.connect(reserve).depositLiquidity(1, AMOUNT2);

          await pool.connect(reserve).swap(0, AMOUNT_SWAP);
          expect(await token1.balanceOf(pool.address)).to.equal(AMOUNT1 + AMOUNT2 + AMOUNT_SWAP);
          expect(await token2.balanceOf(pool.address)).to.equal(AMOUNT2 - 80);
          expect(await token1.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - (AMOUNT1 + AMOUNT2) - AMOUNT_SWAP);
          expect(await token2.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT2 + 80);
        });

        it(`in token2 swap case`, async function () {
          await pool.connect(reserve).depositLiquidity(0, AMOUNT1 + AMOUNT2);
          await pool.connect(reserve).depositLiquidity(1, AMOUNT2);
          await pool.connect(reserve).removeLiquidity(0, AMOUNT1);

          await pool.connect(reserve).swap(1, AMOUNT_SWAP);
          expect(await token1.balanceOf(pool.address)).to.equal(AMOUNT2 - 100);
          expect(await token2.balanceOf(pool.address)).to.equal(AMOUNT2 + AMOUNT_SWAP);
          expect(await token1.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT2 + 100);
          expect(await token2.balanceOf(reserve.address)).to.equal(INIT_SUPPLY - AMOUNT2 - AMOUNT_SWAP);
        });
      });
      it(`emits Swapped event`, async function () {
        it(`in token1 swap case`, async function () {
          await pool.connect(reserve).depositLiquidity(0, AMOUNT1 + AMOUNT2);
          await pool.connect(reserve).depositLiquidity(1, AMOUNT2);
          await expect(pool.connect(reserve).swap(0, AMOUNT_SWAP))
            .to.emit(pool, 'Swapped')
            .withArgs(reserve.address, 0, AMOUNT_SWAP, 80);
        });
        it(`in token2 swap case`, async function () {
          await pool.connect(reserve).depositLiquidity(0, AMOUNT1 + AMOUNT2);
          await pool.connect(reserve).depositLiquidity(1, AMOUNT2);
          await pool.connect(reserve).removeLiquidity(0, AMOUNT1);
          await expect(pool.connect(reserve).swap(1, AMOUNT_SWAP))
            .to.emit(pool, 'Swapped')
            .withArgs(reserve.address, 1, AMOUNT_SWAP, 100);
        });
      });
    });

    describe('cfmm', async function () {
      it(`returns right value`, async function () {
        expect(await pool.cfmm()).to.equal(0);
        await pool.connect(reserve).depositLiquidity(0, AMOUNT2);
        // only deposited on one side, constant remains null
        expect(await pool.cfmm()).to.equal(0);
        await pool.connect(reserve).depositLiquidity(1, AMOUNT2);
        // deposited on two side equally : 200
        expect(await pool.cfmm()).to.equal(AMOUNT2 * AMOUNT2);
        await pool.connect(reserve).depositLiquidity(0, AMOUNT1);
        // desposited on 1 : 300, on 2 : 200
        expect(await pool.cfmm()).to.equal((AMOUNT1 + AMOUNT2) * AMOUNT2);
      });
    });
    describe('getAmountOut', async function () {
      it(`returns right value`, async function () {
        await pool.connect(reserve).depositLiquidity(0, AMOUNT2);
        // only deposited on one side, constant remains null
        expect(await pool.getAmountOut(0, AMOUNT_SWAP)).to.equal(0);
        await pool.connect(reserve).depositLiquidity(1, AMOUNT2);
        // deposited on two side equally : 200
        expect(await pool.getAmountOut(0, AMOUNT_SWAP)).to.equal(100);
        await pool.connect(reserve).depositLiquidity(0, AMOUNT1);
        // desposited on 1 : 300, on 2 : 200
        expect(await pool.getAmountOut(0, AMOUNT_SWAP)).to.equal(80);
      });
    });
  });
});
