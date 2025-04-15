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

const seed = Deno.env.get("MNEMONIC");
lucid.selectWalletFromSeed(seed, { addressType: "Base", index: 0 });
// console.log(lucid);

//scripts alwaysSucceed 
const alwaysSucceed_scripts1 = lucid.newScript({
    type: "PlutusV2",
    script: "49480100002221200101",
});
const alwaysSucceed_scripts = lucid.newScript({
    type: "PlutusV3",
    script: "588501010029800aba2aba1aab9faab9eaab9dab9a48888896600264653001300700198039804000cc01c0092225980099b8748008c01cdd500144c8cc896600266e1d2000300a375400d132325980098080014528c5900e1bae300e001300b375400d16402460160026016601800260106ea800a2c8030600e00260066ea801e29344d9590011",
});

const alwaysSucceedAddress = alwaysSucceed_scripts.toAddress();
console.log(`Always succeed address: ${alwaysSucceedAddress}`);

const Datum = () => Data.void();
// const Redeemer = () => Data.void();
// Định nghĩa cấu trúc Redeemer
const RedeemerSchema = Data.Object({
    msg: Data.Bytes, // msg là một ByteArray
});

// Tạo một Redeemer với giá trị cụ thể
const Redeemer = () => Data.to({ msg: fromText("Hello from NghiaPT") }, RedeemerSchema); // "48656c6c6f20576f726c64" là chuỗi "Hello World" được mã hóa dưới dạng hex
const lovelace_lock = 100_100_005n

// Lock UTxO
export async function lockUtxo(lovelace: bigint,): Promise<string> {
    const tx = await lucid
        .newTx()
        .payToContract(alwaysSucceedAddress, { Inline: Datum() }, { lovelace })
        .commit();

    const signedTx = await tx.sign().commit();
    console.log(signedTx);

    const txHash = await signedTx.submit();

    return txHash;
}

// Mở khóa UTxO
export async function unlockUtxo(lovelace: bigint): Promise<string> {

    const utxo = (await lucid.utxosAt(alwaysSucceedAddress)).find((utxo) =>
        utxo.assets.lovelace == lovelace && utxo.datum === Datum() && !utxo.scriptRef
    );
    console.log(utxo);
    if (!utxo) throw new Error("No UTxO with lovelace > 1000 found");
    const tx = await lucid
        .newTx()
        .collectFrom([utxo], Redeemer())
        .attachScript(alwaysSucceed_scripts)
        .commit();

    const signedTx = await tx.sign().commit();

    const txHash = await signedTx.submit();

    return txHash;
}

async function main() {
    try {
        // const txHash = await lockUtxo(lovelace_lock); // Khóa 2 ADA (2_000_000 lovelace)
        // console.log(`Transaction hash: ${txHash}`);

        // Gọi hàm redeemUtxo để mở khóa UTxO
        const redeemTxHash = await unlockUtxo(lovelace_lock);
        console.log(`Transaction hash: ${redeemTxHash}`);


    } catch (error) {
        console.error("Error locking UTxO:", error);
    }
}

main();
