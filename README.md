# 🍪 Snackmoney CLI

Send USDC payments and rewards to users on platforms like Twitter and Farcaster — all from your terminal.

---

## Smart Suggestions

If you mistype a command, Snackmoney will suggest the correct one:

```bash
snackmoney pey
# → Unknown command 'pey', Did you mean 'pay'?
```

---

## Installation

### Option 1: Run with `npx` (No install needed)

```bash
npx snackmoney <command> [options]
```

---

### Option 2: Install globally with `npm`

```bash
npm install -g snackmoney
snackmoney <command> [options]
```

---

### Option 3: Install with Homebrew (macOS/Linux)

```bash
brew tap your-org/snackmoney
brew install snackmoney
snackmoney <command> [options]
```

## Help

To see all available commands:

```bash
snackmoney --help
```

To check the version:

```bash
snackmoney --version
```

---

## Setup

Securely store your private key to `.env`:

```bash
snackmoney env
```

---

## Commands

### `pay`

Send USDC to a **single** user.

```bash
snackmoney pay -i twitter -u alice -a 10
```

---

### `batch-pay`

Send USDC to **multiple** users with a JSON string:

```bash
snackmoney batch-pay -i farcaster -r '[{"username":"bob","amount":15},{"username":"carol","amount":20}]'
```

---

### `create-reward-distribution`

Create a reward distribution order for content.

```bash
snackmoney create-reward-distribution -b 100 -p twitter -c 1234567890
```

---

### `confirm-reward-distribution`

Confirm and execute the reward distribution.

```bash
snackmoney confirm-reward-distribution -o order_abc123
```

---
