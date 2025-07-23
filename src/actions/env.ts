import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { Logger } from "../helper/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localEnvPath = path.resolve(__dirname, "../.env");

// eslint-disable-next-line jsdoc/require-jsdoc
export async function envAction() {
  const { privateKey } = await inquirer.prompt([
    {
      name: "privateKey",
      type: "password",
      message: "Enter your Ethereum PRIVATE_KEY:",
      mask: "*", // ✅ target dist/.env after build
      validate: (input) =>
        /^0x[0-9a-fA-F]{64}$/.test(input)
          ? true
          : "Must be a valid 0x-prefixed private key",
    },
  ]);

  const envExists = fs.existsSync(localEnvPath);
  const envContent = envExists ? fs.readFileSync(localEnvPath, "utf-8") : "";

  const lines = envContent.split("\n").filter(Boolean);
  const updatedLines = lines.filter((line) => !line.startsWith("PRIVATE_KEY="));
  updatedLines.push(`PRIVATE_KEY=${privateKey}`);

  fs.writeFileSync(localEnvPath, updatedLines.join("\n"), "utf-8");

  Logger.info(
    // eslint-disable-next-line prettier/prettier
    `Environment variable PRIVATE_KEY set successfully ${localEnvPath}`
  );
}
