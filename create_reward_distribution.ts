import axios from "axios";
import { config } from "dotenv";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

config();

const privateKey = process.env.PRIVATE_KEY as Hex;
const baseURL = process.env.RESOURCE_SERVER_URL as string; // e.g. https://api.snack.money
const endpointPath = process.env.CREATE_ENDPOINT_PATH as string;

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
    "budget": 10,
    "platform": "farcaster",
    "content_id": "0xb87cf233790dd2d8a3ed9549f9e15069c02b1da0"
})
  .then(response => {
    console.log('response', response.data);
    const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    console.log(paymentResponse);
  })
  .catch(error => {
    // console.error('headers', error.response?.headers);
    // console.error('data', error.response?.data);
    console.error('error', error);
  });
