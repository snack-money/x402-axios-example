# Snack Money API x402 example

This is an example client that demonstrates how to use the Snack Money API to send USDC to any X and Farcaster account without requiring wallet address.

## Prerequisites

- Node.js v20+ (install via [nvm](https://github.com/nvm-sh/nvm))
- yarn v1
- A valid Ethereum private key for making payments

## Setup
1. Clone the repo
2. Install Dependencies:
```bash
cd x402-axios-example
yarn install
```

3. Copy `.env-local` to `.env` and add your Ethereum private key (remember it should have USDC on Base Sepolia, which you can provision using the [CDP Faucet](https://portal.cdp.coinbase.com/products/faucet)):
```bash
cp .env-local .env
```

4. Start the example client (remember you need to be running a server locally or point at an endpoint):
```bash
yarn run pay
```
```bash
yarn run batch-pay
```

# x402-axios-example

## Usage

You can run the payment script with the following command:

```sh
yarn run pay <receiver_identity> <receiver_username> <$amount>
```

- `<receiver_identity>`: The identity type (e.g., `farcaster`, `twitter`)
- `<receiver_username>`: The username of the receiver (e.g., `0xmesuthere`)
- `<$amount>`: The amount to send, prefixed with `$` (e.g., `$0.01`). The `$` is optional.

**Examples:**

```sh
yarn run pay twitter 0xmesuthere 0.01
yarn run pay farcaster mesut 0.01
```

The script will parse the arguments and send the payment accordingly.