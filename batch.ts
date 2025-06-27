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

api
  .post(endpointPath, { 
    "currency": "USDC",
    "type": "social-network",
    "sender_username": "x402-axios",
    "receiver_identity": "farcaster",
    "receivers": [
      {
        "username": "jrsarath",
        "name": "Sarath Singh",
        "amount": 0.5
      }
    ],
   })
  .then(response => {
    // console.log('response', response.data);
    const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    console.log(paymentResponse);
  })
  .catch(error => {
    // console.error('headers', error.response?.headers);
    // console.error('data', error.response?.data);
    console.error('error', error);
  });
