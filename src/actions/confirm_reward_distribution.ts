import axios from "axios";
import type { Hex } from "viem";
import type { Command } from "commander";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor } from "x402-axios";
import type { ConfirmRewardOptions } from "../types";
import { Logger } from "../helper/logger";

/**
 * ConfirmRewardAction
 *
 * @description - Confirms and executes a reward distribution order.
 * @param cmd - Command line options including orderId.
 */
export async function confirmRewardAction(cmd: Command & ConfirmRewardOptions) {
  const privateKey = process.env.PRIVATE_KEY as Hex;
  const baseURL = process.env.RESOURCE_SERVER_URL as string;
  const endpointPath = process.env.CONFIRM_ENDPOINT_PATH as string;

  if (!baseURL || !privateKey || !endpointPath) {
    Logger.error("Missing required environment variables");
    process.exit(1);
  }

  const { orderId } = cmd;
  const account = privateKeyToAccount(privateKey);
  const api = withPaymentInterceptor(axios.create({ baseURL }), account);

  try {
    const response = await api.post(`${endpointPath}/${orderId}`);
    Logger.log("response", JSON.stringify(response.data, null, 2));
  } catch (error) {
    Logger.error("error", error);
  }
}
