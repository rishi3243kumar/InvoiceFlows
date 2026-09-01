#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Address, BytesN, String, xdr::ToXdr};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceParams {
    pub client_id: String,
    pub amount: u64,
    pub due_date: u64,
    pub freelancer_address: Address,
}

#[contract]
pub struct InvoiceRegistry;

#[contractimpl]
impl InvoiceRegistry {
    pub fn submit_invoice(
        env: Env,
        client_id: String,
        amount: u64,
        due_date: u64,
        freelancer_address: Address,
    ) -> BytesN<32> {
        freelancer_address.require_auth();

        let mut hash_data = soroban_sdk::Bytes::new(&env);
        // Convert string to bytes safely in Soroban by taking length and slicing or to_xdr
        hash_data.append(&client_id.clone().to_xdr(&env));
        
        let mut amount_bytes = soroban_sdk::Bytes::new(&env);
        amount_bytes.extend_from_array(&amount.to_be_bytes());
        hash_data.append(&amount_bytes);

        let mut date_bytes = soroban_sdk::Bytes::new(&env);
        date_bytes.extend_from_array(&due_date.to_be_bytes());
        hash_data.append(&date_bytes);
        
        hash_data.append(&freelancer_address.clone().to_xdr(&env));

        let invoice_hash_obj = env.crypto().sha256(&hash_data);
        let invoice_hash: BytesN<32> = invoice_hash_obj.into();

        if env.storage().persistent().has(&invoice_hash) {
            panic!("Invoice already exists");
        }

        let invoice = InvoiceParams {
            client_id,
            amount,
            due_date,
            freelancer_address,
        };

        env.storage().persistent().set(&invoice_hash, &invoice);
        invoice_hash
    }

    pub fn is_registered(env: Env, invoice_hash: BytesN<32>) -> bool {
        env.storage().persistent().has(&invoice_hash)
    }
}
