#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Address, BytesN};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceTokenData {
    pub invoice_hash: BytesN<32>,
    pub risk_score: u32,
    pub owner: Address,
    pub minted: bool,
}

#[contract]
pub struct InvoiceToken;

#[contractimpl]
impl InvoiceToken {
    pub fn mint_token(
        env: Env,
        caller: Address,
        invoice_hash: BytesN<32>,
        risk_score: u32,
    ) -> u64 {
        caller.require_auth();
        
        // In a real app we'd call the invoice_registry contract to ensure it's registered 
        // and check a verification flag. We will simulate that state here for MVP by just minting.
        
        // Use a simple counter for token IDs
        let mut count: u64 = env.storage().persistent().get(&soroban_sdk::symbol_short!("count")).unwrap_or(0);
        count += 1;
        env.storage().persistent().set(&soroban_sdk::symbol_short!("count"), &count);
        
        let token_data = InvoiceTokenData {
            invoice_hash,
            risk_score,
            owner: caller,
            minted: true,
        };
        
        env.storage().persistent().set(&count, &token_data);
        count
    }
    
    pub fn get_token(env: Env, token_id: u64) -> InvoiceTokenData {
        env.storage().persistent().get(&token_id).unwrap()
    }
    
    pub fn transfer(env: Env, from: Address, to: Address, token_id: u64) {
        from.require_auth();
        let mut token: InvoiceTokenData = env.storage().persistent().get(&token_id).unwrap();
        if token.owner != from {
            panic!("Not the owner");
        }
        token.owner = to;
        env.storage().persistent().set(&token_id, &token);
    }
}
