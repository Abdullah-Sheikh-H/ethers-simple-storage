const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.rpc)
    const encryptedJson = fs.readFileSync("./.encryptedKey.json")

    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.private_key_pass
    )

    wallet = await wallet.connect(provider)

    const abi = fs.readFileSync(
        "./_SimpleStorage_sol_SimpleStorage.abi",
        "utf8"
    )
    const binary = fs.readFileSync(
        "./_SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")

    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)

    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current favorite Number: ${currentFavoriteNumber.toString()}`)

    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)

    const updatedtFavoriteNumber = await contract.retrieve()
    console.log(`Updated favorite Number: ${updatedtFavoriteNumber.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
