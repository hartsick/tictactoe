function TTTController($scope){

	// instantiate players
	$scope.players = [
		{
			name: "Player 1",
			character: "X",
			value: 1,
			wins: 0,
			color: 'rgba(0,0,200, .5)'
		},
		{
			name: "Player 2",
			character: "O",
			value: -1,
			wins: 0,
			color: 'rgba(200,0,0,.5)'
		}
	];
	
	// set default number of players
	numPlayers = 2;

	var playerIndex = 0;
	var currentPlayer = $scope.players[playerIndex];

	// // instantiate cube faces
	$scope.cube = [
		{
			face: "front",
			board: new Array(9)
		},
		{
			face: "back",
			board: new Array(9)
		},
		{
			face: "top",
			board: new Array(9)
		},
		{
			face: "bottom",
			board: new Array(9)
		},
		{
			face: "left",
			board: new Array(9)
		},
		{
			face: "right",
			board: new Array(9)
		}
	];

	// $scope.cubeFaces = ["front", "back", "top", "bottom", "left", "right"];
	// $scope.cube = function(){
	// 	var cubeArray;
	// 	for (var i = 0; i < 6; i++){
	// 		cubeArray[i] = {
	// 			face: cubeFaces[i],
	// 			board: new Array(9)
	// 		}
	// 	}
	// 	console.log(cubeArray);
	// 	return cubeArray;
	// };

	/* 
	 * Place marker in specified div
	 */
	$scope.placeMarker = function(clickedFace, $index, $event){
		$event.target.style.backgroundColor = currentPlayer.color;
		if ($scope.cube.face == clickedFace ){

		}
	}

	/*
	 * Switch current player
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
		console.log("Current Player: " + currentPlayer.name);
	};


	/*
	 * Click handler for cube
	 */
	$scope.clicker = function(clickedFace, $index, $event) {
		console.log("Cell Index:" + clickedFace + $index);
		console.log("Player color: " + currentPlayer.color);
		$scope.placeMarker(clickedFace, $index, $event);
		$scope.switchPlayer();
	};

	/*
	 * Rotate the cube
	 */
	$scope.controls = ["up", "down", "right", "left"];
	$scope.rotateCube = function($id, $event){
		console.log("ID: " + $id);
	};

};