import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { config } from "../deploy.config"
import { getExpectedContractAddress } from '../helpers/expected_contract';
import fs from "fs";
import { ERC20Token, ERC20Token__factory } from "../types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	console.log("\x1B[37mDeploying Open Zepellin Governance contracts");

	// DEPLOY
	const { deploy } = hre.deployments;

	// const signer = await hre.ethers.getSigner()
	const [deployerSigner] = await hre.ethers.getSigners();
	const deployer = await deployerSigner.getAddress();

	// HARDHAT LOG
	console.log(
		`network:\x1B[36m${hre.network.name}\x1B[37m`,
		`\nsigner:\x1B[33m${deployer}\x1B[37m\n`
	);

	// Load values for constructor from a ts file deploy.config.ts
	const governance_address = await getExpectedContractAddress(deployerSigner, 2);
	const timelock_address = await getExpectedContractAddress(deployerSigner, 1);
	const token_address = await getExpectedContractAddress(deployerSigner, 0);

	const admin_address = governance_address;

	const minter = deployer
	console.log("Future contract addresses")
	console.log("Token contract addresses:\x1B[33m", token_address, "\x1B[37m")
	console.log("Governance contract address:\x1B[33m", governance_address, "\x1B[37m")
	console.log("Timelock contract address:\x1B[33m", timelock_address, "\x1B[37m\n")

	console.log("ClockMode will use ", config.governor.clockMode ? "timestamp" : "block number", " as time unit\n")

	//// deploy token
	await (async function deployToken() {

		// TOKEN CONTRACT
		// INFO LOGS
		console.log("TOKEN ARGS");
		console.log("token name:\x1B[36m", config.token.name, "\x1B[37m");
		console.log("token symbol:\x1B[36m", config.token.symbol, "\x1B[37m");
		console.log("default admin:\x1B[33m", admin_address, "\x1B[37m");
		console.log("pauser:\x1B[33m", admin_address, "\x1B[37m");
		console.log("minter:\x1B[33m", minter, "\x1B[37m\n");


		let token: DeployResult;
		const args = [
			config.token.name,
			config.token.symbol,
			// Admin adress is pointing to the governance contract
			minter,
			minter,
			// if minter is not deployer or an EOA no one will be able to mint, 
			// after all you can only propose and vote while having tokens, 
			// so no one would be able to execute or propose anything in this governance.
			minter,
		]
		/*  
			string memory _name,
			string memory _symbol,
			address defaultAdmin,
			address pauser,
			address minter
		*/
		token = await deploy("ERC20Token", {
			from: deployer,
			contract: config.clockMode ? "contracts/clock/ERC20Token.sol:ERC20Token" : "contracts/ERC20Token.sol:ERC20Token",
			args: args,
			log: true,
		});

		// const tdBlock = token.
		const tdBlock = await hre.ethers.provider.getBlock("latest");

		console.log(`\nToken contract: `, token.address);
		// verify cli
		let verify_str =
			`npx hardhat verify ` +
			`--network ${hre.network.name} ` +
			`${token_address} "${config.token.name}" "${config.token.symbol}" ${admin_address} ${admin_address} ${minter}`
		console.log("\n" + verify_str + "\n");

		// save it to a file to make sure the user doesn't lose it.
		fs.appendFileSync(
			"contracts.out",
			`${new Date()}\nToken contract deployed at: ${await token.address}` +
			` - ${hre.network.name} - block number: ${tdBlock?.number}\n${verify_str}\n\n`
		);
	})();
	
	//// deploy timelock
	await (async function deployTimelock() {

		// governor and timelock as proposers and executors to guarantee that the DAO will be able to propose and execute
		const executors = [admin_address, timelock_address];
		const proposers = [admin_address, timelock_address];
		// TIMELOCK CONTRACT
		// INFO LOGS
		console.log("TIMELOCK ARGS");
		console.log("timelock min delay:\x1B[36m", config.timelock.minDelay, "\x1B[37m");
		console.log("executors:\x1B[33m", JSON.stringify(executors), "\x1B[37m");
		console.log("proposers:\x1B[33m", JSON.stringify(proposers), "\x1B[37m");
		console.log("admin:\x1B[33m", timelock_address, "\x1B[37m\n");

		/*  
			uint256 minDelay,
			address[] memory proposers,
			address[] memory executors,
			address admin
		*/
		const timelock = await deploy("TimelockController", {
			from: deployer,
			contract: "contracts/TimelockController.sol:TimelockController",
			args: [
				config.timelock.minDelay,
				// Admin adress is pointing to the governance contract
				proposers,
				executors,
				timelock_address,
			],
			log: true,
		});

		const timelockBlock = await hre.ethers.provider.getBlock("latest");

		console.log(`\nTimelock contract: `, timelock.address);

		fs.appendFileSync(
			`arguments_${timelock.address}.js`,
			`module.exports = [` +
			`${config.timelock.minDelay},` +
			`${JSON.stringify(proposers)},` +
			`${JSON.stringify(executors)},` +
			`];`
		);

		// verify cli command
		const verify_str_timelock = `npx hardhat verify ` +
			`--network ${hre.network.name} ` +
			`--constructor-args arguments_${timelock.address}.js ` +
			`${timelock.address}\n`;
		console.log("\n" + verify_str_timelock);

		// save it to a file to make sure the user doesn't lose it.
		fs.appendFileSync(
			"contracts.out",
			`${new Date()}\nTimelock contract deployed at: ${await timelock.address
			}` +
			` - ${hre.network.name} - block number: ${timelockBlock?.number}\n${verify_str_timelock}\n\n`
		);
	})();

	//// deploy governor
	await (async function deployGovernor() {

		// GOVERNOR CONTRACT
		// INFO LOGS
		console.log("GOVERNOR ARGS");
		console.log("name:\x1B[36m", config.governor.name, "\x1B[37m");
		console.log("Token contract addresses:\x1B[33m", token_address, "\x1B[37m")
		console.log("Timelock contract address:\x1B[33m", timelock_address, "\x1B[37m")
		console.log("voting delay:\x1B[36m", config.governor.votingDelay, "\x1B[37m");
		console.log("voting period:\x1B[36m", config.governor.votingPeriod, "\x1B[37m");
		console.log("proposal threshold period:\x1B[36m", config.governor.proposalThreshold, "\x1B[37m");
		console.log("quorum numerator:\x1B[36m", config.governor.quorumNumerator, "\x1B[37m");
		console.log("vote extension:\x1B[36m", config.governor.voteExtension, "\x1B[37m\n");

		/*  
			string memory _name,
			IVotes _token,
			TimelockController _timelock,
			uint48 _initialVotingDelay,
			uint32 _initialVotingPeriod,
			uint256 _initialProposalThreshold,
			uint256 _quorumNumeratorValue,
		*/
		let governor: DeployResult;
		const args = [
			config.governor.name,
			token_address,
			timelock_address,
			config.governor.votingDelay,
			config.governor.votingPeriod,
			config.governor.proposalThreshold,
			config.governor.quorumNumerator,
			config.governor.voteExtension
		]
		governor = await deploy("OZGovernor", {
			from: deployer,
			contract: config.clockMode ? "contracts/clock/OZGovernor.sol:OZGovernor" : "contracts/OZGovernor.sol:OZGovernor",
			args: args,
			log: true,
		});


		const govBlock = await hre.ethers.provider.getBlock("latest");

		console.log(`\nVETOER Governor contract: `, governor.address);
		// verify cli
		let verify_str =
			`npx hardhat verify ` +
			`--network ${hre.network.name} ` +
			`${await governor.address} "${config.governor.name}" ${token_address} ${timelock_address} ${config.governor.votingDelay} ${config.governor.votingPeriod} ${config.governor.proposalThreshold} ${config.governor.quorumNumerator} ${config.governor.voteExtension}`
		console.log("\n" + verify_str + "\n");


		// save it to a file to make sure the user doesn't lose it.
		fs.appendFileSync(
			"contracts.out",
			`${new Date()}\nToken contract deployed at: ${governor.address}` +
			` - ${hre.network.name} - block number: ${govBlock?.number}\n${verify_str}\n\n`
		);
	})();

	// MINTING the first amount and managing roles to remove it to deployer granting it only to the timelock.
	await(async function mintAndRolesManagement(){

		// check if config.firstMint.to is valid address
		if ( config.firstMint.amount <= 0 ) {
			console.log("No first mint amount set, skipping minting and roles management");
			return;
		}

		if ( !hre.ethers.isAddress(config.firstMint.to) && config.firstMint.to != "") {
			console.log("First mint address is not valid, skipping minting and roles management");
			return;
		}

		// Connect to the token contract
		const Token = (await hre.ethers.getContractFactory("ERC20Token")) as ERC20Token__factory;
		const tokenContract = (await Token.attach(token_address)) as ERC20Token;

		const _to = config.firstMint.to ? config.firstMint.to : deployer;
		const _amount = config.firstMint.amount;

		// Mint tokens to the receiving address
		await tokenContract.mint(_to, _amount)
		console.log(`Minted ${_amount} tokens to ${_to}`);

		// Grant the minter role to the receiving address
		await tokenContract.grantRole(await tokenContract.MINTER_ROLE(), timelock_address);
		console.log(`Minter role granted to ${minter}`);

		// Grant the admin role to the receiving address
		await tokenContract.grantRole(await tokenContract.DEFAULT_ADMIN_ROLE(), timelock_address);
		console.log(`Default admin role granted to ${admin_address}`);

		// Revoke the minter role from the caller
		await tokenContract.revokeRole(await tokenContract.MINTER_ROLE(), deployer);
		console.log(`Minter role revoked from ${admin_address}`);

		// Revoke the minter role from the caller
		await tokenContract.revokeRole(await tokenContract.DEFAULT_ADMIN_ROLE(), deployer);
		console.log(`Minter role revoked from ${admin_address}`);
	})();

	// ending line
	fs.appendFileSync(
		"contracts.out",
		"\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\" +
		"\n\n"
	);
};

func.id = "deploy_governor"; // id required to prevent reexecution
func.tags = ["ERC20","GOVERNOR","TIMELOCK"];

export default func;
