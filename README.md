![Theme image for repository](resources/banner.png)
# OZGovernor

## About

OZGovernor is a comprehensive governance contract developed as an extension of OpenZeppelin by Tally developers. This contract adds functionalities for voting, timelock control, and quorum implementation, providing an efficient governance solution for decentralized autonomous organizations (DAOs).

## 📗 Overview

This repository contains tasks and scripts for the effortless deployment and testing of OZ Governance and its DAO smart contracts on Ethereum networks. It also offers a deeper insight into OZGovernor, including its functionalities and a placeholder for deployment instructions. Adjustments or additions can be made based on the specific deployment details once available.

**Features:**

✅ Simple deployment script for the OZ Governor and other contracts

✅ Tasks that are helpers to interact with OZ Governor

✅ Testing the complete lifecycle of proposals

### Contract Overview

The OZGovernor contract integrates various extensions from OpenZeppelin for robust governance features. It facilitates:

- **OZGovernor:** This contract represents the main governance contract that handles voting and execution of proposals using the OpenZeppelin governance framework.
- **GovernorToken:** This contract represents the token used for voting in the governance system. It provides functionality for token holders to cast their votes on proposals.
- **TimelockController:** This contract implements a timelock mechanism for delaying the execution of certain operations. It ensures that proposals go through a waiting period before they can be executed, allowing for a grace period for token holders to review and challenge the proposals.

To learn more about the contracts, check our [docs](https://docs.tally.xyz).

Want to deploy your DAO with Tally? We also have [premium features](https://docs.tally.xyz/premium-features).

## 🧐 Using it with Tally

0. Fill the `.env` file and install the repo as explained in [installation](#installation).
1. Remember to use the configs for your DAO, which can be found in `deploy.config.ts`.
2. Deploy the contracts using the [deploy method](#deploying).
5. Validate your contract as explained [here](#validating-contract).
6. You will also have to mint and share tokens with members of your DAO.
7. Remember to remove yourself as a minter from the token when finished with task 6.
7. Add your DAO to Tally! [Do it here](https://www.tally.xyz/add-a-dao).

## 💻 Getting Started

#### Installation

```bash
git clone https://github.com/withtally/gov_deployer.git && cd gov_deployer && git checkout new
pnpm install
cp .env.example .env
# Fill in the necessary values in the .env file (e.g., node RPCs)
# You can also set all the values 
# npx hardhat vars set INFURA_API_KEY
```

Some other commands

```bash
pnpm clean
pnpm test
npx hardhat compile
```

It also adds all the contracts and their verify lines to a file called `contracts.out`, for future reference, so you can close your terminal with no worries.

#### Pre-Requisites

- Node.js and PNPM
- Git

#### Deploying

The configuration parameters to deploy the contracts can be found in `deploy.config` in the root of this folder.

```bash
# You have to define the network according to the network name listed in hardhat.config.ts
pnpm deployc --network sepolia
# To test in hardhat, just run
pnpm deployc
```

#### Validating Contract

After running the script to deploy the contract, it will print the command lines needed to validate each contract in your terminal.

But to run those commands, you must have provided your Etherscan (or other scan) API KEY in the `.env` file. You can use it to validate the contracts.

Example output:

```bash
quorum numerator: 30 
vote extension: 7200 

deploying "OZGovernor" (tx: 0xc364cf1527fd3fb9d04cc2b53ec1099bd9f77dc745d6932060a06b4fdb2f98f9)...: deployed at 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 with 4800366 gas

OZ Governor contract:  0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9

npx hardhat verify --network hardhat 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 "EXAMPLE GROUP" 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 7200 50400 0 30 7200
```

----------

### Testing

To run the tests:

```bash
pnpm test
```

----------

## 🚨 Disclaimer

Tally is not responsible for funds or contracts deployed with this tool. It is intended for internal testing & reference purposes only.

## 🤝 Contributions

Contributions are welcome! Refer to the [contributing guidelines](CONTRIBUTING.md) to get started.
