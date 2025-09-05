# 🍪 Snack Money API – x402 Example

This repository contains example scripts that demonstrate how to use the **Snack Money API** to send **USDC** to any **Farcaster** or **X** user — no wallet address required, thanks to the **x402 protocol**.


## Prerequisites
* **Node.js v20+** (Install via [nvm](https://github.com/nvm-sh/nvm))
* **Yarn v1**
* An **Ethereum private key** to sign and send transactions


## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/snack-money/x402-axios-example.git
   cd x402-axios-example
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env-local .env
   ```

   * Edit `.env` and add your **Ethereum private key**.


# Single Account Payment

### Usage
Send USDC to a single user via X or Farcaster:

```bash
yarn pay --receiver_identity <identity_type> --receiver_username <receiver_username> --amount <amount>
```

* `<identity_type>`: Either `farcaster` or `x` or `web`
* `<receiver_username>`: Receiver’s username (e.g., `0xmesuthere`, `mesut`)
* `<amount>`: Amount of USDC to send (e.g., `0.01`)

### Examples
```bash
yarn pay --receiver_identity x --receiver_username 0xmesuthere --amount 0.01

yarn pay --receiver_identity farcaster --receiver_username mesut --amount 0.01

yarn pay --receiver_identity web --receiver_username snack.money --amount 1

yarn pay --receiver_identity email --receiver_username jrsarath@outlook.com --amount 0.01
```

# Batch Payments

### Usage
Send USDC to multiple recipients in a single batch:

```bash
yarn batch-pay --receiver_identity <identity_type> --receivers '<receivers_json>'
```

* `<identity_type>`: `farcaster` or `x`
* `<receivers_json>`: A **JSON array** of recipients containing `username` and `amount`

### Examples

```bash
yarn batch-pay --receiver_identity farcaster --receivers '[{"username":"lincoln","amount":0.5},{"username":"mesut","amount":0.25}]'

yarn batch-pay --receiver_identity x --receivers '[{"username":"MurrLincoln","amount":0.5},{"username":"0xmesuthere","amount":0.25}]'
```

# Reward Distribution Creation

### Usage
Create a reward distribution order with reward budget:

```bash
yarn create-reward-distribution --budget <budget> --platform <platform> --content_id <content_id>
```

* `<budget>`: Amount of USDC to send (e.g., `10`)
* `<platform>`: `farcaster` or `x`
* `<content_id>`: The platform-provided **Content ID** associated with the content eligible for reward distribution.

### Examples
```bash
yarn create-reward-distribution --budget 10 --platform farcaster --content_id 0xb87cf233790dd2d8a3ed9549f9e15069c02b1da0
```

# Reward Distribution Confirmation

### Usage
Confirms and distributes reward budget among participants:

```bash
yarn confirm-reward-distribution --order_id <order_id>
```

* `<order_id>`: An **Order Id** obtained from reward distribution creation

### Examples
```bash
yarn confirm-reward-distribution --order_id x987ASCbjHk
```

## Notes
* The identity type must match the platform the user is on.
* Ensure your private key is secure and funded with sufficient USDC.

