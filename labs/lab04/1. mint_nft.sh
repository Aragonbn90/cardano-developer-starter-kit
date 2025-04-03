#2-Tạo thư mục và Policy
mkdir policy
cardano-cli address key-gen \
    --verification-key-file policy/policy.vkey \
    --signing-key-file policy/policy.skey

touch policy/policy.script && echo "" > policy/policy.script

# {
#   "type": "all",
#   "scripts": [
#     {
#       "type": "before",
#       "slot": 100000000  // Thay đổi thành slot mong muốn (lấy từ cardano-cli query tip)
#     },
#     {
#       "type": "sig",
#       "keyHash": "YOUR_PAYMENT_KEY_HASH"
#     }
#   ]
# }
echo "{" >> policy/policy.script
echo "  \"type\": \"all\"," >> policy/policy.script
echo "  \"scripts\": [" >> policy/policy.script
echo "      {" >> policy/policy.script
echo "          \"type\": \"before\"," >> policy/policy.script
echo "          \"slot\": 100000000" >> policy/policy.script
echo "      }," >> policy/policy.script
echo "      {" >> policy/policy.script
echo "          \"type\": \"sig\"," >> policy/policy.script        
echo "          \"keyHash\": \"$(cardano-cli address key-hash --payment-verification-key-file policy/policy.vkey)\"" >> policy/policy.script
echo "      }" >> policy/policy.script
echo "  ]" >> policy/policy.script
echo "}" >> policy/policy.script

# echo "{" >> policy/policy.script
# echo "  \"type\": \"sig\"," >> policy/policy.script        
# echo "  \"keyHash\": \"$(cardano-cli address key-hash --payment-verification-key-file policy/policy.vkey)\"" >> policy/policy.script
# echo "}" >> policy/policy.script

cardano-cli conway transaction policyid --script-file ./policy/policy.script > policy/policyID
POLICYID=$(cat policy/policyID)

## Chọn utxo thực hiện giao dịch
cardano-cli query utxo --address $ADDRESS $TESTNET
# fbca4d87b3ded332983250f768c8c1340a7ffe74c9d4ee4ac87da57f402ecabc     1        4996816899 lovelace + TxOutDatumNone
UTXO_IN="fbca4d87b3ded332983250f768c8c1340a7ffe74c9d4ee4ac87da57f402ecabc#1"

REAL_TOKEN_NAME_01="Pham Trong Nghia_005"
REAL_TOKEN_NAME_02="Pham Trong Nghia_005_02"
TOKEN_NAME_01=$(echo -n $REAL_TOKEN_NAME_01 | xxd -b -ps -c 80 | tr -d '\n')
TOKEN_NAME_02=$(echo -n $REAL_TOKEN_NAME_02 | xxd -b -ps -c 80 | tr -d '\n')
IPFS_HASH_01="QmTPoBBis8n6EmkQv554DHZMjgECycb6mrTsAMBbFrnSNX"
IPFS_HASH_02="QmS8dzMBYznWZmgbY5rtWtmpzYxYpT76KAZzE2Y8vsQSYf"

#4-Tạo metadata

echo "{" >> 721-metadata.json
echo "  \"721\": {" >> 721-metadata.json
echo "    \"$(cat policy/policyID)\": {" >> 721-metadata.json
echo "      \"$(echo $REAL_TOKEN_NAME_01)\": {" >> 721-metadata.json
echo "        \"class\": \"C2VN_BK02\"," >> 721-metadata.json
echo "        \"name\": \"Phạm Trọng Nghĩa\"," >> 721-metadata.json
echo "        \"student_no\": \"005\"," >> 721-metadata.json
echo "        \"meta_version\": \"1\"," >> 721-metadata.json
echo "        \"image\": \"ipfs://$(echo $IPFS_HASH_01)\"," >> 721-metadata.json
echo "        \"mediaType\": \"image/jpg\"," >> 721-metadata.json
echo "        \"module\": \"module 1- CLI\"" >> 721-metadata.json
echo "      }," >> 721-metadata.json
echo "      \"$(echo $REAL_TOKEN_NAME_02)\": {" >> 721-metadata.json
echo "        \"class\": \"C2VN_BK02\"," >> 721-metadata.json
echo "        \"name\": \"Phạm Trọng Nghĩa\"," >> 721-metadata.json
echo "        \"student_no\": \"005\"," >> 721-metadata.json  
echo "        \"meta_version\": \"2\"," >> 721-metadata.json
echo "        \"image\": \"ipfs://$(echo $IPFS_HASH_02)\"," >> 721-metadata.json
echo "        \"mediaType\": \"image/png\"," >> 721-metadata.json
echo "        \"module\": \"module 1- CLI\"" >> 721-metadata.json
echo "      }" >> 721-metadata.json
echo "    }" >> 721-metadata.json
echo "  }" >> 721-metadata.json
echo "}" >> 721-metadata.json

# echo "{" >> 721-metadata.json
# echo "  \"721\": {" >> 721-metadata.json
# echo "    \"$(cat policy/policyID)\": {" >> 721-metadata.json
# echo "      \"$(echo $REAL_TOKEN_NAME_01)\": {" >> 721-metadata.json
# echo "        \"class\": \"C2VN_BK02\"," >> 721-metadata.json
# echo "        \"name\": \"Phạm Trọng Nghĩa\"," >> 721-metadata.json
# echo "        \"student_no\": \"005\"," >> 721-metadata.json
# echo "        \"meta_version\": \"1\"," >> 721-metadata.json
# echo "        \"image\": \"ipfs://$(echo $IPFS_HASH_01)\"," >> 721-metadata.json
# echo "        \"mediaType\": \"image/jpg\"," >> 721-metadata.json
# echo "        \"module\": \"module 1- CLI\"" >> 721-metadata.json
# echo "      }" >> 721-metadata.json
# echo "    }" >> 721-metadata.json
# echo "  }" >> 721-metadata.json
# echo "}" >> 721-metadata.json

#4-Tạo giao dịch
cardano-cli conway transaction build \
$TESTNET \
--tx-in $UTXO_IN \
--tx-out "$ADDRESS+1500000 + 1 $POLICYID.$TOKEN_NAME_01 + 1 $POLICYID.$TOKEN_NAME_02" \
--mint "1 $POLICYID.$TOKEN_NAME_01 + 1 $POLICYID.$TOKEN_NAME_02" \
--mint-script-file policy/policy.script \
--change-address $ADDRESS \
--metadata-json-file 721-metadata.json  \
--out-file mint-nft.raw

# cardano-cli conway transaction build \
# $TESTNET \
# --tx-in $UTXO_IN \
# --tx-out $ADDRESS+15000000+" 1 $POLICYID.$TOKEN_NAME_01" \
# --mint "1 $POLICYID.$TOKEN_NAME_01" \
# --mint-script-file policy/policy.script \
# --change-address $ADDRESS \
# --metadata-json-file 721-metadata.json  \
# --out-file mint-nft.raw


#5-Tạo ký giao dịch
echo $POLICYID.$TOKEN_NAME >policy_token.log

cardano-cli conway transaction sign  $TESTNET \
--signing-key-file $ADDRESS_SKEY  \
--signing-key-file policy/policy.skey  \
--tx-body-file mint-nft.raw \
--out-file mint-nft.signed

#5-Gửi giao dịch 

cardano-cli conway transaction submit $TESTNET --tx-file mint-nft.signed 