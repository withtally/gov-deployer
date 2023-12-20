
import { ethers } from "hardhat";
import { expect } from "chai";
import {
    EventLog,
} from "ethers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";


export async function shouldBehaveLikeGovernor(): Promise<void> {

    it("should receive answer from CLOCK_MODE", async function () {
        const { governor, _, } = this;

        const clock_mode = await governor.CLOCK_MODE();

        expect(clock_mode).to.be.equal("mode=blocknumber&from=default");
    });

    it("clock should return the current block number", async function () {
        const { governor, _, } = this;

        const clock = await governor.clock();
        const pBlock = await ethers.provider.getBlock("latest");

        expect(clock).to.be.equal(pBlock?.number);
    });

    it("should mint 10000 tokens", async function () {
        const { token, signers,t } = this;

        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balance = await token.balanceOf(signers.admin.address);
        expect(balance).to.be.equal(amountToMint);
    });

    it("should work the full proposal lifecycle up to executed", async function () {
        const { token, governor, signers, timelock } = this;

        // initial mint
        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balanceOne = await token.balanceOf(signers.admin.address);
        expect(balanceOne).to.be.equal(amountToMint);

        // delegate
        await token.delegate(signers.admin.address);

        await expect( token.grantRole(await token.MINTER_ROLE(), await timelock.getAddress())).to.emit(token, "RoleGranted");
        // expect(await token.grantRole(await token.MINTER_ROLE(), await governor.getAddress())).to.emit(token, "RoleGranted");

        const calldata = token.interface.encodeFunctionData("mint", [signers.admin.address, 1000n]);

        // Propose
        const proposalTx = await governor.propose(
            [await token.getAddress()], // targets 
            [0n], // value
            [calldata],
            "Proposal to mint 1000 tokens for admin"// description
        );

        expect(proposalTx).to.emit(governor, "ProposalCreated");

        // Wait for the transaction to be mined
        const receipt = await proposalTx.wait(1);

        // console.log("proposalId",receipt?.logs);

        const eventLogs: EventLog[] = (receipt?.logs ?? []).filter((log): log is EventLog => true);

        // Find the ProposalCreated event in the transaction receipt
        const event = eventLogs.find((log) => log.fragment.name === "ProposalCreated");

        const logDescription = governor.interface.parseLog({
            topics: event?.topics ? [...event.topics] : [],
            data: event?.data ?? "",
        });

        // Get the proposalId from the event arguments
        const proposalId = logDescription?.args["proposalId"]

        // try to cast before voting delay and fails
        await expect( governor.castVote(proposalId, 1)).to.be.reverted;

        const numberOfBlocks = Number(await governor.votingDelay()) + 100;
        await mine(numberOfBlocks);

        // Vote
        await expect( governor.castVote(proposalId, 1n)).to.emit(governor, "VoteCast");

        //try to queue before is executable and fails

        // Queue proposal
       await  expect( governor.queue(proposalId)).to.be.reverted;

        // Wait for voting period to end
        // await ethers.provider.send("evm_increaseTime", [86400]); // Increase time by 1 day
        // await ethers.provider.send("evm_mine"); // Mine a new block
        await mine(Number(await governor.votingPeriod()) + 100);

        // expect proposal state to be succeeded
        let proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(4);

        // Queue proposal
        await expect( governor.queue(proposalId)).to.emit(governor, "ProposalQueued");

        // expect proposal state to be queued
        proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(5);

        // Execute proposal
        await expect( governor.execute(proposalId)).to.be.reverted;

        // Simulate time delay required before execution
        // Replace 'executionDelay' with your contract's specific delay
        await mine( 86400 +1);

        // Execute proposal
        await expect( governor.execute(proposalId)).to.emit(governor, "ProposalExecuted");

        // expect proposal state to be executed
        proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(7);

        // Check if admin's balance has increased
        const balance = await token.balanceOf(signers.admin.address);
        expect(balance).to.be.equal(11000n);
    });

    it("should cancel the proposal before vote start", async function () {
        const { token, governor, signers, timelock } = this;

        // initial mint
        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balanceOne = await token.balanceOf(signers.admin.address);
        expect(balanceOne).to.be.equal(amountToMint);

        // delegate
        await token.delegate(signers.admin.address);

        await expect( token.grantRole(await token.MINTER_ROLE(), await timelock.getAddress())).to.emit(token, "RoleGranted");
        // expect(await token.grantRole(await token.MINTER_ROLE(), await governor.getAddress())).to.emit(token, "RoleGranted");

        const calldata = token.interface.encodeFunctionData("mint", [signers.admin.address, 1000n]);

        // Propose
        const proposalTx = await governor.propose(
            [await token.getAddress()], // targets 
            [0n], // value
            [calldata],
            "Proposal to mint 1000 tokens for admin"// description
        );

        expect(proposalTx).to.emit(governor, "ProposalCreated");

        // Wait for the transaction to be mined
        const receipt = await proposalTx.wait(1);

        // console.log("proposalId",receipt?.logs);

        const eventLogs: EventLog[] = (receipt?.logs ?? []).filter((log): log is EventLog => true);

        // Find the ProposalCreated event in the transaction receipt
        const event = eventLogs.find((log) => log.fragment.name === "ProposalCreated");

        const logDescription = governor.interface.parseLog({
            topics: event?.topics ? [...event.topics] : [],
            data: event?.data ?? "",
        });

        // Get the proposalId from the event arguments
        const proposalId = logDescription?.args["proposalId"]

        // try to cancel it
        await expect( governor.cancel(proposalId)).to.emit(governor, "ProposalCanceled");

        const proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(2);
    });

    it("should not cancel the proposal after vote starts", async function () {
        const { token, governor, signers, timelock } = this;

        // initial mint
        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balanceOne = await token.balanceOf(signers.admin.address);
        expect(balanceOne).to.be.equal(amountToMint);

        // delegate
        await token.delegate(signers.admin.address);

        await expect( token.grantRole(await token.MINTER_ROLE(), await timelock.getAddress())).to.emit(token, "RoleGranted");
        // expect(await token.grantRole(await token.MINTER_ROLE(), await governor.getAddress())).to.emit(token, "RoleGranted");

        const calldata = token.interface.encodeFunctionData("mint", [signers.admin.address, 1000n]);

        // Propose
        const proposalTx = await governor.propose(
            [await token.getAddress()], // targets 
            [0n], // value
            [calldata],
            "Proposal to mint 1000 tokens for admin"// description
        );

        expect(proposalTx).to.emit(governor, "ProposalCreated");

        // Wait for the transaction to be mined
        const receipt = await proposalTx.wait(1);

        // console.log("proposalId",receipt?.logs);

        const eventLogs: EventLog[] = (receipt?.logs ?? []).filter((log): log is EventLog => true);

        // Find the ProposalCreated event in the transaction receipt
        const event = eventLogs.find((log) => log.fragment.name === "ProposalCreated");

        const logDescription = governor.interface.parseLog({
            topics: event?.topics ? [...event.topics] : [],
            data: event?.data ?? "",
        });

        // Get the proposalId from the event arguments
        const proposalId = logDescription?.args["proposalId"]

        const numberOfBlocks = Number(await governor.votingDelay()) + 100;
        await mine(numberOfBlocks);

        // try to cancel it
        await expect( governor.cancel(proposalId)).to.be.reverted;

        const proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(1);
    });

    it("should be able to see proposal defeated", async function () {
        const { token, governor, signers, timelock } = this;

        // initial mint
        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balanceOne = await token.balanceOf(signers.admin.address);
        expect(balanceOne).to.be.equal(amountToMint);

        // delegate
        await token.delegate(signers.admin.address);

        await expect( token.grantRole(await token.MINTER_ROLE(), await timelock.getAddress())).to.emit(token, "RoleGranted");
        // expect(await token.grantRole(await token.MINTER_ROLE(), await governor.getAddress())).to.emit(token, "RoleGranted");

        const calldata = token.interface.encodeFunctionData("mint", [signers.admin.address, 1000n]);

        // Propose
        const proposalTx = await governor.propose(
            [await token.getAddress()], // targets 
            [0n], // value
            [calldata],
            "Proposal to mint 1000 tokens for admin"// description
        );

        expect(proposalTx).to.emit(governor, "ProposalCreated");

        // Wait for the transaction to be mined
        const receipt = await proposalTx.wait(1);

        // console.log("proposalId",receipt?.logs);

        const eventLogs: EventLog[] = (receipt?.logs ?? []).filter((log): log is EventLog => true);

        // Find the ProposalCreated event in the transaction receipt
        const event = eventLogs.find((log) => log.fragment.name === "ProposalCreated");

        const logDescription = governor.interface.parseLog({
            topics: event?.topics ? [...event.topics] : [],
            data: event?.data ?? "",
        });

        // Get the proposalId from the event arguments
        const proposalId = logDescription?.args["proposalId"]


        const numberOfBlocks = Number(await governor.votingDelay()) + 100;
        await mine(numberOfBlocks);

        // Vote
        await expect( governor.castVote(proposalId,0)).to.emit(governor, "VoteCast");

        // Wait for voting period to end
        // await ethers.provider.send("evm_increaseTime", [86400]); // Increase time by 1 day
        // await ethers.provider.send("evm_mine"); // Mine a new block
        await mine(Number(await governor.votingPeriod()) + 100);

        // expect state to be deafeated
        const proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(3);
    });

}

