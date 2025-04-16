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

// Get address
const address = await lucid.wallet.address(); // Bech32 address
// console.log(address);

async function createMultipleRecipients(payments: { address: string, amount: bigint }[]) {
    let tx = lucid.newTx();
    for (const payment of payments) {
        tx = tx.payTo(payment.address, { lovelace: payment.amount });
    }
    tx = await tx.commit();
    return tx;
}

async function sendAdaWithDatum(toAddress: string, datum: any, amount: bigint) {
    const tx = await lucid.newTx()
        .payToWithData(toAddress, datum, { lovelace: amount })
        .commit();
    return tx;
}

async function sendNativeTokens(toAddress: string, policyId: string, assetName: string, amount: bigint) {
    const tx = await lucid.newTx()
        // .payTo(toAddress, { [policyId + fromText(assetName)]: amount })
        .payTo(toAddress, { lovelace: 10_000_000n, [policyId + fromText(assetName)]: amount })
        .commit();
    return tx;
}

//1. Multiple recipients
// const tx = await createMultipleRecipients([
//     { address: "addr_test1qrukmjv57f6ut5e3ak0nxpnh9d8lp30xhyt0wnk39znanyxv506uj3pfgn2j4ea8he9w6d54s0ndgrgjc8z0jr8d66fsps407a", amount: 500000n },
//     { address: "addr_test1qrukmjv57f6ut5e3ak0nxpnh9d8lp30xhyt0wnk39znanyxv506uj3pfgn2j4ea8he9w6d54s0ndgrgjc8z0jr8d66fsps407a", amount: 1000000n },
//     { address: "addr_test1qrukmjv57f6ut5e3ak0nxpnh9d8lp30xhyt0wnk39znanyxv506uj3pfgn2j4ea8he9w6d54s0ndgrgjc8z0jr8d66fsps407a", amount: 1500000n }
// ]);
// console.log(`tx: ${tx}`);


//---------------------------------------------------
//2. Send with datum
const VestingSchema = Data.Object({
    lock_until: Data.Integer(),
    beneficiary: Data.Bytes(),
});
type VestingSchema = typeof VestingSchema;
// Set the vesting deadline
const deadlineDate: Date = new Date("2026-06-09T00:00:00Z")
const deadlinePosIx = BigInt(deadlineDate.getTime());
const { payment } = Addresses.inspect(
    "addr_test1qrukmjv57f6ut5e3ak0nxpnh9d8lp30xhyt0wnk39znanyxv506uj3pfgn2j4ea8he9w6d54s0ndgrgjc8z0jr8d66fsps407a",
);

//---------------------------------------------------
const d = {
    lock_until: deadlinePosIx,
    beneficiary: payment?.hash,
};
const datum = await Data.to<VestingSchema>(d, VestingSchema);
console.log("Datum:", datum);

const toAddress = "addr_test1qrukmjv57f6ut5e3ak0nxpnh9d8lp30xhyt0wnk39znanyxv506uj3pfgn2j4ea8he9w6d54s0ndgrgjc8z0jr8d66fsps407a";
const tx = await sendAdaWithDatum(toAddress, datum, 1n);

//------------------------------------ 

//3. Send native tokens
// const toAddress = "addr_test1qrukmjv57f6ut5e3ak0nxpnh9d8lp30xhyt0wnk39znanyxv506uj3pfgn2j4ea8he9w6d54s0ndgrgjc8z0jr8d66fsps407a";
// // f627b76ea7da6603681213a77c7274d312f20d394c14c866c0a85e9f -> Pham Trong Nghia_005 -> OK
// // 142900b54ce8146b705ef4751453992b96de560f24ea3faeaec786dd -> Phạm Trọng Nghĩa -> Tên tiếng Việt sẽ gây lỗi
// const tx = await sendNativeTokens(toAddress, "f627b76ea7da6603681213a77c7274d312f20d394c14c866c0a85e9f", "Pham Trong Nghia_005", 1n);



let signedTx = await tx.sign().commit();
let txHash = await signedTx.submit();
console.log(`Transaction hash: https://preview.cexplorer.io/tx/${txHash}`);

Deno.exit(0);