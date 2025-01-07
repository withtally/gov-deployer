import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

async function generateKeys() {
  // Create random wallet
  const wallet = ethers.Wallet.createRandom();
  
  // Get keys
  const privateKey = wallet.privateKey;
  const publicKey = wallet.address;

  // Read existing .env content
  const envPath = path.join(__dirname, "../.env");
  let envContent = "";
  try {
    envContent = fs.readFileSync(envPath, "utf8");
  } catch (error) {
    console.log("No existing .env file, creating new one");
  }

  // Update or add PRIVATE_KEY
  if (envContent.includes("PRIVATE_KEY=")) {
    envContent = envContent.replace(
      /PRIVATE_KEY=.*/,
      `PRIVATE_KEY=${privateKey}`
    );
  } else {
    envContent += `\nPRIVATE_KEY=${privateKey}`;
  }

  // Update or add PUBLIC_KEY
  if (envContent.includes("PUBLIC_KEY=")) {
    envContent = envContent.replace(
      /PUBLIC_KEY=.*/,
      `PUBLIC_KEY=${publicKey}`
    );
  } else {
    envContent += `\nPUBLIC_KEY=${publicKey}`;
  }

  // Write back to .env
  fs.writeFileSync(envPath, envContent);

  console.log("New keys generated and saved to .env:");
  console.log(`Private Key: ${privateKey}`);
  console.log(`Public Key: ${publicKey}`);
  console.log("\nMake sure to fund this address for testing!");
}

generateKeys().catch(console.error); 