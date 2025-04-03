# Tìm utxo chứa nft/tokens
cardano-cli query utxo $TESTNET --address $ADDRESS
# 8386058f53be2911c3732e6892ead469401ab6526979ac54d9d31d6991dc237b     0        15000000 lovelace + 1 9ff62db59402da5aff8610358bef16b384d7104d502c0da4b98b1da9.5068616d2054726f6e67204e676869615f303035 + TxOutDatumNone
# nft số 2: 1116b6968fef9c8e3b1baf05ccc2ccadaab547edcbd22d66782134b9cddc82ac     0        1500000 lovelace + 1 142900b54ce8146b705ef4751453992b96de560f24ea3faeaec786dd.5068616d2054726f6e67204e676869615f303035 + TxOutDatumNone
# Lấy phí ở: fbca4d87b3ded332983250f768c8c1340a7ffe74c9d4ee4ac87da57f402ecabc     4        1249250000 lovelace + TxOutDatumNone
#chỉnh sửa lại giá trị các biến
BOB_ADDR="addr_test1qz3vhmpcm2t25uyaz0g3tk7hjpswg9ud9am4555yghpm3r770t25gsqu47266lz7lsnl785kcnqqmjxyz96cddrtrhnsdzl228"
VALUE=1500000
UTXO_IN_NFT=8386058f53be2911c3732e6892ead469401ab6526979ac54d9d31d6991dc237b#0
UTXO_IN_FEE=fbca4d87b3ded332983250f768c8c1340a7ffe74c9d4ee4ac87da57f402ecabc#4

# B1. Xây dựng giao dịch (Build Tx)


cardano-cli conway transaction build $TESTNET \
--tx-in $UTXO_IN_NFT \
--tx-in $UTXO_IN_FEE \
--tx-out $BOB_ADDR+$VALUE+"1 9ff62db59402da5aff8610358bef16b384d7104d502c0da4b98b1da9.5068616d2054726f6e67204e676869615f303035" \
--change-address $ADDRESS \
--metadata-json-file 674-metadata.json \
--out-file send-nft.raw

# B2. Ký giao dịch (Sign Tx)

cardano-cli conway transaction sign $TESTNET \
--signing-key-file $ADDRESS_SKEY \
--tx-body-file send-nft.raw \
--out-file send-nft.signed

# B3. Gửi giao dịch (Submit Tx)

cardano-cli conway transaction submit $TESTNET \
--tx-file send-nft.signed

