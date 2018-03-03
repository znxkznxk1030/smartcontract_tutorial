var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var contractInstance = new web3.eth.Contract(ABI_DEFINITION, CONTRACT_ADDRESS); 
var accounts;
var selectedAccount = 0;
var targetAccount = 0;
var toggleAccount = true;

var games;


function startRspGame() {
		contractInstance.methods.startGame(accounts[targetAccount]).send({from: accounts[selectedAccount], gas:1000000})
		.then(console.log);
}

function getGameState() {
	gameId = $("#gameId").val() | 0;

	contractInstance.methods.getGameState(gameId).call({from: accounts[selectedAccount]})
	.then(function(gameState) {
		console.log(gameState);
	});
	
}

function getGameInfo(i) {
	contractInstance.methods.games(i).send({from: accounts[selectedAccount]})
	.then(console.log);
}

function beats(i) {
	gameId = $("#gameId").val() | 0;
	type = $("type").val() | 1;

	contractInstance.methods.beats(gameId, type).send({
			from: accounts[i]})
	.then(console.log);
}

function displaySeletedAddress() {
	$('#selected-value').empty();
	$('#selected-label').empty();
	$('#selected-value').append(`my Account`);
	$('#selected-label').append(`${accounts[selectedAccount]}`);

	$('#target-value').empty();
	$('#target-label').empty();
	$('#target-value').append(`other Account`);
	$('#target-label').append(`${accounts[targetAccount]}`)
}

$(document).ready(function() {
	web3.eth.getAccounts(function (err, _accounts) {
		if (err) throw err;

		accounts = _accounts;
		for(let i = 0; i < _accounts.length; i++){
			(function(){
			let account = _accounts[i];


			$(".list").append(
			`<div class="item">
			    <i class="large address card outline middle aligned icon"></i>
			    <div class="content">
			      <a class="header" id="account_${i}">${account}</a>
			      <div class="description" >address : ${i}</div>
			    </div>
			  </div>`
			);
		

			$("#account_" + i).click(function() {
				console.log(i);
				if(toggleAccount) {
					selectedAccount = i;
				}
				else{
					targetAccount = i;
				}
				displaySeletedAddress();
			})
			})();
		}

		$('#toggle-account').click(function(){
			toggleAccount= !toggleAccount;	
		});

		selectedAccount = 0;
		displaySeletedAddress();

	});

	$("#start-game").click(function() {
		startRspGame();	
	});


});












