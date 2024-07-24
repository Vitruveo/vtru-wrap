import { Chain, Vitruveo } from "@thirdweb-dev/chains";

export const VITRUVEO_CHAIN: Chain = Vitruveo;
export const WRAP_CONTRACT: string = "0xC0C0A38067Ba977676AB4aFD9834dB030901bE2d";

export const WRAP_CONTRACT_ABI: string = `[
	{
		"type": "constructor",
		"stateMutability": "nonpayable",
		"inputs": [

		]
	},
	{
		"type": "event",
		"name": "Approval",
		"inputs": [
			{
				"type": "address",
				"name": "owner",
				"internalType": "address",
				"indexed": true
			},
			{
				"type": "address",
				"name": "spender",
				"internalType": "address",
				"indexed": true
			},
			{
				"type": "uint256",
				"name": "value",
				"internalType": "uint256",
				"indexed": false
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Transfer",
		"inputs": [
			{
				"type": "address",
				"name": "from",
				"internalType": "address",
				"indexed": true
			},
			{
				"type": "address",
				"name": "to",
				"internalType": "address",
				"indexed": true
			},
			{
				"type": "uint256",
				"name": "value",
				"internalType": "uint256",
				"indexed": false
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Unwrap",
		"inputs": [
			{
				"type": "address",
				"name": "account",
				"internalType": "address",
				"indexed": true
			},
			{
				"type": "uint256",
				"name": "totalAmount",
				"internalType": "uint256",
				"indexed": false
			},
			{
				"type": "uint256",
				"name": "amount",
				"internalType": "uint256",
				"indexed": false
			},
			{
				"type": "uint256",
				"name": "rebaseAmount",
				"internalType": "uint256",
				"indexed": false
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Wrap",
		"inputs": [
			{
				"type": "address",
				"name": "account",
				"internalType": "address",
				"indexed": true
			},
			{
				"type": "uint256",
				"name": "amount",
				"internalType": "uint256",
				"indexed": false
			}
		],
		"anonymous": false
	},
	{
		"type": "function",
		"stateMutability": "view",
		"outputs": [
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			}
		],
		"name": "allowance",
		"inputs": [
			{
				"type": "address",
				"name": "owner",
				"internalType": "address"
			},
			{
				"type": "address",
				"name": "spender",
				"internalType": "address"
			}
		]
	},
	{
		"type": "function",
		"stateMutability": "nonpayable",
		"outputs": [
			{
				"type": "bool",
				"name": "",
				"internalType": "bool"
			}
		],
		"name": "approve",
		"inputs": [
			{
				"type": "address",
				"name": "spender",
				"internalType": "address"
			},
			{
				"type": "uint256",
				"name": "amount",
				"internalType": "uint256"
			}
		]
	},
	{
		"type": "function",
		"stateMutability": "view",
		"outputs": [
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			}
		],
		"name": "balanceOf",
		"inputs": [
			{
				"type": "address",
				"name": "account",
				"internalType": "address"
			}
		]
	},
	{
		"type": "function",
		"stateMutability": "view",
		"outputs": [
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			},
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			},
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			}
		],
		"name": "balances",
		"inputs": [

		]
	},
	{
		"type": "function",
		"stateMutability": "view",
		"outputs": [
			{
				"type": "uint8",
				"name": "",
				"internalType": "uint8"
			}
		],
		"name": "decimals",
		"inputs": [

		]
	},
	{
		"type": "function",
		"stateMutability": "nonpayable",
		"outputs": [
			{
				"type": "bool",
				"name": "",
				"internalType": "bool"
			}
		],
		"name": "decreaseAllowance",
		"inputs": [
			{
				"type": "address",
				"name": "spender",
				"internalType": "address"
			},
			{
				"type": "uint256",
				"name": "subtractedValue",
				"internalType": "uint256"
			}
		]
	},
	{
		"type": "function",
		"stateMutability": "payable",
		"outputs": [

		],
		"name": "deposit",
		"inputs": [

		]
	},
	{
		"type": "function",
		"stateMutability": "nonpayable",
		"outputs": [
			{
				"type": "bool",
				"name": "",
				"internalType": "bool"
			}
		],
		"name": "increaseAllowance",
		"inputs": [
			{
				"type": "address",
				"name": "spender",
				"internalType": "address"
			},
			{
				"type": "uint256",
				"name": "addedValue",
				"internalType": "uint256"
			}
		]
	},
	{
		"type": "function",
		"stateMutability": "view",
		"outputs": [
			{
				"type": "string",
				"name": "",
				"internalType": "string"
			}
		],
		"name": "name",
		"inputs": [

		]
	},
	{
		"type": "function",
		"stateMutability": "view",
		"outputs": [
			{
				"type": "string",
				"name": "",
				"internalType": "string"
			}
		],
		"name": "symbol",
		"inputs": [

		]
	},
	{
		"type": "function",
		"stateMutability": "view",
		"outputs": [
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			}
		],
		"name": "totalSupply",
		"inputs": [

		]
	},
	{
		"type": "function",
		"stateMutability": "nonpayable",
		"outputs": [
			{
				"type": "bool",
				"name": "",
				"internalType": "bool"
			}
		],
		"name": "transfer",
		"inputs": [
			{
				"type": "address",
				"name": "to",
				"internalType": "address"
			},
			{
				"type": "uint256",
				"name": "amount",
				"internalType": "uint256"
			}
		]
	},
	{
		"type": "function",
		"stateMutability": "nonpayable",
		"outputs": [
			{
				"type": "bool",
				"name": "",
				"internalType": "bool"
			}
		],
		"name": "transferFrom",
		"inputs": [
			{
				"type": "address",
				"name": "from",
				"internalType": "address"
			},
			{
				"type": "address",
				"name": "to",
				"internalType": "address"
			},
			{
				"type": "uint256",
				"name": "amount",
				"internalType": "uint256"
			}
		]
	},
	{
		"type": "function",
		"stateMutability": "nonpayable",
		"outputs": [
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			},
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			},
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			}
		],
		"name": "unwrap",
		"inputs": [
			{
				"type": "uint256",
				"name": "amount",
				"internalType": "uint256"
			}
		]
	},
	{
		"type": "function",
		"stateMutability": "nonpayable",
		"outputs": [
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			},
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			},
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			}
		],
		"name": "unwrapAll",
		"inputs": [

		]
	},
	{
		"type": "function",
		"stateMutability": "payable",
		"outputs": [
			{
				"type": "uint256",
				"name": "",
				"internalType": "uint256"
			}
		],
		"name": "wrap",
		"inputs": [

		]
	}
]`;