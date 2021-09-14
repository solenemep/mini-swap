const hre = require('hardhat');
const { deployed } = require('./deployed');

const INIT_SUPPLY = hre.ethers.utils.parseEther('1000000');

async function main() {
  const [deployer, reserve] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  // We get the contract to deploy
  const Token3 = await hre.ethers.getContractFactory('Token3');
  const token3 = await Token3.deploy(reserve.address, INIT_SUPPLY);

  await token3.deployed();

  await deployed('Token3', hre.network.name, token3.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
