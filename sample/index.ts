import http from "http";
import { parse } from "url";
import { pay, batchPay, confirmReward, createReward } from "snackmoney";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url || "", true);
  const method = req.method || "";
  const pathname = parsedUrl.pathname || "";

  if (method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      if (pathname === "/pay") {
        await pay(data);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Payment sent successfully" }));
      } else if (pathname === "/batch-pay") {
        await batchPay(data);
        res.writeHead(200);
        res.end(
          // eslint-disable-next-line prettier/prettier
          JSON.stringify({ message: "Batch payment processed successfully" })
        );
      } else if (pathname === "/create-reward") {
        await createReward(data);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Reward created successfully" }));
      } else if (pathname === "/confirm-reward") {
        await confirmReward(data);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Reward confirmed successfully" }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not Found" }));
      }
    } catch (error) {
      console.error("Request error:", error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