export async function shouldBehaveLikeGovernorWithTimestamp(): Promise<void> {
    it("should receive answer from CLOCK_MODE", async function () {
        const { governor, _, } = this;

        const clock_mode = await governor.CLOCK_MODE();

        expect(clock_mode).to.be.equal("mode=timestamp");
    });

    it("clock should return the current block number", async function () {
        const { governor, _, } = this;

        const clock = await governor.clock();
        // const pTime = await ethers.provider.getBlock("latest");
        const pBlock = await ethers.provider.getBlock("latest"); 

        expect(clock).to.be.equal(pBlock?.timestamp);
    });

    it("should mint 10000 tokens", async function () {
        const { token, signers,t } = this;

        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balance = await token.balanceOf(signers.admin.address);
        expect(balance).to.be.equal(amountToMint);
    });

    it("should work the full proposal lifecycle up to executed", async function () {
        const { token, governor, signers, timelock } = this;

        // initial mint
        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balanceOne = await token.balanceOf(signers.admin.address);
        expect(balanceOne).to.be.equal(amountToMint);

        // delegate
        await token.delegate(signers.admin.address);

        await expect( token.grantRole(await token.MINTER_ROLE(), await timelock.getAddress())).to.emit(token, "RoleGranted");
        // expect(await token.grantRole(await token.MINTER_ROLE(), await governor.getAddress())).to.emit(token, "RoleGranted");

        const calldata = token.interface.encodeFunctionData("mint", [signers.admin.address, 1000n]);

        // Propose
        const proposalTx = await governor.propose(
            [await token.getAddress()], // targets 
            [0n], // value
            [calldata],
            "Proposal to mint 1000 tokens for admin"// description
        );

        expect(proposalTx).to.emit(governor, "ProposalCreated");

        // Wait for the transaction to be mined
        const receipt = await proposalTx.wait(1);

        // console.log("proposalId",receipt?.logs);

        const eventLogs: EventLog[] = (receipt?.logs ?? []).filter((log): log is EventLog => true);

        // Find the ProposalCreated event in the transaction receipt
        const event = eventLogs.find((log) => log.fragment.name === "ProposalCreated");

        const logDescription = governor.interface.parseLog({
            topics: event?.topics ? [...event.topics] : [],
            data: event?.data ?? "",
        });

        // Get the proposalId from the event arguments
        const proposalId = logDescription?.args["proposalId"]

        // try to cast before voting delay and fails
        await expect( governor.castVote(proposalId, 1)).to.be.reverted;

        const votingDelay = Number(await governor.votingDelay()) + 100;
        await hre.network.provider.send("evm_increaseTime", [votingDelay]);
        await hre.network.provider.send("evm_mine");
  
        // Vote
        await expect( governor.castVote(proposalId, 1n)).to.emit(governor, "VoteCast");

        //try to queue before is executable and fails

        // Queue proposal
       await  expect( governor.queue(proposalId)).to.be.reverted;

        // Wait for voting period to end
        const votingPeriod = Number(await governor.votingPeriod()) + 100;
        await hre.network.provider.send("evm_increaseTime", [votingPeriod]);
        await hre.network.provider.send("evm_mine");
  

        // expect proposal state to be succeeded
        let proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(4);

        // Queue proposal
        await expect( governor.queue(proposalId)).to.emit(governor, "ProposalQueued");

        // expect proposal state to be queued
        proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(5);

        // Execute proposal
        await expect( governor.execute(proposalId)).to.be.reverted;

        // Simulate time delay required before execution
        // Replace 'executionDelay' with your contract's specific delay
        const executionDelay =  Number(await timelock.getMinDelay() + 1n);
        await hre.network.provider.send("evm_increaseTime", [executionDelay]);
        await hre.network.provider.send("evm_mine");

        // Execute proposal
        await expect( governor.execute(proposalId)).to.emit(governor, "ProposalExecuted");

        // expect proposal state to be executed
        proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(7);

        // Check if admin's balance has increased
        const balance = await token.balanceOf(signers.admin.address);
        expect(balance).to.be.equal(11000n);
    });

    it("should cancel the proposal before vote start", async function () {
        const { token, governor, signers, timelock } = this;

        // initial mint
        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balanceOne = await token.balanceOf(signers.admin.address);
        expect(balanceOne).to.be.equal(amountToMint);

        // delegate
        await token.delegate(signers.admin.address);

        await expect( token.grantRole(await token.MINTER_ROLE(), await timelock.getAddress())).to.emit(token, "RoleGranted");
        // expect(await token.grantRole(await token.MINTER_ROLE(), await governor.getAddress())).to.emit(token, "RoleGranted");

        const calldata = token.interface.encodeFunctionData("mint", [signers.admin.address, 1000n]);

        // Propose
        const proposalTx = await governor.propose(
            [await token.getAddress()], // targets 
            [0n], // value
            [calldata],
            "Proposal to mint 1000 tokens for admin"// description
        );

        expect(proposalTx).to.emit(governor, "ProposalCreated");

        // Wait for the transaction to be mined
        const receipt = await proposalTx.wait(1);

        // console.log("proposalId",receipt?.logs);

        const eventLogs: EventLog[] = (receipt?.logs ?? []).filter((log): log is EventLog => true);

        // Find the ProposalCreated event in the transaction receipt
        const event = eventLogs.find((log) => log.fragment.name === "ProposalCreated");

        const logDescription = governor.interface.parseLog({
            topics: event?.topics ? [...event.topics] : [],
            data: event?.data ?? "",
        });

        // Get the proposalId from the event arguments
        const proposalId = logDescription?.args["proposalId"]

        // try to cancel it
        await expect( governor.cancel(proposalId)).to.emit(governor, "ProposalCanceled");

        const proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(2);
    });

    it("should not cancel the proposal after vote starts", async function () {
        const { token, governor, signers, timelock } = this;

        // initial mint
        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balanceOne = await token.balanceOf(signers.admin.address);
        expect(balanceOne).to.be.equal(amountToMint);

        // delegate
        await token.delegate(signers.admin.address);

        await expect( token.grantRole(await token.MINTER_ROLE(), await timelock.getAddress())).to.emit(token, "RoleGranted");
        // expect(await token.grantRole(await token.MINTER_ROLE(), await governor.getAddress())).to.emit(token, "RoleGranted");

        const calldata = token.interface.encodeFunctionData("mint", [signers.admin.address, 1000n]);

        // Propose
        const proposalTx = await governor.propose(
            [await token.getAddress()], // targets 
            [0n], // value
            [calldata],
            "Proposal to mint 1000 tokens for admin"// description
        );

        expect(proposalTx).to.emit(governor, "ProposalCreated");

        // Wait for the transaction to be mined
        const receipt = await proposalTx.wait(1);

        // console.log("proposalId",receipt?.logs);

        const eventLogs: EventLog[] = (receipt?.logs ?? []).filter((log): log is EventLog => true);

        // Find the ProposalCreated event in the transaction receipt
        const event = eventLogs.find((log) => log.fragment.name === "ProposalCreated");

        const logDescription = governor.interface.parseLog({
            topics: event?.topics ? [...event.topics] : [],
            data: event?.data ?? "",
        });

        // Get the proposalId from the event arguments
        const proposalId = logDescription?.args["proposalId"]

        const votingDelay =  Number(await governor.votingDelay() + 100n);
        await hre.network.provider.send("evm_increaseTime", [votingDelay]);
        await hre.network.provider.send("evm_mine");

        // try to cancel it
        await expect( governor.cancel(proposalId)).to.be.reverted;

        const proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(1);
    });

    it("should be able to see proposal defeated", async function () {
        const { token, governor, signers, timelock } = this;

        // initial mint
        const amountToMint = 10000n;
        await token.mint(signers.admin, amountToMint);

        const balanceOne = await token.balanceOf(signers.admin.address);
        expect(balanceOne).to.be.equal(amountToMint);

        // delegate
        await token.delegate(signers.admin.address);

        await expect( token.grantRole(await token.MINTER_ROLE(), await timelock.getAddress())).to.emit(token, "RoleGranted");
        // expect(await token.grantRole(await token.MINTER_ROLE(), await governor.getAddress())).to.emit(token, "RoleGranted");

        const calldata = token.interface.encodeFunctionData("mint", [signers.admin.address, 1000n]);

        // Propose
        const proposalTx = await governor.propose(
            [await token.getAddress()], // targets 
            [0n], // value
            [calldata],
            "Proposal to mint 1000 tokens for admin"// description
        );

        expect(proposalTx).to.emit(governor, "ProposalCreated");

        // Wait for the transaction to be mined
        const receipt = await proposalTx.wait(1);

        // console.log("proposalId",receipt?.logs);

        const eventLogs: EventLog[] = (receipt?.logs ?? []).filter((log): log is EventLog => true);

        // Find the ProposalCreated event in the transaction receipt
        const event = eventLogs.find((log) => log.fragment.name === "ProposalCreated");

        const logDescription = governor.interface.parseLog({
            topics: event?.topics ? [...event.topics] : [],
            data: event?.data ?? "",
        });

        // Get the proposalId from the event arguments
        const proposalId = logDescription?.args["proposalId"]

        const votingDelay =  Number(await governor.votingDelay() + 100n);
        await hre.network.provider.send("evm_increaseTime", [votingDelay]);
        await hre.network.provider.send("evm_mine");

        // Vote
        await expect( governor.castVote(proposalId,0)).to.emit(governor, "VoteCast");

        // Wait for voting period to end
        const votingPeriod =  Number(await governor.votingPeriod() + 100n);
        await hre.network.provider.send("evm_increaseTime", [votingPeriod]);
        await hre.network.provider.send("evm_mine");

        // expect state to be deafeated
        const proposalState = await governor.state(proposalId);
        expect(proposalState).to.be.equal(3);
    });
}