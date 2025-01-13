const hre = require("hardhat");

async function main() {
  const WagerContract = await hre.ethers.getContractFactory("WagerContract");
  const wagerContract = await WagerContract.deploy();

  await wagerContract.waitForDeployment();

  console.log("WagerContract deployed to:", await wagerContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
