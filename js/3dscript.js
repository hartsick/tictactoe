// Initialize board & move counters
var boardHeight;
var boardTotal;
var boardArray;
var totalMoves;

// Initialize players
var player1 = {points: 5, name: "Player One", wins: 0};
var player2 = {points: 7, name: "Player Two", wins: 0};

var gameEnd;
var player; 

// Begin Tic Tac Toe!
window.onload = function() {
	buildBoard();
}

function buildBoard() {
	// Initialize variables
	totalMoves = 0

	// Initialize board & move counter
	boardHeight = 3;
	boardTotal = boardHeight * boardHeight;
	boardArray = new Array(boardTotal);

	gameEnd = false;
	player = player1;

	// Get all children to row divs
	boardHTML = document.querySelectorAll("div div div div");

	// Cycle through and add click handler
	for ( var row = 0; row < boardHTML.length; row ++){
		boardHTML[row].onclick=takeTurn;
	}
}

function takeTurn() {
	// if game hasn't ended yet...
	if (gameEnd == false){
		if (placeMarker(this)){
			checkForWin();
			switchPlayer();
		}
	}
	else {
		return;
	}
	console.log(gameEnd);
}

function placeMarker(clickedDiv){
	// If space unoccupied, place appropriate marker & switch players
	if (clickedDiv.style.backgroundColor="rgba(0,0,0,.1)"){

		// store player# in div's array position
		boardArray[clickedDiv.id] = player.points;

		// place marker & switch players
		if (player == player1){
			clickedDiv.style.backgroundColor="rgba(71,191,223,.4)";
		}
		else {
			clickedDiv.style.backgroundColor="rgba(196,212,0,.4)";
		}
		// increment total # of moves
		totalMoves++;
		return true;
	}
	// Else, tell them to play by the rules
	else {
		alert("Try an empty square!");
		return false;
	}
}

function checkForWin() {
	// don't bother checking for win before it's possible
	if (totalMoves > (boardHeight * 2) - 2){

		// declare winCondition
		var winCondition;

		// CHECK ROWS
		// iterate through rows
		for (var row = 0; row < boardHeight; row++){
			winCondition = 0;

			// check each div of row
			for (var index = row * boardHeight; index < (row + 1) * boardHeight; index++){
				gameEnd = hasPlayerWon(index);
			}
		}

		// CHECK COLUMNS
		// iterate through columns
		for (var row = 0; row < boardHeight; row++){
			// reset win condition
			winCondition = 0;
			// iterate through each div in column
			for (var index = row; index < boardTotal; index = index + boardHeight){
				gameEnd = hasPlayerWon(index);
			}
		}

		// CHECK DIAGONALS
		
		// iterate through left-facing diagonal
		for (var row = 0; row < boardHeight; row++){
			// reset win condition
			winCondition = 0;
			for (var index = 0; index < boardTotal; index = index + (boardHeight + 1) ){
				gameEnd = hasPlayerWon(index);
				if (gameEnd){
					break;
				}
			}
		}
		
		// iterate through right-facing diagonal
		for (var row = 0; row < boardHeight; row++){
			// reset win condition
			winCondition = 0;

			for (var index = boardHeight - 1; index < boardTotal; index = index + (boardHeight - 1)){
				gameEnd = hasPlayerWon(index);
				if (gameEnd){
					break;
				}
			}
		}
	}	

	function hasPlayerWon(i){
		// if null value found in array, break 
		if (!boardArray[i]){
			return false;
		}
		// otherwise, start the tally & check for win
		else {

			// add current cell value to winCondition
			winCondition += boardArray[i];

			// check winCondition for value of 15 for player1 win, or 21 for player2 win
			if (winCondition == player1.points * boardHeight || winCondition == player2.points * boardHeight){
				document.getElementById("message").innerHTML = player.name + " won!";

				// increment win counter for appropriate player
				if (winCondition == player1.points * boardHeight ){
					player1.wins++;
				}
				else {
					player2.wins++;
				}
				console.log("Hi!");

				return true;
			}

			// if final move and no win, declare tie
			else if (totalMoves == boardTotal){
				document.getElementById("message").innerHTML = "You tied!";
				return true;
			}

			else {
				return false;
			}
		}			
	}
}

function switchPlayer(){
	if (player == player1){
		player = player2;
	}
	else {
		player = player1;
	}
}