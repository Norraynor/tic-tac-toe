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
            return false;
        }
        else{
            if(gameboard[x][y] === null){
                //if playerX then place X
                //if playerO then place O
                gameboard[x][y] = value;
                return true;
            }
            else{
                return false;
            }
        }
    }
    const getGameboard = function(){
        return gameboard;
    }
    const get1DGameboard = function(board){
        let gameboard1D = [].concat(...board);
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
            GameController.setGameWin(true,0,2);
        }
    }
    const checkTie = function(){
        if(checkGameboardFull() && !GameController.getGameWin()){
            console.log("its a TIE");
            GameController.gameStart = false;
            DisplayController.winDisplay("Its a Tie");
            return true;
        }
        return false;
    }
    const getFreeTiles = function(board){
        let freeIndexes = [];
        const gameboardState = get1DGameboard(board);
        for(i=0;i<gameboardState.length;i++){
            if(gameboardState[i] === null){
                freeIndexes.push(i);
            }
        }
        return freeIndexes;
    }
    return{
        setGameboard, 
        getGameboard,
        cleanGameboard,
        checkGameboardFull,
        checkWin,
        checkTie,
        get1DGameboard,
        getFreeTiles
    };
})();

const DisplayController = (() =>{
    //shows game state in browser
    const displayedGameboard = document.querySelectorAll(".grid-item");
    const displayGameboardArray = Array.from(displayedGameboard);
    const displayGameboard2DArray = [];
    const buttonO = document.querySelector("#o-select");
    const buttonX = document.querySelector("#x-select");
    const easyButton = document.querySelector("#easy");
    const hardButton = document.querySelector("#hard");
    const turnDisplay = document.querySelector("#turn-display");
    const startButton = document.querySelector("#start-button");
    let playerSelection;
    let playerSelected;
    let modeSelection;
    let modeSelected;
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
                    if(Gameboard.setGameboard(parseInt(this.index.toString().slice(0,1)), parseInt(this.index.toString().slice(1)),GameController.currentPlayer())){
                        Gameboard.checkWin(parseInt(this.index.toString().slice(0,1)), parseInt(this.index.toString().slice(1)));
                        Gameboard.checkTie();
                        GameController.updateGameState();
                        //set turn 
                        GameController.changeTurn();
                    }                    
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
    const selectMode = function(event){
        if(!modeSelection){
            modeSelection = event.target.dataset.mode;
            modeSelected = true;
            if(event.target.dataset.mode === "easy"){
                if(!event.target.classList.contains("selected") && !hardButton.classList.contains("selected")){
                    event.target.classList.add("selected");
                }
            }
            if(event.target.dataset.mode === "hard"){
                if(!event.target.classList.contains("selected") && !easyButton.classList.contains("selected")){
                    event.target.classList.add("selected");
                }
            }
            GameController.setMode(modeSelection);
        }
        else{
            console.log("mode already selected");
        }
    }

    buttonO.addEventListener("click",selectPlayer);
    buttonX.addEventListener("click",selectPlayer);
    easyButton.addEventListener("click",selectMode);
    hardButton.addEventListener("click",selectMode);

    const winDisplay = function(winnerMSG){
        console.log(winText);
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
    const computerPlay = function(superAI=false){
        //look for free tiles
        let freeIndexes = Gameboard.getFreeTiles(Gameboard.getGameboard());
        //get random tile from free tiles and place mark there
        let selectedTile = freeIndexes[Math.floor(Math.random()*freeIndexes.length)];
        if(GameController.getGameStart() && freeIndexes.length){        
            if(!superAI){
                console.log("easy mode");
                //should be possible to change anything only when game is started
                Gameboard.setGameboard(Math.floor(selectedTile/Gameboard.getGameboard().length), (selectedTile%3),GameController.currentPlayer());
                Gameboard.checkWin(Math.floor(selectedTile/Gameboard.getGameboard().length), (selectedTile%3));
                Gameboard.checkTie();
                //set turn 
                GameController.changeTurn();
                GameController.updateGameState();
            }
            else{
                console.log("hard mode");
                //should be possible to change anything only when game is started
                let index = bestSpot();
                console.log(index);
                Gameboard.setGameboard(Math.floor(index/Gameboard.getGameboard().length), (index%3),GameController.currentPlayer());
                console.log(Math.floor(index/Gameboard.getGameboard().length));
                console.log(index%3);
                Gameboard.checkWin(Math.floor(index/Gameboard.getGameboard().length), (index%3));
                Gameboard.checkTie();
                //set turn 
                GameController.changeTurn();
                GameController.updateGameState();
            }
        }
    }
    const bestSpot = function(){
        return minimax(Gameboard.get1DGameboard(Gameboard.getGameboard()),GameController.getPlayers().computer).index;
    }
    const AICheckWin = function(board,player){
            if(board[0] === player.getPlayerPiece() && board[1] === player.getPlayerPiece() && board[2] === player.getPlayerPiece()){
                return true;
            }
            if(board[3] === player.getPlayerPiece() && board[4] === player.getPlayerPiece() && board[5] === player.getPlayerPiece()){
                return true;
            }
            if(board[6] === player.getPlayerPiece() && board[7] === player.getPlayerPiece() && board[8] === player.getPlayerPiece()){
                return true;
            }
            if(board[0] === player.getPlayerPiece() && board[3] === player.getPlayerPiece() && board[6] === player.getPlayerPiece()){
                return true;
            }
            if(board[1] === player.getPlayerPiece() && board[4] === player.getPlayerPiece() && board[7] === player.getPlayerPiece()){
                return true;
            }
            if(board[2] === player.getPlayerPiece() && board[5] === player.getPlayerPiece() && board[8] === player.getPlayerPiece()){
                return true;
            }
            if(board[0] === player.getPlayerPiece() && board[4] === player.getPlayerPiece() && board[8] === player.getPlayerPiece()){
                return true;
            }
            if(board[2] === player.getPlayerPiece() && board[4] === player.getPlayerPiece() && board[6] === player.getPlayerPiece()){
                return true;
            }
        return false;
    }

    const minimax = function(board,player){
        //get all empty tiles
        let freeTiles = Gameboard.getFreeTiles(board);
        //check if game is won on new board
        if(AICheckWin(board,GameController.getPlayers().player)){
            return {
                score: -10
            };
        }
        else if(AICheckWin(board,GameController.getPlayers().computer)){
            return {
                score: 10
            };
        }
        else if(freeTiles.length === 0){
            return {
                score: 0
            };
        }
        let moves = [];
        for(let i=0;i<freeTiles.length;i++){
            let move = {};
            move.tile = board[freeTiles[i]];
            move.index = freeTiles[i];
            board[freeTiles[i]] = player.getPlayerPiece();
            if(player === GameController.getPlayers().computer){
                let result = minimax(board,GameController.getPlayers().player);
                move.score = result.score;
            }
            else {
                let result = minimax(board,GameController.getPlayers().computer);
                move.score = result.score;
            }
            board[freeTiles[i]] = move.tile;
            moves.push(move);
        }
        let bestMove;
        if(player === GameController.getPlayers().computer){
            let bestScore = -10000;
            for(let i=0;i<moves.length;i++){
                if(moves[i].score>bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else{
            let bestScore = 10000;
            for(let i=0;i<moves.length;i++){
                if(moves[i].score<bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
    
    return{
        getPlayerPiece,
        computerPlay,
        getPlayerName,
        bestSpot
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
    let difficulty = false; //easy

    const setPlayers = function(playerPiece){
        playerOne = Player(playerPiece,"PLAYER");
        if(playerPiece === "x"){
            computerPlayer = Player("o","COMPUTER");
        }
        if(playerPiece === "o"){
            computerPlayer = Player("x","COMPUTER");
        }
    }
    const setMode = function(mode){
        if(mode === "easy"){
            //set ai mode to easy
            difficulty=false;
        }
        if(mode === "hard"){
            //set ai mode to hard
            difficulty=true;
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
        winner = null;
        gameStart = true;
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
        if(!winner){
            DisplayController.winDisplay("Tie!");
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
        //console.log("player piece: "+playerOne.getPlayerPiece());
        //console.log("opponent: "+computerPlayer.getPlayerPiece());
        return{
            player: playerOne,
            computer: computerPlayer
        }
    }
    const changeTurn = function(){
        playerTurn = !playerTurn;
        if(!playerTurn){
            computerPlay();
        }
    }
    const computerPlay = function(){
        computerPlayer.computerPlay(difficulty);
        console.log(computerPlayer.bestSpot());
        //computerPlayer.playBestMove(playerOne.getPlayerPiece(),computerPlayer.getPlayerPiece());
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
        getWinner,
        setMode
    };
})();

