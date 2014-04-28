// Dependency injection - firebase and $scope
var tttApp = angular.module('tttApp', ["firebase"]);
tttApp.controller('TTTController', function($scope, $timeout, $firebase){

  var tttRef = new Firebase("https://tcubed.firebaseio.com/games");

  // Automatically syncs everywhere in realtime
  $scope.ttt = $firebase(tttRef);

	// Set Defaults
	var numPlayers = 2;

	// Set board width for each face
	var boardWidth = 3;
	var boardTotal = boardWidth * boardWidth;

	/*
	 *
	 * Create Cube
	 *
	 */ 
	var createDataCube = function(){
		// create data cube array
		var cube = [];

		// Create multi-dimensional array to store in main array
		for (var i = 0; i < boardWidth; i++){
			var innerArray = [];
			for (var j = 0; j < boardWidth; j++){
				// Create array to hold cells
				innerArray[j] = new Array(1);
				for (var k = 0; k < boardWidth; k++ ){
					// Store empty cell object
					innerArray[j][k] = {
						cell: " ",
						bg: ""
					};
				}
				// Store inner array in main array at given index
				cube[i] = innerArray;
			}	
		}
		return cube;
	}
	var dataCube = createDataCube();


	/*
	 * 
	 * Firebase Integration
	 *
	 */
	var lastGame; 
	var lastGameKey;
	tttRef.once('value', function(gamesSnapshot){
		var games = gamesSnapshot.val();

		// No games at all, so make a new game 
		if (games == null){
			lastGame = tttRef.push( {waiting: true} );
			// Set Player 1
			$scope.player = {
							name: "Player 1",
							character: "X",
							wins: 0,
							color: 'rgba(255,255,255, .7)',
							img: 'url("img/glitchbow.png")',
							facesWon: 0
						};
		}
		// If game exists...
		else {
			var keys = Object.keys(games);
			lastGameKey = keys[ keys.length - 1 ];
			lastGame = games [ lastGameKey ];
			console.log("This person's game: " + lastGameKey);

			// If person is waiting...
			if (lastGame.waiting){
				// Grab last game object from Firebase
				lastGame = tttRef.child(lastGameKey);

				// Set a new game
	      lastGame.set({
	     		waiting: false, 
	     		currentPlayer: 		{
						name: "Player 1",
						character: "X",
						wins: 0,
						color: 'rgba(255,255,255, .6)',
						img: 'url("img/glitchbow.png")',
						facesWon: 0
					}, 
	     		players: 		
	     		[{
							name: "Player 1",
							character: "X",
							wins: 0,
							color: 'rgba(255,255,255, .6)',
							img: 'url("img/glitchbow.png")',
							facesWon: 0
						},
						{
							name: "Player 2",
							character: "O",
							wins: 0,
							color: 'rgba(0,0,0,.8)',
							img: 'url("img/glitchpoke.png")',
							facesWon: 0
						}],
	     		completedFaces: 0,
	     		playerIndex: 0,
	     		totalMoves: 0,
	     		gameEnd: false, 
	     		board: dataCube,
	     		winMessage: " "
		   	});
		   	// Set as Player 2
	      $scope.player = {
							name: "Player 2",
							character: "O",
							wins: 0,
							color: 'rgba(200,0,0,.8)',
							img: 'url("img/glitchpoke.png")',
							facesWon: 0
				};
				console.log("Local player " + $scope.player.name);
			}
			else {
				// Make a new game
				lastGame = tttRef.push( {waiting: true} );
				// Set as Player 1
				$scope.player = {
							name: "Player 1",
							character: "X",
							wins: 0,
							color: 'rgba(0,0,200, .5)',
							img: 'url("img/glitchbow.png")',
							facesWon: 0
						};
				console.log("Local player " + $scope.player.name);
			}
		  // Attach the last game to what we're up to
		  $scope.game = $firebase(lastGame);
		}
	});


 //  /*
	//  *
	//  * Rotate the cube
	//  *
	//  */
	// // Initialize controls
	// $scope.controls = [
	// 	{
	// 		direction: "up",
	// 	},
	// 	{
	// 		direction: "down"
	// 	},
	// 	{
	// 		direction: "right"
	// 	},
	// 	{
	// 		direction: "left"
	// 	}
	// ];

	// // Initialize rotation increments
	// $scope.currentXdeg = 0;
	// $scope.currentYdeg = 0;
	// $scope.currentZdeg = 0;
	// $scope.currentXtrans = 0;
	// $scope.currentYtrans = 0;
	// $scope.currentZtrans = -100;

	// // Rotate that cube!
	// $scope.rotateCube = function(controlName){

	// 	// Snag the cube wrapper
	// 	var cubeWrap = document.getElementById('cube');

	// 	// Increment current degree rotation based on selected command
	// 	if (controlName == "right"){
	// 		$scope.currentYdeg += 90;
	// 	}
	// 	else if (controlName == "left"){
	// 		$scope.currentYdeg -= 90;
	// 	}
	// 	else if (controlName == "up"){
	// 		$scope.currentXdeg += 90;
	// 	}
	// 	else {
	// 		$scope.currentXdeg -= 90;
	// 	}

	// 	// Checking current x & y degrees
	// 	console.log("Control: " + controlName);
	// 	console.log($scope.currentYdeg);
	// 	console.log($scope.currentXdeg);

	// 	// Compile the css tranformations & display
	// 	var transform = "rotate3d("  + $scope.currentXdeg + "deg ";
	// 			transform += $scope.currentYdeg + "deg ";
	// 			transform += $scope.currentZdeg + "deg) ";
	// 			transform += "translate3d(" + $scope.currentXtrans + "px ";
	// 			transform += $scope.currentYtrans + "px "; 
	// 			transform += $scope.currentZtrans + "px)";
	// 	console.log(transform);
	// 	cubeWrap.style.webkitTransform = transform;

	// };

	/*
	 *
	 * Click handler for cube
	 *
	 */
	$scope.clicker = function(x, y, z, clickEvent) {
		console.log("x: " + x + " y: " + y + " z: " + z);

		if (!$scope.game.gameEnd){
			// Only allow current player to place turn
			if ($scope.player.name == $scope.game.currentPlayer.name){

				// If clicked cell is unoccupied, take a turn
				if ($scope.game.board[x][y][z].cell == " "){

					// If cell is empty, place X or O & update background
					$scope.game.board[x][y][z].cell = $scope.game.currentPlayer.character;
					$scope.game.board[x][y][z].bg = $scope.game.currentPlayer.color;

					// Increment total moves
					$scope.game.totalMoves++;

					// Do rest of turn
					$scope.checkForScore(x,y,z);
					if (!$scope.game.gameEnd){
						$scope.switchPlayer();
					}
				}
				// If occupied, flash the cell red
				else {
					var bg = $scope.game.board[x][y][z].bg;
					$scope.game.board[x][y][z].bg = 'rgba(239,16,59,.5)';
					$timeout(function(){ 
						$scope.game.board[x][y][z].bg = bg;
					}, 100);
				}
			}
		}
		console.log($scope.game.gameEnd);

		// Save to Firebase
		$scope.game.$save();
	};

	/*
	 *
	 * Switch current player
	 * Allows for more than 2 players
	 *
	 */
	$scope.switchPlayer = function(){
		// Increment player index
		$scope.game.playerIndex++;

		// If index is greater than the number of players, bring it back around
		if ($scope.game.playerIndex > numPlayers - 1){
			$scope.game.playerIndex = 0;
		}
		// Update current player
		$scope.game.currentPlayer = $scope.game.players[$scope.game.playerIndex];

		// Save to Firebase
		$scope.game.$save();

	};


	/*
	 *
	 * Check for Win
	 * 
	 */
	$scope.checkForScore = function(x,y,z) {
		console.log("Total moves: " + $scope.game.totalMoves);

		// If total moves is enough to win, check for win!
		if ($scope.game.totalMoves > (numPlayers * 3) - 2){

			// Create empty winCondition
			var winCondition;

			// Check X for col/row wins
			winCondition = 0;
			for (var xCounter = 0; xCounter < boardWidth; xCounter++){
				// If cube has a value, add it to winCondition total
				if ($scope.game.board[xCounter][y][z].cell != " "){
					winCondition += $scope.game.board[xCounter][y][z].cell.charCodeAt(0);
				}
				$scope.game.gameEnd = faceIsWon(winCondition);
			}

			// Check Y for col/row wins
			winCondition = 0;
			for (var yCounter = 0; yCounter < boardWidth; yCounter++){
				// If cube has a value, add it to winCondition total
				if ($scope.game.board[x][yCounter][z].cell != " "){
					winCondition += $scope.game.board[x][yCounter][z].cell.charCodeAt(0);
				}
				$scope.game.gameEnd = faceIsWon(winCondition);
			}

			// Check Z for col/row wins
			winCondition = 0;
			for (var zCounter = 0; zCounter < boardWidth; zCounter++){
				// If cube has a value, add it to winCondition total
				if ($scope.game.board[x][y][zCounter].cell != " "){
					winCondition += $scope.game.board[x][y][zCounter].cell.charCodeAt(0);
				}
				$scope.game.gameEnd = faceIsWon(winCondition);
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
						if ($scope.game.board[index[0]][index[1]][index[2]].cell){
							winCondition += $scope.game.board[index[0]][index[1]][index[2]].cell.charCodeAt(0);
						}
						$scope.game.gameEnd = faceIsWon(winCondition);
					}
				}
			}
		}
		
		// SAVE 
		$scope.game.$save();
	};

	var faceIsWon = function (winCondition){

		// If three in a row are found...
		if (winCondition == $scope.game.currentPlayer.character.charCodeAt(0) * boardWidth){

			// Increment # of total faces won
			$scope.game.completedFaces++;

			// Increment appropriate player score in Firebase
			if ($scope.game.currentPlayer.name == $scope.game.players[0].name){
				$scope.game.players[0].facesWon++;
			}
			else {
				$scope.game.players[1].facesWon++;
			}

			// Remove face from list of possible faces

			// // If player has won over 3 faces, they win
			// if ($scope.game.currentPlayer.facesWon++ > 3){
			// 	$scope.game.winMessage = $scope.game.currentPlayer.name + " won!";
			// 	return true;
			// }
		}
		// If final move and no win, declare tie
		if ($scope.game.totalMoves == 26 ){

			// If player 1 has highest score, announce win
			if ($scope.game.players[0].facesWon > $scope.game.players[1].facesWon){
				$scope.game.players[0].wins++;
				$scope.game.winMessage = $scope.game.players[0].name + " won!";
				return true;
			}
			// If player 2 has highest score, announce win
			else if ($scope.game.players[1].facesWon > $scope.game.players[0].facesWon){
				$scope.game.players[1].wins++;
				$scope.game.winMessage = $scope.game.players[1].name + " won!";
				return true;
			}
			// If equal, declare tie
			else {
				$scope.game.winMessage = "Game over. Tie match.";
				return true;
			}
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
		$scope.game.totalMoves = 0;
		$scope.game.gameEnd = false;
		$scope.game.completedFaces = 0;
		$scope.game.winMessage = " ";

		// Reset Player to 1
		$scope.game.playerIndex = 0;
		$scope.game.currentPlayer = $scope.game.players[$scope.game.playerIndex];

		// Reset player game-specific scores
		for (var i = 0; i < $scope.game.players.length; i++){
			$scope.game.players[i].facesWon = 0;
		}

		// Reset board
		for (var i = 0; i < $scope.game.board.length; i++){
			for (var j = 0; j < $scope.game.board[i].length; j++){
				for (var k = 0; k < $scope.game.board[i][j].length; k++){
					$scope.game.board[i][j][k] = {
						cell: " ",
						bg: " "
					};
				}
			}
		}
		console.log($scope.game);

		// Save changes to firebase
		$scope.game.$save();
  };

  // Full Reset
  $scope.resetAll = function (){
 		// Reset game-specific things
 		$scope.resetGame();

		// Reset players' wins
		for (var i = 0; i < $scope.game.players.length; i++){
			$scope.game.players[i].wins = 0;
		}
		console.log($scope.game);
		// Save changes to firebase
		$scope.game.$save();
	};	
});

/* 

SOME NOTES

to do:
	decide on game win conditions (lock out face or not, etc.)
	implement game win conditions

	fix rotation weirdness
	integrate into firebase
		switch player
		have player execute turn
			update board, player score

potential add-ons:
	allow player to select their background image

alert
	-when other player's turn

*/

/* Locking out a face
	Prevent clicking on locked out faces (remove ng-click)
	Prevent win checking for side that has been locked out
	Change color of cube face to match won side
	
	*/

