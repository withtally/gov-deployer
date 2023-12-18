
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { ethers } from "hardhat";

/**
 * Grant and revoke the minter role
 * You also have to pay attention, do not do this without caution it can brick the token contract for minting.
 * 
 * @param token The token address
 * @param mintAmount The amount to mint
 * @param to The receiving address
 * @param admin The admin address for the newer roles, it has to be the timelock
 * @returns
*/
task("grant_revoke_minter_role", "Grants and revokes the minter role")
    .addParam("token", "The token address")
    .addOptionalParam("mintAmount", "The amount to mint")
    .addOptionalParam("to", "The receiving address")
    .addParam("admin", "The admin address for the newer roles, it has to be the timelock")
    .setAction(async (taskArgs: TaskArguments) => {
        const { token, mintAmount, to, admin } = taskArgs;

        /* When first deployed the minter and admin is the deployer, otherwise no minting amount would be possible */

        // check if token, to and admin are valid addresses
        if ( !ethers.isAddress(token) || !ethers.isAddress(admin) || (to && !ethers.isAddress(to)) ) {
            if (!ethers.isAddress(token)) {
                console.log("Token address is not valid");
            }
            if (!ethers.isAddress(admin)) {
                console.log("Admin address is not valid");
            }
            if (to && !ethers.isAddress(to)) {
                console.log("Receiving address is not valid");
            }
            return;
        }

        // const signer: ethers.Signer = await ethers.getSigner();
        const signers = await ethers.getSigners();
        const signer = signers[0];

        // Connect to the token contract
		const Token = (await ethers.getContractFactory("GovernorToken")) as GovernorToken__factory;
		const tokenContract = (await Token.attach(token)) as GovernorToken;

        const _to = to ? to:  signer;

        if ( Number(mintAmount) && mintAmount > 0) {
            console.log(`Minting ${mintAmount} tokens to ${to || admin}`);
            // Mint tokens to the receiving address
            await tokenContract.mint(to , mintAmount)
            console.log(`Minted ${mintAmount} tokens to ${to || admin}`);
        }

        // Grant the minter role to the receiving address
        await tokenContract.grantRole(await token.MINTER_ROLE(), admin);
        console.log(`Minter role granted to ${admin}`);

        // Grant the admin role to the receiving address
        await tokenContract.grantRole(await token.DEFAULT_ADMIN_ROLE(), admin);
        console.log(`Default admin role granted to ${admin}`);

        // Revoke the minter role from the caller
        await tokenContract.revokeRole(await token.MINTER_ROLE(), signer);
        console.log(`Minter role revoked from ${admin}`);

        // Revoke the minter role from the caller
        await tokenContract.revokeRole(await token.DEFAULT_ADMIN_ROLE(), signer);
        console.log(`Minter role revoked from ${admin}`);

    });
