import minimist from "minimist";
import axios from "axios";
import { config } from "dotenv";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

config();

const privateKey = process.env.PRIVATE_KEY as Hex;
const baseURL = process.env.RESOURCE_SERVER_URL as string;
const endpointPath = process.env.CREATE_ENDPOINT_PATH as string;
if (!baseURL || !privateKey || !endpointPath) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const args = minimist(process.argv.slice(2), {
  string: ['content_id', 'platform', 'budget'],
});
if (!args.budget || !args.platform || !args.content_id) {
  console.error("Usage: yarn create_reward_distribution --budget <budget> --platform <platform> --content_id <content_id>");
  process.exit(1);
}

// Input validation
const allowedIdentities = ["twitter", "farcaster"];
if (!allowedIdentities.includes(args.platform.toLowerCase())) {
  console.error("platform must be either 'twitter' or 'farcaster'");
  process.exit(1);
}
const budget = parseFloat(args.budget);
if (isNaN(budget)) {
  console.error("budget must be a valid number, e.g., 0.01");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
const api = withPaymentInterceptor(
  axios.create({ baseURL }),
  account as never,
);

api
  .post(`/rewards/${args.platform}/create-distribution`, {
    "budget": budget,
    "content_id": args.content_id.toString()
})
  .then(response => {
    // const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    // console.log(paymentResponse);
    console.log('response', JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('error', error);
  });
