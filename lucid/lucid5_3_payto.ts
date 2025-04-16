import { Blockfrost, Lucid } from "https://deno.land/x/lucid@0.20.9/mod.ts";
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

const tx = await lucid.newTx()
    .payTo("addr_test1qz3vhmpcm2t25uyaz0g3tk7hjpswg9ud9am4555yghpm3r770t25gsqu47266lz7lsnl785kcnqqmjxyz96cddrtrhnsdzl228", { lovelace: 5000000n })
    .commit();

// console.log(`tx: ${tx}`) //Hiện thị tx

const signedTx = await tx.sign().commit();
const txHash = await signedTx.submit();
console.log(`Bạn có thể kiểm tra giao dịch tại: https://preview.cexplorer.io/tx/${txHash}`);