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

const account = privateKeyToAccount(privateKey);

const api = withPaymentInterceptor(
  axios.create({
    baseURL,
  }),
  account,
);

// Get command line arguments
const [, , receiver_identity, receiver_username, amountInput] = process.argv;

if (!receiver_identity || !receiver_username || !amountInput) {
  console.error("Usage: yarn run pay <receiver_identity> <receiver_username> <amount>");
  process.exit(1);
}

// Validate receiver_identity
const allowedIdentities = ["twitter", "farcaster"];
if (!allowedIdentities.includes(receiver_identity.toLowerCase())) {
  console.error("receiver_identity must be either 'twitter' or 'farcaster'");
  process.exit(1);
}

// Parse amount directly (no $ support)
const amount = parseFloat(amountInput);

if (isNaN(amount)) {
  console.error("Amount must be a valid number, e.g., 0.01");
  process.exit(1);
}

api
  .post(endpointPath, { 
    amount,
    currency: "USDC",
    type: "social-network",
    sender_username: "snackmoney-agent-x402",
    receiver_username,
    receiver_identity,
   })
  .then(response => {
    console.log('response', response.data);
    const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    console.log(paymentResponse);
  })
  .catch(error => {
    console.error('error', error);
  });
