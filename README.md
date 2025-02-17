
# **Arbitrum Wallet Initialization, Fund Transfer, and Domain Minting Script**

This project demonstrates how to:
- Initialize a master wallet on the Arbitrum blockchain.
- Generate multiple wallets.
- Transfer ETH from the master wallet to each generated wallet.
- Mint unique `.fam` domains for each wallet on Arbitrum.

## **Table of Contents**
- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Code Explanation](#code-explanation)
- [Test Cases](#test-cases)
- [Smart Contract](#smart-contract)
- [Troubleshooting](#troubleshooting)

---

## **Overview**

This script automates the process of managing multiple Ethereum wallets and interacting with the Arbitrum blockchain. It allows for generating new wallets, transferring ETH, and minting unique domains. It also incorporates gas estimation and error handling to ensure smooth execution.

---

## **Features**
- Master wallet initialization using a provided private key.
- Generates multiple Ethereum wallets.
- Automatically transfers $5 worth of ETH to each generated wallet.
- Mints a unique `.fam` domain for each wallet.
- Automatically estimates gas limit and gas price for transactions.
- Handles edge cases such as domain existence and insufficient funds.

---

## **Requirements**

To run this project, you will need:
- **Node.js** (v14 or higher)
- **npm** or **yarn** (for package management)
- Arbitrum RPC URL
- A master wallet private key with enough ETH to perform transfers
- ENS-like service or a custom smart contract deployed to handle `.fam` domain registration on Arbitrum

---

## **Setup**

### **1. Clone the Repository**

```bash
git clone https://github.com/shashank9694/arbitrum-domain-minting.git
cd arbitrum-domain-minting
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Configure Environment Variables**

Create a `.env` file at the root of your project directory and add the following:

```bash
ARBITRUM_RPC_URL=<Your_Arbitrum_RPC_URL>
MASTER_WALLET_PRIVATE_KEY=<Your_Master_Wallet_Private_Key>
DOMAIN_CONTRACT_ADDRESS=<Your_Contract_Address>
```

Replace `<Your_Arbitrum_RPC_URL>` with the URL for the Arbitrum network, `<Your_Master_Wallet_Private_Key>` with the private key for your master wallet, and `<Your_Contract_Address>` with the deployed contract address for minting `.fam` domains.

---

## **Usage**

### **1. Run the Script**

To run the script for wallet generation, fund transfer, and domain minting:

```bash
node index.js
```

By default, this will generate 5 wallets, transfer $5 worth of ETH to each, and mint a `.fam` domain for each wallet.

### **2. Change the Number of Wallets**

You can modify the number of wallets to be generated by changing the `numWallets` variable in the script:

```javascript
const numWallets = 10; // Change this to the desired number of wallets
```

---

## **Code Explanation**

### **1. Master Wallet Initialization**

The master wallet is initialized using the private key provided in the `.env` file. It connects to the Arbitrum blockchain using an RPC URL.

```javascript
const provider = new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL);
const masterWallet = new ethers.Wallet(process.env.MASTER_WALLET_PRIVATE_KEY, provider);
```

### **2. Wallet Generation**

New wallets are generated using the `ethers.Wallet.createRandom()` method. These wallets are stored securely, and their addresses are printed for reference.

```javascript
const newWallet = ethers.Wallet.createRandom();
```

### **3. Fund Transfer**

$5 worth of ETH is transferred from the master wallet to each newly generated wallet. Gas limits and prices are automatically estimated.

```javascript
const gasLimit = await provider.estimateGas(tx);
const gasPrice = await provider.getGasPrice();
```

### **4. Domain Minting**

A smart contract is used to mint `.fam` domains for each wallet. The script checks whether the domain is unique before minting.

```javascript
const gasLimit = await domainContract.estimateGas.mintDomain(wallet.address, domainName);
const gasPrice = await provider.getGasPrice();
```

---

## **Test Cases**

### **1. Wallet Generation**
- **Goal**: Ensure the script generates a specified number of unique wallets.
- **Expected Outcome**: Each generated wallet should have a unique address and private key.

### **2. Fund Transfer**
- **Goal**: Transfer $5 worth of ETH to each newly generated wallet.
- **Expected Outcome**: Each wallet receives the specified amount of ETH.

### **3. Domain Minting**
- **Goal**: Mint a unique `.fam` domain for each wallet.
- **Expected Outcome**: Each wallet mints a unique domain, and no duplicate domains exist.

### **4. Error Handling**
- **Goal**: Test the script's ability to handle errors (e.g., insufficient funds, domain already exists).
- **Expected Outcome**: The script should skip domain minting for existing domains and handle failed transactions gracefully.

---

## **Smart Contract**

### **Assumptions**
The project assumes the existence of a smart contract capable of minting `.fam` domains on the Arbitrum network. You can use an ENS-like service or deploy a custom contract for managing domain names.

### **Sample Solidity Smart Contract**

If needed, you can deploy a custom Solidity contract to handle `.fam` domain registrations.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DomainRegistry {
    mapping(string => address) public domains;

    function mintDomain(string memory _domainName) public {
        require(domains[_domainName] == address(0), "Domain already exists.");
        domains[_domainName] = msg.sender;
    }

    function checkDomainExists(string memory _domainName) public view returns (bool) {
        return domains[_domainName] != address(0);
    }
}
```

---

## **Troubleshooting**

### **Common Issues**

- **Insufficient Funds**: Ensure the master wallet has enough ETH to cover both the fund transfers and gas fees.
- **Domain Already Exists**: The script skips the minting process if a domain already exists for a wallet.
- **Gas Estimation Errors**: The script automatically estimates gas prices and limits, but if errors occur, you can manually adjust these values.

### **Error: UNPREDICTABLE_GAS_LIMIT**
If you encounter an `UNPREDICTABLE_GAS_LIMIT` error, ensure that the domain does not already exist and that the wallet has sufficient funds to cover the transaction.

### **Arbitrum RPC Issues**
If the script fails to connect to the Arbitrum blockchain, check that your RPC URL is correct and that you have a stable internet connection.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## **Contact**
For any questions or issues, please feel free to reach out at shashanksingh9694@gmail.com.

---

Feel free to modify the sections as necessary, based on your specific project requirements.
