//gameboard object with gameboard array - module (IIFE)
const Gameboard = (() =>{
    const playerX = "X";
    const playerO = "O";
    //should be 3x3 array 2D
    let gameboard = [["T","I","C"],
                    ["T","A","C"],
                    ["T","O","E"]];
    const setGameboard = function(x,y,value){
        if(value === null){
            return;
        }
        else{
            if(gameboard[x][y] === null){
                //if playerX then place X
                //if playerO then place O
                gameboard[x][y] = value;
            }
            else{
                return;
            }
        }
    }
    const getGameboard = function(){
        return gameboard;
    }
    const get1DGameboard = function(){
        let gameboard1D = [].concat(...gameboard);
        return gameboard1D;
    }
    const checkGameboardFull = function(){
        for(i=0;i<gameboard.length;i++){
            for(j=0;j<gameboard.length;j++){
                if(gameboard[i][j] === null){
                    return false;
                }
            }
        }
        return true;
    }
    const cleanGameboard = function(){
        gameboard = [[null,null,null],
                    [null,null,null],
                    [null,null,null]];
    }
    const checkRow = function(rowIndex){
        return gameboard[rowIndex].every(function(value){
            if(value === null){
                return false;
            }
            return value === gameboard[rowIndex][0];
        })
    }
    const checkColumn = function(columnIndex){
        let columnArray = [];
        for(i=0;i<gameboard.length;i++){
            columnArray.push(gameboard[i][columnIndex]);
        }
        return columnArray.every(function(value){
            if(value === null || value === "T"){
                return false;
            }
            return value === columnArray[0];
        })
    }
    const checkDiagonalLeft = function(){
        let diagonalArray = [];
        diagonalArray.push(gameboard[0][0]);
        diagonalArray.push(gameboard[1][1]);
        diagonalArray.push(gameboard[2][2]);
        return diagonalArray.every(function(value){
            if(value === null){
                return false;
            }
            return value === diagonalArray[0];
        })
    }
    const checkDiagonalRight = function(){
        let diagonalArray = [];
        diagonalArray.push(gameboard[0][2]);
        diagonalArray.push(gameboard[1][1]);
        diagonalArray.push(gameboard[2][0]);
        return diagonalArray.every(function(value){
            if(value === null){
                return false;
            }
            return value === diagonalArray[0];
        })
    }
    const checkWin = function(indexRow,indexColumn){
        if(checkRow(indexRow)){
            //check which player wins and alert it - then reset
            console.log(`WIN ${indexRow} row`);
            GameController.setGameWin(true,indexRow,0);
        }
        if(checkColumn(indexColumn)){
            console.log(`WIN ${indexColumn} column`);
            GameController.setGameWin(true,0,indexColumn);
        }        
        if(checkDiagonalLeft()){
            console.log(`WIN left`);
            GameController.setGameWin(true,0,0);
        }
        if(checkDiagonalRight()){
            console.log(`WIN right`);
            GameController.setGameWin(true,2,2);
        }
    }
    const checkTie = function(){
        if(checkGameboardFull() && !GameController.getGameWin()){
            console.log("its a TIE");
            GameController.gameStart = false;
            DisplayController.WinDisplay("Its a Tie");
        }
    }
    return{
        setGameboard, 
        getGameboard,
        cleanGameboard,
        checkGameboardFull,
        checkWin,
        checkTie,
        get1DGameboard
    };
})();

const DisplayController = (() =>{
    //shows game state in browser
    const displayedGameboard = document.querySelectorAll(".grid-item");
    const displayGameboardArray = Array.from(displayedGameboard);
    const displayGameboard2DArray = [];
    const buttonO = document.querySelector("#o-select");
    const buttonX = document.querySelector("#x-select");
    const turnDisplay = document.querySelector("#turn-display");
    const startButton = document.querySelector("#start-button");
    let playerSelection;
    let playerSelected;
    const winText = document.querySelector("#win-text");

    startButton.addEventListener("click",function(){
        if(playerSelected){
            GameController.setGameStart(true);
            
            if(GameController.getGameStart()){
                startButton.textContent = "RESTART";
                GameController.restartGame();
            }
            else{
                startButton.textContent = "START";
                GameController.restartGame();
            }
        }
    })

    //gameboard display setup
    while(displayGameboardArray.length) {
        displayGameboard2DArray.push(displayGameboardArray.splice(0,Gameboard.getGameboard().length));
    }
    //gameboard click setup
    for(i=0;i<Gameboard.getGameboard().length;i++){
        for(j=0;j<Gameboard.getGameboard().length;j++){
            displayGameboard2DArray[i][j].textContent = Gameboard.getGameboard()[i][j];
            displayGameboard2DArray[i][j].index = (i+""+j);

            displayGameboard2DArray[i][j].addEventListener("click", function(){
                if(GameController.getGameStart()){
                    //should be possible to change anything only when game is started
                    Gameboard.setGameboard(parseInt(this.index.toString().slice(0,1)), parseInt(this.index.toString().slice(1)),GameController.currentPlayer());
                    Gameboard.checkWin(parseInt(this.index.toString().slice(0,1)), parseInt(this.index.toString().slice(1)));
                    Gameboard.checkTie();
                    GameController.updateGameState();
                    //set turn 
                    GameController.changeTurn();
                }
            });
        }
    }
    const refreshDisplay = function(){
        for(i=0;i<Gameboard.getGameboard().length;i++){
            for(j=0;j<Gameboard.getGameboard().length;j++){
                displayGameboard2DArray[i][j].textContent = Gameboard.getGameboard()[i][j];
            }
        }
        changeTurnDisplay(GameController.getCurrentTurn());
    }
    const changeTurnDisplay = function(value){
        switch(value){
            case true:
                turnDisplay.textContent = "Its YOUR turn."
                break;
            case false:
                turnDisplay.textContent = "Its OPPONENTS turn."
                break;
            default:
                turnDisplay.textContent = "Tic-Tac-Toe"
                
        }
    }
    const selectPlayer = function(event){
        if(!playerSelection){
            playerSelection = event.target.dataset.piece;
            playerSelected = true;
            if(event.target.dataset.piece === "x"){
                if(!event.target.classList.contains("selected") && !buttonO.classList.contains("selected")){
                    event.target.classList.add("selected");
                }
            }
            if(event.target.dataset.piece === "o"){
                if(!event.target.classList.contains("selected") && !buttonX.classList.contains("selected")){
                    event.target.classList.add("selected");
                }
            }
            GameController.setPlayers(playerSelection);
        }
        else{
            console.log("player already selected");
        }
    }   
    const getPlayerSelection = function(){
        return playerSelection; 
    }

    buttonO.addEventListener("click",selectPlayer);
    buttonX.addEventListener("click",selectPlayer);

    const winDisplay = function(winnerMSG){
        winText.textContent = winnerMSG;
    }

    return {
        refreshDisplay,
        getPlayerSelection,
        winDisplay
    };
})();

