# walleto

Read-only EVM wallet tracker. Native balances, USD price, and recent native + ERC-20 transfers on Ethereum, Polygon, Arbitrum, Optimism, and Base.

No private keys. No send. No swap.

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Add your Alchemy key to `.env.local` as `ALCHEMY_API_KEY`. Never commit it.

```bash
pnpm dev
```

On Vercel, set `ALCHEMY_API_KEY` under Project Settings → Environment Variables (Production + Preview).
