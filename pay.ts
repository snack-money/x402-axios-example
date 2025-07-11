import minimist from "minimist";
import axios from "axios";
import { config } from "dotenv";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

config();

const privateKey = process.env.PRIVATE_KEY as Hex;
const baseURL = process.env.RESOURCE_SERVER_URL as string;
const endpointPath = process.env.ENDPOINT_PATH as string; 
if (!baseURL || !privateKey || !endpointPath) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const args = minimist(process.argv.slice(2));
if (!args.receiver_identity || !args.receiver_username || !args.amount) {
  console.error("Usage: yarn pay --receiver_identity <receiver_identity> --receiver_username <receiver_username> --amount <amount>");
  process.exit(1);
}

// Input validations
const allowedIdentities = ["twitter", "farcaster"];
if (!allowedIdentities.includes(args.receiver_identity.toLowerCase())) {
  console.error("receiver_identity must be either 'twitter' or 'farcaster'");
  process.exit(1);
}
const amount = parseFloat(args.amount);
if (isNaN(amount)) {
  console.error("Amount must be a valid number, e.g., 0.01");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
const api = withPaymentInterceptor(
  axios.create({ baseURL }),
  account,
);

api
  .post(endpointPath, { 
    amount,
    currency: "USDC",
    type: "social-network",
    sender_username: "snackmoney-agent-x402",
    receiver_username: args.receiver_username,
    receiver_identity: args.receiver_identity,
   })
  .then(response => {
    console.log('response', response.data);
    const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    console.log(paymentResponse);
  })
  .catch(error => {
    console.error('error', error);
  });
