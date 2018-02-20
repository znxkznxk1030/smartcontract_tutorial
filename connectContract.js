const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Compile the source code
web3.eth.getAccounts(function (err, accounts) {

	if (err) { return;}

	let ownAccount = accounts[0];
	let defaultAccount = web3.eth.defaultAccount;

//	web3.eth.personal.unlockAccount(ownAccount,'ysKim', 100)
//	.then(function (response) {
		let input = fs.readFileSync('./contracts/simpleStorage.sol');
		let output = solc.compile(input.toString(), 1);

		let bytecode = output.contracts[':SimpleStorage'].bytecode;
		let abi = output.contracts[':SimpleStorage'].interface;
		let Contract = new web3.eth.Contract(JSON.parse(abi), ownAccount);

		Contract.deploy({
		        data:'0x' + bytecode,
		})
		.send({
		   	from: ownAccount,
		   	gas: 1500000,
		   	gasPrice: '30000000000000'
	   	})
		.on('error', function (error) {
                        console.log('error : ' + error);
                })
                .on('transactionHash', function (transaction) {
                        console.log('transactionHash : ' + transaction);
                })
                .on('confirmation', function (number, receipt) {
                        console.log('number : ' + number + '\nreceipt : ' + receipt);
                })
	   	.then(function (ContractInstance) {
			console.log('HEllo!');
			ContractInstance.methods.set(123).send({from: ownAccount})
			.then(function () {
				ContractInstance.methods.get().call({from: ownAccount})
                        	.then(function (ret) {
                                	console.log('1. ret : ' + ret);
                        	});
			})

			ContractInstance.methods.get().call({from: ownAccount})
                        .then(function (ret) {
                               	console.log('2. ret : ' + ret);
                       	});

			setTimeout(function(){
				ContractInstance.methods.get().call({from: ownAccount})
                        	.then(function (ret) {
                                	console.log('3. ret : ' + ret);
                        	});
			}, 1000);
	   	})
		.catch(function (error) {
		});	
//	})
//	.catch(function (error) {
//		console.log(error);	
//	});
});


// Deploy contract instance
/*
const contractInstance = contract.new({
    data: '0x' + bytecode,
    from: web3.eth.coinbase,
    gas: 90000*2
}, (err, res) => {
    if (err) {
        console.log(err);
        return;
    }

    // Log the tx, you can explore status with eth.getTransaction()
    console.log(res.transactionHash);

    // If we have an address property, the contract was deployed
    if (res.address) {
        console.log('Contract address: ' + res.address);
        // Let's test the deployed contract
        testContract(res.address);
    }
});
*/
// Quick test the contract

function testContract(address) {
    // Reference to the deployed contract
    const token = contract.at(address);
    // Destination account for test
    const dest_account = '0x002D61B362ead60A632c0e6B43fCff4A7a259285';

    // Assert initial account balance, should be 100000
    const balance1 = token.balances.call(web3.eth.coinbase);
    console.log(balance1 == 1000000);

    // Call the transfer function
    token.transfer(dest_account, 100, {from: web3.eth.coinbase}, (err, res) => {
        // Log transaction, in case you want to explore
        console.log('tx: ' + res);
        // Assert destination account balance, should be 100 
        const balance2 = token.balances.call(dest_account);
        console.log(balance2 == 100);
    });
}
