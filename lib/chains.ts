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
    id: "polygon",
    name: "Polygon",
    symbol: "POL",
    alchemyNetwork: "polygon-mainnet",
    explorer: "https://polygonscan.com",
    coingeckoId: "polygon-ecosystem-token",
    color: "#8247E5",
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
    id: "optimism",
    name: "Optimism",
    symbol: "ETH",
    alchemyNetwork: "opt-mainnet",
    explorer: "https://optimistic.etherscan.io",
    coingeckoId: "ethereum",
    color: "#FF0420",
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
] as const;

export type ChainId = (typeof CHAINS)[number]["id"];

export function isChainId(value: string): value is ChainId {
  return CHAINS.some((chain) => chain.id === value);
}

export function getChain(id: string) {
  return CHAINS.find((chain) => chain.id === id) ?? CHAINS[0];
}

export function alchemyUrl(network: string, apiKey: string) {
  return `https://${network}.g.alchemy.com/v2/${apiKey}`;
}
