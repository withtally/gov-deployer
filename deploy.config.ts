
export const config:any ={
  // Configuration for the deployment
  // Change the values for a more personalized deployment
  token:{
    name: "WE LOVE TALLY TOKEN",
    symbol: "WLTT",
  },
  // Timelock
  timelock:{
    minDelay: 86400, // 12 days
  },
  // true set clockMode as timestamp, false is block
  clockMode: false,
  // Governor
  governor:{
    name: "WE LOVE TALLY DAO",
    // 7200 1 day
    votingDelay: 7200,
    // 50400 7 days
    votingPeriod: 50400,
    // numerator to denominator of 100
    quorumNumerator: 4,
    // threshold to be able to propose
    proposalThreshold: 0, // if you want to prevent proposal spam, you should set the threshold to value diff from zero.
    // vote extension, if a late quorum is reached how much you want to extend it ?
    voteExtension: 7200, // 7200 would be a day.
  },
  // First Mint is used to mint the first tokens to this governance
  // it has to be higher than the proposalThreshold
  // so it is enough tokens to the governance to be able to propose
  // 
  // ATTENTION:
  // If amount is not higher then 0 it will not mint any tokens and also maintain roles for the deployer
  // 
  // after the first mint, the deployer will lose the minter and admin role and give it to the timelock which is the executor.
  firstMint:{
    amount: 0, // if set as higher then zero, it will mint the amount of tokens to the address below
    // To is an Ethereum Address, if empty, it will be the deployer, also it not correct, it will be the deployer ( warned when deploying )
    to: "",
  }
}
