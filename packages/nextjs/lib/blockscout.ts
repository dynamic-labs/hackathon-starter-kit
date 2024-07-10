// Learn more about blockscout APIs: https://base-sepolia.blockscout.com/api-docs

export interface TransactionDetails {
  timestamp: string;
  fee: {
    type: string;
    value: string;
  };
  gas_limit: string;
  l1_gas_price: string;
  block: number;
  status: string;
  method: string;
  confirmations: number;
  type: number;
  l1_fee_scalar: string;
  to: {
    hash: string;
    implementations: any[];
    is_contract: boolean;
    is_verified: boolean;
    private_tags: any[];
    public_tags: any[];
    watchlist_names: any[];
  };
  tx_burnt_fee: string;
  max_fee_per_gas: string;
  result: string;
  hash: string;
  op_withdrawals: any[];
  gas_price: string;
  priority_fee: string;
  base_fee_per_gas: string;
  from: {
    hash: string;
    implementations: any[];
    is_contract: boolean;
    is_verified: boolean;
    private_tags: any[];
    public_tags: any[];
    watchlist_names: any[];
  };
  token_transfers: any[];
  tx_types: string[];
  l1_gas_used: string;
  gas_used: string;
  position: number;
  nonce: number;
  has_error_in_internal_txs: boolean;
  actions: any[];
  l1_fee: string;
  raw_input: string;
  value: string;
  max_priority_fee_per_gas: string;
  confirmation_duration: number[];
}

export const getTransactionOnBaseSepoliaByHash = async (txHash: string): Promise<TransactionDetails> => {
  const response = await fetch(`https://base-sepolia.blockscout.com/api/v2/transactions/${txHash}`);
  return response.json();
};

export const getTokenTransfersOnBaseSepolia = async (address: string) => {
  const response = await fetch(`https://base-sepolia.blockscout.com/api/v2/addresses/${address}/token-transfers?type=`);
  const json = await response.json();
  return json.items;
};

export const getTransactionsOnBaseSepolia = async (address: string) => {
  const response = await fetch(`https://base-sepolia.blockscout.com/api/v2/addresses/${address}/transactions`);
  const json = await response.json();
  return json.items;
};
