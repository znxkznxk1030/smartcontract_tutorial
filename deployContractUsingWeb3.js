const fs = require('fs'),
      solc = require('solc');

let Web3 = require('web3');

const providerUrl = 'http://localhost';
const providerPort = 8800;

if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
} else {
        web3 = new Web3(new Web3.providers.HttpProvider(providerUrl + ":" + providerPort));
}


var input = {
	'simpleStorage.sol' : fs.readFileSync('./contracts/simpleStorage.sol', 'utf8')
};


let compiledContract = solc.compile({sources: input}, 1);
let abi = JSON.parse(compiledContract.contracts['simpleStorage.sol:SimpleStorage'].interface);
let bytecode = '0x'+compiledContract.contracts['simpleStorage.sol:SimpleStorage'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode});
let ContractSimpleStorage = new web3.eth.Contract(abi, {
	from:web3.eth.coinbase,
	data:bytecode,
	gas:gasEstimate
});

ContractSimpleStorage.deploy({
	data:ContractSimpleStorage.options.data
});

console.log(ContractSimpleStorage.options);

console.log(ContractSimpleStorage.options.address);


/*
var simpleStorage = SimpleStorage.new("sanchit","s@a.com", {
	from:web3.eth.coinbase,
	data:bytecode,
	gas: gasEstimate
}, function (err, myContract) {
	if (!err) {
		if (!myContract.address) {
			console.log(myContract.transactionHash);
		} else {
			console.log(myConstract.address);
		}
	}
});
*/

