#0-Cài đặt xxd nếu chưa có
apt upgrade
apt update
apt install xxd


#1-Tạo payment.skey
cardano-address key child 1852H/1815H/0H/0/0 < ../../root.xsk > payment.xsk
cardano-address key public --without-chain-code < payment.xsk > payment.xvk
cardano-cli key convert-cardano-address-key --shelley-payment-key \
                                            --signing-key-file payment.xsk \
                                            --out-file payment.skey
cardano-cli key verification-key --signing-key-file payment.skey \
                                 --verification-key-file payment.vkey    

#3-Tạo biến môi trường
TESTNET="--testnet-magic 2"
ADDRESS=$(cat base.addr)
ADDRESS_SKEY="payment.skey"