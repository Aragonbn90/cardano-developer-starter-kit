// Lab 5-1: Register stakekey, check transaction

import { Blockfrost, Lucid } from "https://deno.land/x/lucid@0.20.9/mod.ts";
import "jsr:@std/dotenv/load";

function utf8ToHex(str: string): string {
    return Array.from(str)
        .map((c: string) => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
}

// Lấy các biến từ env
const Bob_mnonic = Deno.env.get("MNEMONIC");
const BLOCKFROST_ID = Deno.env.get("BLOCKFROST_ID");
const BLOCKFROST_NETWORK = Deno.env.get("BLOCKFROST_NETWORK");

const lucid = new Lucid({
    provider: new Blockfrost(
        BLOCKFROST_NETWORK,
        BLOCKFROST_ID,
    ),
});
lucid.selectWalletFromSeed(Bob_mnonic);

const rewardAddress = await lucid.wallet.rewardAddress();
console.log(rewardAddress);
const tx = await lucid.newTx()
    .registerStake(rewardAddress)
    //   .withdraw(rewardAddress)  // Phải lấy tiền thưởng về trước khi hủy đăng ký
    //   .deregisterStake(rewardAddress)  // Hủy đăng ký
    .commit();

const signedTx = await tx.sign().commit();
const txHash = await signedTx.submit();
// await Deno.writeTextFile("./cbor/registerStake.log", `cbor code: ${signedTx}` +"\n");
// await Deno.writeTextFile("./cbor/registerStake.log", `Bạn có thể kiểm tra giao dịch tại: https://preview.cexplorer.io/tx/${txHash}` + "\n", { append: true });
console.log(`Bạn có thể kiểm tra giao dịch tại: https://preview.cexplorer.io/tx/${txHash}`);