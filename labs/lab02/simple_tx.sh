
testnet="--testnet-magic 2"
address=$(cat base.addr)
address_skey="payment.skey"
cardano-cli query utxo $testnet --address $address

#chỉnh sửa lại giá trị các biến
##BOB_ADDR="addr_test1qz8shh6wqssr83hurdmqx44js8v7tglg9lm3xh89auw007dd38kf3ymx9c2w225uc7yjmplr794wvc96n5lsy0wsm8fq9n5epq"
BOB_ADDR="addr_test1qz3vhmpcm2t25uyaz0g3tk7hjpswg9ud9am4555yghpm3r770t25gsqu47266lz7lsnl785kcnqqmjxyz96cddrtrhnsdzl228"
VALUE=1000000

UTXO_IN=1f4b385cbb761f2bb73bc919d0d14f4f773f7000b98490c6dfa843904dd012e3#0

# B1. Xây dựng giao dịch (Build Tx)


cardano-cli conway transaction build $testnet \
--tx-in $UTXO_IN \
--tx-out $BOB_ADDR+$VALUE \
--change-address $address \
--out-file simple-tx.raw

# B2. Ký giao dịch (Sign Tx)

cardano-cli conway transaction sign $testnet \
--signing-key-file $address_skey \
--tx-body-file simple-tx.raw \
--out-file simple-tx.signed

# B3. Gửi giao dịch (Submit Tx)

cardano-cli conway transaction submit $testnet \
--tx-file simple-tx.signed

