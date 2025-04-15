import { Blockfrost, Lucid, Crypto, fromText, Addresses, Data } from "https://deno.land/x/lucid/mod.ts";

// Provider selection
// There are multiple builtin providers you can choose from in Lucid.

// Blockfrost

const lucid = new Lucid({
    provider: new Blockfrost(
        "https://cardano-preview.blockfrost.io/api/v0",
        "previewcvzl4VvZO1u4DvMQiCCZkpU2oWplOhlg",
    ),
});

const seed = "essence until trust permit ritual egg range keen timber clap agent adjust glimpse burst garlic leaf floor female bus egg toe grow reopen moral"
lucid.selectWalletFromSeed(seed, { addressType: "Base", index: 0 });
// console.log(lucid);

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

async function createSendAdaWithDatum(toAddress: string, datum: any, amount: bigint) {
    const tx = await lucid.newTx()
        .payToWithData(toAddress, datum, { lovelace: amount })
        .commit();
    return tx;
}

async function createSendNativeTokens(toAddress: string, policyId: string, assetName: string, amount: bigint) {
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
const tx = await createSendAdaWithDatum(toAddress, datum, 1n);

//------------------------------------ 

//3. Send native tokens
// const toAddress = "addr_test1qrukmjv57f6ut5e3ak0nxpnh9d8lp30xhyt0wnk39znanyxv506uj3pfgn2j4ea8he9w6d54s0ndgrgjc8z0jr8d66fsps407a";
// // f627b76ea7da6603681213a77c7274d312f20d394c14c866c0a85e9f -> Pham Trong Nghia_005 -> OK
// // 142900b54ce8146b705ef4751453992b96de560f24ea3faeaec786dd -> Phạm Trọng Nghĩa -> Tên tiếng Việt sẽ gây lỗi
// const tx = await createSendNativeTokens(toAddress, "f627b76ea7da6603681213a77c7274d312f20d394c14c866c0a85e9f", "Pham Trong Nghia_005", 1n);



let signedTx = await tx.sign().commit();
let txHash = await signedTx.submit();
console.log(`Transaction hash: https://preview.cexplorer.io/tx/${txHash}`);

Deno.exit(0);