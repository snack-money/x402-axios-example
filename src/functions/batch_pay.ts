import axios from "axios";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import type { BatchPayOptions } from "../types";
import { Logger } from "../helper/logger";

/**
 * batchPayAction
 *
 * @description Sends batch USDC payments to multiple users on Twitter or Farcaster.
 * @param cmd - Command line options including identity and receivers JSON string.
 */
export async function batchPay(cmd: BatchPayOptions) {
  const privateKey = process.env.PRIVATE_KEY as Hex;
  const baseURL = "https://api.snack.money" as string;
  const endpointPath = "/payments/batch-pay" as string;

  if (!baseURL || !privateKey || !endpointPath) {
    Logger.error("Missing required environment variables");
    process.exit(1);
  }

  const { identity, receivers } = cmd;
  const allowedIdentities = ["twitter", "farcaster"];

  if (!allowedIdentities.includes(identity.toLowerCase())) {
    Logger.error("receiver_identity must be either 'twitter' or 'farcaster'");
    process.exit(1);
  }

  let parsedReceivers;
  try {
    parsedReceivers = JSON.parse(receivers);
    if (!Array.isArray(parsedReceivers)) {
      throw new Error("Receivers must be an array");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    Logger.error(
      // eslint-disable-next-line prettier/prettier
      'receivers must be a valid JSON array, e.g. \'[{"username":"jrsarath","name":"Sarath Singh","amount":0.5}]\''
    );
    process.exit(1);
  }

  const account = privateKeyToAccount(privateKey);
  const api = withPaymentInterceptor(axios.create({ baseURL }), account);

  try {
    const response = await api.post(endpointPath, {
      currency: "USDC",
      type: "social-network",
      sender_username: "snackmoney-agent-x402",
      receiver_identity: identity,
      receivers: parsedReceivers,
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
