const path = require('path');
const fs = require('fs');
const solc = require('solc');

function findImports(importPath) {
    try {
        let fullPath;
        if (importPath.startsWith('@openzeppelin')) {
            // Handle OpenZeppelin imports from blockchain/node_modules
            fullPath = path.resolve(__dirname, '../node_modules', importPath);
        } else {
            // Handle local imports
            fullPath = path.resolve(__dirname, '../contracts', importPath);
        }
        
        const content = fs.readFileSync(fullPath, 'utf8');
        return { contents: content };
    } catch (error) {
        console.error('Error finding import:', importPath, error);
        return { error: 'File not found' };
    }
}

function compile() {
    // Read the Solidity source code
    const contractPath = path.resolve(__dirname, '../contracts/GameWager.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    // Create input object for solc compiler
    const input = {
        language: 'Solidity',
        sources: {
            'GameWager.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    // Compile the contract
    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    // Check for errors
    if (output.errors) {
        output.errors.forEach(error => {
            console.error(error.formattedMessage);
        });
        if (output.errors.some(error => error.severity === 'error')) {
            throw new Error('Compilation failed');
        }
    }

    // Extract contract
    const contract = output.contracts['GameWager.sol']['GameWager'];

    // Create artifacts directory if it doesn't exist
    const artifactsDir = path.join(__dirname, '../contracts');
    if (!fs.existsSync(artifactsDir)) {
        fs.mkdirSync(artifactsDir, { recursive: true });
    }

    // Write compiled contract to file
    fs.writeFileSync(
        path.join(artifactsDir, 'GameWager.json'),
        JSON.stringify({
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object,
        }, null, 2)
    );

    console.log('Contract compiled successfully');
    return contract;
}

// Run compilation if called directly
if (require.main === module) {
    compile();
}

module.exports = compile;
