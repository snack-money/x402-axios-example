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

3. Copy `.env-local` to `.env` and add your Ethereum private key 
```bash
cp .env-local .env
```

# Snack Money Single Account Payment Example

## Usage

You can run the payment script with the following command:

```sh
yarn run pay <receiver_identity> <receiver_username> <amount>
```
```bash
yarn run create_reward_distribution
```
```bash
yarn run confirm_reward_distribution
```

- `<receiver_identity>`: The identity type (`farcaster` or `twitter`)
- `<receiver_username>`: The username of the receiver (e.g., `0xmesuthere`)
- `<amount>`: The amount to send (e.g., `0.01`)

**Examples:**

```sh
yarn run pay twitter 0xmesuthere 0.01
yarn run pay farcaster mesut 0.01
```

The script will parse the arguments and send the payment accordingly.

# Snack Money Batch Payment Example

## Usage

You can run the batch payment script with the following command:

```sh
yarn run batch-pay <receiver_identity> '<receivers_json>'
```

- `<receiver_identity>`: The identity type (`farcaster` or `twitter`)
- `<receivers_json>`: A JSON array of receiver objects, each with `username`, `name`, and `amount` fields.

**Example:**

```sh
yarn run batch-pay farcaster '[{"username":"lincoln","amount":0.5},{"username":"mesut","amount":0.25}]'
yarn run batch-pay twitter '[{"username":"MurrLincoln","amount":0.5},{"username":"0xmesuthere","amount":0.25}]'
```

The script will validate the identity and receivers, then send the batch payment accordingly.