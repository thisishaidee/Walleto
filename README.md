# walleto

Read-only EVM wallet tracker. Look up an address, see native balance + USD, and native + ERC-20 transfer history.

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

History is **not** a day window. Alchemy is queried from genesis to latest, newest first, and pages are followed.

Each lookup walks up to 4 pages of 1,000 transfers for:

- incoming native (external + internal)
- outgoing native
- incoming ERC-20
- outgoing ERC-20

Those are merged, de-duplicated, sorted newest first, and the UI shows up to **800** events.

Quiet wallets: you should see almost everything on that chain, including old transfers.
Very active wallets: you still get a deep slice (thousands fetched, 800 shown). Full lifetime history of a bot/MEV wallet is not loaded in one request because Vercel would time out.

Switch chain in the header to see that chain’s history. Timestamps use the viewer’s local time.

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

Environment variable on the **walleto** project:

- `ALCHEMY_KEY` or `ALCHEMY_API_KEY`
- Production (Preview too if you want branch deploys to work)

Redeploy after adding or changing the key.
