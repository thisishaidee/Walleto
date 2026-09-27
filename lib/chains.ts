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
    id: "robinhood",
    name: "Robinhood",
    symbol: "ETH",
    alchemyNetwork: "robinhood-mainnet",
    explorer: "https://robinhoodchain.blockscout.com",
    coingeckoId: "ethereum",
    color: "#00C805",
  },
  {
    id: "monad",
    name: "Monad",
    symbol: "MON",
    alchemyNetwork: "monad-mainnet",
    explorer: "https://monadvision.com",
    coingeckoId: "monad",
    color: "#836EF9",
  },
  {
    id: "unichain",
    name: "Unichain",
    symbol: "ETH",
    alchemyNetwork: "unichain-mainnet",
    explorer: "https://uniscan.xyz",
    coingeckoId: "ethereum",
    color: "#FF007A",
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
