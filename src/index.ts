import fs from "fs";
import kleur from "kleur";
import dotenv from "dotenv";
import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";

import pkg from "../package.json";

import { payAction } from "./actions/pay";
import { envAction } from "./actions/env";
import { batchPayAction } from "./actions/batch_pay";
import { createRewardAction } from "./actions/create_reward_distribution";
import { confirmRewardAction } from "./actions/confirm_reward_distribution";

import { Logger } from "./helper/logger";
import { findMostMatchText } from "./helper/math-diff";

import type { CommandName } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localEnvPath = path.resolve(__dirname, "../.env");
const fallbackEnvPath = path.resolve(process.cwd(), ".env");

const envPathToUse = fs.existsSync(localEnvPath)
  ? localEnvPath
  : fs.existsSync(fallbackEnvPath)
    ? fallbackEnvPath
    : null;

if (envPathToUse) {
  dotenv.config({ path: envPathToUse });
  Logger.info(`Loaded .env from ${envPathToUse}`);
} else {
  Logger.warn("⚠️ No .env file found, some commands may not work properly.");
}

const commandList: CommandName[] = [
  "pay",
  "batch-pay",
  "confirm-reward-distribution",
  "create-reward-distribution",
  "env",
];

const snackmoney = new Command();

snackmoney
  .name(`${pkg.name}`)
  .usage("[command]")
  .description(`${pkg.name} - ${pkg.description} -  v${pkg.version}`)
  .version(pkg.version, "-v, --version", "Output the current version")
  .helpOption("-h, --help", "Display help for command")
  .action(async (_, command) => {
    let isArgs = false;

    if (command) {
      const args = command.args?.[0];

      if (args && !commandList.includes(args as CommandName)) {
        isArgs = true;

        const matchCommand = findMostMatchText(commandList, args);

        if (matchCommand) {
          Logger.error(
            // eslint-disable-next-line prettier/prettier
            `Unknown command '${args}', Did you mean '${kleur.underline(matchCommand)}'?`
          );
        } else {
          Logger.error(`Unknown command '${args}'`);
        }
      }
    }

    if (!isArgs) {
      Logger.info("snackmoney --help");
    }
    process.exit(0);
  });

snackmoney
  .command("env")
  .description("Set your PRIVATE_KEY to .env file securely")
  .action(envAction);

snackmoney
  .command("pay")
  .description("Send USDC to a single user")
  .requiredOption(
    "-i --identity <identity>",
    // eslint-disable-next-line prettier/prettier
    "Identity platform: twitter or farcaster"
  )
  .requiredOption("-u --username <username>", "Receiver username")
  .requiredOption("-a --amount <amount>", "Amount in USDC")
  .action(payAction);

snackmoney
  .command("batch-pay")
  .description("Send USDC to multiple recipients")
  .requiredOption(
    "-i --identity <identity>",
    // eslint-disable-next-line prettier/prettier
    "Identity platform: twitter or farcaster"
  )
  .requiredOption("-r --receivers <json>", "Receivers JSON array string")
  .action(batchPayAction);

snackmoney
  .command("create-reward-distribution")
  .description("Create a reward distribution order")
  .requiredOption("-b --budget <budget>", "USDC budget")
  .requiredOption("-p --platform <platform>", "Platform: twitter or farcaster")
  .requiredOption("-c --content-id <contentId>", "Platform content ID")
  .action(createRewardAction);

snackmoney
  .command("confirm-reward-distribution")
  .description("Confirm reward distribution order")
  .requiredOption(
    "-o --order-id <orderId>",
    // eslint-disable-next-line prettier/prettier
    "Order ID to confirm and distribute"
  )
  .action(confirmRewardAction);

snackmoney.parse();
