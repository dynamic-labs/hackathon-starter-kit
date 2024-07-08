export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

export const ERC20_CROSSCHAIN_TRANSFER_ABI = [
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destinationChainSelector",
        type: "uint64",
      },
    ],
    name: "DestinationChainNotAllowlisted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "FailedToWithdrawEth",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidReceiverAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "currentBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "calculatedFees",
        type: "uint256",
      },
    ],
    name: "NotEnoughBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "NothingToWithdraw",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "destinationChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "feeToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fees",
        type: "uint256",
      },
    ],
    name: "TokensTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_destinationChainSelector",
        type: "uint64",
      },
      {
        internalType: "bool",
        name: "allowed",
        type: "bool",
      },
    ],
    name: "allowlistDestinationChain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_destinationChainSelector",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transferTokensPayLINK",
    outputs: [
      {
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_destinationChainSelector",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transferTokensPayNative",
    outputs: [
      {
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "withdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "address",
        name: "_link",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "allowlistedChains",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
