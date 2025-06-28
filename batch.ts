import axios from "axios";
import { config } from "dotenv";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

config();

const privateKey = process.env.PRIVATE_KEY as Hex;
const baseURL = process.env.RESOURCE_SERVER_URL as string; // e.g. https://api.snack.money
const endpointPath = process.env.BATCH_ENDPOINT_PATH as string; // e.g. /pay

if (!baseURL || !privateKey || !endpointPath) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);

const api = withPaymentInterceptor(
  axios.create({
    baseURL,
  }),
  account,
);

// Get command line arguments
const [, , receiver_identity, receiversInput] = process.argv;

if (!receiver_identity || !receiversInput) {
  console.error("Usage: yarn run batch-pay <receiver_identity> <receivers_json>");
  process.exit(1);
}

// Validate receiver_identity
const allowedIdentities = ["twitter", "farcaster"];
if (!allowedIdentities.includes(receiver_identity.toLowerCase())) {
  console.error("receiver_identity must be either 'twitter' or 'farcaster'");
  process.exit(1);
}

// Parse receivers JSON
let receivers;
try {
  receivers = JSON.parse(receiversInput);
  if (!Array.isArray(receivers)) {
    throw new Error("Receivers must be an array");
  }
} catch (e) {
  console.error("receivers must be a valid JSON array, e.g. '[{\"username\":\"jrsarath\",\"name\":\"Sarath Singh\",\"amount\":0.5}]'");
  process.exit(1);
}

api
  .post(endpointPath, { 
    currency: "USDC",
    type: "social-network",
    sender_username: "snackmoney-agent-x402",
    receiver_identity,
    receivers,
   })
  .then(response => {
    console.log('response', response.data);
    const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    console.log(paymentResponse);
  })
  .catch(error => {
    console.error('error', error);
  });
