#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Address};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResaleListing {
    pub seller: Address,
    pub base_price: u64,
    pub reputation_score_at_listing: u32,
    pub active: bool,
}

#[contract]
pub struct SecondaryMarket;

#[contractimpl]
impl SecondaryMarket {
    pub fn list_for_resale(
        env: Env, 
        seller: Address, 
        token_id: u64, 
        base_price: u64, 
        reputation_score: u32
    ) {
        seller.require_auth();
        
        let listing = ResaleListing {
            seller,
            base_price,
            reputation_score_at_listing: reputation_score,
            active: true,
        };
        
        env.storage().persistent().set(&token_id, &listing);
    }
    
    pub fn get_dynamic_price(env: Env, token_id: u64, current_reputation_score: u32) -> u64 {
        let listing: ResaleListing = env.storage().persistent().get(&token_id).unwrap();
        if !listing.active {
            panic!("Listing not active");
        }
        
        // Simple dynamic pricing: higher reputation = lower risk = higher price (closer to par value)
        // Let's assume a multiplier based on score. 
        // 100 score -> 100% of base price
        // 50 score -> 75% of base price
        // We use a basic formula: price = base_price * (50 + current_reputation_score / 2) / 100
        
        let multiplier = 50 + (current_reputation_score / 2);
        (listing.base_price * multiplier as u64) / 100
    }
    
    pub fn buy_resale(env: Env, buyer: Address, token_id: u64) {
        buyer.require_auth();
        let mut listing: ResaleListing = env.storage().persistent().get(&token_id).unwrap();
        if !listing.active {
            panic!("Listing not active");
        }
        listing.active = false;
        env.storage().persistent().set(&token_id, &listing);
        // Note: token transfer logic and payment would be handled via cross-contract calls
    }
    
    pub fn get_listing(env: Env, token_id: u64) -> ResaleListing {
        env.storage().persistent().get(&token_id).unwrap()
    }
}
