function TTTController($scope){

// var tttApp = angular.module('tttApp', ["firebase"])
// 	.controller('TTTController', function($scope, $firebase){

  // var tttRef = new Firebase("https://tcubed.firebaseio.com");
  // // Automatically syncs everywhere in realtime
  // $scope.ttt = $firebase(tttRef);

	// Instantiate players
	$scope.players = [
		{
			name: "Player 1",
			character: "X",
			value: 1,
			wins: 0,
			color: 'rgba(0,0,200, .5)',
			img: 'url("img/glitchbow.png")',
			facesWon: 0
		},
		{
			name: "Player 2",
			character: "O",
			value: -1,
			wins: 0,
			color: 'rgba(200,0,0,.5)',
			img: 'url("img/glitchpoke.png")',
			facesWon: 0
		}
	];

	// Set Defaults
	var numPlayers = 2;

	// Initialize current player
	var playerIndex = 0;
	var currentPlayer = $scope.players[playerIndex];

	// Set board width for each face
	var boardWidth = 3;
	var boardTotal = boardWidth * boardWidth;

	// Initialize moves
	var totalMoves = 0;
	var gameEnd = false;
	var completedFaces = 0;

	/*
	 *
	 * Create Cube
	 *
	 */ 
	var createDataCube = function(){
		// create data cube array
		var innerCube = [];

		// Create multi-dimensional array to store in main array
		for (var i = 0; i < boardWidth; i++){
			var innerArray = [];
			for (var j = 0; j < boardWidth; j++){
				innerArray[j] = new Array(3);
			}
			// Store inner array in main array at given index
			innerCube[i] = innerArray;
		}	
		return innerCube;
	};
	$scope.dataCube = createDataCube();

  /*
	 *
	 * Rotate the cube
	 *
	 */
	// Initialize controls
	$scope.controls = [
		{
			direction: "up",
		},
		{
			direction: "down"
		},
		{
			direction: "right"
		},
		{
			direction: "left"
		}
	];

	// Initialize rotation increments
	$scope.currentXdeg = 0;
	$scope.currentYdeg = 0;
	$scope.currentZdeg = 0;
	$scope.currentXtrans = 0;
	$scope.currentYtrans = 0;
	$scope.currentZtrans = -100;

	// Rotate that cube!
	$scope.rotateCube = function(controlName){

		// Snag the cube wrapper
		var cubeWrap = document.getElementById('cube');

		// Increment current degree rotation based on selected command
		if (controlName == "right"){
			$scope.currentYdeg += 90;
		}
		else if (controlName == "left"){
			$scope.currentYdeg -= 90;
		}
		else if (controlName == "up"){
			$scope.currentXdeg += 90;
		}
		else {
			$scope.currentXdeg -= 90;
		}

		// Checking current x & y degrees
		console.log("Control: " + controlName);
		console.log($scope.currentYdeg);
		console.log($scope.currentXdeg);

		// Compile the css tranformations & display
		var transform = "rotate3d("  + $scope.currentXdeg + "deg ";
				transform += $scope.currentYdeg + "deg ";
				transform += $scope.currentZdeg + "deg) ";
				transform += "translate3d(" + $scope.currentXtrans + "px ";
				transform += $scope.currentYtrans + "px "; 
				transform += $scope.currentZtrans + "px)";
		console.log(transform);
		cubeWrap.style.webkitTransform = transform;

	};

	/*
	 *
	 * Click handler for cube
	 *
	 */
	$scope.clicker = function(x, y, z, clickEvent) {
		console.log("x: " + x + " y: " + y + " z: " + z);
		// If clicked cell is onoccupied, take a turn
		if ($scope.dataCube[x][y][z] == undefined){

			// If cell is empty, place marker & switch player
			$scope.dataCube[x][y][z] = currentPlayer.character;
			//clickEvent.target.style.backgroundImage = currentPlayer.img;

			// Increment total moves
			totalMoves++;

			console.log("Data cube: " + $scope.dataCube);
			$scope.checkForWin(x,y,z);
			$scope.switchPlayer();
		}
		else{
			alert("Pick an unoccupied cell!");
		}
	};

	/*
	 *
	 * Switch current player
	 * Allows for more than 2 players
	 *
	 */
	$scope.switchPlayer = function(){
		// Increment player index
		playerIndex++;

		// If index is greater than the number of players, bring it back around
		if (playerIndex > numPlayers - 1){
			playerIndex = 0;
		}

		// Update current player
		currentPlayer = $scope.players[playerIndex];
	};


	/*
	 *
	 * Check for Win
	 * 
	 */
	$scope.checkForWin = function(x,y,z) {
		console.log(totalMoves);

		// If total moves is enough to win, check for win!
		if (totalMoves > (numPlayers * 3) - 2){

			// Create empty winCondition
			var winCondition;

			// Check X for col/row wins
			winCondition = 0;
			for (var xCounter = 0; xCounter < boardWidth; xCounter++){
				// If cube has a value, add it to winCondition total
				if ($scope.dataCube[xCounter][y][z]){
					winCondition += $scope.dataCube[xCounter][y][z].charCodeAt(0);
				}
				playerHasWon(winCondition);
			}

			// Check Y for col/row wins
			winCondition = 0;
			for (var yCounter = 0; yCounter < boardWidth; yCounter++){
				// If cube has a value, add it to winCondition total
				if ($scope.dataCube[x][yCounter][z]){
					winCondition += $scope.dataCube[x][yCounter][z].charCodeAt(0);
				}
				playerHasWon(winCondition);
			}

			// Check Z for col/row wins
			winCondition = 0;
			for (var zCounter = 0; zCounter < boardWidth; zCounter++){
				// If cube has a value, add it to winCondition total
				if ($scope.dataCube[x][y][zCounter]){
					winCondition += $scope.dataCube[x][y][zCounter].charCodeAt(0);
				}
				if (playerHasWon(winCondition)){
					break;
				};
			}

			// Check Diagonals
			// Load array of all diagonal possibilities
			var diagonals = [
												[[0,0,0],[1,1,0],[2,2,0]],
												[[0,0,0],[0,1,1],[0,2,0]],
												[[0,0,0],[1,0,1],[2,0,2]],
												[[2,0,0],[1,1,0],[0,2,0]],
												[[2,0,0],[2,1,1],[2,2,2]],
												[[2,0,0],[1,0,1],[0,0,2]],
												[[0,0,2],[1,1,2],[2,2,2]],
												[[2,0,2],[1,1,2],[0,2,2]],
												[[2,0,2],[2,1,1],[2,2,0]],
												[[0,2,0],[1,2,1],[2,2,2]],
												[[2,2,0],[1,2,1],[0,2,2]]
											];
			var clickedCell = [x,y,z];
			var diagsToCheck = [];

			// Check to see if clicked cell is in diagonal possibilities
			for (var i = 0; i < diagonals.length ; i++ ){
				for (var j = 0; j < diagonals[i].length; j++){
					
					var isSameCell = 0;

					// If clicked cell is in diagonal, check those diagonals for win
					for (var k = 0; k < diagonals[i][j].length; k++){
						if ( diagonals[i][j][k] == clickedCell[k] ){
							isSameCell++;
						}
						if (isSameCell == 3){
							diagsToCheck.push(diagonals[i]);
						}
					}
				}
			}

			// Check diagonal possibilities for win
			// If there are diagonals to check, check 'em
			if (diagsToCheck){
				for (var i = 0; i < diagsToCheck.length; i++){

					// Reset winCondition
					winCondition = 0;
					for (var j = 0; j < diagsToCheck[i].length; j++){

						// Use coordinates stored in diagsToCheck as indexes for dataCube
						var index = diagsToCheck[i][j];
						if ($scope.dataCube[index[0]][index[1]][index[2]]){
							winCondition += $scope.dataCube[index[0]][index[1]][index[2]].charCodeAt(0);
						}
						playerHasWon(winCondition);
					}
				}
			}
		}
	};

	var playerHasWon = function (winCondition){

		// Check winCondition for each player, return true for face win!
		if (winCondition == currentPlayer.character.charCodeAt(0) * boardWidth){

			// Increment # of player faces won
			currentPlayer.facesWon++;
			completedFaces++;

			return true;
		}
		// If final move and no win, declare tie
		else if (totalMoves == boardTotal * boardWidth){
			alert("You tied!")
			return true;
		}

		else {
			return false;
		}
	};	
 
 /* 
  *
  * Board & Game Reset
  * 
  */
  // Game Reset
  $scope.resetGame = function (){
 		// Set game-specific counters
		totalMoves = 0;
		gameEnd = false;
		completedFaces = 0;
		playerIndex = 0;

		// Reset player game-specific scores
		for (var i = 0; i < $scope.players.length; i++){
			$scope.players[i].facesWon = 0;
		}

		// Reset board
		for (var i = 0; i < $scope.dataCube.length; i++){
			for (var j = 0; j < $scope.dataCube[i].length; j++){
				for (var k = 0; k < $scope.dataCube[i][j].length; k++){
					$scope.dataCube[i][j][k] = undefined;
				}
			}
		}
  };

  // Full Reset
  $scope.resetAll = function (){
 		// Reset game-specific things
 		$scope.resetGame();

		// Reset players' wins
		for (var i = 0; i < $scope.players.length; i++){
			$scope.players[i].wins = 0;
		}
	};	
}
// )
;

/* 

SOME NOTES

to do:
	decide on game win conditions (lock out face or not, etc.)
	implement game win conditions

	fix rotation weirdness
	integrate into firebase

possibilty to change square background color - 
	create property of background image / color for each square
	on play, update background image of object
	update background image on all corresponding faces

potential add-ons:
	allow player to select their background image

*/

