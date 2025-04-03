
#================= Burn token vừa tạo=============
#1-Truy vấn token nằm ở UTXO nào
cardano-cli query utxo $TESTNET --address $ADDRESS 

#2- cập nhật biến môi trường
txhash="5a4925b330916e62307766802f5af4ce8b234c27de8271a901086c08733da0f1"
txix="0"
burnoutput="1400000"

#3-Tạo giao dịch
cardano-cli conway transaction build \
 --testnet-magic 2\
 --tx-in $txhash#$txix\
 --tx-in f5aaf503fdc5d6b7535fe06acf9e1106bb07df16701cd776232d3d530073c963#1\
 --tx-out $ADDRESS+$burnoutput\
 --mint="-1 $POLICYID.$TOKEN_NAME"\
 --minting-script-file policy/policy.script \
 --change-address $ADDRESS \
 --witness-override 2\
 --out-file burning.raw

#4-Ký giao dịch
cardano-cli conway transaction sign  $TESTNET \
--signing-key-file $ADDRESS_SKEY  \
--signing-key-file policy/policy.skey  \
--tx-body-file burning.raw \
--out-file burning.signed

#5-Gửi giao dịch

cardano-cli conway transaction submit $TESTNET --tx-file burning.signed 