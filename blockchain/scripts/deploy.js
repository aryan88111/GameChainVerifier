const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const GameWager = require('../contracts/GameWager.json');

async function deployContract() {
    try {
        // Connect to local blockchain
        const web3 = new Web3('http://localhost:8545');

        // Get accounts
        const accounts = await web3.eth.getAccounts();
        const deployer = accounts[0];

        console.log('Deploying contract from account:', deployer);

        // Create contract instance
        const gameWager = new web3.eth.Contract(GameWager.abi);

        // Deploy contract
        const deploy = gameWager.deploy({
            data: GameWager.bytecode,
            arguments: [] // Add constructor arguments if any
        });

        // Send deployment transaction
        const gas = await deploy.estimateGas();
        const contract = await deploy.send({
            from: deployer,
            gas: Math.floor(gas * 1.1) // Add 10% buffer
        });

        console.log('Contract deployed at:', contract.options.address);

        // Create deployments directory if it doesn't exist
        const deploymentsDir = path.join(__dirname, '../deployments/local');
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir, { recursive: true });
        }

        // Save deployment info
        const deploymentInfo = {
            address: contract.options.address,
            network: 'local',
            deployer: deployer,
            deployedAt: new Date().toISOString()
        };

        fs.writeFileSync(
            path.join(deploymentsDir, 'GameWager.json'),
            JSON.stringify(deploymentInfo, null, 2)
        );

        console.log('Deployment info saved to:', path.join(deploymentsDir, 'GameWager.json'));
        return contract.options.address;
    } catch (error) {
        console.error('Deployment error:', error);
        throw error;
    }
}

// Run deployment if called directly
if (require.main === module) {
    deployContract()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = deployContract;
