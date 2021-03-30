//gameboard object with gameboard array - module (IIFE)
const Gameboard = (() =>{
    const playerX = "X";
    const playerO = "O";
    //should be 3x3 array 2D
    const gameboardClean = [[null,null,null],
                    [null,null,null],
                    [null,null,null]];
    let gameboard = [[playerX,playerX,playerO],
                    [playerO,playerO,playerX],
                    [playerX,playerO,playerX]];
    let alternatingBool = false;
    const setGameboard = function(x,y,value){
        if(alternatingBool){
            value = "O";
            alternatingBool = false;
        }
        else{
            value = "X";
            alternatingBool = true;
        }
        if(gameboard[x][y] === null){
            //if playerX then place X
            //if playerO then place O
            gameboard[x][y] = value;
            DisplayController.refreshDisplay();
        }
        else{
            return;
        }
        GameController.updateGameState();
    }
    const getGameboard = function(){
        return gameboard;
    }
    const checkGameboardFull = function(){
        gameboard.forEach(element => {
            if(element===null){
                return false;
            }
        });
        return true;
    }
    const cleanGameboard = function(){
        gameboard = gameboardClean;
    }
    return{
        setGameboard, 
        getGameboard,
        cleanGameboard,
        checkGameboardFull
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
            });
        }
    }
    /*Gameboard.getGameboard().addEventListener("change", function(){
        console.log("here?");
        refreshDisplay();
    })*/
    
    /*displayGameboard2DArray.forEach(gridRow => {
        gridRow.forEach(gridItem => {
            console.log(gridItem);
            gridItem.textContent = "X";
        });
    });*/
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
    //control the flow of the game
    const updateGameState = function(){
        if(Gameboard.checkGameboardFull()){
            Gameboard.cleanGameboard();
            DisplayController.refreshDisplay();
        }
    }
    updateGameState();
    return{
        updateGameState
    };
})();