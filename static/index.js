var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var contractInstance = new web3.eth.Contract(ABI_DEFINITION, CONTRACT_ADDRESS); 
var candidates = {'Rama': "candidate-1",
			"Nick": "candidate-2",
			"Jose": "candidate-3"};

var asciiToHex = Web3.utils.asciiToHex;

function voteForCandidate() {
	candidateName = $("#candidate").val();
	web3.eth.getAccounts()
	.then(function (accounts) {
		return contractInstance.methods.voteForCandidate(asciiToHex(candidateName)).send({from: accounts[1]});
	})
	.then(function () {
		return contractInstance.methods.totalVotesFor(asciiToHex(candidateName)).call();
	})
	.then(function (voteCount) {
		const div_id = candidate[candidateName];
		$("#" + div_id).html(voteCount);
	})
}

$(document).ready(function() {
	candidateNames = Object.keys(candidates);
	for (var i = 0; i < candidateNames.length; i++) {
		let name = candidateNames[i];
		contractInstance.methods.totalVotesFor(asciiToHex(name)).call()
		.then(function (val) {
			$("#" + candidates[name]).html(val);
		});
	}
});

