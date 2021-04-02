let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
let gameContent = document.getElementById("game-content");
let gameButtons = document.getElementById("game-buttons");
let turnHeader;

let tableSize = 3;
let turn;
let onePlayerGame;
let player1;
let player2;
let resultBoard = createBoard();
let players = [];
let turnCount = 0;

function createBoard(){
    let board = new Array(3);
    for(let i = 0 ; i<tableSize; i++){
        board[i] = new Array(3);
        for(let j = 0; j < tableSize; j++){
            board[i][j] = "";
        }
    }
    return board;
}

function openModal(){
    modal.style.display = "block";
    initTable();
    initButtons();
}

span.onclick = function() {
    modal.style.display = "none";
    gameContent.innerHTML = "";
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      gameContent.innerHTML = "";
    }
  }


function initTable(){
    let board = document.createElement("table");
    turnHeader = document.createElement("h2");
    turnHeader.id = "turn-header";
    board.id = "game-table";
    board.setAttribute("border", 1);
    board.setAttribute("cellspacing", 0);
    
    for(let i = 0; i<tableSize; i++){
        let row = document.createElement("tr");
        board.appendChild(row);
        for(let j = 0; j<tableSize; j++){
            let cell = document.createElement("td");
            cell.setAttribute("height", 100);
            cell.setAttribute("width", 100);
            cell.id =  ""+ i + j;
            cell.addEventListener("click", set);
            row.appendChild(cell);
        }
    }
    gameContent.append(turnHeader);
    gameContent.appendChild(board);
}

function set(){
    let i = this.id.charAt(0);
    let j = this.id.charAt(1);
    if(turn != undefined && !turn.computer && !checkIfSet(i, j)){
            this.innerHTML = turn.sign;
            resultBoard[i][j] = turn.sign;
            turnCount++;
             if(isGameOver()){
                clearBoard();
                turn = undefined;
                turnHeader.innerText = "";
            }
            else{
                turn = changeTurn();
                turnHeader.innerText = `Tura gracza ${turn.name}(${turn.sign})`;
                if(onePlayerGame){
                    setTimeout(() => makeComputerTurn(), 3000);
                }
            } 
    } 
}

function makeComputerTurn(){
    let fieldToSet = returnRandomFromArray(getUnsetFields());
    let cell = document.getElementById(fieldToSet);
    cell.innerHTML = turn.sign;
    resultBoard[fieldToSet.charAt(0)][fieldToSet.charAt(1)] = turn.sign;
    turnCount++;
    if(isGameOver()){
        clearBoard();
        turn = undefined;
        turnHeader.innerText = "";
    }
    else{
        turn = changeTurn();
        turnHeader.innerText = `Tura gracza ${turn.name}(${turn.sign})`;
    } 
}

function getUnsetFields(){
    let unsetFields = [];
    for(let i = 0; i<resultBoard.length; i++){
        let row = resultBoard[i];
        for(let j = 0; j < row.length; j++){
            if(row[j] == ""){
                unsetFields.push("" + i + j);
            }
        }
    }
    return unsetFields;
}

function returnRandomFromArray(array){
    return array[Math.floor(Math.random() * array.length)];
}

function changeTurn(){
   let filteredPlayer =  players.filter(player => player.sign != turn.sign);
   if(filteredPlayer.length > 0){
       return filteredPlayer[0];
   }
   throw new Error("Could not filter players");
}

function checkIfSet(i, j){
    if(resultBoard[i][j] != ""){
        return true;
    }
    return false;
}

function isGameOver(){
    let isOver = false;
    for(let i = 0; i < tableSize; i++){
        if(resultBoard[i][0] == turn.sign &&  resultBoard[i][1] == turn.sign && resultBoard[i][2] == turn.sign){
            isOver = true;
        }
    }
    for(let i = 0; i < tableSize; i++){
        if(resultBoard[0][i] == turn.sign &&  resultBoard[1][i] == turn.sign && resultBoard[2][i] == turn.sign){
            isOver = true;
        }
    }

    if(resultBoard[0][0] == turn.sign &&  resultBoard[1][1] == turn.sign &&  resultBoard[2][2] == turn.sign){
        isOver = true;
    }

    if(resultBoard[0][2] == turn.sign && resultBoard[1][1] == turn.sign && resultBoard[2][0] == turn.sign){
        isOver = true;
    }

    if(isOver){
        alert(`${turn.name} wygral!!`);
        return true;
    }
    else if(turnCount == tableSize * tableSize){
        alert("REMIS!!");
        return true;
    }

    return false;
}

function initButtons(){
    let gameButtonsDiv = document.createElement("div");
    gameButtonsDiv.id = "game-buttons";
    gameButtonsDiv.classList.add("game-buttons");
    gameContent.appendChild(gameButtonsDiv);
    let onePlayerButton = document.createElement("button");
    let twoPlayersButton = document.createElement("button");

    onePlayerButton.innerText = "Jeden Gracz";
    twoPlayersButton.innerText = "Dwóch Graczy";

    onePlayerButton.addEventListener('click', startSingleGame);
    twoPlayersButton.addEventListener('click', startTwoPlayersGame);

    onePlayerButton.classList.add("game-button");
    twoPlayersButton.classList.add("game-button");
    
    gameButtonsDiv.appendChild(onePlayerButton);
    gameButtonsDiv.appendChild(twoPlayersButton);
}

function clearBoard(){
    turnCount = 0;
    players = [];
    resultBoard = createBoard();
    let gameTableRows = document.getElementById("game-table").rows;
    for(let i = 0; i<gameTableRows.length; i++){
        let cells = gameTableRows[i].cells;
        for(let j = 0; j<cells.length; j++){
            cells[j].innerText = "";
        }
    }
    
}

function startTwoPlayersGame(){
    clearBoard();
    onePlayerGame = false;
    player1 = {
        name: 'Gracz1',
        sign: 'X',
        computer: false
    };
    player2 = {
        name: 'Gracz2',
        sign: 'O',
        computer: false
    }
    players.push(player1);
    players.push(player2);
    turn = player1;
    turnHeader.innerText = `Tura gracza ${turn.name}(${turn.sign})`;
}

function startSingleGame(){
    clearBoard();
    onePlayerGame = true;
    player1 = {
        name: 'Gracz1',
        sign: 'X',
        computer: false
    };
    player2 = {
        name: 'Komputer',
        sign: 'O',
        computer: true
    };
    players.push(player1);
    players.push(player2);
    turn = player1;
    turnHeader.innerText = `Tura gracza ${turn.name}(${turn.sign})`;
}


