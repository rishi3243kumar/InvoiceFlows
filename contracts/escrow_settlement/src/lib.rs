#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Address};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Escrow {
    pub investor: Address,
    pub freelancer: Address,
    pub amount: u64,
    pub is_funded: bool,
    pub is_released: bool,
    pub is_settled: bool,
}

#[contract]
pub struct EscrowSettlement;

#[contractimpl]
impl EscrowSettlement {
    pub fn fund_escrow(
        env: Env,
        investor: Address,
        freelancer: Address,
        token_id: u64,
        amount: u64,
    ) {
        investor.require_auth();
        
        let escrow = Escrow {
            investor,
            freelancer,
            amount,
            is_funded: true,
            is_released: false,
            is_settled: false,
        };
        
        env.storage().persistent().set(&token_id, &escrow);
        // In a real app we'd interact with a stablecoin token contract to hold funds.
    }
    
    pub fn release_to_freelancer(env: Env, token_id: u64) {
        let mut escrow: Escrow = env.storage().persistent().get(&token_id).unwrap();
        if !escrow.is_funded {
            panic!("Not funded");
        }
        if escrow.is_released {
            panic!("Already released");
        }
        escrow.is_released = true;
        env.storage().persistent().set(&token_id, &escrow);
        // In a real app we'd transfer stablecoin to the freelancer here.
    }

    pub fn settle(env: Env, token_id: u64, _paid: bool) {
        let mut escrow: Escrow = env.storage().persistent().get(&token_id).unwrap();
        if escrow.is_settled {
            panic!("Already settled");
        }
        escrow.is_settled = true;
        env.storage().persistent().set(&token_id, &escrow);
        
        // In a real app, this would route principal + yield to investor on `paid == true`
        // It would also call ReputationScore::update_score using cross-contract call.
        // We handle that in the UI flow for MVP simplicity unless strict cross-contract is required.
    }
    
    pub fn get_escrow(env: Env, token_id: u64) -> Escrow {
        env.storage().persistent().get(&token_id).unwrap()
    }
}
