![Theme image for repository](resources/banner.png)
# OZGovernor

## About

OZGovernor is a comprehensive governance contract developed as an extension of OpenZeppelin by [Tally](https://tally.xyz) developers. This contract incorporates additional functionalities for voting, timelock control, and quorum implementation, providing an efficient governance solution for decentralized autonomous organizations (DAOs).

## 📗 Overview

This repository contains tasks and scripts for effortless deployment and testing of a OZ Governance and it's DAO smart contracts on Ethereum networks. It also offers a deeper insight into OZGovernor, including its functionalities and a placeholder for deployment instructions. Adjustments or additions can be made based on the specific deployment details once available.

**Features:**

✅ Simple deployment script for the OZ Governor and other contracts

✅ Tasks that are helpers to interact with OZ Governor

✅ Testing complete lifecycle of proposals

###  Contract Overview

The OZGovernor contract integrates various extensions from OpenZeppelin for robust governance features. It facilitates:

- **OZGovernor:** This contract represents the main governance contract that handles voting and execution of proposals using the OpenZeppelin governance framework.
- **GovernorToken:** This contract represents the token used for voting in the governance system. It provides functionality for token holders to cast their votes on proposals.
- **TimelockController:** This contract implements a timelock mechanism for delaying the execution of certain operations. It ensures that proposals go through a waiting period before they can be executed, allowing for a grace period for token holders to review and challenge the proposals.

To know more about contracts check up our [docs](https://docs.tally.xyz)

Want to deploy your DAO with Tally, we also have [premium features](https://docs.tally.xyz/premium-features).

## 🧐 Using it with Tally

0. Fill `.env` file and install the repo as explained in [instalation](#installation)
1. Remember to fill use the configs for your DAO, you can find it in `deploy.config.ts`
2. Deploy the contracts using the [deploy method](#deploying).
5. Validate your contract as explained [here](#validating-contract).
6. You will also have to mint and share tokens to members of your DAO
7. Remember to remove yourself as minter from the token when finished with task 6
7. Add your DAO to Tally!, [do it here](https://www.tally.xyz/add-a-dao)

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

It also adds the whole contracts added and their verify lines to a file called `contracts.out`, for future reference so you can close your terminal with no worries.

#### Pre-Requisites

- Node.js and PNPM
- Git

#### Deploying

The configuration parameters to deploy the contracts can be found at `deploy.config` in the root of this folder.

```bash
# you have to define the network according to network name listed in hardhat.config.ts
pnpm deployc --network sepolia
# to test in hardhat just run
pnpm deployc
```

#### Validating Contract
After running the script to deploy the contract, it will print the command lines needed to validate each contract in your terminal. 

But to run those contracts you must have provided your Etherscan ( or other scan ) to the API KEY in the `.env` file, you can use it to validate the contracts.

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