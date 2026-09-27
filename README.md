# walleto

Read-only EVM wallet tracker. Look up an address, see native balance + USD, and the latest native and ERC-20 transfers.

No private keys. No send. No swap. Nothing in this app can move funds.

Live: [https://walletoo.vercel.app](https://walletoo.vercel.app)

## Chains

10 networks, all via Alchemy:

| Chain | Alchemy network |
| --- | --- |
| Ethereum | `eth-mainnet` |
| BNB Chain | `bnb-mainnet` |
| Base | `base-mainnet` |
| Arbitrum | `arb-mainnet` |
| Polygon | `polygon-mainnet` |
| Avalanche | `avax-mainnet` |
| Optimism | `opt-mainnet` |
| Robinhood | `robinhood-mainnet` |
| Monad | `monad-mainnet` |
| Unichain | `unichain-mainnet` |

Enable each network on the same Alchemy app as your key.

## Transaction history

History is **not** limited by calendar days.

Alchemy is queried from genesis (`fromBlock: 0`) to latest, **newest first**. Each lookup pulls up to 100 incoming + 100 outgoing native transfers and 100 incoming + 100 outgoing ERC-20 transfers, then the UI shows the **40 most recent** after merge.

So:

- A transfer from today shows if it is among those newest events on the **selected chain**.
- A transfer from months ago still shows if the wallet is quiet.
- A very active wallet may only show the latest ~40 events, even if older activity exists.
- Activity on another chain will not appear until you switch the chain in the header.

Timestamps render in the viewer’s local time (`Today`, `Yesterday`, or date + time).

## Setup

```bash
pnpm install
cp .env.example .env.local
```

In `.env.local` set one of:

```
ALCHEMY_API_KEY=
```

or

```
ALCHEMY_KEY=
```

Never commit the key. Never prefix it with `NEXT_PUBLIC_`.

```bash
pnpm dev
```

## Vercel

Project: `walleto` (team Haidee). Production URL: `walletoo.vercel.app`.

Environment variable on the **walleto** project (not `moniq`):

- `ALCHEMY_KEY` or `ALCHEMY_API_KEY`
- Production (Preview too if you want branch deploys to work)

Redeploy after adding or changing the key.
