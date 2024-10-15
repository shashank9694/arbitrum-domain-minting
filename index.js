require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const domainContractABI = require("./contractAbi.json");

// Load environment variables
const RPC_URL = process.env.ARBITRUM_RPC_URL;
const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY;
const ETH_TRANSFER_AMOUNT = process.env.ETH_TRANSFER_AMOUNT;
const DOMAIN_CONTRACT_ADDRESS = process.env.DOMAIN_CONTRACT_ADDRESS;

// Provider and master wallet initialization
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const masterWallet = new ethers.Wallet(MASTER_PRIVATE_KEY, provider);

// ENS-like domain minting contract ABI (simplified example)

// Initialize contract instance for .fam domain minting
const domainContract = new ethers.Contract(DOMAIN_CONTRACT_ADDRESS, domainContractABI, provider);

async function generateNewWallets(count) {
    let wallets = [];
    for (let i = 0; i < count; i++) {
        const newWallet = ethers.Wallet.createRandom();
        wallets.push(newWallet);
        // Store wallet's private key securely (in a file for demo)
        fs.writeFileSync(`wallet_${i + 1}.json`, JSON.stringify(newWallet));
        console.log(`Wallet ${i + 1} - Address: ${newWallet.address}`);
    }
    return wallets;
}

async function transferETHToWallets(wallets) {
    const transferAmount = ethers.utils.parseEther((ETH_TRANSFER_AMOUNT / await getEthPrice()).toFixed(18));
    
    for (const wallet of wallets) {
        try {
            const tx = await masterWallet.sendTransaction({
                to: wallet.address,
                value: transferAmount
            });
            await tx.wait();
            console.log(`Transferred ${ETH_TRANSFER_AMOUNT} USD worth of ETH to ${wallet.address}`);
        } catch (error) {
            console.error(`Error transferring ETH to ${wallet.address}:`, error);
        }
    }
}

async function mintDomainForWallets(wallets) {
    for (const wallet of wallets) {
        const signer = wallet.connect(provider);
        const walletDomainContract = domainContract.connect(signer);
        const domainName = generateUniqueDomain(wallet);

        // Check if the domain already exists
        const domainExists = await domainContract.checkDomainExists(domainName);
        if (domainExists) {
            console.log(`Domain ${domainName} already exists. Skipping...`);
            continue;
        }

        // Mint the domain for the wallet
        try {
            // Estimate gas limit for the transaction
            const gasLimit = await walletDomainContract.estimateGas.mintDomain(wallet.address, domainName);
        
            // Fetch the current gas price from the network
            const gasPrice = await provider.getGasPrice();
        console.log(gasLimit,gasPrice);
        
            // Proceed with the mintDomain transaction using the estimated gas values
            const tx = await walletDomainContract.mintDomain(wallet.address, domainName, {
                gasLimit: gasLimit, // Use the estimated gas limit
                gasPrice: gasPrice  // Use the current gas price from the provider
            });
        
            // Wait for the transaction to be confirmed
            await tx.wait();
            console.log(`Minted domain ${domainName} for wallet ${wallet.address}`);
        } catch (error) {
            console.error(`Error minting domain for ${wallet.address}:`, error);
        }
        
    }
}

// Generate unique domain names using wallet address or timestamp
function generateUniqueDomain(wallet) {
    const timestamp = Date.now();
    const domainName = `wallet-${wallet.address.substring(2, 6)}-${timestamp}.fam`;
    return domainName;
}

// Get ETH to USD price (replace with an API or Oracle data source)
async function getEthPrice() {
    // Simulated ETH price in USD for this demo
    return 1800000000; // Replace this with live price via an API or Oracle
}

// Main function to orchestrate the tasks
async function main() {
    try {
        console.log("Master wallet address:", masterWallet.address);

        // Generate X number of wallets
        const walletCount = 5; // Define how many wallets to generate (example: 5)
        const wallets = await generateNewWallets(walletCount);

        // Transfer $5 worth of ETH to each new wallet
        await transferETHToWallets(wallets);

        // Mint unique .fam domains for each wallet
        await mintDomainForWallets(wallets);

    } catch (error) {
        console.error("Error in main execution:", error);
    }
}

main();
