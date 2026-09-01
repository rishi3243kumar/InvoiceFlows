#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Address};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RepData {
    pub total_repayments: u32,
    pub total_defaults: u32,
    pub score: u32,
}

#[contracttype]
pub enum Outcome {
    Paid,
    Defaulted,
}

#[contract]
pub struct ReputationScore;

#[contractimpl]
impl ReputationScore {
    pub fn get_score(env: Env, user: Address) -> u32 {
        let data = Self::get_data(env, user);
        data.score
    }

    pub fn update_score(env: Env, user: Address, outcome: Outcome) {
        // In a real app, only authorized escrows can call this. For MVP, we'll allow it.
        let mut data = Self::get_data(env.clone(), user.clone());
        
        match outcome {
            Outcome::Paid => data.total_repayments += 1,
            Outcome::Defaulted => data.total_defaults += 1,
        }
        
        data.score = Self::calculate_score(data.total_repayments, data.total_defaults);
        env.storage().persistent().set(&user, &data);
    }

    fn get_data(env: Env, user: Address) -> RepData {
        env.storage().persistent().get(&user).unwrap_or(RepData {
            total_repayments: 0,
            total_defaults: 0,
            score: 50, // Neutral starting score
        })
    }

    fn calculate_score(repayments: u32, defaults: u32) -> u32 {
        let total = repayments + defaults;
        if total == 0 {
            return 50;
        }
        // Base formula: 50 + (repayments * 50) / total - (defaults * 50) / total
        let mut score: i32 = 50 + (repayments as i32 * 50) / total as i32 - (defaults as i32 * 50) / total as i32;
        if score > 100 { score = 100; }
        if score < 0 { score = 0; }
        score as u32
    }
}
