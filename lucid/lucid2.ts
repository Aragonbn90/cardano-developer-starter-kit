import { Blockfrost, Lucid, Crypto } from "https://deno.land/x/lucid/mod.ts";
// import init, { Bip32PrivateKey } from "https://esm.sh/@emurgo/cardano-serialization-lib-browser@latest";

// Load thư viện WebAssembly
// await init();

// Provider selection
// There are multiple builtin providers you can choose from in Lucid.

// Blockfrost

const lucid = new Lucid({
    provider: new Blockfrost(
        "https://cardano-preview.blockfrost.io/api/v0",
        "previewcvzl4VvZO1u4DvMQiCCZkpU2oWplOhlg",
    ),
});

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

const privateKey = await Deno.readTextFile("./payment.xsk");
// console.log("Private Key:", privateKey);
lucid.selectWalletFromPrivateKey(privateKey);

console.log(lucid);

Deno.exit(0);