//players objects - factory
const Player = (playerPiece,name)=>{  
    const playerSelectedPiece = playerPiece;
    const playerName = name;
    const getPlayerPiece = function(){
        return playerSelectedPiece;
    }
    const getPlayerName = function(){
        return playerName;
    }
    //add computer play here
    const computerPlay = function(){
        //get gameboard
        const gameboardState = Gameboard.get1DGameboard();
        //look for free tiles
        let freeIndexes = [];
        for(i=0;i<gameboardState.length;i++){
            if(gameboardState[i] === null){
                freeIndexes.push(i);
            }
        }
        //get random tile from free tiles and place mark there
        let selectedTile = freeIndexes[Math.floor(Math.random()*freeIndexes.length)];
        if(GameController.getGameStart() && freeIndexes.length){            
            //should be possible to change anything only when game is started
            Gameboard.setGameboard(Math.floor(selectedTile/Gameboard.getGameboard().length), (selectedTile%3),GameController.currentPlayer());
            Gameboard.checkWin(Math.floor(selectedTile/Gameboard.getGameboard().length), (selectedTile%3));
            Gameboard.checkTie();
            //set turn 
            GameController.changeTurn();
            GameController.updateGameState();
        }
    }
    return{
        getPlayerPiece,
        computerPlay,
        getPlayerName
    }
}

//game controller object - module (IIFE)
const GameController = (() =>{
    let gameStart = false;
    let gameEnd = false;
    let playerOne;
    let computerPlayer;
    let playerTurn = true;
    let winner = null;

    const setPlayers = function(playerPiece){
        playerOne = Player(playerPiece,"PLAYER");
        if(playerPiece === "x"){
            computerPlayer = Player("o","COMPUTER");
        }
        if(playerPiece === "o"){
            computerPlayer = Player("x","COMPUTER");
        }

    }
    const getCurrentTurn = function(){
        return playerTurn;
    }
    const getGameStart = function(){
        return gameStart;
    }
    const setGameStart = function(value){
        gameStart = value;
    }
    
    /*
    fix a bug where you can click occupied space and it will still change turn to opponent
    */
    //control the flow of the game
    const updateGameState = function(){
        if(Gameboard.checkGameboardFull() || winner){
            //go to endgame function where winner and end screen is displayed
            //Gameboard.cleanGameboard();
            endGame();
        }
        DisplayController.refreshDisplay();
    }
    const restartGame = function(){
        Gameboard.cleanGameboard();
        gameEnd = false;
        playerTurn = true;
        updateGameState();
        winner = null
        DisplayController.winDisplay("");
    }
    const currentPlayer = function(){
        if(playerOne){
            if(playerTurn){
                return playerOne.getPlayerPiece();
            }
            else{
                return computerPlayer.getPlayerPiece();
            }
        }
        else{
            return null;
        }
    }
    const endGame = function(){
        gameStart = false;
        gameEnd = true;
        console.log("game ended");
        if(gameStart === false && gameEnd){
            DisplayController.winDisplay("");
        }
        if(winner === playerOne.getPlayerName()){
            DisplayController.winDisplay("You have WON the game!");
        }
        if(winner === computerPlayer.getPlayerName()){
            DisplayController.winDisplay("Losing is just an opportunity to shine even brighter!");
        }
        //end the game and reset board
    }
    const setWinner = function(value){
        if(value === playerOne.getPlayerPiece()){
            winner = playerOne.getPlayerName();
        }
        if(value === computerPlayer.getPlayerPiece()){
            winner = computerPlayer.getPlayerName();
        }
    }
    const getWinner = function(){
        return winner;
    }
    const setGameWin = function(value,x,y){
        gameEnd = value;
        if(value ===true){
            gameStart = false;
            setWinner(Gameboard.getGameboard()[x][y]);
        }
    }
    const getGameWin = function(){
        return gameEnd;
    }
    const getPlayers = function(){
        console.log("player piece: "+playerOne.getPlayerPiece());
        console.log("opponent: "+computerPlayer.getPlayerPiece());
    }
    const changeTurn = function(){
        playerTurn = !playerTurn;
        if(!playerTurn){
            computerPlay();
        }
    }
    const computerPlay = function(){
        computerPlayer.computerPlay();
    }
    return{
        updateGameState,
        endGame,
        setGameWin,
        getGameWin,
        getPlayers,
        setPlayers,
        currentPlayer,
        changeTurn,
        getCurrentTurn,
        getGameStart,
        setGameStart,
        restartGame,
        computerPlay,
        setWinner,
        getWinner
    };
})();

