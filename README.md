
![Theme image for repository](resources/banner.png)
# OZGovernor

## About

OZGovernor is a comprehensive governance contract developed as an extension of OpenZeppelin by Tally developers. This contract adds advanced functionalities for voting, timelock control, and quorum implementation, providing a sophisticated governance solution for decentralized autonomous organizations (DAOs).

## 📗 Overview

This repository contains tasks and scripts for the effortless deployment and testing of OZ Governance and its DAO smart contracts on Ethereum networks. Dive deeper into OZGovernor's functionalities with our extensive technical documentation, including its unique features and deployment instructions.

### Key Features:

- **Enhanced Voting Mechanics:** Detailed explanation of the voting process, including token-based voting and proposal lifecycle.
- **Timelock Management:** Insights into the timelock mechanism and how it adds a layer of security and transparency.
- **Quorum Requirements:** Description of quorum functionalities, ensuring democratic and fair governance.

### Contract Overview

OZGovernor integrates various extensions from OpenZeppelin for robust governance features, including:

- **OZGovernor:** Main governance contract for proposal management.
- **ERC20Token:** Token used for voting, empowering token holders with governance rights.
- **TimelockController:** Implements a delay mechanism for operational security.

For comprehensive contract details, visit our [documentation](https://docs.tally.xyz).

Interested in premium DAO solutions? Check out [Tally's premium features](https://docs.tally.xyz/premium-features).

## 🧐 Using it with Tally

### Steps for Deployment and Integration:

0. Set up the environment using the instructions in [installation](#installation).
1. Customize `deploy.config.ts` for your DAO.
2. Deploy contracts as detailed in [deploy method](#deploying).
3. Validate your contract as per [validation guidelines](#validating-contract).
4. Mint and distribute tokens to DAO members.
5. Remove minting permissions post-distribution.
6. Add your DAO to Tally using [this link](https://www.tally.xyz/add-a-dao).

## 💻 Getting Started

### Installation

```bash
git clone https://github.com/withtally/gov-deployer.git
cd gov_deployer
git checkout new
pnpm install
cp .env.example .env
# Configure .env as needed (e.g., node RPCs)
# You can also set all the values 
# npx hardhat vars set INFURA_API_KEY
```

### Additional Commands

```bash
pnpm clean
pnpm test
npx hardhat compile
```

### Pre-Requisites

- Node.js and PNPM
- Git

### Deploying

Configure deployment parameters in `deploy.config.ts`. 

```bash
# Define network from the names in hardhat.config.ts
pnpm deployc --network sepolia
# For local testing as a dry run, do not specify the network
pnpm deployc
```

### Validating Contract

Post-deployment, use the output commands for contract validation. Ensure Etherscan API KEY is in `.env`.

Example output:

```bash
quorum numerator: 30 
vote extension: 7200 

deploying "OZGovernor" (tx: 0xc364cf1527fd3fb9d04cc2b53ec1099bd9f77dc745d6932060a06b4fdb2f98f9)...: deployed at 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 with 4800366 gas

OZ Governor contract:  0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9

npx hardhat verify --network hardhat 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 "EXAMPLE GROUP" 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 7200 50400 0 30 7200
```

----------


## Testing

Run the tests using:

```bash
pnpm test
```

## 🚨 Disclaimer

Use of OZGovernor is at your own risk. Tally is not liable for any damages or losses. Intended for testing and reference only.

## 🤝 Contributions

We welcome contributions! Refer to our [contributing guidelines](CONTRIBUTING.md) for details.

## 📚 Changelog

Stay updated with changes and improvements in our [changelog](CHANGELOG.md).

## 📖 FAQs

Find answers to common questions in our [FAQ section](FAQ.md).

## 🖼️ Diagrams and Visuals

Explore governance workflows through diagrams in our [visual guide](VISUAL_GUIDE.md).

## ⚖️ License

The whole repo and it's contracts are released under MIT license. 

For details, see [LICENSE](LICENSE.txt).
