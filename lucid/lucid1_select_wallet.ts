import { Blockfrost, Lucid, fromText, Addresses, Data } from "https://deno.land/x/lucid@0.20.9/mod.ts";
import "jsr:@std/dotenv/load";

// Lấy các biến từ env
const Bob_mnonic = Deno.env.get("MNEMONIC");
const BLOCKFROST_ID = Deno.env.get("BLOCKFROST_ID");
const BLOCKFROST_NETWORK = Deno.env.get("BLOCKFROST_NETWORK");

// console.log("Bob_mnonic=" + Bob_mnonic)
// console.log("BLOCKFROST_ID=" + BLOCKFROST_ID)
// console.log("BLOCKFROST_NETWORK=" + BLOCKFROST_NETWORK)

const lucid = new Lucid({
    provider: new Blockfrost(
        BLOCKFROST_NETWORK,
        BLOCKFROST_ID,
    ),
});
lucid.selectWalletFromSeed(Bob_mnonic);

// // Đọc private key từ file
// const privateKeyXsk = (await Deno.readTextFile("./payment.xsk")).trim();
// console.log("Private Key (addr_xsk):", privateKeyXsk);

// // Chuyển từ Bech32 (addr_xsk) về Ed25519 raw key
// const bip32PrivateKey = Bip32PrivateKey.from_bech32(privateKeyXsk);
// const privateKey = bip32PrivateKey.to_raw_key().as_bytes();

// // Chuyển private key thành dạng hex
// const privateKeyHex = Buffer.from(privateKey).toString("hex");
// console.log("Converted Private Key (Hex):", privateKeyHex);
// console.log("Private Key:", privateKey);
// lucid.selectWalletFromPrivateKey(privateKey);

// Select wallet from private key
// const privateKey = Crypto.generatePrivateKey(); // Bech32 encoded private key
// await Deno.writeTextFile('./payment.xsk', privateKey); //lưu lại file private key ở lần chạy đầu tiên

// const privateKey = await Deno.readTextFile("./payment.xsk");
// // console.log("Private Key:", privateKey);
// lucid.selectWalletFromPrivateKey(privateKey);

console.log(lucid);

Deno.exit(0);