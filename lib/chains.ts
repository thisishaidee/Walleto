export const CHAINS = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    alchemyNetwork: "eth-mainnet",
    explorer: "https://etherscan.io",
    coingeckoId: "ethereum",
    color: "#627EEA",
  },
  {
    id: "bnb",
    name: "BNB Chain",
    symbol: "BNB",
    alchemyNetwork: "bnb-mainnet",
    explorer: "https://bscscan.com",
    coingeckoId: "binancecoin",
    color: "#F3BA2F",
  },
  {
    id: "base",
    name: "Base",
    symbol: "ETH",
    alchemyNetwork: "base-mainnet",
    explorer: "https://basescan.org",
    coingeckoId: "ethereum",
    color: "#0052FF",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ETH",
    alchemyNetwork: "arb-mainnet",
    explorer: "https://arbiscan.io",
    coingeckoId: "ethereum",
    color: "#28A0F0",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "POL",
    alchemyNetwork: "polygon-mainnet",
    explorer: "https://polygonscan.com",
    coingeckoId: "polygon-ecosystem-token",
    color: "#8247E5",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    alchemyNetwork: "avax-mainnet",
    explorer: "https://snowtrace.io",
    coingeckoId: "avalanche-2",
    color: "#E84142",
  },
  {
    id: "optimism",
    name: "Optimism",
    symbol: "ETH",
    alchemyNetwork: "opt-mainnet",
    explorer: "https://optimistic.etherscan.io",
    coingeckoId: "ethereum",
    color: "#FF0420",
  },
  {
    id: "linea",
    name: "Linea",
    symbol: "ETH",
    alchemyNetwork: "linea-mainnet",
    explorer: "https://lineascan.build",
    coingeckoId: "ethereum",
    color: "#121212",
  },
  {
    id: "zksync",
    name: "zkSync",
    symbol: "ETH",
    alchemyNetwork: "zksync-mainnet",
    explorer: "https://explorer.zksync.io",
    coingeckoId: "ethereum",
    color: "#8C8DFC",
  },
  {
    id: "scroll",
    name: "Scroll",
    symbol: "ETH",
    alchemyNetwork: "scroll-mainnet",
    explorer: "https://scrollscan.com",
    coingeckoId: "ethereum",
    color: "#FFEEDA",
  },
] as const;

export type ChainId = (typeof CHAINS)[number]["id"];

export const CHAIN_COUNT = CHAINS.length;

export function isChainId(value: string): value is ChainId {
  return CHAINS.some((chain) => chain.id === value);
}

export function getChain(id: string) {
  return CHAINS.find((chain) => chain.id === id) ?? CHAINS[0];
}

export function alchemyUrl(network: string, apiKey: string) {
  return `https://${network}.g.alchemy.com/v2/${apiKey}`;
}
