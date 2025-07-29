import axios from "axios";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor } from "x402-axios";
import type { CreateRewardOptions } from "../types";
import { Logger } from "../helper/logger";

/**
 * createRewardAction
 *
 * @description -  Creates a reward distribution order on Twitter or Farcaster.
 * @param cmd - Command line options including budget, platform, and contentId.
 */
export async function createReward(cmd: CreateRewardOptions) {
  const privateKey = process.env.PRIVATE_KEY as Hex;
  const baseURL = "https://api.snack.money" as string;
  const endpointPath = "/rewards/create-distribution" as string;

  if (!baseURL || !privateKey || !endpointPath) {
    Logger.error("Missing required environment variables");
    process.exit(1);
  }

  const { platform, contentId, budget } = cmd;
  const allowedPlatforms = ["twitter", "farcaster"];

  if (!allowedPlatforms.includes(platform.toLowerCase())) {
    Logger.error("platform must be either 'twitter' or 'farcaster'");
    process.exit(1);
  }

  const parsedBudget = parseFloat(budget);
  if (isNaN(parsedBudget)) {
    Logger.error("budget must be a valid number, e.g., 0.01");
    process.exit(1);
  }

  const account = privateKeyToAccount(privateKey);
  const api = withPaymentInterceptor(axios.create({ baseURL }), account);

  try {
    const response = await api.post(endpointPath, {
      budget: parsedBudget,
      platform,
      content_id: contentId,
    });

    Logger.log("response", JSON.stringify(response.data, null, 2));
  } catch (error) {
    Logger.error("error", error);
  }
}
