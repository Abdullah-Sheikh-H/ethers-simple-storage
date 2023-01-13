const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const wallet = new ethers.Wallet(process.env.private_key);
  const encryptedKeyJson = await wallet.encrypt(
    process.env.private_key_pass,
    process.env.private_key
  );
  await fs.writeFileSync("./.encryptedKey.json", encryptedKeyJson);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
