const hre = require('hardhat');
const { deployed } = require('./deployed');

const INIT_SUPPLY = hre.ethers.utils.parseEther('1000000');

async function main() {
  const [deployer, reserve] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  // We get the contract to deploy
  const Token4 = await hre.ethers.getContractFactory('Token4');
  const token4 = await Token4.deploy(reserve.address, INIT_SUPPLY);

  await token4.deployed();

  await deployed('Token4', hre.network.name, token4.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
