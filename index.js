const Web3 = require('web3');

const providerUrl = 'http://localhost';
const providerPort = 8800;

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider(providerUrl + ":" + providerPort));
}

var isConnected = function () {
	return web3.currentProvider.connected;
}

web3.eth.getBlock(0, function(error, result) {
	if (!isConnected()) {
		console.log('current provider is not connected');
		return ;
	}

	if (!error) {
		console.log(JSON.stringify(result));
	}else {
		console.log(error);
	}
});

web3.eth.getAccounts()
.then(function(accounts) {
	accounts.forEach(function (account) {
		web3.eth.getBalance(account)
		.then(function (balance) {
			console.log('\n' + account + "\n\tyoungSoo" +  "'s balance : " + balance + " ether");
		})
	});

});
