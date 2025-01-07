import { Signer } from "ethers";
import { ERC20Token, TimelockController, OZGovernor } from "../typechain-types";

export interface GovernanceContext {
  signer: Signer;
  deployedContracts: {
    token?: {
      address: string;
      contract: ERC20Token;
    };
    timelock?: {
      address: string;
      contract: TimelockController;
    };
    governor?: {
      address: string;
      contract: OZGovernor;
    };
  };
  network: string;
}

export class GovernanceDeployer {
  private context: GovernanceContext;

  constructor(signer: Signer, network: string) {
    this.context = {
      signer,
      network,
      deployedContracts: {}
    };
  }

  getContext(): GovernanceContext {
    return this.context;
  }

  getSigner(): Signer {
    return this.context.signer;
  }

  getNetwork(): string {
    return this.context.network;
  }

  getDeployedContract(type: 'token' | 'timelock' | 'governor') {
    return this.context.deployedContracts[type];
  }

  setDeployedContract(
    type: 'token' | 'timelock' | 'governor',
    address: string,
    contract: ERC20Token | TimelockController | OZGovernor
  ) {
    this.context.deployedContracts[type] = {
      address,
      contract: contract as any // Type assertion needed due to union type
    };
  }

  hasContract(type: 'token' | 'timelock' | 'governor'): boolean {
    return !!this.context.deployedContracts[type];
  }

  // New method for checking recommended deployment order
  checkRecommendedOrder(type: 'token' | 'timelock' | 'governor'): boolean {
    switch(type) {
      case 'token':
        return true; // Token can always be deployed
      case 'timelock':
        return this.hasContract('token');
      case 'governor':
        return this.hasContract('token') && this.hasContract('timelock');
    }
  }

  // New method to get missing prerequisites
  getMissingPrerequisites(type: 'token' | 'timelock' | 'governor'): string[] {
    const missing: string[] = [];
    switch(type) {
      case 'timelock':
        if (!this.hasContract('token')) missing.push('token');
        break;
      case 'governor':
        if (!this.hasContract('token')) missing.push('token');
        if (!this.hasContract('timelock')) missing.push('timelock');
        break;
    }
    return missing;
  }
}

// Create a singleton instance
let governanceDeployer: GovernanceDeployer | null = null;

export function initializeGovernanceDeployer(signer: Signer, network: string) {
  governanceDeployer = new GovernanceDeployer(signer, network);
  return governanceDeployer;
}

export function getGovernanceDeployer(): GovernanceDeployer {
  if (!governanceDeployer) {
    throw new Error('GovernanceDeployer not initialized');
  }
  return governanceDeployer;
} 