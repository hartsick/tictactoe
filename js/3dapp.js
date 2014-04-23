function TTTController($scope){

	// instantiate players
	$scope.players = [
		{
			name: "Player 1",
			character: "X",
			value: 1,
			wins: 0,
			color: 'rgba(0,0,200, .5)',
			img: 'url("img/glitchbow.png")'
		},
		{
			name: "Player 2",
			character: "O",
			value: -1,
			wins: 0,
			color: 'rgba(200,0,0,.5)',
			img: 'url("img/glitchpoke.png")'
		}
	];
	
	// set default number of players
	numPlayers = 2;

	// initialize current player
	var playerIndex = 0;
	var currentPlayer = $scope.players[playerIndex];

	// set board width for each face
	var boardWidth = 3;
	var boardTotal = boardWidth * boardWidth;

	// initialize moves
	var totalMoves = 0;
	var gameEnd = false;

	// instantiate display cube faces & initial 3d properties
	var buildDisplayCube = function(){
		var cubeFaces = [];
		for (var i = 0; i < 6; i++){
			cubeFaces[i] = new Array(9);
		}
		return cubeFaces;
	}
	$scope.cube = buildDisplayCube();


	// create underlying data structure
	var createDataCube = function(){
		// create data cube array
		var innerCube = [];

		// create multi-dimensional array to store in main array
		for (var i = 0; i < boardWidth; i++){
			var innerArray = [];
			for (var j = 0; j < boardWidth; j++){
				innerArray[j] = new Array(3);
			}
			// store inner array in main array at given index
			innerCube[i] = innerArray;
		}	
		return innerCube;
	};
	$scope.dataCube = createDataCube();

	// // bind data cube and display cube
	// var bindCubes = function(){

	// 	// iterate through data cube
	// 	var displayCubeIndex = 0;

	// 	for (var i = 0; i < 1 ; i++){
	// 		// compute & store equivalent index for display cube
	// 		var displayCellIndex = 0;
	// 		for (var j = 0; j < boardWidth; j++){
	// 			// set front equal to data cube
	// 			for (var k = 0; k < boardWidth; k++){
	// 				$scope.cube[displayCubeIndex][displayCellIndex] = dataCube[i][j][k];
	// 				console.log(i,j,k, displayCubeIndex, displayCellIndex);
	// 				displayCellIndex++;
	// 			}
	// 		}
	// 	}
	// };
	// bindCubes(dataCube, $scope.cube);

	// TEST BINDING
	$scope.dataCube[0][0][2] = 5;
	// $scope.cube[0][2] = $scope.dataCube[0][0][2];
	// $scope.cube[5][0] = $scope.dataCube[0][0][2];

	//$scope.cube[0][2] = $scope.players[0].character;
	$scope.dataCube[0][0][2] = "X";
	console.log($scope.dataCube[0][0][2]);


	/* 
	 *
	 * Place marker in specified div
	 *
	 */
	$scope.placeMarker = function(faceIndex, cellIndex, clickEvent){
		// place current player's value in clicked cell
		$scope.cube[faceIndex][cellIndex] = currentPlayer.character;
		console.log($scope.cube[faceIndex][cellIndex]);
		console.log(faceIndex, cellIndex);
		
		// change background
		event.target.style.backgroundImage = currentPlayer.img;

		// increment total moves
		$scope.totalMoves++;
	};


	/*
	 *
	 * Switch current player
	 * Allows for more than 2 players
	 *
	 */
	$scope.switchPlayer = function(){
		// increment player index
		playerIndex++;

		// if index is greater than the number of players, bring it back around
		if (playerIndex > numPlayers - 1){
			playerIndex = 0;
		}

		// update current player
		currentPlayer = $scope.players[playerIndex];
	};


	/*
	 *
	 * Click handler for cube
	 *
	 */
	$scope.clicker = function(faceIndex, cellIndex, clickEvent) {
		console.log("Cell Index:" + faceIndex + " " + cellIndex);

		// If clicked cell is onoccupied, take a turn
		if ($scope.cube[faceIndex][cellIndex] == undefined){

			// if cell is empty, place marker & switch player
			$scope.placeMarker(faceIndex, cellIndex, clickEvent);
			console.log("Current cube: " + $scope.cube);
			console.log("Data cube: " + $scope.dataCube);
			$scope.switchPlayer();
			$scope.checkForWin();
		}
		else{
			alert("Pick an unoccupied cell!");
		}
	};


	/*
	 *
	 * Rotate the cube
	 *
	 */
	// initialize controls
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

	// initialize rotation increments
	$scope.currentXdeg = 0;
	$scope.currentYdeg = 0;
	$scope.currentXtrans = 0;
	$scope.currentYtrans = 0;
	$scope.currentZtrans = -100;

	// Rotate that cube!
	$scope.rotateCube = function(controlName){

		console.log("Control: " + controlName);

		// snag the cube wrapper
		var cubeWrap = document.getElementById('cube');

		// increment current degree rotation based on command
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

		console.log($scope.currentYdeg);
		console.log($scope.currentXdeg);
		var transform = "rotateX("  + $scope.currentXdeg + "deg) ";
				transform += "rotateY(" + $scope.currentYdeg + "deg) ";
				transform += "translateX(" + $scope.currentXtrans + "px) ";
				transform += "translateY(" + $scope.currentYtrans + "px) "; 
				transform += "translateZ(" + $scope.currentZtrans + "px)";
		console.log(transform);
		cubeWrap.style.webkitTransform = transform;

		// // iterate through each cube face
		// for (var i = 0; i < $scope.cube.length; i++){
		// 	console.log("Before :" + $scope.cube[i].properties);

		// 	if (controlName == "up"){
		// 		$scope.controls[0]
		// 	}

		// }
	};


	/*
	 *
	 * Check for Win
	 * 
	 */
	$scope.checkForWin = function() {
		console.log("I'm checkin'!");
		return;
		// if ($scope.totalMoves > ($scope.boardWidth * 2) - 2){

		// 	// declare winCondition
		// 	var winCondition;

		// 	// CHECK ROWS
		// 	// iterate through rows
		// 	for (var row = 0; row < $scope.boardWidth; row++){
		// 		winCondition = 0;

		// 		// check each div of row
		// 		for (var index = row * $scope.boardWidth; index < (row + 1) * $scope.boardWidth; index++){
		// 			gameEnd = $scope.hasPlayerWon(index);
		// 			console.log("Checking row: " + row);
		// 		}
		// 	}

		// 	// CHECK COLUMNS
		// 	// iterate through columns
		// 	for (var row = 0; row < $scope.boardWidth; row++){
		// 		// reset win condition
		// 		winCondition = 0;
		// 		// iterate through each div in column
		// 		for (var index = row; index < boardTotal; index = index + $scope.boardWidth){
		// 			gameEnd = $scope.hasPlayerWon(index);
		// 		}
		// 	}

		// 	// CHECK DIAGONALS
			
		// 	// iterate through left-facing diagonal
		// 	for (var row = 0; row < $scope.boardWidth; row++){
		// 		// reset win condition
		// 		winCondition = 0;
		// 		for (var index = 0; index < boardTotal; index = index + ($scope.boardWidth + 1) ){
		// 			gameEnd = $scope.hasPlayerWon(index);
		// 			if (gameEnd){
		// 				break;
		// 			}
		// 		}
		// 	}
			
		// 	// iterate through right-facing diagonal
		// 	for (var row = 0; row < $scope.boardWidth; row++){
		// 		// reset win condition
		// 		winCondition = 0;

		// 		for (var index = $scope.boardWidth - 1; index < boardTotal; index = index + ($scope.boardWidth - 1)){
		// 			gameEnd = $scope.hasPlayerWon(index);
		// 			if (gameEnd){
		// 				break;
		// 			}
		// 		}
		// 	}
		// }	
	};

	$scope.playerHasWon = function hasPlayerWon(i){
		return false;

		// // start the tally & check for win
		// 	// add current cell value to winCondition
		// 	winCondition += boardArray[i];

		// 	// check winCondition for value of 15 for player1 win, or 21 for player2 win
		// 	if (winCondition == player1.points * boardHeight || winCondition == player2.points * boardHeight){
		// 		document.getElementById("message").innerHTML = player.name + " won!";

		// 		// increment win counter for appropriate player
		// 		if (winCondition == player1.points * boardHeight ){
		// 			player1.wins++;
		// 		}
		// 		else {
		// 			player2.wins++;
		// 		}
		// 		console.log("Hi!");

		// 		return true;
		// 	}

		// 	// if final move and no win, declare tie
		// 	else if (totalMoves == boardTotal){
		// 		document.getElementById("message").innerHTML = "You tied!";
		// 		return true;
		// 	}

		// 	else {
		// 		return false;
		// 	}
		};		

		// Defining corners and edges
		// [face, index]
		var cornerCases = [
			[[0,5],[5,3]],
			[[0,1],[2,7]],
			[[0,3],[4,5]],
			[[0,7],[3,1]],
			[[1,1],[3,7]],
			[[1,3],[4,3]],
			[[1,5],[5,5]],
			[[1,7],[2,1]],
			[[3,3],[4,7]],
			[[3,5],[2,3]],
			[[4,1],[2,3]],
			[[5,1],[2,5]],
			[[0,0],[4,2],[2,6]],
			[[0,2],[5,0],[2,8]],
			[[0,6],[4,8],[3,0]],
			[[0,8],[5,6],[3,2]],
			[[1,0],[3,6],[4,6]],
			[[1,2],[3,8],[5,8]],
			[[1,6],[4,0],[2,0]],
			[[1,8],[5,2],[2,2]]
		];

		// check current cell against edges & corners
		for (var i = 0; i < cornerCases.length; i++){
			// convert current face to num & grab index
		}
};


