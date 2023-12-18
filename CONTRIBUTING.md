# Contributing

Contributions to the Token Distributor Contract Deployer are welcome! Here are some guidelines to follow:

## Getting Started

### Prerequisites

- Node.js
- Yarn or NPM

### Installation

1. Fork and clone the repo

```
git clone https://github.com/YOUR-USERNAME/token-distributor-deployer.git
```

2. Install dependencies   

```
yarn
# or 
npm install
```

3. Create a branch for your edits

```
git checkout -b my-changes
```

## Making Changes

- Beware with adding your private keys to a commit by accident.
- Update any documentation that is affected by your changes
- Try to follow existing code style and conventions 
- Add tests covering any new functionality
- Make small and targeted PRs instead of large sweeping changes

## Submitting Changes

1. Commit changes with descriptive commit messages  
2. Push to your fork
3. Create a pull request describing the changes
4. Request a review and address any comments

## Add chain

1. Add ENV variables to the `.env.example`.
2. Add it to etherscan section in `hardhat.config.ts` if it's not a "valid network" create it as a custom one.
3. Also add it to the `chain.config.ts` file.
3. Add it to networks section in `hardhat.config.ts`.


Some things that will increase chance of merge:

- Well tested code
- Detailed documentation 
- Targeted and logical commit history
- Easy to understand description of changes

Thanks for your contributions!