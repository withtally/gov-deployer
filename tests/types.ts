import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

import type { OZGovernor, TimelockController, GovernorToken } from "../types";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
    export interface Context {
        governor: OZGovernor;
        token: GovernorToken;
        timelock: TimelockController;
        loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
        signers: Signers;
    }
}

export interface Signers {
    admin: SignerWithAddress;
    notAuthorized: SignerWithAddress;
}