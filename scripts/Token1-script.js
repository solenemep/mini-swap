const hre = require('hardhat');
const { deployed } = require('./deployed');

const INIT_SUPPLY = hre.ethers.utils.parseEther('1000000');

async function main() {
  const [deployer, reserve] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  // We get the contract to deploy
  const Token1 = await hre.ethers.getContractFactory('Token1');
  const token1 = await Token1.deploy(reserve.address, INIT_SUPPLY);

  await token1.deployed();

  await deployed('Token1', hre.network.name, token1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
