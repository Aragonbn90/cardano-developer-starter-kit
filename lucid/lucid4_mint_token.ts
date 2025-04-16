import { Blockfrost, Lucid, Addresses, fromText } from "https://deno.land/x/lucid/mod.ts";
import "jsr:@std/dotenv/load";

// Lấy các biến từ env
const Bob_mnonic = Deno.env.get("MNEMONIC");
const BLOCKFROST_ID = Deno.env.get("BLOCKFROST_ID");
const BLOCKFROST_NETWORK = Deno.env.get("BLOCKFROST_NETWORK")

const lucid = new Lucid({
    provider: new Blockfrost(
        BLOCKFROST_NETWORK,
        BLOCKFROST_ID,
    ),
});
lucid.selectWalletFromSeed(Bob_mnonic);

// Soan thao miniting policy
const { payment } = Addresses.inspect(
    await lucid.wallet.address(),
);

console.log(`Địa chỉ Payment là: ${payment.hash}`);

const mintingPolicy = lucid.newScript(
    {
        type: "All",
        scripts: [
            { type: "Sig", keyHash: payment.hash },
            {
                type: "Before",
                slot: lucid.utils.unixTimeToSlots(Date.now() + 1000000),
            },
        ],
    },
);

const policyId = mintingPolicy.toHash();
const token_name = "LUCID_04"
const unit = policyId + fromText(token_name);
console.log(`PolicyID là: ${policyId}`);

const metadata = {
    [policyId]: {
        [token_name]: {
            "description": "This is NFT minted by LUCID",
            "name": `${token_name}`,
            "id": 1,
            "image": "ipfs://QmRE3Qnz5Q8dVtKghL4NBhJBH4cXPwfRge7HMiBhK92SJX"
        }
    }
};

console.log(metadata);
const tx = await lucid.newTx()
    .mint({ [unit]: 1n })
    .validTo(Date.now() + 200000)
    .attachScript(mintingPolicy)
    .attachMetadata(721, metadata)
    .commit();

const signedTx = await tx.sign().commit();
const txHash = await signedTx.submit();
console.log(signedTx);
console.log(`Bạn có thể kiểm tra giao dịch tại: https://preview.cexplorer.io/tx/${txHash}`);