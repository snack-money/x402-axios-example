import minimist from "minimist";
import axios from "axios";
import { config } from "dotenv";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

config();

const privateKey = process.env.PRIVATE_KEY as Hex;
const baseURL = process.env.RESOURCE_SERVER_URL as string; // e.g. https://api.snack.money
const endpointPath = process.env.CONFIRM_ENDPOINT_PATH as string; // e.g. /pay
if (!baseURL || !privateKey || !endpointPath) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const args = minimist(process.argv.slice(2));
if (!args.order_id) {
  console.error("Usage: yarn confirm_reward_distribution --order_id <order_id>");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
const api = withPaymentInterceptor(
  axios.create({ baseURL }),
  account,
);

api
  .post(`${endpointPath}/${args.order_id.toString()}`)
  .then(response => {
    // const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    // console.log(paymentResponse);
    console.log('response', JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('error', error);
  });
