import axios from "axios";
import type { Hex } from "viem";
import type { Command } from "commander";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import type { PayOptions } from "../types";
import { Logger } from "../helper/logger";

/**
 * payAction
 *
 * @description - Sends a single USDC payment to a user on Twitter or Farcaster.
 * @param cmd - Command line options including identity, username, and amount.
 */
export async function payAction(cmd: Command & PayOptions) {
  const privateKey = process.env.PRIVATE_KEY as Hex;
  const baseURL = process.env.RESOURCE_SERVER_URL as string;
  const endpointPath = process.env.ENDPOINT_PATH as string;

  if (!baseURL || !privateKey || !endpointPath) {
    Logger.error("Missing required environment variables");
    process.exit(1);
  }

  const { identity, username, amount } = cmd;
  const allowedIdentities = ["twitter", "farcaster"];

  if (!allowedIdentities.includes(identity.toLowerCase())) {
    Logger.error("receiver_identity must be either 'twitter' or 'farcaster'");
    process.exit(1);
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    Logger.error("Amount must be a valid number, e.g., 0.01");
    process.exit(1);
  }

  const account = privateKeyToAccount(privateKey);
  const api = withPaymentInterceptor(axios.create({ baseURL }), account);

  try {
    const response = await api.post(endpointPath, {
      amount: parsedAmount,
      currency: "USDC",
      type: "social-network",
      sender_username: "snackmoney-agent-x402",
      receiver_username: username,
      receiver_identity: identity,
    });

    Logger.log("response", response.data);
    const paymentResponse = decodeXPaymentResponse(
      // eslint-disable-next-line prettier/prettier
      response.headers["x-payment-response"]
    );
    Logger.log(paymentResponse);
  } catch (error) {
    Logger.error("error", error);
  }
}
