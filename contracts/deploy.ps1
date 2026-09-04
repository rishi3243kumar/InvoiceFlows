$contracts = @("invoice_registry", "reputation_score", "invoice_token", "escrow_settlement", "secondary_market")
foreach ($contract in $contracts) {
    echo "Deploying $contract..."
    stellar contract deploy --wasm target/wasm32-unknown-unknown/release/${contract}.wasm --source deployer --network testnet
}
