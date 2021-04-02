//gameboard object with gameboard array - module (IIFE)
const Gameboard = (() =>{
    const playerX = "X";
    const playerO = "O";
    //should be 3x3 array 2D
    let gameboard = [["T","I","C"],
                    ["T","A","C"],
                    ["T","O","E"]];
    const setGameboard = function(x,y,value){
        if(gameboard[x][y] === null){
            //if playerX then place X
            //if playerO then place O
            gameboard[x][y] = value;
        }
        else{
            return;
        }
    }
    const getGameboard = function(){
        return gameboard;
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
            GameController.setGameWin(true);
        }
        if(checkColumn(indexColumn)){
            console.log(`WIN ${indexColumn} column`);
            GameController.setGameWin(true);
        }        
        if(checkDiagonalLeft()){
            console.log(`WIN left`);
            GameController.setGameWin(true);
        }
        if(checkDiagonalRight()){
            console.log(`WIN right`);
            GameController.setGameWin(true);
        }
    }
    const checkTie = function(){
        if(checkGameboardFull() && !GameController.getGameWin()){
            console.log("its a TIE");
        }
    }
    return{
        setGameboard, 
        getGameboard,
        cleanGameboard,
        checkGameboardFull,
        checkWin,
        checkTie
    };
})();
//players objects - factory

const DisplayController = (() =>{
    //shows game state in browser
    const displayedGameboard = document.querySelectorAll(".grid-item");
    const displayGameboardArray = Array.from(displayedGameboard);
    const displayGameboard2DArray = [];

    while(displayGameboardArray.length) {
        displayGameboard2DArray.push(displayGameboardArray.splice(0,Gameboard.getGameboard().length));
    }
    
    for(i=0;i<Gameboard.getGameboard().length;i++){
        for(j=0;j<Gameboard.getGameboard().length;j++){
            displayGameboard2DArray[i][j].textContent = Gameboard.getGameboard()[i][j];
            displayGameboard2DArray[i][j].index = (i+""+j);

            displayGameboard2DArray[i][j].addEventListener("click", function(){
                Gameboard.setGameboard(parseInt(this.index.toString().slice(0,1)), parseInt(this.index.toString().slice(1)),"xd");
                Gameboard.checkWin(parseInt(this.index.toString().slice(0,1)), parseInt(this.index.toString().slice(1)));
                Gameboard.checkTie();
                GameController.updateGameState();
            });
        }
    }
    const refreshDisplay = function(){
        for(i=0;i<Gameboard.getGameboard().length;i++){
            for(j=0;j<Gameboard.getGameboard().length;j++){
                displayGameboard2DArray[i][j].textContent = Gameboard.getGameboard()[i][j];
            }
        }
    }
    return {
        refreshDisplay
    };
})();

//game controller object - module (IIFE)
const GameController = (() =>{
    let gameEnd = false;
    //control the flow of the game
    const updateGameState = function(){
        if(Gameboard.checkGameboardFull()){
            //go to endgame function where winner and end screen is displayed
            Gameboard.cleanGameboard();
        }
        DisplayController.refreshDisplay();
    }
    const endGame = function(){
        //end the game and reset board
    }
    const setGameWin = function(value){
        gameEnd = value;
    }
    const getGameWin = function(){
        return gameEnd;
    }
    return{
        updateGameState,
        endGame,
        setGameWin,
        getGameWin
    };
})();