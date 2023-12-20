import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

import type { OZGovernor, TimelockController, ERC20Token } from "../types";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
    export interface Context {
        governor: OZGovernor;
        token: ERC20Token;
        timelock: TimelockController;
        loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
        signers: Signers;
    }
}

export interface Signers {
    admin: SignerWithAddress;
    notAuthorized: SignerWithAddress;
}