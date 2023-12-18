import type { NetworkUserConfig } from "hardhat/types";
import { vars } from "hardhat/config";
const PRIVATE_KEY = vars.get("PRIVATE_KEY", process.env.PRIVATE_KEY || "");

const chainIds = {
    ganache: 1337,
    hardhat: 31337,
    ethereum: 1,
    sepolia: 11155111,
    arbitrum: 42161,
    "arbitrum-sepolia": 421614,
    "arbitrum-nova": 42170,
    polygon: 137,
    "polygon-mumbai": 80001,
    avalanche: 43114,
    "avalanche-fuji": 43113,
    bsc: 56,
    optimism: 10,
    gnosis: 100,
    kroma: 255,
    "kroma-testnet": 2358,
    "shimmerEVM-testnet": 1073,
    shimmerEVM: 148,
    "zkSync-era": 324,
    "polygon-zkEVM": 1101,
    "polygon-zkEVM-testnet": 1442,
    scroll: 534352,
    "scroll-sepolia": 534351,
    linea: 59144,
    mantle: 5000,
    "mantle-testnet": 5001,
    base: 8453,
    moonbeam: 1284,
    "linea-testnet": 59140,
    celo: 42220,
};

export function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
    let jsonRpcUrl: string = "";
    switch (chain) {
        case "ethereum":
            jsonRpcUrl = vars.get("ETHEREUM_URL", process.env.ETHEREUM_URL || "");
            break;
        case "sepolia":
            jsonRpcUrl = vars.get("SEPOLIA_URL", process.env.SEPOLIA_URL || "");
            break;
        case "arbitrum":
            jsonRpcUrl = vars.get("ARBITRUM_URL", process.env.ARBITRUM_URL || "");
            break;
        case "arbitrum-sepolia":
            jsonRpcUrl = vars.get("ARBITRUM_URL", process.env.ARBITRUM_URL || "");
            break;
        case "arbitrum-nova":
            jsonRpcUrl = vars.get("ARBITRUM_NOVA_URL", process.env.ARBITRUM_NOVA_URL || "");
            break;
        case "polygon":
            jsonRpcUrl = vars.get("POLYGON_URL", process.env.POLYGON_URL || "");
            break;
        case "polygon-mumbai":
            jsonRpcUrl = vars.get("MUMBAI_URL", process.env.MUMBAI_URL || "");
            break;
        case "avalanche":
            jsonRpcUrl = vars.get("AVALANCHE_URL", process.env.AVALANCHE_URL || "");
            break;
        case "avalanche-fuji":
            jsonRpcUrl = vars.get("FUJI_URL", process.env.FUJI_URL || "");
            break;
        case "bsc":
            jsonRpcUrl = vars.get("BINANCE_URL", process.env.BINANCE_URL || "");
            break;
        case "optimism":
            jsonRpcUrl = vars.get("OPTIMISM_URL", process.env.OPTIMISM_URL || "");
            break;
        case "gnosis":
            jsonRpcUrl = vars.get("GNOSIS_URL", process.env.GNOSIS_URL || "");
            break;
        case "linea":
            jsonRpcUrl = vars.get("LINEA_URL", process.env.LINEA_URL || "");
            break;
        case "linea-testnet":
            jsonRpcUrl = vars.get("LINEA_TESTNET_URL", process.env.LINEA_TESTNET_URL || "");
            break;
        case "mantle":
            jsonRpcUrl = vars.get("MANTLE_URL", process.env.MANTLE_URL || "");
            break;
        case "mantle-testnet":
            jsonRpcUrl = vars.get("MANTLE_TESTNET_URL", process.env.MANTLE_TESTNET_URL || "");
            break;
        case "kroma":
            jsonRpcUrl = vars.get("KROMA_URL", process.env.KROMA_URL || "");
            break;
        case "kroma-testnet":
            jsonRpcUrl = vars.get("KROMA_TESTNET_URL", process.env.KROMA_TESTNET_URL || "");
            break;
        case "shimmerEVM":
            jsonRpcUrl = vars.get("SHIMMER_URL", process.env.SHIMMER_URL || "");
            break;
        case "shimmerEVM-testnet":
            jsonRpcUrl = vars.get("SHIMMER_TESTNET_URL", process.env.SHIMMER_TESTNET_URL || "");
            break;
        case "zkSync-era":
            jsonRpcUrl = vars.get("ZKSYNC_URL", process.env.ZKSYNC_URL || "");
            break;
        case "polygon-zkEVM":
            jsonRpcUrl = vars.get("ZKEVM_URL", process.env.ZKEVM_URL || "");
            break;
        case "polygon-zkEVM-testnet":
            jsonRpcUrl = vars.get("ZKEVM_TESTNET_URL", process.env.ZKEVM_TESTNET_URL || "");
            break;
        case "scroll":
            jsonRpcUrl = vars.get("SCROLL_URL", process.env.SCROLL_URL || "");
            break;
        case "scroll-sepolia":
            jsonRpcUrl = vars.get("SCROLL_SEPOLIA_URL", process.env.SCROLL_SEPOLIA_URL || "");
            break;
        case "celo":
            jsonRpcUrl = vars.get("CELO_URL", process.env.CELO_URL || "");
            break;
        case "base":
            jsonRpcUrl = vars.get("BASE_URL", process.env.BASE_URL || "");
            break;
        case "moonbeam":
            jsonRpcUrl = vars.get("MOONBEAM_URL", process.env.MOONBEAM_URL || "");
            break;
        default:
            throw new Error(`Unsupported chain: ${chain}`);
    }

    return {
        // at least
        // vars.get("MNEMONIC", process.env.MNEMONIC || "");
        // you can also use mnemonic if you preffer. If you use this mnemonic make sure you don't commit it to github
        // accounts: {
        //     count: 10,
        //     mnemonic,
        //     path: "m/44'/60'/0'/0",
        //   },
        accounts: [
            PRIVATE_KEY,
        ],
        chainId: chainIds[chain],
        url: jsonRpcUrl,
    };
}