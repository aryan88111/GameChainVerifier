const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const GameWager = await hre.ethers.getContractFactory("GameWager");
  const gameWager = await GameWager.deploy();
  await gameWager.waitForDeployment();

  const address = await gameWager.getAddress();
  console.log("GameWager deployed to:", address);

  // Save deployment info
  const deploymentDir = path.join(__dirname, "../deployments/local");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(deploymentDir, "GameWager.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
